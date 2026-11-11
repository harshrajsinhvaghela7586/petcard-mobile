import { appAlert } from "@/components/AppDialog";
import { appLocale } from "@/i18n/autoTranslate";
import React, { useEffect, useRef, useState } from "react";
import { petcardApi } from "@/services/petcardApi";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import PhoneField from "@/components/PhoneField";
import { Country, DEFAULT_COUNTRY, joinPhone, phoneError, splitPhone } from "@/constants/countries";
import { pickAndUploadPhoto } from "@/services/photoUpload";
import { RELATIONSHIPS } from "@/constants/relationships";

/* Same cleanup the backend does, so "what I typed" and "what the server stored" compare equal. */
const clean = (v: string) => v.replace(/\s+/g, " ").trim();

/* On focus, the field is scrolled to this distance from the top of the screen (same as Guardian profile / Signup). */
const FIELD_TOP_MARGIN = 16;

type FieldKey = "name" | "phone" | "email" | "location" | "relationship";

export default function EditProfileScreen() {
    const [fontsLoaded] = useAppFonts();
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState(""); // national digits only
    const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [relationship, setRelationship] = useState("");
    const [relModal, setRelModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoBusy, setPhotoBusy] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [registeredAt, setRegisteredAt] = useState<string | null>(null);

    /* Values as stored on the server: only changed fields are sent. */
    const original = useRef({ name: "", phone: "", location: "", relationship: "" });

    /* FOCUS / SCROLL HELPERS (same behaviour as the Guardian profile screen) */
    const [focused, setFocused] = useState<FieldKey | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const formY = useRef(0);
    const fieldY = useRef<Partial<Record<FieldKey, number>>>({});
    const nameRef = useRef<any>(null);
    const locationRef = useRef<any>(null);

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

    const onFocusField = (key: FieldKey) => () => {
        setFocused(key);
        scrollToField(key);
    };
    const onBlurField = (key: FieldKey) => () => setFocused((cur) => (cur === key ? null : cur));

    const applyUser = (user: Awaited<ReturnType<typeof petcardApi.getProfile>>["user"]) => {
        setName(user.name || "");
        const sp = splitPhone(user.phone);
        setCountry(sp.country); setPhone(sp.national);
        setEmail(user.email || "");
        setLocation(user.location || "");
        setRelationship(user.relationship || "");
        setPhotoUrl(user.photoUrl ?? null);
        setRegisteredAt(user.createdAt ?? null);
        original.current = {
            name: (user.name || "").trim(),
            phone: joinPhone(sp.country, sp.national),
            location: clean(user.location || ""),
            relationship: user.relationship || "",
        };
    };

    useEffect(() => {
        let alive = true;
        petcardApi.getProfile().then(({ user }) => {
            if (!alive) return;
            applyUser(user);
            setLoaded(true);
        }).catch((error) => {
            if (alive) appAlert("Couldn't load profile", error instanceof Error ? error.message : "Please try again.");
        });
        return () => { alive = false; };
    }, []);

    if (!fontsLoaded) return null;

    /* Photo is uploaded and saved right away; the Save button is only for the text fields. */
    const changePhoto = async () => {
        if (photoBusy || !loaded) return;
        setPhotoBusy(true);
        try {
            const photo = await pickAndUploadPhoto("user_photo");
            if (!photo) return;
            const { user } = await petcardApi.updateProfile({ photo });
            setPhotoUrl(user.photoUrl ?? null);
        } catch (error) {
            appAlert("Couldn't change photo", error instanceof Error ? error.message : "Please try again.");
        } finally { setPhotoBusy(false); }
    };

    const removePhoto = () => {
        if (!photoUrl || photoBusy) return;
        appAlert("Remove photo?", "Your profile photo will be removed.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove", style: "destructive", onPress: async () => {
                    setPhotoBusy(true);
                    try {
                        const { user } = await petcardApi.updateProfile({ photo: null });
                        setPhotoUrl(user.photoUrl ?? null);
                    } catch (error) {
                        appAlert("Couldn't remove photo", error instanceof Error ? error.message : "Please try again.");
                    } finally { setPhotoBusy(false); }
                },
            },
        ]);
    };

    const onSave = async () => {
        if (saving || !loaded) return;
        Keyboard.dismiss();
        if (name.trim().length < 2) { appAlert("Name required", "Enter your full name."); return; }
        const phoneProblem = phoneError(country, phone);
        if (phoneProblem) { appAlert("Invalid phone", phoneProblem); return; }
        const cleanLocation = clean(location);
        if (cleanLocation.length > 100) { appAlert("Location too long", "Use up to 100 characters."); return; }

        /* Build the PATCH body from what actually changed. */
        const body: { name?: string; phone?: string; country?: string; location?: string; relationship?: string } = {};
        if (name.trim() !== original.current.name) body.name = name.trim();
        const fullPhone = joinPhone(country, phone);
        if (fullPhone && fullPhone !== original.current.phone) { body.phone = fullPhone; body.country = country.iso; }
        if (cleanLocation !== original.current.location) body.location = cleanLocation;
        if (relationship && relationship !== original.current.relationship) body.relationship = relationship;

        if (!Object.keys(body).length) {
            appAlert("Nothing to save", "You haven't changed any details.");
            return;
        }

        setSaving(true);
        try {
            const { user } = await petcardApi.updateProfile(body);
            applyUser(user);
            /* If the server answers with the old values, the backend update is not deployed yet. */
            if (
                (body.location !== undefined && clean(user.location || "") !== body.location) ||
                (body.relationship !== undefined && (user.relationship || "") !== body.relationship)
            ) {
                appAlert("Not saved on the server", "The server did not store location / relationship. Make sure the latest backend (meController + MobileUser schema) is deployed and restarted.");
                return;
            }
            appAlert("Profile updated", "Your profile has been saved.", [{ text: "OK", onPress: () => router.back() }]);
        } catch (error) {
            const fields = (error as any)?.data?.fields as Record<string, string> | undefined;
            const reason = fields ? Object.values(fields).filter(Boolean).join("\n") : "";
            appAlert("Couldn't save profile", reason || (error instanceof Error ? error.message : "Please try again."));
        } finally { setSaving(false); }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <PawBackground />
            <ScreenHeader
                title="My Profile"
                rightLabel={saving ? "Saving..." : "Save"}
                onRightPress={onSave}
            />

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: keyboardVisible ? s(160) : s(40) }}
            >
                {/* AVATAR + SUMMARY */}
                <View style={styles.top}>
                    <View>
                        <View style={styles.avatar}>
                            {photoUrl ? (
                                <Image
                                    source={{ uri: photoUrl }}
                                    resizeMode="cover"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : (
                                <MaterialCommunityIcons name="account-circle" size={s(112)} color={C.orange} />
                            )}
                        </View>
                        <Pressable style={styles.camera} onPress={changePhoto} onLongPress={removePhoto} disabled={photoBusy}>
                            <Ionicons name={photoBusy ? "hourglass-outline" : "camera"} size={s(15)} color={C.brown} />
                        </Pressable>
                    </View>

                    <View style={styles.summary}>
                        <Text style={styles.parentName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {name || "Parent Name"}
                        </Text>
                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="paw" size={s(16)} color={C.orange} />
                            <Text style={styles.summaryText} maxFontSizeMultiplier={1.1}>{relationship || "Pet Parent"}</Text>
                        </View>
                        <Text style={styles.summaryText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {phone ? joinPhone(country, phone) : "No phone added"}
                        </Text>
                        <Text style={styles.summaryText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {email}
                        </Text>
                        {location ? (
                            <Text style={styles.summaryText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {location}
                            </Text>
                        ) : null}
                    </View>
                </View>
                <Text style={styles.photoHint} maxFontSizeMultiplier={1.1}>
                    Tap the camera to change your photo{photoUrl ? " · long-press to remove" : ""}
                </Text>

                {/* PERSONAL INFORMATION (same input style as the Guardian profile) */}
                <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Personal Information</Text>

                <View
                    style={styles.form}
                    onLayout={(e) => { formY.current = e.nativeEvent.layout.y; }}
                >
                    {/* NAME */}
                    <View onLayout={registerField("name")}>
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Full Name</Text>
                        <View style={[styles.inputWrapper, focused === "name" && styles.inputFocused]}>
                            <Ionicons name="person-outline" size={s(16)} color={C.iconMuted} />
                            <TextInput
                                ref={nameRef}
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor={C.muted}
                                maxLength={100}
                                maxFontSizeMultiplier={1.1}
                                autoCapitalize="words"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onFocus={onFocusField("name")}
                                onBlur={onBlurField("name")}
                                onSubmitEditing={() => locationRef.current?.focus()}
                            />
                            <Ionicons name="pencil" size={s(14)} color={C.orange} />
                        </View>
                    </View>

                    {/* PHONE (with country code) */}
                    <View onLayout={registerField("phone")} onTouchStart={onFocusField("phone")} onTouchEnd={onBlurField("phone")}>
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Phone Number</Text>
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
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={s(16)} color={C.iconMuted} />
                            <TextInput
                                value={email}
                                style={[styles.input, styles.inputReadOnly]}
                                placeholder="Your email"
                                placeholderTextColor={C.muted}
                                editable={false}
                                autoCapitalize="none"
                                maxFontSizeMultiplier={1.1}
                            />
                            <Ionicons name="lock-closed-outline" size={s(16)} color="#9B765F" />
                        </View>
                    </View>

                    {/* LOCATION */}
                    <View onLayout={registerField("location")}>
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Location (Optional)</Text>
                        <View style={[styles.inputWrapper, focused === "location" && styles.inputFocused]}>
                            <Ionicons name="location-outline" size={s(16)} color={C.iconMuted} />
                            <TextInput
                                ref={locationRef}
                                value={location}
                                onChangeText={setLocation}
                                style={styles.input}
                                placeholder="e.g. Ahmedabad, India"
                                placeholderTextColor={C.muted}
                                maxLength={100}
                                maxFontSizeMultiplier={1.1}
                                autoCapitalize="words"
                                returnKeyType="done"
                                onFocus={onFocusField("location")}
                                onBlur={onBlurField("location")}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            <Ionicons name="pencil" size={s(14)} color={C.orange} />
                        </View>
                    </View>

                    {/* RELATIONSHIP */}
                    <View onLayout={registerField("relationship")}>
                        <Text style={styles.label} maxFontSizeMultiplier={1.1}>Relationship to Pet</Text>
                        <Pressable
                            onPress={() => { Keyboard.dismiss(); setRelModal(true); }}
                            style={styles.inputWrapper}
                        >
                            <Ionicons name="paw-outline" size={s(16)} color={C.iconMuted} />
                            <Text
                                style={[styles.relationshipText, !relationship && { color: C.muted }]}
                                numberOfLines={1}
                                maxFontSizeMultiplier={1.1}
                            >
                                {relationship || "Select relationship"}
                            </Text>
                            <Ionicons name="chevron-down" size={s(16)} color="#9B765F" />
                        </Pressable>
                    </View>
                </View>

                {/* PET PARENT SINCE */}
                <View style={styles.sinceCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sinceTitle} maxFontSizeMultiplier={1.1}>Pet Parent Since</Text>
                        <Text style={styles.sinceDate} maxFontSizeMultiplier={1.1}>{registeredAt ? new Date(registeredAt).toLocaleDateString(appLocale(), { day: "2-digit", month: "short", year: "numeric" }) : "Registration date unavailable"}</Text>
                        <Text style={styles.sinceNote} maxFontSizeMultiplier={1.1}>
                            {registeredAt ? `That's ${Math.max(0, Math.floor((Date.now() - new Date(registeredAt).getTime()) / 86400000))} days of love & care!` : "Your PetCard journey starts here."}
                        </Text>
                    </View>
                    <View style={styles.calendar}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={s(64)} color={C.brown} />
                        <MaterialCommunityIcons
                            name="paw"
                            size={s(26)}
                            color={C.orange}
                            style={styles.calendarPaw}
                        />
                    </View>
                </View>

                <Pressable style={styles.logoutLink} onPress={() => router.back()}>
                    <Text style={styles.logoutLinkText} maxFontSizeMultiplier={1.1}>
                        Tap Save (top right) after changing details
                    </Text>
                </Pressable>
            </ScrollView>

            <Modal visible={relModal} transparent animationType="fade" onRequestClose={() => setRelModal(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setRelModal(false)}>
                    <Pressable style={styles.relModal} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle} maxFontSizeMultiplier={1.1}>Relationship to Pet</Text>
                            <Pressable onPress={() => setRelModal(false)}><Ionicons name="close" size={s(23)} color={C.brown} /></Pressable>
                        </View>
                        {RELATIONSHIPS.map((item) => {
                            const selected = relationship === item;
                            return (
                                <Pressable key={item} style={styles.relOption} onPress={() => { setRelationship(item); setRelModal(false); }}>
                                    <Ionicons name="paw-outline" size={s(17)} color={selected ? C.orange : C.iconMuted} />
                                    <Text style={styles.relOptionText} maxFontSizeMultiplier={1.1}>{item}</Text>
                                    {selected ? <Ionicons name="checkmark" size={s(19)} color={C.orange} /> : null}
                                </Pressable>
                            );
                        })}
                    </Pressable>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    top: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE + s(6),
        marginTop: s(6),
        gap: s(16),
    },
    avatar: {
        width: s(128),
        height: s(128),
        borderRadius: s(64),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    camera: {
        position: "absolute",
        right: s(2),
        bottom: s(6),
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: s(3),
        shadowOffset: { width: 0, height: s(1) },
        elevation: 3,
    },
    photoHint: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(11),
        color: C.muted,
        paddingHorizontal: SIDE + s(6),
        marginTop: s(8),
    },
    summary: { flex: 1, gap: s(4) },
    parentName: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown },
    summaryRow: { flexDirection: "row", alignItems: "center", gap: s(6) },
    summaryText: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },

    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(16),
        color: C.brown,
        marginTop: s(22),
        paddingHorizontal: SIDE + s(6),
    },

    /* ==============================
       FORM (same look as GuardianProfileScreen)
    ============================== */

    form: {
        paddingHorizontal: s(21),
        marginTop: s(4),
    },

    label: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(17),
        color: C.brown,
        marginBottom: s(5),
        marginTop: s(9),
    },

    inputWrapper: {
        height: s(42),
        width: "100%",
        borderWidth: 1,
        borderColor: C.orange,
        borderRadius: s(9),
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: s(11),
    },

    /* Focused field: slightly thicker border and a warm tint. */
    inputFocused: {
        borderWidth: 1.5,
        backgroundColor: "#FFFBF7",
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(2) },
        shadowOpacity: 0.18,
        shadowRadius: s(4),
        elevation: 2,
    },

    /* Same look as inputWrapper, applied to the PhoneField wrapper. */
    phoneWrapper: {
        height: s(42),
        borderWidth: 1,
        borderColor: C.orange,
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
        color: C.brown,
        textAlignVertical: "center",
    },

    inputReadOnly: {
        color: C.muted,
    },

    relationshipText: {
        flex: 1,
        marginLeft: s(6),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),
        color: C.brown,
    },

    sinceCard: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE,
        marginTop: s(22),
        padding: s(18),
        borderRadius: s(14),
        backgroundColor: C.peach,
        borderWidth: 1,
        borderColor: C.orange,
    },
    sinceTitle: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    sinceDate: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.brown, marginTop: s(8) },
    sinceNote: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(10) },
    calendar: { width: s(72), height: s(72), alignItems: "center", justifyContent: "center" },
    calendarPaw: { position: "absolute", bottom: s(18) },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.28)", justifyContent: "flex-end" },
    relModal: { backgroundColor: "#FFFFFF", borderTopLeftRadius: s(24), borderTopRightRadius: s(24), paddingTop: s(18), paddingBottom: s(25), paddingHorizontal: s(20) },
    modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: s(12), borderBottomWidth: 1, borderBottomColor: "#F0E4DD" },
    modalTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(21), color: C.orange },
    relOption: { minHeight: s(50), flexDirection: "row", alignItems: "center", gap: s(8), paddingHorizontal: s(8), borderBottomWidth: 1, borderBottomColor: "#F7EEE9" },
    relOptionText: { flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },

    logoutLink: { alignItems: "center", marginTop: s(20) },
    logoutLinkText: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
});