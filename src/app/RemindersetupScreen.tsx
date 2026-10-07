import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const SCALE = Math.min(
    width / DESIGN_WIDTH,
    height / DESIGN_HEIGHT
);

/* Same responsive helper as CoGuardianScreen */
const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

/* =========================================================
   DATA
   Icons abhi emoji hain. Apni images use karni ho to
   `emoji` ki jagah `image: require("...")` laga dena aur
   ReminderCard me <Image /> render kar dena.
========================================================= */

type ReminderItem = {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    enabled: boolean;
};

const INITIAL_REMINDERS: ReminderItem[] = [
    { id: "food", title: "Food Reminder", subtitle: "08:00 AM", emoji: "🥣", enabled: true },
    { id: "water", title: "Water Reminder", subtitle: "10:00 AM", emoji: "💧", enabled: true },
    { id: "walk", title: "Walk Reminder", subtitle: "06:00 PM", emoji: "🦮", enabled: true },
    { id: "medication", title: "Medication Reminder", subtitle: "08:00 PM", emoji: "💊", enabled: true },
    { id: "grooming", title: "Grooming Reminder", subtitle: "Every Sunday", emoji: "🪮", enabled: true },
    { id: "vet", title: "Vet / Health Reminder", subtitle: "Custom", emoji: "🛡️", enabled: false },
    { id: "potty", title: "Potty Reminder", subtitle: "09:00 AM", emoji: "💩", enabled: true },
    { id: "sleep", title: "Sleep Reminder", subtitle: "10:00 PM", emoji: "🌙", enabled: false },
];

export default function ReminderSetupScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    const [reminders, setReminders] =
        useState<ReminderItem[]>(INITIAL_REMINDERS);

    if (!fontsLoaded) {
        return null;
    }

    const handleToggle = (id: string) => {
        setReminders((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, enabled: !item.enabled }
                    : item
            )
        );
    };

    const handleContinue = () => {
        // Selected reminders yahan se mil jayenge
        const enabledReminders = reminders.filter((r) => r.enabled);
        console.log("Enabled reminders:", enabledReminders);

        // TODO: apni next screen ka route yahan daalo
        router.push("/HomeScreen");
    };

    const handleSkip = () => {
        console.log("Skip for now");
    };

    return (
        <View style={styles.container}>

            {/* ==============================
                BACKGROUND PAWS
            ============================== */}

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomLeft]}
            />

            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            {/* ==============================
                CONTENT
            ============================== */}

            <View style={styles.content}>

                {/* HEADER (same as CoGuardianScreen) */}

                <View style={styles.header}>

                    <Text
                        style={styles.title}
                        maxFontSizeMultiplier={1.1}
                    >
                        Let&apos;s Set Up Reminders!
                    </Text>

                    <Text
                        style={styles.subtitle}
                        maxFontSizeMultiplier={1.1}
                    >
                        Never miss any important care for your
                        pet. You can change these later.
                    </Text>

                </View>

                {/* ==============================
                    REMINDER LIST
                ============================== */}

                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {reminders.map((item) => (
                        <ReminderCard
                            key={item.id}
                            item={item}
                            onToggle={() => handleToggle(item.id)}
                        />
                    ))}
                </ScrollView>

            </View>

            {/* ==============================
                BOTTOM ACTIONS (same as CoGuardianScreen)
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

                </View>

                <Pressable
                    onPress={handleSkip}
                    style={styles.skipButton}
                >
                    <Text
                        style={styles.skipText}
                        maxFontSizeMultiplier={1.1}
                    >
                        Skip for now
                    </Text>
                </Pressable>

            </View>

        </View>
    );
}

/* =========================================================
   REMINDER CARD
========================================================= */

interface ReminderCardProps {
    item: ReminderItem;
    onToggle: () => void;
}

const ReminderCard = ({ item, onToggle }: ReminderCardProps) => {
    return (
        <View style={styles.reminderCard}>

            <View style={styles.iconBox}>
                <Text style={styles.iconEmoji}>{item.emoji}</Text>
            </View>

            <View style={styles.reminderTextWrapper}>
                <Text
                    style={styles.reminderTitle}
                    maxFontSizeMultiplier={1.1}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>

                <Text
                    style={styles.reminderSubtitle}
                    maxFontSizeMultiplier={1.1}
                    numberOfLines={1}
                >
                    {item.subtitle}
                </Text>
            </View>

            <Pressable
                onPress={onToggle}
                hitSlop={s(8)}
                accessibilityRole="switch"
                accessibilityLabel={item.title}
                accessibilityState={{ checked: item.enabled }}
                style={[
                    styles.toggleTrack,
                    item.enabled
                        ? styles.toggleTrackOn
                        : styles.toggleTrackOff,
                ]}
            >
                <View
                    style={[
                        styles.toggleKnob,
                        item.enabled
                            ? styles.toggleKnobOn
                            : styles.toggleKnobOff,
                    ]}
                />
            </Pressable>

        </View>
    );
};

/* =========================================================
   STYLES
========================================================= */

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
       HEADER (same as CoGuardianScreen)
    ============================== */

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

    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#381B0E",
        textAlign: "center",
    },

    /* ==============================
       LIST
    ============================== */

    list: {
        flex: 1,
        marginTop: s(18),
    },

    listContent: {
        paddingHorizontal: s(16),
        gap: s(9),
        // Bottom button ke peeche last card na chhupe
        paddingBottom: s(130),
    },

    reminderCard: {
        width: "100%",
        minHeight: s(58),

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#FFE0C4",
        borderRadius: s(11),

        backgroundColor: "#FFFAF4",

        paddingHorizontal: s(12),
        paddingVertical: s(7),
    },

    iconBox: {
        width: s(38),
        height: s(38),
        alignItems: "center",
        justifyContent: "center",
    },

    iconEmoji: {
        fontSize: s(26),
    },

    reminderTextWrapper: {
        flex: 1,
        marginLeft: s(12),
        justifyContent: "center",
    },

    reminderTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(19),
        color: "#381B0E",
    },

    reminderSubtitle: {
        marginTop: s(1),
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#6B554A",
    },

    /* ==============================
       TOGGLE
    ============================== */

    toggleTrack: {
        width: s(52),
        height: s(30),
        borderRadius: s(15),
        justifyContent: "center",
        paddingHorizontal: s(3),
    },

    toggleTrackOn: {
        backgroundColor: "#FF7A00",
    },

    toggleTrackOff: {
        backgroundColor: "#F0DFCF",
    },

    toggleKnob: {
        width: s(24),
        height: s(24),
        borderRadius: s(12),
        backgroundColor: "#FFFFFF",
    },

    toggleKnobOn: {
        alignSelf: "flex-end",
    },

    toggleKnobOff: {
        alignSelf: "flex-start",
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

    /* ==============================
       BOTTOM BUTTON (same as CoGuardianScreen)
    ============================== */

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

    skipButton: {
        height: s(34),

        alignItems: "center",
        justifyContent: "center",

        marginTop: s(1),
    },

    skipText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        fontWeight: "900",
        color: "#8B6D5C",
        textAlign: "center",
    },
});