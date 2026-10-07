import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

/*
 * RESPONSIVE HELPER (same as other screens)
 * Small phones -> shrink proportionally
 * Big phones   -> capped at 1.3
 */
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

/* ------------------------------------------------------------------
 * COLORS (only the ones already used in the reference screens)
 * ------------------------------------------------------------------ */
const C = {
    orange: "#FF7A00",
    orangeDeep: "#FF6F00",
    brown: "#382018",
    brownSoft: "#3B241B",
    muted: "#8F7365",
    iconMuted: "#8B6D5C",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    peachLight: "#FFDCC2",
    card: "#FFFCFA",
    white: "#FFFFFF",
    divider: "#F0E4DD",
    red: "#FF4B32",
};

/* ------------------------------------------------------------------
 * DATA
 * ------------------------------------------------------------------ */
const WEEK = [
    { d: "M", done: true },
    { d: "T", done: true },
    { d: "W", done: true },
    { d: "T", done: true },
    { d: "F", done: true },
    { d: "S", done: false },
    { d: "S", done: false },
];

const STATS = [
    { key: "food", label: "Food", value: "150", total: "300 g", progress: 0.5, icon: "bowl-mix" },
    { key: "water", label: "Water", value: "400", total: "500 ml", progress: 0.8, icon: "water" },
    { key: "activity", label: "Activity", value: "30", total: "60 min", progress: 0.5, icon: "shoe-sneaker" },
    { key: "care", label: "Care Score", value: "85", total: "100", progress: 0.85, icon: "heart" },
] as const;

const TASKS = [
    { key: "breakfast", title: "Breakfast", sub: "08:00 AM", icon: "food-variant", done: true },
    { key: "walk", title: "Walk", sub: "06:00 PM", icon: "dog-service", done: false },
    { key: "medicine", title: "Medicine", sub: "08:00 PM", icon: "pill", done: false },
    { key: "brush", title: "Brush Fur", sub: "Every Sun", icon: "brush", done: false },
] as const;

const UPCOMING = [
    {
        key: "vaccination",
        icon: "needle",
        title: "Vaccination",
        tag: "DHPP",
        date: "25 May 2025  •  10:30 AM",
        when: "In 3 days",
        whenColor: C.orange,
    },
    {
        key: "vet",
        icon: "paw",
        title: "Vet Check-up",
        tag: undefined,
        date: "02 Jun 2025  •  11:00 AM",
        when: "In 11 days",
        whenColor: "#5E9B2D",
    },
] as const;

const QUICK = [
    { key: "add", label: "Add Task", icon: "plus" },
    { key: "qr", label: "Scan QR", icon: "qrcode-scan" },
    { key: "clicker", label: "Clicker", icon: "gesture-tap-button" },
    { key: "whistle", label: "Whistle", icon: "bullhorn-outline" },
    { key: "chat", label: "AI Chat", icon: "robot-happy-outline" },
] as const;

/* ------------------------------------------------------------------
 * SMALL REUSABLE PIECES
 * ------------------------------------------------------------------ */
function ProgressBar({ progress }: { progress: number }) {
    return (
        <View style={styles.barTrack}>
            <View
                style={[
                    styles.barFill,
                    { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
                ]}
            />
        </View>
    );
}

function SectionHeader({
    title,
    action,
    onPress,
}: {
    title: string;
    action: string;
    onPress?: () => void;
}) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>
                {title}
            </Text>
            <Pressable onPress={onPress} style={styles.sectionAction}>
                <Text style={styles.sectionActionText} maxFontSizeMultiplier={1.1}>
                    {action}
                </Text>
                <Ionicons name="chevron-forward" size={s(13)} color={C.orange} />
            </Pressable>
        </View>
    );
}

/* ------------------------------------------------------------------
 * SCREEN
 * ------------------------------------------------------------------ */
export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    const [tab, setTab] = useState<"home" | "tasks" | "know" | "profile">("home");
    const [tasks, setTasks] = useState(
        TASKS.reduce<Record<string, boolean>>((acc, t) => {
            acc[t.key] = t.done;
            return acc;
        }, {})
    );

    if (!fontsLoaded) {
        return null;
    }

    const NAV_HEIGHT = s(64) + insets.bottom;

    const toggleTask = (key: string) =>
        setTasks((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <View style={styles.container}>
            {/* ==============================
                BACKGROUND PAWS
            ============================== */}
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawMiddleLeft]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + s(8),
                    paddingBottom: NAV_HEIGHT + s(24),
                }}
            >
                {/* ==============================
                    TOP BAR
                ============================== */}
                <View style={styles.topBar}>
                    <Pressable style={styles.menuButton}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Good morning, Amber! 👋
                        </Text>
                        <Text style={styles.heading} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            How's Milo today?
                        </Text>
                    </View>

                    <Pressable style={styles.bellButton}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>
                                3
                            </Text>
                        </View>
                    </Pressable>

                    <View style={styles.xpPill}>
                        <View style={styles.xpCoin}>
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.xpCoinPaw}
                            />
                        </View>
                        <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>
                            XP 1,250
                        </Text>
                    </View>
                </View>

                {/* ==============================
                    STREAK + LEVEL
                ============================== */}
                <View style={styles.rowTwo}>
                    <View style={[styles.card, styles.streakCard]}>
                        <View style={styles.streakTop}>
                            <MaterialCommunityIcons name="fire" size={s(32)} color={C.orange} />
                            <Text style={styles.streakNumber} maxFontSizeMultiplier={1.1}>
                                7
                            </Text>
                            <Text style={styles.streakLabel} maxFontSizeMultiplier={1.1}>
                                Day Streak
                            </Text>
                        </View>

                        <View style={styles.weekRow}>
                            {WEEK.map((w, i) => (
                                <View key={i} style={styles.weekItem}>
                                    <Text style={styles.weekLetter} maxFontSizeMultiplier={1}>
                                        {w.d}
                                    </Text>
                                    {w.done ? (
                                        <View style={styles.weekDotDone}>
                                            <Ionicons name="checkmark" size={s(10)} color={C.white} />
                                        </View>
                                    ) : (
                                        <View style={styles.weekDotEmpty} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.card, styles.levelCard]}>
                        <View style={styles.levelBadge}>
                            <MaterialCommunityIcons name="shield-star" size={s(26)} color={C.orange} />
                        </View>

                        <View style={styles.levelInfo}>
                            <View style={styles.levelTop}>
                                <Text style={styles.levelTitle} maxFontSizeMultiplier={1.1}>
                                    Level 4
                                </Text>
                                <Text style={styles.levelXp} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    1,250 / 2,000 XP
                                </Text>
                            </View>
                            <ProgressBar progress={1250 / 2000} />
                        </View>
                    </View>
                </View>

                {/* ==============================
                    HERO (PET)
                    Background image idea: drop your living-room
                    illustration in assets/images/dashboard and
                    replace the heroScene View with an <Image>.
                ============================== */}
                <View style={styles.hero}>
                    <View style={styles.heroScene} />
                    <View style={styles.heroFloor} />

                    {/* sofa / decor placeholders */}
                    <View style={styles.sofa} />
                    <View style={styles.lamp} />
                    <View style={styles.cabinet} />

                    {/* PET */}
                    <Image
                        source={require("../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.heroPet}
                    />

                    {/* SPEECH BUBBLE */}
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleSmall} maxFontSizeMultiplier={1.1}>
                            I'm feeling
                        </Text>
                        <Text style={styles.bubbleMood} maxFontSizeMultiplier={1.1}>
                            Happy! 😊
                        </Text>
                    </View>

                    {/* ASK AI */}
                    <Pressable style={styles.askAi}>
                        <MaterialCommunityIcons name="robot-happy" size={s(30)} color="#7A5CFF" />
                        <Text style={styles.askAiText} maxFontSizeMultiplier={1.1}>
                            Ask AI
                        </Text>
                    </Pressable>
                </View>

                {/* ==============================
                    STATS
                ============================== */}
                <View style={[styles.card, styles.statsCard]}>
                    {STATS.map((st) => (
                        <View key={st.key} style={styles.statItem}>
                            <Text style={styles.statLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {st.label}
                            </Text>

                            <View style={styles.statValueRow}>
                                <MaterialCommunityIcons
                                    name={st.icon as any}
                                    size={s(24)}
                                    color={C.orange}
                                />
                                <Text style={styles.statValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {st.value}
                                    <Text style={styles.statTotal}> / {st.total}</Text>
                                </Text>
                            </View>

                            <ProgressBar progress={st.progress} />
                        </View>
                    ))}
                </View>

                {/* ==============================
                    TODAY'S TASKS
                ============================== */}
                <View style={[styles.card, styles.sectionCard]}>
                    <SectionHeader title="Today's Tasks" action="View All" />

                    <View style={styles.taskRow}>
                        {TASKS.map((t) => {
                            const done = tasks[t.key];
                            return (
                                <Pressable
                                    key={t.key}
                                    onPress={() => toggleTask(t.key)}
                                    style={[styles.taskCard, done && styles.taskCardDone]}
                                >
                                    <MaterialCommunityIcons
                                        name={t.icon as any}
                                        size={s(30)}
                                        color={C.orange}
                                    />
                                    <Text style={styles.taskTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {t.title}
                                    </Text>
                                    <Text style={styles.taskSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {t.sub}
                                    </Text>

                                    {done ? (
                                        <View style={styles.checkDone}>
                                            <Ionicons name="checkmark" size={s(13)} color={C.white} />
                                        </View>
                                    ) : (
                                        <View style={styles.checkEmpty} />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* ==============================
                    UPCOMING
                ============================== */}
                <View style={[styles.card, styles.sectionCard]}>
                    <SectionHeader title="Upcoming" action="View Calendar" />

                    {UPCOMING.map((u, index) => (
                        <Pressable
                            key={u.key}
                            style={[
                                styles.upcomingRow,
                                index > 0 && styles.upcomingRowBorder,
                            ]}
                        >
                            <View style={styles.upcomingIcon}>
                                <MaterialCommunityIcons
                                    name={u.icon as any}
                                    size={s(20)}
                                    color={C.orange}
                                />
                            </View>

                            <View style={styles.upcomingInfo}>
                                <View style={styles.upcomingTitleRow}>
                                    <Text style={styles.upcomingTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {u.title}
                                    </Text>
                                    {u.tag ? (
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText} maxFontSizeMultiplier={1}>
                                                {u.tag}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={styles.upcomingDate} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {u.date}
                                </Text>
                            </View>

                            <Text
                                style={[styles.upcomingWhen, { color: u.whenColor }]}
                                maxFontSizeMultiplier={1.1}
                                numberOfLines={1}
                            >
                                {u.when}
                            </Text>
                            <Ionicons name="chevron-forward" size={s(15)} color={C.iconMuted} />
                        </Pressable>
                    ))}
                </View>

                {/* ==============================
                    QUICK ACTIONS
                ============================== */}
                <View style={[styles.card, styles.quickCard]}>
                    {QUICK.map((q) => (
                        <Pressable key={q.key} style={styles.quickItem}>
                            <View style={styles.quickIcon}>
                                <MaterialCommunityIcons
                                    name={q.icon as any}
                                    size={s(q.key === "add" ? 26 : 24)}
                                    color={C.orange}
                                />
                            </View>
                            <Text style={styles.quickLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {q.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* ==============================
                BOTTOM NAV
            ============================== */}
            <View
                style={[
                    styles.nav,
                    { height: NAV_HEIGHT, paddingBottom: insets.bottom },
                ]}
            >
                <NavItem
                    label="Home"
                    icon="home"
                    active={tab === "home"}
                    onPress={() => setTab("home")}
                />
                <NavItem
                    label="Tasks"
                    icon="checkbox-outline"
                    active={tab === "tasks"}
                    onPress={() => setTab("tasks")}
                />

                <View style={styles.navCenterSlot}>
                    <Pressable style={styles.navCenter}>
                        <Image
                            source={require("../../assets/images/paw-white.png")}
                            resizeMode="contain"
                            style={styles.navCenterPaw}
                        />
                    </Pressable>
                </View>

                <NavItem
                    label="Know"
                    icon="book-outline"
                    active={tab === "know"}
                    onPress={() => setTab("know")}
                />
                <NavItem
                    label="Profile"
                    icon="person-outline"
                    active={tab === "profile"}
                    onPress={() => setTab("profile")}
                />
            </View>
        </View>
    );
}

function NavItem({
    label,
    icon,
    active,
    onPress,
}: {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.navItem}>
            <Ionicons name={icon} size={s(24)} color={active ? C.orange : C.iconMuted} />
            <Text
                style={[styles.navLabel, active && styles.navLabelActive]}
                maxFontSizeMultiplier={1.1}
            >
                {label}
            </Text>
        </Pressable>
    );
}

/* ------------------------------------------------------------------
 * STYLES
 * ------------------------------------------------------------------ */
const SIDE = s(14);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    /* BACKGROUND PAWS */
    backgroundPaw: {
        position: "absolute",
        width: 92 * SCALE,
        height: 92 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },
    pawTopRight: {
        top: 120 * SCALE,
        right: -10 * SCALE,
        transform: [{ rotate: "15deg" }],
    },
    pawMiddleLeft: {
        top: 520 * SCALE,
        left: -20 * SCALE,
        transform: [{ rotate: "-15deg" }],
    },

    /* SHARED CARD */
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

    /* TOP BAR */
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        gap: s(8),
    },
    menuButton: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    greetingBox: {
        flex: 1,
    },
    greeting: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(18),
        color: C.brown,
    },
    heading: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        lineHeight: s(28),
        color: C.brown,
    },
    bellButton: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
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
    badgeText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(9),
        color: C.white,
    },
    xpPill: {
        height: s(40),
        paddingLeft: s(5),
        paddingRight: s(10),
        borderRadius: s(20),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: s(5),
    },
    xpCoin: {
        width: s(28),
        height: s(28),
        borderRadius: s(14),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    xpCoinPaw: {
        width: s(16),
        height: s(16),
    },
    xpText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        color: C.brown,
    },

    /* STREAK + LEVEL */
    rowTwo: {
        flexDirection: "row",
        paddingHorizontal: SIDE,
        marginTop: s(14),
        gap: s(8),
    },
    streakCard: {
        flex: 1.05,
        paddingVertical: s(9),
        paddingHorizontal: s(10),
    },
    streakTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    streakNumber: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        lineHeight: s(30),
        color: C.brown,
        marginLeft: s(4),
    },
    streakLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        color: C.brown,
        marginLeft: s(5),
        marginTop: s(6),
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(5),
    },
    weekItem: {
        alignItems: "center",
        gap: s(3),
    },
    weekLetter: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(10),
        color: C.brown,
    },
    weekDotDone: {
        width: s(16),
        height: s(16),
        borderRadius: s(8),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    weekDotEmpty: {
        width: s(16),
        height: s(16),
        borderRadius: s(8),
        backgroundColor: C.peach,
    },

    levelCard: {
        flex: 1,
        paddingVertical: s(10),
        paddingHorizontal: s(10),
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
    },
    levelBadge: {
        width: s(40),
        height: s(40),
        borderRadius: s(12),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    levelInfo: {
        flex: 1,
    },
    levelTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: s(6),
    },
    levelTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(16),
        color: C.brown,
    },
    levelXp: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(9),
        color: C.muted,
        flexShrink: 1,
    },

    /* PROGRESS BAR */
    barTrack: {
        height: s(6),
        borderRadius: s(3),
        backgroundColor: C.peach,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: s(3),
        backgroundColor: C.orange,
    },

    /* HERO */
    hero: {
        height: s(250),
        marginTop: s(6),
        width: "100%",
        alignItems: "center",
        overflow: "hidden",
    },
    heroScene: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "#FFF3E3",
    },
    heroFloor: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: s(70),
        backgroundColor: C.peach,
        opacity: 0.55,
    },
    sofa: {
        position: "absolute",
        left: s(-8),
        bottom: s(36),
        width: s(130),
        height: s(100),
        borderRadius: s(18),
        backgroundColor: "#8FB06A",
    },
    lamp: {
        position: "absolute",
        right: s(34),
        bottom: s(108),
        width: s(44),
        height: s(38),
        borderTopLeftRadius: s(14),
        borderTopRightRadius: s(14),
        backgroundColor: C.peachLight,
    },
    cabinet: {
        position: "absolute",
        right: s(-6),
        bottom: s(50),
        width: s(110),
        height: s(70),
        borderRadius: s(8),
        backgroundColor: "#C8895A",
    },
    heroPet: {
        position: "absolute",
        bottom: s(10),
        width: s(200),
        height: s(210),
    },
    bubble: {
        position: "absolute",
        top: s(32),
        right: s(20),
        paddingVertical: s(6),
        paddingHorizontal: s(12),
        borderRadius: s(14),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    bubbleSmall: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        color: C.brown,
    },
    bubbleMood: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(14),
        color: C.orange,
    },
    askAi: {
        position: "absolute",
        right: s(12),
        bottom: s(14),
        width: s(62),
        height: s(62),
        borderRadius: s(31),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.12,
        shadowRadius: s(6),
        elevation: 4,
    },
    askAiText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(10),
        color: C.brown,
        marginTop: s(-1),
    },

    /* STATS */
    statsCard: {
        marginHorizontal: SIDE,
        marginTop: s(-18),
        paddingVertical: s(12),
        paddingHorizontal: s(10),
        flexDirection: "row",
        gap: s(10),
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        color: C.brown,
        marginBottom: s(5),
    },
    statValueRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(3),
        marginBottom: s(6),
    },
    statValue: {
        flexShrink: 1,
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(14),
        color: C.brown,
    },
    statTotal: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        color: C.muted,
    },

    /* SECTION CARDS */
    sectionCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        paddingVertical: s(12),
        paddingHorizontal: s(12),
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: s(10),
    },
    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(16),
        color: C.brown,
    },
    sectionAction: {
        flexDirection: "row",
        alignItems: "center",
    },
    sectionActionText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        color: C.orange,
    },

    /* TASKS */
    taskRow: {
        flexDirection: "row",
        gap: s(8),
    },
    taskCard: {
        flex: 1,
        height: s(106),
        borderRadius: s(12),
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderLeftWidth: 3,
        borderLeftColor: C.orange,
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(2),
    },
    taskCardDone: {
        backgroundColor: C.peach,
        borderColor: C.orange,
    },
    taskTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        color: C.brown,
        marginTop: s(3),
    },
    taskSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        color: C.muted,
        marginTop: s(1),
    },
    checkDone: {
        width: s(20),
        height: s(20),
        borderRadius: s(10),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(7),
    },
    checkEmpty: {
        width: s(20),
        height: s(20),
        borderRadius: s(10),
        borderWidth: 1.5,
        borderColor: C.muted,
        backgroundColor: C.white,
        marginTop: s(7),
    },

    /* UPCOMING */
    upcomingRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(8),
    },
    upcomingRowBorder: {
        borderTopWidth: 1,
        borderTopColor: C.divider,
    },
    upcomingIcon: {
        width: s(38),
        height: s(38),
        borderRadius: s(19),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        marginRight: s(10),
    },
    upcomingInfo: {
        flex: 1,
    },
    upcomingTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
    },
    upcomingTitle: {
        flexShrink: 1,
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
    },
    tag: {
        paddingHorizontal: s(6),
        paddingVertical: s(1),
        borderRadius: s(5),
        backgroundColor: "#E9E1FF",
    },
    tagText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(9),
        color: "#6A4FD6",
    },
    upcomingDate: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(11),
        color: C.muted,
        marginTop: s(1),
    },
    upcomingWhen: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        marginRight: s(4),
    },

    /* QUICK ACTIONS */
    quickCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        paddingVertical: s(10),
        paddingHorizontal: s(6),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    quickItem: {
        flex: 1,
        alignItems: "center",
    },
    quickIcon: {
        width: s(46),
        height: s(46),
        borderRadius: s(14),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: s(5),
    },
    quickLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        color: C.brown,
    },

    /* BOTTOM NAV */
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
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: s(2),
    },
    navLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        color: C.iconMuted,
    },
    navLabelActive: {
        color: C.orange,
    },
    navCenterSlot: {
        flex: 1,
        alignItems: "center",
    },
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
    navCenterPaw: {
        width: s(30),
        height: s(30),
    },
});