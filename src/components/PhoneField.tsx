import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import { C, s } from "@/components/SectionHeader";
import { COUNTRIES, Country } from "@/constants/countries";

type Props = {
    country: Country;
    national: string;
    onCountry: (c: Country) => void;
    onNational: (v: string) => void;
    editable?: boolean;
    placeholder?: string;
    inputRef?: React.Ref<TextInput>;
    onSubmitEditing?: () => void;
    onFocus?: () => void;
    /** container/input style override so it matches the host screen (signup / edit-profile) */
    wrapperStyle?: object;
    inputStyle?: object;
    dividerColor?: string;
};

/** [flag +91 v] [ digits only, max length by country ] */
export default function PhoneField({
    country, national, onCountry, onNational, editable = true, placeholder = "Phone number",
    inputRef, onSubmitEditing, onFocus, wrapperStyle, inputStyle, dividerColor = C.peachBorder,
}: Props) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const list = useMemo(() => {
        const t = q.trim().toLowerCase();
        return t ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(t) || c.dial.includes(t) || c.iso.toLowerCase() === t) : COUNTRIES;
    }, [q]);

    return (
        <View style={[styles.row, wrapperStyle]}>
            <Pressable disabled={!editable} onPress={() => setOpen(true)} style={[styles.code, { borderRightColor: dividerColor }]} hitSlop={4}>
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.dial} maxFontSizeMultiplier={1.1}>{country.dial}</Text>
                {editable ? <Ionicons name="chevron-down" size={s(14)} color={C.muted} /> : null}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={national}
                onChangeText={(v) => onNational(v.replace(/\D/g, "").slice(0, country.max))}
                keyboardType="number-pad"
                maxLength={country.max}
                editable={editable}
                placeholder={placeholder}
                placeholderTextColor={C.muted}
                style={[styles.input, inputStyle]}
                maxFontSizeMultiplier={1.1}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
            />

            <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
                <View style={styles.sheet}>
                    <View style={styles.grab} />
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>Select country</Text>
                    <TextInput value={q} onChangeText={setQ} placeholder="Search country or code" placeholderTextColor={C.muted} style={styles.search} maxFontSizeMultiplier={1.1} />
                    <FlatList
                        data={list}
                        keyExtractor={(c) => c.iso}
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: s(380) }}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => { onCountry(item); onNational(national.slice(0, item.max)); setOpen(false); setQ(""); }} style={styles.item}>
                                <Text style={styles.flag}>{item.flag}</Text>
                                <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={1.1}>{item.name}</Text>
                                <Text style={styles.itemDial} maxFontSizeMultiplier={1.1}>{item.dial}</Text>
                                {item.iso === country.iso ? <Ionicons name="checkmark" size={s(18)} color={C.orange} /> : null}
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", flex: 1 },
    code: { flexDirection: "row", alignItems: "center", gap: s(4), paddingRight: s(8), marginRight: s(8), borderRightWidth: 1 },
    flag: { fontSize: s(18) },
    dial: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    input: { flex: 1, padding: 0, fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(18), paddingBottom: s(26) },
    grab: { alignSelf: "center", width: s(40), height: s(4), borderRadius: s(2), backgroundColor: C.peachBorder, marginBottom: s(10) },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown, textAlign: "center", marginBottom: s(10) },
    search: { height: s(44), borderRadius: s(12), borderWidth: 1, borderColor: C.peachBorder, backgroundColor: C.card, paddingHorizontal: s(12), fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown, marginBottom: s(6) },
    item: { flexDirection: "row", alignItems: "center", gap: s(10), paddingVertical: s(11), borderBottomWidth: 1, borderBottomColor: C.divider },
    name: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    itemDial: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.muted },
});
