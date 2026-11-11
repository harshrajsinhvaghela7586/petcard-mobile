import QRCode from "react-native-qrcode-svg";
import React, { useEffect, useRef, useState } from "react";
import { getPetQrValue, petcardApi, type Pet } from "@/services/petcardApi";
import { downloadCard, printCard } from "@/services/cardExport";
import PetActions from "@/components/PetActions";
import { resolveSelectedPet } from "@/services/petSelection";
import { useRequirePermission } from "@/hooks/use-require-permission";
import { isPetOwner } from "@/services/petPermissions";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import { PET as FALLBACK_PET } from "@/constants/pet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

type Tab = "pet" | "guardian";

const TABS: { key: Tab; label: string }[] = [
    { key: "pet", label: "My Pet" },
    { key: "guardian", label: "Guardian Invite" },
];

const QR_SIZE = s(230);

export default function MyQRCodeScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState<Tab>("pet");
    const qrRef = useRef<View>(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [guardianInvite, setGuardianInvite] = useState<string | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);
    useEffect(() => { let alive = true; petcardApi.listPets().then(async ({ pets }) => { const selected = await resolveSelectedPet(pets); if (alive) setPet(selected ?? null); }).catch(() => undefined); return () => { alive = false; }; }, []);
    useEffect(() => {
        if (tab !== "guardian" || !pet?.id || guardianInvite) return;
        let active = true;
        setInviteLoading(true);
        petcardApi.createGuardianInvite(pet.id).then(({ invite }) => { if (active) setGuardianInvite(invite.deepLink); })
            .catch(() => { if (active) setGuardianInvite(null); })
            .finally(() => { if (active) setInviteLoading(false); });
        return () => { active = false; };
    }, [tab, pet?.id, guardianInvite]);
    const allowed = useRequirePermission(pet, "view_qr");
    if (!fontsLoaded || !allowed) return null;
    const petName = pet?.name ?? FALLBACK_PET.name;
    const petId = pet?.id ?? FALLBACK_PET.id;
    const isPet = tab === "pet";
    const title = isPet ? `${petName}'s PetCard QR` : `Invite a Co-Guardian`;
    const sub = isPet
        ? `Scan this code to view ${petName}'s PetCard`
        : (inviteLoading ? "Generating secure invitation…" : guardianInvite ? `Scan to request guardian access for ${petName}` : `Could not generate invitation. Switch tabs and try again.`);

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="My QR Code" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TABS */}
                <View style={styles.tabs}>
                    {TABS.filter((t) => t.key === "pet" || isPetOwner(pet)).map((t) => {
                        const on = t.key === tab;
                        return (
                            <Pressable
                                key={t.key}
                                onPress={() => { setTab(t.key); if (t.key === "guardian") setGuardianInvite(null); }}
                                style={[styles.tab, on && styles.tabOn]}
                            >
                                <Text style={[styles.tabText, on && styles.tabTextOn]} maxFontSizeMultiplier={1.1}>
                                    {t.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* QR CARD */}
                <View ref={qrRef} collapsable={false} style={styles.qrCard}>
                    <View style={styles.qrWrap}>
                        <QRCode value={isPet ? getPetQrValue(pet) : (guardianInvite || `petcardmobile://guardian-invite-pending/${petId}`)} size={QR_SIZE} />
                        {/* center logo */}
                        <View style={styles.logo}>
                            <MaterialCommunityIcons name="shield" size={s(46)} color={C.orange} />
                            <MaterialCommunityIcons
                                name="paw"
                                size={s(20)}
                                color={C.white}
                                style={styles.logoPaw}
                            />
                        </View>
                    </View>

                    <Text style={styles.qrTitle} maxFontSizeMultiplier={1.1}>{title}</Text>
                    <Text style={styles.qrSub} maxFontSizeMultiplier={1.1}>{sub}</Text>
                </View>

                {/* ACTIONS */}
                <PetActions
                    order={["share", "download", "print"]}
                    shareMessage={`${petName}'s PetCard QR
Pet ID: ${petId}
Scan link: ${getPetQrValue(pet)}`}
                    onDownload={() => downloadCard(qrRef)}
                    onPrint={() => printCard(qrRef, `${petName} QR`)}
                />
            </ScrollView>

            <BottomNav active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    tabs: {
        flexDirection: "row",
        marginHorizontal: SIDE,
        marginTop: s(4),
        borderRadius: s(12),
        borderWidth: 1,
        borderColor: C.orange,
        backgroundColor: "#FFF3E6",
        overflow: "hidden",
    },
    tab: {
        flex: 1,
        height: s(44),
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 3,
        borderBottomColor: "transparent",
    },
    tabOn: { backgroundColor: C.white, borderBottomColor: C.orange },
    tabText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    tabTextOn: { color: C.orange },

    qrCard: {
        ...cardStyle,
        marginHorizontal: SIDE,
        marginTop: s(16),
        marginBottom: s(16),
        paddingVertical: s(22),
        alignItems: "center",
    },
    qrWrap: {
        padding: s(10),
        backgroundColor: C.white,
        borderRadius: s(14),
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        position: "absolute",
        width: s(62),
        height: s(62),
        borderRadius: s(31),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    logoPaw: { position: "absolute" },
    qrTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(16),
        color: C.brown,
        marginTop: s(16),
    },
    qrSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(3),
        textAlign: "center",
        paddingHorizontal: s(20),
    },
});