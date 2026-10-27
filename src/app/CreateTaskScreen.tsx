import React, { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const CATEGORIES = ["Care", "Health", "Training", "Other"];
const REPEATS = ["Once", "Everyday", "Every Week", "Every Month"];
const REMINDERS = ["At time", "10 min before", "30 min before", "1 hour before"];

type DropKey = "category" | "repeat" | "reminder";

/* ---------- one field card (icon + label + content) ---------- */
function Field({
    icon,
    tint,
    label,
    children,
    trailing,
    onPress,
    options,
    selected,
    onPick,
}: {
    icon: string;
    tint: string;
    label: string;
    children: React.ReactNode;
    trailing?: React.ReactNode;
    onPress?: () => void;
    options?: string[]; // jab dropdown khula ho tab options pass karo
    selected?: string;
    onPick?: (v: string) => void;
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
                            <Pressable
                                key={o}
                                onPress={() => onPick?.(o)}
                                style={[styles.option, on && styles.optionOn]}
                            >
                                <Text
                                    style={[styles.optionText, on && styles.optionTextOn]}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {o}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
}

export default function CreateTaskScreen() {
    const [fontsLoaded] = useAppFonts();

    const [open, setOpen] = useState<DropKey | null>(null);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState("20 May 2025");
    const [time, setTime] = useState("06:00 PM");
    const [repeat, setRepeat] = useState("Everyday");
    const [reminder, setReminder] = useState("10 min before");
    const [xp, setXp] = useState("50");

    if (!fontsLoaded) return null;

    const canSave = name.trim().length > 0 && category.length > 0;
    const toggle = (k: DropKey) => setOpen((p) => (p === k ? null : k));

    const save = () => {
        if (!canSave) return;
        // TODO: API call to save task
        router.push("/TaskCompleteScreen")
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
                        source={require("../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.dog}
                    />
                </View>

                {/* FIELDS */}
                <View style={{ paddingHorizontal: SIDE }}>
                    <Field
                        icon="view-grid-outline"
                        tint="#F3EAFF"
                        label="Category"
                        onPress={() => toggle("category")}
                        trailing={
                            <Ionicons
                                name={open === "category" ? "chevron-up" : "chevron-down"}
                                size={s(20)}
                                color={C.brown}
                            />
                        }
                        options={open === "category" ? CATEGORIES : undefined}
                        selected={category}
                        onPick={(v) => {
                            setCategory(v);
                            setOpen(null);
                        }}
                    >
                        <Text
                            style={[styles.fieldValue, !category && { color: C.muted }]}
                            maxFontSizeMultiplier={1.1}
                        >
                            {category || "Select category"}
                        </Text>
                    </Field>

                    <Field icon="square-edit-outline" tint="#E8E4FF" label="Task Name">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Eg. Evening Walk"
                            placeholderTextColor={C.muted}
                            maxFontSizeMultiplier={1.1}
                            style={styles.input}
                        />
                    </Field>

                    <Field icon="calendar-blank-outline" tint="#FFF0D6" label="Date">
                        <TextInput
                            value={date}
                            onChangeText={setDate}
                            maxFontSizeMultiplier={1.1}
                            style={styles.input}
                        />
                    </Field>

                    <Field icon="clock-outline" tint="#FFF0D6" label="Time">
                        <TextInput
                            value={time}
                            onChangeText={setTime}
                            maxFontSizeMultiplier={1.1}
                            style={styles.input}
                        />
                    </Field>

                    <Field
                        icon="repeat"
                        tint="#FFF0D6"
                        label="Repeat"
                        onPress={() => toggle("repeat")}
                        trailing={
                            <Ionicons
                                name={open === "repeat" ? "chevron-up" : "chevron-down"}
                                size={s(18)}
                                color={C.muted}
                            />
                        }
                        options={open === "repeat" ? REPEATS : undefined}
                        selected={repeat}
                        onPick={(v) => {
                            setRepeat(v);
                            setOpen(null);
                        }}
                    >
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{repeat}</Text>
                    </Field>

                    <Field
                        icon="bell-outline"
                        tint="#FFF0D6"
                        label="Reminder"
                        onPress={() => toggle("reminder")}
                        trailing={
                            <Ionicons
                                name={open === "reminder" ? "chevron-up" : "chevron-down"}
                                size={s(18)}
                                color={C.muted}
                            />
                        }
                        options={open === "reminder" ? REMINDERS : undefined}
                        selected={reminder}
                        onPick={(v) => {
                            setReminder(v);
                            setOpen(null);
                        }}
                    >
                        <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}>{reminder}</Text>
                    </Field>

                    <Field icon="star" tint="#FFF0D6" label="Reward (XP)">
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput
                                value={xp}
                                onChangeText={(t) => setXp(t.replace(/[^0-9]/g, ""))}
                                keyboardType="number-pad"
                                maxFontSizeMultiplier={1.1}
                                style={[styles.input, { minWidth: s(24) }]}
                            />
                            <Text style={styles.fieldValue} maxFontSizeMultiplier={1.1}> XP</Text>
                        </View>
                    </Field>
                </View>
            </ScrollView>

            {/* SAVE */}
            <View style={styles.bottomSection}>
                <View style={[styles.buttonWrapper]}>
                    <PrimaryButton
                        title="Save Task"
                        onPress={save}
                        icon={
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>
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