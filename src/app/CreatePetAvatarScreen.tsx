import React from "react";
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

export default function CreatePetAvatarScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded) return null;

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
                    <Text style={styles.title}>Create Your Pet Avatar</Text>
                    <Text style={styles.subtitle}>
                        Bring your pet to life with a cute avatar!
                    </Text>
                </View>

                <Pressable
                    onPress={() => console.log("Choose from existing")}
                    style={({ pressed }) => [
                        styles.optionCard,
                        styles.existingCard,
                        pressed && styles.cardPressed,
                    ]}
                >
                    <View style={styles.cardTextArea}>
                        <Text style={styles.optionTitle}>
                            Choose from existing
                        </Text>
                        <Text style={styles.optionDescription}>
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
                        <Ionicons name="chevron-forward" size={27} color="#FF7F00" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/CreateMyselfScreen")}
                    style={({ pressed }) => [
                        styles.optionCard,
                        styles.customCard,
                        pressed && styles.cardPressed,
                    ]}
                >
                    <View style={styles.cardTextArea}>
                        <Text style={styles.optionTitle}>
                            Create by myself
                        </Text>
                        <Text style={styles.optionDescription}>
                            Customize every detail{"\n"}
                            and make it unique!
                        </Text>
                    </View>

                    <Image
                        source={require("../../assets/images/createAvatar/paint.png")}
                        resizeMode="contain"
                        style={styles.paintImage}
                    />

                    <View style={styles.arrowButton}>
                        <Ionicons name="chevron-forward" size={27} color="#FF7F00" />
                    </View>
                </Pressable>

                <View style={styles.whySection}>
                    <Text style={styles.whyTitle}>Why customize?</Text>

                    <View style={styles.whyContent}>
                        <View style={styles.benefitsColumn}>
                            <Benefit
                                icon="lock-closed-outline"
                                text={<>Unlock more items{"\n"}through rewards</>}
                            />
                            <Benefit
                                icon="sparkles-outline"
                                text={<>Make your pet{"\n"}truly one of a kind</>}
                            />
                            <Benefit
                                icon="gift-outline"
                                text={<>More accessories,{"\n"}background and stylish!</>}
                            />
                        </View>

                        <Image
                            source={require("../../assets/images/createAvatar/dog.png")}
                            resizeMode="contain"
                            style={styles.dogImage}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    title="Continue"
                    onPress={() => router.push("/ChoosePetAvatar")}
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
            <Ionicons name={icon} size={21} color="#381B0E" />
        </View>
        <Text style={styles.benefitText}>{text}</Text>
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
        paddingHorizontal: 10,
        paddingBottom: 105,
    },

    header: {
        alignItems: "center",
        marginBottom: 57,
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: 32,
        lineHeight: 36,
        color: "#FF7F00",
        textAlign: "center",
        letterSpacing: 0,
    },

    subtitle: {
        marginTop: 2,
        fontFamily: "Nunito_700Bold",
        fontSize: 20,
        lineHeight: 28,
        color: "#381B0E",
        textAlign: "center",
    },

    optionCard: {
        width: "100%",
        height: 102,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        paddingLeft: 18,
        paddingRight: 68,
        marginBottom: 45,
        marginTop:-30,
    },

    existingCard: {
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
    },

    customCard: {
        backgroundColor: "#FFFCF9",
        borderWidth: 1,
        borderColor: "#FFDCC0",
        marginTop:10
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
        fontSize: 17,
        lineHeight: 28,
        color: "#FF7F00",
    },

    optionDescription: {
        marginTop: 2,
        fontFamily: "Nunito_700Bold",
        fontSize: 15,
        lineHeight: 24,
        color: "#381B0E",
    },

    catImage: {
        position: "absolute",
        width: 100,
        height: 100,
        right: 28,
        bottom: -1,
        zIndex: 2,
    },

    paintImage: {
        position: "absolute",
        width: 92,
        height: 92,
        right: 43,
        bottom: 5,
        zIndex: 2,
    },

    arrowButton: {
        position: "absolute",
        right: -13,
        top: "50%",
        marginTop: -23,
        width: 40,
        height: 40,
        borderRadius: 23,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },

    whySection: {
        marginTop: -9,
        paddingHorizontal: 18,
    },

    whyTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: 20,
        lineHeight: 28,
        color: "#FF7F00",
        marginBottom: 9,
    },

    whyContent: {
        minHeight: 170,
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
        minHeight: 55,
        marginBottom: 4,
    },

    benefitIconBox: {
        width: 38,
        height: 38,
        marginLeft:-10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF9F4",
        borderRadius: 5,
    },

    benefitText: {
        flex: 1,
        paddingTop: 1,
        fontFamily: "Nunito_400Regular",
        fontSize: 15,
        lineHeight: 19,
        color: "#381B0E",
    },

    dogImage: {
        position: "absolute",
        width: 135,
        height: 160,
        right: -4,
        top: -16,
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
        paddingHorizontal: 6,
        paddingBottom: 27,
        backgroundColor: "transparent",
        zIndex: 20,
    },

    continueButton: {
        width: "100%",
        height: 50,
        borderRadius: 15,
    },

    buttonPaw: {
        position: "absolute",


        top: "-30%",

        width: 40,
        height: 40,

        marginTop: -11.5,
        marginLeft: 20,

        zIndex: 10,
    },
});

