import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import BottomNav, { useNavHeight } from "../components/BottomNav"

const { width, height } = Dimensions.get("window");
const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

/* Home screen wale hi colors */
const C = {
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
    green: "#5E9B2D",
    greenBg: "#EAF3DC",
    redBg: "#FFE5E1",
};

const FILTERS = ["All", "Care", "Health", "Training", "Other"];

const INITIAL_TASKS = [
    { key: "breakfast", title: "Breakfast", sub: "08:00 AM", icon: "food-variant", done: true },
    { key: "walk", title: "Walk", sub: "06:00 PM", icon: "dog-service", done: false },
    { key: "medicine", title: "Medicine", sub: "08:00 PM", icon: "pill", done: false },
    { key: "brush", title: "Brush Fur", sub: "Every Sunday", icon: "brush", done: false },
] as const;

const HISTORY = [
    { key: "h1", title: "Breakfast", sub: "08:00 AM", status: "Completed", icon: "food-variant", ok: true },
    { key: "h2", title: "Walk", sub: "06:00 PM", status: "Completed", icon: "dog-service", ok: true },
    { key: "h3", title: "Medicine", sub: "08:00 PM", status: "Missed", icon: "pill", ok: false },
    { key: "h4", title: "Brush Fur", sub: "Yesterday", status: "Completed", icon: "brush", ok: true },
] as const;

const MILESTONES = [3, 7, 14, 30];
const STREAK = 7;

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/* May 2025 -> 1 May Thursday, Monday-start grid => offset 3 */
const MONTH_LABEL = "May 2025";
const MONTH_OFFSET = 3;
const MONTH_DAYS = 31;

/* ------------------------------------------------------------------ */
function ProgressRing({ percent, size }: { percent: number; size: number }) {
    const stroke = size * 0.12;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.peach} strokeWidth={stroke} fill="none" />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={C.orange}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={`${circ} ${circ}`}
                    strokeDashoffset={circ * (1 - percent / 100)}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>
            <Text style={styles.ringText} maxFontSizeMultiplier={1.1}>
                {percent}%
            </Text>
        </View>
    );
}

function ProgressBar({ progress }: { progress: number }) {
    return (
        <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }]} />
        </View>
    );
}

/* ------------------------------------------------------------------ */
export default function TasksScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });

    const [filter, setFilter] = useState("All");
    const [selectedDay, setSelectedDay] = useState(20);
    const [tasks, setTasks] = useState<Record<string, boolean>>(
        INITIAL_TASKS.reduce<Record<string, boolean>>((acc, t) => {
            acc[t.key] = t.done;
            return acc;
        }, {})
    );

    const calendarCells = useMemo(() => {
        const cells: (number | null)[] = Array(MONTH_OFFSET).fill(null);
        for (let d = 1; d <= MONTH_DAYS; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);
        const rows: (number | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
        return rows;
    }, []);

    if (!fontsLoaded) return null;

    const total = 6;
    const completed = 4;
    const percent = Math.round((completed / total) * 100);

    const toggleTask = (key: string) => setTasks((p) => ({ ...p, [key]: !p[key] }));

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 140 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 560 * SCALE, left: -20 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <Pressable style={styles.iconButton}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={styles.titleBox}>
                        <Text style={styles.pageTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            My Tasks
                        </Text>
                        <Text style={styles.pageSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Keep Milo happy & healthy!
                        </Text>
                    </View>

                    <Pressable style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>3</Text>
                        </View>
                    </Pressable>
                </View>

                {/* TODAY'S PROGRESS */}
                <View style={[styles.card, styles.progressCard]}>
                    <Image
                        source={require("../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.progressPet}
                    />

                    <View style={styles.progressInfo}>
                        <View style={styles.progressTopRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    Today's Progress
                                </Text>
                                <Text style={styles.progressCount} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {completed} / {total} Tasks Completed
                                </Text>
                                <View style={{ marginTop: s(8) }}>
                                    <ProgressBar progress={completed / total} />
                                </View>
                            </View>
                            <ProgressRing percent={percent} size={s(58)} />
                        </View>

                        <View style={styles.encourage}>
                            <Text style={styles.encourageText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                You're doing great, Paw-rent!
                            </Text>
                        </View>
                    </View>
                </View>

                {/* FILTER CHIPS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                    style={{ flexGrow: 0 }}
                >
                    {FILTERS.map((f) => {
                        const active = f === filter;
                        return (
                            <Pressable
                                key={f}
                                onPress={() => setFilter(f)}
                                style={[styles.chip, active && styles.chipActive]}
                            >
                                <Text
                                    style={[styles.chipText, active && styles.chipTextActive]}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {f}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* TODAY'S TASKS LIST */}
                <View style={styles.listWrap}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Today's Tasks</Text>
                        <Pressable>
                            <Text style={styles.sectionActionText} maxFontSizeMultiplier={1.1}>Edit</Text>
                        </Pressable>
                    </View>

                    {INITIAL_TASKS.map((t) => {
                        const done = tasks[t.key];
                        return (
                            <Pressable
                                key={t.key}
                                onPress={() => toggleTask(t.key)}
                                style={[styles.card, styles.taskRow, done && styles.taskRowDone]}
                            >
                                <View style={styles.taskIcon}>
                                    <MaterialCommunityIcons name={t.icon as any} size={s(26)} color={C.orange} />
                                </View>

                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {t.title}
                                    </Text>
                                    <Text style={styles.taskSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {t.sub}
                                    </Text>
                                </View>

                                {done ? (
                                    <View style={styles.checkDone}>
                                        <Ionicons name="checkmark" size={s(14)} color={C.white} />
                                    </View>
                                ) : (
                                    <View style={styles.checkEmpty} />
                                )}

                                <Image
                                    source={require("../../assets/images/pets/huchiko.png")}
                                    resizeMode="contain"
                                    style={styles.taskPet}
                                />
                            </Pressable>
                        );
                    })}

                    {/* CREATE NEW TASK */}
                    <Pressable style={styles.createBtn}>
                        <Ionicons name="add" size={s(20)} color={C.white} />
                        <Text style={styles.createText} maxFontSizeMultiplier={1.1}>Create New Task</Text>
                    </Pressable>
                </View>

                {/* CALENDAR + STREAK */}
                <View style={styles.rowTwo}>
                    {/* calendar */}
                    <View style={[styles.card, styles.calendarCard]}>
                        <View style={styles.calHeader}>
                            <Ionicons name="chevron-back" size={s(14)} color={C.brown} />
                            <Text style={styles.calMonth} maxFontSizeMultiplier={1.1}>{MONTH_LABEL}</Text>
                            <Ionicons name="chevron-forward" size={s(14)} color={C.brown} />
                        </View>

                        <View style={styles.calRow}>
                            {WEEKDAYS.map((d, i) => (
                                <Text key={i} style={styles.calWeekday} maxFontSizeMultiplier={1}>{d}</Text>
                            ))}
                        </View>

                        {calendarCells.map((row, ri) => (
                            <View key={ri} style={styles.calRow}>
                                {row.map((d, ci) => {
                                    const sel = d === selectedDay;
                                    return (
                                        <Pressable
                                            key={ci}
                                            disabled={!d}
                                            onPress={() => d && setSelectedDay(d)}
                                            style={styles.calCellWrap}
                                        >
                                            {d ? (
                                                <View style={[styles.calCell, sel && styles.calCellActive]}>
                                                    <Text
                                                        style={[styles.calDay, sel && styles.calDayActive]}
                                                        maxFontSizeMultiplier={1}
                                                    >
                                                        {d}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    {/* streak */}
                    <View style={[styles.card, styles.streakCard]}>
                        <View style={styles.streakHeader}>
                            <MaterialCommunityIcons name="fire" size={s(18)} color={C.orange} />
                            <Text style={styles.streakTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                Task Streak
                            </Text>
                        </View>

                        <View style={styles.streakMid}>
                            <View>
                                <Text style={styles.streakNumber} maxFontSizeMultiplier={1.1}>{STREAK}</Text>
                                <Text style={styles.streakSub} maxFontSizeMultiplier={1.1}>Days in a row</Text>
                            </View>
                            <View style={styles.streakBubble}>
                                <Text style={styles.streakBubbleText} maxFontSizeMultiplier={1.1}>
                                    Woof!{"\n"}Keep it up!
                                </Text>
                            </View>
                        </View>

                        <Image
                            source={require("../../assets/images/pets/huchiko.png")}
                            resizeMode="contain"
                            style={styles.streakPet}
                        />

                        <Text style={styles.milestoneLabel} maxFontSizeMultiplier={1.1}>Streak Milestones</Text>
                        <View style={styles.milestoneRow}>
                            <View style={styles.milestoneLine} />
                            {MILESTONES.map((m) => {
                                const reached = STREAK >= m;
                                return (
                                    <View key={m} style={styles.milestoneItem}>
                                        <View style={[styles.milestoneDot, reached && styles.milestoneDotActive]}>
                                            {reached ? (
                                                <Ionicons name="checkmark" size={s(8)} color={C.white} />
                                            ) : null}
                                        </View>
                                        <Text style={styles.milestoneNum} maxFontSizeMultiplier={1}>{m}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* TASK HISTORY */}
                <View style={styles.listWrap}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Task History</Text>
                        <Pressable style={styles.sectionAction}>
                            <Text style={styles.sectionActionText} maxFontSizeMultiplier={1.1}>View All</Text>
                            <Ionicons name="chevron-forward" size={s(13)} color={C.orange} />
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: s(8) }}
                    >
                        {HISTORY.map((h) => (
                            <View
                                key={h.key}
                                style={[
                                    styles.historyCard,
                                    { backgroundColor: h.ok ? C.greenBg : C.redBg },
                                ]}
                            >
                                <View style={styles.historyTop}>
                                    <MaterialCommunityIcons name={h.icon as any} size={s(22)} color={C.orange} />
                                    <View style={{ flex: 1, marginLeft: s(6) }}>
                                        <Text style={styles.historyTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {h.title}
                                        </Text>
                                        <Text style={styles.historySub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {h.sub}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.statusPill, { backgroundColor: h.ok ? "#D6EAB8" : "#FFC9C1" }]}>
                                    <Text
                                        style={[styles.statusText, { color: h.ok ? C.green : C.red }]}
                                        maxFontSizeMultiplier={1}
                                    >
                                        {h.status}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <BottomNav active="tasks" />
        </View>
    );
}

/* ------------------------------------------------------------------ */
const SIDE = s(14);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    backgroundPaw: {
        position: "absolute",
        width: 92 * SCALE,
        height: 92 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    card: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(16),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.08,
        shadowRadius: s(6),
        elevation: 2,
    },

    /* top bar */
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        gap: s(8),
    },
    iconButton: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    titleBox: { flex: 1, alignItems: "center" },
    pageTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        lineHeight: s(28),
        color: C.brown,
    },
    pageSub: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: C.brown,
    },
    badge: {
        position: "absolute",
        top: s(-5),
        right: s(-5),
        minWidth: s(17),
        height: s(17),
        borderRadius: s(9),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: C.white,
    },
    badgeText: { fontFamily: "Nunito_700Bold", fontSize: s(9), color: C.white },

    /* progress card */
    progressCard: {
        marginHorizontal: SIDE,
        marginTop: s(14),
        padding: s(10),
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
    },
    progressPet: { width: s(100), height: s(100) },
    progressInfo: { flex: 1 },
    progressTopRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    cardTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    progressCount: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown, marginTop: s(2) },
    ringText: { fontFamily: "Fredoka_600SemiBold", fontSize: s(14), color: C.brown },
    encourage: {
        marginTop: s(8),
        borderRadius: s(10),
        backgroundColor: C.peach,
        paddingVertical: s(5),
        paddingHorizontal: s(8),
    },
    encourageText: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.brown },

    barTrack: { height: s(6), borderRadius: s(3), backgroundColor: C.peach, overflow: "hidden" },
    barFill: { height: "100%", borderRadius: s(3), backgroundColor: C.orange },

    /* chips */
    chipRow: {
        paddingHorizontal: SIDE,
        paddingVertical: s(12),
        gap: s(8),
    },
    chip: {
        paddingHorizontal: s(18),
        height: s(36),
        borderRadius: s(18),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    chipActive: { backgroundColor: C.orange, borderColor: C.orange },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    chipTextActive: { color: C.white },

    /* list */
    listWrap: { paddingHorizontal: SIDE, marginTop: s(4) },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: s(10),
    },
    sectionTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    sectionAction: { flexDirection: "row", alignItems: "center" },
    sectionActionText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },

    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(8),
        paddingHorizontal: s(10),
        marginBottom: s(8),
        borderLeftWidth: 3,
        borderLeftColor: C.orange,
    },
    taskRowDone: { backgroundColor: "#FFF3E6", borderColor: C.orange },
    taskIcon: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        marginRight: s(10),
    },
    taskInfo: { flex: 1 },
    taskTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    taskSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(1) },
    checkDone: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    checkEmpty: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        borderWidth: 1.5,
        borderColor: C.muted,
        backgroundColor: C.white,
    },
    taskPet: { width: s(46), height: s(46), marginLeft: s(6) },

    createBtn: {
        height: s(48),
        borderRadius: s(14),
        backgroundColor: C.orange,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(6),
        marginTop: s(4),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(4) },
        shadowOpacity: 0.3,
        shadowRadius: s(8),
        elevation: 5,
    },
    createText: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.white },

    /* calendar + streak */
    rowTwo: {
        flexDirection: "row",
        paddingHorizontal: SIDE,
        marginTop: s(14),
        gap: s(8),
    },
    calendarCard: { flex: 1, padding: s(10) },
    calHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: s(6),
    },
    calMonth: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    calRow: { flexDirection: "row", justifyContent: "space-between" },
    calWeekday: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(9),
        color: C.muted,
        marginBottom: s(3),
    },
    calCellWrap: { flex: 1, alignItems: "center", justifyContent: "center", height: s(22) },
    calCell: {
        width: s(20),
        height: s(20),
        borderRadius: s(10),
        alignItems: "center",
        justifyContent: "center",
    },
    calCellActive: { backgroundColor: C.orange },
    calDay: { fontFamily: "Nunito_600SemiBold", fontSize: s(9), color: C.brown },
    calDayActive: { color: C.white, fontFamily: "Nunito_700Bold" },

    streakCard: { flex: 1, padding: s(10) },
    streakHeader: { flexDirection: "row", alignItems: "center", gap: s(4) },
    streakTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(14), color: C.brown },
    streakMid: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: s(2),
    },
    streakNumber: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(40),
        lineHeight: s(46),
        color: C.orange,
    },
    streakSub: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: C.brown },
    streakBubble: {
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(10),
        paddingVertical: s(3),
        paddingHorizontal: s(6),
        marginTop:-19,
        marginRight:-7,
    },
    streakBubbleText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(9),
        color: C.brown,
        textAlign: "center",
    },
    streakPet: {
        position: "absolute",
        right: s(4),
        top: s(48),
        width: s(66),
        height: s(66),
    },
    milestoneLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(10),
        color: C.brown,
        marginTop: s(30),
        marginBottom: s(6),
    },
    milestoneRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    milestoneLine: {
        position: "absolute",
        left: s(6),
        right: s(6),
        top: s(6),
        height: s(3),
        borderRadius: s(2),
        backgroundColor: C.peach,
    },
    milestoneItem: { alignItems: "center", gap: s(2) },
    milestoneDot: {
        width: s(14),
        height: s(14),
        borderRadius: s(7),
        backgroundColor: C.peach,
        borderWidth: 1.5,
        borderColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    milestoneDotActive: { backgroundColor: C.orange },
    milestoneNum: { fontFamily: "Nunito_700Bold", fontSize: s(9), color: C.muted },

    /* history */
    historyCard: {
        width: s(128),
        borderRadius: s(14),
        padding: s(10),
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    historyTop: { flexDirection: "row", alignItems: "center" },
    historyTitle: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
    historySub: { fontFamily: "Nunito_600SemiBold", fontSize: s(10), color: C.muted },
    statusPill: {
        alignSelf: "flex-start",
        marginTop: s(8),
        paddingHorizontal: s(8),
        paddingVertical: s(2),
        borderRadius: s(8),
    },
    statusText: { fontFamily: "Nunito_700Bold", fontSize: s(10) },
});