import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
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

/* Placeholder colour (thoda gehra, better contrast) */
const PLACEHOLDER_COLOR = "#8F7365";

export default function GuardianProfileScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [relationship, setRelationship] = useState("");

    const [profilePhoto, setProfilePhoto] =
        useState<string | null>(null);

    const [relationshipModalVisible, setRelationshipModalVisible] =
        useState(false);

    const RELATIONSHIPS = [
        "Pet Parent",
        "Owner",
        "Guardian",
        "Family Member",
        "Caretaker",
    ];

    if (!fontsLoaded) {
        return null;
    }

    const handleChoosePhoto = async () => {
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

        if (!result.canceled && result.assets?.length) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    const handleRemovePhoto = () => {
        setProfilePhoto(null);
    };

    const handleContinue = () => {
        router.push("/CoGuardianScreen");
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
                        {"Let's get to know you !"}
                    </Text>

                    <Text
                        style={styles.subtitle}
                        maxFontSizeMultiplier={1.1}
                    >
                        Create your guardian profile to start your
                        pet card journey
                    </Text>

                </View>

                {/* ==============================
                    GUARDIAN IMAGE
                    (same as PetDetailsScreen)
                ============================== */}

                <View style={styles.profileSection}>

                    <View style={styles.profileWrapper}>

                        <Pressable
                            onPress={handleChoosePhoto}
                            style={styles.profileCircle}
                        >
                            {profilePhoto ? (
                                <Image
                                    source={{ uri: profilePhoto }}
                                    resizeMode="cover"
                                    style={styles.selectedPhoto}
                                />
                            ) : (
                                <View style={styles.emptyPhotoContent}>
                                    <Ionicons
                                        name="camera-outline"
                                        size={s(31)}
                                        color="#FF7A00"
                                    />

                                    <Text
                                        style={styles.photoHint}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        Add Photo
                                    </Text>
                                </View>
                            )}
                        </Pressable>

                        {/* CAMERA ICON */}

                        {!profilePhoto && (
                            <Pressable
                                onPress={handleChoosePhoto}
                                style={styles.cameraButton}
                            >
                                <Ionicons
                                    name="camera"
                                    size={s(20)}
                                    color="#382018"
                                />
                            </Pressable>
                        )}

                        {/* REMOVE PHOTO */}

                        {profilePhoto && (
                            <Pressable
                                onPress={handleRemovePhoto}
                                style={styles.removePhotoButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={s(17)}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        )}

                    </View>

                </View>

                {/* ==============================
                    FORM
                ============================== */}

                <View style={styles.form}>

                    {/* NAME */}

                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Your Name
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="person-outline"
                            size={s(16)}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            maxFontSizeMultiplier={1.1}
                        />

                    </View>

                    {/* PHONE */}

                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Phone Number
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Text
                            style={styles.flag}
                            maxFontSizeMultiplier={1.1}
                        >
                            🇮🇳
                        </Text>

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                            placeholder="+91"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            keyboardType="phone-pad"
                            maxFontSizeMultiplier={1.1}
                        />

                    </View>

                    {/* EMAIL */}

                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Email Address
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="mail-outline"
                            size={s(16)}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            maxFontSizeMultiplier={1.1}
                        />

                    </View>

                    {/* LOCATION */}

                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Your Location (Optional)
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="location-outline"
                            size={s(16)}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholder="Enter your location"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            maxFontSizeMultiplier={1.1}
                        />

                        <Ionicons
                            name="locate-outline"
                            size={s(16)}
                            color="#9B765F"
                        />

                    </View>

                    {/* RELATIONSHIP */}

                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Relationship to Pet
                    </Text>

                    <Pressable
                        onPress={() =>
                            setRelationshipModalVisible(true)
                        }
                        style={styles.inputWrapper}
                    >

                        <Ionicons
                            name="paw-outline"
                            size={s(16)}
                            color="#8B6D5C"
                        />

                        <Text
                            style={[
                                styles.relationshipText,
                                !relationship &&
                                styles.relationshipPlaceholder,
                            ]}
                            numberOfLines={1}
                            maxFontSizeMultiplier={1.1}
                        >
                            {relationship ||
                                "Select relationship"}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={s(16)}
                            color="#9B765F"
                        />

                    </Pressable>

                </View>

            </View>

            {/* ==============================
                CONTINUE BUTTON
            ============================== */}

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

            {/* ==============================
                RELATIONSHIP DROPDOWN
            ============================== */}

            <Modal
                visible={relationshipModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setRelationshipModalVisible(false)
                }
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() =>
                        setRelationshipModalVisible(false)
                    }
                >
                    <Pressable
                        style={styles.relationshipModal}
                        onPress={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <View style={styles.modalHeader}>
                            <Text
                                style={styles.modalTitle}
                                maxFontSizeMultiplier={1.1}
                            >
                                Relationship to Pet
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setRelationshipModalVisible(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={s(23)}
                                    color="#382018"
                                />
                            </Pressable>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {RELATIONSHIPS.map((item) => {
                                const isSelected =
                                    relationship === item;

                                return (
                                    <Pressable
                                        key={item}
                                        onPress={() => {
                                            setRelationship(item);
                                            setRelationshipModalVisible(
                                                false
                                            );
                                        }}
                                        style={styles.relationshipOption}
                                    >
                                        <Ionicons
                                            name="paw-outline"
                                            size={s(17)}
                                            color={
                                                isSelected
                                                    ? "#FF7A00"
                                                    : "#8B6D5C"
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.relationshipOptionText
                                            }
                                            maxFontSizeMultiplier={1.1}
                                        >
                                            {item}
                                        </Text>

                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark"
                                                size={s(19)}
                                                color="#FF7A00"
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>

        </View>
    );
}

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
        color: "#FF7A00",
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
       PROFILE IMAGE
       (PetDetailsScreen jaisa same)
    ============================== */

    profileSection: {
        alignItems: "center",
        justifyContent: "center",

        marginTop: s(28),

        height: s(130),
    },

    profileWrapper: {
        width: s(125),
        height: s(125),

        position: "relative",

        alignItems: "center",
        justifyContent: "center",
    },

    profileCircle: {
        width: s(125),
        height: s(125),

        borderRadius: 100,

        backgroundColor: "#FFE0C4",

        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",
    },

    selectedPhoto: {
        width: "100%",
        height: "100%",

        borderRadius: 100,
    },

    emptyPhotoContent: {
        alignItems: "center",
        justifyContent: "center",
    },

    photoHint: {
        marginTop: s(3),

        fontFamily: "Nunito_700Bold",

        fontSize: s(10),

        color: "#FF7A00",
    },

    cameraButton: {
        position: "absolute",

        right: s(7),

        bottom: s(-10),

        width: s(40),
        height: s(40),
        borderRadius: s(20),

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#F0E1D8",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: s(2),
        },
        shadowOpacity: 0.16,
        shadowRadius: s(4),

        elevation: 4,

        zIndex: 10,
    },

    removePhotoButton: {
        position: "absolute",

        right: s(5),
        top: s(5),

        width: s(29),
        height: s(29),

        borderRadius: s(15),

        backgroundColor: "#FF4B32",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 2,
        borderColor: "#FFFFFF",

        zIndex: 20,

        elevation: 5,
    },

    /* ==============================
       FORM
    ============================== */

    form: {
        paddingHorizontal: s(21),
        marginTop: s(13),
    },

    label: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(17),
        color: "#382018",
        marginBottom: s(5),
        marginTop: s(9),
    },

    inputWrapper: {
        height: s(42),
        width: "100%",

        borderWidth: 1,
        borderColor: "#FF7A00",
        borderRadius: s(9),

        backgroundColor: "#FFFFFF",

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: s(11),
    },

    input: {
        flex: 1,

        height: "100%",

        paddingHorizontal: s(6),
        paddingVertical: 0,

        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),

        color: "#382018",

        textAlignVertical: "center",
    },

    flag: {
        fontSize: s(16),
    },

    countryArrow: {
        fontSize: s(12),
        color: "#8B6D5C",
        marginLeft: s(2),
    },

    relationshipText: {
        flex: 1,

        marginLeft: s(6),

        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),

        color: "#382018",
    },

    relationshipPlaceholder: {
        color: PLACEHOLDER_COLOR,
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
        top: 28 * SCALE,
        left: 22 * SCALE,

        transform: [
            {
                rotate: "-12deg",
            },
        ],
    },

    pawTopRight: {
        top: 135 * SCALE,
        right: 15 * SCALE,

        transform: [
            {
                rotate: "15deg",
            },
        ],
    },

    pawBottomLeft: {
        bottom: 125 * SCALE,
        left: 15 * SCALE,

        transform: [
            {
                rotate: "12deg",
            },
        ],
    },

    pawBottomRight: {
        bottom: 10 * SCALE,
        right: 20 * SCALE,

        transform: [
            {
                rotate: "-12deg",
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

        borderRadius: s(15),

        alignSelf: "center",

        // Button depth
        shadowColor: "#FF7A00",
        shadowOffset: {
            width: 0,
            height: s(7),
        },
        shadowOpacity: 0.20,
        shadowRadius: s(12),

        elevation: 5,
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

    /* ==============================
       RELATIONSHIP MODAL
    ============================== */

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.28)",
        justifyContent: "flex-end",
    },

    relationshipModal: {
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: s(24),
        borderTopRightRadius: s(24),

        maxHeight: height * 0.55,

        paddingTop: s(18),
        paddingBottom: s(25),
        paddingHorizontal: s(20),
    },

    modalHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingBottom: s(12),

        borderBottomWidth: 1,
        borderBottomColor: "#F0E4DD",
    },

    modalTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(21),
        color: "#FF7A00",
    },

    relationshipOption: {
        minHeight: s(50),

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: s(8),

        borderBottomWidth: 1,
        borderBottomColor: "#F7EEE9",
    },

    relationshipOptionText: {
        flex: 1,

        marginLeft: s(8),

        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),

        color: "#382018",
    },
});