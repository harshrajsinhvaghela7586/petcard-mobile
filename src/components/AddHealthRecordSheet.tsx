import { appAlert } from "@/components/AppDialog";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import PrimaryButton from "@/components/Button/PrimaryButton";
import DateField, { toIsoDate } from "@/components/DateField";
import { C, s } from "@/components/SectionHeader";

export type HealthDraft = { type: string; title: string; date: string; nextDueDate: string | null; weightKg?: number; vetName?: string; notes?: string };

/* UI tab -> backend `type`. Backend me "deworming" type nahi hai, isliye other + title me "Deworming". */
export const TAB_TYPE: Record<string, { type: string; heading: string; titleLabel: string; placeholder: string; presets: string[]; dueLabel: string; prefix?: string }> = {
    vaccination: { type: "vaccination", heading: "Add Vaccination", titleLabel: "Vaccine name", placeholder: "e.g. Rabies", presets: ["Rabies", "DHPP", "Bordetella", "FVRCP"], dueLabel: "Next due (booster)" },
    deworming: { type: "other", heading: "Add Deworming", titleLabel: "Medicine / dose", placeholder: "e.g. Albendazole", presets: ["Albendazole", "Praziquantel"], dueLabel: "Next dose due", prefix: "Deworming" },
    vet: { type: "vet_visit", heading: "Add Vet Visit", titleLabel: "Reason", placeholder: "e.g. Annual check-up", presets: ["Annual check-up", "Dental", "Injury", "Follow-up"], dueLabel: "Next visit" },
    meds: { type: "medication", heading: "Add Medication", titleLabel: "Medicine name", placeholder: "e.g. Joint supplement", presets: ["Antibiotic", "Supplement", "Pain relief"], dueLabel: "Next dose / refill" },
    weight: { type: "weight", heading: "Add Weight", titleLabel: "Note", placeholder: "e.g. Monthly weigh-in", presets: ["Monthly weigh-in"], dueLabel: "Next weigh-in" },
    allergies: { type: "allergy", heading: "Add Allergy", titleLabel: "Allergy", placeholder: "e.g. Chicken", presets: ["Chicken", "Pollen", "Dust", "Beef"], dueLabel: "Review on" },
};

export default function AddHealthRecordSheet({ visible, tab, onClose, onSave, saving }: {
    visible: boolean; tab: string; onClose: () => void; saving?: boolean; onSave: (d: HealthDraft) => void;
}) {
    const cfg = TAB_TYPE[tab] ?? TAB_TYPE.vaccination;
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [due, setDue] = useState<Date | null>(null);
    const [weight, setWeight] = useState("");
    const [vet, setVet] = useState("");
    const [notes, setNotes] = useState("");
    const isWeight = cfg.type === "weight";

    useEffect(() => {
        if (visible) { setTitle(""); setDate(new Date()); setDue(null); setWeight(""); setVet(""); setNotes(""); }
    }, [visible, tab]);

    const w = Number(weight.replace(",", "."));
    const weightOk = !isWeight || (Number.isFinite(w) && w > 0 && w <= 500);
    const canSave = !!date && weightOk && (isWeight || title.trim().length > 0);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);

    const submit = () => {
        if (!date) { appAlert("Details missing", "Please select the date."); return; }
        if (isWeight && !weightOk) { appAlert("Details missing", "Please enter a valid weight in kg (for example 12.5)."); return; }
        if (!isWeight && !title.trim()) { appAlert("Details missing", `Please write the ${cfg.type === "vet_visit" ? "reason for the visit" : "name"} of the record.`); return; }
        if (due && date && due.getTime() < date.getTime()) { appAlert("Check the dates", "The next due date cannot be before the record date."); return; }
        const base = isWeight ? `${w} kg` : title.trim();
        const finalTitle = cfg.prefix && !new RegExp(cfg.prefix, "i").test(base) ? `${cfg.prefix}: ${base}` : base;
        onSave({
            type: cfg.type, title: finalTitle.slice(0, 100), date: toIsoDate(date),
            nextDueDate: due ? toIsoDate(due) : null,
            weightKg: isWeight ? w : undefined, vetName: vet.trim() || undefined, notes: notes.trim() || undefined,
        });
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={styles.sheet}>
                    <View style={styles.grab} />
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>{cfg.heading}</Text>
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ maxHeight: s(480) }}>
                        {isWeight ? (
                            <>
                                <Text style={styles.label} maxFontSizeMultiplier={1.1}>Weight (kg)</Text>
                                <TextInput value={weight} onChangeText={(v) => setWeight(v.replace(/[^0-9.,]/g, "").slice(0, 6))} keyboardType="decimal-pad"
                                    placeholder="e.g. 12.5" placeholderTextColor={C.muted} style={styles.input} maxFontSizeMultiplier={1.1} />
                            </>
                        ) : (
                            <>
                                <Text style={styles.label} maxFontSizeMultiplier={1.1}>{cfg.titleLabel}</Text>
                                <TextInput value={title} onChangeText={setTitle} maxLength={80} placeholder={cfg.placeholder}
                                    placeholderTextColor={C.muted} style={styles.input} maxFontSizeMultiplier={1.1} />
                                <View style={styles.chips}>
                                    {cfg.presets.map((p) => (
                                        <Pressable key={p} onPress={() => setTitle(p)} style={[styles.chip, title === p && styles.chipOn]}>
                                            <Text style={[styles.chipText, title === p && styles.chipTextOn]} maxFontSizeMultiplier={1.1}>{p}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}

                        <DateField label="Date" value={date} onChange={setDate} maximumDate={new Date(2100, 0, 1)} />
                        <DateField label={cfg.dueLabel} value={due} onChange={setDue} minimumDate={tomorrow} placeholder="Optional - shows on Home as 'Due in N days'" clearable />

                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Vet / clinic (optional)</Text>
                        <TextInput value={vet} onChangeText={setVet} maxLength={80} placeholder="Dr. name or clinic" placeholderTextColor={C.muted} style={styles.input} maxFontSizeMultiplier={1.1} />
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Notes (optional)</Text>
                        <TextInput value={notes} onChangeText={setNotes} maxLength={500} multiline placeholder="Anything to remember" placeholderTextColor={C.muted}
                            style={[styles.input, { height: s(76), paddingTop: s(10), textAlignVertical: "top" }]} maxFontSizeMultiplier={1.1} />
                    </ScrollView>
                    <PrimaryButton title={saving ? "Saving..." : "Save Record"} onPress={submit} disabled={saving} style={{ alignSelf: "stretch", marginTop: s(12) }} />
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
    label: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown, marginTop: s(12), marginBottom: s(6) },
    input: { height: s(46), borderRadius: s(12), borderWidth: 1, borderColor: C.peachBorder, backgroundColor: C.card, paddingHorizontal: s(12), fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: s(8), marginTop: s(8) },
    chip: { paddingHorizontal: s(12), paddingVertical: s(6), borderRadius: s(14), backgroundColor: C.white, borderWidth: 1, borderColor: C.peachBorder },
    chipOn: { backgroundColor: C.orange, borderColor: C.orange },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    chipTextOn: { color: C.white },
});
