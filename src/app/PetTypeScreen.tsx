import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    useFonts,
    Fredoka_600SemiBold,
} from "@expo-google-fonts/fredoka";
import {
    Nunito_700Bold,
} from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const SCALE = Math.min(
    width / DESIGN_WIDTH,
    height / DESIGN_HEIGHT
);

type PetType = "dog" | "cat" | "rabbit";

interface PetOption {
    id: PetType;
    name: string;
    description: string;
    image: any;
}

const pets: PetOption[] = [
    {
        id: "dog",
        name: "Dog",
        description: "Loyal, playful and\nalways by your side.",
        image: require("../../assets/images/pets/huchiko.png"),
    },
    {
        id: "cat",
        name: "Cat",
        description: "Independent, curious\nand full of love.",
        image: require("../../assets/images/pets/kiki.png"),
    },
    {
        id: "rabbit",
        name: "Rabbit",
        description: "Gentle, quiet and\nadorably unique.",
        image: require("../../assets/images/pets/cupid.png"),
    },
];

interface PetTypeScreenProps {
    onContinue?: (petType: PetType) => void;
}

export default function PetTypeScreen({
    onContinue,
}: PetTypeScreenProps) {
    const [selectedPet, setSelectedPet] =
        useState<PetType>("dog");

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleContinue = () => {
    router.push({
        pathname: "/PetDetailsScreen",
        params: {
            petType: selectedPet,
        },
    });
};

    return (
        <View style={styles.container}>

            {/* =====================================================
                BACKGROUND PAWS
            ===================================================== */}

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawTopRight,
                ]}
            />

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawMiddleRight,
                ]}
            />

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawBottomRight,
                ]}
            />

            {/* =====================================================
                HEADER
            ===================================================== */}

            <View style={styles.header}>
                <Text style={styles.title}>
                    Choose Your Pet Type
                </Text>

                <Text style={styles.subtitle}>
                    Select your pet type to get started{"\n"}
                    with their PetCard.
                </Text>
            </View>

            {/* =====================================================
                PET OPTIONS
            ===================================================== */}

            <View style={styles.petList}>
                {pets.map((pet) => {
                    const isSelected =
                        selectedPet === pet.id;

                    return (
                        <Pressable
                            key={pet.id}
                            onPress={() =>
                                setSelectedPet(pet.id)
                            }
                            style={[
                                styles.petCard,
                                isSelected &&
                                    styles.petCardSelected,
                            ]}
                        >

                            {/* PET IMAGE */}

                            <Image
                                source={pet.image}
                                resizeMode="contain"
                                style={[
                                    styles.petImage,
                                    pet.id === "dog" &&
                                        styles.dogImage,
                                    pet.id === "cat" &&
                                        styles.catImage,
                                    pet.id === "rabbit" &&
                                        styles.rabbitImage,
                                ]}
                            />

                            {/* CONTENT */}

                            <View style={styles.petContent}>
                                <Text
                                    style={[
                                        styles.petName,
                                        isSelected &&
                                            styles.petNameSelected,
                                    ]}
                                >
                                    {pet.name}
                                </Text>

                                <Text style={styles.petDescription}>
                                    {pet.description}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* =====================================================
                BOTTOM BUTTON
            ===================================================== */}

            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>

                    <PrimaryButton
                        title="Continue"
                        onPress={handleContinue}
                        icon={
                                                <Image
                                                    source={require("../../assets/images/paw-white.png")}
                                                    resizeMode="contain"
                                                    style={styles.buttonPaw}
                                                />
                                            }
                    />

                    {/* PAW ICON */}

                   
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    /* =========================================================
       HEADER
    ========================================================= */

    header: {
        width: "100%",
        alignItems: "center",

        paddingTop: height * 0.112,
        paddingHorizontal: 20,
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",

        fontSize:32,
        lineHeight: 36,

        color: "#FF7F00",

        textAlign: "center",
        letterSpacing: 0.2,
    },

    subtitle: {
        marginTop: 7,

        fontFamily: "Nunito_700Bold",

        fontSize: 20,
        lineHeight: 28,

        color: "#382018",

        textAlign: "center",
    },

    /* =========================================================
       PET LIST
    ========================================================= */

    petList: {
        width: "100%",

        marginTop: height * 0.065,

        paddingHorizontal: width * 0.022,

        gap: height * 0.063,
    },

    petCard: {
        width: "96%",
        alignSelf: "center",

        height: Math.min(height * 0.127, 108),

        borderRadius: 20,

        borderWidth: 1,
        borderColor: "#FFDCC5",

        backgroundColor: "#FFFCFA",

        flexDirection: "row",
        alignItems: "center",

        position: "relative",

        overflow: "visible",
    },

    petCardSelected: {
        backgroundColor: "#FFE0C4",
        borderColor: "#FF7A00",
    },

    /* =========================================================
       PET IMAGE
    ========================================================= */

    petImage: {
        position: "absolute",

        left: -2,

        bottom: -4,

        width: Math.min(width * 0.32, 128),
        height: Math.min(width * 0.32, 128),

        zIndex: 5,
    },

    dogImage: {
        width: Math.min(width * 0.34, 134),
        height: Math.min(width * 0.34, 134),

        left: -4,
        bottom: -5,
    },

    catImage: {
        width: Math.min(width * 0.32, 126),
        height: Math.min(width * 0.32, 126),

        left: 0,
        bottom: -4,
    },

    rabbitImage: {
        width: Math.min(width * 0.31, 122),
        height: Math.min(width * 0.31, 122),

        left: 1,
        bottom: -3,
    },

    /* =========================================================
       PET CONTENT
    ========================================================= */

    petContent: {
        marginLeft: width * 0.40,

        paddingRight: width * 0.045,

        flex: 1,

        justifyContent: "center",
    },

    petName: {
        fontFamily: "Fredoka_600SemiBold",

        fontSize: Math.min(width * 0.047, 20),
        lineHeight: Math.min(width * 0.058, 24),

        color: "#FF7A00",

        marginBottom: 1,
    },

    petNameSelected: {
        color: "#FF6F00",
    },

    petDescription: {
        fontFamily: "Nunito_700Bold",

        fontSize: Math.min(width * 0.040, 16),
        lineHeight: Math.min(width * 0.052, 21),

        color: "#3B241B",
    },

    /* =========================================================
       BACKGROUND PAWS
    ========================================================= */

    backgroundPaw: {
        position: "absolute",

        width: 92 * SCALE,
        height: 92 * SCALE,

        opacity: 0.075,

        zIndex: 0,
    },

    pawTopRight: {
        top: 158 * SCALE,
        right: 8 * SCALE,

        transform: [
            {
                rotate: "15deg",
            },
        ],
    },

    pawMiddleRight: {
        top: 320 * SCALE,
        right: -25 * SCALE,

        transform: [
            {
                rotate: "-15deg",
            },
        ],
    },

    pawBottomRight: {
        bottom: 82 * SCALE,
        right: 14 * SCALE,

        transform: [
            {
                rotate: "10deg",
            },
        ],
    },

    /* =========================================================
       BOTTOM BUTTON
    ========================================================= */

   bottomSection: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.038,

    alignItems: "center",
},

  buttonWrapper: {
    width: "96%",
    maxWidth: 380,

    position: "relative",

    alignSelf: "center",
},

   continueButton: {
    width: "100%",
    height: Math.min(height * 0.061, 52),

    borderRadius: 15,

    alignSelf: "center",

    // Button depth
    shadowColor: "#FF7A00",
    shadowOffset: {
        width: 0,
        height: 7,
    },
    shadowOpacity: 0.20,
    shadowRadius: 12,

    elevation: 5,
},

    buttonPaw: {
        position: "absolute",

        
        top: "-30%",

        width: 40,
        height: 40,

        marginTop: -11.5,
        marginLeft:20,

        zIndex: 10,
    },
});