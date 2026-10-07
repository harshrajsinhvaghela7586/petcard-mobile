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
import DateTimePicker from "@react-native-community/datetimepicker";

import {
    Fredoka_600SemiBold,
} from "@expo-google-fonts/fredoka";

import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import PrimaryButton from "@/components/Button/PrimaryButton";

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

/* =============================================================
   TYPES
============================================================= */

type PetType = "dog" | "cat" | "rabbit";

type Gender = "male" | "female" | "";

type DropdownType =
    | "breed"
    | "age"
    | "colour"
    | null;

/* =============================================================
   BREEDS
============================================================= */

const BREEDS: Record<PetType, string[]> = {
    dog: [

        "Hungarian Vizsla",

        "Border Collie",

        "Japanese Akita",
        "Other",
    ],

    cat: [
        "Persian",

        "Himalayan",

        "Other",
    ],

    rabbit: [
        "Holland Lop",

        "NewZealand Bunny",

        "Other",
    ],
};

/* =============================================================
   AGE
============================================================= */

const AGES = Array.from(
    { length: 21 },
    (_, index) =>
        `${index} ${index === 1 ? "Year" : "Years"
        }`
);

/* =============================================================
   COLOURS
============================================================= */

const COLOURS = [
    "Black",
    "White",
    "Brown",
    "Golden",
    "Cream",
    "Grey",
    "Tan",
    "Red",
    "Chocolate",
    "Orange",
    "Beige",
    "Black & White",
    "Brown & White",
    "Brown & Beige",
    "Other",
];

/* =============================================================
   SCREEN
============================================================= */

export default function PetDetailsScreen() {

    /*
     * PetTypeScreen se ye value aa rahi hai:
     *
     * dog
     * cat
     * rabbit
     */
    const { petType } =
        useLocalSearchParams<{
            petType?: string;
        }>();

    const selectedPetType: PetType =
        petType === "cat"
            ? "cat"
            : petType === "rabbit"
                ? "rabbit"
                : "dog";

    /* =========================================================
       FORM STATES
    ========================================================= */

    const [petName, setPetName] =
        useState("");

    const [breed, setBreed] =
        useState("");

    const [gender, setGender] =
        useState<Gender>("");

    const [birthDate, setBirthDate] =
        useState("");

    const [age, setAge] =
        useState("");

    const [weight, setWeight] =
        useState("");

    const [colour, setColour] =
        useState("");

    const [petPhoto, setPetPhoto] =
        useState<string | null>(null);

    /* "Other" select hone par user ka likha hua text */

    const [customBreed, setCustomBreed] =
        useState("");

    const [customColour, setCustomColour] =
        useState("");

    /* =========================================================
       DROPDOWN / DATE
    ========================================================= */

    const [dropdown, setDropdown] =
        useState<DropdownType>(null);

    const [showDatePicker, setShowDatePicker] =
        useState(false);

    /* =========================================================
       FONTS
    ========================================================= */

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    /* =========================================================
       PHOTO PICKER
    ========================================================= */

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

        if (!result.canceled) {
            setPetPhoto(
                result.assets[0].uri
            );
        }
    };

    const handleRemovePhoto = () => {
        setPetPhoto(null);
    };

    /* =========================================================
       DATE PICKER
    ========================================================= */

    const handleDateChange = (
        _event: any,
        selectedDate?: Date
    ) => {
        setShowDatePicker(false);

        if (!selectedDate) {
            return;
        }

        const day = String(
            selectedDate.getDate()
        ).padStart(2, "0");

        const month =
            selectedDate.toLocaleString(
                "en-US",
                {
                    month: "short",
                }
            );

        const year =
            selectedDate.getFullYear();

        setBirthDate(
            `${day} ${month} ${year}`
        );
    };

    /* =========================================================
       DROPDOWN DATA
    ========================================================= */

    const getDropdownData = () => {

        if (dropdown === "breed") {
            return BREEDS[selectedPetType];
        }

        if (dropdown === "age") {
            return AGES;
        }

        if (dropdown === "colour") {
            return COLOURS;
        }

        return [];
    };

    /* =========================================================
       DROPDOWN SELECT
    ========================================================= */

    const handleDropdownSelect = (
        value: string
    ) => {

        if (dropdown === "breed") {
            setBreed(value);
        }

        if (dropdown === "age") {
            setAge(value);
        }

        if (dropdown === "colour") {
            setColour(value);
        }

        setDropdown(null);
    };

    /* =========================================================
       CONTINUE
    ========================================================= */

    const handleContinue = () => {

        const petDetails = {
            petType: selectedPetType,
            petName: petName.trim(),
            breed:
                breed === "Other"
                    ? customBreed.trim()
                    : breed,
            gender,
            birthDate,
            age,
            weight: weight.trim(),
            colour:
                colour === "Other"
                    ? customColour.trim()
                    : colour,
            photo: petPhoto,
        };

        router.push("/GuardianProfileScreen");

    };

    /* =========================================================
       PET LABEL
    ========================================================= */

    const petLabel =
        selectedPetType === "dog"
            ? "Dog"
            : selectedPetType === "cat"
                ? "Cat"
                : "Rabbit";

    return (
        <View style={styles.container}>

            {/* =================================================
                BACKGROUND PAWS
            ================================================= */}

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

            {/* =================================================
                CONTENT
            ================================================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <Text
                        style={styles.title}
                        maxFontSizeMultiplier={1.1}
                    >
                        Tell Us About Your Pet
                    </Text>

                    <Text
                        style={styles.subtitle}
                        maxFontSizeMultiplier={1.1}
                    >
                        Fill in your Pet’s basic details
                    </Text>

                </View>

                {/* =================================================
                    PET PHOTO
                ================================================= */}

                <View
                    style={
                        styles.petImageSection
                    }
                >

                    <View
                        style={
                            styles.petImageWrapper
                        }
                    >

                        <Pressable
                            onPress={
                                handleChoosePhoto
                            }
                            style={
                                styles.petImageCircle
                            }
                        >

                            {petPhoto ? (
                                <Image
                                    source={{
                                        uri: petPhoto,
                                    }}
                                    resizeMode="cover"
                                    style={
                                        styles.selectedPhoto
                                    }
                                />
                            ) : (
                                <View
                                    style={
                                        styles.emptyPhotoContent
                                    }
                                >
                                    <Ionicons
                                        name="camera-outline"
                                        size={s(31)}
                                        color="#FF7A00"
                                    />

                                    <Text
                                        style={
                                            styles.photoHint
                                        }
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        Add Photo
                                    </Text>
                                </View>
                            )}

                        </Pressable>

                        {/* CAMERA ICON */}

                        {!petPhoto && (
                            <Pressable
                                onPress={
                                    handleChoosePhoto
                                }
                                style={
                                    styles.cameraButton
                                }
                            >
                                <Ionicons
                                    name="camera"
                                    size={s(20)}
                                    color="#382018"
                                />
                            </Pressable>
                        )}

                        {/* REMOVE PHOTO */}

                        {petPhoto && (
                            <Pressable
                                onPress={
                                    handleRemovePhoto
                                }
                                style={
                                    styles.removePhotoButton
                                }
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

                {/* =================================================
                    FORM
                ================================================= */}

                <View style={styles.form}>

                    {/* =================================================
                        PET NAME
                    ================================================= */}

                    <FieldLabel text="Pet Name" />

                    <TextInput
                        value={petName}
                        onChangeText={
                            setPetName
                        }
                        style={styles.input}
                        placeholder="Enter pet name"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        autoCapitalize="words"
                        maxFontSizeMultiplier={1.1}
                    />

                    {/* =================================================
                        BREED
                    ================================================= */}

                    <FieldLabel
                        text="Breed"
                        marginTop={18}
                    />

                    <DropdownField
                        value={breed}
                        placeholder={`Select ${petLabel.toLowerCase()} breed`}
                        onPress={() =>
                            setDropdown(
                                "breed"
                            )
                        }
                    />

                    {breed === "Other" && (
                        <TextInput
                            value={customBreed}
                            onChangeText={setCustomBreed}
                            style={[
                                styles.input,
                                styles.otherInput,
                            ]}
                            placeholder={`Enter ${petLabel.toLowerCase()} breed`}
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            autoCapitalize="words"
                            maxFontSizeMultiplier={1.1}
                        />
                    )}

                    {/* =================================================
                        GENDER + DOB
                    ================================================= */}

                    <View
                        style={
                            styles.twoColumnRow
                        }
                    >

                        {/* GENDER */}

                        <View
                            style={
                                styles.genderColumn
                            }
                        >

                            <FieldLabel
                                text="Gender"
                            />

                            <View
                                style={
                                    styles.genderRow
                                }
                            >

                                {/* MALE */}

                                <Pressable
                                    onPress={() =>
                                        setGender(
                                            "male"
                                        )
                                    }
                                    style={[
                                        styles.genderButton,
                                        gender ===
                                        "male" &&
                                        styles.genderButtonActive,
                                    ]}
                                >

                                    <Ionicons
                                        name="male"
                                        size={s(17)}
                                        color={
                                            gender ===
                                                "male"
                                                ? "#FFFFFF"
                                                : "#5C4033"
                                        }
                                    />

                                    <Text
                                        style={[
                                            styles.genderButtonText,
                                            gender ===
                                            "male" &&
                                            styles.genderButtonTextActive,
                                        ]}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        Male
                                    </Text>

                                </Pressable>

                                {/* FEMALE */}

                                <Pressable
                                    onPress={() =>
                                        setGender(
                                            "female"
                                        )
                                    }
                                    style={[
                                        styles.genderButton,
                                        gender ===
                                        "female" &&
                                        styles.genderButtonActive,
                                    ]}
                                >

                                    <Ionicons
                                        name="female"
                                        size={s(17)}
                                        color={
                                            gender ===
                                                "female"
                                                ? "#FFFFFF"
                                                : "#5C4033"
                                        }
                                    />

                                    <Text
                                        style={[
                                            styles.genderButtonText,
                                            gender ===
                                            "female" &&
                                            styles.genderButtonTextActive,
                                        ]}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        Female
                                    </Text>

                                </Pressable>

                            </View>

                        </View>

                        {/* DOB */}

                        <View
                            style={
                                styles.dateColumn
                            }
                        >

                            <FieldLabel text="DOB" />

                            <Pressable
                                onPress={() => setShowDatePicker(true)}
                                style={({ pressed }) => [
                                    styles.dropdown,
                                    styles.dobDropdown,
                                    pressed && styles.dobDropdownPressed,
                                ]}
                            >

                                <Ionicons
                                    name="calendar-outline"
                                    size={s(16)}
                                    color="#5C4033"
                                />

                                <Text
                                    style={[
                                        styles.dropdownText,
                                        !birthDate &&
                                        styles.placeholderText,
                                    ]}
                                    numberOfLines={
                                        1
                                    }
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {birthDate ||
                                        "Select DOB"}
                                </Text>

                                <Ionicons
                                    name="chevron-down"
                                    size={s(16)}
                                    color="#9B765F"
                                />

                            </Pressable>

                        </View>

                    </View>

                    {/* =================================================
                        AGE + WEIGHT
                    ================================================= */}

                    <View
                        style={
                            styles.twoColumnRow
                        }
                    >

                        {/* AGE */}

                        <View
                            style={
                                styles.halfColumn
                            }
                        >

                            <FieldLabel
                                text="Age"
                            />

                            <DropdownField
                                value={age}
                                placeholder="Select age"
                                icon="calendar-outline"
                                onPress={() =>
                                    setDropdown(
                                        "age"
                                    )
                                }
                            />

                        </View>

                        {/* WEIGHT */}

                        <View
                            style={
                                styles.halfColumn
                            }
                        >

                            <FieldLabel
                                text="Weight"
                            />

                            <View
                                style={
                                    styles.weightInputWrapper
                                }
                            >

                                <Ionicons
                                    name="scale-outline"
                                    size={s(16)}
                                    color="#5C4033"
                                />

                                <TextInput
                                    value={weight}
                                    onChangeText={(
                                        value
                                    ) => {

                                        if (
                                            /^\d*\.?\d*$/.test(
                                                value
                                            )
                                        ) {
                                            setWeight(
                                                value
                                            );
                                        }

                                    }}
                                    style={
                                        styles.weightInput
                                    }
                                    placeholder="Enter weight"
                                    placeholderTextColor={PLACEHOLDER_COLOR}
                                    keyboardType="decimal-pad"
                                    maxLength={6}
                                    maxFontSizeMultiplier={1.1}
                                />

                                <Text
                                    style={
                                        styles.unitText
                                    }
                                    maxFontSizeMultiplier={1.1}
                                >
                                    kg
                                </Text>

                            </View>

                        </View>

                    </View>

                    {/* =================================================
                        COLOUR
                    ================================================= */}

                    <FieldLabel
                        text="Colour"
                        marginTop={18}
                    />

                    <DropdownField
                        value={colour}
                        placeholder="Select colour"
                        onPress={() =>
                            setDropdown(
                                "colour"
                            )
                        }
                        showColourDot
                    />

                    {colour === "Other" && (
                        <TextInput
                            value={customColour}
                            onChangeText={setCustomColour}
                            style={[
                                styles.input,
                                styles.otherInput,
                            ]}
                            placeholder="Enter colour"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            autoCapitalize="words"
                            maxFontSizeMultiplier={1.1}
                        />
                    )}

                </View>

            </ScrollView>

            {/* =================================================
                CONTINUE
            ================================================= */}

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

            {/* =================================================
                DROPDOWN MODAL
            ================================================= */}

            <Modal
                visible={
                    dropdown !== null
                }
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setDropdown(null)
                }
            >

                <Pressable
                    style={
                        styles.modalOverlay
                    }
                    onPress={() =>
                        setDropdown(null)
                    }
                >

                    <Pressable
                        style={
                            styles.dropdownModal
                        }
                        onPress={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <View
                            style={
                                styles.modalHeader
                            }
                        >

                            <Text
                                style={
                                    styles.modalTitle
                                }
                                maxFontSizeMultiplier={1.1}
                            >
                                {dropdown ===
                                    "breed"
                                    ? `Select ${petLabel} Breed`
                                    : dropdown ===
                                        "age"
                                        ? "Select Age"
                                        : "Select Colour"}
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setDropdown(
                                        null
                                    )
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
                            showsVerticalScrollIndicator={
                                false
                            }
                            style={
                                styles.optionsScroll
                            }
                        >

                            {getDropdownData().map(
                                (item) => {

                                    const isSelected =
                                        (dropdown ===
                                            "breed" &&
                                            breed ===
                                            item) ||
                                        (dropdown ===
                                            "age" &&
                                            age ===
                                            item) ||
                                        (dropdown ===
                                            "colour" &&
                                            colour ===
                                            item);

                                    return (
                                        <Pressable
                                            key={item}
                                            onPress={() =>
                                                handleDropdownSelect(
                                                    item
                                                )
                                            }
                                            style={
                                                styles.option
                                            }
                                        >

                                            {dropdown ===
                                                "colour" && (
                                                    <View
                                                        style={[
                                                            styles.optionDot,
                                                            {
                                                                backgroundColor:
                                                                    getColourValue(
                                                                        item
                                                                    ),
                                                            },
                                                        ]}
                                                    />
                                                )}

                                            <Text
                                                style={
                                                    styles.optionText
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
                                }
                            )}

                        </ScrollView>

                    </Pressable>

                </Pressable>

            </Modal>

            {/* =================================================
                DATE PICKER
            ================================================= */}

            {showDatePicker && (
                <DateTimePicker
                    value={
                        birthDate
                            ? parseDate(
                                birthDate
                            )
                            : new Date()
                    }
                    mode="date"
                    display="default"
                    maximumDate={
                        new Date()
                    }
                    onChange={
                        handleDateChange
                    }
                />
            )}

        </View>
    );
}

/* =============================================================
   FIELD LABEL
============================================================= */

interface FieldLabelProps {
    text: string;
    marginTop?: number;
}

const FieldLabel = ({
    text,
    marginTop = 0,
}: FieldLabelProps) => {

    return (
        <Text
            style={[
                styles.fieldLabel,
                {
                    marginTop: s(marginTop),
                },
            ]}
            maxFontSizeMultiplier={1.1}
        >
            {text}
        </Text>
    );
};

/* =============================================================
   DROPDOWN FIELD
============================================================= */

interface DropdownFieldProps {
    value: string;
    placeholder: string;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    showColourDot?: boolean;
}

const DropdownField = ({
    value,
    placeholder,
    onPress,
    icon,
    showColourDot = false,
}: DropdownFieldProps) => {

    return (
        <Pressable
            onPress={onPress}
            style={styles.dropdown}
        >

            {showColourDot && value ? (
                <View
                    style={[
                        styles.colourDot,
                        {
                            backgroundColor:
                                getColourValue(
                                    value
                                ),
                        },
                    ]}
                />
            ) : icon ? (
                <Ionicons
                    name={icon}
                    size={s(16)}
                    color="#5C4033"
                    style={
                        styles.fieldIcon
                    }
                />
            ) : null}

            <Text
                style={[
                    styles.dropdownText,
                    !value &&
                    styles.placeholderText,
                ]}
                numberOfLines={1}
                maxFontSizeMultiplier={1.1}
            >
                {value || placeholder}
            </Text>

            <Ionicons
                name="chevron-down"
                size={s(16)}
                color="#9B765F"
            />

        </Pressable>
    );
};

/* =============================================================
   COLOUR
============================================================= */

const getColourValue = (
    colour: string
) => {

    switch (colour) {

        case "Black":
            return "#171717";

        case "White":
            return "#F5F5F5";

        case "Brown":
            return "#9B541F";

        case "Golden":
            return "#D99A27";

        case "Cream":
            return "#F4D7A1";

        case "Grey":
            return "#8B8B8B";

        case "Tan":
            return "#C58B5A";

        case "Red":
            return "#B83A2E";

        case "Chocolate":
            return "#5A321F";

        case "Orange":
            return "#F28C28";

        case "Beige":
            return "#E8D5B5";

        case "Black & White":
            return "#777777";

        case "Brown & White":
            return "#A06A3B";

        case "Brown & Beige":
            return "#BFA07A";

        default:
            return "#FF7A00";
    }
};

/* =============================================================
   DATE PARSER
============================================================= */

const parseDate = (
    value: string
) => {

    const parts =
        value.split(" ");

    if (parts.length !== 3) {
        return new Date();
    }

    const day =
        Number(parts[0]);

    const month =
        new Date(
            `${parts[1]} 1, 2000`
        ).getMonth();

    const year =
        Number(parts[2]);

    return new Date(
        year,
        month,
        day
    );
};

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    scrollContent: {
        paddingTop:
            height * 0.112,
        paddingBottom: s(110),
    },

    /* =========================================================
       HEADER
    ========================================================= */

    header: {
        alignItems: "center",
        paddingHorizontal: s(18),
    },

    title: {
        fontFamily:
            "Fredoka_600SemiBold",

        fontSize: s(32),

        lineHeight: s(36),

        color: "#FF7F00",

        textAlign: "center",
    },

    subtitle: {
        marginTop: s(5),

        fontFamily:
            "Nunito_700Bold",

        fontSize: s(20),

        lineHeight: s(28),

        color: "#382018",

        textAlign: "center",
    },

    /* =========================================================
       PHOTO
    ========================================================= */

    petImageSection: {
        alignItems: "center",
        justifyContent: "center",

        marginTop: s(28),

        height: s(130),
    },

    petImageWrapper: {
        width: s(125),
        height: s(125),

        position: "relative",

        alignItems: "center",
        justifyContent: "center",
    },

    petImageCircle: {
        width: s(125),
        height: s(125),

        borderRadius: 100,

        backgroundColor:
            "#FFE0C4",

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

        fontFamily:
            "Nunito_700Bold",

        fontSize: s(10),

        color: "#FF7A00",
    },

    /*
     * Camera button:
     * Slightly left + slightly upper,
     * and outside wrapper clipping nahi hoga.
     */

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

    /* =========================================================
       FORM
    ========================================================= */

    form: {
        width: "100%",

        paddingHorizontal: s(21),

        marginTop: s(20),
    },

    /* label: 11 -> 13 */
    fieldLabel: {
        fontFamily:
            "Nunito_700Bold",

        fontSize: s(13),
        lineHeight: s(17),

        color: "#382018",

        marginBottom: s(5),
    },

    /* height: 38 -> 42, text 14 SemiBold */
    input: {
        width: "100%",

        height: s(42),

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: s(9),

        backgroundColor: "#FFFFFF",

        paddingHorizontal: s(14),

        fontFamily:
            "Nunito_600SemiBold",

        fontSize: s(14),

        color: "#382018",

        paddingVertical: 0,

        textAlignVertical: "center",
    },

    otherInput: {
        marginTop: s(8),
    },

    /* =========================================================
       DROPDOWN
    ========================================================= */

    dropdown: {
        height: s(42),

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: s(9),

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: s(11),
    },

    dropdownText: {
        flex: 1,

        fontFamily:
            "Nunito_600SemiBold",

        fontSize: s(14),

        color: "#382018",

        marginLeft: s(6),
    },

    dobDropdown: {
        backgroundColor: "#fff",
    },

    dobDropdownPressed: {
        backgroundColor: "#FF7A00",
    },

    placeholderText: {
        color: PLACEHOLDER_COLOR,
    },

    fieldIcon: {
        marginRight: s(1),
    },

    colourDot: {
        width: s(15),
        height: s(15),

        borderRadius: s(8),
    },

    /* =========================================================
       TWO COLUMNS
    ========================================================= */

    twoColumnRow: {
        flexDirection: "row",

        gap: s(18),

        marginTop: s(18),
    },

    /*
     * Teeno columns equal (flex: 1) taaki dono rows
     * (Gender/DOB aur Age/Weight) seedhe aligned rahein.
     */

    genderColumn: {
        flex: 1,
    },

    dateColumn: {
        flex: 1,
    },

    halfColumn: {
        flex: 1,
    },

    /* =========================================================
       GENDER
    ========================================================= */

    genderRow: {
        flexDirection: "row",

        gap: s(7),
    },

    genderButton: {
        flex: 1,

        height: s(42),

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: s(9),

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",

        gap: s(4),

        backgroundColor: "#FFFFFF",
    },

    genderButtonActive: {
        backgroundColor: "#FF7A00",
    },

    genderButtonText: {
        fontFamily:
            "Nunito_700Bold",

        fontSize: s(13),

        color: "#5C4033",
    },

    genderButtonTextActive: {
        color: "#FFFFFF",
    },

    /* =========================================================
       WEIGHT
    ========================================================= */

    weightInputWrapper: {
        height: s(42),

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: s(9),

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: s(11),
    },

    weightInput: {
        flex: 1,

        height: "100%",

        paddingHorizontal: s(5),
        paddingVertical: 0,

        fontFamily:
            "Nunito_600SemiBold",

        fontSize: s(14),

        color: "#382018",

        textAlignVertical: "center",
    },

    unitText: {
        fontFamily:
            "Nunito_600SemiBold",

        fontSize: s(13),

        color: "#8B6D5C",
    },

    /* =========================================================
       BACKGROUND PAWS
    ========================================================= */

    backgroundPaw: {
        position: "absolute",

        width: 78 * SCALE,
        height: 78 * SCALE,

        opacity: 0.075,

        zIndex: 0,
    },

    pawTopLeft: {
        top: 42 * SCALE,
        left: 25 * SCALE,

        transform: [
            {
                rotate: "-12deg",
            },
        ],
    },

    pawTopRight: {
        top: 146 * SCALE,
        right: 18 * SCALE,

        transform: [
            {
                rotate: "15deg",
            },
        ],
    },

    pawBottomLeft: {
        bottom: 132 * SCALE,
        left: 18 * SCALE,

        transform: [
            {
                rotate: "12deg",
            },
        ],
    },

    pawBottomRight: {
        bottom: 28 * SCALE,
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

    /* =========================================================
       DROPDOWN MODAL
    ========================================================= */

    modalOverlay: {
        flex: 1,

        backgroundColor:
            "rgba(0, 0, 0, 0.28)",

        justifyContent: "flex-end",
    },

    dropdownModal: {
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: s(24),
        borderTopRightRadius: s(24),

        maxHeight:
            height * 0.65,

        paddingTop: s(18),
        paddingBottom: s(25),

        paddingHorizontal: s(20),
    },

    modalHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent:
            "space-between",

        paddingBottom: s(12),

        borderBottomWidth: 1,

        borderBottomColor:
            "#F0E4DD",
    },

    modalTitle: {
        fontFamily:
            "Fredoka_600SemiBold",

        fontSize: s(21),

        color: "#FF7A00",
    },

    optionsScroll: {
        marginTop: s(5),
    },

    option: {
        minHeight: s(48),

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: s(8),

        borderBottomWidth: 1,

        borderBottomColor:
            "#F7EEE9",
    },

    optionText: {
        flex: 1,

        fontFamily:
            "Nunito_600SemiBold",

        fontSize: s(14),

        color: "#382018",

        marginLeft: s(6),
    },

    optionDot: {
        width: s(17),
        height: s(17),

        borderRadius: s(9),

        borderWidth: 1,

        borderColor: "#D9C8BD",
    },
});