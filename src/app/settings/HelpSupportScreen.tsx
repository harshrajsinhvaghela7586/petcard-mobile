import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

const SUPPORT_EMAIL = "info@petcard.in";
const SUPPORT_HOURS = "Mon - Sat, 10:00 AM - 6:00 PM";

type Row = {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value: string;
    onPress?: () => void;
};

const open = (url: string) => {
    Linking.openURL(url).catch(() => undefined);
};

export default function HelpSupportScreen() {
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const rows: Row[] = [
        {
            icon: "mail-outline",
            label: "Email Support",
            value: SUPPORT_EMAIL,
            onPress: () => open(`mailto:${SUPPORT_EMAIL}`),
        },
        {
            icon: "chatbubble-ellipses-outline",
            label: "Contact Us",
            value: "Send us a message or get in touch",
            onPress: () => router.push("/ContactusScreen" as any),
        },
        {
            icon: "time-outline",
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
                    <View style={styles.heroIconCircle}>
                        <Ionicons name="chatbubbles" size={s(32)} color={C.orange} />
                    </View>
                    <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1}>
                        How can we help?
                    </Text>
                    <Text style={styles.heroText} maxFontSizeMultiplier={1.1}>
                        Questions, feedback or a problem with the app? Reach out and we will get back to you.
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
                        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                        accessibilityRole={r.onPress ? "button" : "text"}
                        accessibilityLabel={`${r.label}: ${r.value}`}
                    >
                        <View style={styles.iconBox}>
                            <Ionicons name={r.icon} size={s(20)} color={C.orange} />
                        </View>
                        <View style={styles.rowTextWrap}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingHorizontal: SIDE, paddingBottom: s(130), paddingTop: s(6) },

    hero: {
        alignItems: "center",
        paddingVertical: s(22),
        paddingHorizontal: s(18),
        borderRadius: s(22),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    heroIconCircle: {
        width: s(64),
        height: s(64),
        borderRadius: s(32),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    heroTitle: {
        marginTop: s(12),
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
        opacity: 0.85,
    },

    heading: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(15),
        color: C.brown,
        marginTop: s(22),
        marginBottom: s(10),
        marginLeft: s(2),
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        paddingVertical: s(14),
        paddingHorizontal: s(14),
        marginBottom: s(10),
        borderRadius: s(16),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    rowPressed: { opacity: 0.7 },
    iconBox: {
        width: s(42),
        height: s(42),
        borderRadius: s(13),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    rowTextWrap: { flex: 1 },
    rowLabel: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowValue: {
        marginTop: s(2),
        fontFamily: "Nunito_400Regular",
        fontSize: s(12.5),
        lineHeight: s(17),
        color: C.brown,
        opacity: 0.8,
    },
});