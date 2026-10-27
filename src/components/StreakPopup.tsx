import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { s } from "@/constants/scale";

type Day = { d: string; done: boolean };

type Props = {
    visible: boolean;
    onClose: () => void;
    streak: number;
    petName: string;
    week: readonly Day[];
    bonus: number;
};

const SPARKLES = [
    { top: "9%", left: "10%", size: 12 },
    { top: "5%", left: "62%", size: 9 },
    { top: "16%", left: "86%", size: 14 },
    { top: "30%", left: "6%", size: 10 },
    { top: "34%", left: "90%", size: 10 },
] as const;

export default function StreakPopup({
    visible,
    onClose,
    streak,
    petName,
    week,
    bonus,
}: Props) {
    const pop = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        if (!visible) return;
        pop.setValue(0.85);
        Animated.spring(pop, {
            toValue: 1,
            friction: 6,
            tension: 90,
            useNativeDriver: true,
        }).start();
    }, [visible, pop]);

    /* pehla not-done din = aaj (design me "+" dikhta hai) */
    const todayIndex = week.findIndex((w) => !w.done);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.card, { transform: [{ scale: pop }] }]}>
                    {SPARKLES.map((sp, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.sparkle,
                                { top: sp.top, left: sp.left, fontSize: s(sp.size) },
                            ]}
                        >
                            ✦
                        </Text>
                    ))}

                    <View style={styles.flameGlow}>
                        <MaterialCommunityIcons name="fire" size={s(84)} color="#FFB02E" />
                    </View>

                    <Text style={styles.number} maxFontSizeMultiplier={1.1}>
                        {streak}
                    </Text>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Day Streak!
                    </Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        {`Consistency makes\n${petName} happy! 🧡`}
                    </Text>

                    <View style={styles.weekRow}>
                        {week.map((w, i) => (
                            <View key={i} style={styles.weekItem}>
                                <Text style={styles.weekLetter} maxFontSizeMultiplier={1}>
                                    {w.d}
                                </Text>
                                {w.done ? (
                                    <View style={styles.dotDone}>
                                        <Ionicons name="checkmark" size={s(13)} color="#FFFFFF" />
                                    </View>
                                ) : (
                                    <View
                                        style={[
                                            styles.dotEmpty,
                                            i === todayIndex && styles.dotToday,
                                        ]}
                                    >
                                        {i === todayIndex ? (
                                            <Ionicons name="add" size={s(14)} color="#FFD9B0" />
                                        ) : null}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.bonusCard}>
                        <Image
                            source={require("../../assets/images/rewards/pawcoin.png")}
                            resizeMode="contain"
                            style={styles.coin}
                        />
                        <View style={styles.bonusText}>
                            <Text style={styles.bonusLabel} maxFontSizeMultiplier={1.1}>
                                Streak Bonus
                            </Text>
                            <Text style={styles.bonusValue} maxFontSizeMultiplier={1.1}>
                                {`+${bonus} PawPoints`}
                            </Text>
                        </View>
                    </View>

                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText} maxFontSizeMultiplier={1.1}>
                            Keep it up!
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(20, 8, 0, 0.62)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(22),
    },
    card: {
        width: "100%",
        maxWidth: 380,
        borderRadius: s(28),
        backgroundColor: "#5C2A0B",
        paddingTop: s(26),
        paddingBottom: s(20),
        paddingHorizontal: s(18),
        alignItems: "center",
        overflow: "hidden",
    },
    sparkle: {
        position: "absolute",
        color: "#FF9A3C",
        opacity: 0.8,
    },
    flameGlow: {
        width: s(120),
        height: s(120),
        borderRadius: s(60),
        backgroundColor: "rgba(255, 122, 0, 0.22)",
        alignItems: "center",
        justifyContent: "center",
    },
    number: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(56),
        lineHeight: s(62),
        color: "#FFFFFF",
        marginTop: s(2),
    },
    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        color: "#FFFFFF",
    },
    subtitle: {
        marginTop: s(8),
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        lineHeight: s(21),
        color: "#FFE9D2",
        textAlign: "center",
    },
    weekRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(20),
        paddingHorizontal: s(2),
    },
    weekItem: {
        alignItems: "center",
        gap: s(6),
    },
    weekLetter: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        color: "#FFE9D2",
    },
    dotDone: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
    },
    dotEmpty: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        alignItems: "center",
        justifyContent: "center",
    },
    dotToday: {
        backgroundColor: "rgba(255, 154, 60, 0.35)",
    },
    bonusCard: {
        width: "100%",
        marginTop: s(20),
        borderRadius: s(16),
        backgroundColor: "#FFF4E6",
        paddingVertical: s(12),
        paddingHorizontal: s(14),
        flexDirection: "row",
        alignItems: "center",
    },
    coin: {
        width: s(46),
        height: s(46),
    },
    bonusText: {
        marginLeft: s(12),
        flex: 1,
    },
    bonusLabel: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: "#8F7365",
    },
    bonusValue: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(20),
        color: "#382018",
    },
    button: {
        width: "100%",
        height: s(50),
        marginTop: s(16),
        borderRadius: s(16),
        backgroundColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(18),
        color: "#FFFFFF",
    },
});
