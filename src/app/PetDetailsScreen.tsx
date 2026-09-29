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
        "Labrador Retriever",
        "Golden Retriever",
        "German Shepherd",
        "French Bulldog",
        "Poodle",
        "Beagle",
        "Pug",
        "Shih Tzu",
        "Siberian Husky",
        "Rottweiler",
        "Dachshund",
        "Cocker Spaniel",
        "Hungarian Vizsla",
        "Doberman",
        "Boxer",
        "Great Dane",
        "Border Collie",
        "Indian Pariah",
        "Other",
    ],

    cat: [
        "Persian",
        "Siamese",
        "Maine Coon",
        "Ragdoll",
        "British Shorthair",
        "Bengal",
        "Sphynx",
        "Scottish Fold",
        "American Shorthair",
        "Russian Blue",
        "Abyssinian",
        "Birman",
        "Himalayan",
        "Norwegian Forest Cat",
        "Indian Domestic Cat",
        "Other",
    ],

    rabbit: [
        "Holland Lop",
        "Netherland Dwarf",
        "Mini Rex",
        "Lionhead",
        "Flemish Giant",
        "Dutch Rabbit",
        "English Angora",
        "French Lop",
        "Mini Lop",
        "Harlequin",
        "Rex Rabbit",
        "New Zealand Rabbit",
        "Californian Rabbit",
        "Himalayan Rabbit",
        "Indian Rabbit",
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
    "Black & White",
    "Brown & White",
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
            breed,
            gender,
            birthDate,
            age,
            weight: weight.trim(),
            colour,
            photo: petPhoto,
        };

       router.push("/GuardianProfileScreen")

        // API / next navigation yahan connect kar sakte ho.
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

                    <Text style={styles.title}>
                        Tell Us About Your Pet
                    </Text>

                    <Text style={styles.subtitle}>
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
                                        size={31}
                                        color="#FF7A00"
                                    />

                                    <Text
                                        style={
                                            styles.photoHint
                                        }
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
                                    size={20}
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
                                    size={17}
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
                        placeholderTextColor="#A58C7F"
                        autoCapitalize="words"
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
                                        size={17}
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
                                        size={17}
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
                                    size={16}
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
                                >
                                    {birthDate ||
                                        "Select DOB"}
                                </Text>

                                <Ionicons
                                    name="chevron-down"
                                    size={16}
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
                                    size={16}
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
                                    placeholderTextColor="#A58C7F"
                                    keyboardType="decimal-pad"
                                />

                                <Text
                                    style={
                                        styles.unitText
                                    }
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
                                    size={23}
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
                    marginTop,
                },
            ]}
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
                    size={16}
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
            >
                {value || placeholder}
            </Text>

            <Ionicons
                name="chevron-down"
                size={16}
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

        case "Black & White":
            return "#777777";

        case "Brown & White":
            return "#A06A3B";

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
        paddingBottom: 110,
    },

    /* =========================================================
       HEADER
    ========================================================= */

    header: {
        alignItems: "center",
        paddingHorizontal: 18,
    },

    title: {
        fontFamily:
            "Fredoka_600SemiBold",

        fontSize: 32,

        lineHeight: 36,

        color: "#FF7F00",

        textAlign: "center",
    },

    subtitle: {
        marginTop: 5,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 20,

        lineHeight:28,

        color: "#382018",

        textAlign: "center",
    },

    /* =========================================================
       PHOTO
    ========================================================= */

    petImageSection: {
        alignItems: "center",
        justifyContent: "center",

        marginTop: 28,

        height: 130,
    },

    petImageWrapper: {
        width: 125,
        height: 125,

        position: "relative",

        alignItems: "center",
        justifyContent: "center",
    },

    petImageCircle: {
        width: 125,
        height: 125,

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
        marginTop: 3,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 10,

        color: "#FF7A00",
    },

    /*
     * Camera button:
     * Slightly left + slightly upper,
     * and outside wrapper clipping nahi hoga.
     */

    cameraButton: {
        position: "absolute",

        right: 7,

        bottom: -10,

        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#F0E1D8",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 4,

        elevation: 4,

        zIndex: 10,
    },

    removePhotoButton: {
        position: "absolute",

        right: 5,
        top: 5,

        width: 29,
        height: 29,

        borderRadius: 15,

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

        paddingHorizontal: 21,

        marginTop: 20,
    },

    fieldLabel: {
        fontFamily:
            "Nunito_700Bold",

        fontSize: 11,
        lineHeight: 14,

        color: "#382018",

        marginBottom: 4,
    },

    input: {
        width: "100%",

        height: 38,

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: 9,

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 14,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 14,

        color: "#382018",

        paddingVertical: 0,
    },

    /* =========================================================
       DROPDOWN
    ========================================================= */

    dropdown: {
        height: 38,

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: 9,

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 11,
    },

    dropdownText: {
        flex: 1,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 14,

        color: "#382018",

        marginLeft: 6,
    },
   dobDropdown: {
    backgroundColor: "#fff",
},

dobDropdownPressed: {
    backgroundColor: "#FF7A00",
},
    placeholderText: {
        color: "#A58C7F",
    },

    fieldIcon: {
        marginRight: 1,
    },

    colourDot: {
        width: 15,
        height: 15,

        borderRadius: 8,
    },

    /* =========================================================
       TWO COLUMNS
    ========================================================= */

    twoColumnRow: {
        flexDirection: "row",

        gap: 18,

        marginTop: 18,
    },

    /*
     * Gender ko thoda wider kiya hai.
     */

    genderColumn: {
        flex: 1.12,
    },

    dateColumn: {
        flex: 1.25,
    },

    halfColumn: {
        flex: 1,
    },

    /* =========================================================
       GENDER
    ========================================================= */

    genderRow: {
        flexDirection: "row",

        gap: 7,
    },

    genderButton: {
        flex: 1,

        minWidth: 71,

        height: 38,

        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: 9,

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",

        gap: 4,

        backgroundColor: "#FFFFFF",
    },

    genderButtonActive: {
        backgroundColor: "#FF7A00",
    },

    genderButtonText: {
        fontFamily:
            "Nunito_700Bold",

        fontSize: 11,

        color: "#5C4033",
    },

    genderButtonTextActive: {
        color: "#FFFFFF",
    },

    /* =========================================================
       WEIGHT
    ========================================================= */

    weightInputWrapper: {
        height: 38,
        marginLeft: -8,
        borderWidth: 1,
        borderColor: "#FF7A00",

        borderRadius: 9,

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 10,
    },

    weightInput: {
        flex: 1,

        height: "100%",

        paddingHorizontal: 5,
        paddingVertical: 0,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 14,

        color: "#382018",
    },

    unitText: {
        fontFamily:
            "Nunito_700Bold",

        fontSize: 12,

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

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        maxHeight:
            height * 0.65,

        paddingTop: 18,
        paddingBottom: 25,

        paddingHorizontal: 20,
    },

    modalHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent:
            "space-between",

        paddingBottom: 12,

        borderBottomWidth: 1,

        borderBottomColor:
            "#F0E4DD",
    },

    modalTitle: {
        fontFamily:
            "Fredoka_600SemiBold",

        fontSize: 21,

        color: "#FF7A00",
    },

    optionsScroll: {
        marginTop: 5,
    },

    option: {
        minHeight: 48,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 8,

        borderBottomWidth: 1,

        borderBottomColor:
            "#F7EEE9",
    },

    optionText: {
        flex: 1,

        fontFamily:
            "Nunito_700Bold",

        fontSize: 14,

        color: "#382018",

        marginLeft: 6,
    },

    optionDot: {
        width: 17,
        height: 17,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#D9C8BD",
    },
});