import * as SecureStore from "expo-secure-store";

/** Reminder tone + vibration chosen in Settings > Reminders & Alerts. Stored on the device. */
export const TONES = [
    { key: "system", label: "System default", file: null },
    { key: "chime", label: "Chime", file: "tone_chime.wav" },
    { key: "bell", label: "Bell", file: "tone_bell.wav" },
    { key: "pop", label: "Pop", file: "tone_pop.wav" },
    { key: "marimba", label: "Marimba", file: "tone_marimba.wav" },
    { key: "alert", label: "Alert", file: "tone_alert.wav" },
] as const;
export type ToneKey = (typeof TONES)[number]["key"];
export type VibrateKey = "off" | "default" | "short" | "long";

export const VIBRATE_PATTERNS: Record<VibrateKey, number[]> = {
    off: [0],
    default: [0, 400, 200, 400],
    short: [0, 120],
    long: [0, 1000],
};

const KEY = "petcard.reminderPrefs.v1";
export type ReminderPrefs = { tone: ToneKey; vibrate: VibrateKey };
const DEFAULTS: ReminderPrefs = { tone: "system", vibrate: "default" };

export async function getReminderPrefs(): Promise<ReminderPrefs> {
    try {
        const raw = await SecureStore.getItemAsync(KEY);
        const v = raw ? JSON.parse(raw) : {};
        return {
            tone: TONES.some((t) => t.key === v.tone) ? v.tone : DEFAULTS.tone,
            vibrate: v.vibrate in VIBRATE_PATTERNS ? v.vibrate : DEFAULTS.vibrate,
        };
    } catch {
        return DEFAULTS;
    }
}

export async function saveReminderPrefs(patch: Partial<ReminderPrefs>): Promise<ReminderPrefs> {
    const next = { ...(await getReminderPrefs()), ...patch };
    await SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => {});
    return next;
}

/** Plays a short preview of a bundled tone. Needs `npx expo install expo-audio`; silently does nothing without it. */
const SOURCES: Record<string, any> = {
    chime: () => require("../../assets/sounds/tone_chime.wav"),
    bell: () => require("../../assets/sounds/tone_bell.wav"),
    pop: () => require("../../assets/sounds/tone_pop.wav"),
    marimba: () => require("../../assets/sounds/tone_marimba.wav"),
    alert: () => require("../../assets/sounds/tone_alert.wav"),
};
let player: any = null;
export function previewTone(key: ToneKey) {
    try {
        const src = SOURCES[key];
        if (!src) return;
        const audio = require("expo-audio");
        audio.setAudioModeAsync?.({ playsInSilentMode: true, interruptionMode: "mixWithOthers" })?.catch?.(() => {});
        player?.remove?.();
        player = audio.createAudioPlayer(src());
        player.volume = 1;
        player.play();
    } catch {
        /* expo-audio not installed */
    }
}
