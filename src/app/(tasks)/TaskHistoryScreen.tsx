import { appAlert } from "@/components/AppDialog";
import { appLocale } from "@/i18n/autoTranslate";
import ScreenHeader, {
    C,
    FilterTabs,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import {
    Image,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

type Status = "done";
type Item = { id: string; title: string; time: string; status: Status; xp: number; points: number; icon: string; color: string; tint: string; date: string };
const TABS = [{ key: "day", label: "Day" }, { key: "week", label: "Week" }, { key: "month", label: "Month" }, { key: "all", label: "All" }];
const categoryStyle = (category: string) => {
    const styles: Record<string, { icon: string; color: string; tint: string }> = {
        food: { icon: "food-variant", color: "#5E9B2D", tint: "#EAF3DC" }, water: { icon: "water", color: "#3B6FB6", tint: "#E6F0FA" },
        walk: { icon: "dog-service", color: "#FF7A00", tint: "#FFF0D6" }, play: { icon: "tennis-ball", color: "#2E9C8A", tint: "#E3F4F1" },
        grooming: { icon: "brush", color: "#E0457B", tint: "#FFE3EE" }, training: { icon: "school", color: "#7A5CFF", tint: "#F3EAFF" },
        medication: { icon: "pill", color: "#3B6FB6", tint: "#E6F0FA" }, vet: { icon: "medical-bag", color: "#FF4B32", tint: "#FFE5E1" },
    };
    return styles[category] ?? { icon: "paw", color: "#FF7A00", tint: "#FFF0D6" };
};
const dateLabel = (key: string) => new Date(`${key}T00:00:00`).toLocaleDateString(appLocale(), { day: "numeric", month: "short", year: "numeric" });

const dayLabel = (d: number) => (d === 0 ? "" : d === 1 ? " · Yesterday" : ` · ${d} days ago`);

export default function TaskHistoryScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState("day");
    const [petId, setPetId] = useState<string | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const loadPage = useCallback(async (next?: string | null, reset = false) => {
        if (!petId || loading) return;
        setLoading(true);
        try {
            const result = await petcardApi.taskHistory(petId, next ?? undefined, 20);
            const rows = (result.items ?? []) as Array<{ id: string; title: string; category: string; date: string; xp: number; points: number; completedAt?: string }>;
            const mapped = rows.map((r) => ({ id: r.id, title: r.title, category: r.category, date: r.date, time: dateLabel(r.date), status: "done" as const, xp: r.xp ?? 0, points: r.points ?? 0, ...categoryStyle(r.category) }));
            setItems((old) => reset ? mapped : [...old, ...mapped]);
            setCursor(result.nextCursor ?? null);
            setHasMore(Boolean(result.nextCursor));
        } catch (error) { appAlert("Task history unavailable", error instanceof Error ? error.message : "Please try again."); }
        finally { setLoading(false); }
    }, [petId, loading]);

    useFocusEffect(useCallback(() => {
        let active = true;
        (async () => {
            try {
                const bootstrap = await petcardApi.bootstrap();
                const pet = await resolveSelectedPet(bootstrap.pets ?? []) as Pet | null;
                if (!active) return;
                if (!pet?.id) { setPetId(null); setItems([]); return; }
                setPetId(pet.id);
            } catch (error) { if (active) appAlert("Unable to load pet", error instanceof Error ? error.message : "Please try again."); }
        })();
        return () => { active = false; };
    }, []));

    useEffect(() => { if (petId) { setItems([]); setCursor(null); setHasMore(false); void loadPage(null, true); } }, [petId]);
    if (!fontsLoaded) return null;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    const cutoff = new Date(now); cutoff.setDate(now.getDate() - (tab === "week" ? 6 : tab === "month" ? 29 : 0));
    const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth()+1).padStart(2,"0")}-${String(cutoff.getDate()).padStart(2,"0")}`;
    const list = tab === "all" ? items : items.filter((i) => tab === "day" ? i.date === today : i.date >= cutoffKey);
    const totalXp = list.reduce((sum, i) => sum + i.xp, 0);
    const completed = list.length;
    const heading = tab === "day" ? `Today, ${dateLabel(today)}` : tab === "week" ? "This Week" : tab === "month" ? "This Month" : "All Time";

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Task History" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}>
                <View style={{ paddingHorizontal: SIDE }}><FilterTabs tabs={TABS} active={tab} onChange={setTab} /></View>
                <Text style={styles.heading}>{heading}</Text>
                <View style={styles.listCard}>
                    {list.map((i, idx) => (
                        <View key={i.id} style={[styles.row, idx > 0 && styles.rowBorder]}>
                            <View style={[styles.icon, { backgroundColor: i.tint }]}><MaterialCommunityIcons name={i.icon as any} size={s(24)} color={i.color} /></View>
                            <View style={{ flex: 1 }}><Text style={styles.title} numberOfLines={1}>{i.title}</Text><Text style={styles.sub} numberOfLines={1}>{i.time}</Text></View>
                            <View style={styles.right}><View style={styles.check}><Ionicons name="checkmark" size={s(11)} color={C.white} /></View><Text style={styles.xp}>+{i.xp} XP</Text><Text style={styles.sub}>+{i.points} Paw Points</Text></View>
                        </View>
                    ))}
                    {list.length === 0 ? <Text style={styles.empty}>{loading ? "Loading task history…" : "No completed tasks for this period."}</Text> : null}
                    {hasMore && tab === "all" ? <Pressable style={styles.loadMore} onPress={() => void loadPage(cursor)} disabled={loading}><Text style={styles.loadMoreText}>{loading ? "Loading…" : "Load more"}</Text></Pressable> : null}
                </View>
                <View style={styles.summary}>
                    <View style={styles.sumRow}><View style={styles.sumLeft}><Text style={styles.sumLabel}>Total XP Earned</Text><Image source={require("../../../assets/images/rewards/pawcoin.png")} resizeMode="contain" style={styles.sumCoin} /></View><Text style={styles.sumValue}>{totalXp} XP</Text></View>
                    <View style={[styles.sumRow, { marginTop: s(18) }]}><Text style={styles.sumLabel}>Tasks Completed</Text><Text style={styles.sumValue}>{completed}</Text></View>
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
    loadMore: { alignSelf: "center", paddingHorizontal: s(18), paddingVertical: s(10), marginVertical: s(8), borderRadius: s(18), backgroundColor: "#FFF0D6" },
    loadMoreText: { color: C.orange, fontFamily: "Nunito_700Bold", fontSize: s(12) },
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