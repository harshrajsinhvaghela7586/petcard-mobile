import React, { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { petcardApi, type KnowMenuData } from "@/services/petcardApi";
import { C, Decor, Hero, HeroPet, KnowFrame, KnowItem, ListCard, ListRow, TipCard, s, SIDE, useKnowPet } from "./KnowKit";

export type DecorSpec = { name: string; size: number; color: string; pos: ViewStyle };

export type KnowMenuConfig = {
    menuKey: "health_wellness" | "food_nutrition" | "grooming" | "safety" | "training" | "basic_care";
    title: string;
    tint: string;
    /* Fallback texts, used until the server answers or if it fails. "Milo" becomes the pet's name. */
    chip: string;
    heroTitle: string;
    heroSub: string;
    heading: string;
    sub?: string;
    headingColor?: string;
    tip?: { title: string; text: string; titleColor?: string };
    items: KnowItem[];
    decor: DecorSpec[];
    /* true -> heading card + each row in its own card (Health screen) */
    boxed?: boolean;
    headingIcon?: string;
};

const cache = new Map<string, KnowMenuData>();

function Body(cfg: KnowMenuConfig) {
    const pet = useKnowPet();
    const petName = pet?.name || "your pet";
    const key = `${cfg.menuKey}|${pet?.id}|${pet?.type}|${pet?.breed}`;
    const [data, setData] = useState<KnowMenuData | null>(cache.get(key) ?? null);

    useEffect(() => {
        /* Always start from this pet's cached text (or none), never the previous pet's text. */
        const hit = cache.get(key);
        setData(hit ?? null);
        if (!pet?.id || hit) return;
        let alive = true;
        petcardApi.knowMenu(pet.id, cfg.menuKey)
            .then((r) => { cache.set(key, r.menu); if (alive) setData(r.menu); })
            .catch(() => undefined);
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const fix = (t?: string) => (t ? t.replace(/Milo/g, petName) : "");
    const byKey = new Map((data?.items ?? []).map((i) => [i.key, i]));
    const items: KnowItem[] = cfg.items.map((it) => ({
        ...it,
        title: fix(byKey.get(it.key)?.title ?? it.title),
        sub: fix(byKey.get(it.key)?.sub ?? it.sub),
    }));

    const chip = fix(data?.chip || cfg.chip);
    const heroTitle = fix(data?.heroTitle || cfg.heroTitle);
    const heroSub = fix(data?.heroSub || cfg.heroSub);
    const heading = fix(data?.heading || cfg.heading);
    const sub = fix(data?.sub || cfg.sub);
    const tip = data?.tip ?? cfg.tip;

    return (
        <>
            <Hero tint={cfg.tint} heroHeight={176}>
                {cfg.decor.map((d, i) => (
                    <Decor key={i} name={d.name} size={d.size} color={d.color} style={d.pos} />
                ))}

                <View style={styles.heroText}>
                    <View style={styles.chip}>
                        <Text style={styles.chipText} maxFontSizeMultiplier={1.1} numberOfLines={1}>{chip}</Text>
                    </View>
                    <Text style={styles.heroTitle} maxFontSizeMultiplier={1.1} numberOfLines={3}>{heroTitle}</Text>
                    <Text style={styles.heroSub} maxFontSizeMultiplier={1.1} numberOfLines={4}>{heroSub}</Text>
                </View>

                <HeroPet size={150} style={{ right: s(4), bottom: s(-6) }} />
            </Hero>

            {cfg.boxed ? (
                <>
                    <View style={styles.glance}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.glanceTitle} maxFontSizeMultiplier={1.1}>{heading}</Text>
                            {sub ? <Text style={styles.glanceSub} maxFontSizeMultiplier={1.1}>{sub}</Text> : null}
                        </View>
                        <View style={styles.glanceCircle}>
                            <MaterialCommunityIcons name={(cfg.headingIcon ?? "heart-pulse") as any} size={s(40)} color={C.red} />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: SIDE, marginTop: s(14) }}>
                        {items.map((it) => (
                            <ListRow key={it.key} item={it} boxed />
                        ))}
                    </View>
                </>
            ) : (
                <ListCard heading={heading} headingColor={cfg.headingColor} sub={sub || undefined} items={items} />
            )}

            {tip ? (
                <TipCard
                    title={fix(tip.title)}
                    titleColor={cfg.tip?.titleColor ?? C.brown}
                    text={fix(tip.text)}
                />
            ) : null}
        </>
    );
}

export default function KnowMenuPage(cfg: KnowMenuConfig) {
    return (
        <KnowFrame title={cfg.title}>
            <Body {...cfg} />
        </KnowFrame>
    );
}

const styles = StyleSheet.create({
    heroText: {
        position: "absolute",
        left: s(16),
        top: s(14),
        bottom: s(14),
        width: "54%",
        justifyContent: "center",
    },
    chip: {
        alignSelf: "flex-start",
        backgroundColor: C.orange,
        paddingHorizontal: s(10),
        paddingVertical: s(4),
        borderRadius: s(12),
        marginBottom: s(8),
    },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.white },
    heroTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), lineHeight: s(25), color: C.brown },
    heroSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), lineHeight: s(17), color: C.brown, marginTop: s(5) },

    glance: {
        marginHorizontal: SIDE,
        marginTop: s(12),
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
    glanceSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), lineHeight: s(19), color: C.brown, marginTop: s(6) },
    glanceCircle: {
        width: s(70),
        height: s(70),
        borderRadius: s(35),
        backgroundColor: "#FFD3B0",
        alignItems: "center",
        justifyContent: "center",
    },
});