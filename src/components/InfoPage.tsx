import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

export type InfoSection = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    intro?: string;
    points: string[];
};

type Props = {
    title: string;
    subtitle?: string;
    sections: InfoSection[];
};

/* Privacy & Terms dono isi layout ko use karte hain (sirf text pages) */
export default function InfoPage({ title, subtitle, sections }: Props) {
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title={title} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {subtitle ? (
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        {subtitle}
                    </Text>
                ) : null}

                {sections.map((sec) => (
                    <View key={sec.title} style={styles.card}>
                        <View style={styles.cardHead}>
                            <View style={styles.iconBox}>
                                <Ionicons name={sec.icon} size={s(20)} color={C.orange} />
                            </View>
                            <Text style={styles.cardTitle} maxFontSizeMultiplier={1.1}>
                                {sec.title}
                            </Text>
                        </View>

                        {sec.intro ? (
                            <Text style={styles.intro} maxFontSizeMultiplier={1.1}>
                                {sec.intro}
                            </Text>
                        ) : null}

                        {sec.points.map((p, i) => (
                            <View key={i} style={styles.point}>
                                <View style={styles.pointNo}>
                                    <Text style={styles.pointNoText}>
                                        {String(i + 1).padStart(2, "0")}
                                    </Text>
                                </View>
                                <Text style={styles.pointText} maxFontSizeMultiplier={1.1}>
                                    {p}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingHorizontal: SIDE, paddingBottom: s(40), paddingTop: s(4) },

    subtitle: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        textAlign: "center",
        marginBottom: s(14),
        paddingHorizontal: s(6),
    },

    card: {
        backgroundColor: "#FFFAF4",
        borderRadius: s(20),
        borderWidth: 1,
        borderColor: C.peachBorder,
        padding: s(14),
        marginBottom: s(14),
    },
    cardHead: { flexDirection: "row", alignItems: "center", gap: s(10) },
    iconBox: {
        width: s(38),
        height: s(38),
        borderRadius: s(12),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        flex: 1,
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(18),
        color: C.brown,
    },
    intro: {
        marginTop: s(10),
        fontFamily: "Nunito_400Regular",
        fontSize: s(12.5),
        lineHeight: s(18),
        color: C.brown,
        opacity: 0.85,
    },

    point: {
        flexDirection: "row",
        gap: s(10),
        marginTop: s(10),
        padding: s(10),
        borderRadius: s(12),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    pointNo: {
        width: s(24),
        height: s(24),
        borderRadius: s(12),
        backgroundColor: "#FFF0D6",
        alignItems: "center",
        justifyContent: "center",
    },
    pointNoText: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: C.orange },
    pointText: {
        flex: 1,
        fontFamily: "Nunito_400Regular",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
    },
});