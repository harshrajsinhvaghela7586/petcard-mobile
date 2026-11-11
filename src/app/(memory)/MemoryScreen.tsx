import { appAlert } from "@/components/AppDialog";
import React, { useCallback, useMemo, useState } from "react";
import { petcardApi, Memory as ApiMemory, type Pet } from "@/services/petcardApi";
import { useRequirePermission } from "@/hooks/use-require-permission";
import { canOnPet } from "@/services/petPermissions";
import { resolveSelectedPet } from "@/services/petSelection";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import SafeImage from "@/components/SafeImage";
import { getPetAvatarSource } from "@/services/petAvatar";
import { stickerUri } from "@/services/stickerImage";

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
    { key: "milestone", label: "Milestones", icon: "star-outline" },
    { key: "album", label: "Albums", icon: "heart-outline" },
];

const RECENT_SIZE = (width - SIDE * 2 - s(10) * 3) / 3.6;

export default function MemoryScreen() {
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("photo");
    const [memories, setMemories] = useState<Memory[]>([]);
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);

    /* Reloads every time the screen is focused: a new sticker / memory shows up right away. */
    useFocusEffect(useCallback(() => {
        let alive = true;
        (async () => {
            try {
                const { pets } = await petcardApi.listPets();
                const selected = await resolveSelectedPet(pets ?? []);
                if (alive) setPet(selected ?? null);
                if (!selected?.id || !canOnPet(selected, "view_memories")) { if (alive) setMemories([]); return; }
                const result = await petcardApi.listMemories(selected.id, undefined, 30);
                if (!alive) return;
                setMemories((result.memories ?? []).map((m: ApiMemory) => {
                    const parsed = new Date(`${m.date}T12:00:00`);
                    const month = Number.isNaN(parsed.getTime()) ? "Memories" : parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                    const displayDate = Number.isNaN(parsed.getTime()) ? m.date : parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                    return { id: m.id, title: m.title || "Memory", date: displayDate, month, note: m.caption || "", images: m.photo?.url ? [{ uri: m.photo.url }] : [], kind: "photo" as const, icon: "image-outline" as const };
                }));
            } catch (error) {
                if (alive) appAlert("Couldn't load memories", error instanceof Error ? error.message : "Please try again.");
            } finally { if (alive) setLoading(false); }
        })();
        return () => { alive = false; };
    }, []));

    /* "Photos" tab = all persisted photo memories; unsupported types remain empty until implemented. */
    const list = useMemo(
        () => (tab === "photo" ? memories : memories.filter((m) => m.kind === tab)),
        [tab, memories]
    );

    const groups = useMemo(() => {
        const map: Record<string, Memory[]> = {};
        list.forEach((m) => (map[m.month] = [...(map[m.month] ?? []), m]));
        return Object.entries(map);
    }, [list]);

    const mayView = useRequirePermission(pet, "view_memories", !loading);
    const canManageMemories = canOnPet(pet, "manage_memories");
    if (!fontsLoaded || !mayView) return null;

    /* Picture in the count card (same as the Digital PetCard): the sticker the user chose -> else the pet photo -> else the avatar (fallback). */
    const rawSticker: any = stickerUri(pet?.activeStickerKey);
    const stickerSource: any = rawSticker ? (typeof rawSticker === "string" ? { uri: rawSticker } : rawSticker) : null;
    const cardImage: any = stickerSource ?? (pet?.photoUrl ? { uri: pet.photoUrl } : null);

    const openEdit = (m: Memory) =>
        canManageMemories && router.push({
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
                {loading ? <Text style={{ color: C.muted, paddingVertical: s(10) }}>Loading memories...</Text> : null}
                {!loading && memories.length === 0 ? <Text style={{ color: C.muted, paddingVertical: s(10) }}>No memories yet. Add your first memory.</Text> : null}

                {/* COUNT CARD */}
                <View style={styles.countCard}>
                    <SafeImage
                        fallback={getPetAvatarSource(pet?.type, pet?.avatarKey)}
                        source={cardImage}
                        resizeMode="contain"
                        style={styles.countImage}
                    />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={styles.countNumber} maxFontSizeMultiplier={1.1}>
                            {memories.length}
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
                    data={memories}
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
            {canManageMemories ? <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Add Memory"
                        onPress={() => router.push("/AddMemoryScreen" as any)}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View> : null}
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