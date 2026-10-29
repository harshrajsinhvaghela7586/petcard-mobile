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

/* mock data (baad me API se) */
const CATS: Cat[] = [
    {
        key: "vaccination",
        label: "Vaccination",
        heading: "Vaccination Records",
        icon: "needle",
        color: "#5E9B2D",
        tint: "#EAF3DC",
        records: [
            { title: "DHPP", sub: "25 May 2025", status: "Completed", tone: "green" },
            { title: "Rabies", sub: "25 May 2025", status: "Completed", tone: "green" },
            { title: "Bordetella", sub: "10 May 2025", status: "Completed", tone: "green" },
        ],
        due: { title: "DHPP Booster", sub: "25 May 2026", status: "In 1 Year", tone: "blue" },
    },
    {
        key: "deworming",
        label: "Deworming",
        heading: "Deworming Records",
        icon: "bug-outline",
        color: "#E08A00",
        tint: "#FFF0D6",
        records: [
            { title: "Albendazole", sub: "02 Apr 2025", status: "Completed", tone: "green" },
            { title: "Praziquantel", sub: "02 Jan 2025", status: "Completed", tone: "green" },
        ],
        due: { title: "Deworming Dose", sub: "02 Jul 2025", status: "In 2 Months", tone: "blue" },
    },
    {
        key: "vet",
        label: "Vet Visits",
        heading: "Vet Visits",
        icon: "stethoscope",
        color: "#3B6FB6",
        tint: "#E6F0FA",
        records: [
            { title: "Annual Check-up", sub: "12 Mar 2025", status: "Completed", tone: "green" },
            { title: "Dental Cleaning", sub: "20 Jan 2025", status: "Completed", tone: "green" },
        ],
        due: { title: "Vet Check-up", sub: "02 Jun 2025", status: "In 11 Days", tone: "orange" },
    },
    {
        key: "meds",
        label: "Medications",
        heading: "Medications",
        icon: "pill",
        color: "#7A5CFF",
        tint: "#F3EAFF",
        records: [
            { title: "Joint Supplement", sub: "Since 01 May 2025", status: "Ongoing", tone: "orange" },
            { title: "Antibiotic Course", sub: "10 Apr 2025", status: "Completed", tone: "green" },
        ],
    },
    {
        key: "weight",
        label: "Weight",
        heading: "Weight Log",
        icon: "scale-bathroom",
        color: "#D99A00",
        tint: "#FFF3CC",
        records: [
            { title: "12.5 kg", sub: "20 May 2025", status: "Healthy", tone: "green" },
            { title: "12.1 kg", sub: "20 Apr 2025", status: "Healthy", tone: "green" },
            { title: "11.8 kg", sub: "20 Mar 2025", status: "Healthy", tone: "green" },
        ],
        due: { title: "Monthly Weigh-in", sub: "20 Jun 2025", status: "In 1 Month", tone: "blue" },
    },
    {
        key: "allergies",
        label: "Allergies",
        heading: "Allergies",
        icon: "flower-pollen-outline",
        color: "#E5484D",
        tint: "#FFE5E1",
        records: [
            { title: "Chicken", sub: "Food allergy", status: "Mild", tone: "orange" },
            { title: "Pollen", sub: "Seasonal", status: "Mild", tone: "orange" },
        ],
    },
];

export default function HealthRecordsScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [active, setActive] = useState("vaccination");
    if (!fontsLoaded) return null;

    const cat = CATS.find((c) => c.key === active) ?? CATS[0];

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
                    {cat.records.map((r, i) => (
                        <View key={r.title + i} style={[styles.row, i > 0 && styles.rowBorder]}>
                            <View style={styles.rowIcon}>
                                <MaterialCommunityIcons name={cat.icon as any} size={s(20)} color={C.brown} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {r.title}
                                </Text>
                                <Text style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {r.sub}
                                </Text>
                            </View>
                            <View style={[styles.pill, { backgroundColor: TONES[r.tone].bg }]}>
                                <Text style={[styles.pillText, { color: TONES[r.tone].fg }]} maxFontSizeMultiplier={1.1}>
                                    {r.status}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* NEXT DUE */}
                {cat.due ? (
                    <>
                        <Text style={styles.dueLabel} maxFontSizeMultiplier={1.1}>Next Due</Text>
                        <View style={styles.dueCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {cat.due.title}
                                </Text>
                                <Text style={styles.rowSub} maxFontSizeMultiplier={1.1}>{cat.due.sub}</Text>
                            </View>
                            <View style={[styles.pill, { backgroundColor: TONES[cat.due.tone].bg }]}>
                                <Text style={[styles.pillText, { color: TONES[cat.due.tone].fg }]} maxFontSizeMultiplier={1.1}>
                                    {cat.due.status}
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
                        onPress={() => {
                            // TODO: add record screen / modal
                        }}
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
        zIndex: 20,
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