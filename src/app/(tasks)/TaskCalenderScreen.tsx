import PrimaryButton from "@/components/Button/PrimaryButton";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import {
    Alert,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

const { width, height } = Dimensions.get("window");

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const TODAY = new Date();
const dateKey = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

import NoPetPopup from "@/components/NoPetPopup";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { router as __router } from "expo-router";

export default function TaskCalenderScreen() {
    const gate = useSelectedPet();
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [view, setView] = useState({ y: TODAY.getFullYear(), m: TODAY.getMonth() });
    const [selected, setSelected] = useState(dateKey(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()));
    const [petId, setPetId] = useState<string | null>(null);
    const [daysData, setDaysData] = useState<Record<string, { tasks: Array<{ id: string; title: string; category: string; timeOfDay?: string | null; completed: boolean }>; health: Array<{ id: string; title: string; type: string; kind: string }>; memories: Array<{ id: string; title: string }> }>>({});
    const [loading, setLoading] = useState(false);

    const rows = useMemo(() => {
        const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
        const count = new Date(view.y, view.m + 1, 0).getDate();
        const cells: (number | null)[] = Array(offset).fill(null);
        for (let d = 1; d <= count; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);
        const out: (number | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
        return out;
    }, [view]);

    const loadMonth = useCallback(async (id: string, year: number, month: number) => {
        setLoading(true);
        try {
            const from = dateKey(year, month, 1);
            const to = dateKey(year, month, new Date(year, month + 1, 0).getDate());
            const result = await petcardApi.calendar(id, from, to);
            setDaysData((result.days ?? {}) as any);
        } catch (error) { Alert.alert("Calendar unavailable", error instanceof Error ? error.message : "Please try again."); }
        finally { setLoading(false); }
    }, []);

    useFocusEffect(useCallback(() => {
        let alive = true;
        (async () => {
            try {
                const { pets } = await petcardApi.listPets();
                const pet = await resolveSelectedPet(pets ?? []) as Pet | null;
                if (!alive || !pet?.id) return;
                setPetId(pet.id);
            } catch (error) { if (alive) Alert.alert("Unable to load pet", error instanceof Error ? error.message : "Please try again."); }
        })();
        return () => { alive = false; };
    }, []));

    useEffect(() => { if (petId) void loadMonth(petId, view.y, view.m); }, [petId, view.y, view.m, loadMonth]);
    if (!fontsLoaded) return null;

    const changeMonth = (delta: number) => setView((p) => { const d = new Date(p.y, p.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
    const goToday = () => { setView({ y: TODAY.getFullYear(), m: TODAY.getMonth() }); setSelected(dateKey(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())); };
    const [sy, sm, sd] = selected.split("-").map(Number);
    const selDate = new Date(sy, sm - 1, sd);
    const selLabel = `${DAYS[selDate.getDay()]}, ${sd} ${MONTHS[sm - 1]} ${sy}`;
    const day = daysData[selected] ?? { tasks: [], health: [], memories: [] };
    const eventRows = [
        ...day.tasks.map((t) => ({ key: `task-${t.id}`, title: t.title, time: t.timeOfDay || "Task", done: t.completed, kind: "task" as const, id: t.id })),
        ...day.health.map((h) => ({ key: `health-${h.id}-${h.kind}`, title: h.title, time: h.kind === "due" ? "Due" : h.type.replace("_", " "), done: false, kind: "health" as const, id: h.id })),
        ...day.memories.map((m) => ({ key: `memory-${m.id}`, title: m.title || "Pet memory", time: "Memory", done: false, kind: "memory" as const, id: m.id })),
    ];

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Calendar" rightLabel="Today" onRightPress={goToday} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(90) }}>
                <View style={styles.monthRow}>
                    <Pressable onPress={() => changeMonth(-1)} hitSlop={12}><Ionicons name="chevron-back" size={s(22)} color={C.brown} /></Pressable>
                    <Text style={styles.month}>{MONTHS[view.m]} {view.y}</Text>
                    <Pressable onPress={() => changeMonth(1)} hitSlop={12}><Ionicons name="chevron-forward" size={s(22)} color={C.brown} /></Pressable>
                </View>
                <View style={styles.grid}>
                    <View style={styles.gridRow}>{WEEKDAYS.map((w, i) => <Text key={i} style={styles.weekday}>{w}</Text>)}</View>
                    {rows.map((row, ri) => <View key={ri} style={styles.gridRow}>{row.map((d, ci) => {
                        if (!d) return <View key={ci} style={styles.cellWrap} />;
                        const k = dateKey(view.y, view.m, d); const sel = k === selected; const isToday = k === dateKey(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
                        const marked = Boolean(daysData[k] && (daysData[k].tasks.length || daysData[k].health.length || daysData[k].memories.length));
                        return <Pressable key={ci} style={styles.cellWrap} onPress={() => setSelected(k)}>
                            <View style={[styles.cell, isToday && !sel && styles.cellToday, sel && styles.cellSel]}><Text style={[styles.day, sel && styles.daySel]}>{d}</Text></View>
                            {marked && !sel ? <View style={styles.dot} /> : null}
                        </Pressable>;
                    })}</View>)}
                </View>
                <Text style={styles.heading}>{selLabel}</Text>
                <View style={{ paddingHorizontal: SIDE }}>
                    {eventRows.map((e) => <Pressable key={e.key} onPress={() => e.kind === "task" ? router.push({ pathname: "/TaskDetailsScreen", params: { task: e.id } } as any) : undefined} style={styles.event}>
                        <View style={[styles.timePill, e.done ? styles.timeDone : styles.timeTodo]}><Text style={[styles.timeText, { color: e.done ? C.green : C.orange }]}>{e.time}</Text></View>
                        <Text style={styles.eventTitle} numberOfLines={1}>{e.title}</Text>
                        {e.done ? <View style={styles.checkOn}><Ionicons name="checkmark" size={s(13)} color={C.white} /></View> : <View style={styles.checkOff} />}
                    </Pressable>)}
                    {eventRows.length === 0 ? <Text style={{ textAlign: "center", color: C.muted, paddingVertical: s(18) }}>{loading ? "Loading calendar…" : "No tasks or events for this day."}</Text> : null}
                </View>
            </ScrollView>
            <View style={[styles.bottomSection, { bottom: NAV_HEIGHT + s(6) }]}><View style={styles.buttonWrapper}><PrimaryButton title="Add Event / Task" onPress={() => router.push("/CreateTaskScreen" as any)} icon={<Image source={require("../../../assets/images/paw-white.png")} resizeMode="contain" style={styles.buttonPaw} />} /></View></View>
            <BottomNav active="tasks" />
            <NoPetPopup visible={!gate.loading && !gate.hasPet} onLater={() => (__router.canGoBack() ? __router.back() : __router.replace("/HomeScreen" as any))} />
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