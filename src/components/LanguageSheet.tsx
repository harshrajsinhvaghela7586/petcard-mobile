import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import { C, s } from "@/components/SectionHeader";
import { LANGS } from "@/i18n/strings";
import { useLang } from "@/i18n/LanguageContext";

export default function LanguageSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { lang, setLang, t } = useLang();
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.grab} />
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>{t("settings.chooseLanguage")}</Text>
                {LANGS.map((l, i) => (
                    <Pressable key={l.code} onPress={() => { setLang(l.code); onClose(); }} style={[styles.row, i > 0 && styles.border]}>
                        <Text style={styles.native} maxFontSizeMultiplier={1.1}>{l.native}</Text>
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>{l.label}</Text>
                        {lang === l.code ? <Ionicons name="checkmark-circle" size={s(20)} color={C.orange} /> : <View style={{ width: s(20) }} />}
                    </Pressable>
                ))}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(18), paddingBottom: s(28) },
    grab: { alignSelf: "center", width: s(40), height: s(4), borderRadius: s(2), backgroundColor: C.peachBorder, marginBottom: s(10) },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown, textAlign: "center", marginBottom: s(6) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(12), gap: s(10) },
    border: { borderTopWidth: 1, borderTopColor: C.divider },
    native: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    label: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.muted },
});
