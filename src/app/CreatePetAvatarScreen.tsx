import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, image,
 * icon size...) is multiplied by the same scale factor, so the screen
 * looks like the design (393 x 852) on every device.
 *
 * - Small phones  -> everything shrinks proportionally
 * - Medium phones -> ~ same as design
 * - Large phones  -> grows proportionally, capped at 1.3
 */
const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

type AvatarOption = "existing" | "upload";

export default function CreatePetAvatarScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    // Sirf ek option select hoga (default: existing)
    const [selected, setSelected] = useState<AvatarOption>("existing");

    if (!fontsLoaded) return null;

    const handleContinue = () => {
        if (selected === "existing") {
            router.push("/ChoosePetAvatar");
        } else {
            router.push("/CreateMyselfScreen");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/images/paw.png")} style={[styles.backgroundPaw, styles.pawTopLeft]} resizeMode="contain" />
            <Image source={require("../../assets/images/paw.png")} style={[styles.backgroundPaw, styles.pawTopRight]} resizeMode="contain" />
            <Image source={require("../../assets/images/paw.png")} style={[styles.backgroundPaw, styles.pawMiddleRight]} resizeMode="contain" />
            <Image source={require("../../assets/images/paw.png")} style={[styles.backgroundPaw, styles.pawBottomRight]} resizeMode="contain" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>Create Your Pet Avatar</Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        Bring your pet to life with a cute avatar!
                    </Text>
                </View>

                <Pressable
                    onPress={() => setSelected("existing")}
                    style={({ pressed }) => [
                        styles.optionCard,
                        styles.existingCard,
                        selected === "existing"
                            ? styles.cardSelected
                            : styles.cardUnselected,
                        pressed && styles.cardPressed,
                    ]}
                >
                    <View style={styles.cardTextArea}>
                        <Text style={styles.optionTitle} maxFontSizeMultiplier={1.1}>
                            Choose from existing
                        </Text>
                        <Text style={styles.optionDescription} maxFontSizeMultiplier={1.1}>
                            Pick a pre-made avatar{"\n"}
                            that looks like your pet.
                        </Text>
                    </View>

                    <Image
                        source={require("../../assets/images/createAvatar/cat.png")}
                        resizeMode="contain"
                        style={styles.catImage}
                    />

                    <View style={styles.arrowButton}>
                        <Ionicons name="chevron-forward" size={s(27)} color="#FF7F00" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => setSelected("upload")}
                    style={({ pressed }) => [
                        styles.optionCard,
                        styles.customCard,
                        selected === "upload"
                            ? styles.cardSelected
                            : styles.cardUnselected,
                        pressed && styles.cardPressed,
                    ]}
                >
                    <View style={styles.cardTextArea}>
                        <Text style={styles.optionTitle} maxFontSizeMultiplier={1.1}>
                            Upload Myself
                        </Text>
                        <Text style={styles.optionDescription} maxFontSizeMultiplier={1.1}>
    Upload your pet's photo{"\n"}
    and make it your own!
</Text>
                    </View>

                    <Image
                        source={require("../../assets/images/createAvatar/paint.png")}
                        resizeMode="contain"
                        style={styles.paintImage}
                    />

                    <View style={styles.arrowButton}>
                        <Ionicons name="chevron-forward" size={s(27)} color="#FF7F00" />
                    </View>
                </Pressable>

          
            </ScrollView>

            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    title="Continue"
                    onPress={handleContinue}
                    style={styles.continueButton}
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
    );
}

interface BenefitProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: React.ReactNode;
}

const Benefit = ({ icon, text }: BenefitProps) => (
    <View style={styles.benefitRow}>
        <View style={styles.benefitIconBox}>
            <Ionicons name={icon} size={s(21)} color="#381B0E" />
        </View>
        <Text style={styles.benefitText} maxFontSizeMultiplier={1.1}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    scrollContent: {
        paddingTop: height * 0.112,
        paddingHorizontal: s(10),
        paddingBottom: s(105),
    },

    header: {
        alignItems: "center",
        marginBottom: s(57),
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

    optionCard: {
        width: "100%",
        height: s(102),
        borderRadius: s(25),
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        paddingLeft: s(18),
        paddingRight: s(68),
        marginBottom: s(45),
        marginTop: s(-30),
    },

    existingCard: {},

    customCard: {
        marginTop: s(10),
    },

    // Selected card: orange look
    cardSelected: {
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
    },

    // Unselected card: white look (pehle wale Create myself jaisa)
    cardUnselected: {
        backgroundColor: "#FFFCF9",
        borderWidth: 1,
        borderColor: "#FFDCC0",
    },

    cardPressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },

    cardTextArea: {
        flex: 1,
        zIndex: 3,
    },

    optionTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(17),
        lineHeight: s(28),
        color: "#FF7F00",
    },

    optionDescription: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        lineHeight: s(24),
        color: "#381B0E",
    },

    catImage: {
        position: "absolute",
        width: s(100),
        height: s(100),
        right: s(28),
        bottom: s(-1),
        zIndex: 2,
    },

    paintImage: {
        position: "absolute",
        width: s(92),
        height: s(92),
        right: s(43),
        bottom: s(5),
        zIndex: 2,
    },

    arrowButton: {
        position: "absolute",
        right: s(-13),
        top: "50%",
        marginTop: s(-23),
        width: s(40),
        height: s(40),
        borderRadius: s(23),
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },

    whySection: {
        marginTop: s(-9),
        paddingHorizontal: s(18),
    },

    whyTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#FF7F00",
        marginBottom: s(9),
    },

    whyContent: {
        minHeight: s(170),
        flexDirection: "row",
        position: "relative",
    },

    benefitsColumn: {
        flex: 1,
        zIndex: 3,
    },

    benefitRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        minHeight: s(55),
        marginBottom: s(4),
    },

    benefitIconBox: {
        width: s(38),
        height: s(38),
        marginLeft: s(-10),
        marginRight: s(10),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF9F4",
        borderRadius: s(5),
    },

    benefitText: {
        flex: 1,
        paddingTop: s(1),
        fontFamily: "Nunito_400Regular",
        fontSize: s(15),
        lineHeight: s(19),
        color: "#381B0E",
    },

    dogImage: {
        position: "absolute",
        width: s(135),
        height: s(160),
        right: s(-4),
        top: s(-16),
        zIndex: 2,
    },

    backgroundPaw: {
        position: "absolute",
        width: 72 * SCALE,
        height: 72 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    pawTopLeft: {
        top: 28 * SCALE,
        left: 22 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 150 * SCALE,
        right: -15 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawMiddleRight: {
        top: 390 * SCALE,
        right: 0,
        transform: [{ rotate: "-8deg" }],
    },

    pawBottomRight: {
        bottom: 10 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    bottomButtonContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: s(6),
        paddingBottom: s(27),
        backgroundColor: "transparent",
        zIndex: 20,
    },

    continueButton: {
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