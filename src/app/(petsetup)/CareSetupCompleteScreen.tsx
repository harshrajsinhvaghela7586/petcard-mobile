import PrimaryButton from "@/components/Button/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { appFlags } from "@/services/appFlags";
import { petcardApi } from "@/services/petcardApi";
import { petImageSource } from "@/services/stickerImage";
import { scheduleTaskReminders } from "@/services/taskReminders";
import { clearPetSetupDraft, readPetSetupDraft, updatePetSetupDraft } from "@/services/petSetupDraft";
import { useState } from "react";
import { useEffect } from "react";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, s, SIDE } from "../../components/KnowKit";
import { preloadImages, useImagesReady } from "@/hooks/use-images-ready";
import ScreenLoader from "@/components/ScreenLoader";
import { useLang } from "@/i18n/LanguageContext";



const PAW_WHITE_IMG = require("../../../assets/images/paw-white.png");

const SCREEN_IMAGES = [PAW_WHITE_IMG];

const validTaskCategories = new Set(["food", "water", "walk", "play", "grooming", "training", "medication", "vet", "hygiene", "other"]);
function normalizeTime(value?: string | null): string | null {
    if (!value) return null;
    const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim()) ? value.trim() : null;
    let hour = Number(match[1]); const minute = Number(match[2]); const suffix = match[3]?.toUpperCase();
    if (minute > 59 || hour > 23 || (suffix && (hour < 1 || hour > 12))) return null;
    if (suffix === "PM" && hour < 12) hour += 12;
    if (suffix === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const NEXT = [
    {
        key: "dashboard",
        icon: "calendar-check",
        color: "#5E9B2D",
        tint: "#EAF3DC",
        title: "Check your dashboard",
        sub: "See today's tasks and reminders.",
        route: "/HomeScreen",
    },
    {
        key: "streak",
        icon: "flash",
        color: "#E0457B",
        tint: "#FFE3EE",
        title: "Keep your streak alive",
        sub: "Complete daily tasks & earn rewards!",
        route: "/TasksScreen",
    },
    {
        key: "explore",
        icon: "star-four-points",
        color: "#FF7A00",
        tint: "#FFE9D6",
        title: "Explore more features",
        sub: "PetCard has so much to offer!",
        route: "/KnowScreen",
    },
] as const;

/* confetti: [left %, top px, color, rotate deg, w, h] */
const CONFETTI = [
    [6, 18, "#FF7A00", 20, 5, 10], [16, 60, "#7A5CFF", -30, 6, 6], [26, 10, "#FFB300", 45, 5, 10],
    [38, 40, "#FF4B32", 10, 4, 9], [52, 14, "#5E9B2D", -20, 6, 6], [64, 52, "#FF7A00", 60, 5, 10],
    [74, 12, "#E0457B", 15, 6, 6], [84, 44, "#FFB300", -40, 5, 10], [93, 20, "#7A5CFF", 30, 5, 9],
    [10, 110, "#FFB300", 25, 5, 9], [90, 96, "#FF4B32", -15, 5, 10], [46, 96, "#7A5CFF", 50, 4, 8],
] as const;

export default function CareSetupCompleteScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [petName, setPetName] = useState("your pet");
    const [savingPet, setSavingPet] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [petHeroImage, setPetHeroImage] = useState<any>(null);

    // Persist the completed onboarding to the server exactly once using a stable idempotency key.
    useEffect(() => {
        let alive = true;
        (async () => {
          try {
            const draft = await readPetSetupDraft();
            if (!draft.name || !draft.petType) throw new Error("Pet details are missing. Please restart pet setup.");
            if (alive) {
              setPetName(draft.name);
              // Show the chosen sticker straight away (no default dog while the pet is being saved).
              setPetHeroImage(petImageSource({ type: draft.petType, activeStickerKey: draft.stickerKeys?.find(Boolean) ?? null, avatarKey: draft.avatarKey, avatarLocalId: draft.avatarLocalId }));
            }
            const idempotencyKey = draft.idempotencyKey ?? `petsetup_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            // Pet creation normally happens on GeneratingPetIdScreen. This fallback supports old drafts.
            await updatePetSetupDraft({ idempotencyKey });
            const firstTask = draft.firstTask ? { ...draft.firstTask, category: validTaskCategories.has(draft.firstTask.category) ? draft.firstTask.category : "other", timeOfDay: normalizeTime(draft.firstTask.timeOfDay) } : undefined;
            const createdResult = draft.petId
              ? { pet: (await petcardApi.getPet(draft.petId)).pet, created: false }
              : await petcardApi.createPet({
              name: draft.name,
              type: draft.petType,
              breed: draft.breed ?? "",
              color: draft.colour ?? "",
              gender: draft.gender ?? "unknown",
              birthDate: draft.birthDate ?? null,
              weightKg: draft.weightKg ?? null,
              avatarKey: draft.avatarKey ?? null, avatarLocalId: draft.avatarLocalId ?? null,
              stickerKeys: draft.stickerKeys ?? [],
              health: { vaccinated: draft.health?.vaccinated ?? null, allergies: draft.health?.allergies ?? [], conditions: draft.health?.conditions ?? [], vetName: draft.health?.vetName ?? "", vetPhone: draft.health?.vetPhone ?? "", notes: draft.health?.notes ?? "" },
              reminders: draft.reminders ?? { enabled: false, time: "08:00" },
              ...(firstTask ? { firstTask } : {}),
            }, idempotencyKey);
            const petId = createdResult.pet.id;
            // Use the API-confirmed pet/avatar/sticker. If the API fails, the original dog fallback stays.
            // Load the confirmed pet picture first, then swap it in, so the picture never pops in half-drawn.
            const heroSource = petImageSource({ type: createdResult.pet.type, activeStickerKey: createdResult.pet.activeStickerKey ?? createdResult.pet.stickerKeys?.[0], avatarKey: createdResult.pet.avatarKey, avatarLocalId: draft.avatarLocalId ?? createdResult.pet.avatarLocalId });
            await preloadImages([typeof heroSource === "number" ? heroSource : undefined]);
            if (alive) setPetHeroImage(heroSource);
            if (petId && (draft.initialTasks?.length ?? 0) > 1) {
              const existingTasks = await petcardApi.listAllTasks(petId);
              const existingTitles = new Set(existingTasks.tasks.map((task) => task.title.trim().toLowerCase()));
              const today = new Date();
              const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              for (const task of draft.initialTasks!.slice(1)) {
                if (existingTitles.has(task.title.trim().toLowerCase())) continue;
                await petcardApi.createTask(petId, { title: task.title, category: validTaskCategories.has(task.category) ? task.category : "other", timeOfDay: normalizeTime(task.timeOfDay), recurrence: { type: "daily", startDate } });
              }
            }
            // Alarms for every setup task that has a time (the first task is created by the server together with the pet).
            try {
              const all = await petcardApi.listAllTasks(petId);
              for (const task of all.tasks ?? []) {
                if (task.timeOfDay && task.recurrence) await scheduleTaskReminders(task, { minutesBefore: 10, petName: createdResult.pet.name });
              }
            } catch { /* alarms are a bonus: never fail the pet setup because of them */ }
            await clearPetSetupDraft();
            if (user?.id) await appFlags.setSetupDone(user.id);
          } catch (error) {
            if (alive) setSaveError(error instanceof Error ? error.message : "Could not save your pet. Please retry.");
          } finally {
            if (alive) setSavingPet(false);
          }
        })();
        return () => { alive = false; };
    }, [user?.id, retryCount]);

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    const imagesReady = useImagesReady(SCREEN_IMAGES);
    const { lang } = useLang();
    const tall = lang === "hi";
    if (!fontsLoaded || !imagesReady) return <ScreenLoader />;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* TOP: title */}
                <View style={[styles.top, { paddingTop: insets.top + s(24) }]}>
                    {CONFETTI.map((c, i) => (
                        <View
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${c[0]}%`,
                                top: s(c[1]) + insets.top * 0.3,
                                width: s(c[4]),
                                height: s(c[5]),
                                borderRadius: s(1.5),
                                backgroundColor: c[2],
                                transform: [{ rotate: `${c[3]}deg` }],
                            }}
                        />
                    ))}

                    <Text style={[styles.title, tall && styles.titleTall]} maxFontSizeMultiplier={1.1}>
                        Care Setup{"\n"}
                        <Text style={{ color: C.orange }}>Complete! 🎉</Text>
                    </Text>
                    <Text style={[styles.subtitle, tall && styles.subtitleTall]} maxFontSizeMultiplier={1.1}>
                        You're all set to give the best care to {petName}. Let's make every day awesome!
                    </Text>
                    {savingPet ? <Text style={styles.subtitle}>Saving your pet profile…</Text> : null}
                    {saveError ? <Pressable onPress={() => { setSaveError(null); setSavingPet(true); setRetryCount((n) => n + 1); }}><Text style={[styles.subtitle, { color: "#C62828" }]}>{saveError} Tap here to retry saving.</Text></Pressable> : null}
                </View>

                {/* HERO SCENE */}
                <View style={styles.scene}>
                    <View style={styles.wall} />
                    <View style={styles.floor} />
                    <View style={styles.rug} />

                    <View style={styles.sofa} />
                    <MaterialCommunityIcons
                        name="sprout"
                        size={s(90)}
                        color="#5E9B2D"
                        style={styles.plant}
                    />
                    <View style={styles.frame}>
                        <MaterialCommunityIcons name="paw" size={s(18)} color={C.orange} />
                    </View>

                    {petHeroImage ? (
                        <Image
                            source={petHeroImage}
                            resizeMode="contain"
                            style={styles.pet}
                        />
                    ) : null}

                    <MaterialCommunityIcons name="tennis-ball" size={s(46)} color="#3B8FD6" style={styles.ball} />
                    <MaterialCommunityIcons name="bone" size={s(40)} color="#3B6FB6" style={styles.rope} />
                </View>

                {/* WHAT'S NEXT */}
                <View style={[styles.sheet]}>
                    <Text style={styles.sheetTitle} maxFontSizeMultiplier={1.1}>
                        What's Next?
                    </Text>

                    {NEXT.map((n) => (
                        <Pressable
                            key={n.key}
                            onPress={() => router.replace(n.route as any)}
                            style={styles.nextRow}
                        >
                            <View style={[styles.nextIcon, { backgroundColor: n.tint }]}>
                                <MaterialCommunityIcons name={n.icon as any} size={s(22)} color={n.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.nextTitle} maxFontSizeMultiplier={1.1}>
                                    {n.title}
                                </Text>
                                <Text style={styles.nextSub} maxFontSizeMultiplier={1.1}>
                                    {n.sub}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
                        </Pressable>
                    ))}

                    {/* same PrimaryButton as Create Pet Avatar */}
                    <View style={styles.buttonWrap}>
                        <PrimaryButton
                            title="Go to Dashboard"
                            onPress={() => { if (!savingPet && !saveError) router.replace("/HomeScreen" as any); }}
                            style={styles.primaryButton}
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
            </ScrollView>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF3E3", overflow: "hidden" },

    top: { alignItems: "center", paddingHorizontal: s(24), paddingBottom: s(8) },
    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(40),
        color: C.brown,
        textAlign: "center",
    },
    titleTall: { lineHeight: s(46) },
    subtitleTall: { lineHeight: s(26) },

    subtitle: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        textAlign: "center",
        marginTop: s(8),
        maxWidth: s(320),
    },

    /* scene */
    scene: { height: s(290), width: "100%", overflow: "hidden", alignItems: "center" },
    wall: { ...StyleSheet.absoluteFill, backgroundColor: "#FFEBD2" },
    floor: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: s(120),
        backgroundColor: "#F8D9B0",
    },
    rug: {
        position: "absolute",
        bottom: s(14),
        width: "86%",
        height: s(80),
        borderRadius: s(80),
        backgroundColor: "#FFE7C8",
    },
    sofa: {
        position: "absolute",
        left: s(-10),
        bottom: s(100),
        width: s(96),
        height: s(96),
        borderRadius: s(18),
        backgroundColor: "#8FB06A",
    },
    plant: { position: "absolute", right: s(10), bottom: s(110) },
    frame: {
        position: "absolute",
        right: s(104),
        top: s(40),
        width: s(40),
        height: s(40),
        borderRadius: s(6),
        backgroundColor: C.white,
        borderWidth: 3,
        borderColor: "#C8895A",
        alignItems: "center",
        justifyContent: "center",
    },
    pet: { position: "absolute", bottom: s(12), width: s(230), height: s(230) },
    ball: { position: "absolute", left: s(18), bottom: s(34) },
    rope: { position: "absolute", right: s(24), bottom: s(30) },

    /* sheet */
    sheet: {
        backgroundColor: "#FFFCFA",
        borderTopLeftRadius: s(26),
        borderTopRightRadius: s(26),
        paddingHorizontal: SIDE,
        paddingTop: s(18),
        flexGrow: 1,
    },
    sheetTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        color: C.brown,
        textAlign: "center",
        marginBottom: s(12),
    },
    nextRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        padding: s(12),
        marginBottom: s(8),
        borderRadius: s(16),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    nextIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(12),
        alignItems: "center",
        justifyContent: "center",
    },
    nextTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), lineHeight: s(20), color: C.brown },
    nextSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), lineHeight: s(16), color: C.muted, marginTop: s(1) },

    /* PrimaryButton: Create Pet Avatar jaisa */
    buttonWrap: { marginTop: s(8) },
    primaryButton: {
        width: "100%",
        height: s(50),
        borderRadius: s(15),
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