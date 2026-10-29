import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import { RAW_STICKER_SETS } from "@/constants/stickerSets";

const POINTS = 1250;
const NEXT_REWARD_AT = 2000;
const PROGRESS = Math.min(POINTS / NEXT_REWARD_AT, 1);

/* Abhi static - baad me pet ke avatar se aayega (ChoosePetAvatar ka avatar key) */
const ACTIVE_AVATAR = "huchiko";

/*
 * ChooseStickerScreen wali hi rule:
 * 1-7   -> free (unlocked)
 * 8-10  -> 15 points
 * 11-13 -> 20 points
 * 14-15 -> 30 points
 */
const UNLOCKED_COUNT = 7;
const getCost = (index: number): number | undefined => {
    if (index < UNLOCKED_COUNT) return undefined;
    if (index < 10) return 15;
    if (index < 13) return 20;
    return 30;
};

type Sticker = { id: string; image: any; cost?: number };

const IMAGES: any[] =
    RAW_STICKER_SETS[ACTIVE_AVATAR] ?? Object.values(RAW_STICKER_SETS)[0] ?? [];

const STICKERS: Sticker[] = IMAGES.map((image, index) => ({
    id: `${ACTIVE_AVATAR}-${index + 1}`,
    image,
    cost: getCost(index),
}));

/* Pehle 6 free + 3 locked = design wala 3x3 preview. "View All" me poore 15. */
const PREVIEW: Sticker[] = [
    ...STICKERS.filter((x) => !x.cost).slice(0, 6),
    ...STICKERS.filter((x) => x.cost).slice(0, 3),
];

const EARN = [
    { key: "streak", title: "Complete Daily Streak", points: "+10", icon: "fire", color: "#FF4B32", tint: "#FFE5E1" },
    { key: "invite", title: "Invite a Friend", points: "+100", icon: "account-plus", color: "#FF7A00", tint: "#FFF0D6" },
];

/*
 * Hamesha 3 sticker ek row me (chhoti screen par bhi).
 * Width ka hisaab nahi lagate - har cell flex:1 hai, isliye screen jitni
 * chhoti hogi sticker utna chhota ho jayega aur row kabhi wrap nahi hogi.
 */
const COLS = 3;
const CARD_PAD = s(12);
const GAP = s(10);

const chunk = <T,>(items: T[], size: number): T[][] => {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
    return rows;
};

export default function RewardsScreen() {
    const [fontsLoaded] = useAppFonts();
    const [showAll, setShowAll] = React.useState(false);

    if (!fontsLoaded) return null;

    const rows = chunk(showAll ? STICKERS : PREVIEW, COLS);

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Rewards" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(40) }}>
                {/* POINTS CARD */}
                <View style={styles.pointsCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.pointsLabel} maxFontSizeMultiplier={1.1}>Your Points</Text>
                        <Text style={styles.pointsValue} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                            {POINTS.toLocaleString("en-US")}
                        </Text>
                        <Text style={styles.pointsUnit} maxFontSizeMultiplier={1.1}>Paw Points</Text>
                    </View>

                    <View style={styles.coinWrap}>
                        <Ionicons name="sparkles" size={s(22)} color={C.white} style={styles.sparkleA} />
                        <Ionicons name="sparkles" size={s(14)} color={C.white} style={styles.sparkleB} />
                        <Ionicons name="sparkles" size={s(16)} color={C.white} style={styles.sparkleC} />
                        <Image
                            source={require("../../../assets/images/rewards/pawcoin.png")}
                            resizeMode="contain"
                            style={styles.coin}
                        />
                    </View>

                    <View style={styles.progressWrap}>
                        <View style={styles.progressRow}>
                            <View style={styles.track}>
                                <View style={[styles.fill, { width: `${PROGRESS * 100}%` }]} />
                            </View>
                            <MaterialCommunityIcons name="gift-outline" size={s(18)} color={C.white} />
                        </View>
                        <Text style={styles.progressText} maxFontSizeMultiplier={1.1}>
                            {NEXT_REWARD_AT - POINTS} points to next rewards
                        </Text>
                    </View>
                </View>

                {/* UNLOCK AVATAR STICKERS */}
                <View style={styles.stickerCard}>
                    <View style={styles.stickerHeader}>
                        <Text style={[styles.sectionTitle, { flexShrink: 1 }]} maxFontSizeMultiplier={1.1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                            Unlock Avatar Stickers
                        </Text>
                        <Pressable style={styles.viewAll} onPress={() => setShowAll((v) => !v)}>
                            <Text style={styles.viewAllText} maxFontSizeMultiplier={1.1}>
                                {showAll ? "Show Less" : "View All"}
                            </Text>
                            <Ionicons
                                name={showAll ? "chevron-up" : "chevron-forward"}
                                size={s(14)}
                                color={C.orange}
                            />
                        </Pressable>
                    </View>

                    <Text style={styles.stickerSub} maxFontSizeMultiplier={1.1}>
                        Pick the sticker that matches your pet&apos;s mood!
                    </Text>

                    <View>
                        {rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.gridRow}>
                                {row.map((item) => {
                                    const locked = item.cost !== undefined;

                                    return (
                                        <View key={item.id} style={styles.cellWrap}>
                                            <View style={styles.cell}>
                                                <Image
                                                    source={item.image}
                                                    resizeMode="contain"
                                                    style={[styles.cellImage, locked && styles.cellImageLocked]}
                                                />
                                                {locked ? (
                                                    <View style={styles.lockOverlay} pointerEvents="none">
                                                        <Ionicons name="lock-closed" size={s(22)} color="#381B0E" />
                                                    </View>
                                                ) : null}
                                            </View>

                                            {locked ? (
                                                <View style={styles.pointsPill}>
                                                    <Ionicons name="paw" size={s(11)} color={C.orange} />
                                                    <Text style={styles.pointsText} maxFontSizeMultiplier={1.1}>
                                                        {item.cost}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    );
                                })}

                                {/* last row adhoori ho to khali jagah, taaki size same rahe */}
                                {Array.from({ length: COLS - row.length }).map((_, i) => (
                                    <View key={`empty-${i}`} style={styles.cellWrap} />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                {/* HOW TO EARN */}
                <Text style={[styles.sectionTitle, { marginTop: s(20), marginLeft: SIDE + s(2) }]} maxFontSizeMultiplier={1.1}>
                    How to Earn Points
                </Text>

                <View style={styles.earnCard}>
                    {EARN.map((e, i) => (
                        <Pressable key={e.key} style={[styles.earnRow, i > 0 && styles.earnBorder]}>
                            <View style={[styles.earnIcon, { backgroundColor: e.tint }]}>
                                <MaterialCommunityIcons name={e.icon as any} size={s(20)} color={e.color} />
                            </View>
                            <Text style={styles.earnTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {e.title}
                            </Text>
                            <Text style={styles.earnPoints} maxFontSizeMultiplier={1.1}>{e.points}</Text>
                            <Ionicons name="chevron-forward" size={s(16)} color={C.brown} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    pointsCard: {
        marginHorizontal: SIDE,
        marginTop: s(6),
        padding: s(16),
        borderRadius: s(16),
        backgroundColor: C.orange,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: C.orange,
        shadowOpacity: 0.25,
        shadowRadius: s(8),
        shadowOffset: { width: 0, height: s(4) },
        elevation: 4,
    },
    pointsLabel: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.white },
    pointsValue: { fontFamily: "Nunito_700Bold", fontSize: s(46), lineHeight: s(54), color: C.white },
    pointsUnit: { fontFamily: "Nunito_700Bold", fontSize: s(16), color: C.white },

    coinWrap: { width: s(110), height: s(110), alignItems: "center", justifyContent: "center" },
    coin: { width: s(86), height: s(86) },
    sparkleA: { position: "absolute", top: s(2), left: s(2), opacity: 0.9 },
    sparkleB: { position: "absolute", top: s(-4), right: s(2), opacity: 0.9 },
    sparkleC: { position: "absolute", bottom: s(6), left: s(8), opacity: 0.9 },

    progressWrap: { width: "100%", marginTop: s(8) },
    progressRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    track: {
        flex: 1,
        height: s(9),
        borderRadius: s(5),
        backgroundColor: "rgba(255,255,255,0.35)",
        overflow: "hidden",
    },
    fill: { height: "100%", borderRadius: s(5), backgroundColor: C.white },
    progressText: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.white,
        marginTop: s(6),
    },

    sectionTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    viewAll: { flexDirection: "row", alignItems: "center", gap: s(2) },
    viewAllText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },

    /* STICKERS */
    stickerCard: {
        ...cardStyle,
        marginHorizontal: SIDE,
        marginTop: s(18),
        padding: CARD_PAD,
        backgroundColor: "#FFF6EC",
    },
    stickerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: s(8),
    },
    stickerSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(2),
        marginBottom: s(12),
        flexShrink: 1,
    },
    gridRow: {
        flexDirection: "row",
        gap: GAP,
        marginBottom: s(16),
    },
    cellWrap: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
    },
    cell: {
        width: "100%",
        aspectRatio: 0.95,
        borderRadius: s(16),
        backgroundColor: "#FFF3E3",
        borderWidth: 1,
        borderColor: "#FFD4A8",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    cellImage: { width: "86%", height: "86%" },
    cellImageLocked: { opacity: 0.3 },
    lockOverlay: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },
    pointsPill: {
        position: "absolute",
        bottom: s(-10),
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
        paddingHorizontal: s(10),
        paddingVertical: s(1),
        borderRadius: s(12),
        backgroundColor: "#FFE0C4",
        borderWidth: 1,
        borderColor: C.orange,
    },
    pointsText: { fontFamily: "Fredoka_600SemiBold", fontSize: s(13), color: C.orange },

    earnCard: { ...cardStyle, marginHorizontal: SIDE, marginTop: s(12), paddingHorizontal: s(10) },
    earnRow: { flexDirection: "row", alignItems: "center", paddingVertical: s(12), gap: s(10) },
    earnBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    earnIcon: {
        width: s(36),
        height: s(36),
        borderRadius: s(10),
        alignItems: "center",
        justifyContent: "center",
    },
    earnTitle: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    earnPoints: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },
});