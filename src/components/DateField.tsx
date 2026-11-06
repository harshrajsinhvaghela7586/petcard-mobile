import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDisplayDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Props = {
    label: string;
    value: Date | null;
    onChange: (d: Date | null) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    placeholder?: string;
    /** true => X button se date hata sakte hain (optional fields) */
    clearable?: boolean;
    /** optional style overrides so the field can match other screens */
    labelStyle?: StyleProp<TextStyle>;
    fieldStyle?: StyleProp<ViewStyle>;
};

/** Tap -> native date picker (Android dialog / iOS sheet). Text input nahi, isliye galat date format nahi ho sakta. */
export default function DateField({ label, value, onChange, minimumDate, maximumDate, placeholder = "Select date", clearable, labelStyle, fieldStyle }: Props) {
    const [iosOpen, setIosOpen] = useState(false);
    const [draft, setDraft] = useState<Date>(value ?? new Date());

    const open = () => {
        if (Platform.OS === "android") {
            DateTimePickerAndroid.open({
                value: value ?? new Date(), mode: "date", minimumDate, maximumDate,
                onChange: (_e, picked) => { if (picked) onChange(picked); },
            });
        } else { setDraft(value ?? new Date()); setIosOpen(true); }
    };

    return (
        <>
            <Text style={[styles.label, labelStyle]} maxFontSizeMultiplier={1.1}>{label}</Text>
            <Pressable onPress={open} style={[styles.field, fieldStyle]}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={s(18)} color={C.orange} />
                <Text style={[styles.value, !value && { color: C.muted }]} maxFontSizeMultiplier={1.1}>
                    {value ? fmtDisplayDate(value) : placeholder}
                </Text>
                {clearable && value ? (
                    <Pressable onPress={() => onChange(null)} hitSlop={8}><MaterialCommunityIcons name="close-circle" size={s(18)} color={C.muted} /></Pressable>
                ) : null}
            </Pressable>

            {Platform.OS === "ios" ? (
                <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
                    <Pressable style={styles.backdrop} onPress={() => setIosOpen(false)} />
                    <View style={styles.sheet}>
                        <DateTimePicker value={draft} mode="date" display="inline" minimumDate={minimumDate} maximumDate={maximumDate}
                            accentColor={C.orange} onChange={(_e, d) => { if (d) setDraft(d); }} />
                        <PrimaryButton title="Done" onPress={() => { onChange(draft); setIosOpen(false); }} />
                    </View>
                </Modal>
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    label: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown, marginTop: s(12), marginBottom: s(6) },
    field: { height: s(46), borderRadius: s(12), borderWidth: 1, borderColor: C.peachBorder, backgroundColor: C.card, paddingHorizontal: s(12), flexDirection: "row", alignItems: "center", gap: s(8) },
    value: { flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(16), paddingBottom: s(28), gap: s(8) },
});
