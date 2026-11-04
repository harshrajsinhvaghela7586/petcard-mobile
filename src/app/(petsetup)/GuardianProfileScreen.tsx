import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    Alert
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";

import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";
import PhoneField from "@/components/PhoneField";
import { router } from "expo-router";
import { petcardApi } from "@/services/petcardApi";
import { updatePetSetupDraft } from "@/services/petSetupDraft";
import { pickAndUploadPhoto } from "@/services/photoUpload";
import { RELATIONSHIPS } from "@/constants/relationships";
import { Country, DEFAULT_COUNTRY, joinPhone, phoneError, splitPhone } from "@/constants/countries";

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

/* Focus hone par field screen ke top se itna neeche rakhna hai (same as Signup). */
const FIELD_TOP_MARGIN = 16;

/* Same cleanup the backend does, so "what I typed" and "what the server stored" compare equal. */
const clean = (v: string) => v.replace(/\s+/g, " ").trim();

type FieldKey = "name" | "phone" | "email" | "location";

export default function GuardianProfileScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    const [name, setName] = useState("");
    const [phone, setPhone] = useState(""); // national digits only
    const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [relationship, setRelationship] = useState("");

    /* Saved profile photo (Cloudinary URL). It is uploaded and stored as soon as it is picked. */
    const [profilePhoto, setProfilePhoto] =
        useState<string | null>(null);
    const [photoBusy, setPhotoBusy] = useState(false);

    // Values as loaded from the account: unchanged fields are not sent again (an old stored number must not block Continue).
    const loaded = useRef({ name: "", phone: "", location: "", relationship: "" });

    /* FOCUS / SCROLL HELPERS (same behaviour as the Signup screen) */
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const formY = useRef(0);
    const fieldY = useRef<Partial<Record<FieldKey, number>>>({});
    const nameRef = useRef<TextInput>(null);
    const locationRef = useRef<TextInput>(null);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
        const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const registerField = (key: FieldKey) => (e: LayoutChangeEvent) => {
        fieldY.current[key] = e.nativeEvent.layout.y;
    };

    const scrollToField = (key: FieldKey) => {
        setTimeout(() => {
            const y = formY.current + (fieldY.current[key] ?? 0) - FIELD_TOP_MARGIN;
            scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true });
        }, 250);
    };

    const [relationshipModalVisible, setRelationshipModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      let alive = true;
      petcardApi.getProfile().then(({ user }) => {
        if (!alive) return;
        const sp = splitPhone(user.phone);
        setName(user.name ?? "");
        setCountry(sp.country);
        setPhone(sp.national);
        setEmail(user.email ?? "");
        setLocation(user.location ?? "");
        setRelationship(user.relationship ?? "");
        setProfilePhoto(user.photoUrl ?? null);
        loaded.current = {
            name: (user.name ?? "").trim(),
            phone: joinPhone(sp.country, sp.national),
            location: clean(user.location ?? ""),
            relationship: user.relationship ?? "",
        };
      }).catch(() => undefined);
      return () => { alive = false; };
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    /* Pick -> upload to Cloudinary -> save on the account. No crop screen: the photo is used as it is. */
    const handleChoosePhoto = async () => {
        if (photoBusy) return;
        setPhotoBusy(true);
        try {
            const photo = await pickAndUploadPhoto("user_photo", undefined, { crop: false });
            if (!photo) return;
            const { user } = await petcardApi.updateProfile({ photo });
            setProfilePhoto(user.photoUrl ?? null);
        } catch (error) {
            Alert.alert("Couldn't save photo", error instanceof Error ? error.message : "Please try again.");
        } finally { setPhotoBusy(false); }
    };

    const handleRemovePhoto = async () => {
        if (photoBusy) return;
        setPhotoBusy(true);
        try {
            await petcardApi.updateProfile({ photo: null });
            setProfilePhoto(null);
        } catch (error) {
            Alert.alert("Couldn't remove photo", error instanceof Error ? error.message : "Please try again.");
        } finally { setPhotoBusy(false); }
    };

    const handleContinue = async () => {
        if (saving) return;
        if (!relationship) {
            Alert.alert("Relationship required", "Please select your relationship to the pet.");
            return;
        }
        const phoneProblem = phoneError(country, phone);
        if (phoneProblem) {
            Alert.alert("Invalid phone", phoneProblem);
            return;
        }
        setSaving(true);
        try {
          const body: { name?: string; phone?: string; country?: string; location?: string; relationship?: string } = {};
          if (name.trim() && name.trim() !== loaded.current.name) body.name = name.trim();
          // Phone is sent with its country (dial code), so the server never has to guess it.
          const fullPhone = joinPhone(country, phone);
          if (fullPhone && fullPhone !== loaded.current.phone) { body.phone = fullPhone; body.country = country.iso; }
          // Location is optional: it is saved when changed, and an emptied field clears it.
          const cleanLocation = clean(location);
          if (cleanLocation !== loaded.current.location) body.location = cleanLocation;
          // Relationship is saved on the account, so Edit Profile shows (and can change) the same value.
          if (relationship !== loaded.current.relationship) body.relationship = relationship;
          if (Object.keys(body).length) {
            const { user } = await petcardApi.updateProfile(body);
            const sp = splitPhone(user.phone);
            loaded.current = {
                name: (user.name ?? "").trim(),
                phone: joinPhone(sp.country, sp.national),
                location: clean(user.location ?? ""),
                relationship: user.relationship ?? "",
            };
          }
          await updatePetSetupDraft({});
          router.push("/CoGuardianScreen");
        } catch (error) {
          // Show the exact reason from the server (for example "Enter a valid India mobile number.").
          const fields = (error as any)?.data?.fields as Record<string, string> | undefined;
          const reason = fields ? Object.values(fields).filter(Boolean).join("\n") : "";
          Alert.alert("Couldn't save guardian profile", reason || (error instanceof Error ? error.message : "Please try again."));
        } finally { setSaving(false); }
    };

    return (
        <View style={styles.container}>

            {/* ==============================
                BACKGROUND PAWS
            ============================== */}

            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawTopLeft,
                ]}
            />

            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawTopRight,
                ]}
            />

            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawBottomLeft,
                ]}
            />

            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.backgroundPaw,
                    styles.pawBottomRight,
                ]}
            />

            {/* ==============================
                CONTENT
            ============================== */}

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.scrollContent,
                    keyboardVisible && styles.scrollContentKeyboard,
                ]}
            >

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
                                        name={photoBusy ? "hourglass-outline" : "camera-outline"}
                                        size={s(31)}
                                        color="#FF7A00"
                                    />

                                    <Text
                                        style={styles.photoHint}
                                        maxFontSizeMultiplier={1.1}
                                    >
                                        {photoBusy ? "Uploading..." : "Add Photo"}
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

                <View
                    style={styles.form}
                    onLayout={(e) => {
                        formY.current = e.nativeEvent.layout.y;
                    }}
                >

                    {/* NAME */}

                    <View onLayout={registerField("name")}>
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
                            ref={nameRef}
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            maxLength={100}
                            maxFontSizeMultiplier={1.1}
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onFocus={() => scrollToField("name")}
                            onSubmitEditing={() => locationRef.current?.focus()}
                        />

                    </View>
                    </View>

                    {/* PHONE (with country code) */}

                    <View onLayout={registerField("phone")}>
                    <Text
                        style={styles.label}
                        maxFontSizeMultiplier={1.1}
                    >
                        Phone Number
                    </Text>

                    <PhoneField
                        country={country}
                        national={phone}
                        onCountry={setCountry}
                        onNational={setPhone}
                        editable
                        placeholder="Phone number"
                        wrapperStyle={styles.phoneWrapper}
                    />
                    </View>

                    {/* EMAIL (read-only: it cannot be changed here) */}

                    <View onLayout={registerField("email")}>
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
                            style={[styles.input, styles.inputReadOnly]}
                            placeholder="Your email"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            editable={false}
                            autoCapitalize="none"
                            maxFontSizeMultiplier={1.1}
                        />

                        <Ionicons
                            name="lock-closed-outline"
                            size={s(16)}
                            color="#9B765F"
                        />

                    </View>
                    </View>

                    {/* LOCATION */}

                    <View onLayout={registerField("location")}>
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
                            ref={locationRef}
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholder="Enter your location"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            maxLength={100}
                            maxFontSizeMultiplier={1.1}
                            returnKeyType="done"
                            onFocus={() => scrollToField("location")}
                            onSubmitEditing={Keyboard.dismiss}
                        />

                        <Ionicons
                            name="locate-outline"
                            size={s(16)}
                            color="#9B765F"
                        />

                    </View>
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

            </ScrollView>
            </KeyboardAvoidingView>

            {/* ==============================
                CONTINUE BUTTON
            ============================== */}

            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>

                    <PrimaryButton
                        title={saving ? "Saving..." : "Continue"}
                        onPress={handleContinue}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
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
    },

    scrollContent: {
        paddingTop: height * 0.112,
        paddingBottom: s(110),
    },

    /* Keyboard open hone par extra jagah, taaki last fields bhi upar tak scroll ho sakein (Signup jaisa) */
    scrollContentKeyboard: {
        paddingBottom: 20,
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

    /* Same look as inputWrapper, applied to the PhoneField wrapper. */
    phoneWrapper: {
        height: s(42),
        borderWidth: 1,
        borderColor: "#FF7A00",
        borderRadius: s(9),
        backgroundColor: "#FFFFFF",
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

    inputReadOnly: {
        color: "#8F7365",
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