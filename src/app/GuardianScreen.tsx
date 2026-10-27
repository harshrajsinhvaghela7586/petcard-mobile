import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import BottomNav, { useNavHeight } from "../components/BottomNav";
import { PET } from "@/constants/pet";

type Access = "Full Access" | "View Only";

type Pending = { id: string; name: string; requested: string };
type Approved = { id: string; name: string; phone: string; access: Access };

const ACCESS_STYLE: Record<Access, { bg: string; fg: string }> = {
    "Full Access": { bg: "#E4F3D6", fg: "#5E9B2D" },
    "View Only": { bg: "#E6F0FA", fg: "#3B6FB6" },
};

/* mock data (baad me API se) */
const INITIAL_PENDING: Pending[] = [
    { id: "p1", name: "Ahad Khan", requested: "Requested on 20 May 2025" },
];
const INITIAL_APPROVED: Approved[] = [
    { id: "a1", name: "Ben", phone: "+91 98760 12345", access: "Full Access" },
    { id: "a2", name: "Bob", phone: "+91 99887 66554", access: "View Only" },
];

function Avatar({ size = 52 }: { size?: number }) {
    return (
        <View
            style={{
                width: s(size),
                height: s(size),
                borderRadius: s(size / 2),
                backgroundColor: C.peach,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <MaterialCommunityIcons name="account" size={s(size * 0.62)} color={C.orange} />
        </View>
    );
}

export default function GuardiansScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [pending, setPending] = useState<Pending[]>(INITIAL_PENDING);
    const [approved, setApproved] = useState<Approved[]>(INITIAL_APPROVED);
    if (!fontsLoaded) return null;

    const review = (p: Pending) => {
        Alert.alert(p.name, "Allow this person to help care for " + PET.name + "?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Decline",
                style: "destructive",
                onPress: () => setPending((prev) => prev.filter((x) => x.id !== p.id)),
            },
            {
                text: "Approve",
                onPress: () => {
                    // TODO: API call
                    setPending((prev) => prev.filter((x) => x.id !== p.id));
                    setApproved((prev) => [
                        ...prev,
                        { id: p.id, name: p.name, phone: "—", access: "View Only" },
                    ]);
                },
            },
        ]);
    };

    const toggleAccess = (id: string) =>
        setApproved((prev) =>
            prev.map((g) =>
                g.id === id
                    ? { ...g, access: g.access === "Full Access" ? "View Only" : "Full Access" }
                    : g
            )
        );

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader
                title="Guardians"
                rightLabel="+ Add"
                onRightPress={() => router.push("/MyQRCodeScreen" as any)}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* PRIMARY GUARDIAN */}
                <View style={styles.primary}>
                    <View style={styles.primaryHead}>
                        <MaterialCommunityIcons name="crown" size={s(20)} color={C.orange} />
                        <Text style={styles.primaryTitle} maxFontSizeMultiplier={1.1}>Primary Guardian</Text>
                    </View>

                    <View style={styles.primaryBody}>
                        <Avatar size={72} />
                        <View style={{ flex: 1, gap: s(3) }}>
                            <View style={styles.nameRow}>
                                <Text style={styles.name} maxFontSizeMultiplier={1.1}>Amber</Text>
                                <View style={styles.youPill}>
                                    <Text style={styles.youText} maxFontSizeMultiplier={1.1}>You</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="phone" size={s(14)} color={C.orange} />
                                <Text style={styles.info} maxFontSizeMultiplier={1.1}>{PET.primary.phone}</Text>
                            </View>
                            <Text style={styles.info} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                amber@example.com
                            </Text>
                        </View>
                    </View>
                </View>

                {/* CO-GUARDIANS */}
                <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Co-Guardians</Text>

                {pending.length > 0 ? (
                    <>
                        <Text style={styles.subLabel} maxFontSizeMultiplier={1.1}>Pending Approval</Text>
                        <View style={styles.listCard}>
                            {pending.map((p, i) => (
                                <View key={p.id} style={[styles.row, i > 0 && styles.rowBorder]}>
                                    <Avatar />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.rowName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {p.name}
                                        </Text>
                                        <Text style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {p.requested}
                                        </Text>
                                    </View>
                                    <Pressable style={styles.reviewBtn} onPress={() => review(p)}>
                                        <Text style={styles.reviewText} maxFontSizeMultiplier={1.1}>Review</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </>
                ) : null}

                <Text style={[styles.subLabel, { marginTop: s(16) }]} maxFontSizeMultiplier={1.1}>
                    Approved Guardians
                </Text>
                <View style={styles.listCard}>
                    {approved.map((g, i) => (
                        <View key={g.id} style={[styles.row, i > 0 && styles.rowBorder]}>
                            <Avatar />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {g.name}
                                </Text>
                                <Text style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {g.phone}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => toggleAccess(g.id)}
                                style={[styles.accessPill, { backgroundColor: ACCESS_STYLE[g.access].bg }]}
                            >
                                <Text
                                    style={[styles.accessText, { color: ACCESS_STYLE[g.access].fg }]}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {g.access}
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                    {approved.length === 0 ? (
                        <Text style={styles.empty} maxFontSizeMultiplier={1.1}>No approved guardians yet</Text>
                    ) : null}
                </View>

                {/* INFO */}
                <View style={styles.note}>
                    <MaterialCommunityIcons name="shield-half-full" size={s(34)} color={C.orange} />
                    <Text style={styles.noteText} maxFontSizeMultiplier={1.1}>
                        Guardians can help you care for {PET.name}.{"\n"}You're in control of who has access.
                    </Text>
                </View>
            </ScrollView>

            <BottomNav active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    primary: {
        marginHorizontal: SIDE,
        marginTop: s(4),
        padding: s(14),
        borderRadius: s(16),
        backgroundColor: "#FFF3E3",
        borderWidth: 1,
        borderColor: C.orange,
    },
    primaryHead: { flexDirection: "row", alignItems: "center", gap: s(8) },
    primaryTitle: { fontFamily: "Nunito_700Bold", fontSize: s(16), color: C.orange },
    primaryBody: { flexDirection: "row", alignItems: "center", gap: s(14), marginTop: s(12) },
    nameRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    name: { fontFamily: "Nunito_700Bold", fontSize: s(16), color: C.brown },
    youPill: {
        paddingHorizontal: s(10),
        paddingVertical: s(2),
        borderRadius: s(8),
        backgroundColor: "#DCE8FA",
    },
    youText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: "#3B6FB6" },
    infoRow: { flexDirection: "row", alignItems: "center", gap: s(5) },
    info: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.brown },

    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(18),
        color: C.brown,
        marginTop: s(22),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },
    subLabel: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.muted,
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },

    listCard: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(12) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(10), gap: s(12) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    rowName: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(2) },

    reviewBtn: {
        paddingHorizontal: s(14),
        paddingVertical: s(6),
        borderRadius: s(12),
        borderWidth: 1,
        borderColor: C.orange,
        backgroundColor: C.white,
    },
    reviewText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },

    accessPill: { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(10) },
    accessText: { fontFamily: "Nunito_700Bold", fontSize: s(11) },
    empty: {
        textAlign: "center",
        paddingVertical: s(20),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        color: C.muted,
    },

    note: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        marginHorizontal: SIDE,
        marginTop: s(18),
        padding: s(14),
        borderRadius: s(14),
        backgroundColor: "#FFF3E3",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    noteText: { flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: s(13), lineHeight: s(19), color: C.brown },
});