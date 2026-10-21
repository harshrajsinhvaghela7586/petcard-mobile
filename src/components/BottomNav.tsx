import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const C = {
    orange: "#FF7A00",
    iconMuted: "#8B6D5C",
    card: "#FFFCFA",
    white: "#FFFFFF",
    peachBorder: "#FFDCC5",
};

export type TabKey = "home" | "tasks" | "know" | "profile";
/* "ai" = beech wala paw button (AI chat screen) */
export type NavActive = TabKey | "ai";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

/* Apni routes yahan change kar lena agar file names alag hain */
const ROUTES: Record<TabKey, string> = {
    home: "/HomeScreen",
    tasks: "/TasksScreen",
    know: "/KnowScreen",
    profile: "/ProfileScreen",
};

/*
 * Har tab ke 2 icons:
 * inactive -> outline, active -> filled
 */
const TABS: { key: TabKey; label: string; icon: IconName; iconActive: IconName }[] = [
    { key: "home", label: "Home", icon: "home-outline", iconActive: "home" },
    { key: "tasks", label: "Tasks", icon: "checkbox-outline", iconActive: "checkbox" },
    { key: "know", label: "Know", icon: "book-outline", iconActive: "book" },
    { key: "profile", label: "Profile", icon: "person-outline", iconActive: "person" },
];

/* Beech wale paw button se AI chatbot khulta hai */
const AI_ROUTE = "/AIChatScreen";

export const useNavHeight = () => {
    const insets = useSafeAreaInsets();
    return s(64) + insets.bottom;
};

/* active na do to koi tab highlight nahi hoga (Emergency Card jaise screens ke liye) */
export default function BottomNav({ active }: { active?: NavActive }) {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = s(64) + insets.bottom;
    const aiActive = active === "ai";

    const go = (key: TabKey) => {
        if (key === active) return;
        router.replace(ROUTES[key] as any);
    };

    const openAI = () => {
        if (aiActive) return;
        router.push(AI_ROUTE as any);
    };

    const item = (key: TabKey) => {
        const t = TABS.find((x) => x.key === key)!;
        const isActive = active === key;

        return (
            <Pressable onPress={() => go(key)} style={styles.navItem}>
                <Ionicons
                    name={isActive ? t.iconActive : t.icon}
                    size={s(24)}
                    color={isActive ? C.orange : C.iconMuted}
                />
                <Text
                    style={[styles.navLabel, isActive && styles.navLabelActive]}
                    maxFontSizeMultiplier={1.1}
                >
                    {t.label}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={[styles.nav, { height: NAV_HEIGHT, paddingBottom: insets.bottom }]}>
            {item("home")}
            {item("tasks")}

            <View style={styles.navCenterSlot}>
                <Pressable
                    style={[styles.navCenter, aiActive && styles.navCenterActive]}
                    onPress={openAI}
                >
                    <Image
                        source={require("../../assets/images/paw-white.png")}
                        resizeMode="contain"
                        style={[styles.navCenterPaw, aiActive && { tintColor: C.orange }]}
                    />
                </Pressable>
            </View>

            {item("know")}
            {item("profile")}
        </View>
    );
}

const styles = StyleSheet.create({
    nav: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderTopWidth: 1,
        borderTopColor: C.peachBorder,
        borderTopLeftRadius: s(22),
        borderTopRightRadius: s(22),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: s(-3) },
        shadowOpacity: 0.06,
        shadowRadius: s(8),
        elevation: 10,
    },
    navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: s(2) },
    navLabel: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.iconMuted },
    navLabelActive: { color: C.orange },
    navCenterSlot: { flex: 1, alignItems: "center" },
    navCenter: {
        width: s(60),
        height: s(60),
        borderRadius: s(30),
        marginTop: s(-34),
        backgroundColor: C.orange,
        borderWidth: 4,
        borderColor: C.white,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(6) },
        shadowOpacity: 0.3,
        shadowRadius: s(10),
        elevation: 8,
    },
    /* AI screen open hai: white circle + orange paw */
    navCenterActive: {
        backgroundColor: C.white,
        borderColor: C.orange,
    },
    navCenterPaw: { width: s(30), height: s(30) },
});