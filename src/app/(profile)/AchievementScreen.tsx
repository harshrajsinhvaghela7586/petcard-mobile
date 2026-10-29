import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    FilterTabs,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

type Achievement = {
    key: string;
    title: string;
    sub: string;
    icon: string;
    color: string;
    tint: string;
    done: boolean;
    xp?: number;
    progress?: number;
    total?: number;
};

const TABS = [
    { key: "all", label: "All" },
    { key: "unlocked", label: "Unlocked" },
    { key: "locked", label: "Locked" },
];

const ACHIEVEMENTS: Achievement[] = [
    { key: "first", title: "First Step", sub: "Added your first pet", icon: "food-variant", color: "#5E9B2D", tint: "#EAF3DC", done: true, xp: 20 },
    { key: "task", title: "Task Master", sub: "Completed 10 daily tasks", icon: "medal", color: "#E08A00", tint: "#FFF0D6", done: true, xp: 60 },
    { key: "health", title: "Health Hero", sub: "Added 5 health records", icon: "shield-plus", color: "#3B6FB6", tint: "#E6F0FA", done: true, xp: 50 },
    { key: "streak", title: "Streak Champ", sub: "7 days task streak", icon: "fire", color: "#FF4B32", tint: "#FFE5E1", done: true, xp: 70 },
    { key: "expert", title: "Pet Expert", sub: "Learn 10 articles", icon: "clipboard-text", color: "#3B6FB6", tint: "#E6F0FA", done: false, progress: 4, total: 10 },
    { key: "super", title: "Super Parent", sub: "30 days task streak", icon: "shield-star", color: "#7A5CFF", tint: "#F3EAFF", done: false, progress: 7, total: 30 },
];

/* Design shows 12 total achievements earned (list above is just the visible ones) */
const TOTAL_UNLOCKED = 12;

export default function AchievementsScreen() {
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState("all");
    if (!fontsLoaded) return null;

    const list = ACHIEVEMENTS.filter((a) =>
        tab === "all" ? true : tab === "unlocked" ? a.done : !a.done
    );

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Achievements" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(40) }}>
                {/* PROGRESS CARD */}
                <View style={styles.progressCard}>
                    <Image
                        source={require("../../../assets/images/achievement/medal.png")}
                        resizeMode="contain"
                        style={styles.medal}
                    />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={styles.progressLabel} maxFontSizeMultiplier={1.1}>Your Progress</Text>
                        <Text style={styles.progressValue} maxFontSizeMultiplier={1.1}>{TOTAL_UNLOCKED}</Text>
                        <Text style={styles.progressSub} maxFontSizeMultiplier={1.1}>Achievements</Text>
                        <Pressable style={styles.viewBtn} onPress={() => setTab("unlocked")}>
                            <Text style={styles.viewBtnText} maxFontSizeMultiplier={1.1}>View All Badges</Text>
                        </Pressable>
                    </View>
                </View>

                {/* TABS */}
                <View style={{ paddingHorizontal: SIDE, marginTop: s(16) }}>
                    <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
                </View>

                {/* LIST */}
                <View style={styles.listCard}>
                    {list.length === 0 ? (
                        <Text style={styles.empty} maxFontSizeMultiplier={1.1}>Nothing here yet</Text>
                    ) : null}

                    {list.map((a, i) => (
                        <View key={a.key} style={[styles.row, i > 0 && styles.rowBorder]}>
                            <View style={[styles.icon, { backgroundColor: a.tint }]}>
                                <MaterialCommunityIcons name={a.icon as any} size={s(24)} color={a.color} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>{a.title}</Text>
                                <Text style={styles.sub} maxFontSizeMultiplier={1.1} numberOfLines={1}>{a.sub}</Text>
                            </View>

                            {a.done ? (
                                <View style={styles.right}>
                                    <View style={styles.completed}>
                                        <Text style={styles.completedText} maxFontSizeMultiplier={1.1}>Completed</Text>
                                    </View>
                                    <Text style={styles.xp} maxFontSizeMultiplier={1.1}>{a.xp} XP</Text>
                                </View>
                            ) : (
                                <View style={styles.right}>
                                    <Text style={styles.count} maxFontSizeMultiplier={1.1}>
                                        {a.progress}/{a.total}
                                    </Text>
                                    <View style={styles.track}>
                                        <View
                                            style={[
                                                styles.fill,
                                                { width: `${((a.progress ?? 0) / (a.total ?? 1)) * 100}%` },
                                            ]}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    progressCard: {
        marginHorizontal: SIDE,
        marginTop: s(6),
        padding: s(14),
        borderRadius: s(16),
        backgroundColor: "#FFF3E3",
        borderWidth: 1,
        borderColor: C.peachBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
    },
    medal: { width: s(120), height: s(120) },
    progressLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    progressValue: { fontFamily: "Fredoka_600SemiBold", fontSize: s(40), lineHeight: s(46), color: C.brown },
    progressSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    viewBtn: {
        marginTop: s(10),
        paddingHorizontal: s(16),
        paddingVertical: s(7),
        borderRadius: s(16),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.orange,
    },
    viewBtnText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },

    listCard: { ...cardStyle, marginHorizontal: SIDE, marginTop: s(14), paddingHorizontal: s(12) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(12), gap: s(12) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    icon: {
        width: s(44),
        height: s(44),
        borderRadius: s(22),
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    sub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(2) },

    right: { alignItems: "flex-end", minWidth: s(80) },
    completed: {
        paddingHorizontal: s(8),
        paddingVertical: s(2),
        borderRadius: s(6),
        backgroundColor: "#E4F3D6",
    },
    completedText: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: C.green },
    xp: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown, marginTop: s(6) },

    count: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    track: {
        width: s(78),
        height: s(4),
        borderRadius: s(2),
        backgroundColor: "#F0E4DD",
        marginTop: s(8),
        overflow: "hidden",
    },
    fill: { height: "100%", backgroundColor: C.orange },
    empty: {
        textAlign: "center",
        paddingVertical: s(24),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.muted,
    },
});