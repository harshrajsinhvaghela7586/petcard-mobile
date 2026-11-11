import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Task } from "./petcardApi";
import { getReminderPrefs, TONES, VIBRATE_PATTERNS, type ReminderPrefs } from "./reminderPrefs";

/**
 * Task reminders (device alarms).
 *  - Once      -> us date + time pe ek baar
 *  - Every Day -> roz us time pe
 *  - Weekly    -> sirf select kiye din (daysOfWeek) pe
 * `minutesBefore` minutes pehle ring hoti hai. Expo weekday: 1 = Sunday ... 7 = Saturday.
 */
const CHANNEL_BASE = "task-reminders";
/* Android fixes a channel's sound once created, so every tone + vibration pair gets its own channel. */
const channelFor = (p: ReminderPrefs) => `${CHANNEL_BASE}-${p.tone}-${p.vibrate}`;

Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

const soundFile = (p: ReminderPrefs) => TONES.find((t) => t.key === p.tone)?.file ?? null;

export async function ensureReminderPermission(prefs?: ReminderPrefs): Promise<boolean> {
    const p = prefs ?? (await getReminderPrefs());
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(channelFor(p), {
            name: `Task reminders (${TONES.find((t) => t.key === p.tone)?.label ?? "System default"})`,
            importance: Notifications.AndroidImportance.HIGH,
            sound: soundFile(p) ?? "default",
            vibrationPattern: VIBRATE_PATTERNS[p.vibrate],
            enableVibrate: p.vibrate !== "off",
        }).catch(() => {});
    }
    const cur = await Notifications.getPermissionsAsync();
    if (cur.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
}

const idKey = (taskId: string) => `task-${taskId}`;

export async function cancelTaskReminders(taskId: string) {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        all.filter((n) => String(n.content.data?.key) === idKey(taskId)).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
}

type Opts = { minutesBefore: number; petName?: string; vibrate?: boolean };

/** Returns true if at least one alarm was scheduled. */
export async function scheduleTaskReminders(
    task: Pick<Task, "id" | "title" | "timeOfDay" | "recurrence">,
    opts: Opts
): Promise<boolean> {
    const rec = task.recurrence;
    if (!task.timeOfDay || !rec) return false;
    const prefs = await getReminderPrefs();
    if (!(await ensureReminderPermission(prefs))) return false;
    await cancelTaskReminders(task.id);

    const [h, m] = task.timeOfDay.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return false;

    const content = {
        title: task.title,
        body: `${opts.petName ? `${opts.petName}: ` : ""}${task.title}${opts.minutesBefore ? ` in ${opts.minutesBefore} min` : " now"}`,
        sound: (soundFile(prefs) ?? "default") as string,
        data: { key: idKey(task.id), taskId: task.id },
    };
    const channelId = Platform.OS === "android" ? channelFor(prefs) : undefined;
    const T = Notifications.SchedulableTriggerInputTypes;

    /* Task time (on a given calendar day) minus minutesBefore, as a real Date -> handles midnight rollover */
    const alarmFor = (day: Date) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m - opts.minutesBefore, 0, 0);

    if (rec.type === "daily") {
        const a = alarmFor(new Date());
        await Notifications.scheduleNotificationAsync({ content, trigger: { type: T.DAILY, hour: a.getHours(), minute: a.getMinutes(), channelId } });
        return true;
    }

    if (rec.type === "weekly") {
        const days = rec.daysOfWeek?.length ? rec.daysOfWeek : [new Date(`${rec.startDate}T00:00:00`).getDay()];
        const now = new Date();
        for (const d of days) {
            // is hafte ka `d` weekday (0=Sun) ki date nikalo, uska alarm time lo, aur us alarm ka asli weekday use karo
            const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + ((d - now.getDay() + 7) % 7));
            const a = alarmFor(day);
            await Notifications.scheduleNotificationAsync({
                content,
                trigger: { type: T.WEEKLY, weekday: a.getDay() + 1, hour: a.getHours(), minute: a.getMinutes(), channelId },
            });
        }
        return true;
    }

    const at = alarmFor(new Date(`${rec.startDate}T00:00:00`));
    if (at.getTime() <= Date.now()) return false;
    await Notifications.scheduleNotificationAsync({ content, trigger: { type: T.DATE, date: at, channelId } });
    return true;
}


/** Silences every local reminder of a pet's tasks (used when the pet is removed). */
export async function cancelRemindersForTasks(taskIds: string[]) {
    if (!taskIds.length) return;
    const keys = new Set(taskIds.map(idKey));
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        all.filter((n) => keys.has(String(n.content.data?.key))).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
}
