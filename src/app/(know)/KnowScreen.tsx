import PetHubDrawer from "@/components/PetHubDrawer";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

const { width, height } = Dimensions.get("window");
const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const C = {
    orange: "#FF7A00",
    brown: "#382018",
    muted: "#8F7365",
    iconMuted: "#8B6D5C",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    card: "#FFFCFA",
    white: "#FFFFFF",
    purple: "#7A5CFF",
};

/*
 * 8 CATEGORY CARDS
 * Abhi sirf link (route) rakha hai. Page baad me banate hain,
 * tab tak router.push in routes pe jayega (pages bante hi chalne lagenge).
 */
const CATEGORIES = [
    {
        key: "breed",
        title: "Breed Information",
        sub: "Learn all about Milo's breed, traits, behavior & more.",
        icon: "book-open-page-variant",
        tint: "#EAF3DC",
        border: "#D6E8BD",
        iconColor: "#5E9B2D",
        route: "/BreedInformationScreen",
    },
    {
        key: "health",
        title: "Health & Wellness",
        sub: "Tips to keep Milo healthy in body & mind.",
        icon: "heart-pulse",
        tint: "#FFE5E1",
        border: "#FFCFC8",
        iconColor: "#FF4B32",
        route: "/HealthWellnessScreen",
    },
    {
        key: "food",
        title: "Food & Nutrition",
        sub: "Best food choices, diet plans & nutrition tips.",
        icon: "food-drumstick",
        tint: "#FFF0D6",
        border: "#FFDFA8",
        iconColor: "#E08A00",
        route: "/FoodNutritionScreen",
    },
    {
        key: "grooming",
        title: "Grooming",
        sub: "Keep Milo clean, comfy & looking great!",
        icon: "content-cut",
        tint: "#F3EAFF",
        border: "#E2D2FF",
        iconColor: "#7A5CFF",
        route: "/GroomingScreen",
    },
    {
        key: "training",
        title: "Training",
        sub: "Train Milo with easy steps & positive methods.",
        icon: "school",
        tint: "#E6F0FA",
        border: "#CFE0F3",
        iconColor: "#3B6FB6",
        route: "/TrainingScreen",
    },
    {
        key: "safety",
        title: "Safety",
        sub: "Keep Milo safe at home & on every adventure.",
        icon: "shield-check",
        tint: "#FFE9D6",
        border: "#FFD2AE",
        iconColor: "#FF7A00",
        route: "/SafetyScreen",
    },
    {
        key: "care",
        title: "Basic Care",
        sub: "Daily care essentials for a happy Milo.",
        icon: "home-heart",
        tint: "#E3F4F1",
        border: "#C6E6E0",
        iconColor: "#2E9C8A",
        route: "/BasicCareScreen",
    },
    {
        key: "ai",
        title: "PawChat AI",
        sub: "Ask anything about Milo. Your AI pet care assistant!",
        icon: "robot-happy",
        tint: "#EFE9FF",
        border: "#DCCFFF",
        iconColor: "#7A5CFF",
        route: "/AIChatScreen",
        isNew: true,
    },
] as const;

export default function KnowScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [query, setQuery] = useState("");

    /* Pet Hub drawer (left se slide) */
    const [hubOpen, setHubOpen] = useState(false);

    /* kisi aur page pe jaate hi drawer band (wapas aane pe khula na mile) */
    useFocusEffect(
        useCallback(() => {
            return () => setHubOpen(false);
        }, [])
    );

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    if (!fontsLoaded) return null;

    const open = (route: string) => router.push(route as any);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 330 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    {/* menu -> Pet Hub drawer */}
                    <Pressable style={styles.iconButton} onPress={() => setHubOpen(true)}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={{ flex: 1 }} />

                    <Pressable style={styles.iconButton} onPress={() => router.push("/notifications" as any)}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>3</Text>
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
                        <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>XP 1,250</Text>
                    </Pressable>
                </View>

                {/* HERO */}
                <View style={styles.hero}>
                    <View style={styles.heroText}>
                        <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1}>Know Your Pet</Text>
                        <Text style={styles.heroSub} maxFontSizeMultiplier={1.1}>
                            Everything you need to keep Milo happy & healthy! 
                        </Text>
                    </View>

                    <View style={styles.heroDecor}>
                        <View style={styles.heroPlant} />
                        <View style={styles.heroBowl} />
                    </View>
                    <Image
                        source={require("../../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.heroPet}
                    />
                </View>

                {/* SEARCH */}
                <View style={[styles.card, styles.searchBox]}>
                    <Ionicons name="search" size={s(20)} color={C.muted} />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search for topics, tips & more..."
                        placeholderTextColor={C.muted}
                        style={styles.searchInput}
                        maxFontSizeMultiplier={1.1}
                        returnKeyType="search"
                    />
                </View>

                {/* CATEGORY GRID */}
                <View style={styles.grid}>
                    {CATEGORIES.filter((c) =>
                        c.title.toLowerCase().includes(query.trim().toLowerCase())
                    ).map((c) => (
                        <Pressable
                            key={c.key}
                            onPress={() => open(c.route)}
                            style={[styles.catCard, { backgroundColor: c.tint, borderColor: c.border }]}
                        >
                            {"isNew" in c && c.isNew ? (
                                <View style={styles.newTag}>
                                    <Text style={styles.newTagText} maxFontSizeMultiplier={1}>New</Text>
                                </View>
                            ) : null}

                            <View style={styles.catIconBox}>
                                <MaterialCommunityIcons name={c.icon as any} size={s(30)} color={c.iconColor} />
                            </View>

                            <View style={styles.catInfo}>
                                <Text style={styles.catTitle} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                    {c.title}
                                </Text>
                                <Text style={styles.catSub} maxFontSizeMultiplier={1.1} numberOfLines={3}>
                                    {c.sub}
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={s(15)} color={C.brown} />
                        </Pressable>
                    ))}
                </View>

                {/* FEATURED */}
                <View style={styles.featuredWrap}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Featured for You</Text>
                        
                    </View>

                    <Pressable style={[styles.card, styles.featuredCard]}>
                        <Image
                            source={require("../../../assets/images/pets/huchiko.png")}
                            resizeMode="contain"
                            style={styles.featuredImg}
                        />
                        <View style={styles.featuredInfo}>
                            <View style={styles.careTag}>
                                <Text style={styles.careTagText} maxFontSizeMultiplier={1}>Care Tip</Text>
                            </View>
                            <Text style={styles.featuredTitle} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                How to Keep Your Dog Hydrated in Summer
                            </Text>
                            <Text style={styles.featuredSub} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                Simple tips to make sure your dog stays cool, healthy & hydrated.
                            </Text>
                            <View style={styles.readBtn}>
                                <Text style={styles.readBtnText} maxFontSizeMultiplier={1.1}>Read More</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons
                            name="white-balance-sunny"
                            size={s(28)}
                            color="#FFB300"
                            style={styles.sunIcon}
                        />
                    </Pressable>
                </View>

                {/* ASK AI BANNER */}
                <View style={styles.askBanner}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={s(34)} color={C.purple} />
                    <View style={{ flex: 1, marginLeft: s(8) }}>
                        <Text style={styles.askTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Have a question about Milo?
                        </Text>
                        <Text style={styles.askSub} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                            Ask PawChat AI – your smart pet care buddy!
                        </Text>
                    </View>
                    <Pressable style={styles.askBtn} onPress={() => open("/AIChatScreen")}>
                        <Text style={styles.askBtnText} maxFontSizeMultiplier={1.1}>Ask Now ✦</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <BottomNav active="know" />

            {/* PET HUB DRAWER (sabse upar render hona chahiye) */}
            <PetHubDrawer visible={hubOpen} onClose={() => setHubOpen(false)} />
        </View>
    );
}

const SIDE = s(14);
const GAP = s(10);

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
    topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: SIDE, gap: s(8) },
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
    xpCoinPaw: { width: s(16), height: s(16) },
    xpText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },

    /* hero */
    hero: {
        height: s(190),
        marginTop: s(6),
        paddingHorizontal: SIDE,
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#FFF3E3",
        borderBottomLeftRadius: s(28),
        borderBottomRightRadius: s(28),
    },
    heroText: { width: "55%", zIndex: 2 },
    heroTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        lineHeight: s(32),
        color: C.brown,
    },
    heroSub: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        color: C.brown,
        marginTop: s(6),
    },
    heroDecor: { ...StyleSheet.absoluteFill },
    heroPlant: {
        position: "absolute",
        right: s(96),
        bottom: s(56),
        width: s(36),
        height: s(48),
        borderRadius: s(12),
        backgroundColor: "#8FB06A",
    },
    heroBowl: {
        position: "absolute",
        right: s(24),
        bottom: s(10),
        width: s(40),
        height: s(16),
        borderRadius: s(8),
        backgroundColor: "#7ACB9C",
    },
    heroPet: {
        position: "absolute",
        right: s(10),
        bottom: s(6),
        width: s(160),
        height: s(176),
    },

    /* search */
    searchBox: {
        marginHorizontal: SIDE,
        marginTop: s(-22),
        height: s(50),
        paddingHorizontal: s(14),
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
        backgroundColor: C.white,
    },
    searchInput: {
        flex: 1,
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.brown,
        paddingVertical: 0,
    },

    /* grid: 2 columns (width % se, har screen pe barabar) */
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: SIDE,
        marginTop: s(14),
        rowGap: GAP,
    },
    catCard: {
        width: "48.5%",
        minHeight: s(96),
        borderRadius: s(16),
        borderWidth: 1,
        padding: s(10),
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
    },
    catIconBox: {
        width: s(46),
        height: s(46),
        borderRadius: s(14),
        backgroundColor: "rgba(255,255,255,0.75)",
        alignItems: "center",
        justifyContent: "center",
    },
    catInfo: { flex: 1 },
    catTitle: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    catSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        lineHeight: s(13),
        color: C.muted,
        marginTop: s(2),
    },
    newTag: {
        position: "absolute",
        top: s(-8),
        right: s(10),
        backgroundColor: C.purple,
        paddingHorizontal: s(8),
        paddingVertical: s(2),
        borderRadius: s(8),
        zIndex: 2,
    },
    newTagText: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: C.white },

    /* featured */
    featuredWrap: { paddingHorizontal: SIDE, marginTop: s(16) },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: s(10),
    },
    sectionTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    sectionAction: { flexDirection: "row", alignItems: "center" },
    sectionActionText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },
    featuredCard: {
        flexDirection: "row",
        padding: s(10),
        backgroundColor: "#FFF3E3",
        alignItems: "center",
        gap: s(10),
    },
    featuredImg: {
        width: s(110),
        height: s(110),
        borderRadius: s(14),
        backgroundColor: C.peach,
    },
    featuredInfo: { flex: 1 },
    careTag: {
        alignSelf: "flex-start",
        backgroundColor: "#D6EAB8",
        paddingHorizontal: s(8),
        paddingVertical: s(2),
        borderRadius: s(6),
    },
    careTagText: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: "#5E9B2D" },
    featuredTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(15),
        lineHeight: s(19),
        color: C.brown,
        marginTop: s(4),
    },
    featuredSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        lineHeight: s(13),
        color: C.muted,
        marginTop: s(2),
    },
    readBtn: {
        alignSelf: "flex-start",
        marginTop: s(6),
        backgroundColor: C.orange,
        paddingHorizontal: s(12),
        paddingVertical: s(5),
        borderRadius: s(10),
    },
    readBtnText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.white },
    sunIcon: { position: "absolute", top: s(8), right: s(10) },

    /* ask banner */
    askBanner: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        padding: s(12),
        borderRadius: s(16),
        backgroundColor: "#F3EAFF",
        borderWidth: 1,
        borderColor: "#E2D2FF",
        flexDirection: "row",
        alignItems: "center",
    },
    askTitle: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    askSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(10), color: C.muted, marginTop: s(1) },
    askBtn: {
        backgroundColor: C.purple,
        paddingHorizontal: s(14),
        paddingVertical: s(8),
        borderRadius: s(12),
        marginLeft: s(8),
    },
    askBtnText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.white },
});