import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ArcRing, C, IconBadge, LogCard, LogRow, Shell, Tabs, s } from "../components/TrackKit";

const PET_NAME = "Milo";
const SCORE = 85;

const BREAKDOWN = [
    { key: "nutrition", label: "Nutrition", v: 90 },
    { key: "hydration", label: "Hydration", v: 80 },
    { key: "activity", label: "Activity", v: 85 },
];

export default function CareScoreScreen() {
    return (
        <Shell title="Care Score" >
            <Tabs items={[{ label: "Your Score", active: false, color: C.orange }]} />

            <ArcRing progress={SCORE / 100}>
                <IconBadge>
                  <View style={styles.heartWrap}>
                    <Ionicons name="heart" size={s(50)} color={C.orange} />
                    <Image
                        source={require("../../assets/images/paw.png")}
                        resizeMode="contain"
                        style={[styles.heartPaw, { tintColor: C.white }]}
                    />
                  </View>
                </IconBadge>
                <Text style={styles.score} maxFontSizeMultiplier={1.1}>
                    {SCORE}
                    <Text style={styles.scoreTotal}> / 100</Text>
                </Text>
                <Text style={styles.great} maxFontSizeMultiplier={1.1}>
                    Great Care!
                </Text>
            </ArcRing>

            <LogCard title={`${PET_NAME} is happy and healthy !`}>
                {BREAKDOWN.map((b, i) => (
                    <LogRow key={b.key} title={b.label} value={`${b.v}/100`} last={i === BREAKDOWN.length - 1} />
                ))}
            </LogCard>

            <Text style={styles.note} maxFontSizeMultiplier={1.1}>
                Keep up the great work! Consistency leads to a happier , healthier pet.
            </Text>
        </Shell>
    );
}

const styles = StyleSheet.create({
    heartWrap: { alignItems: "center", justifyContent: "center" },
    heartPaw: { position: "absolute", width: s(20), height: s(20), marginTop: s(2) },
    score: { fontFamily: "Fredoka_600SemiBold", fontSize: s(38), lineHeight: s(46), color: C.brown },
    scoreTotal: { fontFamily: "Nunito_700Bold", fontSize: s(22), color: C.muted },
    great: { fontFamily: "Fredoka_600SemiBold", fontSize: s(22), color: C.orange, marginTop: s(2) },
    note: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(12),
        lineHeight: s(18),
        color: C.brown,
        textAlign: "center",
        marginTop: s(22),
        paddingHorizontal: s(10),
    },
});