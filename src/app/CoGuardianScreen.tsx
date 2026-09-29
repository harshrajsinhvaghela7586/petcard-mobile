import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_700Bold,
    useFonts,
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

export default function CoGuardianScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    const [coGuardianPhoto1, setCoGuardianPhoto1] =
        useState<string | null>(null);

    const [coGuardianPhoto2, setCoGuardianPhoto2] =
        useState<string | null>(null);

    if (!fontsLoaded) {
        return null;
    }

    /* ==============================
       PHOTO
    ============================== */

    const handleChoosePhoto = async (
        slot: 1 | 2
    ) => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.85,
            });

        if (
            !result.canceled &&
            result.assets?.length
        ) {
            const uri = result.assets[0].uri;

            if (slot === 1) {
                setCoGuardianPhoto1(uri);
            } else {
                setCoGuardianPhoto2(uri);
            }
        }
    };

    const handleRemovePhoto = (
        slot: 1 | 2
    ) => {
        if (slot === 1) {
            setCoGuardianPhoto1(null);
        } else {
            setCoGuardianPhoto2(null);
        }
    };

    const handleCenterCamera = () => {
        if (!coGuardianPhoto1) {
            handleChoosePhoto(1);
            return;
        }

        if (!coGuardianPhoto2) {
            handleChoosePhoto(2);
            return;
        }

        handleChoosePhoto(1);
    };

    const handleAddCoGuardian = () => {
        router.push("/CreatePetAvatarScreen")
    };

    const handleSkip = () => {
        console.log("Skip for now");
    };

    return (
        <View style={styles.container}>

            {/* ==============================
                BACKGROUND PAWS
            ============================== */}

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawTopLeft,
                ]}
            />

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
                    styles.pawBottomLeft,
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

            {/* ==============================
                CONTENT
            ============================== */}

            <View style={styles.content}>

                {/* HEADER */}

                <View style={styles.header}>

                    <Text style={styles.title}>
                        Add a Co-Guardian
                    </Text>

                    <Text style={styles.subtitle}>
                        Share care and memories with someone
                        you trust.
                    </Text>

                </View>

                {/* ==============================
                    CO-GUARDIAN PHOTO
                ============================== */}

                <View style={styles.profileSection}>

                    {/* LEFT PHOTO */}

                    <Pressable
                        onPress={() => handleChoosePhoto(1)}
                        style={[
                            styles.profileCircle,
                            styles.profileCircleLeft,
                        ]}
                    >
                        {coGuardianPhoto1 ? (
                            <Image
                                source={{ uri: coGuardianPhoto1 }}
                                resizeMode="cover"
                                style={styles.guardianImage}
                            />
                        ) : (
                            <View style={styles.emptyPhotoContent}>
                                <Ionicons
                                    name="camera-outline"
                                    size={31}
                                    color="#FF7F00"
                                />

                                <Text style={styles.photoHint}>
                                    Add Photo
                                </Text>
                            </View>
                        )}

                        {coGuardianPhoto1 && (
                            <Pressable
                                onPress={(event) => {
                                    event.stopPropagation();
                                    handleRemovePhoto(1);
                                }}
                                style={styles.removePhotoButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={15}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        )}
                    </Pressable>

                    {/* RIGHT PHOTO */}

                    <Pressable
                        onPress={() => handleChoosePhoto(2)}
                        style={[
                            styles.profileCircle,
                            styles.profileCircleRight,
                        ]}
                    >
                        {coGuardianPhoto2 ? (
                            <Image
                                source={{ uri: coGuardianPhoto2 }}
                                resizeMode="cover"
                                style={styles.guardianImage}
                            />
                        ) : (
                            <View style={styles.emptyPhotoContent}>
                                <Ionicons
                                    name="camera-outline"
                                    size={31}
                                    color="#FF7F00"
                                />

                                <Text style={styles.photoHint}>
                                    Add Photo
                                </Text>
                            </View>
                        )}

                        {coGuardianPhoto2 && (
                            <Pressable
                                onPress={(event) => {
                                    event.stopPropagation();
                                    handleRemovePhoto(2);
                                }}
                                style={styles.removePhotoButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={15}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        )}
                    </Pressable>

                    {/* CENTER CAMERA */}

                    <Pressable
                        onPress={handleCenterCamera}
                        style={styles.cameraButton}
                    >
                        <Ionicons
                            name="camera"
                            size={20}
                            color="#382018"
                        />
                    </Pressable>

                </View>

                {/* ==============================
                    INFORMATION CARDS
                ============================== */}

                <View style={styles.cardsContainer}>

                    <InfoCard
                        title="Scan QR or send invite"
                        description="Invite your co-guardian"
                    />

                    <InfoCard
                        title="You're in control"
                        description="Approve access anytime"
                    />

                    <InfoCard
                        title="Share the care"
                        description="They can view and help with your pet’s progress!"
                    />

                </View>

            </View>

            {/* ==============================
                BOTTOM ACTIONS
            ============================== */}

            <View style={styles.bottomSection}>

                <View style={styles.buttonWrapper}>

                    <PrimaryButton
                        title="Add Co-Guardian"
                        onPress={handleAddCoGuardian}
                        icon={
                            <Ionicons
                                name="grid-outline"
                                size={19}
                                color="#FFFFFF"
                                style={styles.buttonIcon}
                            />
                        }
                    />

                </View>

                <Pressable
                    onPress={handleSkip}
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>
                        Skip for now
                    </Text>
                </Pressable>

            </View>

        </View>
    );
}

/* =========================================================
   INFO CARD
========================================================= */

interface InfoCardProps {
    title: string;
    description: string;
}

const InfoCard = ({
    title,
    description,
}: InfoCardProps) => {
    return (
        <View style={styles.infoCard}>

            <Text style={styles.cardTitle}>
                {title}
            </Text>

            <Text style={styles.cardDescription}>
                {description}
            </Text>

        </View>
    );
};

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    /* ==============================
       CONTAINER
    ============================== */

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        paddingTop: height * 0.112,
    },

    /* ==============================
       HEADER
    ============================== */

    header: {
        alignItems: "center",
        paddingHorizontal: 5,
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

    /* ==============================
       CO-GUARDIAN PHOTO
    ============================== */

    profileSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        height: 145,
        position: "relative",
    },

    profileCircle: {
        width: 148,
        height: 148,
        borderRadius: 75,
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "absolute",
    },

    profileCircleLeft: {
        left: "19%",
    },

    profileCircleRight: {
        right: "16%",
    },

    guardianImage: {
        width: "100%",
        height: "100%",
        borderRadius: 75,
    },

    emptyPhotoContent: {
        alignItems: "center",
        justifyContent: "center",
    },

    photoHint: {
        marginTop: 4,
        fontFamily: "Nunito_700Bold",
        fontSize: 10,
        color: "#FF7F00",
    },

    cameraButton: {
        position: "absolute",
        bottom: 0,
        left: "50%",
        marginLeft: -20,

        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#F0E1D8",

        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5,

        zIndex: 20,
    },

    removePhotoButton: {
        position: "absolute",
        top: 7,
        right: 7,

        width: 25,
        height: 25,
        borderRadius: 13,

        backgroundColor: "#FF4B32",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 2,
        borderColor: "#FFFFFF",

        elevation: 5,
        zIndex: 30,
    },

    /* ==============================
       INFO CARDS
    ============================== */

    cardsContainer: {
        width: "100%",
        paddingHorizontal: 16,
        marginTop: 18,
        gap: 9,
    },

    infoCard: {
        width: "100%",
        minHeight: 58,

        borderWidth: 1,
        borderColor: "#FF7F00",
        borderRadius: 11,

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 21,
        paddingVertical: 9,

        justifyContent: "center",
    },

    cardTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: 16,
        lineHeight: 20,
        color: "#381B0E",
    },

    cardDescription: {
        marginTop: 2,
        fontFamily: "Nunito_700Bold",
        fontSize: 13,
        lineHeight: 18,
        color: "#6B554A",
    },

    /* ==============================
       BACKGROUND PAWS
    ============================== */

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

        transform: [
            {
                rotate: "-12deg",
            },
        ],
    },

    pawTopRight: {
        top: 160 * SCALE,
        right: 17 * SCALE,

        transform: [
            {
                rotate: "15deg",
            },
        ],
    },

    pawBottomLeft: {
        bottom: 105 * SCALE,
        left: 16 * SCALE,

        transform: [
            {
                rotate: "12deg",
            },
        ],
    },

    pawBottomRight: {
        bottom: 20 * SCALE,
        right: 20 * SCALE,

        transform: [
            {
                rotate: "-12deg",
            },
        ],
    },

    /* ==============================
       BOTTOM BUTTON
    ============================== */

    bottomSection: {
        position: "absolute",

        left: 0,
        right: 0,
        bottom: 0,

        paddingHorizontal: width * 0.02,
        paddingBottom: height * 0.014,

        alignItems: "center",
    },

    buttonWrapper: {
        width: "96%",
        maxWidth: 380,

        position: "relative",

        alignSelf: "center",
    },

    buttonIcon: {
        marginLeft: -307,
    },

    skipButton: {
        height: 34,

        alignItems: "center",
        justifyContent: "center",

        marginTop: 1,
    },

    skipText: {
        fontFamily: "Nunito_700Bold",
        fontSize: 13,
        lineHeight: 18,
        fontWeight:900,
        color: "#8B6D5C",
        textAlign: "center",
    },
});
