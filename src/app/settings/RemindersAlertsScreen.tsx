import { appAlert } from "@/components/AppDialog";
import React, { useEffect, useState } from "react";
import {
    getReminderPrefs,
    saveReminderPrefs,
    TONES,
    previewTone,
    type ToneKey,
    type VibrateKey,
} from "@/services/reminderPrefs";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    useWindowDimensions,
    View,
    Vibration
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import { s } from "@/constants/scale";
import { petcardApi } from "@/services/petcardApi";
import PrimaryButton from "@/components/Button/PrimaryButton";

const C = {
    orange: "#FF7A00",
    brown: "#382018",
    muted: "#8F7365",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    card: "#FFFCFA",
    white: "#FFFFFF",
};

const PAW = require("../../../assets/images/paw.png");

const VIBRATE_OPTIONS = [
    { key: "off", label: "Off", pattern: 0 },
    { key: "default", label: "Default", pattern: 400 },
    { key: "short", label: "Short", pattern: 120 },
    { key: "long", label: "Long", pattern: 1000 },
] as const satisfies ReadonlyArray<{ key: VibrateKey; label: string; pattern: number }>;

/* ------------------------------------------------------------------
 * Small shared pieces (both popups use them, so they look the same)
 * ------------------------------------------------------------------ */
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function RadioOption({
    label,
    selected,
    onPress,
    icon,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
    icon?: IconName;
}) {
    return (
        <Pressable
            style={[styles.option, selected && styles.optionSelected]}
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
        >
            <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={styles.optionText} maxFontSizeMultiplier={1.1}>
                {label}
            </Text>
            {icon ? (
                <MaterialCommunityIcons name={icon} size={s(20)} color={selected ? C.orange : C.muted} />
            ) : null}
        </Pressable>
    );
}

function DialogFrame({
    visible,
    onClose,
    title,
    sub,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    title: string;
    sub: string;
    children: React.ReactNode;
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {/* Tap outside closes; taps inside the card do not. */}
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
                    <Image source={PAW} resizeMode="contain" style={styles.dialogPawTop} />
                    <Image source={PAW} resizeMode="contain" style={styles.dialogPawBottom} />

                    <Text style={styles.dialogTitle} maxFontSizeMultiplier={1.1}>{title}</Text>
                    <Text style={styles.dialogSub} maxFontSizeMultiplier={1.1}>{sub}</Text>

                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export default function RemindersAlertsScreen() {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    /* Mute is saved on the server (profile); tone and vibrate are saved on this device. */
    const [muted, setMuted] = useState(false);
    const [savingMute, setSavingMute] = useState(false);
    const [vibrate, setVibrate] = useState<VibrateKey>("default");
    const [vibrateOpen, setVibrateOpen] = useState(false);
    const [tone, setTone] = useState<ToneKey>("system");
    const [toneOpen, setToneOpen] = useState(false);

    useEffect(() => {
        let alive = true;
        petcardApi.getProfile().then(({ user }) => {
            if (alive) setMuted(user.notificationPrefs?.push === false);
        }).catch(() => undefined);
        getReminderPrefs().then((p) => {
            if (!alive) return;
            setTone(p.tone);
            setVibrate(p.vibrate);
        });
        return () => { alive = false; };
    }, []);

    const updateMute = async (nextMuted: boolean) => {
        if (savingMute) return;
        setSavingMute(true);
        try {
            await petcardApi.updateProfile({ notificationPrefs: { push: !nextMuted } });
            setMuted(nextMuted);
        } catch (error) {
            appAlert("Could not update reminders", error instanceof Error ? error.message : "Please try again.");
        } finally {
            setSavingMute(false);
        }
    };

    const pickTone = (key: ToneKey) => {
        setTone(key);
        void saveReminderPrefs({ tone: key });
        previewTone(key);
    };

    const pickVibrate = (key: VibrateKey) => {
        const option = VIBRATE_OPTIONS.find((o) => o.key === key);

        setVibrate(key);
        void saveReminderPrefs({ vibrate: key });
        setVibrateOpen(false);

        /* choose karte hi uska feel dikhao */
        Vibration.cancel();
        if (option && option.pattern > 0) Vibration.vibrate(option.pattern);
    };

    if (!fontsLoaded) return null;

    const vibrateLabel = VIBRATE_OPTIONS.find((o) => o.key === vibrate)?.label ?? "Default";
    const toneLabel = TONES.find((x) => x.key === tone)?.label ?? "System default";

    return (
        <View style={styles.container}>
            <Image source={PAW} resizeMode="contain" style={[styles.paw, styles.pawTopLeft]} />
            <Image source={PAW} resizeMode="contain" style={[styles.paw, styles.pawTopRight]} />
            <Image source={PAW} resizeMode="contain" style={[styles.paw, styles.pawBottomLeft]} />
            <Image source={PAW} resizeMode="contain" style={[styles.paw, styles.pawBottomRight]} />

            {/* ---------- TOP (back button) ---------- */}
            <View style={[styles.topBar, { paddingTop: insets.top + s(8) }]}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={s(26)} color={C.brown} />
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                    Reminders and Alerts
                </Text>
                <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                    Stay updated on your pet's care, tasks and important reminders.
                </Text>

                <View style={styles.hero}>
                    <Image
                        source={require("../../../assets/images/alerts/dog.png")}
                        resizeMode="contain"
                        style={styles.dog}
                    />
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText} maxFontSizeMultiplier={1.1}>
                            {"I'll keep you\nupdated!"}
                        </Text>
                    </View>
                </View>

                {/* ---------- SETTINGS ---------- */}
                <View style={styles.list}>
                    {/* MUTE */}
                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <MaterialCommunityIcons name="bell-ring" size={s(30)} color={C.orange} />
                        </View>
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1}>Mute</Text>
                            <Text style={styles.rowSub} maxFontSizeMultiplier={1.1}>
                                Turn off all reminders and alerts.
                            </Text>
                        </View>
                        <Switch
                            value={muted}
                            onValueChange={updateMute}
                            disabled={savingMute}
                            trackColor={{ false: "#E7D9CF", true: C.orange }}
                            thumbColor={C.white}
                        />
                    </View>

                    {/* NOTIFICATION TONE */}
                    <Pressable
                        style={[styles.row, muted && styles.rowDim]}
                        onPress={() => setToneOpen(true)}
                        accessibilityRole="button"
                        accessibilityLabel={`Notification tone, ${toneLabel}`}
                    >
                        <View style={styles.rowIcon}>
                            <MaterialCommunityIcons name="music-note" size={s(30)} color={C.orange} />
                        </View>
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1}>Notification tone</Text>
                            <Text style={styles.rowSub} maxFontSizeMultiplier={1.1}>{toneLabel}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={s(22)} color={C.brown} />
                    </Pressable>

                    {/* VIBRATE */}
                    <Pressable
                        style={[styles.row, muted && styles.rowDim]}
                        onPress={() => setVibrateOpen(true)}
                        accessibilityRole="button"
                        accessibilityLabel={`Vibrate, ${vibrateLabel}`}
                    >
                        <View style={styles.rowIcon}>
                            <MaterialCommunityIcons name="vibrate" size={s(30)} color={C.orange} />
                        </View>
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1}>Vibrate</Text>
                            <Text style={styles.rowSub} maxFontSizeMultiplier={1.1}>{vibrateLabel}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={s(22)} color={C.brown} />
                    </Pressable>
                </View>
            </ScrollView>

            {/* ---------- NOTIFICATION TONE POPUP ---------- */}
            <DialogFrame
                visible={toneOpen}
                onClose={() => setToneOpen(false)}
                title="Notification tone"
                sub="Tap a tone to hear it, then press Done."
            >
                {/* Scrolls on small screens so the Done button is never pushed off the card. */}
                <ScrollView
                    style={{ maxHeight: height * 0.42 }}
                    contentContainerStyle={styles.options}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    {TONES.map((o) => (
                        <RadioOption
                            key={o.key}
                            label={o.label}
                            selected={tone === o.key}
                            onPress={() => pickTone(o.key)}
                            icon={o.key === "system" ? "cellphone" : "volume-medium"}
                        />
                    ))}
                </ScrollView>

                <PrimaryButton
                    title="Done"
                    onPress={() => setToneOpen(false)}
                    style={{ alignSelf: "stretch", marginTop: s(16) }}
                />
            </DialogFrame>

            {/* ---------- VIBRATE POPUP ---------- */}
            <DialogFrame
                visible={vibrateOpen}
                onClose={() => setVibrateOpen(false)}
                title="Vibrate"
                sub="Choose how you want your phone to vibrate."
            >
                <View style={styles.options}>
                    {VIBRATE_OPTIONS.map((o) => (
                        <RadioOption
                            key={o.key}
                            label={o.label}
                            selected={o.key === vibrate}
                            onPress={() => pickVibrate(o.key)}
                        />
                    ))}
                </View>

                <Pressable
                    style={styles.cancel}
                    onPress={() => setVibrateOpen(false)}
                    accessibilityRole="button"
                >
                    <Text style={styles.cancelText} maxFontSizeMultiplier={1.1}>Cancel</Text>
                </Pressable>
            </DialogFrame>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    paw: { position: "absolute", width: s(70), height: s(70), opacity: 0.07 },
    pawTopLeft: { top: s(70), left: s(60), transform: [{ rotate: "-12deg" }] },
    pawTopRight: { top: s(190), right: s(8), transform: [{ rotate: "15deg" }] },
    pawBottomLeft: { bottom: s(30), left: s(12), transform: [{ rotate: "-8deg" }] },
    pawBottomRight: { bottom: s(10), right: s(14), transform: [{ rotate: "12deg" }] },

    topBar: { paddingHorizontal: s(14) },
    backButton: {
        width: s(40),
        height: s(40),
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        alignItems: "center",
        paddingHorizontal: s(18),
        paddingBottom: s(30),
    },
    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        color: C.brown,
        textAlign: "center",
    },
    subtitle: {
        marginTop: s(6),
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(20),
        color: C.brown,
        textAlign: "center",
    },

    hero: {
        width: "100%",
        height: s(170),
        marginTop: s(8),
        justifyContent: "center",
    },
    dog: {
        width: s(190),
        height: s(170),
        marginLeft: s(8),
    },
    bubble: {
        position: "absolute",
        right: s(6),
        top: s(24),
        paddingVertical: s(14),
        paddingHorizontal: s(18),
        borderTopLeftRadius: s(40),
        borderTopRightRadius: s(40),
        borderBottomRightRadius: s(40),
        borderBottomLeftRadius: s(10),
        backgroundColor: "#FFE3CC",
    },
    bubbleText: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(17),
        lineHeight: s(22),
        color: C.brown,
        textAlign: "center",
    },

    list: { width: "100%", marginTop: s(10), gap: s(14) },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(14),
        paddingHorizontal: s(14),
        borderRadius: s(18),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.08,
        shadowRadius: s(6),
        elevation: 2,
    },
    rowDim: { opacity: 0.6 },
    rowIcon: {
        width: s(54),
        height: s(54),
        borderRadius: s(14),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    rowText: { flex: 1, marginLeft: s(14), marginRight: s(8) },
    rowTitle: { fontFamily: "Nunito_700Bold", fontSize: s(17), color: C.brown },
    rowSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(2),
    },

    /* POPUPS (tone + vibrate) */
    overlay: {
        flex: 1,
        backgroundColor: "rgba(20, 8, 0, 0.45)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(20),
    },
    dialog: {
        width: "100%",
        maxWidth: 380,
        borderRadius: s(24),
        backgroundColor: "#FFFAF4",
        borderWidth: 1.5,
        borderColor: C.orange,
        paddingTop: s(20),
        paddingBottom: s(16),
        paddingHorizontal: s(16),
        overflow: "hidden",
    },
    dialogPawTop: {
        position: "absolute",
        top: s(8),
        right: s(10),
        width: s(48),
        height: s(48),
        opacity: 0.1,
    },
    dialogPawBottom: {
        position: "absolute",
        bottom: s(6),
        left: s(8),
        width: s(40),
        height: s(40),
        opacity: 0.1,
    },
    dialogTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        color: C.brown,
    },
    dialogSub: {
        marginTop: s(2),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),
        lineHeight: s(19),
        color: C.brown,
    },
    options: { marginTop: s(14), gap: s(8) },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(11),
        paddingHorizontal: s(12),
        borderRadius: s(12),
        backgroundColor: "#FFF3E8",
        borderWidth: 1,
        borderColor: "#FFE3CC",
    },
    optionSelected: { backgroundColor: C.peach, borderColor: C.orange },
    radio: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        borderWidth: 2,
        borderColor: "#B9A89C",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: C.white,
    },
    radioSelected: { borderColor: C.orange },
    radioDot: {
        width: s(11),
        height: s(11),
        borderRadius: s(6),
        backgroundColor: C.orange,
    },
    optionText: {
        flex: 1,
        marginLeft: s(12),
        fontFamily: "Nunito_700Bold",
        fontSize: s(16),
        color: C.brown,
    },
    cancel: {
        alignSelf: "flex-end",
        marginTop: s(16),
        paddingVertical: s(9),
        paddingHorizontal: s(24),
        borderRadius: s(20),
        backgroundColor: C.orange,
    },
    cancelText: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.white },
});