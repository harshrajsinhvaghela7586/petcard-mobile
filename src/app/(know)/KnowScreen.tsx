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
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput, TranslatedNameText } from "@/i18n/TranslatedText";
import { setTranslationPetName, tr, useAutoTranslateVersion } from "@/i18n/autoTranslate";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SwipeTabs from "@/components/SwipeTabs";
import BottomNav, { useNavHeight } from "../../components/BottomNav";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { petImageSource, stickerUri } from "@/services/stickerImage";
import { resolveSelectedPet } from "@/services/petSelection";

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

/* "Featured for You" card: text, icon and the question sent to PawChat AI change with the pet type. */
const FEATURED = {
    dog: {
        tag: "Care Tip",
        title: "How to Keep Your Dog Hydrated in Summer",
        sub: "Simple tips to keep your dog cool, healthy & hydrated.",
        icon: "white-balance-sunny",
        color: "#FFB300",
        ask: (name?: string) => `How can I keep my dog${name ? ` ${name}` : ""} hydrated and cool in summer? Please share simple tips.`,
    },
    cat: {
        tag: "Care Tip",
        title: "How to Get Your Cat to Drink More Water",
        sub: "Easy ways to keep your cat hydrated and healthy every day.",
        icon: "water",
        color: "#3B8FD6",
        ask: (name?: string) => `How can I get my cat${name ? ` ${name}` : ""} to drink more water and stay hydrated? Please share simple tips.`,
    },
    rabbit: {
        tag: "Care Tip",
        title: "How to Keep Your Rabbit Cool in Summer",
        sub: "Rabbits overheat easily. Simple ways to keep them safe.",
        icon: "thermometer",
        color: "#E0502F",
        ask: (name?: string) => `How can I keep my rabbit${name ? ` ${name}` : ""} cool and hydrated in summer? Please share simple tips.`,
    },
} as const;

export default function KnowScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [query, setQuery] = useState("");
    const [activePet, setActivePet] = useState<Pet | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    useFocusEffect(useCallback(() => {
      let alive = true;
      petcardApi.bootstrap().then(async (data) => { const pet = await resolveSelectedPet(data.pets ?? []); if (alive) { setActivePet(pet); setUnreadCount(data.unreadNotifications ?? 0); } }).catch(() => undefined);
      return () => { alive = false; };
    }, []));

    /* Pet Hub drawer (left se slide) */
    const [hubOpen, setHubOpen] = useState(false);

    /* kisi aur page pe jaate hi drawer band (wapas aane pe khula na mile) */
    useFocusEffect(
        useCallback(() => {
            return () => setHubOpen(false);
        }, [])
    );

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    /* Sentences with the pet's name are looked up with the sample name "Milo"; re-render when new translations arrive. */
    if (activePet?.name) setTranslationPetName(activePet.name);
    useAutoTranslateVersion();
    if (!fontsLoaded) return null;

    /* Name as shown on this screen (shortened to fit); empty when there is no pet yet. */
    const shownName = activePet?.name ? (activePet.name.length > 10 ? `${activePet.name.slice(0, 10)}…` : activePet.name) : "";

    const open = (route: string) => router.push(route as any);

    /* Featured card: content for this pet type; tapping it asks PawChat AI the matching question. */
    const petKind: "dog" | "cat" | "rabbit" = activePet?.type === "cat" || activePet?.type === "rabbit" ? activePet.type : "dog";
    const featured = FEATURED[petKind];
    const askFeatured = () =>
        router.push({ pathname: "/AIChatScreen", params: { ask: featured.ask(activePet?.name) } } as any);

    return (
        <SwipeTabs active="know">
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
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
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
                        <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>XP {(activePet?.progress?.xp ?? 0).toLocaleString()}</Text>
                    </Pressable>
                </View>

                {/* HERO */}
                <View style={styles.hero}>
                    <View style={styles.heroText}>
                        <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1}>Know Your Pet</Text>
                        <TranslatedNameText
                            style={styles.heroSub}
                            maxFontSizeMultiplier={1.1}
                            template={shownName ? "Everything you need to keep Milo happy & healthy!" : "Everything you need to keep your pet happy & healthy!"}
                            name={shownName}
                        />
                    </View>

                    <View style={styles.heroDecor}>
                        <View style={styles.heroPlant} />
                        <View style={styles.heroBowl} />
                    </View>
                    <Image
                        source={petImageSource(activePet)}
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
                    {CATEGORIES.filter((c) => {
                        /* Search works in English and in the chosen language. */
                        const q = query.trim().toLowerCase();
                        return c.title.toLowerCase().includes(q) || tr(c.title).toLowerCase().includes(q);
                    }).map((c) => (
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
                                <TranslatedNameText
                                    style={styles.catSub}
                                    maxFontSizeMultiplier={1.1}
                                    numberOfLines={3}
                                    template={shownName ? c.sub : c.sub.replace(/Milo/g, "your pet")}
                                    name={shownName}
                                />
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

                    <Pressable style={[styles.card, styles.featuredCard]} onPress={askFeatured}>
                        <Image
                            source={petImageSource(activePet)}
                            resizeMode="contain"
                            style={styles.featuredImg}
                        />
                        <View style={styles.featuredInfo}>
                            <View style={styles.careTag}>
                                <Text style={styles.careTagText} maxFontSizeMultiplier={1}>{featured.tag}</Text>
                            </View>
                            <Text style={styles.featuredTitle} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                {featured.title}
                            </Text>
                            <Text style={styles.featuredSub} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                {featured.sub}
                            </Text>
                            <View style={styles.readBtn}>
                                <LinearGradient colors={["#ff7a00", "#ff9b2f", "#ff8400", "#ffb347"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.readBtnGradient}>
                                    <Text style={styles.readBtnText} maxFontSizeMultiplier={1.1}>Read More</Text>
                                </LinearGradient>
                            </View>
                        </View>
                        <MaterialCommunityIcons
                            name={featured.icon as any}
                            size={s(28)}
                            color={featured.color}
                            style={styles.sunIcon}
                        />
                    </Pressable>
                </View>

                {/* ASK AI BANNER */}
                 <View style={styles.askBanner}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={s(34)} color={C.purple} />
                    <View style={{ flex: 1, marginLeft: s(8) }}>
                        <Text style={styles.askTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Have a question about {activePet?.name ?? "your pet"}?
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
            <PetHubDrawer visible={hubOpen} onClose={() => setHubOpen(false)} petName={activePet?.name ?? "your pet"} petType={activePet?.type ?? "dog"} avatarKey={activePet?.avatarKey ?? ""} photoUrl={stickerUri((activePet as any)?.activeStickerKey) ?? activePet?.photoUrl ?? null} unreadCount={unreadCount} />
        </View>
        </SwipeTabs>
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
        borderRadius: s(10),
        overflow: "hidden",
    },
    readBtnGradient: { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(10) },
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