import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s, SIDE } from "../components/KnowKit";

/* Pet ka naam yaha se aayega (baad me store/params se jod dena) */
const PET_NAME = "Milo";

const NEXT = [
    {
        key: "dashboard",
        icon: "calendar-check",
        color: "#5E9B2D",
        tint: "#EAF3DC",
        title: "Check your dashboard",
        sub: "See today's tasks and reminders.",
        route: "/HomeScreen",
    },
    {
        key: "streak",
        icon: "flash",
        color: "#E0457B",
        tint: "#FFE3EE",
        title: "Keep your streak alive",
        sub: "Complete daily tasks & earn rewards!",
        route: "/TasksScreen",
    },
    {
        key: "explore",
        icon: "star-four-points",
        color: "#FF7A00",
        tint: "#FFE9D6",
        title: "Explore more features",
        sub: "PetCard has so much to offer!",
        route: "/KnowScreen",
    },
] as const;

/* confetti: [left %, top px, color, rotate deg, w, h] */
const CONFETTI = [
    [6, 18, "#FF7A00", 20, 5, 10], [16, 60, "#7A5CFF", -30, 6, 6], [26, 10, "#FFB300", 45, 5, 10],
    [38, 40, "#FF4B32", 10, 4, 9], [52, 14, "#5E9B2D", -20, 6, 6], [64, 52, "#FF7A00", 60, 5, 10],
    [74, 12, "#E0457B", 15, 6, 6], [84, 44, "#FFB300", -40, 5, 10], [93, 20, "#7A5CFF", 30, 5, 9],
    [10, 110, "#FFB300", 25, 5, 9], [90, 96, "#FF4B32", -15, 5, 10], [46, 96, "#7A5CFF", 50, 4, 8],
] as const;

export default function CareSetupCompleteScreen() {
    const insets = useSafeAreaInsets();
    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* TOP: title */}
                <View style={[styles.top, { paddingTop: insets.top + s(24) }]}>
                    {CONFETTI.map((c, i) => (
                        <View
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${c[0]}%`,
                                top: s(c[1]) + insets.top * 0.3,
                                width: s(c[4]),
                                height: s(c[5]),
                                borderRadius: s(1.5),
                                backgroundColor: c[2],
                                transform: [{ rotate: `${c[3]}deg` }],
                            }}
                        />
                    ))}

                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Care Setup{"\n"}
                        <Text style={{ color: C.orange }}>Complete! 🎉</Text>
                    </Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        You're all set to give the best care to {PET_NAME}. Let's make every day awesome!
                    </Text>
                </View>

                {/* HERO SCENE */}
                <View style={styles.scene}>
                    <View style={styles.wall} />
                    <View style={styles.floor} />
                    <View style={styles.rug} />

                    <View style={styles.sofa} />
                    <MaterialCommunityIcons
                        name="sprout"
                        size={s(90)}
                        color="#5E9B2D"
                        style={styles.plant}
                    />
                    <View style={styles.frame}>
                        <MaterialCommunityIcons name="paw" size={s(18)} color={C.orange} />
                    </View>

                    <Image
                        source={require("../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.pet}
                    />

                    <MaterialCommunityIcons name="tennis-ball" size={s(46)} color="#3B8FD6" style={styles.ball} />
                    <MaterialCommunityIcons name="bone" size={s(40)} color="#3B6FB6" style={styles.rope} />
                </View>

                {/* WHAT'S NEXT */}
                <View style={[styles.sheet]}>
                    <Text style={styles.sheetTitle} maxFontSizeMultiplier={1.1}>
                        What's Next?
                    </Text>

                    {NEXT.map((n) => (
                        <Pressable
                            key={n.key}
                            onPress={() => router.replace(n.route as any)}
                            style={styles.nextRow}
                        >
                            <View style={[styles.nextIcon, { backgroundColor: n.tint }]}>
                                <MaterialCommunityIcons name={n.icon as any} size={s(22)} color={n.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.nextTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {n.title}
                                </Text>
                                <Text style={styles.nextSub} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                    {n.sub}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
                        </Pressable>
                    ))}

                    {/* same PrimaryButton as Create Pet Avatar */}
                    <View style={styles.buttonWrap}>
                        <PrimaryButton
                            title="Go to Dashboard"
                            onPress={() => router.replace("/EmergencyCardScreen" as any)}
                            style={styles.primaryButton}
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
            </ScrollView>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF3E3", overflow: "hidden" },

    top: { alignItems: "center", paddingHorizontal: s(24), paddingBottom: s(8) },
    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(40),
        color: C.brown,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        textAlign: "center",
        marginTop: s(8),
        maxWidth: s(320),
    },

    /* scene */
    scene: { height: s(290), width: "100%", overflow: "hidden", alignItems: "center" },
    wall: { ...StyleSheet.absoluteFill, backgroundColor: "#FFEBD2" },
    floor: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: s(120),
        backgroundColor: "#F8D9B0",
    },
    rug: {
        position: "absolute",
        bottom: s(14),
        width: "86%",
        height: s(80),
        borderRadius: s(80),
        backgroundColor: "#FFE7C8",
    },
    sofa: {
        position: "absolute",
        left: s(-10),
        bottom: s(100),
        width: s(96),
        height: s(96),
        borderRadius: s(18),
        backgroundColor: "#8FB06A",
    },
    plant: { position: "absolute", right: s(10), bottom: s(110) },
    frame: {
        position: "absolute",
        right: s(104),
        top: s(40),
        width: s(40),
        height: s(40),
        borderRadius: s(6),
        backgroundColor: C.white,
        borderWidth: 3,
        borderColor: "#C8895A",
        alignItems: "center",
        justifyContent: "center",
    },
    pet: { position: "absolute", bottom: s(12), width: s(230), height: s(230) },
    ball: { position: "absolute", left: s(18), bottom: s(34) },
    rope: { position: "absolute", right: s(24), bottom: s(30) },

    /* sheet */
    sheet: {
        backgroundColor: "#FFFCFA",
        borderTopLeftRadius: s(26),
        borderTopRightRadius: s(26),
        paddingHorizontal: SIDE,
        paddingTop: s(18),
        flexGrow: 1,
    },
    sheetTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        color: C.brown,
        textAlign: "center",
        marginBottom: s(12),
    },
    nextRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        padding: s(12),
        marginBottom: s(8),
        borderRadius: s(16),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    nextIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(12),
        alignItems: "center",
        justifyContent: "center",
    },
    nextTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    nextSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(1) },

    /* PrimaryButton: Create Pet Avatar jaisa */
    buttonWrap: { marginTop: s(8) },
    primaryButton: {
        width: "100%",
        height: s(50),
        borderRadius: s(15),
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