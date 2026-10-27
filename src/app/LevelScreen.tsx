import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import { s } from "@/constants/scale";
import { CURRENT_LEVEL, CURRENT_XP, LEVELS } from "@/constants/levels";

const C = {
    orange: "#FF7A00",
    brown: "#382018",
    muted: "#8F7365",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    white: "#FFFFFF",
    divider: "#F0E4DD",
};

export default function LevelScreen() {
    const insets = useSafeAreaInsets();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded) return null;

    const current = LEVELS.find((l) => l.level === CURRENT_LEVEL) ?? LEVELS[0];
    const next = LEVELS.find((l) => l.level === current.level + 1);

    const target = current.xpToNext;
    const progress = Math.min(Math.max(CURRENT_XP / target, 0), 1);
    const xpLeft = Math.max(target - CURRENT_XP, 0);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={styles.backgroundPaw}
            />

            {/* HEADER */}
            <View style={[styles.header, { paddingTop: insets.top + s(8) }]}>
                <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
                    <Ionicons name="chevron-back" size={s(24)} color={C.brown} />
                </Pressable>
                <Text style={styles.headerTitle} maxFontSizeMultiplier={1.1}>
                    Level & XP
                </Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* CURRENT LEVEL */}
                <View style={styles.badgeWrap}>
                    <View style={styles.badgeGlow} />
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name="shield" size={s(92)} color={C.orange} />
                        <MaterialCommunityIcons
                            name="paw"
                            size={s(34)}
                            color={C.white}
                            style={styles.badgePaw}
                        />
                    </View>
                </View>

                <Text style={styles.levelTitle} maxFontSizeMultiplier={1.1}>
                    {`Level ${current.level}`}
                </Text>

                <View style={styles.progressRow}>
                    <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.xpText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        {`${CURRENT_XP.toLocaleString()} / ${target.toLocaleString()} XP`}
                    </Text>
                </View>

                <Text style={styles.toNext} maxFontSizeMultiplier={1.1}>
                    {next
                        ? `${xpLeft.toLocaleString()} XP to Level ${next.level}`
                        : "You reached the top level!"}
                </Text>

                {/* LEVEL LIST */}
                <View style={styles.list}>
                    {LEVELS.map((l) => {
                        const isCurrent = l.level === current.level;
                        const reached = l.level <= current.level;

                        return (
                            <View
                                key={l.level}
                                style={[styles.row, isCurrent && styles.rowCurrent]}
                            >
                                <MaterialCommunityIcons
                                    name={reached ? "shield-star" : "shield-lock-outline"}
                                    size={s(34)}
                                    color={reached ? l.color : "#B7B0AB"}
                                />

                                <View style={styles.rowText}>
                                    <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1}>
                                        {`Level ${l.level}`}
                                    </Text>
                                    <Text
                                        style={[styles.rowName, isCurrent && styles.rowNameCurrent]}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        {l.name}
                                    </Text>
                                </View>

                                {reached && !isCurrent ? (
                                    <Ionicons name="checkmark-circle" size={s(20)} color={C.orange} />
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        overflow: "hidden",
    },
    backgroundPaw: {
        position: "absolute",
        top: s(120),
        right: s(-14),
        width: s(92),
        height: s(92),
        opacity: 0.07,
        transform: [{ rotate: "15deg" }],
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(14),
        paddingBottom: s(6),
    },
    backButton: {
        width: s(40),
        height: s(40),
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(20),
        color: C.brown,
    },

    content: {
        alignItems: "center",
        paddingHorizontal: s(20),
        paddingTop: s(14),
        paddingBottom: s(30),
    },

    badgeWrap: {
        width: s(130),
        height: s(130),
        alignItems: "center",
        justifyContent: "center",
    },
    badgeGlow: {
        position: "absolute",
        width: s(130),
        height: s(130),
        borderRadius: s(65),
        backgroundColor: C.peach,
        opacity: 0.7,
    },
    badge: {
        alignItems: "center",
        justifyContent: "center",
    },
    badgePaw: {
        position: "absolute",
        top: s(26),
    },

    levelTitle: {
        marginTop: s(8),
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(34),
        color: C.brown,
    },

    progressRow: {
        width: "100%",
        marginTop: s(8),
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
    },
    barTrack: {
        flex: 1,
        height: s(10),
        borderRadius: s(5),
        backgroundColor: C.peach,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: s(5),
        backgroundColor: C.orange,
    },
    xpText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        color: C.brown,
    },
    toNext: {
        marginTop: s(8),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.muted,
    },

    list: {
        width: "100%",
        marginTop: s(22),
        gap: s(8),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(10),
        paddingHorizontal: s(14),
        borderRadius: s(16),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.divider,
    },
    rowCurrent: {
        backgroundColor: C.peach,
        borderColor: C.orange,
    },
    rowText: {
        flex: 1,
        marginLeft: s(14),
    },
    rowTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        color: C.brown,
    },
    rowName: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(1),
    },
    rowNameCurrent: {
        color: C.orange,
    },
});
