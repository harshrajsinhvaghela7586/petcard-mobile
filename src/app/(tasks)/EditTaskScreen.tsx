import { appAlert } from "@/components/AppDialog";
import React, { useEffect, useState } from "react";
import { petcardApi, Task } from "@/services/petcardApi";
import { petImageSource } from "@/services/stickerImage";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import TimeWheelModal, { formatTime, to24h, TimeValue } from "@/components/TimeWheel";
import { scheduleTaskReminders, cancelTaskReminders } from "@/services/taskReminders";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { ActivityIndicator } from "react-native";
import { useRequirePermission } from "@/hooks/use-require-permission";

const { width, height } = Dimensions.get("window");

/* label -> backend category (Home ke Food / Water / Activity counts yahi categories use karte hain) */
const CATEGORIES: { label: string; value: string }[] = [
    { label: "Food", value: "food" },
    { label: "Water", value: "water" },
    { label: "Walk", value: "walk" },
    { label: "Play", value: "play" },
    { label: "Grooming", value: "grooming" },
    { label: "Training", value: "training" },
    { label: "Medication", value: "medication" },
    { label: "Vet", value: "vet" },
    { label: "Other", value: "other" },
];
const REPEATS = ["Once", "Every Day", "Every Week", "Custom Days"];
const REMINDERS: { label: string; minutes: number | null }[] = [
    { label: "No reminder", minutes: null },
    { label: "At time", minutes: 0 },
    { label: "5 min before", minutes: 5 },
    { label: "10 min before", minutes: 10 },
    { label: "15 min before", minutes: 15 },
    { label: "30 min before", minutes: 30 },
    { label: "1 hour before", minutes: 60 },
];
/* index = Date.getDay() (0 = Sunday), same as backend daysOfWeek */
const DAYS = [
    { i: 1, l: "Monday" }, { i: 2, l: "Tuesday" }, { i: 3, l: "Wednesday" }, { i: 4, l: "Thursday" },
    { i: 5, l: "Friday" }, { i: 6, l: "Saturday" }, { i: 0, l: "Sunday" },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type DropKey = "category" | "repeat" | "reminder";

/* ---------- one field card (icon + label + content) ---------- */
function Field({
    icon, tint, label, children, trailing, onPress, options, selected, onPick,
}: {
    icon: string; tint: string; label: string; children: React.ReactNode; trailing?: React.ReactNode;
    onPress?: () => void; options?: string[]; selected?: string; onPick?: (v: string) => void;
}) {
    return (
        <View style={styles.field}>
            <Pressable onPress={onPress} disabled={!onPress} style={styles.fieldRow}>
                <View style={[styles.fieldIcon, { backgroundColor: tint }]}>
                    <MaterialCommunityIcons name={icon as any} size={s(20)} color={C.brown} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel} maxFontSizeMultiplier={1.1}>{label}</Text>
                    {children}
                </View>
                {trailing}
            </Pressable>

            {options ? (
                <View style={styles.options}>
                    {options.map((o) => {
                        const on = o === selected;
                        return (
                            <Pressable key={o} onPress={() => onPick?.(o)} style={[styles.option, on && styles.optionOn]}>
                                <Text style={[styles.optionText, on && styles.optionTextOn]} maxFontSizeMultiplier={1.1}>{o}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
}

const chevron = (open: boolean) => <Ionicons name={open ? "chevron-up" : "chevron-down"} size={s(18)} color={C.muted} />;

const parseTime = (hhmm?: string | null): TimeValue => {
    const [h, m] = String(hhmm || "18:00").split(":").map(Number);
    const hh = Number.isFinite(h) ? h : 18;
    return { h12: hh % 12 || 12, minute: Number.isFinite(m) ? m : 0, meridiem: hh >= 12 ? "PM" : "AM" };
};
const parseDate = (key?: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || "");
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();
};
const reminderLabelFor = (minutes: number) =>
    REMINDERS.find((r) => r.minutes === minutes)?.label ?? `${minutes} min before`;

export default function EditTaskScreen() {
    const [fontsLoaded] = useAppFonts();
    const { task: taskId, mode } = useLocalSearchParams<{ task?: string; mode?: string }>();
    const { pet, loading: petLoading } = useSelectedPet();
    const reschedule = mode === "reschedule";

    const [loadingTask, setLoadingTask] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState<DropKey | null>(null);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(() => new Date());
    const [time, setTime] = useState<TimeValue>({ h12: 6, minute: 0, meridiem: "PM" });
    const [repeat, setRepeat] = useState("Every Day");
    const [days, setDays] = useState<number[]>([]);
    const [reminder, setReminder] = useState("No reminder");
    const [reminderOptions, setReminderOptions] = useState<string[]>(REMINDERS.map((r) => r.label));
    const [saving, setSaving] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [iosDateOpen, setIosDateOpen] = useState(false);

    const allowed = useRequirePermission(pet, "manage_tasks", !petLoading);

    useEffect(() => {
        if (!pet?.id || !taskId) return;
        let alive = true;
        (async () => {
            try {
                const result = await petcardApi.listAllTasks(pet.id);
                const found = (result.tasks ?? []).find((item: Task) => item.id === taskId);
                if (!found) throw new Error("This task could not be found.");
                if (!alive) return;
                const rec = found.recurrence;
                setCategory(found.category);
                setName(found.title);
                setNote(found.note ?? "");
                setDate(parseDate(rec?.startDate));
                setTime(parseTime(found.timeOfDay));
                if (rec?.type === "once") setRepeat("Once");
                else if (rec?.type === "weekly") {
                    const d = rec.daysOfWeek ?? [];
                    setRepeat(d.length > 1 ? "Custom Days" : "Every Week");
                    setDays(d);
                } else setRepeat("Every Day");
                const rem = found.reminder;
                if (rem && rem.enabled && found.timeOfDay) {
                    const label = reminderLabelFor(rem.minutesBefore ?? 0);
                    setReminder(label);
                    setReminderOptions(REMINDERS.some((r) => r.label === label) ? REMINDERS.map((r) => r.label) : [...REMINDERS.map((r) => r.label), label]);
                } else setReminder("No reminder");
                setLoaded(true);
            } catch (error) {
                if (alive) appAlert("Couldn't load task", error instanceof Error ? error.message : "Please try again.");
            } finally { if (alive) setLoadingTask(false); }
        })();
        return () => { alive = false; };
    }, [pet?.id, taskId]);

    if (!fontsLoaded || !allowed) return null;

    const reminderMinutes = reminderOptions.includes(reminder)
        ? (REMINDERS.find((r) => r.label === reminder)?.minutes ?? (reminder === "No reminder" ? null : parseInt(reminder, 10) || 0))
        : null;
    const showDays = repeat === "Every Week" || repeat === "Custom Days";
    const toggle = (k: DropKey) => setOpen((p) => (p === k ? null : k));
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const minDate = date < today ? date : today;

    const openDate = () => {
        if (Platform.OS === "android") {
            DateTimePickerAndroid.open({
                value: date, mode: "date", minimumDate: minDate,
                onChange: (_e, picked) => { if (picked) setDate(picked); },
            });
        } else setIosDateOpen(true);
    };

    const toggleDay = (i: number) => setDays((p) => (p.includes(i) ? p.filter((d) => d !== i) : [...p, i]));

    const save = async () => {
        if (saving || !pet?.id || !taskId || !loaded) return;
        const problem = !category ? "Please choose the task category"
            : !name.trim() ? "Please write the task name"
            : (repeat === "Custom Days" && days.length === 0) ? "Please select at least one day for the reminder"
            : null;
        if (problem) { appAlert("Details missing", problem); return; }
        setSaving(true);
        try {
            const timeOfDay = to24h(time.h12, time.minute, time.meridiem);
            const recurrenceType = repeat === "Once" ? "once" : repeat === "Every Day" ? "daily" : "weekly";
            const daysOfWeek = recurrenceType === "weekly" ? (days.length ? [...days].sort((a, b) => a - b) : [date.getDay()]) : [];
            const recurrence = { type: recurrenceType, daysOfWeek, startDate: isoDate(date) };
            const updated = await petcardApi.updateTask(pet.id, taskId, {
                title: name.trim(),
                category,
                note: note.trim(),
                timeOfDay,
                recurrence,
                reminder: { enabled: reminderMinutes !== null, minutesBefore: reminderMinutes ?? 0 },
            });
            // Old device alarms are replaced by the edited ones.
            await cancelTaskReminders(taskId).catch(() => {});
            if (reminderMinutes !== null) {
                scheduleTaskReminders(
                    { id: taskId, title: name.trim(), timeOfDay: updated?.task?.timeOfDay ?? timeOfDay, recurrence },
                    { minutesBefore: reminderMinutes, petName: pet.name }
                ).catch(() => {});
            }
            router.replace("/TasksScreen" as any);
        } catch (error) {
            appAlert("Couldn't save task", error instanceof Error ? error.message : "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <PawBackground />
            <ScreenHeader title={reschedule ? "Reschedule Task" : "Edit Task"} />

            {loadingTask ? (
                <View style={{ padding: 40, alignItems: "center" }}>
                    <ActivityIndicator color={C.orange} />
                    <Text style={{ color: C.muted, marginTop: 8 }}>Loading task...</Text>
                </View>
            ) : !loaded ? (
                <Text style={{ color: C.muted, padding: 24 }}>Task details are unavailable.</Text>
            ) : (
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: s(20) }}>
                <View style={styles.mascot}>
                    <Image source={petImageSource(pet)} resizeMode="contain" style={styles.dog} />
                </View>

                <View style={{ paddingHorizontal: SIDE }}>
                    <Field
                        icon="view-grid-outline" tint="#F3EAFF" label="Category"
                        onPress={() => toggle("category")} trailing={chevron(open === "category")}
                        options={open === "category" ? CATEGORIES.map((c) => c.label) : undefined}
                        selected={CATEGORIES.find((c) => c.value === category)?.label}
                        onPick={(v) => { setCategory(CATEGORIES.find((c) => c.label === v)?.value ?? "other"); setOpen(null); }}
                    >
                        <Text style={[styles.fieldValue, !category && { color: C.muted }]} maxFontSizeMultiplier={1.1}>
                            {CATEGORIES.find((c) => c.value === category)?.label || category || "Select category"}
                        </Text>
                    </Field>

                    <Field icon="square-edit-outline" tint="#E8E4FF" label="Task Name">
                        <TextInput value={name} onChangeText={setName} placeholder="Eg. Evening Walk"
                            placeholderTextColor={C.muted} maxLength={60} maxFontSizeMultiplier={1.1} style={styles.input} />
                    </Field>

                    <Field icon="text-box-outline" tint="#E8E4FF" label="Note (optional)">
                        <TextInput value={note} onChangeText={setNote} placeholder="Add a note"
                            placeholderTextColor={C.muted} maxLength={300} multiline maxFontSizeMultiplier={1.1} style={styles.input} />
                    </Field>

                    <Field icon="calendar-blank-outline" tint="#FFF0D6" label="Date" onPress={openDate} trailing={chevron(false)}>
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{fmtDate(date)}</Text>
                    </Field>

                    <Field icon="clock-outline" tint="#FFF0D6" label="Time" onPress={() => setTimeOpen(true)} trailing={chevron(false)}>
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{formatTime(time.h12, time.minute, time.meridiem)}</Text>
                    </Field>

                    <Field
                        icon="repeat" tint="#FFF0D6" label="Repeat"
                        onPress={() => toggle("repeat")} trailing={chevron(open === "repeat")}
                        options={open === "repeat" ? REPEATS : undefined} selected={repeat}
                        onPick={(v) => { setRepeat(v); if (v === "Every Day" || v === "Once") setDays([]); setOpen(null); }}
                    >
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>
                            {repeat === "Custom Days" && days.length ? `${days.length} day${days.length > 1 ? "s" : ""} / week` : repeat}
                        </Text>
                    </Field>

                    {showDays ? (
                        <View style={styles.field}>
                            <Text style={[styles.fieldLabel, { padding: s(10), paddingBottom: s(2) }]} maxFontSizeMultiplier={1.1}>Remind me on</Text>
                            {DAYS.map((d, idx) => (
                                <View key={d.i} style={[styles.dayRow, idx > 0 && styles.dayRowBorder]}>
                                    <Text style={styles.dayLabel} maxFontSizeMultiplier={1.1}>{d.l}</Text>
                                    <Switch
                                        value={days.includes(d.i)}
                                        onValueChange={() => toggleDay(d.i)}
                                        trackColor={{ false: C.divider, true: C.peach }}
                                        thumbColor={days.includes(d.i) ? C.orange : "#FFFFFF"}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : null}

                    <Field
                        icon="bell-outline" tint="#FFF0D6" label="Reminder"
                        onPress={() => toggle("reminder")} trailing={chevron(open === "reminder")}
                        options={open === "reminder" ? reminderOptions : undefined} selected={reminder}
                        onPick={(v) => { setReminder(v); setOpen(null); }}
                    >
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{reminder}</Text>
                    </Field>
                </View>
            </ScrollView>
            )}

            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title={saving ? "Saving..." : "Save Changes"}
                        onPress={save}
                        disabled={saving || petLoading || !loaded}
                        icon={<Image source={require("../../../assets/images/paw-white.png")} resizeMode="contain" style={styles.buttonPaw} />}
                    />
                </View>
            </View>

            <TimeWheelModal visible={timeOpen} initial={time} onClose={() => setTimeOpen(false)}
                onConfirm={(v) => { setTime(v); setTimeOpen(false); }} />

            {Platform.OS === "ios" ? (
                <Modal visible={iosDateOpen} transparent animationType="slide" onRequestClose={() => setIosDateOpen(false)}>
                    <Pressable style={styles.sheetBackdrop} onPress={() => setIosDateOpen(false)} />
                    <View style={styles.sheet}>
                        <DateTimePicker value={date} mode="date" display="inline" minimumDate={minDate} accentColor={C.orange}
                            onChange={(_e, picked) => { if (picked) setDate(picked); }} />
                        <PrimaryButton title="Done" onPress={() => setIosDateOpen(false)} />
                    </View>
                </Modal>
            ) : null}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    mascot: { height: s(150), alignItems: "center", justifyContent: "flex-end", marginBottom: s(8) },
    dog: { width: s(130), height: s(130) },
    bubble: {
        position: "absolute",
        width: s(34),
        height: s(34),
        borderRadius: s(17),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },

    field: {
        marginBottom: s(10),
        borderRadius: s(12),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(2) },
        shadowOpacity: 0.06,
        shadowRadius: s(4),
        elevation: 1,
    },
    fieldRow: { flexDirection: "row", alignItems: "center", gap: s(12), padding: s(10) },
    fieldIcon: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        alignItems: "center",
        justifyContent: "center",
    },
    fieldLabel: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    fieldValue: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(2) },
    input: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.brown,
        padding: 0,
        marginTop: s(2),
    },

    dayRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: s(12), paddingVertical: s(4) },
    dayRowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    dayLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    sheetBackdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(16), paddingBottom: s(28), gap: s(8) },

    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: s(8),
        paddingHorizontal: s(10),
        paddingBottom: s(10),
        paddingTop: s(2),
    },
    option: {
        paddingHorizontal: s(12),
        paddingVertical: s(6),
        borderRadius: s(14),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    optionOn: { backgroundColor: C.orange, borderColor: C.orange },
    optionText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    optionTextOn: { color: C.white },

    /* bottom button: same as PetTypeScreen */
    bottomSection: {
        paddingHorizontal: width * 0.02,
        paddingTop: s(8),
        paddingBottom: height * 0.038,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
    },
    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },
});