import React, { createContext, useContext, useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    ImageStyle,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from "react-native";
import { TranslatedText as Text, TranslatedNameText as NameText } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import BottomNav, { useNavHeight } from "./BottomNav";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import { getPetAvatarSource } from "@/services/petAvatar";
import { stickerImage } from "@/services/stickerImage";
import { setTranslationPetName } from "@/i18n/autoTranslate";

import { LinearGradient } from "expo-linear-gradient";

/* ------------------------------------------------------------------
 * RESPONSIVE (same helper as Home / Tasks / Know / Profile)
 * ------------------------------------------------------------------ */
const { width, height } = Dimensions.get("window");
export const SCALE = Math.min(width / 393, height / 852);
export const UI_SCALE = Math.min(SCALE, 1.3);
export const s = (size: number) => size * UI_SCALE;
export const SIDE = s(14);

export const C = {
    orange: "#FF7A00",
    orangeDeep: "#E65F00",
    brown: "#382018",
    muted: "#8F7365",
    iconMuted: "#8B6D5C",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    cream: "#FFF8F0",
    card: "#FFFCFA",
    white: "#FFFFFF",
    divider: "#F0E4DD",
    red: "#FF4B32",
    green: "#5E9B2D",
};

export type KnowItem = {
    key: string;
    title: string;
    sub: string;
    icon: string; // MaterialCommunityIcons name
    color: string;
    tint: string;
    route: string; // sub-page link (pages baad me banenge)
};

const KnowPetContext = createContext<Pet | null>(null);
export const useKnowPet = () => useContext(KnowPetContext);
export function useLoadKnowPet() {
    const [pet, setPet] = useState<Pet | null>(null);
    useEffect(() => {
        let alive = true;
        petcardApi.bootstrap().then(async (data) => {
            const selected = await resolveSelectedPet(data.pets ?? []);
            if (alive) setPet(selected);
        }).catch(() => undefined);
        return () => { alive = false; };
    }, []);
    return pet;
}


/* ------------------------------------------------------------------
 * SCREEN FRAME: back arrow + centered title + scroll + bottom nav
 * Title hamesha center me rehta hai (left aur right dono slot same width)
 * ------------------------------------------------------------------ */
export function KnowFrame({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });
    const activePet = useLoadKnowPet();
    /* Every Know page (menu pages too, not only guides) needs the pet's name for sentence lookups. */
    if (activePet?.name) setTranslationPetName(activePet.name);
    if (!fontsLoaded) return null;

    const goBack = () => {
        if (router.canGoBack()) router.back();
        else router.replace("/KnowScreen" as any);
    };

    return (
        <KnowPetContext.Provider value={activePet}>
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.bgPaw, { top: 300 * SCALE, right: -14 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.bgPaw, { top: 640 * SCALE, left: -22 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + s(8),
                    paddingBottom: NAV_HEIGHT + s(24),
                }}
            >
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerSlot} hitSlop={8}>
                        <Ionicons name="arrow-back" size={s(26)} color={C.brown} />
                    </Pressable>

                    <Text style={styles.headerTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        {title}
                    </Text>

                    <View style={styles.headerSlot}>{right}</View>
                </View>

                {children}
            </ScrollView>

            <BottomNav active="know" />
        </View>
        </KnowPetContext.Provider>
    );
}

/* ------------------------------------------------------------------
 * HERO (rounded banner) + pet
 * ------------------------------------------------------------------ */
export function Hero({ children, tint = "#FFE9D2", heroHeight = 160 }: { children?: React.ReactNode; tint?: string; heroHeight?: number }) {
    return (
        <View style={[styles.hero, { backgroundColor: tint, height: s(heroHeight) }]}>
            <LinearGradient colors={[tint, "#FFFFFF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={[styles.heroBlob, { top: s(-44), right: s(-34), width: s(150), height: s(150), borderRadius: s(75) }]} />
            <View style={[styles.heroBlob, { bottom: s(-56), left: s(-36), width: s(130), height: s(130), borderRadius: s(65) }]} />
            {children}
        </View>
    );
}
export function HeroPet({ size = 150, style }: { size?: number; style?: StyleProp<ImageStyle> }) {
    const pet = useKnowPet();
    return (
        <Image
            /* the sticker the user selected for this pet comes first, then photo, then avatar */
            source={stickerImage(pet?.activeStickerKey) ?? (pet?.photoUrl ? { uri: pet.photoUrl } : getPetAvatarSource(pet?.type, pet?.avatarKey, pet?.avatarLocalId))}
            resizeMode="contain"
            style={[{ position: "absolute", width: s(size), height: s(size) }, style]}
        />
    );
}

export function Decor({
    name,
    size,
    color,
    style,
}: {
    name: string;
    size: number;
    color: string;
    style: StyleProp<ViewStyle>;
}) {
    return (
        <View style={[{ position: "absolute" }, style]}>
            <MaterialCommunityIcons name={name as any} size={s(size)} color={color} />
        </View>
    );
}

/* ------------------------------------------------------------------
 * LIST ROW
 * ------------------------------------------------------------------ */
export function ListRow({
    item,
    boxed,
    last,
}: {
    item: KnowItem;
    boxed?: boolean; // true -> har row alag card (Health screen)
    last?: boolean;
}) {
    const pet = useKnowPet();
    return (
        <Pressable
            onPress={() => router.push(item.route as any)}
            style={[
                styles.row,
                boxed ? styles.rowBoxed : !last && styles.rowDivider,
            ]}
        >
            <View style={[styles.rowIcon, { backgroundColor: item.tint }]}>
                <MaterialCommunityIcons name={item.icon as any} size={s(24)} color={item.color} />
            </View>

            <View style={styles.rowInfo}>
                {/* Sentences are looked up with the sample name "Milo" and the real name is put back after translating. */}
                <NameText style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1} template={item.title} name={pet?.name} />
                <NameText style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={2} template={item.sub} name={pet?.name} />
            </View>

            <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
        </Pressable>
    );
}

/* ------------------------------------------------------------------
 * LIST CARD (heading + sub + rows)
 * ------------------------------------------------------------------ */
export function ListCard({
    heading,
    headingColor = C.brown,
    sub,
    items,
}: {
    heading: string;
    headingColor?: string;
    sub?: string;
    items: readonly KnowItem[];
}) {
    const pet = useKnowPet();
    return (
        <View style={[styles.card, styles.listCard]}>
            <NameText style={[styles.cardHeading, { color: headingColor }]} maxFontSizeMultiplier={1.1} template={heading} name={pet?.name} />
            {sub ? (
                <NameText style={styles.cardSub} maxFontSizeMultiplier={1.1} template={sub} name={pet?.name} />
            ) : null}

            <View style={{ marginTop: s(6) }}>
                {items.map((it, i) => (
                    <ListRow key={it.key} item={it} last={i === items.length - 1} />
                ))}
            </View>
        </View>
    );
}

/* ------------------------------------------------------------------
 * TIP CARD
 * ------------------------------------------------------------------ */
export function TipCard({
    title,
    text,
    titleColor = C.brown,
}: {
    title: string;
    text: string;
    titleColor?: string;
}) {
    const pet = useKnowPet();
    return (
        <View style={[styles.card, styles.tipCard]}>
            <NameText style={[styles.tipTitle, { color: titleColor }]} maxFontSizeMultiplier={1.1} template={title} name={pet?.name} />
            <NameText style={styles.tipText} maxFontSizeMultiplier={1.1} template={text} name={pet?.name} />
        </View>
    );
}

/* ------------------------------------------------------------------
 * STYLES
 * ------------------------------------------------------------------ */
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.cream, overflow: "hidden" },
    bgPaw: {
        position: "absolute",
        width: 92 * SCALE,
        height: 92 * SCALE,
        opacity: 0.07,
        zIndex: 0,
    },

    /* header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        marginBottom: s(12),
    },
    headerSlot: {
        width: s(44),
        height: s(44),
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(21),
        lineHeight: s(28),
        color: C.brown,
    },

    /* hero */
    hero: {
        marginHorizontal: SIDE,
        borderRadius: s(22),
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },

    /* cards */
    card: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(18),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.08,
        shadowRadius: s(6),
        elevation: 2,
    },
    listCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        paddingTop: s(14),
        paddingHorizontal: s(14),
        paddingBottom: s(4),
    },
    cardHeading: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(18),
        lineHeight: s(24),
    },
    cardSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        marginTop: s(4),
    },

    /* rows */
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(10),
        gap: s(12),
    },
    rowDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },
    rowBoxed: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(16),
        paddingHorizontal: s(12),
        marginBottom: s(8),
    },
    rowIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(21),
        alignItems: "center",
        justifyContent: "center",
    },
    rowInfo: { flex: 1 },
    rowTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(11),
        lineHeight: s(15),
        color: C.muted,
        marginTop: s(1),
    },

    /* tip */
    tipCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        padding: s(14),
        backgroundColor: "#FFF3E3",
    },
    tipTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(15) },
    tipText: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        marginTop: s(4),
    },

    heroBlob: { position: "absolute", backgroundColor: "rgba(255,255,255,0.5)" },
});