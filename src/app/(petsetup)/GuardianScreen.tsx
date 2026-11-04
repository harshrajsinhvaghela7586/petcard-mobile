import { appLocale } from "@/i18n/autoTranslate";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import GuardianPermissionSheet from "@/components/GuardianPermissionSheet";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { petcardApi, Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

type Access = "Full Access" | "View Only";

type Pending = { id: string; name: string; requested: string };
type Approved = { id: string; name: string; phone: string; access: Access; permissions: string[] };

const ACCESS_STYLE: Record<Access, { bg: string; fg: string }> = {
    "Full Access": { bg: "#E4F3D6", fg: "#5E9B2D" },
    "View Only": { bg: "#E6F0FA", fg: "#3B6FB6" },
};



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
    const [pending, setPending] = useState<Pending[]>([]);
    const [approved, setApproved] = useState<Approved[]>([]);
    const [petId, setPetId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [petName, setPetName] = useState("your pet");
    const [isOwner, setIsOwner] = useState(true);
    const [ownerName, setOwnerName] = useState("");
    const [editing, setEditing] = useState<Approved | null>(null);
    const [savingPerm, setSavingPerm] = useState(false);

    const loadGuardians = async () => {
        setLoading(true);
        try {
            const { pets } = await petcardApi.listPets();
            const pet = (await resolveSelectedPet(pets ?? [])) as Pet | undefined;
            if (!pet?.id) {
                setPending([]);
                setApproved([]);
                setPetId("");
                return;
            }
            setPetId(pet.id);
            setPetName(pet.name || "your pet");
            setIsOwner(pet.role === "owner");
            const data = await petcardApi.listGuardians(pet.id) as any;
            setOwnerName(typeof data.ownerName === "string" ? data.ownerName : "");
            setPending((data.pendingRequests ?? []).map((r: any) => ({
                id: r.id,
                name: r.requester?.name ?? "Guardian",
                requested: r.createdAt ? `Requested ${new Date(r.createdAt).toLocaleDateString(appLocale())}` : "Pending approval",
            })));
            setApproved((data.members ?? []).filter((m: any) => m.role !== "owner" && !m.isYou).map((m: any) => ({
                id: m.userId,
                name: m.name ?? "Guardian",
                phone: "Contact details private",
                permissions: Array.isArray(m.permissions) ? m.permissions : [],
                access: (Array.isArray(m.permissions) && m.permissions.some((p: string) => p.startsWith("manage_")) ? "Full Access" : "View Only") as Access,
            })));
        } catch (error) {
            Alert.alert("Couldn't load guardians", error instanceof Error ? error.message : "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void loadGuardians(); }, []);
    if (!fontsLoaded) return null;

    const review = (p: Pending) => {
        if (!petId) return;
        Alert.alert(p.name, "Allow this person to help care for " + petName + "?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Decline",
                style: "destructive",
                onPress: async () => {
                    try { await petcardApi.rejectGuardianRequest(petId, p.id); await loadGuardians(); }
                    catch (error) { Alert.alert("Request failed", error instanceof Error ? error.message : "Please try again."); }
                },
            },
            {
                text: "Approve",
                onPress: async () => {
                    try { await petcardApi.approveGuardianRequest(petId, p.id); await loadGuardians(); }
                    catch (error) { Alert.alert("Approval failed", error instanceof Error ? error.message : "Please try again."); }
                },
            },
        ]);
    };

    const toggleAccess = (g: Approved) => {
        if (!isOwner) { Alert.alert("Owner only", "Only the primary guardian can change permissions."); return; }
        setEditing(g);
    };

    const savePermissions = async (permissions: string[]) => {
        if (!editing || !petId) return;
        setSavingPerm(true);
        try {
            await petcardApi.updateGuardianPermissions(petId, editing.id, permissions);
            setEditing(null);
            await loadGuardians();
        } catch (error) {
            Alert.alert("Couldn't update permissions", error instanceof Error ? error.message : "Please try again.");
        } finally { setSavingPerm(false); }
    };

    const removeGuardian = () => {
        if (!editing || !petId) return;
        const g = editing;
        Alert.alert("Remove co-guardian?", `${g.name} will no longer have access to ${petName}.`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove", style: "destructive",
                onPress: async () => {
                    try { await petcardApi.removeGuardian(petId, g.id); setEditing(null); await loadGuardians(); }
                    catch (error) { Alert.alert("Couldn't remove guardian", error instanceof Error ? error.message : "Please try again."); }
                },
            },
        ]);
    };

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
                                <Text style={styles.name} maxFontSizeMultiplier={1.1} numberOfLines={1}>{isOwner ? (user?.name || "Primary guardian") : (ownerName || "Primary guardian")}</Text>
                                <View style={styles.youPill}>
                                    <Text style={styles.youText} maxFontSizeMultiplier={1.1}>{isOwner ? "You" : "Owner"}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="phone" size={s(14)} color={C.orange} />
                                <Text style={styles.info} maxFontSizeMultiplier={1.1}>{isOwner ? (user?.phone || "No phone added") : `You are a co-guardian of ${petName}`}</Text>
                            </View>
                            <Text style={styles.info} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {isOwner ? (user?.email || "") : ""}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* CO-GUARDIANS */}
                <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Co-Guardians</Text>

                {loading ? <Text style={styles.empty}>Loading guardians…</Text> : null}
                {!loading && pending.length > 0 ? (
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
                                onPress={() => toggleAccess(g)}
                                style={[styles.accessPill, { backgroundColor: ACCESS_STYLE[g.access].bg }]}
                            >
                                <Text
                                    style={[styles.accessText, { color: ACCESS_STYLE[g.access].fg }]}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {g.access} ›
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                    {!loading && approved.length === 0 ? (
                        <Text style={styles.empty} maxFontSizeMultiplier={1.1}>No approved guardians yet</Text>
                    ) : null}
                </View>

                {/* INFO */}
                <View style={styles.note}>
                    <MaterialCommunityIcons name="shield-half-full" size={s(34)} color={C.orange} />
                    <Text style={styles.noteText} maxFontSizeMultiplier={1.1}>
                        Guardians can help you care for {petName}.{"\n"}You're in control of who has access.
                    </Text>
                </View>
            </ScrollView>

            <GuardianPermissionSheet
                visible={!!editing}
                name={editing?.name ?? ""}
                initial={editing?.permissions ?? []}
                saving={savingPerm}
                onClose={() => setEditing(null)}
                onSave={savePermissions}
                onRemove={removeGuardian}
            />
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