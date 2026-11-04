import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ExpoLinking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import PrimaryButton from "@/components/Button/PrimaryButton";
import ScreenHeader, { C, PawBackground, SIDE, cardStyle, s, useAppFonts } from "@/components/SectionHeader";
import { petcardApi } from "@/services/petcardApi";

/* Referrer ko milne wale points (backend: 200). API se aaye to wahi dikhega. */
const DEFAULT_YOU_GET = 200;
const CACHE_KEY = "petcard.referralCode.v1";

const STEPS = [
    { n: 1, icon: "share-variant", title: "Share", sub: "Send your referral code or link to your friends" },
    { n: 2, icon: "account", title: "They sign up", sub: "Your friend creates an account on PetCard" },
    { n: 3, icon: "gift", title: "You earn", sub: "Get PawPoints after they finish pet setup" },
] as const;

export default function ReferFriendScreen() {
    const [fontsLoaded] = useAppFonts();
    const [code, setCode] = useState("");
    const [youGet, setYouGet] = useState(DEFAULT_YOU_GET);
    const [invited, setInvited] = useState(0);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [copied, setCopied] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setFailed(false);
        try {
            const data = await petcardApi.getReferral();
            setCode(data.code ?? "");
            setYouGet(data.rewards?.youGet ?? DEFAULT_YOU_GET);
            setInvited(data.invitedCount ?? 0);
            if (data.code) SecureStore.setItemAsync(CACHE_KEY, data.code).catch(() => {});
        } catch {
            /* API fail: pichhla saved code dikhao (kisi aur ka data kabhi nahi). */
            const cached = await SecureStore.getItemAsync(CACHE_KEY).catch(() => null);
            if (cached) setCode(cached);
            else setFailed(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    if (!fontsLoaded) return null;

    const link = code ? ExpoLinking.createURL("signup", { queryParams: { ref: code } }) : "";
    const message = `Join me on PetCard! Use my referral code ${code} when you sign up and keep your pet safe.${link ? `\n${link}` : ""}`;

    const copyCode = async () => {
        if (!code) return;
        try {
            await Clipboard.setStringAsync(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch { /* clipboard unavailable */ }
    };
    const copyLink = async () => {
        if (!code) return;
        try { await Clipboard.setStringAsync(link || code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
    };
    const systemShare = () => { if (code) void Share.share({ message }).catch(() => {}); };
    const openApp = async (url: string) => {
        if (!code) return;
        try { await Linking.openURL(url); } catch { systemShare(); }
    };

    const channels = [
        { key: "wa", label: "WhatsApp", bg: "#25D366", icon: "whatsapp", onPress: () => openApp(`whatsapp://send?text=${encodeURIComponent(message)}`) },
        { key: "ig", label: "Instagram", bg: "#D6249F", icon: "instagram", onPress: () => openApp("instagram://app") },
        { key: "link", label: copied ? "Copied!" : "Copy Link", bg: C.peach, icon: "link-variant", dark: true, onPress: copyLink },
        { key: "more", label: "More", bg: C.peach, icon: "dots-horizontal", dark: true, onPress: systemShare },
    ] as const;

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Refer a Friend" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* HERO */}
                <View style={styles.hero}>
                    <View style={styles.heroText}>
                        <Text style={styles.headline} maxFontSizeMultiplier={1.1}>Good things{"\n"}are better</Text>
                        <Text style={[styles.headline, { color: C.orange }]} maxFontSizeMultiplier={1.1}>together!</Text>
                        <Text style={styles.sub} maxFontSizeMultiplier={1.1}>
                            Share PetCard with your friends and help more pets stay safe, recognised and home.
                        </Text>
                    </View>
                    <View style={styles.heroArt}>
                        <View style={styles.blob} />
                        <Image source={require("../../../assets/images/pets/huchiko.png")} resizeMode="contain" style={styles.petA} />
                        <Image source={require("../../../assets/images/pets/kiki.png")} resizeMode="contain" style={styles.petB} />
                    </View>
                </View>

                {/* CODE + SHARE */}
                <View style={[cardStyle, styles.card]}>
                    <Text style={styles.cardLabel} maxFontSizeMultiplier={1.1}>Your Referral Code</Text>
                    <View style={styles.codeRow}>
                        {loading ? (
                            <ActivityIndicator color={C.orange} />
                        ) : failed ? (
                            <Pressable onPress={load} style={styles.retry}>
                                <Ionicons name="refresh" size={s(16)} color={C.orange} />
                                <Text style={styles.retryText}>Couldn't load. Tap to retry</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Text style={styles.code} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>{code}</Text>
                                <Pressable onPress={copyCode} style={styles.copyBtn} hitSlop={8}>
                                    <MaterialCommunityIcons name={copied ? "check" : "content-copy"} size={s(16)} color={C.orange} />
                                    <Text style={styles.copyText} maxFontSizeMultiplier={1.1}>{copied ? "Copied" : "Copy"}</Text>
                                </Pressable>
                            </>
                        )}
                    </View>

                    <PrimaryButton
                        title="Share PetCard"
                        onPress={systemShare}
                        disabled={!code}
                        style={{ marginTop: s(12) }}
                        icon={<Ionicons name="arrow-redo-outline" size={s(18)} color="#fff" />}
                    />

                    <View style={styles.channels}>
                        {channels.map((c) => (
                            <Pressable key={c.key} onPress={c.onPress} disabled={!code} style={styles.channel}>
                                <View style={[styles.channelIcon, { backgroundColor: c.bg }]}>
                                    <MaterialCommunityIcons name={c.icon as any} size={s(24)} color={"dark" in c && c.dark ? C.brown : C.white} />
                                </View>
                                <Text style={styles.channelLabel} numberOfLines={1} maxFontSizeMultiplier={1.1}>{c.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* REWARDS */}
                <View style={[cardStyle, styles.card, { backgroundColor: "#FFF3E6" }]}>
                    <Text style={styles.cardTitle} maxFontSizeMultiplier={1.1}>Earn rewards for every friend!</Text>
                    <View style={styles.rewardRow}>
                        <View style={styles.rewardBox}>
                            <Image source={require("../../../assets/images/rewards/pawcoin.png")} resizeMode="contain" style={styles.coin} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rewardValue} maxFontSizeMultiplier={1.1}>+{youGet}</Text>
                                <Text style={styles.rewardSub} maxFontSizeMultiplier={1.1}>PawPoints for you</Text>
                            </View>
                        </View>
                        <View style={styles.rewardBox}>
                            <View style={styles.giftCircle}>
                                <MaterialCommunityIcons name="gift-outline" size={s(24)} color={C.red} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rewardValue} maxFontSizeMultiplier={1.1}>{invited}</Text>
                                <Text style={styles.rewardSub} maxFontSizeMultiplier={1.1}>friends invited</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* HOW IT WORKS */}
                <View style={[cardStyle, styles.card]}>
                    <Text style={styles.cardTitle} maxFontSizeMultiplier={1.1}>How it works</Text>
                    <View style={styles.steps}>
                        {STEPS.map((st) => (
                            <View key={st.n} style={styles.step}>
                                <View style={styles.stepIcon}>
                                    <MaterialCommunityIcons name={st.icon as any} size={s(24)} color={C.orange} />
                                    <View style={styles.stepNum}><Text style={styles.stepNumText}>{st.n}</Text></View>
                                </View>
                                <Text style={styles.stepTitle} maxFontSizeMultiplier={1.1}>{st.title}</Text>
                                <Text style={styles.stepSub} maxFontSizeMultiplier={1.1}>{st.sub}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.white },
    scroll: { paddingHorizontal: SIDE, paddingBottom: s(32) },

    hero: { flexDirection: "row", alignItems: "center", marginTop: s(4) },
    heroText: { flex: 1.1, paddingRight: s(4) },
    headline: { fontFamily: "Fredoka_600SemiBold", fontSize: s(27), lineHeight: s(33), color: C.brown },
    sub: { marginTop: s(8), fontFamily: "Nunito_600SemiBold", fontSize: s(12.5), lineHeight: s(18), color: C.muted },
    heroArt: { flex: 1, height: s(170), alignItems: "center", justifyContent: "center" },
    blob: { position: "absolute", width: s(160), height: s(160), borderRadius: s(80), backgroundColor: "#FFF0DD" },
    petA: { position: "absolute", right: s(0), bottom: s(8), width: s(100), height: s(120) },
    petB: { position: "absolute", left: s(-4), bottom: s(6), width: s(78), height: s(96) },

    card: { marginTop: s(14), padding: s(14) },
    cardLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    cardTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(17), color: C.brown },

    codeRow: {
        marginTop: s(8), height: s(52), borderRadius: s(14), backgroundColor: "#FFF3E6",
        flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: s(12),
    },
    code: { flex: 1, textAlign: "center", fontFamily: "Fredoka_600SemiBold", fontSize: s(22), letterSpacing: 2, color: C.brown },
    copyBtn: { flexDirection: "row", alignItems: "center", gap: s(4) },
    copyText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },
    retry: { flexDirection: "row", alignItems: "center", gap: s(6) },
    retryText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },

    channels: {
        flexDirection: "row", justifyContent: "space-between", marginTop: s(14), paddingVertical: s(12),
        borderRadius: s(14), borderWidth: 1, borderColor: C.divider,
    },
    channel: { flex: 1, alignItems: "center" },
    channelIcon: { width: s(46), height: s(46), borderRadius: s(23), alignItems: "center", justifyContent: "center" },
    channelLabel: { marginTop: s(5), fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },

    rewardRow: { flexDirection: "row", gap: s(10), marginTop: s(12) },
    rewardBox: {
        flex: 1, flexDirection: "row", alignItems: "center", gap: s(8), padding: s(10),
        borderRadius: s(14), backgroundColor: C.white, borderWidth: 1, borderColor: C.peachBorder,
    },
    coin: { width: s(40), height: s(40) },
    giftCircle: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: "#FFE7E1", alignItems: "center", justifyContent: "center" },
    rewardValue: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown },
    rewardSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },

    steps: { flexDirection: "row", marginTop: s(14), gap: s(8) },
    step: { flex: 1, alignItems: "center" },
    stepIcon: { width: s(54), height: s(54), borderRadius: s(27), backgroundColor: C.peach, alignItems: "center", justifyContent: "center" },
    stepNum: {
        position: "absolute", right: s(-2), bottom: s(-2), width: s(20), height: s(20), borderRadius: s(10),
        backgroundColor: C.orange, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.white,
    },
    stepNumText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.white },
    stepTitle: { marginTop: s(8), fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown, textAlign: "center" },
    stepSub: { marginTop: s(2), fontFamily: "Nunito_600SemiBold", fontSize: s(10.5), lineHeight: s(14), color: C.muted, textAlign: "center" },
});
