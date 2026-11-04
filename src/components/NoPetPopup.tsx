import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";
import { useLang } from "@/i18n/LanguageContext";

/** Pet setup baki ho to ye popup aata hai. "Complete Now" -> Pet Type screen (setup ka pehla step). */
export default function NoPetPopup({ visible, onLater }: { visible: boolean; onLater?: () => void }) {
    const { t } = useLang();
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onLater}>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons name="paw" size={s(34)} color={C.orange} />
                    </View>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>{t("nopet.title")}</Text>
                    <Text style={styles.body} maxFontSizeMultiplier={1.1}>
                        {t("nopet.body")}
                    </Text>
                    <PrimaryButton
                        title={t("nopet.cta")}
                        onPress={() => router.push("/PetTypeScreen" as any)}
                        style={{ alignSelf: "stretch", marginTop: s(16) }}
                    />
                    {onLater ? (
                        <Pressable onPress={onLater} hitSlop={10} style={{ marginTop: s(12) }}>
                            <Text style={styles.later} maxFontSizeMultiplier={1.1}>{t("nopet.later")}</Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)", alignItems: "center", justifyContent: "center", padding: s(24) },
    card: { width: "100%", maxWidth: 360, backgroundColor: C.white, borderRadius: s(22), padding: s(20), alignItems: "center", borderWidth: 1, borderColor: C.peachBorder },
    icon: { width: s(64), height: s(64), borderRadius: s(32), backgroundColor: C.peach, alignItems: "center", justifyContent: "center" },
    title: { marginTop: s(12), fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown, textAlign: "center" },
    body: { marginTop: s(6), fontFamily: "Nunito_600SemiBold", fontSize: s(13), lineHeight: s(19), color: C.muted, textAlign: "center" },
    later: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.muted },
});
