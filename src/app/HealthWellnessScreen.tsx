import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C, KnowFrame, KnowItem, ListRow, s, SIDE } from "../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "issues", title: "Common Health Issues", sub: "Learn about breed specific issues", icon: "heart-plus", color: "#FF4B32", tint: "#FFE5E1", route: "/CommonHealthIssuesScreen" },
    { key: "vaccine", title: "Vaccination Guide", sub: "Stay updated on vaccines", icon: "needle", color: "#3B6FB6", tint: "#E6F0FA", route: "/VaccinationGuideScreen" },
    { key: "exercise", title: "Exercise Needs", sub: "How much exercise does Milo need?", icon: "run", color: "#FF7A00", tint: "#FFE9D6", route: "/ExerciseNeedsScreen" },
    { key: "mental", title: "Mental Wellness", sub: "Keep Milo's mind happy", icon: "brain", color: "#7A5CFF", tint: "#EFE9FF", route: "/MentalWellnessScreen" },
    { key: "signs", title: "Signs to Watch", sub: "Early signs of illness", icon: "magnify", color: "#E0502F", tint: "#FFE5E1", route: "/SignsToWatchScreen" },
    { key: "vet", title: "Vet Check-ups", sub: "Regular check-ups save lives", icon: "medical-bag", color: "#7A5CFF", tint: "#EFE9FF", route: "/VetCheckupsScreen" },
];

export default function HealthWellnessScreen() {
    return (
        <KnowFrame title="Health & Wellness">
            {/* glance card */}
            <View style={styles.glance}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.glanceTitle} maxFontSizeMultiplier={1.1}>
                        Milo's Health at a Glance
                    </Text>
                    <Text style={styles.glanceSub} maxFontSizeMultiplier={1.1}>
                        Keep up with regular care to keep Milo happy & healthy.
                    </Text>
                </View>
                <View style={styles.heartCircle}>
                    <MaterialCommunityIcons name="heart-pulse" size={s(46)} color={C.red} />
                </View>
            </View>

            {/* rows (har row alag card) */}
            <View style={styles.list}>
                {ITEMS.map((it) => (
                    <ListRow key={it.key} item={it} boxed />
                ))}
            </View>
        </KnowFrame>
    );
}

const styles = StyleSheet.create({
    glance: {
        marginHorizontal: SIDE,
        padding: s(16),
        borderRadius: s(20),
        backgroundColor: "#FFE9D2",
        borderWidth: 1,
        borderColor: C.peachBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
    },
    glanceTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(17), color: C.brown },
    glanceSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        marginTop: s(6),
    },
    heartCircle: {
        width: s(84),
        height: s(84),
        borderRadius: s(42),
        backgroundColor: "#FFD3B0",
        alignItems: "center",
        justifyContent: "center",
    },
    list: { marginHorizontal: SIDE, marginTop: s(14) },
});