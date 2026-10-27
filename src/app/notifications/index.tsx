import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

type Kind = "reminders" | "updates" | "offers";

type Notif = {
    id: string;
    group: string;
    kind: Kind;
    title: string;
    sub: string;
    time: string;
    icon: string;
    color: string;
    tint: string;
    unread: boolean;
};

const TABS = [
    { key: "all", label: "All" },
    { key: "reminders", label: "Reminders" },
    { key: "updates", label: "Updates" },
    { key: "offers", label: "Offers" },
];

const INITIAL: Notif[] = [
    { id: "1", group: "Today", kind: "reminders", title: "Food Reminder", sub: "It's time for Milo's breakfast", time: "08:00 AM", icon: "bowl-mix", color: "#FF7A00", tint: "#FFF0D6", unread: true },
    { id: "2", group: "Today", kind: "reminders", title: "Vet Appointment", sub: "Milo's vet visit is tomorrow", time: "07:30 AM", icon: "stethoscope", color: "#FF4B32", tint: "#FFE5E1", unread: true },
    { id: "3", group: "Today", kind: "updates", title: "Task Completed", sub: "Great job! You completed Walk", time: "06:00 AM", icon: "check-circle", color: "#5E9B2D", tint: "#EAF3DC", unread: true },
    { id: "4", group: "Yesterday", kind: "updates", title: "New Achievement", sub: "You unlocked \"Task Master\" badge", time: "Yesterday", icon: "medal", color: "#E08A00", tint: "#FFF0D6", unread: true },
    { id: "5", group: "Yesterday", kind: "updates", title: "Health Record Added", sub: "Milo's vaccination record added", time: "Yesterday", icon: "clipboard-pulse", color: "#3B6FB6", tint: "#E6F0FA", unread: false },
    { id: "6", group: "Yesterday", kind: "updates", title: "Weekly Summary", sub: "Tap to see Milo's weekly report", time: "Yesterday", icon: "chart-box", color: "#7A5CFF", tint: "#F3EAFF", unread: false },
    { id: "7", group: "18 May 2025", kind: "offers", title: "Promotional Offer", sub: "Get 15% off on pet food", time: "18 May", icon: "tag", color: "#FF4B32", tint: "#FFE5E1", unread: false },
];

export default function NotificationsScreen() {
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState("all");
    const [items, setItems] = useState<Notif[]>(INITIAL);
    if (!fontsLoaded) return null;

    const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    const markOne = (id: string) =>
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

    const filtered = items.filter((n) => tab === "all" || n.kind === tab);
    const groups = Array.from(new Set(filtered.map((n) => n.group)));

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Notifications" rightLabel="Mark all as read" onRightPress={markAll} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(40) }}>
                <View style={{ paddingHorizontal: SIDE, marginTop: s(4) }}>
                    <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
                </View>

                {groups.length === 0 ? (
                    <Text style={styles.empty} maxFontSizeMultiplier={1.1}>No notifications here</Text>
                ) : null}

                {groups.map((g) => (
                    <View key={g}>
                        <Text style={styles.groupTitle} maxFontSizeMultiplier={1.1}>{g}</Text>
                        <View style={styles.card}>
                            {filtered
                                .filter((n) => n.group === g)
                                .map((n, i) => (
                                    <Pressable
                                        key={n.id}
                                        onPress={() => markOne(n.id)}
                                        style={[styles.row, i > 0 && styles.rowBorder]}
                                    >
                                        <View style={[styles.icon, { backgroundColor: n.tint }]}>
                                            <MaterialCommunityIcons name={n.icon as any} size={s(22)} color={n.color} />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.title}
                                            </Text>
                                            <Text style={styles.sub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.sub}
                                            </Text>
                                        </View>

                                        <View style={styles.right}>
                                            <Text style={styles.time} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.time}
                                            </Text>
                                            <View style={[styles.dot, !n.unread && styles.dotRead]} />
                                        </View>
                                    </Pressable>
                                ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    groupTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
        marginTop: s(18),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },
    card: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(10) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(11), gap: s(10) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    icon: {
        width: s(40),
        height: s(40),
        borderRadius: s(20),
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    sub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(2) },
    right: { flexDirection: "row", alignItems: "center", gap: s(8) },
    time: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
    dot: { width: s(9), height: s(9), borderRadius: s(5), backgroundColor: C.orange },
    dotRead: { backgroundColor: "#EADDD5" },
    empty: {
        textAlign: "center",
        marginTop: s(60),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),
        color: C.muted,
    },
});