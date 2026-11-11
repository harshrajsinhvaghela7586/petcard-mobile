import { useState } from "react";
import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

type Row = {
    key: string;
    title: string;
    icon: string;
    value?: string;
    route?: string; // jab page ban jaye tab route daal dena
};

import LanguageSheet from "@/components/LanguageSheet";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { useLang } from "@/i18n/LanguageContext";
import { LANGS } from "@/i18n/strings";

const SECTIONS: { title: string; rows: Row[] }[] = [
    {
        title: "Account",
        rows: [
            { key: "edit", title: "Edit Profile", icon: "account-outline", route: "/edit-profile" },
            { key: "password", title: "Change Password", icon: "lock-outline",route:"/change-password" },
            { key: "privacy", title: "Privacy & Security", icon: "shield-check-outline",route:"settings/PrivacySecurityScreen" },
        ],
    },
    {
        title: "Preferences",
        rows: [
            { key: "reminders", title: "Reminders & Alerts", icon: "bell-outline",route:"settings/RemindersAlertsScreen" },
            { key: "language", title: "App Language", icon: "web" },
            { key: "theme", title: "Theme", icon: "palette-outline", value: "Light" },
            { key: "notif", title: "Notification Settings", icon: "bell-ring-outline", route: "/notifications" },
        ],
    },
    {
        title: "Support",
        rows: [
            { key: "help", title: "Help Center", icon: "help-circle-outline", route: "settings/HelpSupportScreen" },
            { key: "contact", title: "Contact Us", icon: "email-outline",route:"/ContactusScreen" },
            { key: "about", title: "About PetCard", icon: "information-outline", value: "Version 1.0.0", route: "/AboutScreen" },
        ],
    },
];

export default function SettingsScreen() {
    const { signOut } = useAuth();
    const { lang, t } = useLang();
    const [langOpen, setLangOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const open = (route?: string, key?: string) => {
        if (key === "language") { setLangOpen(true); return; }
        if (route) router.push(route as any);
    };

    const logout = () => {
        // Clears tokens + revokes the refresh token; the auth gate then opens /login.
        void signOut();
    };

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Settings" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(40) }}>
                {SECTIONS.map((sec) => (
                    <View key={sec.title}>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>{sec.title}</Text>
                        <View style={styles.card}>
                            {sec.rows.map((r, i) => (
                                <Pressable
                                    key={r.key}
                                    onPress={() => open(r.route, r.key)}
                                    style={[styles.row, i > 0 && styles.rowBorder]}
                                >
                                    <MaterialCommunityIcons name={r.icon as any} size={s(22)} color={C.iconMuted} />
                                    <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {r.key === "language" ? t("settings.language") : r.title}
                                    </Text>
                                    {r.key === "language" ? (
                                        <Text style={styles.value} maxFontSizeMultiplier={1.1} numberOfLines={1}>{LANGS.find((l) => l.code === lang)?.native}</Text>
                                    ) : r.value ? (
                                        <Text style={styles.value} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {r.value}
                                        </Text>
                                    ) : null}
                                    <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                {/* LOGOUT */}
                <Pressable style={styles.logout} onPress={logout}>
                    <View style={styles.logoutRow}>
                        <MaterialCommunityIcons name="logout" size={s(24)} color={C.orange} />
                        <Text style={styles.logoutTitle} maxFontSizeMultiplier={1.1}>Logout</Text>
                    </View>
                    <View style={styles.logoutRow}>
                        <Text style={styles.logoutSub} maxFontSizeMultiplier={1.1}>We'll miss you!</Text>
                        <MaterialCommunityIcons name="paw" size={s(14)} color={C.orange} />
                    </View>
                </Pressable>

                {/* DELETE ACCOUNT */}
                <Pressable style={styles.deleteAccount} onPress={() => setDeleteOpen(true)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={s(18)} color="#E5484D" />
                    <Text style={styles.deleteAccountText} maxFontSizeMultiplier={1.1}>Delete Account</Text>
                </Pressable>
            </ScrollView>
            <LanguageSheet visible={langOpen} onClose={() => setLangOpen(false)} />
            <DeleteAccountDialog visible={deleteOpen} onClose={() => setDeleteOpen(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(14),
        color: C.brown,
        marginTop: s(16),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },
    card: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(12) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(14), gap: s(12) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    rowTitle: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    value: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.muted },

    logout: {
        marginHorizontal: SIDE,
        marginTop: s(20),
        paddingVertical: s(14),
        borderRadius: s(14),
        backgroundColor: "#FFEBD9",
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        gap: s(4),
    },
    deleteAccount: { marginHorizontal: SIDE, marginTop: s(12), paddingVertical: s(12), borderRadius: s(14), backgroundColor: "#FFE5E1", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: s(8) },
    deleteAccountText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: "#E5484D" },
    logoutRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    logoutTitle: { fontFamily: "Nunito_700Bold", fontSize: s(20), color: C.orange },
    logoutSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown },
});