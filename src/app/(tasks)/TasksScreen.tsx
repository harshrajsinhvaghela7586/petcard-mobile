import { appAlert } from "@/components/AppDialog";
import { appLocale } from "@/i18n/autoTranslate";
import PrimaryButton from "@/components/Button/PrimaryButton";
import PetHubDrawer from "@/components/PetHubDrawer";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { petcardApi, Pet, Task } from "@/services/petcardApi";
import { petImageSource, stickerUri } from "@/services/stickerImage";
import { resolveSelectedPet } from "@/services/petSelection";
import { canOnPet } from "@/services/petPermissions";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import SwipeTabs from "@/components/SwipeTabs";
import NoPetPopup from "@/components/NoPetPopup";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

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

/* Routes: file name = route name (src/app/<name>.tsx) */
const HISTORY_ICONS: Record<string, string> = { food: "food-variant", water: "water", walk: "dog-service", play: "tennis-ball", grooming: "brush", training: "school", medication: "pill", vet: "medical-bag", hygiene: "shower", vaccination: "needle" };

const ROUTES = {
    createTask: "/CreateTaskScreen",
    taskDetails: "/TaskDetailsScreen",
    taskHistory: "/TaskHistoryScreen",
    taskCalendar: "/TaskCalenderScreen",
    notifications: "/notifications",
};

const FILTERS = ["All", "Care", "Health", "Training", "Other"];

const MILESTONES = [7, 15, 30, 60, 90, 180, 365];
const TODAY = new Date();

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/* Current local month; Monday-first calendar. */
const MONTH_LABEL = TODAY.toLocaleDateString(appLocale(), { month: "long", year: "numeric" });
const MONTH_OFFSET = (new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).getDay() + 6) % 7;
const MONTH_DAYS = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();

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
    const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
    const [taskItems, setTaskItems] = useState<Array<{ key: string; title: string; sub: string; icon: string; done: boolean; category: string }>>([]);
    const [activePetId, setActivePetId] = useState<string | null>(null);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [noPetDismissed, setNoPetDismissed] = useState(false);
    const [careStreak, setCareStreak] = useState(0);
    const [activePetName, setActivePetName] = useState("your pet");
    const [activePetType, setActivePetType] = useState("dog");
    const [activePet, setActivePet] = useState<Pet | null>(null);
    const [activeAvatarKey, setActiveAvatarKey] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [historyPreview, setHistoryPreview] = useState<Array<{ id: string; title: string; category: string; date: string; xp: number }>>([]);

    /* Pet Hub drawer (left se slide) */
    const [hubOpen, setHubOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    /* kisi aur page pe jaate hi drawer band (wapas aane pe khula na mile) */
    useFocusEffect(
        useCallback(() => {
            return () => setHubOpen(false);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            let alive = true;
            (async () => {
                setLoadingTasks(true);
                try {
                    const bootstrap = await petcardApi.bootstrap();
                    const pet = await resolveSelectedPet(bootstrap.pets ?? []) as Pet | null;
                    if (!pet?.id) { if (alive) { setActivePetId(null); setActivePet(null); setTaskItems([]); } return; }
                    if (alive) {
                        setActivePetId(pet.id);
                        setCareStreak(pet.streak?.current ?? 0);
                        setActivePetName(pet.name || "your pet");
                        setActivePetType(pet.type || "dog");
                        setActiveAvatarKey(pet.avatarKey || "");
                        setActivePet(pet);
                        setUnreadCount(bootstrap.unreadNotifications ?? 0);
                    }
                    const result = await petcardApi.listTasks(pet.id);
                    if (!alive) return;
                    setTaskItems((result.tasks ?? []).map((t: Task) => ({
                        key: t.id, title: t.title, sub: t.timeOfDay || t.recurrence?.type || "Today",
                        icon: ({ food: "food-variant", water: "water", walk: "dog-service", play: "tennis-ball", grooming: "brush", training: "school", medication: "pill", vet: "medical-bag", hygiene: "shower" } as Record<string, string>)[t.category] ?? "paw",
                        done: Boolean(t.completed), category: t.category,
                    })));
                    const history = await petcardApi.taskHistory(pet.id, undefined, 6);
                    if (alive) setHistoryPreview((history.items ?? []) as Array<{ id: string; title: string; category: string; date: string; xp: number }>);
                } catch (error) {
                    if (alive) appAlert("Couldn't load tasks", error instanceof Error ? error.message : "Please try again.");
                } finally { if (alive) setLoadingTasks(false); }
            })();
            return () => { alive = false; };
        }, [])
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

    const visibleTasks = taskItems.filter((task) => filter === "All" || (filter === "Care" && ["food", "water", "walk", "play", "grooming", "hygiene", "other"].includes(task.category)) || (filter === "Health" && ["medication", "vet"].includes(task.category)) || (filter === "Training" && task.category === "training") || (filter === "Other" && !["food", "water", "walk", "play", "grooming", "hygiene", "medication", "vet", "training"].includes(task.category)));
    const total = taskItems.length;
    const completed = taskItems.filter((task) => task.done).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const open = (route: string) => router.push(route as any);
    const openTask = (key: string) =>
        router.push({ pathname: ROUTES.taskDetails, params: { task: key } } as any);

    const toggleTask = async (key: string) => {
        const task = taskItems.find((item) => item.key === key);
        if (!task || task.done || !activePetId) return;
        if (!canOnPet(activePet, "manage_tasks")) { appAlert("View only", "The pet owner has not allowed you to complete tasks for this pet."); return; }
        try {
            const result = await petcardApi.completeTask(activePetId, key);
            setTaskItems((prev) => prev.map((item) => item.key === key ? { ...item, done: true } : item));
            if (result.streak?.current != null) setCareStreak(result.streak.current);
            const fresh = await petcardApi.petProgress(activePetId);
            if (fresh.streak?.current != null) setCareStreak(fresh.streak.current);
        } catch (error) {
            appAlert("Couldn't complete task", error instanceof Error ? error.message : "Please try again.");
        }
    };

    return (
        <SwipeTabs active="tasks">
        <View style={styles.container}>
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 140 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 560 * SCALE, left: -20 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    {/* menu -> Pet Hub drawer */}
                    <Pressable style={styles.iconButton} onPress={() => setHubOpen(true)}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={styles.titleBox}>
                        <Text style={styles.pageTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            My Tasks
                        </Text>
                        <Text style={styles.pageSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Keep {activePetName.length > 10 ? `${activePetName.slice(0, 10)}…` : activePetName} happy & healthy!
                        </Text>
                    </View>

                    {/* bell -> Notifications */}
                    <Pressable style={styles.iconButton} onPress={() => open(ROUTES.notifications)}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
                        </View>
                    </Pressable>
                </View>

                {/* TODAY'S PROGRESS */}
                <View style={[styles.card, styles.progressCard]}>
                    <Image
                        source={petImageSource(activePet ?? { type: activePetType, avatarKey: activeAvatarKey })}
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
                                    <ProgressBar progress={total ? completed / total : 0} />
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
                        <Pressable onPress={() => setEditMode((v) => !v)} hitSlop={8}>
                            <Text style={styles.sectionActionText} maxFontSizeMultiplier={1.1}>{editMode ? "Done" : "Edit"}</Text>
                        </Pressable>
                    </View>

                    {visibleTasks.map((t) => {
                        const done = t.done;
                        return (
                            /* row tap -> Task Details, checkbox tap -> done toggle */
                            <Pressable
                                key={t.key}
                                onPress={() => openTask(t.key)}
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

                                {editMode ? (
                                    <Pressable onPress={() => openTask(t.key)} hitSlop={10}>
                                        <View style={styles.editBtn}>
                                            <MaterialCommunityIcons name="pencil-outline" size={s(14)} color={C.white} />
                                        </View>
                                    </Pressable>
                                ) : <Pressable onPress={() => toggleTask(t.key)} hitSlop={10}>
                                    {done ? (
                                        <View style={styles.checkDone}>
                                            <Ionicons name="checkmark" size={s(14)} color={C.white} />
                                        </View>
                                    ) : (
                                        <View style={styles.checkEmpty} />
                                    )}
                                </Pressable>}

                                <Image
                                    source={petImageSource(activePet ?? { type: activePetType, avatarKey: activeAvatarKey })}
                                    resizeMode="contain"
                                    style={styles.taskPet}
                                />
                            </Pressable>
                        );
                    })}
                    {loadingTasks ? <Text style={{ color: C.muted, paddingVertical: s(12) }}>Loading tasks...</Text> : null}
                    {!loadingTasks && visibleTasks.length === 0 ? <Text style={{ color: C.muted, paddingVertical: s(12) }}>No tasks found for this filter.</Text> : null}

                    {/* CREATE NEW TASK */}
                    {canOnPet(activePet, "manage_tasks") ? <View style={styles.buttonWrapper}>
                        <PrimaryButton
                            title="Create New Task"
                            onPress={() => open(ROUTES.createTask)}
                            icon={
                                <Image
                                    source={require("../../../assets/images/paw-white.png")}
                                    resizeMode="contain"
                                    style={styles.buttonPaw}
                                />
                            }
                        />
                    </View> : null}
                </View>

                {/* CALENDAR + STREAK */}
                <View style={styles.rowTwo}>
                    {/* calendar */}
                    <View style={[styles.card, styles.calendarCard]}>
                        {/* header tap -> full Calendar screen */}
                        <Pressable style={styles.calHeader} onPress={() => open(ROUTES.taskCalendar)} hitSlop={6}>
                            <Ionicons name="chevron-back" size={s(14)} color={C.brown} />
                            <Text style={styles.calMonth} maxFontSizeMultiplier={1.1}>{MONTH_LABEL}</Text>
                            <Ionicons name="chevron-forward" size={s(14)} color={C.brown} />
                        </Pressable>

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
                                <Text style={styles.streakNumber} maxFontSizeMultiplier={1.1}>{careStreak}</Text>
                                <Text style={styles.streakSub} maxFontSizeMultiplier={1.1}>Days in a row</Text>
                            </View>
                            <View style={styles.streakBubble}>
                                <Text style={styles.streakBubbleText} maxFontSizeMultiplier={1.1}>
                                    Woof!{"\n"}Keep it up!
                                </Text>
                            </View>
                        </View>

                        <Image
                            source={petImageSource(activePet ?? { type: activePetType, avatarKey: activeAvatarKey })}
                            resizeMode="contain"
                            style={styles.streakPet}
                        />

                        <Text style={styles.milestoneLabel} maxFontSizeMultiplier={1.1}>Streak Milestones</Text>
                        <View style={styles.milestoneRow}>
                            <View style={styles.milestoneLine} />
                            {MILESTONES.map((m) => {
                                const reached = careStreak >= m;
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
                        <Pressable style={styles.sectionAction} onPress={() => open(ROUTES.taskHistory)}>
                            <Text style={styles.sectionActionText} maxFontSizeMultiplier={1.1}>View All</Text>
                            <Ionicons name="chevron-forward" size={s(13)} color={C.orange} />
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: s(8) }}
                    >
                        {historyPreview.map((h) => (
                            <Pressable
                                key={h.id}
                                onPress={() => open(ROUTES.taskHistory)}
                                style={[
                                    styles.historyCard,
                                    { backgroundColor: C.greenBg },
                                ]}
                            >
                                <View style={styles.historyTop}>
                                    <MaterialCommunityIcons name={(HISTORY_ICONS[h.category] ?? "check-circle-outline") as any} size={s(22)} color={C.orange} />
                                    <View style={{ flex: 1, marginLeft: s(6) }}>
                                        <Text style={styles.historyTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {h.title}
                                        </Text>
                                        <Text style={styles.historySub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {h.date}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.statusPill, { backgroundColor: "#D6EAB8" }]}>
                                    <Text
                                        style={[styles.statusText, { color: C.green }]}
                                        maxFontSizeMultiplier={1}
                                    >
                                        {`Completed · +${h.xp} XP`}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                        {historyPreview.length === 0 ? <Text style={{ color: C.muted, padding: s(12) }}>No completed tasks yet.</Text> : null}
                    </ScrollView>
                </View>
            </ScrollView>

            <BottomNav active="tasks" />

            {/* PET HUB DRAWER (sabse upar render hona chahiye) */}
            <NoPetPopup visible={!loadingTasks && !activePetId && !noPetDismissed} onLater={() => setNoPetDismissed(true)} />
            <PetHubDrawer visible={hubOpen} onClose={() => setHubOpen(false)} petName={activePetName} petType={activePetType} avatarKey={activeAvatarKey} photoUrl={stickerUri((activePet as any)?.activeStickerKey) ?? undefined} unreadCount={unreadCount} />
        </View>
        </SwipeTabs>
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
    editBtn: { width: s(22), height: s(22), borderRadius: s(11), backgroundColor: C.orange, alignItems: "center", justifyContent: "center" },
    taskPet: { width: s(46), height: s(46), marginLeft: s(6) },

    /* PrimaryButton wrapper + paw: same as PetTypeScreen */
    buttonWrapper: {
        width: "100%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
        marginTop: s(30),
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
        marginTop: -19,
        marginRight: -7,
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