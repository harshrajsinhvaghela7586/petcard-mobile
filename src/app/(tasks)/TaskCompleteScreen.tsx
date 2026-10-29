import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { C, PawBackground, SIDE, cardStyle, s, useAppFonts } from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { getTask } from "@/constants/tasks";

/* confetti: static pieces (left %, top px, color, rotation) */
const CONFETTI = [
    { l: "8%", t: 70, c: "#FFB84D", r: "20deg" },
    { l: "18%", t: 30, c: "#7A5CFF", r: "-30deg" },
    { l: "28%", t: 100, c: "#FF7A9C", r: "50deg" },
    { l: "36%", t: 22, c: "#5E9B2D", r: "10deg" },
    { l: "62%", t: 40, c: "#FF7A00", r: "-20deg" },
    { l: "72%", t: 96, c: "#4DB6E8", r: "35deg" },
    { l: "82%", t: 26, c: "#FF7A9C", r: "-45deg" },
    { l: "90%", t: 80, c: "#FFB84D", r: "15deg" },
    { l: "52%", t: 120, c: "#7A5CFF", r: "60deg" },
];

export default function TaskCompleteScreen() {
    const insets = useSafeAreaInsets();
    const { task } = useLocalSearchParams<{ task?: string }>();
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const t = getTask(task);
    const goTasks = () => router.replace("/TasksScreen" as any);

    return (
        <View style={styles.container}>
            <PawBackground />

            {CONFETTI.map((p, i) => (
                <View
                    key={i}
                    style={[
                        styles.confetti,
                        {
                            left: p.l as any,
                            top: insets.top + s(p.t),
                            backgroundColor: p.c,
                            transform: [{ rotate: p.r }],
                        },
                    ]}
                />
            ))}

            <View style={[styles.center, { paddingTop: insets.top + s(48) }]}>
                {/* COIN */}
                <Image
                    source={require("../../../assets/images/rewards/pawcoin.png")}
                    resizeMode="contain"
                    style={styles.coin}
                />

                <Text style={styles.title} maxFontSizeMultiplier={1.1}>Great Job!</Text>
                <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>Task Completed</Text>

                <View style={styles.xpPill}>
                    <Image
                        source={require("../../../assets/images/rewards/pawcoin.png")}
                        resizeMode="contain"
                        style={styles.xpCoin}
                    />
                    <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>+{t.xp} XP</Text>
                </View>

                {/* DOG */}
                <View style={styles.dogWrap}>
                    <Image
                        source={require("../../../assets/images/pets/huchiko.png")}
                        resizeMode="contain"
                        style={styles.dog}
                    />
                    <View style={styles.heartBubble}>
                        <MaterialCommunityIcons name="heart" size={s(20)} color={C.orange} />
                    </View>
                </View>
            </View>

            {/* BOTTOM */}
            <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, s(12)) }]}>
                <View style={styles.taskCard}>
                    <MaterialCommunityIcons name={t.icon as any} size={s(34)} color={C.orange} />
                    <View style={{ marginLeft: s(14) }}>
                        <Text style={styles.taskTitle} maxFontSizeMultiplier={1.1}>{t.title}</Text>
                        <Text style={styles.taskTime} maxFontSizeMultiplier={1.1}>{t.time}</Text>
                    </View>
                </View>

                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Awesome!"
                        onPress={goTasks}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>

                <Pressable onPress={goTasks} hitSlop={10} style={styles.link}>
                    <Text style={styles.linkText} maxFontSizeMultiplier={1.1}>Back to Tasks</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    confetti: { position: "absolute", width: s(8), height: s(4), borderRadius: s(1) },

    center: { flex: 1, alignItems: "center" },
    coin: { width: s(92), height: s(92) },
    title: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(30),
        lineHeight: s(38),
        color: C.brown,
        marginTop: s(14),
    },
    subtitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(30),
        lineHeight: s(38),
        color: C.orange,
    },
    xpPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
        marginTop: s(12),
        paddingHorizontal: s(14),
        paddingVertical: s(5),
        borderRadius: s(16),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    xpCoin: { width: s(20), height: s(20) },
    xpText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },

    dogWrap: { marginTop: s(10), alignItems: "center", justifyContent: "center" },
    dog: { width: s(230), height: s(230) },
    heartBubble: {
        position: "absolute",
        right: s(-34),
        top: s(40),
        width: s(44),
        height: s(44),
        borderRadius: s(22),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },

    bottom: { paddingHorizontal: SIDE },
    taskCard: {
        ...cardStyle,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(14),
        paddingHorizontal: s(18),
        marginBottom: s(34),
    },
    taskTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    taskTime: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(2) },
    /* PrimaryButton wrapper + paw: same as PetTypeScreen */
    buttonWrapper: {
        width: "100%",
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
    link: { alignItems: "center", marginTop: s(14) },
    linkText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },
});