import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { C, Decor, Hero, HeroPet, KnowFrame, s, SIDE } from "./KnowKit";

/* ------------------------------------------------------------------
 * TYPES  (har page bas ek SECTIONS array deta hai)
 * ------------------------------------------------------------------ */
export type Fact = { label: string; value: string; icon: string };
export type Item = { title: string; text?: string; icon?: string };
export type Step = { tag: string; title: string; text?: string };

export type Section =
    /* heading + paragraph + (optional) 2x2 facts grid  — Breed page jaisa */
    | { type: "about"; heading: string; body: string; facts?: Fact[] }
    /* icon wali list. tone: good (green) / warn (orange) / danger (red) */
    | { type: "list"; heading: string; intro?: string; items: Item[]; tone?: "good" | "warn" | "danger" }
    /* vertical timeline (age / steps) */
    | { type: "timeline"; heading: string; intro?: string; steps: Step[] }
    /* "Did You Know?" jaisa tinted card, optional button */
    | { type: "tip"; title: string; body: string; action?: { label: string; route: string } };

const TONES = {
    good: { icon: "check-circle-outline", color: "#5E9B2D", tint: "#EAF3DC" },
    warn: { icon: "alert-outline", color: "#E08A00", tint: "#FFF0D6" },
    danger: { icon: "alert-circle-outline", color: "#FF4B32", tint: "#FFE5E1" },
} as const;

interface Props {
    title: string;
    chip: string;
    sections: Section[];
    footer?: string;
}

const DEFAULT_FOOTER =
    "General guidance only. Please consult your vet for Milo's specific needs.";

/* ------------------------------------------------------------------
 * PAGE
 * ------------------------------------------------------------------ */
export default function KnowGuide({ title, chip, sections, footer = DEFAULT_FOOTER }: Props) {
    return (
        <KnowFrame title={title}>
            <Hero heroHeight={170}>
                <Decor name="paw" size={34} color="#FFD3A8" style={{ top: s(14), left: s(18) }} />
                <Decor name="paw" size={30} color="#FFD3A8" style={{ top: s(60), right: s(24) }} />
                <Decor name="paw" size={26} color="#FFD3A8" style={{ bottom: s(24), left: s(40) }} />
                <HeroPet size={170} style={{ bottom: s(-4) }} />
                <View style={styles.chip}>
                    <Text style={styles.chipText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        {chip}
                    </Text>
                </View>
            </Hero>

            {sections.map((sec, i) => {
                switch (sec.type) {
                    case "about":
                        return (
                            <View key={i} style={[styles.card, styles.block]}>
                                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>{sec.heading}</Text>
                                <Text style={styles.body} maxFontSizeMultiplier={1.1}>{sec.body}</Text>

                                {sec.facts ? (
                                    <View style={styles.facts}>
                                        {sec.facts.map((f) => (
                                            <View key={f.label} style={styles.fact}>
                                                <View style={styles.factIcon}>
                                                    <MaterialCommunityIcons name={f.icon as any} size={s(16)} color={C.orange} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.factLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                        {f.label}
                                                    </Text>
                                                    <Text style={styles.factValue} maxFontSizeMultiplier={1.1}>{f.value}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        );

                    case "list": {
                        const tone = TONES[sec.tone ?? "good"];
                        return (
                            <View key={i} style={[styles.card, styles.block]}>
                                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>{sec.heading}</Text>
                                {sec.intro ? (
                                    <Text style={styles.body} maxFontSizeMultiplier={1.1}>{sec.intro}</Text>
                                ) : null}

                                <View style={{ marginTop: s(8) }}>
                                    {sec.items.map((it, idx) => (
                                        <View key={it.title} style={[styles.item, idx > 0 && styles.itemBorder]}>
                                            <View style={[styles.itemIcon, { backgroundColor: tone.tint }]}>
                                                <MaterialCommunityIcons
                                                    name={(it.icon ?? tone.icon) as any}
                                                    size={s(16)}
                                                    color={tone.color}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.itemTitle} maxFontSizeMultiplier={1.1}>{it.title}</Text>
                                                {it.text ? (
                                                    <Text style={styles.itemText} maxFontSizeMultiplier={1.1}>{it.text}</Text>
                                                ) : null}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    }

                    case "timeline":
                        return (
                            <View key={i} style={[styles.card, styles.block]}>
                                <Text style={styles.heading} maxFontSizeMultiplier={1.1}>{sec.heading}</Text>
                                {sec.intro ? (
                                    <Text style={styles.body} maxFontSizeMultiplier={1.1}>{sec.intro}</Text>
                                ) : null}

                                <View style={{ marginTop: s(12) }}>
                                    {sec.steps.map((st, idx) => {
                                        const last = idx === sec.steps.length - 1;
                                        return (
                                            <View key={st.tag + st.title} style={styles.step}>
                                                <View style={styles.rail}>
                                                    <View style={styles.dot} />
                                                    {!last ? <View style={styles.line} /> : null}
                                                </View>
                                                <View style={[styles.stepBody, !last && { paddingBottom: s(14) }]}>
                                                    <Text style={styles.stepTag} maxFontSizeMultiplier={1.1}>{st.tag}</Text>
                                                    <Text style={styles.itemTitle} maxFontSizeMultiplier={1.1}>{st.title}</Text>
                                                    {st.text ? (
                                                        <Text style={styles.itemText} maxFontSizeMultiplier={1.1}>{st.text}</Text>
                                                    ) : null}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );

                    case "tip":
                        return (
                            <View key={i} style={[styles.card, styles.block, styles.tip]}>
                                <Text style={styles.tipTitle} maxFontSizeMultiplier={1.1}>{sec.title}</Text>
                                <Text style={styles.body} maxFontSizeMultiplier={1.1}>{sec.body}</Text>

                                {sec.action ? (
                                    <Pressable
                                        style={styles.action}
                                        onPress={() => router.push(sec.action!.route as any)}
                                    >
                                        <Text style={styles.actionText} maxFontSizeMultiplier={1.1}>
                                            {sec.action.label}
                                        </Text>
                                        <Ionicons name="chevron-forward" size={s(14)} color={C.white} />
                                    </Pressable>
                                ) : null}
                            </View>
                        );
                }
            })}

            {footer ? (
                <Text style={styles.footer} maxFontSizeMultiplier={1.1}>{footer}</Text>
            ) : null}
        </KnowFrame>
    );
}

/* ------------------------------------------------------------------
 * STYLES  (BreedInformationScreen ke saath same look)
 * ------------------------------------------------------------------ */
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
    block: { marginHorizontal: SIDE, marginTop: s(12), padding: s(14) },

    heading: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown },
    body: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(20),
        color: C.brown,
        marginTop: s(6),
    },

    /* facts grid */
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

    /* list items */
    item: { flexDirection: "row", gap: s(10), paddingVertical: s(10) },
    itemBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    itemIcon: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        alignItems: "center",
        justifyContent: "center",
    },
    itemTitle: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    itemText: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        lineHeight: s(18),
        color: C.muted,
        marginTop: s(2),
    },

    /* timeline */
    step: { flexDirection: "row", gap: s(12) },
    rail: { width: s(14), alignItems: "center" },
    dot: {
        width: s(12),
        height: s(12),
        borderRadius: s(6),
        backgroundColor: C.orange,
        marginTop: s(3),
    },
    line: { flex: 1, width: 2, backgroundColor: C.peach, marginTop: s(2) },
    stepBody: { flex: 1 },
    stepTag: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange, marginBottom: s(2) },

    /* tip card */
    tip: { backgroundColor: "#FFF3E3" },
    tipTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(15), color: C.brown },
    action: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
        marginTop: s(12),
        paddingHorizontal: s(14),
        paddingVertical: s(8),
        borderRadius: s(14),
        backgroundColor: C.orange,
    },
    actionText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.white },

    footer: {
        textAlign: "center",
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(11),
        lineHeight: s(16),
        color: C.muted,
        marginHorizontal: SIDE + s(10),
        marginTop: s(14),
        marginBottom: s(8),
    },
});