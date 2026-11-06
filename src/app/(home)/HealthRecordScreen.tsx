import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { petcardApi, Pet, HealthRecord } from "@/services/petcardApi";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import AddHealthRecordSheet, { HealthDraft } from "@/components/AddHealthRecordSheet";
import NoPetPopup from "@/components/NoPetPopup";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { router } from "expo-router";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

const { width } = Dimensions.get("window");

type Tone = "green" | "orange" | "blue" | "red";

const TONES: Record<Tone, { bg: string; fg: string }> = {
    green: { bg: "#E4F3D6", fg: "#5E9B2D" },
    orange: { bg: "#FFF0D6", fg: "#E08A00" },
    blue: { bg: "#E6F0FA", fg: "#3B6FB6" },
    red: { bg: "#FFE5E1", fg: "#FF4B32" },
};

type Rec = { title: string; sub: string; status: string; tone: Tone };

type Cat = {
    key: string;
    label: string;
    heading: string;
    icon: string;
    color: string;
    tint: string;
    records: Rec[];
    due?: { title: string; sub: string; status: string; tone: Tone };
};

/* Category presentation metadata. Records are loaded from the backend below. */
const CATS: Cat[] = [
    {
        key: "vaccination",
        label: "Vaccination",
        heading: "Vaccination Records",
        icon: "needle",
        color: "#5E9B2D",
        tint: "#EAF3DC",
        records: [],
    },
    {
        key: "deworming",
        label: "Deworming",
        heading: "Deworming Records",
        icon: "bug-outline",
        color: "#E08A00",
        tint: "#FFF0D6",
        records: [],
    },
    {
        key: "vet",
        label: "Vet Visits",
        heading: "Vet Visits",
        icon: "stethoscope",
        color: "#3B6FB6",
        tint: "#E6F0FA",
        records: [],
    },
    {
        key: "meds",
        label: "Medications",
        heading: "Medications",
        icon: "pill",
        color: "#7A5CFF",
        tint: "#F3EAFF",
        records: [],
    },
    {
        key: "weight",
        label: "Weight",
        heading: "Weight Log",
        icon: "scale-bathroom",
        color: "#D99A00",
        tint: "#FFF3CC",
        records: [],
    },
    {
        key: "allergies",
        label: "Allergies",
        heading: "Allergies",
        icon: "flower-pollen-outline",
        color: "#E5484D",
        tint: "#FFE5E1",
        records: [],
    },
];

export default function HealthRecordsScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [active, setActive] = useState("vaccination");
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [upcomingRecords, setUpcomingRecords] = useState<HealthRecord[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(true);
    const { pet, hasPet, loading: petLoading } = useSelectedPet();
    const [sheet, setSheet] = useState(false);
    const [saving, setSaving] = useState(false);
    const petId = pet?.id;

    const loadRecords = useCallback(async () => {
        if (!petId) { setRecords([]); setUpcomingRecords([]); setLoadingRecords(false); return; }
        try {
            const [list, upcoming] = await Promise.all([petcardApi.listHealthRecords(petId, undefined, undefined, 50), petcardApi.upcomingHealth(petId)]);
            setRecords(list.records ?? []); setUpcomingRecords(upcoming.records ?? []);
        } catch (error) {
            Alert.alert("Couldn't load health records", error instanceof Error ? error.message : "Please try again.");
        } finally { setLoadingRecords(false); }
    }, [petId]);

    useEffect(() => { setLoadingRecords(true); void loadRecords(); }, [loadRecords]);

    const saveRecord = async (d: HealthDraft) => {
        if (!petId || saving) return;
        setSaving(true);
        try {
            await petcardApi.createHealthRecord(petId, d as Partial<HealthRecord>);
            setSheet(false);
            await loadRecords(); // Home "Upcoming" bhi next focus pe nayi due date dikhayega
        } catch (error) {
            Alert.alert("Couldn't save record", error instanceof Error ? error.message : "Please try again.");
        } finally { setSaving(false); }
    };

    if (!fontsLoaded) return null;

    const cat = CATS.find((c) => c.key === active) ?? CATS[0];
    const typeKeys: Record<string, string[]> = { vaccination: ["vaccination"], deworming: ["other"], vet: ["vet_visit", "surgery"], meds: ["medication"], weight: ["weight"], allergies: ["allergy", "condition"] };
    const inTab = (r: HealthRecord) => (typeKeys[active] ?? []).includes(r.type) && (active !== "deworming" || /deworm/i.test(r.title));
    const activeRecords = records.filter(inTab);
    const activeUpcoming = upcomingRecords.filter(inTab);
    const displayDate = (value: string) => { const d = new Date(`${value}T12:00:00`); return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Health Records" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(110) }}
            >
                {/* CATEGORY GRID */}
                <View style={styles.grid}>
                    {CATS.map((c) => {
                        const on = c.key === active;
                        return (
                            <Pressable
                                key={c.key}
                                onPress={() => setActive(c.key)}
                                style={[
                                    styles.tile,
                                    { backgroundColor: on ? c.tint : C.card },
                                    on && { borderColor: c.color },
                                ]}
                            >
                                <View style={[styles.tileIcon, { backgroundColor: c.tint }]}>
                                    <MaterialCommunityIcons name={c.icon as any} size={s(26)} color={c.color} />
                                </View>
                                <Text style={styles.tileLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {c.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* RECORDS */}
                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>{cat.heading}</Text>
                    <Pressable hitSlop={8}>
                        <Text style={styles.viewAll} maxFontSizeMultiplier={1.1}>View All</Text>
                    </Pressable>
                </View>

                <View style={styles.listCard}>
                    {activeRecords.map((r, i) => (
                        <View key={r.id} style={[styles.row, i > 0 && styles.rowBorder]}>
                            <View style={styles.rowIcon}><MaterialCommunityIcons name={cat.icon as any} size={s(20)} color={C.brown} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>{r.title}</Text>
                                <Text style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>{displayDate(r.date)}{r.vetName ? ` · ${r.vetName}` : ""}</Text>
                            </View>
                            <View style={[styles.pill, { backgroundColor: TONES.green.bg }]}><Text style={[styles.pillText, { color: TONES.green.fg }]} maxFontSizeMultiplier={1.1}>Recorded</Text></View>
                        </View>
                    ))}
                    {loadingRecords ? <Text style={{ color: C.muted, padding: s(12) }}>Loading records...</Text> : null}
                    {!loadingRecords && activeRecords.length === 0 ? <Text style={{ color: C.muted, padding: s(12) }}>No records in this category yet.</Text> : null}
                </View>

                {/* NEXT DUE */}
                {activeUpcoming.length > 0 ? (
                    <>
                        <Text style={styles.dueLabel} maxFontSizeMultiplier={1.1}>Next Due</Text>
                        <View style={styles.dueCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {activeUpcoming[0].title}
                                </Text>
                                <Text style={styles.rowSub} maxFontSizeMultiplier={1.1}>{activeUpcoming[0].nextDueDate ? displayDate(activeUpcoming[0].nextDueDate) : "Upcoming"}</Text>
                            </View>
                            <View style={[styles.pill, { backgroundColor: TONES.blue.bg }]}>
                                <Text style={[styles.pillText, { color: TONES.blue.fg }]} maxFontSizeMultiplier={1.1}>
                                    Upcoming
                                </Text>
                            </View>
                        </View>
                    </>
                ) : null}
            </ScrollView>

            {/* ADD RECORD (nav ke upar) */}
            <View style={[styles.bottomSection, { bottom: NAV_HEIGHT }]}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Add Record"
                        onPress={() => { if (hasPet) setSheet(true); }}
                        disabled={!hasPet}
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

            <AddHealthRecordSheet visible={sheet} tab={active} saving={saving} onClose={() => setSheet(false)} onSave={saveRecord} />
            <NoPetPopup visible={!petLoading && !hasPet} onLater={() => router.back()} />
            <BottomNav active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: s(10),
        paddingHorizontal: SIDE,
        marginTop: s(19),
    },
    tile: {
        width: "31.5%",
        alignItems: "center",
        paddingVertical: s(12),
        borderRadius: s(14),
        borderWidth: 1,
        borderColor: C.peachBorder,
        gap: s(6),
    },
    tileIcon: {
        width: s(46),
        height: s(46),
        borderRadius: s(14),
        alignItems: "center",
        justifyContent: "center",
    },
    tileLabel: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },

    sectionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SIDE + s(2),
        marginTop: s(20),
        marginBottom: s(10),
    },
    sectionTitle: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    viewAll: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },

    listCard: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(12) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(11), gap: s(12) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    rowIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(21),
        backgroundColor: "#F3EEEA",
        alignItems: "center",
        justifyContent: "center",
    },
    rowTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(2) },
    pill: { paddingHorizontal: s(10), paddingVertical: s(4), borderRadius: s(10) },
    pillText: { fontFamily: "Nunito_700Bold", fontSize: s(10) },

    dueLabel: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(18),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },
    dueCard: {
        ...cardStyle,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE,
        paddingVertical: s(14),
        paddingHorizontal: s(14),
    },

    /* PrimaryButton pattern (same as Emergency / Generating screens) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: s(8),
        backgroundColor: "#FFFFFF",
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