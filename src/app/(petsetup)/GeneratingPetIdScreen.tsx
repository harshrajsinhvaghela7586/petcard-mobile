import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const RING_SIZE = s(250);
const IMAGE_SIZE = s(210);

export default function GeneratingPetIdScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    const [progress, setProgress] = useState(0);

    /* Fake progress: 0 -> 100. Replace with real API progress later. */
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + 1, 100);
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    if (!fontsLoaded) return null;

    const isDone = progress >= 100;

    const handleContinue = () => {
        if (!isDone) return;
        router.push("/PetCardReadyScreen");
    };

    const handleSkip = () => {
        router.push("/PetCardReadyScreen");
    };

    return (
        <View style={styles.container}>
            {/* BACKGROUND PAWS */}
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomLeft]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            {/* CONTENT */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Generating Your Pet ID
                    </Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        Please wait while create your pet&apos;s unique identity.
                    </Text>
                </View>

                <View style={styles.body}>
                    {/* PET IMAGE IN RING */}
                    <View style={styles.ring}>
                        <Image
                            source={require("../../../assets/images/pets/huchiko.png")}
                            resizeMode="contain"
                            style={styles.petImage}
                        />
                    </View>

                    {/* PROGRESS */}
                    <View style={styles.progressWrapper}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[styles.progressFill, { width: `${progress}%` }]}
                            />
                        </View>
                        <Text style={styles.progressText} maxFontSizeMultiplier={1.1}>
                            {progress}%
                        </Text>
                    </View>

                    {/* TIP */}
                    <View style={styles.tipBox}>
                        <View style={styles.tipIconWrapper}>
                            <Ionicons name="shield-checkmark" size={s(26)} color="#FF7A00" />
                        </View>
                        <Text style={styles.tipText} maxFontSizeMultiplier={1.1}>
                            <Text style={styles.tipBold}>Tip: </Text>
                            Your PetCard &amp; QR will help keep your pet&apos;s
                            important info always accessible!
                        </Text>
                    </View>
                </View>
            </View>

            {/* BOTTOM ACTIONS */}
            <View style={styles.bottomSection}>
                <View style={[styles.buttonWrapper, !isDone && styles.buttonDisabled]}>
                    <PrimaryButton
                        title="Continue"
                        onPress={handleContinue}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>

                <Pressable onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText} maxFontSizeMultiplier={1.1}>
                        Skip for now
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        paddingTop: height * 0.112,
    },

    /* HEADER (identical on all screens) */
    header: {
        alignItems: "center",
        paddingHorizontal: s(5),
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(36),
        color: "#FF7F00",
        textAlign: "center",
        letterSpacing: 0,
    },

    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#381B0E",
        textAlign: "center",
    },

    /* BODY */
    body: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: s(16),
        paddingTop: s(24),
        paddingBottom: s(130),
    },

    ring: {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        borderWidth: s(3),
        borderColor: "#FFD2A6",
        backgroundColor: "#FFFAF4",
        alignItems: "center",
        justifyContent: "center",
    },

    petImage: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },

    progressWrapper: {
        width: "78%",
        marginTop: s(26),
    },

    progressTrack: {
        width: "100%",
        height: s(12),
        borderRadius: s(6),
        backgroundColor: "#FFE0C4",
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: s(6),
        backgroundColor: "#FF7A00",
    },

    progressText: {
        marginTop: s(4),
        alignSelf: "flex-start",
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        color: "#381B0E",
    },

    tipBox: {
        width: "100%",
        marginTop: s(18),
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FF7F00",
        borderRadius: s(12),
        backgroundColor: "#FFF3E6",
        paddingHorizontal: s(14),
        paddingVertical: s(12),
        gap: s(12),
    },

    tipIconWrapper: {
        width: s(40),
        height: s(40),
        borderRadius: s(20),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FFD2A6",
        alignItems: "center",
        justifyContent: "center",
    },

    tipText: {
        flex: 1,
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        color: "#381B0E",
    },

    tipBold: {
        color: "#FF7A00",
    },

    /* BACKGROUND PAWS */
    backgroundPaw: {
        position: "absolute",
        width: 72 * SCALE,
        height: 72 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    pawTopLeft: {
        top: 40 * SCALE,
        left: 24 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 160 * SCALE,
        right: 17 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawBottomLeft: {
        bottom: 105 * SCALE,
        left: 16 * SCALE,
        transform: [{ rotate: "12deg" }],
    },

    pawBottomRight: {
        bottom: 20 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /* BOTTOM ACTIONS (identical on all screens) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: height * 0.014,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },

    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
    },

    buttonDisabled: {
        opacity: 0,
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

    skipButton: {
        height: s(34),
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(1),
    },

    skipText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        fontWeight: "900",
        color: "#8B6D5C",
        textAlign: "center",
    },
});