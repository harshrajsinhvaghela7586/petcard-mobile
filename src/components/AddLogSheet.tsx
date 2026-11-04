import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";
import { TimeValue, TimeWheels, formatTime, nowTimeValue } from "@/components/TimeWheel";

type Props = {
    visible: boolean;
    title: string;
    /** Naam wala field (Meal / Activity name). Nahi chahiye to undefined. */
    nameLabel?: string;
    namePlaceholder?: string;
    namePresets?: string[];
    amountLabel: string; // "Amount (g)"
    unit: string;        // "g" / "ml" / "min"
    presets: number[];
    step: number;
    max: number;
    onClose: () => void;
    onSave: (v: { label?: string; amount: number; time: string }) => void;
};

/** Bottom sheet: naam likho + amount chuno + scroll wheel se time chuno -> Add. */
export default function AddLogSheet(p: Props) {
    const [label, setLabel] = useState("");
    const [amount, setAmount] = useState(p.presets[0] ?? p.step);
    const [time, setTime] = useState<TimeValue>(nowTimeValue());

    useEffect(() => {
        if (p.visible) { setLabel(""); setAmount(p.presets[0] ?? p.step); setTime(nowTimeValue()); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p.visible]);

    const canSave = amount > 0 && (!p.nameLabel || label.trim().length > 0);
    const bump = (d: number) => setAmount((a) => Math.min(p.max, Math.max(p.step, a + d)));

    return (
        <Modal visible={p.visible} transparent animationType="slide" onRequestClose={p.onClose}>
            <Pressable style={styles.backdrop} onPress={p.onClose} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={styles.sheet}>
                    <View style={styles.grab} />
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>{p.title}</Text>
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ maxHeight: s(520) }}>
                        {p.nameLabel ? (
                            <>
                                <Text style={styles.label} maxFontSizeMultiplier={1.1}>{p.nameLabel}</Text>
                                <TextInput
                                    value={label} onChangeText={setLabel} maxLength={40}
                                    placeholder={p.namePlaceholder ?? "Type here"} placeholderTextColor={C.muted}
                                    style={styles.input} maxFontSizeMultiplier={1.1}
                                />
                                {p.namePresets ? (
                                    <View style={styles.chips}>
                                        {p.namePresets.map((n) => (
                                            <Pressable key={n} onPress={() => setLabel(n)} style={[styles.chip, label === n && styles.chipOn]}>
                                                <Text style={[styles.chipText, label === n && styles.chipTextOn]} maxFontSizeMultiplier={1.1}>{n}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                ) : null}
                            </>
                        ) : null}

                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>{p.amountLabel}</Text>
                        <View style={styles.stepper}>
                            <Pressable onPress={() => bump(-p.step)} style={styles.stepBtn} hitSlop={6}><Ionicons name="remove" size={s(20)} color={C.orange} /></Pressable>
                            <Text style={styles.amount} maxFontSizeMultiplier={1.1}>{amount} {p.unit}</Text>
                            <Pressable onPress={() => bump(p.step)} style={styles.stepBtn} hitSlop={6}><Ionicons name="add" size={s(20)} color={C.orange} /></Pressable>
                        </View>
                        <View style={styles.chips}>
                            {p.presets.map((v) => (
                                <Pressable key={v} onPress={() => setAmount(v)} style={[styles.chip, amount === v && styles.chipOn]}>
                                    <Text style={[styles.chipText, amount === v && styles.chipTextOn]} maxFontSizeMultiplier={1.1}>{v} {p.unit}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Time · {formatTime(time.h12, time.minute, time.meridiem)}</Text>
                        {p.visible ? <TimeWheels value={time} onChange={setTime} /> : null}
                    </ScrollView>
                    <PrimaryButton
                        title="Add"
                        onPress={() => {
                            if (p.nameLabel && !label.trim()) { Alert.alert("Details missing", `Please write the ${p.nameLabel.toLowerCase()}`); return; }
                            if (!(amount > 0)) { Alert.alert("Details missing", "Please enter an amount greater than 0"); return; }
                            p.onSave({ label: p.nameLabel ? label.trim() : undefined, amount, time: formatTime(time.h12, time.minute, time.meridiem) });
                        }}
                        style={{ alignSelf: "stretch", marginTop: s(10) }}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(18), paddingBottom: s(26) },
    grab: { alignSelf: "center", width: s(40), height: s(4), borderRadius: s(2), backgroundColor: C.peachBorder, marginBottom: s(10) },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown, textAlign: "center" },
    label: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown, marginTop: s(14), marginBottom: s(6) },
    input: { height: s(46), borderRadius: s(12), borderWidth: 1, borderColor: C.peachBorder, backgroundColor: C.card, paddingHorizontal: s(12), fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: s(8), marginTop: s(8) },
    chip: { paddingHorizontal: s(12), paddingVertical: s(6), borderRadius: s(14), backgroundColor: C.white, borderWidth: 1, borderColor: C.peachBorder },
    chipOn: { backgroundColor: C.orange, borderColor: C.orange },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    chipTextOn: { color: C.white },
    stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: s(50), borderRadius: s(14), backgroundColor: "#FFF3E6", paddingHorizontal: s(8) },
    stepBtn: { width: s(36), height: s(36), borderRadius: s(18), backgroundColor: C.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.peachBorder },
    amount: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown },
});
