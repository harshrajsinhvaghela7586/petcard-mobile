import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Alert,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import PrimaryButton from "@/components/Button/PrimaryButton";
import QRCode from "react-native-qrcode-svg";
import { getPetQrValue, petcardApi, type Pet } from "@/services/petcardApi";
import { downloadCard, printCard } from "@/services/cardExport";
import { readPetSetupDraft } from "@/services/petSetupDraft";
import { getPetAvatarSource } from "@/services/petAvatar";
import { preloadImages, useImagesReady } from "@/hooks/use-images-ready";
import ScreenLoader from "@/components/ScreenLoader";
import { useLang } from "@/i18n/LanguageContext";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

/* =========================================================
   DEMO DATA  (replace with real pet data / route params)
========================================================= */

const PAW_IMG = require("../../../assets/images/paw.png");
const PAW_WHITE_IMG = require("../../../assets/images/paw-white.png");
const DEFAULT_AVATAR_IMG = require("../../../assets/images/pets/huchiko.png");
const SCREEN_IMAGES = [PAW_IMG, PAW_WHITE_IMG, DEFAULT_AVATAR_IMG];

const PET = { name: "Your pet", breed: "Pet profile", gender: "Unknown", age: "—", weight: "—", petId: "" };

/* =========================================================
   HELPERS
========================================================= */

// Handles ISO (2023-05-14), DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD etc.
// (plain `new Date("14/05/2023")` is Invalid Date, which is why age showed "—")
const parseBirthDate = (value?: string | null): Date | null => {
    if (!value) return null;
    const v = String(value).trim();
    if (!v) return null;
    let m = v.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (m) {
        const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
        return Number.isNaN(d.getTime()) ? null : d;
    }
    m = v.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
};

const formatAge = (birthDate?: string | null) => {
    const born = parseBirthDate(birthDate);
    if (!born) return "—";
    const now = new Date();
    let months = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth();
    if (now.getDate() < born.getDate()) months -= 1;
    if (months < 0) return "—";
    if (months === 0) return "< 1 month";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years && remainingMonths) return `${years}y ${remainingMonths}m`;
    if (years) return `${years} ${years === 1 ? "year" : "years"}`;
    return `${months} ${months === 1 ? "month" : "months"}`;
};

/* =========================================================
   SCREEN
========================================================= */

export default function PetCardReadyScreen() {
    const cardRef = useRef<View>(null);
    const [petAvatar, setPetAvatar] = useState<any>(DEFAULT_AVATAR_IMG);
    const [pet, setPet] = useState<Pet | null>(null);
    const [draftPet, setDraftPet] = useState<Awaited<ReturnType<typeof readPetSetupDraft>>>({});
    useEffect(() => {
      let alive = true;
      (async () => {
        const draft = await readPetSetupDraft();
        if (alive) setDraftPet(draft);
        try {
          const saved = draft.petId ? await petcardApi.getPet(draft.petId) : null;
          const resolved = saved?.pet ?? (await petcardApi.listPets()).pets?.[0] ?? null;
          if (alive) setPet(resolved);
        } catch { /* Keep the local setup draft visible when the API is unavailable. */ }
      })();
      return () => { alive = false; };
    }, []);
    useEffect(() => {
      let alive = true;
      readPetSetupDraft().then(async (draft) => {
        const source = getPetAvatarSource(pet?.type ?? draft.petType, pet?.avatarKey ?? draft.avatarKey, draft.avatarLocalId);
        // Load the pet's avatar first, then swap it in, so it never pops in half-drawn.
        await preloadImages([typeof source === "number" ? source : undefined]);
        if (alive) setPetAvatar(source);
      }).catch(() => undefined);
      return () => { alive = false; };
    }, [pet?.avatarKey, pet?.type]);
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    const petName = pet?.name ?? draftPet.name ?? PET.name;

    // Poori PetCard ki image banake share karo
    const handleShareCard = async () => {
        try {
            const uri = await captureRef(cardRef, { format: "png", quality: 1 });
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Sharing not available", "Sharing is not supported on this device.");
                return;
            }
            await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: `${petName}'s PetCard` });
        } catch (error) {
            Alert.alert("Could not share PetCard", error instanceof Error ? error.message : "Please try again.");
        }
    };

    const imagesReady = useImagesReady(SCREEN_IMAGES);
    const { lang } = useLang();
    const tall = lang === "hi";

    if (!fontsLoaded || !imagesReady) return <ScreenLoader />;

    const handleContinue = () => {
        router.push("/CareSetupCompleteScreen");
    };

    return (
        <View style={styles.container}>
            {/* BACKGROUND PAWS */}
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomLeft]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            {/* CONTENT */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, tall && styles.titleTall]} maxFontSizeMultiplier={1.1}>
                        Your PetCard is Ready!
                    </Text>
                    <Text style={[styles.subtitle, tall && styles.subtitleTall]} maxFontSizeMultiplier={1.1}>
                        Here&apos;s your pet&apos;s digital identity.
                    </Text>
                </View>

                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* PET CARD (ye poora card image ban ke share / download / print hoga) */}
                    <View ref={cardRef} collapsable={false} style={styles.card}>
                        {/* top orange strip */}
                        <View style={styles.cardTop}>
                            <Text style={styles.cardLabel} maxFontSizeMultiplier={1.1}>
                                PETCARD
                            </Text>
                            <Ionicons name="paw" size={s(22)} color="#FFFFFF" />
                        </View>

                        {/* body */}
                        <View style={styles.cardBody}>
                            <View style={styles.identityRow}>
                                <View style={styles.avatarRing}>
                                    <Image
                                        source={petAvatar}
                                        resizeMode="contain"
                                        style={styles.avatar}
                                    />
                                </View>

                                <View style={styles.identityText}>
                                    <View style={styles.primaryPill}>
                                        <Text style={styles.primaryPillText} maxFontSizeMultiplier={1.1}>
                                            Primary Pet
                                        </Text>
                                    </View>

                                    <View style={styles.nameRow}>
                                        <Text style={styles.petName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} maxFontSizeMultiplier={1.1}>
                                            {petName}
                                        </Text>
                                        <Ionicons name="paw" size={s(14)} color="#FF7A00" />
                                    </View>

                                    <Text style={styles.petBreed} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                                        {pet?.breed || pet?.type || draftPet.breed || draftPet.petType || PET.breed}
                                    </Text>
                                </View>
                            </View>

                            {/* info row */}
                            <View style={styles.infoRow}>
                                <InfoItem label="Gender" value={(pet?.gender ?? draftPet.gender ?? "unknown").replace(/^./, (c) => c.toUpperCase())} icon="male" />
                                <InfoItem label="Age" value={formatAge(pet?.birthDate || draftPet.birthDate)} icon="calendar-outline" />
                                <InfoItem label="Weight" value={(pet?.weightKg ?? draftPet.weightKg) != null ? `${pet?.weightKg ?? draftPet.weightKg} kg` : "—"} icon="barbell-outline" />
                            </View>

                            {/* id + qr */}
                            <View style={styles.idRow}>
                                <View style={styles.idTextWrapper}>
                                    <Text style={styles.idLabel} maxFontSizeMultiplier={1.1}>
                                        PET ID
                                    </Text>
                                    <Text style={styles.idValue} maxFontSizeMultiplier={1.1}>
                                        {pet?.id ?? draftPet.petId ?? PET.petId}
                                    </Text>
                                </View>

                                <View style={styles.qrBox}>
                                    <QRCode value={getPetQrValue(pet)} size={s(62)} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actionsRow}>
                        <ActionButton
                            icon="download-outline"
                            label="Download"
                            onPress={() => downloadCard(cardRef)}
                        />
                        <ActionButton
                            icon="share-social-outline"
                            label="Share"
                            onPress={handleShareCard}
                        />
                        <ActionButton
                            icon="print-outline"
                            label="Print"
                            onPress={() => printCard(cardRef, `${petName} PetID`)}
                        />
                    </View>
                </ScrollView>
            </View>

            {/* BOTTOM ACTIONS (no skip on this screen) */}
            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Continue to Dashboard"
                        onPress={handleContinue}
                        icon={
                            <Image
                                source={PAW_WHITE_IMG}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
                {/* keeps the button at the exact same position as the other screens */}
                <View style={styles.skipSpacer} />
            </View>
        </View>
    );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}) => (
    <View style={styles.infoItem}>
        <View style={styles.infoLabelRow}>
            <Ionicons name={icon} size={s(12)} color="#A77C59" />
            <Text style={styles.infoLabel} maxFontSizeMultiplier={1.1}>
                {label}
            </Text>
        </View>
        <Text style={styles.infoValue} numberOfLines={1} maxFontSizeMultiplier={1.1}>
            {value}
        </Text>
    </View>
);

const ActionButton = ({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.actionButton}
    >
        <Ionicons name={icon} size={s(22)} color="#FF7A00" />
        <Text style={styles.actionText} maxFontSizeMultiplier={1.1}>
            {label}
        </Text>
    </Pressable>
);

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        paddingTop: height * 0.112,
    },

    /* HEADER (identical on all screens) */
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

    titleTall: { lineHeight: s(46) },
    subtitleTall: { lineHeight: s(34) },

    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#381B0E",
        textAlign: "center",
    },

    list: {
        flex: 1,
        marginTop: s(18),
    },

    listContent: {
        paddingHorizontal: s(16),
        paddingBottom: s(130),
    },

    /* CARD */
    card: {
        borderRadius: s(18),
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#FF7F00",
        backgroundColor: "#FFF3E6",
    },

    cardTop: {
        height: s(40),
        backgroundColor: "#FF7F00",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(16),
    },

    cardLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        letterSpacing: 0.5,
        color: "#FFFFFF",
    },

    cardBody: {
        backgroundColor: "#FFF3E6",
        paddingHorizontal: s(16),
        paddingTop: s(14),
        paddingBottom: s(16),
    },

    identityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(14),
    },

    avatarRing: {
        width: s(96),
        height: s(96),
        borderRadius: s(48),
        borderWidth: s(2),
        borderColor: "#FF7F00",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    avatar: {
        width: s(84),
        height: s(84),
    },

    identityText: {
        flex: 1,
        alignItems: "flex-start",
    },

    primaryPill: {
        alignSelf: "flex-end",
        borderRadius: s(8),
        backgroundColor: "#FFE0C4",
        paddingHorizontal: s(10),
        paddingVertical: s(3),
        marginBottom: s(8),
    },

    primaryPillText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        color: "#FF7A00",
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
    },

    petName: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(24),
        lineHeight: s(28),
        color: "#381B0E",
    },

    petBreed: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#6B554A",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(16),
        paddingHorizontal: s(4),
    },

    infoItem: {
        flex: 1,
        alignItems: "flex-start",
    },

    infoLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
    },

    infoLabel: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(11),
        lineHeight: s(15),
        color: "#6B554A",
    },

    infoValue: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(19),
        color: "#381B0E",
    },

    idRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginTop: s(14),
    },

    idTextWrapper: {
        flex: 1,
        paddingBottom: s(4),
    },

    idLabel: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(11),
        lineHeight: s(15),
        color: "#6B554A",
    },

    idValue: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(18),
        lineHeight: s(24),
        color: "#381B0E",
    },

    qrBox: {
        padding: s(6),
        borderRadius: s(8),
        backgroundColor: "#FFFFFF",
    },

    /* ACTIONS */
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(22),
        gap: s(12),
    },

    actionButton: {
        flex: 1,
        height: s(66),
        borderRadius: s(11),
        borderWidth: 1,
        borderColor: "#FF7F00",
        backgroundColor: "#FFFCF9",
        alignItems: "center",
        justifyContent: "center",
        gap: s(4),
    },

    actionText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#381B0E",
    },

    /* BACKGROUND PAWS */
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
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 160 * SCALE,
        right: 17 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawBottomLeft: {
        bottom: 105 * SCALE,
        left: 16 * SCALE,
        transform: [{ rotate: "12deg" }],
    },

    pawBottomRight: {
        bottom: 20 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /* BOTTOM ACTIONS (identical on all screens) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: height * 0.014,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },

    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
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

    skipSpacer: {
        height: s(34),
        marginTop: s(1),
    },
});