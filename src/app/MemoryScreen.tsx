import React, { useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";

const { width } = Dimensions.get("window");

type Memory = {
    id: string;
    title: string;
    date: string; // display date
    month: string; // timeline group
    note: string;
    images: any[]; // require() ya { uri }
    kind: "photo" | "video" | "milestone" | "album";
    icon: keyof typeof Ionicons.glyphMap;
};

const TABS: { key: "photo" | "video" | "milestone" | "album"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "photo", label: "Photos", icon: "image-outline" },
    { key: "video", label: "Videos", icon: "play-outline" },
    { key: "milestone", label: "Milestones", icon: "star-outline" },
    { key: "album", label: "Albums", icon: "heart-outline" },
];

/* TODO: backend se aayega. Abhi mock data (design jaisa) */
const HUCHIKO = require("../../assets/images/pets/huchiko.png");
const CUPID = require("../../assets/images/pets/cupid.png");
const KIKI = require("../../assets/images/pets/kiki.png");

const MEMORIES: Memory[] = [
    {
        id: "1",
        title: "Birthday",
        date: "12 Oct 2026",
        month: "October 2026",
        note: "My little boy turned 2! So many treats, so much love!",
        images: [HUCHIKO],
        kind: "photo",
        icon: "gift-outline",
    },
    {
        id: "2",
        title: "First Step",
        date: "18 Apr 2026",
        month: "April 2026",
        note: "Took his first step today! So proud of you.",
        images: [CUPID],
        kind: "milestone",
        icon: "paw-outline",
    },
    {
        id: "3",
        title: "With Mom",
        date: "05 Mar 2026",
        month: "March 2026",
        note: "My safe place always.",
        images: [KIKI],
        kind: "photo",
        icon: "people-outline",
    },
    {
        id: "4",
        title: "Mountain Trip",
        date: "22 Feb 2026",
        month: "February 2026",
        note: "Exploring new places together with my favourite boy.",
        images: [HUCHIKO, CUPID],
        kind: "album",
        icon: "image-outline",
    },
];

const RECENT_SIZE = (width - SIDE * 2 - s(10) * 3) / 3.6;

export default function MemoryScreen() {
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("photo");

    /* "Photos" tab = sab photos wali memories; baaki tab apni kind se filter */
    const list = useMemo(
        () => (tab === "photo" ? MEMORIES : MEMORIES.filter((m) => m.kind === tab)),
        [tab]
    );

    const groups = useMemo(() => {
        const map: Record<string, Memory[]> = {};
        list.forEach((m) => (map[m.month] = [...(map[m.month] ?? []), m]));
        return Object.entries(map);
    }, [list]);

    if (!fontsLoaded) return null;

    const openEdit = (m: Memory) =>
        router.push({
            pathname: "/AddMemoryScreen",
            params: { id: m.id, title: m.title, date: m.date, note: m.note },
        } as any);

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Memories" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                    Save your favourite moments with your pet.
                </Text>

                {/* COUNT CARD */}
                <View style={styles.countCard}>
                    <Image source={HUCHIKO} resizeMode="contain" style={styles.countImage} />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={styles.countNumber} maxFontSizeMultiplier={1.1}>
                            {MEMORIES.length}
                        </Text>
                        <Text style={styles.countLabel} maxFontSizeMultiplier={1.1}>
                            Memories
                        </Text>
                        <Text style={styles.countHint} maxFontSizeMultiplier={1.1}>
                            and many more to come!
                        </Text>
                    </View>
                </View>

                {/* TABS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabs}
                >
                    {TABS.map((t) => {
                        const on = t.key === tab;
                        return (
                            <Pressable
                                key={t.key}
                                onPress={() => setTab(t.key)}
                                style={[styles.tab, on && styles.tabOn]}
                            >
                                <Ionicons
                                    name={t.icon}
                                    size={s(15)}
                                    color={on ? C.white : C.orange}
                                />
                                <Text
                                    style={[styles.tabText, on && { color: C.white }]}
                                    maxFontSizeMultiplier={1}
                                >
                                    {t.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* RECENT */}
                <View style={styles.sectionRow}>
                    <Text style={styles.heading} maxFontSizeMultiplier={1.1}>
                        Recent Memories
                    </Text>
                </View>

                <FlatList
                    horizontal
                    data={MEMORIES}
                    keyExtractor={(m) => m.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: SIDE, gap: s(10) }}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => openEdit(item)}>
                            <Image
                                source={item.images[0]}
                                resizeMode="cover"
                                style={styles.recentImg}
                            />
                            <Text style={styles.recentDate} maxFontSizeMultiplier={1}>
                                {item.date.slice(0, 6)}
                            </Text>
                        </Pressable>
                    )}
                />

                {/* TIMELINE */}
                <Text style={[styles.heading, { paddingHorizontal: SIDE, marginTop: s(18) }]} maxFontSizeMultiplier={1.1}>
                    Memory Timeline
                </Text>

                {groups.length === 0 ? (
                    <Text style={styles.empty} maxFontSizeMultiplier={1.1}>
                        Nothing here yet. Tap &quot;Add Memory&quot; to save your first one!
                    </Text>
                ) : (
                    groups.map(([month, items]) => (
                        <View key={month} style={styles.group}>
                            <View style={styles.monthRow}>
                                <View style={styles.monthDot} />
                                <Text style={styles.monthText} maxFontSizeMultiplier={1.1}>
                                    {month}
                                </Text>
                            </View>

                            <View style={styles.lineWrap}>
                                <View style={styles.line} />
                                <View style={{ flex: 1 }}>
                                    {items.map((m) => (
                                        <Pressable
                                            key={m.id}
                                            onPress={() => openEdit(m)}
                                            style={styles.memCard}
                                        >
                                            <Image
                                                source={m.images[0]}
                                                resizeMode="cover"
                                                style={styles.memImg}
                                            />
                                            <View style={styles.memIcon}>
                                                <Ionicons name={m.icon} size={s(16)} color={C.orange} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.memTitle} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                                                    {m.title}
                                                </Text>
                                                <Text style={styles.memDate} maxFontSizeMultiplier={1.1}>
                                                    {m.date}
                                                </Text>
                                                <Text style={styles.memNote} numberOfLines={2} maxFontSizeMultiplier={1.1}>
                                                    {m.note}
                                                </Text>
                                            </View>
                                            <Ionicons name="ellipsis-horizontal" size={s(18)} color={C.brown} />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* ADD MEMORY */}
            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Add Memory"
                        onPress={() => router.push("/AddMemoryScreen" as any)}
                        icon={
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingBottom: s(130) },

    subtitle: {
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
        paddingHorizontal: SIDE,
        marginBottom: s(10),
    },

    countCard: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE,
        padding: s(12),
        borderRadius: s(20),
        backgroundColor: "#FFE0C4",
    },
    countImage: { width: s(130), height: s(100) },
    countNumber: { fontFamily: "Fredoka_600SemiBold", fontSize: s(34), color: C.orange, lineHeight: s(38) },
    countLabel: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    countHint: { fontFamily: "Nunito_400Regular", fontSize: s(11.5), color: C.brown },

    tabs: { paddingHorizontal: SIDE, gap: s(8), marginTop: s(14) },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(5),
        paddingHorizontal: s(14),
        paddingVertical: s(8),
        borderRadius: s(14),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    tabOn: { backgroundColor: C.orange, borderColor: C.orange },
    tabText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },

    sectionRow: { paddingHorizontal: SIDE, marginTop: s(18), marginBottom: s(8) },
    heading: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },

    recentImg: { width: RECENT_SIZE, height: RECENT_SIZE, borderRadius: s(14), backgroundColor: "#FFE0C4" },
    recentDate: {
        marginTop: s(4),
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        color: C.brown,
    },

    group: { paddingHorizontal: SIDE, marginTop: s(10) },
    monthRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    monthDot: {
        width: s(12),
        height: s(12),
        borderRadius: s(6),
        borderWidth: 2,
        borderColor: C.orange,
        backgroundColor: C.white,
    },
    monthText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    lineWrap: { flexDirection: "row", marginTop: s(4) },
    line: {
        width: 2,
        marginLeft: s(5),
        marginRight: s(14),
        backgroundColor: "#FFD9A8",
        borderRadius: 1,
    },

    memCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        padding: s(8),
        marginBottom: s(10),
        borderRadius: s(14),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    memImg: { width: s(70), height: s(70), borderRadius: s(10), backgroundColor: "#FFE0C4" },
    memIcon: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    memTitle: { fontFamily: "Nunito_700Bold", fontSize: s(13.5), color: C.brown },
    memDate: { fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.brown, opacity: 0.7 },
    memNote: { marginTop: s(2), fontFamily: "Nunito_400Regular", fontSize: s(11.5), color: C.brown },

    empty: {
        textAlign: "center",
        marginTop: s(24),
        paddingHorizontal: SIDE + s(10),
        fontFamily: "Nunito_400Regular",
        fontSize: s(13),
        color: C.brown,
    },

    bottomContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: s(10),
        paddingBottom: s(27),
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },
    buttonWrapper: { width: "96%", maxWidth: 380, position: "relative", alignSelf: "center" },
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