import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

/* Colors (reference screenshot se liye gaye) */
const BROWN = "#381B0E";
const ORANGE = "#FF7A00";
const ORANGE_DEEP = "#FD6002"; // number circles, "a way home"
const PINK = "#FF1F6B";
const CREAM = "#FEFAF5";
const PEACH = "#FDC382";
const PEACH_LIGHT = "#FEE3C7";
const DARK_CARD = "#6C3A16";
const DARK_HEAD = "#FFD27F";
const DARK_TEXT = "#FDE3C5";

/* require ke paths static hone chahiye (Metro limitation) */
const IMG = {
    hachiko: require("../../assets/images/about/image1.png"),
    brownie: require("../../assets/images/about/image2.png"),
    missing: require("../../assets/images/about/image3.png"),
    cat: require("../../assets/images/about/image4.png"),
    whiteCat: require("../../assets/images/about/image5.png"),
    bunny: require("../../assets/images/about/image6.png"),
    collie: require("../../assets/images/about/image7.png"),
    bye: require("../../assets/images/about/image8.png"),
};

type Variant = "peach" | "dark" | "light";

const THEME: Record<
    Variant,
    { bg: string; iconBox: string; text: string }
> = {
    peach: { bg: PEACH, iconBox: "rgba(255,255,255,0.45)", text: "#5A3016" },
    dark: { bg: DARK_CARD, iconBox: "rgba(255,255,255,0.18)", text: DARK_TEXT },
    light: { bg: PEACH_LIGHT, iconBox: "rgba(255,255,255,0.7)", text: "#5A3016" },
};

type CardProps = {
    variant: Variant;
    icon: keyof typeof Ionicons.glyphMap;
    number?: string;
    title: string;
    titleColor: string;
    text: string;
    image: any;
};

function StoryCard({ variant, icon, number, title, titleColor, text, image }: CardProps) {
    const t = THEME[variant];
    return (
        <View style={[styles.card, { backgroundColor: t.bg }]}>
            {/* halka paw watermark */}
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={styles.cardPaw}
            />

            <View style={styles.cardLeft}>
                <View style={styles.badgeRow}>
                    <View style={[styles.iconBox, { backgroundColor: t.iconBox }]}>
                        <Ionicons name={icon} size={s(18)} color={ORANGE} />
                    </View>
                    {number ? (
                        <View style={styles.numCircle}>
                            <Text style={styles.numText} maxFontSizeMultiplier={1}>
                                {number}
                            </Text>
                        </View>
                    ) : null}
                </View>

                <Text
                    style={[styles.cardTitle, { color: titleColor }]}
                    maxFontSizeMultiplier={1.1}
                >
                    {title}
                </Text>
                <Text
                    style={[styles.cardText, { color: t.text }]}
                    maxFontSizeMultiplier={1.1}
                >
                    {text}
                </Text>
            </View>

            <Image source={image} resizeMode="contain" style={styles.cardImage} />
        </View>
    );
}

/* "a way home" ke dono side ki chhoti sparkle lines */
function Spark({ flip }: { flip?: boolean }) {
    return (
        <View style={[styles.spark, flip && { transform: [{ scaleX: -1 }] }]}>
            <View style={[styles.sparkBar, { transform: [{ rotate: "-35deg" }] }]} />
            <View style={styles.sparkBar} />
            <View style={[styles.sparkBar, { transform: [{ rotate: "35deg" }] }]} />
        </View>
    );
}

export default function AboutScreen() {
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="About Us" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* ---------- HERO ---------- */}
                <View style={styles.hero}>
                    <View style={styles.heroLeft}>
                        <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1}>
                            It all started with a dog{"\n"}
                            name <Text style={{ color: BROWN }}>Hachiko</Text>
                        </Text>
                        <Text style={styles.heroText} maxFontSizeMultiplier={1.1}>
                            <Text style={{ color: ORANGE }}>PetCard</Text> began with a deeply
                            personal experience that turned into a simple mission: helping
                            every lost pet find their way home.
                        </Text>
                    </View>
                    <Image source={IMG.hachiko} resizeMode="contain" style={styles.heroImage} />
                </View>

                {/* ---------- STORY ---------- */}
                <View style={styles.storyBand}>
                    <View style={styles.storyHead}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.storyTitle} maxFontSizeMultiplier={1.1}>
                                A personal loss{"\n"}became a bigger mission.
                            </Text>
                            <Text style={styles.storySub} maxFontSizeMultiplier={1.1}>
                                Our founder loved his dog deeply. He was more than a pet, he was
                                family, a constant companion, and a part of everyday life.
                            </Text>
                        </View>
                        <Image
                            source={require("../../assets/images/paw.png")}
                            resizeMode="contain"
                            style={styles.storyPaw}
                        />
                    </View>

                    <StoryCard
                        variant="peach"
                        icon="paw"
                        title={"It started with\nBrownie"}
                        titleColor={PINK}
                        text="It all started with a dog named Brownie."
                        image={IMG.brownie}
                    />
                    <StoryCard
                        variant="dark"
                        icon="paw"
                        title={"Everything\nchanged"}
                        titleColor={DARK_HEAD}
                        text="One day, Brownie went missing. The search began, but the reunion never came."
                        image={IMG.missing}
                    />
                    <StoryCard
                        variant="light"
                        icon="paw"
                        title={"A question\nremained"}
                        titleColor={ORANGE_DEEP}
                        text={
                            "\u201CWhat if every lost pet could be recognised and connected back to the family that loves them?\u201D"
                        }
                        image={IMG.cat}
                    />
                    <StoryCard
                        variant="peach"
                        icon="paw"
                        title={"The mission\nbecame PetCard"}
                        titleColor="#5A2E10"
                        text="That question became a mission. And that mission became PetCard."
                        image={IMG.whiteCat}
                    />
                </View>

                {/* ---------- BELIEF ---------- */}
                <View style={styles.belief}>
                    <View style={styles.beliefTitleRow}>
                        <Spark />
                        <Text style={styles.beliefTitle} maxFontSizeMultiplier={1.1}>
                            No pet should be lost{"\n"}without{" "}
                            <Text style={{ color: "#FE6B27" }}>a way home.</Text>
                        </Text>
                        <Spark flip />
                    </View>

                    <Text style={styles.beliefText} maxFontSizeMultiplier={1.1}>
                        We&apos;re building PetCard with one simple belief:{"\n"}
                        no pet should be lost without a way home.{"\n"}
                        Our goal is to make every pet recognizable, even when they are found
                        alone on the streets, so that the people who find them can help them
                        get back to their parents.
                    </Text>

                    <StoryCard
                        variant="peach"
                        icon="home"
                        number="01"
                        title="Connected back home"
                        titleColor="#F5245F"
                        text="Help the people who find a lost pet connect them back to the family that loves them."
                        image={IMG.bunny}
                    />
                    <StoryCard
                        variant="dark"
                        icon="paw"
                        number="02"
                        title="Built for recognition"
                        titleColor="#F9CD87"
                        text="Make every pet recognisable, even when they are found alone on the streets."
                        image={IMG.collie}
                    />
                    <StoryCard
                        variant="light"
                        icon="people"
                        number="03"
                        title="Pets are family"
                        titleColor="#FD6A10"
                        text="Their identity, health, routines, memories and milestones deserve a place of their own."
                        image={IMG.bye}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const CARD_IMG = s(128);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingBottom: s(40) },

    /* HERO */
    hero: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        paddingTop: s(4),
        paddingBottom: s(14),
    },
    heroLeft: { flex: 1, paddingRight: s(4) },
    heroTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(21),
        lineHeight: s(29),
        color: ORANGE,
    },
    heroText: {
        marginTop: s(8),
        fontFamily: "Nunito_400Regular",
        fontSize: s(13),
        lineHeight: s(21),
        color: BROWN,
    },
    heroImage: { width: s(150), height: s(170) },

    /* STORY */
    storyBand: {
        backgroundColor: CREAM,
        paddingHorizontal: SIDE,
        paddingTop: s(18),
        paddingBottom: s(8),
    },
    storyHead: { flexDirection: "row", alignItems: "center", marginBottom: s(14) },
    storyTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(21),
        lineHeight: s(25),
        fontWeight:900,
        color: BROWN,
    },
    storySub: {
        marginTop: s(6),
        fontFamily: "Nunito_400Regular",
        fontSize: s(10.5),
        lineHeight: s(15),
        color: BROWN,
    },
    storyPaw: {
        width: s(54),
        height: s(54),
        opacity: 0.25,
        transform: [{ rotate: "12deg" }],
    },

    /* CARD */
    card: {
        flexDirection: "row",
        minHeight: s(150),
        borderRadius: s(22),
        paddingVertical: s(14),
        paddingLeft: s(14),
        marginBottom: s(14),
        overflow: "hidden",
    },
    cardLeft: { width: "56%", justifyContent: "center", zIndex: 2 },
    cardImage: {
        position: "absolute",
        right: s(4),
        top: 0,
        bottom: 0,
        width: CARD_IMG,
        height: "100%",
        zIndex: 1,
    },
    cardPaw: {
        position: "absolute",
        right: s(95),
        top: s(14),
        width: s(56),
        height: s(56),
        opacity: 0.14,
        transform: [{ rotate: "-12deg" }],
    },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: s(14), marginBottom: s(8) },
    iconBox: {
        width: s(34),
        height: s(34),
        borderRadius: s(10),
        alignItems: "center",
        justifyContent: "center",
    },
    numCircle: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: ORANGE_DEEP,
        alignItems: "center",
        justifyContent: "center",
    },
    numText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: "#FFFFFF" },
    cardTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(19),
        fontWeight:900,
        lineHeight: s(22),
    },
    cardText: {
        marginTop: s(4),
        fontFamily: "Nunito_400Regular",
        fontSize: s(11.5),
        lineHeight: s(16),
    },

    /* BELIEF */
    belief: { paddingHorizontal: SIDE, paddingTop: s(26) },
    beliefTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(8),
    },
    beliefTitle: {
        textAlign: "center",
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        fontWeight:900,
        lineHeight: s(27),
        color: BROWN,
    },
    beliefText: {
        textAlign: "center",
        marginTop: s(12),
        marginBottom: s(18),
        paddingHorizontal: s(4),
        fontFamily: "Nunito_400Regular",
        fontSize: s(11.5),
        lineHeight: s(17),
        color: BROWN,
    },

    /* sparkle */
    spark: { width: s(14), height: s(26), justifyContent: "space-between", alignItems: "center" },
    sparkBar: {
        width: s(12),
        height: s(4),
        borderRadius: s(2),
        backgroundColor: "#FFC04D",
    },
});