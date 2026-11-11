import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";
import { petcardApi } from "@/services/petcardApi";
import { readPetSetupDraft, updatePetSetupDraft } from "@/services/petSetupDraft";
import { useImagesReady } from "@/hooks/use-images-ready";
import { petImageSource } from "@/services/stickerImage";
import ScreenLoader from "@/components/ScreenLoader";
import { useLang } from "@/i18n/LanguageContext";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const PAW_IMG = require("../../../assets/images/paw.png");
const PAW_WHITE_IMG = require("../../../assets/images/paw-white.png");
const SCREEN_IMAGES = [PAW_IMG, PAW_WHITE_IMG];

const RING_SIZE = s(250);
const IMAGE_SIZE = s(210);

export default function GeneratingPetIdScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    const [progress, setProgress] = useState(0);
    const [saving, setSaving] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    /* The picture the person chose in setup (their first sticker, else the avatar). Nothing is drawn until it is known, so no default dog flashes. */
    const [heroImg, setHeroImg] = useState<any>(null);
    useEffect(() => {
        let alive = true;
        readPetSetupDraft().then((d) => {
            if (!alive) return;
            setHeroImg(petImageSource({ type: d.petType, activeStickerKey: d.stickerKeys?.find(Boolean) ?? null, avatarKey: d.avatarKey, avatarLocalId: d.avatarLocalId }));
        }).catch(() => undefined);
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        let alive = true;
        let progressTimer: ReturnType<typeof setInterval> | undefined;
        (async () => {
            try {
                progressTimer = setInterval(() => setProgress((p) => Math.min(p + 2, 90)), 80);
                let draft = await readPetSetupDraft();
                if (!draft.name?.trim() || !draft.petType) throw new Error("Pet name or pet type is missing. Go back and complete pet details.");
                if (draft.petId) {
                    // A retry after navigation/network interruption must reuse the same saved pet.
                    try {
                        const existing = await petcardApi.getPet(draft.petId);
                        if (existing.pet?.id) {
                            if (alive) setProgress(100);
                            return;
                        }
                    } catch (err) {
                        // Saved pet no longer exists (deleted DB / another account): forget the stale ID and create a fresh pet.
                        const status = (err as any)?.status ?? (err as any)?.statusCode;
                        const msg = err instanceof Error ? err.message : "";
                        if (status !== 404 && !/not found|404/i.test(msg)) throw err;
                    }
                    await updatePetSetupDraft({ petId: null, idempotencyKey: null } as any);
                    draft = { ...draft, petId: undefined, idempotencyKey: undefined };
                }
                const idempotencyKey = draft.idempotencyKey ?? `petsetup_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                await updatePetSetupDraft({ idempotencyKey });
                const categories = new Set(["food", "water", "walk", "play", "grooming", "training", "medication", "vet", "hygiene", "other"]);
                const normalizeTime = (value?: string | null): string | null => {
                    if (!value) return null;
                    const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
                    if (!m) return /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim()) ? value.trim() : null;
                    let h = Number(m[1]); const min = Number(m[2]); const suffix = m[3]?.toUpperCase();
                    if (min > 59 || h > 23 || (suffix && (h < 1 || h > 12))) return null;
                    if (suffix === "PM" && h < 12) h += 12; if (suffix === "AM" && h === 12) h = 0;
                    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                };
                const firstTask = draft.firstTask ? { ...draft.firstTask, category: categories.has(draft.firstTask.category) ? draft.firstTask.category : "other", timeOfDay: normalizeTime(draft.firstTask.timeOfDay) } : undefined;
                const result = await petcardApi.createPet({
                    name: draft.name.trim(), type: draft.petType, breed: draft.breed ?? "", color: draft.colour ?? "", gender: draft.gender ?? "unknown",
                    birthDate: draft.birthDate ?? null, weightKg: draft.weightKg ?? null, avatarKey: draft.avatarKey ?? null, avatarLocalId: draft.avatarLocalId ?? null,
                    stickerKeys: (draft.stickerKeys ?? []).filter(Boolean).slice(0, 7),
                    health: { vaccinated: draft.health?.vaccinated ?? null, allergies: draft.health?.allergies ?? [], conditions: draft.health?.conditions ?? [], vetName: draft.health?.vetName ?? "", vetPhone: draft.health?.vetPhone ?? "", notes: draft.health?.notes ?? "" },
                    reminders: draft.reminders ?? { enabled: false, time: "08:00" }, ...(firstTask ? { firstTask } : {}),
                }, idempotencyKey);
                if (!result.pet?.id) throw new Error("The server did not return a Pet ID. Please retry.");
                await updatePetSetupDraft({ petId: result.pet.id });
                if (alive) setProgress(100);
            } catch (error) {
                if (alive) {
                    // Show the exact field the server rejected (e.g. "weightKg: Must be between 0.05 and 500.").
                    const fields = (error as any)?.data?.fields as Record<string, string> | undefined;
                    const detail = fields ? Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
                    setSaveError(detail || (error instanceof Error ? error.message : "Could not save your pet. Please retry."));
                    setProgress(0);
                }
            } finally {
                if (progressTimer) clearInterval(progressTimer);
                if (alive) setSaving(false);
            }
        })();
        return () => { alive = false; if (progressTimer) clearInterval(progressTimer); };
    }, [attempt]);

    const imagesReady = useImagesReady(SCREEN_IMAGES);
    const { lang } = useLang();
    const tall = lang === "hi";

    const isDone = progress >= 100 && !saving && !saveError;

    // Generate hote hi apne aap next screen pe jao
    useEffect(() => {
        if (!isDone) return;
        const t = setTimeout(() => router.replace("/PetCardReadyScreen"), 600);
        return () => clearTimeout(t);
    }, [isDone]);

    if (!fontsLoaded || !imagesReady) return <ScreenLoader />;

    const handleRetry = () => {
        setSaveError(null);
        setSaving(true);
        setProgress(0);
        setAttempt((value) => value + 1);
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
                        Generating Your Pet ID
                    </Text>
                    <Text style={[styles.subtitle, tall && styles.subtitleTall]} maxFontSizeMultiplier={1.1}>
                        {saveError ? saveError : saving ? "Saving your pet profile and generating a unique identity…" : "Your pet profile is saved."}
                    </Text>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.body}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* PET IMAGE IN RING */}
                    <View style={styles.ring}>
                        {heroImg ? (
                            <Image
                                source={heroImg}
                                resizeMode="contain"
                                style={styles.petImage}
                            />
                        ) : null}
                    </View>

                    {/* PROGRESS */}
                    <View style={styles.progressWrapper}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[styles.progressFill, { width: `${progress}%` }]}
                            />
                        </View>
                        <Text style={styles.progressText} maxFontSizeMultiplier={1.1}>
                            {progress}%
                        </Text>
                    </View>

                    {/* TIP */}
                    <View style={styles.tipBox}>
                        <View style={styles.tipIconWrapper}>
                            <Ionicons name="shield-checkmark" size={s(26)} color="#FF7A00" />
                        </View>
                        <Text style={styles.tipText} maxFontSizeMultiplier={1.1}>
                            <Text style={styles.tipBold}>Tip: </Text>
                            Your PetCard &amp; QR will help keep your pet&apos;s
                            important info always accessible!
                        </Text>
                    </View>
                </ScrollView>
            </View>

            {/* BOTTOM ACTIONS (sirf error aane par Retry dikhega) */}
            {saveError ? (
                <View style={styles.bottomSection}>
                    <View style={styles.buttonWrapper}>
                        <PrimaryButton
                            title="Retry"
                            onPress={handleRetry}
                            icon={
                                <Image
                                    source={PAW_WHITE_IMG}
                                    resizeMode="contain"
                                    style={styles.buttonPaw}
                                />
                            }
                        />
                    </View>
                </View>
            ) : null}
        </View>
    );
}

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

    /* BODY */
    body: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: s(16),
        paddingTop: s(24),
        paddingBottom: s(130),
    },

    ring: {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        borderWidth: s(3),
        borderColor: "#FFD2A6",
        backgroundColor: "#FFFAF4",
        alignItems: "center",
        justifyContent: "center",
    },

    petImage: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },

    progressWrapper: {
        width: "78%",
        marginTop: s(26),
    },

    progressTrack: {
        width: "100%",
        height: s(12),
        borderRadius: s(6),
        backgroundColor: "#FFE0C4",
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: s(6),
        backgroundColor: "#FF7A00",
    },

    progressText: {
        marginTop: s(4),
        alignSelf: "flex-start",
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        color: "#381B0E",
    },

    tipBox: {
        width: "100%",
        marginTop: s(18),
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FF7F00",
        borderRadius: s(12),
        backgroundColor: "#FFF3E6",
        paddingHorizontal: s(14),
        paddingVertical: s(12),
        gap: s(12),
    },

    tipIconWrapper: {
        width: s(40),
        height: s(40),
        borderRadius: s(20),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FFD2A6",
        alignItems: "center",
        justifyContent: "center",
    },

    tipText: {
        flex: 1,
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        color: "#381B0E",
    },

    tipBold: {
        color: "#FF7A00",
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

    /* BOTTOM ACTIONS (Retry only) */
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
});