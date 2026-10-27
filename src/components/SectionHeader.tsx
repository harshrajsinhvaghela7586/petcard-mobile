import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

/* Same scaling system as ProfileScreen / PetTypeScreen (design: 393 x 852) */
export const SCALE = Math.min(width / 393, height / 852);
export const UI_SCALE = Math.min(SCALE, 1.3);
export const s = (size: number) => size * UI_SCALE;
export const SIDE = s(14);

export const C = {
    orange: "#FF7A00",
    brown: "#382018",
    muted: "#8F7365",
    iconMuted: "#8B6D5C",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    card: "#FFFCFA",
    white: "#FFFFFF",
    divider: "#F0E4DD",
    red: "#FF4B32",
    purple: "#7A5CFF",
    green: "#5E9B2D",
};

export const cardStyle = {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.peachBorder,
    borderRadius: s(16),
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.08,
    shadowRadius: s(6),
    elevation: 2,
} as const;

/* One place to load fonts for all these screens */
export const useAppFonts = () =>
    useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });

/* ---------- Background paws ---------- */
export function PawBackground() {
    return (
        <>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.paw, { top: 150 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.paw, { top: 520 * SCALE, left: -20 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />
        </>
    );
}

/* ---------- Header: back arrow + centered title + optional right action ---------- */
interface HeaderProps {
    title: string;
    rightLabel?: string;
    onRightPress?: () => void;
}

export default function ScreenHeader({ title, rightLabel, onRightPress }: HeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + s(8) }]}>
            <View style={[styles.slot, { alignItems: "flex-start" }]}>
                <Pressable onPress={() => router.back()} hitSlop={12}>
                    <Ionicons name="arrow-back" size={s(26)} color={C.brown} />
                </Pressable>
            </View>

            <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                {title}
            </Text>

            <View style={[styles.slot, { alignItems: "flex-end" }]}>
                {rightLabel ? (
                    <Pressable onPress={onRightPress} hitSlop={12}>
                        <Text style={styles.right} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {rightLabel}
                        </Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

/* ---------- Filter tabs (All / Unlocked / Locked ...) ---------- */
interface TabsProps {
    tabs: { key: string; label: string }[];
    active: string;
    onChange: (key: string) => void;
}

export function FilterTabs({ tabs, active, onChange }: TabsProps) {
    return (
        <View style={styles.tabs}>
            {tabs.map((t) => {
                const on = t.key === active;
                return (
                    <Pressable
                        key={t.key}
                        onPress={() => onChange(t.key)}
                        style={[styles.tab, on && styles.tabOn]}
                    >
                        <Text
                            style={[styles.tabText, on && styles.tabTextOn]}
                            maxFontSizeMultiplier={1.1}
                            numberOfLines={1}
                        >
                            {t.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    paw: {
        position: "absolute",
        width: 92 * SCALE,
        height: 92 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        paddingBottom: s(10),
    },
    slot: { width: s(96), justifyContent: "center" },
    title: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(21),
        lineHeight: s(28),
        color: C.brown,
    },
    right: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.orange },

    tabs: { flexDirection: "row", gap: s(8) },
    tab: {
        flex: 1,
        height: s(36),
        borderRadius: s(18),
        backgroundColor: "#FFF3E6",
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    tabOn: { backgroundColor: C.orange, borderColor: C.orange },
    tabText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    tabTextOn: { color: C.white },
});