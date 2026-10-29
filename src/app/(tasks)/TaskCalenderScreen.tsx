import PrimaryButton from "@/components/Button/PrimaryButton";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

const { width, height } = Dimensions.get("window");

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/* Mock "aaj" ki date (design jaisi). Real app me: new Date() */
const TODAY = new Date(2025, 4, 20);

/* Design me jin dino pe chhota dot hai (mock) */
const MARKED_DAYS = [1, 6, 8, 12, 13, 14, 15, 19];

const EVENTS = [
    { key: "breakfast", time: "08:00 AM", title: "Breakfast" },
    { key: "playtime", time: "04:00 PM", title: "Playtime" },
    { key: "walk", time: "06:00 PM", title: "Walk" },
    { key: "medicine", time: "08:00 PM", title: "Medicine" },
];

const keyOf = (y: number, m: number, d: number) => `${y}-${m}-${d}`;
const TODAY_KEY = keyOf(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

export default function TaskCalenderScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();

    const [view, setView] = useState({ y: TODAY.getFullYear(), m: TODAY.getMonth() });
    const [selected, setSelected] = useState(TODAY_KEY);
    const [done, setDone] = useState<Record<string, boolean>>({
        [`${TODAY_KEY}:breakfast`]: true,
        [`${TODAY_KEY}:playtime`]: true,
    });

    const rows = useMemo(() => {
        const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday start
        const count = new Date(view.y, view.m + 1, 0).getDate();
        const cells: (number | null)[] = Array(offset).fill(null);
        for (let d = 1; d <= count; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);
        const out: (number | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
        return out;
    }, [view]);

    if (!fontsLoaded) return null;

    const changeMonth = (delta: number) =>
        setView((p) => {
            const d = new Date(p.y, p.m + delta, 1);
            return { y: d.getFullYear(), m: d.getMonth() };
        });

    const goToday = () => {
        setView({ y: TODAY.getFullYear(), m: TODAY.getMonth() });
        setSelected(TODAY_KEY);
    };

    const [sy, sm, sd] = selected.split("-").map(Number);
    const selDate = new Date(sy, sm, sd);
    const selLabel = `${DAYS[selDate.getDay()]}, ${sd} ${MONTHS[sm]} ${sy}`;

    const toggle = (k: string) => setDone((p) => ({ ...p, [`${selected}:${k}`]: !p[`${selected}:${k}`] }));

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Calendar" rightLabel="Today" onRightPress={goToday} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(90) }}
            >
                {/* MONTH SWITCHER */}
                <View style={styles.monthRow}>
                    <Pressable onPress={() => changeMonth(-1)} hitSlop={12}>
                        <Ionicons name="chevron-back" size={s(22)} color={C.brown} />
                    </Pressable>
                    <Text style={styles.month} maxFontSizeMultiplier={1.1}>
                        {MONTHS[view.m]} {view.y}
                    </Text>
                    <Pressable onPress={() => changeMonth(1)} hitSlop={12}>
                        <Ionicons name="chevron-forward" size={s(22)} color={C.brown} />
                    </Pressable>
                </View>

                {/* GRID */}
                <View style={styles.grid}>
                    <View style={styles.gridRow}>
                        {WEEKDAYS.map((w, i) => (
                            <Text key={i} style={styles.weekday} maxFontSizeMultiplier={1}>{w}</Text>
                        ))}
                    </View>

                    {rows.map((row, ri) => (
                        <View key={ri} style={styles.gridRow}>
                            {row.map((d, ci) => {
                                if (!d) return <View key={ci} style={styles.cellWrap} />;
                                const k = keyOf(view.y, view.m, d);
                                const sel = k === selected;
                                const isToday = k === TODAY_KEY;
                                const marked = MARKED_DAYS.includes(d);
                                return (
                                    <Pressable key={ci} style={styles.cellWrap} onPress={() => setSelected(k)}>
                                        <View
                                            style={[
                                                styles.cell,
                                                isToday && !sel && styles.cellToday,
                                                sel && styles.cellSel,
                                            ]}
                                        >
                                            <Text
                                                style={[styles.day, sel && styles.daySel]}
                                                maxFontSizeMultiplier={1}
                                            >
                                                {d}
                                            </Text>
                                        </View>
                                        {marked && !sel ? <View style={styles.dot} /> : null}
                                    </Pressable>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* EVENTS */}
                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>{selLabel}</Text>

                <View style={{ paddingHorizontal: SIDE }}>
                    {EVENTS.map((e) => {
                        const isDone = !!done[`${selected}:${e.key}`];
                        return (
                            <Pressable key={e.key} onPress={() => toggle(e.key)} style={styles.event}>
                                <View style={[styles.timePill, isDone ? styles.timeDone : styles.timeTodo]}>
                                    <Text
                                        style={[styles.timeText, { color: isDone ? C.green : C.orange }]}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        {e.time}
                                    </Text>
                                </View>
                                <Text style={styles.eventTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {e.title}
                                </Text>
                                {isDone ? (
                                    <View style={styles.checkOn}>
                                        <Ionicons name="checkmark" size={s(13)} color={C.white} />
                                    </View>
                                ) : (
                                    <View style={styles.checkOff} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            {/* ADD EVENT */}
            <View style={[styles.bottomSection, { bottom: NAV_HEIGHT + s(6) }]}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Add Event / Task"
                        onPress={() => router.push("/CreateTaskScreen" as any)}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>

            <BottomNav active="tasks" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    monthRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SIDE + s(10),
        marginTop: s(4),
    },
    month: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },

    grid: { paddingHorizontal: SIDE, marginTop: s(12) },
    gridRow: { flexDirection: "row" },
    weekday: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        color: C.brown,
        marginBottom: s(8),
    },
    cellWrap: { flex: 1, height: s(44), alignItems: "center", justifyContent: "center" },
    cell: {
        width: s(34),
        height: s(34),
        borderRadius: s(17),
        alignItems: "center",
        justifyContent: "center",
    },
    cellToday: { borderWidth: 1.5, borderColor: C.orange },
    cellSel: { backgroundColor: C.orange },
    day: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    daySel: { color: C.white },
    dot: {
        position: "absolute",
        bottom: s(2),
        width: s(4),
        height: s(4),
        borderRadius: s(2),
        backgroundColor: C.orange,
    },

    heading: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        color: C.brown,
        marginTop: s(14),
        marginBottom: s(10),
        paddingHorizontal: SIDE + s(2),
    },

    event: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        paddingVertical: s(10),
        paddingHorizontal: s(10),
        marginBottom: s(8),
        borderRadius: s(12),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    timePill: {
        width: s(76),
        paddingVertical: s(6),
        borderRadius: s(8),
        alignItems: "center",
        borderWidth: 1,
    },
    timeDone: { backgroundColor: "#EAF3DC", borderColor: "#CFE5B5" },
    timeTodo: { backgroundColor: "#FFF0D6", borderColor: "#FFD9A8" },
    timeText: { fontFamily: "Nunito_700Bold", fontSize: s(11) },
    eventTitle: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    checkOn: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        backgroundColor: C.green,
        alignItems: "center",
        justifyContent: "center",
    },
    checkOff: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        borderWidth: 1.5,
        borderColor: C.muted,
        backgroundColor: C.white,
    },

    /* bottom button: same as PetTypeScreen (nav ke upar) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingHorizontal: width * 0.02,
        alignItems: "center",
    },
    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
    },
    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },
});