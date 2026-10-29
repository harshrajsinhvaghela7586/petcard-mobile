import React from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";

/* TODO: real support number yahan daalna */
const SUPPORT_EMAIL = "info@petcard.in";
const SUPPORT_PHONE = "+91 00000 00000";
const SUPPORT_HOURS = "Mon - Sat, 10:00 AM - 6:00 PM";

export default function HelpSupportScreen() {
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const rows = [
        {
            icon: "mail-outline" as const,
            label: "Email Support",
            value: SUPPORT_EMAIL,
            onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`),
        },
        {
            icon: "call-outline" as const,
            label: "Call Support",
            value: SUPPORT_PHONE,
            onPress: () => Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`),
        },
        {
            icon: "time-outline" as const,
            label: "Support Hours",
            value: SUPPORT_HOURS,
        },
    ];

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Help & Support" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.hero}>
                    <Ionicons name="chatbubbles" size={s(34)} color={C.orange} />
                    <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1}>
                        How can we help?
                    </Text>
                    <Text style={styles.heroText} maxFontSizeMultiplier={1.1}>
                        Chat with our AI assistant for quick answers about your pet&apos;s
                        card, reminders, health records and more.
                    </Text>
                </View>

                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>
                    Contact us
                </Text>

                {rows.map((r) => (
                    <Pressable
                        key={r.label}
                        disabled={!r.onPress}
                        onPress={r.onPress}
                        style={styles.row}
                        accessibilityRole={r.onPress ? "button" : "text"}
                    >
                        <View style={styles.iconBox}>
                            <Ionicons name={r.icon} size={s(20)} color={C.orange} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowLabel} maxFontSizeMultiplier={1.1}>
                                {r.label}
                            </Text>
                            <Text style={styles.rowValue} maxFontSizeMultiplier={1.1}>
                                {r.value}
                            </Text>
                        </View>
                        {r.onPress ? (
                            <Ionicons name="chevron-forward" size={s(18)} color={C.brown} />
                        ) : null}
                    </Pressable>
                ))}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Chat with AI Assistant"
                        onPress={() => router.push("/AIChatScreen" as any)}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingHorizontal: SIDE, paddingBottom: s(130), paddingTop: s(6) },

    hero: {
        alignItems: "center",
        padding: s(18),
        borderRadius: s(20),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    heroTitle: {
        marginTop: s(8),
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        color: C.orange,
    },
    heroText: {
        marginTop: s(6),
        textAlign: "center",
        fontFamily: "Nunito_400Regular",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
    },

    heading: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
        marginTop: s(20),
        marginBottom: s(10),
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        padding: s(12),
        marginBottom: s(10),
        borderRadius: s(14),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    iconBox: {
        width: s(40),
        height: s(40),
        borderRadius: s(12),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    rowLabel: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowValue: {
        marginTop: s(1),
        fontFamily: "Nunito_400Regular",
        fontSize: s(12.5),
        color: C.brown,
        opacity: 0.8,
    },

    bottomContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: s(10),
        paddingBottom: s(27),
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },
    buttonWrapper: { width: "96%", maxWidth: 380, position: "relative", alignSelf: "center" },
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