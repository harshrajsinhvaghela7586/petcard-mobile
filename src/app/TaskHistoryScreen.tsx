import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    FilterTabs,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import BottomNav, { useNavHeight } from "../components/BottomNav";

type Status = "done" | "missed" | "skipped";

type Item = {
    id: string;
    title: string;
    time: string;
    status: Status;
    xp: number;
    icon: string;
    color: string;
    tint: string;
    daysAgo: number; // 0 = today
};

const TABS = [
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "all", label: "All" },
];

const HEADINGS: Record<string, string> = {
    day: "Today, 20 May 2025",
    week: "This Week",
    month: "This Month",
    all: "All Time",
};

const LIMIT: Record<string, number> = { day: 0, week: 6, month: 30, all: 9999 };

const ITEMS: Item[] = [
    { id: "1", title: "Breakfast", time: "08:00 AM", status: "done", xp: 50, icon: "food-variant", color: "#5E9B2D", tint: "#EAF3DC", daysAgo: 0 },
    { id: "2", title: "Walk", time: "06:00 PM", status: "done", xp: 50, icon: "dog-service", color: "#FF7A00", tint: "#FFF0D6", daysAgo: 0 },
    { id: "3", title: "Medicine", time: "08:00 PM", status: "missed", xp: 0, icon: "pill", color: "#3B6FB6", tint: "#E6F0FA", daysAgo: 0 },
    { id: "4", title: "Brush Fur", time: "Every Sunday", status: "done", xp: 30, icon: "brush", color: "#7A5CFF", tint: "#F3EAFF", daysAgo: 0 },
    { id: "5", title: "Playtime", time: "04:00 PM", status: "done", xp: 40, icon: "tennis-ball", color: "#2E9C8A", tint: "#E3F4F1", daysAgo: 0 },
    { id: "6", title: "Vet Check", time: "02:00 PM", status: "skipped", xp: 0, icon: "shield-half-full", color: "#4A4A55", tint: "#ECECF0", daysAgo: 0 },
    { id: "7", title: "Breakfast", time: "08:00 AM", status: "done", xp: 50, icon: "food-variant", color: "#5E9B2D", tint: "#EAF3DC", daysAgo: 1 },
    { id: "8", title: "Walk", time: "06:00 PM", status: "done", xp: 50, icon: "dog-service", color: "#FF7A00", tint: "#FFF0D6", daysAgo: 3 },
    { id: "9", title: "Medicine", time: "08:00 PM", status: "done", xp: 40, icon: "pill", color: "#3B6FB6", tint: "#E6F0FA", daysAgo: 12 },
];

const dayLabel = (d: number) => (d === 0 ? "" : d === 1 ? " · Yesterday" : ` · ${d} days ago`);

export default function TaskHistoryScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState("day");
    if (!fontsLoaded) return null;

    const list = ITEMS.filter((i) => i.daysAgo <= LIMIT[tab]);
    const totalXp = list.reduce((sum, i) => sum + i.xp, 0);
    const completed = list.filter((i) => i.status === "done").length;

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Task History" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}
            >
                <View style={{ paddingHorizontal: SIDE }}>
                    <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
                </View>

                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>{HEADINGS[tab]}</Text>

                {/* LIST */}
                <View style={styles.listCard}>
                    {list.map((i, idx) => (
                        <View key={i.id} style={[styles.row, idx > 0 && styles.rowBorder]}>
                            <View style={[styles.icon, { backgroundColor: i.tint }]}>
                                <MaterialCommunityIcons name={i.icon as any} size={s(24)} color={i.color} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {i.title}
                                </Text>
                                <Text style={styles.sub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {i.time}
                                    {dayLabel(i.daysAgo)}
                                </Text>
                            </View>

                            {i.status === "done" ? (
                                <View style={styles.right}>
                                    <View style={styles.check}>
                                        <Ionicons name="checkmark" size={s(11)} color={C.white} />
                                    </View>
                                    <Text style={styles.xp} maxFontSizeMultiplier={1.1}>+{i.xp} XP</Text>
                                </View>
                            ) : (
                                <View style={styles.right}>
                                    <View
                                        style={[
                                            styles.statusPill,
                                            i.status === "missed" ? styles.missedPill : styles.skippedPill,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: i.status === "missed" ? C.red : C.muted },
                                            ]}
                                            maxFontSizeMultiplier={1.1}
                                        >
                                            {i.status === "missed" ? "Missed" : "Skipped"}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}

                    {list.length === 0 ? (
                        <Text style={styles.empty} maxFontSizeMultiplier={1.1}>No tasks here yet</Text>
                    ) : null}
                </View>

                {/* SUMMARY */}
                <View style={styles.summary}>
                    <View style={styles.sumRow}>
                        <View style={styles.sumLeft}>
                            <Text style={styles.sumLabel} maxFontSizeMultiplier={1.1}>Total XP Earned</Text>
                            <Image
                                source={require("../../assets/images/rewards/pawcoin.png")}
                                resizeMode="contain"
                                style={styles.sumCoin}
                            />
                        </View>
                        <Text style={styles.sumValue} maxFontSizeMultiplier={1.1}>{totalXp} XP</Text>
                    </View>

                    <View style={[styles.sumRow, { marginTop: s(18) }]}>
                        <Text style={styles.sumLabel} maxFontSizeMultiplier={1.1}>Tasks Completed</Text>
                        <Text style={styles.sumValue} maxFontSizeMultiplier={1.1}>
                            {completed} / {list.length}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <BottomNav active="tasks" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    heading: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
        marginTop: s(16),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },

    listCard: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(10) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(10), gap: s(12) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    icon: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    sub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(1) },

    right: { alignItems: "flex-end", gap: s(3), minWidth: s(58) },
    check: {
        width: s(18),
        height: s(18),
        borderRadius: s(9),
        backgroundColor: C.green,
        alignItems: "center",
        justifyContent: "center",
    },
    xp: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.green },
    statusPill: { paddingHorizontal: s(10), paddingVertical: s(3), borderRadius: s(10) },
    missedPill: { backgroundColor: "#FFE5E1" },
    skippedPill: { backgroundColor: "#F0EAE6" },
    statusText: { fontFamily: "Nunito_700Bold", fontSize: s(10) },
    empty: {
        textAlign: "center",
        paddingVertical: s(24),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.muted,
    },

    summary: {
        marginHorizontal: SIDE,
        marginTop: s(18),
        padding: s(18),
        borderRadius: s(16),
        backgroundColor: "#FFEBD9",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    sumLeft: { flexDirection: "row", alignItems: "center", gap: s(6) },
    sumLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    sumCoin: { width: s(18), height: s(18) },
    sumValue: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
});