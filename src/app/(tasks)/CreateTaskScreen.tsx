import React, { useState } from "react";
import { Alert } from "react-native";
import { petcardApi } from "@/services/petcardApi";
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
import { router } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import NoPetPopup from "@/components/NoPetPopup";
import TimeWheelModal, { formatTime, to24h } from "@/components/TimeWheel";
import { scheduleTaskReminders } from "@/services/taskReminders";
import { useSelectedPet } from "@/hooks/use-selected-pet";

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

export default function CreateTaskScreen() {
    const [fontsLoaded] = useAppFonts();
    const { pet, hasPet, loading: petLoading } = useSelectedPet();

    const [open, setOpen] = useState<DropKey | null>(null);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState(() => new Date());
    const [time, setTime] = useState<{ h12: number; minute: number; meridiem: "AM" | "PM" }>({ h12: 6, minute: 0, meridiem: "PM" });
    const [repeat, setRepeat] = useState("Every Day");
    const [days, setDays] = useState<number[]>([]);
    const [reminder, setReminder] = useState("10 min before");
    const [saving, setSaving] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [iosDateOpen, setIosDateOpen] = useState(false);

    if (!fontsLoaded) return null;

    const reminderMinutes = REMINDERS.find((r) => r.label === reminder)?.minutes ?? null;
    const showDays = repeat === "Every Week" || repeat === "Custom Days";
    const canSave = hasPet && name.trim().length > 0 && category.length > 0 && (!showDays || days.length > 0 || repeat === "Every Week");
    const toggle = (k: DropKey) => setOpen((p) => (p === k ? null : k));
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const openDate = () => {
        if (Platform.OS === "android") {
            DateTimePickerAndroid.open({
                value: date, mode: "date", minimumDate: today,
                onChange: (_e, picked) => { if (picked) setDate(picked); },
            });
        } else setIosDateOpen(true);
    };

    const toggleDay = (i: number) => setDays((p) => (p.includes(i) ? p.filter((d) => d !== i) : [...p, i]));

    const save = async () => {
        if (saving) return;
        if (!pet?.id) {
            Alert.alert("Pet profile required", "Please finish setting up your pet before creating a task.");
            return;
        }
        const problem = !category ? "Please choose the task category"
            : !name.trim() ? "Please write the task name"
            : (repeat === "Custom Days" && days.length === 0) ? "Please select at least one day for the reminder"
            : null;
        if (problem) { Alert.alert("Details missing", problem); return; }
        if (!canSave) return;
        setSaving(true);
        try {
            const timeOfDay = to24h(time.h12, time.minute, time.meridiem);
            const recurrenceType = repeat === "Once" ? "once" : repeat === "Every Day" ? "daily" : "weekly";
            const daysOfWeek = recurrenceType === "weekly" ? (days.length ? [...days].sort() : [date.getDay()]) : [];
            const created = await petcardApi.createTask(pet.id, {
                title: name.trim(),
                category,
                note: "",
                timeOfDay,
                recurrence: { type: recurrenceType, daysOfWeek, startDate: isoDate(date) },
                // minutes before task time; null => reminder off. Backend uses this to schedule the alert.
                reminder: { enabled: reminderMinutes !== null, minutesBefore: reminderMinutes ?? 0 },
            });
            // Device alarm: ring + vibrate at (task time - reminder minutes), on the chosen days only.
            if (reminderMinutes !== null && created?.task?.id) {
                scheduleTaskReminders(
                    { id: created.task.id, title: name.trim(), timeOfDay, recurrence: { type: recurrenceType, daysOfWeek, startDate: isoDate(date) } },
                    { minutesBefore: reminderMinutes, petName: pet.name }
                ).catch(() => {});
            }
            // XP is intentionally not sent: the backend owns all reward values.
            router.replace("/TasksScreen" as any);
        } catch (error) {
            Alert.alert("Couldn't save task", error instanceof Error ? error.message : "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <PawBackground />
            <ScreenHeader title="Create New Task" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: s(20) }}
            >
                {/* MASCOT */}
                <View style={styles.mascot}>
                    <View style={[styles.bubble, { top: s(14), left: s(70) }]}>
                        <MaterialCommunityIcons name="heart" size={s(16)} color={C.red} />
                    </View>
                    <View style={[styles.bubble, { top: s(8), right: s(76) }]}>
                        <MaterialCommunityIcons name="bone" size={s(16)} color={C.orange} />
                    </View>
                    <View style={[styles.bubble, { top: s(60), left: s(44) }]}>
                        <MaterialCommunityIcons name="bandage" size={s(16)} color="#E4566C" />
                    </View>
                    <View style={[styles.bubble, { top: s(56), right: s(46) }]}>
                        <MaterialCommunityIcons name="flower" size={s(16)} color={C.red} />
                    </View>
                    <Image
                        source={require("../../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.dog}
                    />
                </View>

                {/* FIELDS */}
                <View style={{ paddingHorizontal: SIDE }}>
                    <Field
                        icon="view-grid-outline" tint="#F3EAFF" label="Category"
                        onPress={() => toggle("category")} trailing={chevron(open === "category")}
                        options={open === "category" ? CATEGORIES.map((c) => c.label) : undefined}
                        selected={CATEGORIES.find((c) => c.value === category)?.label}
                        onPick={(v) => { setCategory(CATEGORIES.find((c) => c.label === v)?.value ?? "other"); setOpen(null); }}
                    >
                        <Text style={[styles.fieldValue, !category && { color: C.muted }]} maxFontSizeMultiplier={1.1}>
                            {CATEGORIES.find((c) => c.value === category)?.label || "Select category"}
                        </Text>
                    </Field>

                    <Field icon="square-edit-outline" tint="#E8E4FF" label="Task Name">
                        <TextInput
                            value={name} onChangeText={setName} placeholder="Eg. Evening Walk"
                            placeholderTextColor={C.muted} maxLength={60} maxFontSizeMultiplier={1.1} style={styles.input}
                        />
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
                        onPick={(v) => { setRepeat(v); if (v === "Every Day") setDays([]); setOpen(null); }}
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
                        options={open === "reminder" ? REMINDERS.map((r) => r.label) : undefined} selected={reminder}
                        onPick={(v) => { setReminder(v); setOpen(null); }}
                    >
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{reminder}</Text>
                    </Field>

                    <Field icon="star" tint="#FFF0D6" label="XP reward">
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>Calculated automatically</Text>
                    </Field>
                </View>
            </ScrollView>

            {/* SAVE */}
            <View style={styles.bottomSection}>
                <View style={[styles.buttonWrapper]}>
                    <PrimaryButton
                        title={saving ? "Saving..." : "Save Task"}
                        onPress={save}
                        disabled={saving || petLoading}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>

            <TimeWheelModal
                visible={timeOpen}
                initial={time}
                onClose={() => setTimeOpen(false)}
                onConfirm={(v) => { setTime(v); setTimeOpen(false); }}
            />

            {Platform.OS === "ios" ? (
                <Modal visible={iosDateOpen} transparent animationType="slide" onRequestClose={() => setIosDateOpen(false)}>
                    <Pressable style={styles.sheetBackdrop} onPress={() => setIosDateOpen(false)} />
                    <View style={styles.sheet}>
                        <DateTimePicker value={date} mode="date" display="inline" minimumDate={today} accentColor={C.orange}
                            onChange={(_e, picked) => { if (picked) setDate(picked); }} />
                        <PrimaryButton title="Done" onPress={() => setIosDateOpen(false)} />
                    </View>
                </Modal>
            ) : null}

            <NoPetPopup visible={!petLoading && !hasPet} onLater={() => router.back()} />
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