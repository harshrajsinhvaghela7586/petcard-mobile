import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { C, Shell, s } from "../../components/TrackKit";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

type Ev = {
    key: string;
    title: string;
    sub: string;
    tint: string;
    icon: string;
    color: string;
    paw?: boolean;
    tag?: string;
};

const EVENTS: Ev[] = [
    { key: "vac", title: "Vaccination (DHPP)", sub: "Vet Clinic", tint: "#E9E1FF", icon: "needle", color: "#6A4FD6", tag: "In 3 days" },
    { key: "walk", title: "Walk", sub: "Outdoor walk", tint: "#EAF3DC", icon: "paw", color: "#5E9B2D", paw: true },
    { key: "med", title: "Medicine", sub: "PM Heartworm medicine", tint: C.peach, icon: "pill", color: C.orange },
    { key: "groom", title: "Grooming", sub: "Brush fur", tint: "#FFE3EE", icon: "brush", color: "#E0457B" },
];

export default function CalendarScreen() {
    const [view, setView] = useState({ y: 2025, m: 4 });
    const [selected, setSelected] = useState(20);
    const [events, setEvents] = useState<Ev[]>(EVENTS);

    /* Monday-first grid with muted leading/trailing days */
    const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    const dim = new Date(view.y, view.m + 1, 0).getDate();
    const prevDim = new Date(view.y, view.m, 0).getDate();
    const cells: { d: number; cur: boolean }[] = [];
    for (let i = first - 1; i >= 0; i--) cells.push({ d: prevDim - i, cur: false });
    for (let d = 1; d <= dim; d++) cells.push({ d, cur: true });
    let n = 1;
    while (cells.length % 7 !== 0) cells.push({ d: n++, cur: false });

    const move = (delta: number) =>
        setView((v) => {
            const d = new Date(v.y, v.m + delta, 1);
            return { y: d.getFullYear(), m: d.getMonth() };
        });

    const addEvent = () =>
        setEvents((p) => [
            ...p,
            { key: String(Date.now()), title: "New Event", sub: `${selected} ${MONTHS[view.m]}`, tint: C.peach, icon: "calendar-star", color: C.orange },
        ]);

    return (
        <Shell title="Calendar" footer={{ title: "+ Add Event", onPress: addEvent }}>
            <View style={styles.calCard}>
                <View style={styles.monthRow}>
                    <Pressable onPress={() => move(-1)} hitSlop={10}>
                        <Ionicons name="chevron-back" size={s(18)} color={C.brown} />
                    </Pressable>
                    <Text style={styles.month} maxFontSizeMultiplier={1.1}>
                        {MONTHS[view.m]} {view.y}
                    </Text>
                    <Pressable onPress={() => move(1)} hitSlop={10}>
                        <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
                    </Pressable>
                </View>

                <View style={styles.weekRow}>
                    {DAYS.map((d) => (
                        <Text key={d} style={styles.weekText} maxFontSizeMultiplier={1}>
                            {d}
                        </Text>
                    ))}
                </View>

                <View style={styles.grid}>
                    {cells.map((c, i) => {
                        const active = c.cur && c.d === selected;
                        return (
                            <Pressable key={i} disabled={!c.cur} onPress={() => setSelected(c.d)} style={styles.cell}>
                                <View style={[styles.dayBox, active && styles.dayActive]}>
                                    <Text
                                        style={[
                                            styles.dayText,
                                            !c.cur && { color: C.muted, opacity: 0.4 },
                                            active && { color: C.white },
                                        ]}
                                        maxFontSizeMultiplier={1}
                                    >
                                        {c.d}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <View style={{ width: "100%", marginTop: s(16) }}>
                {events.map((e) => (
                    <View key={e.key} style={styles.event}>
                        <View style={[styles.eventIcon, { backgroundColor: e.tint }]}>
                            {e.paw ? (
                                <Image
                                    source={require("../../../assets/images/paw.png")}
                                    resizeMode="contain"
                                    style={[styles.eventPaw, { tintColor: e.color }]}
                                />
                            ) : (
                                <MaterialCommunityIcons name={e.icon as any} size={s(24)} color={e.color} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.eventTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {e.title}
                            </Text>
                            <Text style={styles.eventSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {e.sub}
                            </Text>
                        </View>
                        {e.tag ? (
                            <View style={styles.tag}>
                                <Text style={styles.tagText} maxFontSizeMultiplier={1}>
                                    {e.tag}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ))}
            </View>
        </Shell>
    );
}

const styles = StyleSheet.create({
    calCard: {
        width: "100%",
        marginTop: s(10),
        paddingVertical: s(14),
        paddingHorizontal: s(12),
        borderRadius: s(22),
        backgroundColor: C.cardLight,
        borderWidth: 1,
        borderColor: C.peach,
    },
    monthRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(6),
        marginBottom: s(10),
    },
    month: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    weekRow: { flexDirection: "row", marginBottom: s(4) },
    weekText: { flex: 1, textAlign: "center", fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.muted },
    grid: { flexDirection: "row", flexWrap: "wrap" },
    cell: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: s(4) },
    dayBox: { width: s(36), height: s(36), borderRadius: s(10), alignItems: "center", justifyContent: "center" },
    dayActive: { backgroundColor: C.orange },
    dayText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },

    event: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        padding: s(8),
        marginBottom: s(8),
        borderRadius: s(14),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peach,
    },
    eventIcon: { width: s(44), height: s(44), borderRadius: s(12), alignItems: "center", justifyContent: "center" },
    eventPaw: { width: s(24), height: s(24) },
    eventTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    eventSub: { fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.muted },
    tag: { paddingHorizontal: s(10), paddingVertical: s(4), borderRadius: s(10), backgroundColor: "#E9E1FF" },
    tagText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: "#6A4FD6" },
});