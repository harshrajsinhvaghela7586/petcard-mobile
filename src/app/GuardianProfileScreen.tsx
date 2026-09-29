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

export default function GuardianProfileScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
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
    
           
    
           router.push("/CoGuardianScreen")
    
            // API / next navigation yahan connect kar sakte ho.
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
                        {"Let's get to know you !"}
                    </Text>

                    <Text style={styles.subtitle}>
                        Create your guardian profile to start your
                        pet card journey
                    </Text>

                </View>

                {/* ==============================
                    GUARDIAN IMAGE
                ============================== */}

                <View style={styles.profileSection}>

                    <Pressable
                        onPress={handleChoosePhoto}
                        style={styles.profileCircle}
                    >
                        {profilePhoto ? (
                            <Image
                                source={{ uri: profilePhoto }}
                                resizeMode="cover"
                                style={styles.guardianImage}
                            />
                        ) : (
                            <View style={styles.emptyPhotoContent}>
                                <Ionicons
                                    name="camera-outline"
                                    size={31}
                                    color="#FF7A00"
                                />

                                <Text style={styles.photoHint}>
                                    Add Photo
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    {!profilePhoto && (
                        <Pressable
                            onPress={handleChoosePhoto}
                            style={styles.cameraButton}
                        >
                            <Ionicons
                                name="camera"
                                size={20}
                                color="#382018"
                            />
                        </Pressable>
                    )}

                    {profilePhoto && (
                        <Pressable
                            onPress={handleRemovePhoto}
                            style={styles.removePhotoButton}
                        >
                            <Ionicons
                                name="close"
                                size={17}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    )}

                </View>

                {/* ==============================
                    FORM
                ============================== */}

                <View style={styles.form}>

                    {/* NAME */}

                    <Text style={styles.label}>
                        Your Name
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="person-outline"
                            size={15}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#A58C7F"
                        />

                    </View>

                    {/* PHONE */}

                    <Text style={styles.label}>
                        Phone Number
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Text style={styles.flag}>
                            🇮🇳
                        </Text>

                        

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                            placeholder="+91"
                            placeholderTextColor="#A58C7F"
                            keyboardType="phone-pad"
                        />

                    </View>

                    {/* EMAIL */}

                    <Text style={styles.label}>
                        Email Address
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="mail-outline"
                            size={15}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#A58C7F"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                    </View>

                    {/* LOCATION */}

                    <Text style={styles.label}>
                        Your Location (Optional)
                    </Text>

                    <View style={styles.inputWrapper}>

                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#8B6D5C"
                        />

                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholder="Enter your location"
                            placeholderTextColor="#A58C7F"
                        />

                        <Ionicons
                            name="locate-outline"
                            size={16}
                            color="#9B765F"
                        />

                    </View>

                    {/* RELATIONSHIP */}

                    <Text style={styles.label}>
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
                            size={16}
                            color="#8B6D5C"
                        />

                        <Text
                            style={[
                                styles.relationshipText,
                                !relationship &&
                                styles.relationshipPlaceholder,
                            ]}
                        >
                            {relationship ||
                                "Select relationship"}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={16}
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
                            <Text style={styles.modalTitle}>
                                Relationship to Pet
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setRelationshipModalVisible(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={23}
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
                                            size={17}
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
                                        >
                                            {item}
                                        </Text>

                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark"
                                                size={19}
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
        paddingHorizontal: 5,
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: 32,
        lineHeight: 36,
        color: "#FF7A00",
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
       PROFILE IMAGE
    ============================== */

    profileSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        height: 110,
        position: "relative",
    },

    profileCircle: {
        width: 125,
        height: 125,
        borderRadius: 100,
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "flex-end",
        overflow: "hidden",
    },

    guardianImage: {
        width: 105,
        height: 105,
        borderRadius: 55,
    },

    emptyPhotoContent: {
        top:-40,
        alignItems: "center",
        justifyContent: "center",
    },

    photoHint: {
        marginTop: 3,
        fontFamily: "Nunito_700Bold",
        fontSize: 10,
        color: "#FF7A00",
    },

    cameraButton: {
        position: "absolute",
        right: width * 0.34,
        bottom: -10,

        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#F0E1D8",

        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    removePhotoButton: {
        position: "absolute",
        right: width * 0.29,
        top: 1,

        width: 27,
        height: 27,
        borderRadius: 15,

        backgroundColor: "#FF4B32",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 2,
        borderColor: "#FFFFFF",

        elevation: 5,
        zIndex: 20,
    },

    /* ==============================
       FORM
    ============================== */

    form: {
        paddingHorizontal: 19,
        marginTop: 13,
    },

    label: {
        fontFamily: "Nunito_700Bold",
        fontSize: 10,
        lineHeight: 13,
        color: "#382018",
        marginBottom: 3,
        marginTop: 9,
    },

    inputWrapper: {
        height: 38,
        width: "100%",

        borderWidth: 1,
        borderColor: "#FF7A00",
        borderRadius: 9,

        backgroundColor: "#FFFFFF",

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 8,
    },

    input: {
        flex: 1,

        height: "100%",

        paddingHorizontal: 6,
        paddingVertical: 0,

        fontFamily: "Nunito_700Bold",
        fontSize: 13,

        color: "#382018",
    },

    flag: {
        fontSize: 16,
    },

    countryArrow: {
        fontSize: 12,
        color: "#8B6D5C",
        marginLeft: 2,
    },

    relationshipText: {
        flex: 1,

        marginLeft: 6,

        fontFamily: "Nunito_700Bold",
        fontSize: 13,

        color: "#382018",
    },

    relationshipPlaceholder: {
        color: "#A58C7F",
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
        marginLeft: 20,

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

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        maxHeight: height * 0.55,

        paddingTop: 18,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },

    modalHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingBottom: 12,

        borderBottomWidth: 1,
        borderBottomColor: "#F0E4DD",
    },

    modalTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: 21,
        color: "#FF7A00",
    },

    relationshipOption: {
        minHeight: 50,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 8,

        borderBottomWidth: 1,
        borderBottomColor: "#F7EEE9",
    },

    relationshipOptionText: {
        flex: 1,

        marginLeft: 8,

        fontFamily: "Nunito_700Bold",
        fontSize: 14,

        color: "#382018",
    },
});