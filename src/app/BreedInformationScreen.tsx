import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { C, Decor, Hero, HeroPet, KnowFrame, s, SIDE } from "../components/KnowKit";

/* Yaha se breed ka data change kar sakte ho */
const BREED = {
    name: "Golden Retriever",
    about:
        "Golden Retrievers are friendly, intelligent, and loyal dogs. They are known for their gentle nature and make excellent family companions.",
    facts: [
        { key: "origin", label: "Origin", value: "Scotland", icon: "crown-outline" },
        { key: "size", label: "Size", value: "Large", icon: "paw" },
        { key: "life", label: "Lifespan", value: "10 – 12 years", icon: "clock-outline" },
        { key: "temp", label: "Temperament", value: "Friendly, Intelligent, Confident", icon: "emoticon-happy-outline" },
    ],
    didYouKnow: "Golden Retrievers were originally bred to retrieve game during hunting!",
};

export default function BreedInformationScreen() {
    return (
        <KnowFrame
            title="Breed Information"
            right={<Ionicons name="ellipsis-vertical" size={s(20)} color={C.brown} />}
        >
            <Hero heroHeight={170}>
                <Decor name="paw" size={34} color="#FFD3A8" style={{ top: s(14), left: s(18) }} />
                <Decor name="paw" size={30} color="#FFD3A8" style={{ top: s(60), right: s(24) }} />
                <Decor name="paw" size={26} color="#FFD3A8" style={{ bottom: s(24), left: s(40) }} />
                <HeroPet size={170} style={{ bottom: s(-4) }} />
                <View style={styles.chip}>
                    <Text style={styles.chipText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        {BREED.name}
                    </Text>
                </View>
            </Hero>

            {/* ABOUT */}
            <View style={[styles.card, styles.aboutCard]}>
                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>
                    About {BREED.name}s
                </Text>
                <Text style={styles.body} maxFontSizeMultiplier={1.1}>
                    {BREED.about}
                </Text>

                <View style={styles.facts}>
                    {BREED.facts.map((f) => (
                        <View key={f.key} style={styles.fact}>
                            <View style={styles.factIcon}>
                                <MaterialCommunityIcons name={f.icon as any} size={s(16)} color={C.orange} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.factLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {f.label}
                                </Text>
                                <Text style={styles.factValue} maxFontSizeMultiplier={1.1}>
                                    {f.value}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* DID YOU KNOW */}
            <View style={[styles.card, styles.knowCard]}>
                <Text style={styles.knowTitle} maxFontSizeMultiplier={1.1}>
                    Did You Know? 💡
                </Text>
                <Text style={styles.body} maxFontSizeMultiplier={1.1}>
                    {BREED.didYouKnow}
                </Text>
            </View>
        </KnowFrame>
    );
}

const styles = StyleSheet.create({
    chip: {
        position: "absolute",
        right: s(12),
        bottom: s(12),
        backgroundColor: C.orange,
        paddingHorizontal: s(14),
        paddingVertical: s(7),
        borderRadius: s(16),
    },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.white },
    card: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(18),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.08,
        shadowRadius: s(6),
        elevation: 2,
    },
    aboutCard: { marginHorizontal: SIDE, marginTop: s(12), padding: s(14) },
    heading: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown },
    body: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(20),
        color: C.brown,
        marginTop: s(6),
    },
    facts: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: s(14),
        marginTop: s(14),
        paddingTop: s(14),
        borderTopWidth: 1,
        borderTopColor: C.divider,
    },
    fact: { width: "48%", flexDirection: "row", gap: s(8) },
    factIcon: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    factLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    factValue: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        lineHeight: s(16),
        color: C.muted,
        marginTop: s(2),
    },
    knowCard: { marginHorizontal: SIDE, marginTop: s(12), padding: s(14), backgroundColor: "#FFF3E3" },
    knowTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(15), color: C.brown },
});