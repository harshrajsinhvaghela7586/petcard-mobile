import { Alert } from "react-native";
import { api } from "./apiClient";
import { petcardTodayKey } from "./petcardApi";

/**
 * Daily Food / Water / Activity / Clicker / Whistle logs.
 * Source of truth = backend DB (TrackerEntry). Nothing is kept only on the device.
 *
 * Real backend routes (backend/src/routes, mounted at /api/pets/:petId/tracker):
 *   GET    /summary?date=            -> totals, goals, careScore, entries, counters
 *   POST   /entries                  { kind: food|water|activity, title, amount, time?, date }
 *   DELETE /entries/:entryId
 *   POST   /counters/:kind           { label, count, time?, date }   kind = clicker | whistle
 *   DELETE /counters/:kind?date=     resets the day's counter
 */
export type TrackerKind = "food" | "water" | "activity" | "clicks" | "whistles";
export type TrackerEntry = { id: string; time: string; label?: string; amount: number };
export type DayLog = Record<TrackerKind, TrackerEntry[]>;

type Row = { id: string; time: string | null; title: string; amount: number };
type Counter = { id: string; label: string; count: number; lastTime: string | null };

export type TrackerSummary = {
    date: string;
    goals: { foodGrams: number; waterMl: number; activityMin: number; mealsPerDay: number };
    totals: {
        food: { amount: number; goal: number; progress: number };
        water: { amount: number; goal: number; progress: number };
        activity: { amount: number; goal: number; progress: number };
    };
    careScore: {
        score: number;
        label: { key: string; text: string };
        breakdown: { nutrition: number; hydration: number; activity: number };
        tip: string;
    };
    entries?: { food: Row[]; water: Row[]; activity: Row[] };
    counters?: { clicker: Counter[]; whistle: Counter[] };
};

export const emptyDay = (): DayLog => ({ food: [], water: [], activity: [], clicks: [], whistles: [] });

const base = (petId: string) => `/api/pets/${encodeURIComponent(petId)}/tracker`;
const COUNTER = { clicks: "clicker", whistles: "whistle" } as const;
const DEFAULT_LABEL = { food: "Meal", water: "Water", activity: "Activity" } as const;
const MAX_COUNTER_ROWS = 1000;

/* Backend wants HH:mm (24h). "08:30 AM" -> "08:30". Anything unreadable -> null. */
const to24 = (t?: string | null): string | null => {
    if (!t) return null;
    const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let h = Number(m[1]);
    const ap = m[3]?.toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h > 23 ? null : `${String(h).padStart(2, "0")}:${m[2]}`;
};

const toEntry = (r: Row): TrackerEntry => ({ id: r.id, time: r.time ?? "", label: r.title || undefined, amount: r.amount });

/* Clicker / whistle are stored as one counter per (day, label); the screens show one row per tap, so expand them. */
const expand = (counters: Counter[] = []): TrackerEntry[] =>
    counters
        .flatMap((c) => Array.from({ length: Math.min(c.count, MAX_COUNTER_ROWS) }, (_, i) => ({ id: `${c.id}:${i}`, time: c.lastTime ?? "", label: c.label, amount: 1 })))
        .slice(0, MAX_COUNTER_ROWS);

export const summaryToDay = (s: TrackerSummary): DayLog => ({
    food: (s.entries?.food ?? []).map(toEntry),
    water: (s.entries?.water ?? []).map(toEntry),
    activity: (s.entries?.activity ?? []).map(toEntry),
    clicks: expand(s.counters?.clicker),
    whistles: expand(s.counters?.whistle),
});

const tapCounter = (petId: string, kind: "clicks" | "whistles", date: string, label: string, count: number, time: string | null) =>
    api(`${base(petId)}/counters/${COUNTER[kind]}`, { method: "POST", body: { label, count, time, date } });

const fail = (title: string, error: unknown) =>
    Alert.alert(title, error instanceof Error ? error.message : "Please check your connection and try again.");

export const trackerStore = {
    today: petcardTodayKey,

    /** Day log + the server's goals and care score (use this for Home and Care Score). */
    async loadFull(petId: string, date = petcardTodayKey()): Promise<{ day: DayLog; summary: TrackerSummary | null }> {
        try {
            const summary = await api<TrackerSummary>(`${base(petId)}/summary?date=${date}`);
            return { day: summaryToDay(summary), summary };
        } catch {
            return { day: emptyDay(), summary: null };
        }
    },

    async load(petId: string, date = petcardTodayKey()): Promise<DayLog> {
        return (await trackerStore.loadFull(petId, date)).day;
    },

    async add(petId: string, date: string, day: DayLog, kind: TrackerKind, entry: TrackerEntry): Promise<DayLog> {
        try {
            if (kind === "clicks" || kind === "whistles") {
                await tapCounter(petId, kind, date, entry.label || "General", Math.min(20, Math.max(1, Math.round(entry.amount) || 1)), to24(entry.time));
                return await trackerStore.load(petId, date);
            }
            const res = await api<{ entry: Row }>(`${base(petId)}/entries`, {
                method: "POST",
                body: { kind, title: entry.label || DEFAULT_LABEL[kind], amount: Math.round(entry.amount), time: to24(entry.time), date },
            });
            return { ...day, [kind]: [toEntry(res.entry), ...day[kind]] } as DayLog;
        } catch (error) {
            fail("Couldn't save", error);
            return day;
        }
    },

    async remove(petId: string, date: string, day: DayLog, kind: TrackerKind, id: string): Promise<DayLog> {
        try {
            if (kind === "clicks" || kind === "whistles") {
                // Counters cannot be decremented: reset the day and re-apply what is left.
                const rest = day[kind].filter((e) => e.id !== id);
                await api(`${base(petId)}/counters/${COUNTER[kind]}?date=${date}`, { method: "DELETE" });
                const byLabel = new Map<string, { n: number; time: string }>();
                rest.forEach((e) => {
                    const k = e.label || "General";
                    byLabel.set(k, { n: (byLabel.get(k)?.n ?? 0) + 1, time: byLabel.get(k)?.time || e.time });
                });
                for (const [label, { n, time }] of byLabel) {
                    for (let left = n; left > 0; left -= 20) await tapCounter(petId, kind, date, label, Math.min(20, left), to24(time));
                }
                return { ...day, [kind]: rest } as DayLog;
            }
            await api(`${base(petId)}/entries/${encodeURIComponent(id)}`, { method: "DELETE" });
            return { ...day, [kind]: day[kind].filter((e) => e.id !== id) } as DayLog;
        } catch (error) {
            fail("Couldn't delete", error);
            return day;
        }
    },
};

/* ---- Kept only so existing imports keep compiling. The server's goals and score are the real ones. ---- */
export const GOALS: Record<string, { food: number; water: number; activity: number }> = {
    dog: { food: 300, water: 500, activity: 60 },
    cat: { food: 100, water: 250, activity: 30 },
    rabbit: { food: 150, water: 300, activity: 45 },
};
export const goalsFor = (type?: string | null) => GOALS[(type || "dog").toLowerCase()] ?? GOALS.dog;
export const sum = (list: TrackerEntry[]) => list.reduce((a, e) => a + e.amount, 0);

/** @deprecated Local estimate only. Use `summary.careScore` from the server. */
export function careScore(day: DayLog, type?: string | null) {
    const g = goalsFor(type);
    const pct = (v: number, goal: number) => Math.min(100, Math.round((v / goal) * 100));
    const food = pct(sum(day.food), g.food);
    const water = pct(sum(day.water), g.water);
    const activity = pct(sum(day.activity), g.activity);
    return { food, water, activity, score: Math.round((food + water + activity) / 3) };
}

export const newId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;