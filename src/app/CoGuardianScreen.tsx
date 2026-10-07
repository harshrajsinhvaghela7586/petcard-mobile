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

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, gap,
 * icon size...) is multiplied by the same scale factor, so the
 * screen looks like the design (393 x 852) on every device.
 *
 * - Small phones -> everything shrinks proportionally
 * - Big phones   -> capped at 1.3 so nothing looks oversized
 */
const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

/*
 * Photo circles position
 *
 * Earlier: left "19%" / right "16%" of screen width with a fixed
 * 148px circle, so on small screens the circles stopped overlapping
 * like in the design. Now the same design coordinates
 * (74.7px / 62.9px on 393 wide) are scaled along with the circle size.
 */
const CONTENT_OFFSET_X =
    (width - DESIGN_WIDTH * UI_SCALE) / 2;

const PHOTO_LEFT = CONTENT_OFFSET_X + s(74.7);
const PHOTO_RIGHT = CONTENT_OFFSET_X + s(62.9);

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

                    <Text
                        style={styles.title}
                        maxFontSizeMultiplier={1.1}
                    >
                        Add a Co-Guardian
                    </Text>

                    <Text
                        style={styles.subtitle}
                        maxFontSizeMultiplier={1.1}
                    >
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
                                    size={s(31)}
                                    color="#FF7F00"
                                />

                                <Text
                                    style={styles.photoHint}
                                    maxFontSizeMultiplier={1.1}
                                >
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
                                    size={s(15)}
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
                                    size={s(31)}
                                    color="#FF7F00"
                                />

                                <Text
                                    style={styles.photoHint}
                                    maxFontSizeMultiplier={1.1}
                                >
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
                                    size={s(15)}
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
                            size={s(20)}
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

                    {/* Text stays centered (no icon inside the button) */}
                    <PrimaryButton
                        title="Add Co-Guardian"
                        onPress={handleAddCoGuardian}
                    />

                    {/* Icon is pinned to the left, vertically centered,
                        and never blocks the button touch */}
                    <View
                        pointerEvents="none"
                        style={styles.buttonIconContainer}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={s(19)}
                            color="#FFFFFF"
                        />
                    </View>

                </View>

                <Pressable
                    onPress={handleSkip}
                    style={styles.skipButton}
                >
                    <Text
                        style={styles.skipText}
                        maxFontSizeMultiplier={1.1}
                    >
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

            <Text
                style={styles.cardTitle}
                maxFontSizeMultiplier={1.1}
            >
                {title}
            </Text>

            <Text
                style={styles.cardDescription}
                maxFontSizeMultiplier={1.1}
            >
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

    /* ==============================
       CO-GUARDIAN PHOTO
    ============================== */

    profileSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(25),
        height: s(145),
        position: "relative",
    },

    profileCircle: {
        width: s(148),
        height: s(148),
        borderRadius: s(75),
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7F00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "absolute",
    },

    profileCircleLeft: {
        left: PHOTO_LEFT,
    },

    profileCircleRight: {
        right: PHOTO_RIGHT,
    },

    guardianImage: {
        width: "100%",
        height: "100%",
        borderRadius: s(75),
    },

    emptyPhotoContent: {
        alignItems: "center",
        justifyContent: "center",
    },

    photoHint: {
        marginTop: s(4),
        fontFamily: "Nunito_700Bold",
        fontSize: s(10),
        color: "#FF7F00",
    },

    cameraButton: {
        position: "absolute",
        bottom: 0,
        left: "50%",
        marginLeft: s(-20),

        width: s(40),
        height: s(40),
        borderRadius: s(20),

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#F0E1D8",

        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: s(2),
        },
        shadowOpacity: 0.18,
        shadowRadius: s(5),

        zIndex: 20,
    },

    removePhotoButton: {
        position: "absolute",
        top: s(7),
        right: s(7),

        width: s(25),
        height: s(25),
        borderRadius: s(13),

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
        paddingHorizontal: s(16),
        marginTop: s(18),
        gap: s(9),
    },

    infoCard: {
        width: "100%",
        minHeight: s(58),

        borderWidth: 1,
        borderColor: "#FF7F00",
        borderRadius: s(11),

        backgroundColor: "#FFFFFF",

        paddingHorizontal: s(21),
        paddingVertical: s(9),

        justifyContent: "center",
    },

    cardTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(16),
        lineHeight: s(20),
        color: "#381B0E",
    },

    cardDescription: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
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

    buttonIconContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: s(70),

        alignItems: "center",
        justifyContent: "center",
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
        fontWeight:900,
        color: "#8B6D5C",
        textAlign: "center",
    },
});