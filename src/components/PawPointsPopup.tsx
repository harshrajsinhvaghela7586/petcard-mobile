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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { s } from "@/constants/scale";

type Props = {
    visible: boolean;
    onClose: () => void;
    points: number;
    /* task ka naam (jaise "Walk") */
    taskTitle: string;
    /* MaterialCommunityIcons ka naam */
    taskIcon?: string;
};

const CONFETTI = [
    { top: "5%", left: "10%", color: "#FF8A3D", ch: "✦", size: 14 },
    { top: "9%", left: "72%", color: "#F5B83D", ch: "●", size: 8 },
    { top: "14%", left: "90%", color: "#FF8A3D", ch: "✦", size: 12 },
    { top: "22%", left: "5%", color: "#7ED0C0", ch: "▮", size: 9 },
    { top: "30%", left: "84%", color: "#F07A9A", ch: "▮", size: 9 },
    { top: "40%", left: "12%", color: "#F5B83D", ch: "✦", size: 11 },
    { top: "46%", left: "92%", color: "#7ED0C0", ch: "●", size: 7 },
] as const;

export default function PawPointsPopup({
    visible,
    onClose,
    points,
    taskTitle,
    taskIcon = "paw",
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
                    {CONFETTI.map((c, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.confetti,
                                { top: c.top, left: c.left, color: c.color, fontSize: s(c.size) },
                            ]}
                        >
                            {c.ch}
                        </Text>
                    ))}

                    <Text style={styles.amazing} maxFontSizeMultiplier={1.1}>
                        Amazing!
                    </Text>
                    <Text style={styles.earned} maxFontSizeMultiplier={1.1}>
                        You earned
                    </Text>

                    <View style={styles.pointsRow}>
                        <Text style={styles.points} maxFontSizeMultiplier={1.1}>
                            {`+${points}`}
                        </Text>
                        <Text style={styles.paw}>🐾</Text>
                    </View>
                    <Text style={styles.pawLabel} maxFontSizeMultiplier={1.1}>
                        PawPoints
                    </Text>

                    <Image
                        source={require("../../assets/images/rewards/pawcoin.png")}
                        resizeMode="contain"
                        style={styles.coins}
                    />

                    <View style={styles.forCard}>
                        <View style={styles.forIcon}>
                            <MaterialCommunityIcons
                                name={taskIcon as any}
                                size={s(24)}
                                color="#FF7A00"
                            />
                        </View>
                        <View style={styles.forText}>
                            <Text style={styles.forLabel} maxFontSizeMultiplier={1.1}>
                                For completing
                            </Text>
                            <Text style={styles.forTask} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {taskTitle}
                            </Text>
                        </View>
                    </View>

                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText} maxFontSizeMultiplier={1.1}>
                            Awesome!
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
        backgroundColor: "rgba(20, 8, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(22),
    },
    card: {
        width: "100%",
        maxWidth: 380,
        borderRadius: s(28),
        backgroundColor: "#FFF3E3",
        paddingTop: s(30),
        paddingBottom: s(20),
        paddingHorizontal: s(18),
        alignItems: "center",
        overflow: "hidden",
    },
    confetti: {
        position: "absolute",
    },
    amazing: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(30),
        color: "#382018",
    },
    earned: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(18),
        color: "#382018",
        marginTop: s(2),
    },
    pointsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: s(6),
    },
    points: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(54),
        lineHeight: s(60),
        color: "#FF7A00",
    },
    paw: {
        fontSize: s(26),
        marginLeft: s(8),
    },
    pawLabel: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        color: "#382018",
    },
    coins: {
        width: s(170),
        height: s(130),
        marginTop: s(10),
    },
    forCard: {
        width: "100%",
        marginTop: s(14),
        borderRadius: s(16),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FFDCC5",
        paddingVertical: s(12),
        paddingHorizontal: s(14),
        flexDirection: "row",
        alignItems: "center",
    },
    forIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(21),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    forText: {
        flex: 1,
        marginLeft: s(12),
    },
    forLabel: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: "#8F7365",
    },
    forTask: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(17),
        color: "#382018",
    },
    button: {
        width: "100%",
        height: s(52),
        marginTop: s(16),
        borderRadius: s(16),
        backgroundColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(19),
        color: "#FFFFFF",
    },
});
