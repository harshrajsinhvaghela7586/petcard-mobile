import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
            { key: "language", title: "App Language", icon: "web", value: "English" },
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
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const open = (route?: string) => {
        if (route) router.push(route as any);
    };

    const logout = () => {
        // TODO: clear token / session here
        router.replace("/login" as any);
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
                                    onPress={() => open(r.route)}
                                    style={[styles.row, i > 0 && styles.rowBorder]}
                                >
                                    <MaterialCommunityIcons name={r.icon as any} size={s(22)} color={C.iconMuted} />
                                    <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {r.title}
                                    </Text>
                                    {r.value ? (
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
            </ScrollView>
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
    logoutRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    logoutTitle: { fontFamily: "Nunito_700Bold", fontSize: s(20), color: C.orange },
    logoutSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown },
});