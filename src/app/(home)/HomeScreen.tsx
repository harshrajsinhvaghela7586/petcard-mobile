import { appLocale } from "@/i18n/autoTranslate";
import PawPointsPopup from "@/components/PawPointsPopup";
import PetHubDrawer from "@/components/PetHubDrawer";
import StreakPopup from "@/components/StreakPopup";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { petcardApi, Pet, Task, HealthRecord } from "@/services/petcardApi";
import { getPetAvatarSource } from "@/services/petAvatar";
import { resolveSelectedPet } from "@/services/petSelection";
import { petcardTodayKey } from "@/services/petcardApi";
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
import { trackerStore, goalsFor, careScore, sum } from "@/services/trackerStore";
import { useLang } from "@/i18n/LanguageContext";
import SafeImage from "@/components/SafeImage";
import { petImageSource, stickerImage, stickerUri } from "@/services/stickerImage";
import SwipeTabs from "@/components/SwipeTabs";
import NoPetPopup from "@/components/NoPetPopup";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

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
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_REWARD_POINTS: Record<number, number> = { 7: 15, 15: 20, 30: 30, 60: 40, 90: 50, 180: 75, 365: 150 };

const buildStreakWeek = (streak: number, lastDate: string | null) => {
    const now = new Date();
    const mondayOffset = (now.getDay() + 6) % 7;
    return WEEK_DAYS.map((d, index) => {
        const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + index);
        const last = lastDate ? new Date(`${lastDate}T00:00:00`) : null;
        const age = last ? Math.floor((last.getTime() - dayDate.getTime()) / 86400000) : -1;
        return { d, done: age >= 0 && age < streak };
    });
};


const STATS = [
    { key: "food", label: "Food", value: "0", total: "0", progress: 0, icon: "bowl-mix", route: "/FoodScreen" },
    { key: "water", label: "Water", value: "0", total: "0", progress: 0, icon: "water", route: "/WaterScreen" },
    { key: "activity", label: "Activity", value: "0", total: "0", progress: 0, icon: "shoe-sneaker", route: "/ActivityScreen" },
    { key: "care", label: "Care Score", value: "0", total: "0", progress: 0, icon: "heart", route: "/CareScoreScreen" },
] as const;

const TASKS = [
    { key: "breakfast", title: "Breakfast", sub: "08:00 AM", icon: "food-variant", done: true },
    { key: "walk", title: "Walk", sub: "06:00 PM", icon: "dog-service", done: false },
    { key: "medicine", title: "Medicine", sub: "08:00 PM", icon: "pill", done: false },
    { key: "brush", title: "Brush Fur", sub: "Every Sun", icon: "brush", done: false },
] as const;

type HomeTask = { key: string; title: string; sub: string; icon: string; done: boolean };

const taskIcon = (category: string) => {
    const icons: Record<string, string> = { food: "food-variant", water: "water", walk: "dog-service", play: "tennis-ball", grooming: "brush", training: "school", medication: "pill", vet: "medical-bag", hygiene: "shower", vaccination: "needle" };
    return icons[category] ?? "paw";
};

/* "Due in 10 days" / "Today" / "Overdue" - health record ki nextDueDate ke hisab se */
const dueInfo = (iso?: string | null): { when: string; color: string } => {
    if (!iso) return { when: "Recorded", color: C.muted };
    const due = new Date(`${iso.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(due.getTime())) return { when: "Recorded", color: C.muted };
    const now = new Date();
    const days = Math.round((due.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
    if (days < 0) return { when: `Overdue ${-days}d`, color: C.red };
    if (days === 0) return { when: "Due today", color: C.red };
    if (days === 1) return { when: "Due tomorrow", color: C.orange };
    return { when: `Due in ${days} days`, color: days <= 7 ? C.orange : C.muted };
};
const prettyDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(appLocale(), { day: "2-digit", month: "short", year: "numeric" });
};
const HEALTH_ICON: Record<string, string> = { vaccination: "needle", deworming: "bug-outline", vet_visit: "stethoscope", medication: "pill", weight: "scale-bathroom", allergy: "alert-circle-outline" };

const UPCOMING: Array<{ key: string; icon: string; title: string; tag?: string; date: string; when: string; whenColor: string }> = [];
const QUICK_KEY: Record<string, string> = { add: "addTask", qr: "scanQr", clicker: "clicker", whistle: "whistle", chat: "aiChat" };
const QUICK: readonly {
    key: string;
    label: string;
    icon: string;
    route?: string;
}[] = [
    { key: "add", label: "Add Task", icon: "plus", route: "/CreateTaskScreen" },
    { key: "qr", label: "Scan QR", icon: "qrcode-scan", route: "/ScanQRScreen" },
    { key: "clicker", label: "Clicker", icon: "gesture-tap-button", route: "/ClickerScreen" },
    { key: "whistle", label: "Whistle", icon: "bullhorn-outline", route: "/WhistleScreen" },
    { key: "chat", label: "AI Chat", icon: "robot-happy-outline" ,route:"/AIChatScreen"},
];

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
    const { t: tr } = useLang();
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    /* Quick actions bar ki asli height (scroll ke neeche content na chhupe) */
const [quickH, setQuickH] = useState(s(92));

    const [taskRows, setTaskRows] = useState<HomeTask[]>([]);
    const [dashboardStats, setDashboardStats] = useState<Array<{ key: string; label: string; value: string; total: string; progress: number; icon: any; route: any }>>([...STATS]);
    const [activePetId, setActivePetId] = useState<string | null>(null);
    const [activePetName, setActivePetName] = useState("your pet");
    const [activePetType, setActivePetType] = useState("dog");
    const [activePetAvatarKey, setActivePetAvatarKey] = useState("");
    const [activePetStickerKey, setActivePetStickerKey] = useState<string | null>(null);
    const [activePetAvatarLocalId, setActivePetAvatarLocalId] = useState<string | null>(null);
    const [activePetPhotoUrl, setActivePetPhotoUrl] = useState<string | null>(null);
    const [walletPoints, setWalletPoints] = useState(0);
    const [upcomingRows, setUpcomingRows] = useState<typeof UPCOMING>([]);
    const [accountName, setAccountName] = useState("there");
    const [petProgress, setPetProgress] = useState<{ level: number; xp: number; nextLevelXp?: number } | null>(null);
    const [careStreak, setCareStreak] = useState(0);
    const [streakLastDate, setStreakLastDate] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    /* bootstrap aa chuka hai? (tab hi "pet nahi hai" popup dikhana hai) */
    const [petChecked, setPetChecked] = useState(false);
    const [noPetDismissed, setNoPetDismissed] = useState(false);

    /* Pet Hub drawer (left se slide) */
    const [hubOpen, setHubOpen] = useState(false);

    /* Streak popup + "+25 PawPoints" popup */
    const [streakOpen, setStreakOpen] = useState(false);
    const [reward, setReward] = useState<{ title: string; icon: string; points: number } | null>(null);

    /* kisi aur page pe jaate hi drawer band (wapas aane pe khula na mile) */
    useFocusEffect(
        useCallback(() => {
            return () => setHubOpen(false);
        }, [])
    );

    
useFocusEffect(
    useCallback(() => {
        let alive = true;

        const loadHome = async () => {
            try {
                const data = await petcardApi.bootstrap();
                if (!alive) return;

                setWalletPoints(data.wallet?.pawPoints ?? 0);
                setAccountName(data.user?.name?.split(" ")[0] || "there");
                setUnreadCount(data.unreadNotifications ?? 0);
                setPetChecked(true);

                const pet = await resolveSelectedPet(data.pets ?? []) as Pet | null;

                if (!alive) return;

                if (!pet?.id) {
                    setActivePetId(null);
                    setActivePetName("your pet");
                    setActivePetType("dog");
                    setActivePetAvatarKey("");
                    setActivePetStickerKey(null);
                    setActivePetPhotoUrl(null);
                    setTaskRows([]);
                    setDashboardStats([...STATS]);
                    setUpcomingRows([]);
                    setPetProgress(null);
                    setCareStreak(0);
                    setStreakLastDate(null);
                    return;
                }

                setActivePetId(pet.id);
                setActivePetName(pet.name || "your pet");
                setActivePetType(pet.type || "dog");
                setActivePetAvatarKey(pet.avatarKey || "");
                setActivePetStickerKey((pet as any).activeStickerKey ?? null);
                setActivePetAvatarLocalId((pet as any).avatarLocalId ?? null);
                setActivePetPhotoUrl(pet.photoUrl || null);

                setPetProgress(
                    pet.progress
                        ? {
                              level: pet.progress.level,
                              xp: pet.progress.xp,
                              nextLevelXp: pet.progress.nextLevelXp as number | undefined,
                          }
                        : null
                );

                setCareStreak(pet.streak?.current ?? 0);
                setStreakLastDate(pet.streak?.lastDate ?? null);

                const dailyReward = await petcardApi
                    .claimDailyLoginReward(pet.id, petcardTodayKey())
                    .catch(() => null);

                if (!alive) return;

                if (dailyReward) {
                    setWalletPoints(dailyReward.wallet?.pawPoints ?? 0);

                    if (dailyReward.progress) {
                        setPetProgress({
                            level: dailyReward.progress.level,
                            xp: dailyReward.progress.xp,
                            nextLevelXp: dailyReward.progress.nextLevelXp,
                        });
                    }
                }

                const canViewTasks =
                    pet.role === "owner" ||
                    pet.permissions?.includes("view_tasks") ||
                    pet.permissions?.includes("manage_tasks");

                const canViewHealth =
                    pet.role === "owner" ||
                    pet.permissions?.includes("view_health") ||
                    pet.permissions?.includes("manage_health");

                const [taskData, upcomingData, tracker] = await Promise.all([
                    canViewTasks
                        ? petcardApi.listTasks(pet.id).catch(() => ({ tasks: [] }))
                        : Promise.resolve({ tasks: [] }),

                    canViewHealth
                        ? petcardApi.upcomingHealth(pet.id).catch(() => ({ records: [] }))
                        : Promise.resolve({ records: [] }),
                    
                    canViewTasks 
                        ? petcardApi.trackerSummary(pet.id, petcardTodayKey()).catch(() => null)
                        : Promise.resolve(null),

                ]);

                if (!alive) return;

                const todayTasks = taskData.tasks ?? [];

                setTaskRows(
                    todayTasks.slice(0, 6).map((t: Task) => ({
                        key: t.id,
                        title: t.title,
                        sub: t.timeOfDay || t.recurrence?.type || "Today",
                        icon: taskIcon(t.category),
                        done: Boolean(t.completed),
                    }))
                );

                const countCategory = (categories: string[]) => {
                    const rows = todayTasks.filter((t: Task) =>
                        categories.includes(t.category)
                    );

                    return {
                        done: rows.filter((t: Task) => t.completed).length,
                        total: rows.length,
                    };
                };

                const food = countCategory(["food"]);
                const water = countCategory(["water"]);
                const activity = countCategory(["walk", "play"]);

                const complete = todayTasks.filter(
                    (t: Task) => t.completed
                ).length;

                const care = todayTasks.length
                    ? Math.round((complete / todayTasks.length) * 100)
                    : 0;

setDashboardStats(STATS.map((item) => {
    const t = item.key === "food" ? tracker?.totals.food
            : item.key === "water" ? tracker?.totals.water
            : item.key === "activity" ? tracker?.totals.activity : null;
    if (t) return { ...item, value: String(t.amount), total: String(t.goal), progress: t.progress };
    const score = tracker?.careScore.score ?? 0;
    return { ...item, value: String(score), total: "100", progress: score / 100 };
}));

                setUpcomingRows(
                    (upcomingData.records ?? [])
                        .slice(0, 3)
                        .map((r: HealthRecord) => {
                            const due = dueInfo(r.nextDueDate);

                            return {
                                key: r.id,
                                icon: HEALTH_ICON[r.type] ?? "heart-pulse",
                                title: r.title,
                                date: prettyDate(r.nextDueDate || r.date),
                                tag: undefined,
                                when: due.when,
                                whenColor: due.color,
                            };
                        })
                );
            } catch (error) {
                if (alive) {
                    Alert.alert(
                        "Couldn't load PetCard",
                        error instanceof Error
                            ? error.message
                            : "Please check your connection and try again."
                    );
                }
            }
        };

        void loadHome();

        return () => {
            alive = false;
        };
    }, [])
);

    if (!fontsLoaded) {
        return null;
    }

    const toggleTask = async (key: string) => {
        const task = taskRows.find((item) => item.key === key);
        if (!task || task.done || !activePetId) return;
        try {
            const result = await petcardApi.completeTask(activePetId, task.key);
            setTaskRows((prev) => {
                const next = prev.map((item) => item.key === key ? { ...item, done: true } : item);
                const done = next.filter((item) => item.done).length;
                return next;
            });
            if (result.wallet?.pawPoints !== undefined) setWalletPoints(result.wallet.pawPoints);
            if (result.streak?.current != null) setCareStreak(result.streak.current);
            if (result.streak?.lastDate) setStreakLastDate(result.streak.lastDate);
            const rewardPoints = result.reward?.points ?? 0;
            if (rewardPoints > 0) setReward({ title: task.title, icon: task.icon, points: rewardPoints });
        } catch (error) {
            Alert.alert("Couldn't complete task", error instanceof Error ? error.message : "Please try again.");
        }
    };

    return (
        <SwipeTabs active="home">
        <View style={styles.container}>
            {/* ==============================
                BACKGROUND PAWS
            ============================== */}
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawMiddleLeft]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
               contentContainerStyle={{
    paddingTop: insets.top + s(8),
    paddingBottom: NAV_HEIGHT + quickH + s(24),
}}
            >
                {/* ==============================
                    TOP BAR
                ============================== */}
                <View style={styles.topBar}>
                    {/* menu -> Pet Hub drawer */}
                    <Pressable style={styles.menuButton} onPress={() => setHubOpen(true)}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                            {tr("home.greeting", { name: accountName })}
                        </Text>
                        <Text style={styles.heading} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                            {tr("home.howIs", { pet: activePetName.length > 10 ? `${activePetName.slice(0, 10)}…` : activePetName })}
                        </Text>
                        <Text style={styles.greeting} maxFontSizeMultiplier={1.1} numberOfLines={1}>{tr("home.pawPoints")}: {walletPoints.toLocaleString()}</Text>
                    </View>

                    <Pressable style={styles.bellButton} onPress={()=>router.push("/notifications")}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Text>
                        </View>
                    </Pressable>

                   <Pressable
    style={styles.xpPill}
    onPress={() => router.push("/LevelScreen" as any)}
>
    <View style={styles.xpCoin}>
        <Image
            source={require("../../../assets/images/paw-white.png")}
            resizeMode="contain"
            style={styles.xpCoinPaw}
        />
    </View>
    <Text style={styles.xpText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
        XP {(petProgress?.xp ?? 0).toLocaleString()}
    </Text>
</Pressable>
                </View>

                {/* ==============================
                    STREAK + LEVEL
                ============================== */}
                <View style={styles.rowTwo}>
                    <Pressable style={[styles.card, styles.streakCard]} onPress={() => setStreakOpen(true)}>
                        <View style={styles.streakTop}>
                            <MaterialCommunityIcons name="fire" size={s(32)} color={C.orange} />
                            <Text style={styles.streakNumber} maxFontSizeMultiplier={1.1}>
                                {careStreak}
                            </Text>
                            <Text style={styles.streakLabel} maxFontSizeMultiplier={1.1}>
                                {tr("home.dayStreak")}
                            </Text>
                        </View>

                        <View style={styles.weekRow}>
                            {buildStreakWeek(careStreak, streakLastDate).map((w, i) => (
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
                    </Pressable>

                    <Pressable
                        style={[styles.card, styles.levelCard]}
                        onPress={() => router.push("/LevelScreen" as any)}
                    >
                        <View style={styles.levelBadge}>
                            <MaterialCommunityIcons name="shield-star" size={s(26)} color={C.orange} />
                        </View>

                        <View style={styles.levelInfo}>
                            <View style={styles.levelTop}>
                                <Text style={styles.levelTitle} maxFontSizeMultiplier={1.1}>
                                    Level {petProgress?.level ?? 1}
                                </Text>
                                <Text style={styles.levelXp} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                                    {(petProgress?.xp ?? 0).toLocaleString()} / {(petProgress?.nextLevelXp ?? 700).toLocaleString()} XP
                                </Text>
                            </View>
                            <ProgressBar progress={Math.min(1, (petProgress?.xp ?? 0) / Math.max(1, petProgress?.nextLevelXp ?? 700))} />
                        </View>
                    </Pressable>
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
                    {stickerImage(activePetStickerKey) ? (
                        <Image
                            source={stickerImage(activePetStickerKey)}
                            resizeMode="contain"
                            style={styles.heroPet}
                        />
                    ) : (
                        <SafeImage
                            fallback={petImageSource({ type: activePetType, avatarKey: activePetAvatarKey, avatarLocalId: activePetAvatarLocalId })}
                            source={activePetPhotoUrl ? { uri: activePetPhotoUrl } : null}
                            resizeMode="contain"
                            style={styles.heroPet}
                        />
                    )}

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
                    <Pressable style={styles.askAi} onPress={()=> router.push("/AIChatScreen")}>
                        <MaterialCommunityIcons name="robot-happy" size={s(30)} color="#7A5CFF" />
                        <Text style={styles.askAiText} maxFontSizeMultiplier={1.1}>
                            Ask AI
                        </Text>
                    </Pressable>
                </View>

                {/* ==============================
                    STATS  (each one opens its screen)
                ============================== */}
                <View style={[styles.card, styles.statsCard]}>
                    {dashboardStats.map((st) => (
                        <Pressable
                            key={st.key}
                            style={styles.statItem}
                            onPress={() => router.push(st.route as any)}
                        >
                            <Text style={styles.statLabel} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                                {tr(`stat.${st.key}` as any)}
                            </Text>

                            <View style={styles.statValueRow}>
                                <MaterialCommunityIcons
                                    name={st.icon as any}
                                    size={s(24)}
                                    color={C.orange}
                                />
                                <Text style={styles.statValue} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                                    {st.value}
                                    <Text style={styles.statTotal}> / {st.total}</Text>
                                </Text>
                            </View>

                            <ProgressBar progress={st.progress} />
                        </Pressable>
                    ))}
                </View>

                {/* ==============================
                    TODAY'S TASKS
                ============================== */}
                <View style={[styles.card, styles.sectionCard]}>
                    <SectionHeader title={tr("home.todayTasks")} action={tr("home.viewAll")} onPress={() => router.replace("/TasksScreen" as any)} />

                    <View style={styles.taskRow}>
                        {taskRows.map((t) => {
                            const done = t.done;
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
                        {taskRows.length === 0 ? (
                            <Text style={{ color: C.muted, paddingVertical: s(12), fontSize: s(13) }}>{tr("home.noTasks")}</Text>
                        ) : null}
                    </View>
                </View>

                {/* ==============================
                    UPCOMING
                ============================== */}
                <View style={[styles.card, styles.sectionCard]}>
                    <SectionHeader
                        title={tr("home.upcoming")}
                        action={tr("home.viewCalendar")}
                        onPress={() => router.push("/CalendarScreen" as any)}
                    />

                    {upcomingRows.map((u, index) => (
                        <Pressable
                            key={u.key}
                            onPress={() => router.push("/CalendarScreen" as any)}
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
                    {upcomingRows.length === 0 ? <Text style={{ color: C.muted, paddingVertical: s(10), fontSize: s(13) }}>{tr("home.noUpcoming")}</Text> : null}
                </View>

               
            </ScrollView>

{/* ==============================
    QUICK ACTIONS (fixed, BottomNav ke upar)
============================== */}
<View
    style={[styles.quickBar, { bottom: NAV_HEIGHT }]}
    onLayout={(e) => setQuickH(e.nativeEvent.layout.height)}
>
    <View style={[styles.card, styles.quickCard]}>
        {QUICK.map((q) => (
            <Pressable
                key={q.key}
                style={styles.quickItem}
                onPress={() => q.route && router.push(q.route as any)}
            >
                <View style={styles.quickIcon}>
                    <MaterialCommunityIcons
                        name={q.icon as any}
                        size={s(q.key === "add" ? 26 : 24)}
                        color={C.orange}
                    />
                </View>
                <Text style={styles.quickLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                    {tr(`quick.${QUICK_KEY[q.key]}` as any)}
                </Text>
            </Pressable>
        ))}
    </View>
</View>
            {/* ==============================
                BOTTOM NAV (shared component)
            ============================== */}
            <BottomNav active="home" />

            {/* ==============================
                PET HUB DRAWER (sabse upar render hona chahiye)
            ============================== */}
            <PetHubDrawer visible={hubOpen} onClose={() => setHubOpen(false)} petName={activePetName} petType={activePetType} avatarKey={activePetAvatarKey} photoUrl={stickerUri(activePetStickerKey) ?? activePetPhotoUrl} unreadCount={unreadCount} />

            {/* ==============================
                POPUPS
            ============================== */}
            <StreakPopup
                visible={streakOpen}
                onClose={() => setStreakOpen(false)}
                streak={careStreak}
                petName={activePetName}
week={buildStreakWeek(careStreak, streakLastDate)}
                bonus={STREAK_REWARD_POINTS[careStreak] ?? (Object.keys(STREAK_REWARD_POINTS).map(Number).find((n) => n > careStreak) ? STREAK_REWARD_POINTS[Object.keys(STREAK_REWARD_POINTS).map(Number).find((n) => n > careStreak)!] : 0)}
            />

            <NoPetPopup visible={petChecked && !activePetId && !noPetDismissed} onLater={() => setNoPetDismissed(true)} />

            <PawPointsPopup
                visible={reward !== null}
                onClose={() => setReward(null)}
                points={reward?.points ?? 0}
                taskTitle={reward?.title ?? ""}
                taskIcon={reward?.icon}
            />
        </View>
        </SwipeTabs>
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
        flexShrink: 0,
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
        minWidth: 0,
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
        flexShrink: 0,
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
        flexShrink: 0,
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
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: s(5),
    },
    levelTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(16),
        color: C.brown,
    },
    levelXp: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        color: C.muted,
        alignSelf: "stretch",
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
        gap: s(8),
    },
    statItem: {
        flex: 1,
        minWidth: 0,
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
/* QUICK ACTIONS (fixed bar) */
quickBar: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: s(8),
    paddingBottom: s(6),
    backgroundColor: C.white,
    
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
});