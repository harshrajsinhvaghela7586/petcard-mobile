import React from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

/* same responsive helper as the reference (PetCardReady) screen */
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
export const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
export const s = (size: number) => size * UI_SCALE;

/* palette taken from the reference screen only */
export const C = {
    orange: "#FF7F00",
    brown: "#381B0E",
    muted: "#6B554A",
    card: "#FFF3E6",
    cardLight: "#FFFCF9",
    peach: "#FFE0C4",
    white: "#FFFFFF",
    blue: "#1E88FF",
    blueTrack: "#D9E9FA",
};

export const nowTime = () => {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${m} ${ap}`;
};

const polar = (cx: number, cy: number, r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const arcPath = (cx: number, cy: number, r: number, start: number, end: number) => {
    const p1 = polar(cx, cy, r, start);
    const p2 = polar(cx, cy, r, end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
};

/* ------------------------------------------------------------------
 * SHELL: fonts, bg paws, header, scroll, fixed PrimaryButton footer
 * ------------------------------------------------------------------ */
export function Shell({
    title,
    subtitle,
    footer,
    children,
}: {
    title: string;
    subtitle?: string;
    footer?: { title: string; onPress: () => void };
    children: React.ReactNode;
}) {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });
    if (!fontsLoaded) return null;

    return (
        <View style={st.container}>
            {/* BACKGROUND PAWS */}
            <Image source={require("../../assets/images/paw.png")} resizeMode="contain" style={[st.bgPaw, st.pawTopLeft]} />
            <Image source={require("../../assets/images/paw.png")} resizeMode="contain" style={[st.bgPaw, st.pawTopRight]} />
            <Image source={require("../../assets/images/paw.png")} resizeMode="contain" style={[st.bgPaw, st.pawBottomLeft]} />
            <Image source={require("../../assets/images/paw.png")} resizeMode="contain" style={[st.bgPaw, st.pawBottomRight]} />

            <View style={st.content}>
                <View style={st.header}>
                    <Text style={st.title} maxFontSizeMultiplier={1.1}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={st.subtitle} maxFontSizeMultiplier={1.1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[st.scrollContent, { paddingBottom: footer ? s(150) : s(40) }]}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {children}
                </ScrollView>
            </View>

            {footer ? (
                <View style={st.bottomSection}>
                    <View style={st.buttonWrapper}>
                        <PrimaryButton
                            title={footer.title}
                            onPress={footer.onPress}
                           
                        />
                    </View>
                    <View style={st.skipSpacer} />
                </View>
            ) : null}
        </View>
    );
}

/* ------------------------------------------------------------------
 * TABS
 * ------------------------------------------------------------------ */
export function Tabs({
    items,
}: {
    items: { label: string; active: boolean; color: string; onPress?: () => void }[];
}) {
    return (
        <View style={st.tabs}>
            {items.map((t) => (
                <Pressable
                    key={t.label}
                    onPress={t.onPress}
                    style={[st.tab, { backgroundColor: t.active ? t.color : C.peach }]}
                >
                    <Text style={[st.tabText, { color: t.active ? C.white : C.brown }]} maxFontSizeMultiplier={1.1}>
                        {t.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

/* ------------------------------------------------------------------
 * ARC RING  (270 = open gauge, 360 = full ring)
 * ------------------------------------------------------------------ */
export function ArcRing({
    progress,
    color = C.orange,
    track = C.peach,
    sweep = 270,
    stroke = 16,
    size,
    children,
}: {
    progress: number;
    color?: string;
    track?: string;
    sweep?: 270 | 360;
    stroke?: number;
    size?: number;
    children?: React.ReactNode;
}) {
    const SIZE = size ?? Math.min(width * 0.62, s(240));
    const sw = s(stroke);
    const r = (SIZE - sw) / 2;
    const c = SIZE / 2;
    const start = sweep === 360 ? -90 : 135;
    const full = sweep === 360 ? 359.99 : sweep;
    const p = Math.min(Math.max(progress, 0), 1);

    return (
        <View
            style={{
                width: SIZE,
                height: SIZE,
                alignItems: "center",
                justifyContent: "center",
                /* gauge rings (food / water / activity / care) get breathing room from the tabs above */
                marginTop: sweep === 270 ? s(26) : 0,
            }}
        >
            <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
                <Path
                    d={arcPath(c, c, r, start, start + full)}
                    stroke={track}
                    strokeWidth={sw}
                    strokeLinecap="round"
                    fill="none"
                />
                {p > 0 && (
                    <Path
                        d={arcPath(c, c, r, start, start + Math.max(full * p, 0.5))}
                        stroke={color}
                        strokeWidth={sw}
                        strokeLinecap="round"
                        fill="none"
                    />
                )}
            </Svg>
            {children}
        </View>
    );
}

export function BigValue({
    value,
    total,
    caption,
}: {
    value: string | number;
    total: string;
    caption: string;
}) {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={st.bigRow} maxFontSizeMultiplier={1.1}>
                {value}
                <Text style={st.bigTotal}> / {total}</Text>
            </Text>
            <Text style={st.bigCaption} maxFontSizeMultiplier={1.1}>
                {caption}
            </Text>
        </View>
    );
}

/* ------------------------------------------------------------------
 * LOG CARD
 * ------------------------------------------------------------------ */
export function LogCard({
    title,
    children,
    right,
    plain,
}: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
    plain?: boolean;
}) {
    return (
        <View style={[st.logCard, plain && st.logCardPlain]}>
            <View style={st.logHead}>
                <Text style={[st.logTitle, plain && { color: C.brown }]} maxFontSizeMultiplier={1.1}>
                    {title}
                </Text>
                {right}
            </View>
            {children}
        </View>
    );
}

export function LogRow({
    title,
    sub,
    value,
    last,
}: {
    title: string;
    sub?: string;
    value: string;
    last?: boolean;
}) {
    return (
        <View style={[st.logRow, !last && st.logRowBorder]}>
            <View style={{ flex: 1 }}>
                <Text style={st.logRowText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                    {title}
                </Text>
                {sub ? (
                    <Text style={st.logRowText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        {sub}
                    </Text>
                ) : null}
            </View>
            <Text style={st.logRowText} maxFontSizeMultiplier={1.1}>
                {value}
            </Text>
        </View>
    );
}

/* ------------------------------------------------------------------
 * ICON BADGE: round medallion with border, soft shadow and gloss
 * ------------------------------------------------------------------ */
export function IconBadge({
    children,
    size = 88,
    bg = C.card,
    border = C.orange,
    shadow = C.orange,
}: {
    children: React.ReactNode;
    size?: number;
    bg?: string;
    border?: string;
    shadow?: string;
}) {
    const S = s(size);
    return (
        <View
            style={{
                width: S,
                height: S,
                borderRadius: S / 2,
                backgroundColor: bg,
                borderWidth: s(3),
                borderColor: border,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: s(4),
                shadowColor: shadow,
                shadowOffset: { width: 0, height: s(5) },
                shadowOpacity: 0.3,
                shadowRadius: s(8),
                elevation: 6,
            }}
        >
            <View
                style={{
                    position: "absolute",
                    top: S * 0.08,
                    left: S * 0.16,
                    right: S * 0.16,
                    height: S * 0.26,
                    borderRadius: S,
                    backgroundColor: "rgba(255,255,255,0.6)",
                }}
            />
            {children}
        </View>
    );
}

const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.white, overflow: "hidden" },
    content: { flex: 1, paddingTop: height * 0.112 },

    /* HEADER (identical to the reference screens) */
    header: { alignItems: "center", paddingHorizontal: s(5) },
    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(36),
        textAlign: "center",
        letterSpacing: 0,
    },
    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: C.brown,
        textAlign: "center",
    },

    scrollContent: { paddingHorizontal: s(16), alignItems: "center", paddingTop: s(18) },

    tabs: { flexDirection: "row", gap: s(12), marginTop: s(10) },
    tab: {
        minWidth: s(120),
        height: s(34),
        paddingHorizontal: s(14),
        borderRadius: s(8),
        borderWidth: 1,
        borderColor: C.brown,
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: { fontFamily: "Nunito_700Bold", fontSize: s(14) },

    bigRow: { fontFamily: "Fredoka_600SemiBold", fontSize: s(38), lineHeight: s(46), color: C.brown },
    bigTotal: { fontFamily: "Nunito_700Bold", fontSize: s(22), color: C.muted },
    bigCaption: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.muted, marginTop: s(1) },

    logCard: {
        width: "100%",
        marginTop: s(20),
        paddingHorizontal: s(14),
        paddingTop: s(10),
        paddingBottom: s(6),
        borderRadius: s(16),
        borderWidth: 1,
        borderColor: C.orange,
        backgroundColor: C.peach,
    },
    logCardPlain: { backgroundColor: C.card },
    logHead: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: s(6),
    },
    logTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(17), color: C.orange },
    logRow: { flexDirection: "row", alignItems: "center", paddingVertical: s(8) },
    logRowBorder: { borderBottomWidth: 1, borderBottomColor: C.white },
    logRowText: { fontFamily: "Nunito_700Bold", fontSize: s(14), lineHeight: s(19), color: C.brown },

    /* BACKGROUND PAWS (same as reference) */
    bgPaw: { position: "absolute", width: 72 * SCALE, height: 72 * SCALE, opacity: 0.075, zIndex: 0 },
    pawTopLeft: { top: 40 * SCALE, left: 24 * SCALE, transform: [{ rotate: "-12deg" }] },
    pawTopRight: { top: 160 * SCALE, right: 17 * SCALE, transform: [{ rotate: "15deg" }] },
    pawBottomLeft: { bottom: 105 * SCALE, left: 16 * SCALE, transform: [{ rotate: "12deg" }] },
    pawBottomRight: { bottom: 20 * SCALE, right: 20 * SCALE, transform: [{ rotate: "-12deg" }] },

    /* BOTTOM BUTTON (same as reference) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: height * 0.014,
        backgroundColor: C.white,
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
    skipSpacer: { height: s(34), marginTop: s(1) },
});