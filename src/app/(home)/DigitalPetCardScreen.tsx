import { appLocale } from "@/i18n/autoTranslate";
import QRCode from "react-native-qrcode-svg";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getPetQrValue, petcardApi, type Pet } from "@/services/petcardApi";
import { downloadCard, printCard } from "@/services/cardExport";
import SafeImage from "@/components/SafeImage";
import PetActions from "@/components/PetActions";
import { getPetAvatarSource } from "@/services/petAvatar";
import { stickerUri } from "@/services/stickerImage";
import { resolveSelectedPet } from "@/services/petSelection";
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
    Image,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

export default function DigitalPetCardScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [pet, setPet] = useState<Pet | null>(null);
    const cardRef = useRef<View>(null);
    const params = useLocalSearchParams<{ petId?: string }>();
    useEffect(() => { let alive = true; petcardApi.listPets().then(async ({ pets }) => { const selected = params.petId ? pets.find((p) => p.id === params.petId) : await resolveSelectedPet(pets); if (alive) setPet(selected ?? null); }).catch(() => undefined); return () => { alive = false; }; }, [params.petId]);
    if (!fontsLoaded) return null;
    const petName = pet?.name ?? FALLBACK_PET.name;
    const petBreed = pet?.breed || pet?.type || FALLBACK_PET.breed;
    const petId = pet?.id ?? FALLBACK_PET.id;
    const gender = pet?.gender ? pet.gender[0].toUpperCase() + pet.gender.slice(1) : FALLBACK_PET.gender;
    const age = pet?.birthDate ? (() => { const born = new Date(pet.birthDate!); const now = new Date(); let months = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth(); if (now.getDate() < born.getDate()) months -= 1; if (months < 0) return FALLBACK_PET.age; const years = Math.floor(months / 12); const remainder = months % 12; return years ? `${years}y${remainder ? ` ${remainder}m` : ""}` : `${months}m`; })() : FALLBACK_PET.age;
    const weight = pet?.weightKg != null ? `${pet.weightKg} kg` : FALLBACK_PET.weight;
    const stats = [
        { key: "gender", label: "Gender", value: gender, icon: "gender-male" },
        { key: "age", label: "Age", value: age, icon: "cake-variant-outline" },
        { key: "weight", label: "Weight", value: weight, icon: "weight-kilogram" },
    ];

    /* Picture on the card: the sticker the user chose -> else the pet photo -> else the avatar (fallback). */
    const rawSticker: any = stickerUri(pet?.activeStickerKey);
    const stickerSource: any = rawSticker ? (typeof rawSticker === "string" ? { uri: rawSticker } : rawSticker) : null;
    const cardImage: any = stickerSource ?? (pet?.photoUrl ? { uri: pet.photoUrl } : null);

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Digital PetCard" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* PET CARD */}
                <View ref={cardRef} collapsable={false} style={styles.card}>
                    {/* orange top */}
                    <View style={styles.top}>
                        <View style={styles.topRow}>
                            <Text style={styles.cardLabel} maxFontSizeMultiplier={1.1}>PETCARD</Text>
                            <View style={styles.pawBadge}>
                                <MaterialCommunityIcons name="paw" size={s(18)} color={C.white} />
                            </View>
                        </View>

                        <View style={styles.petRow}>
                            <View style={styles.avatar}>
                                <SafeImage
                                    fallback={getPetAvatarSource(pet?.type, pet?.avatarKey)}
                                    source={cardImage}
                                    resizeMode="contain"
                                    style={styles.avatarImg}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {petName}
                                    </Text>
                                    <MaterialCommunityIcons name="paw" size={s(16)} color={C.white} />
                                </View>
                                <Text style={styles.breed} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {petBreed}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stats}>
                            {stats.map((st) => (
                                <View key={st.key} style={styles.stat}>
                                    <View style={styles.statHead}>
                                        <MaterialCommunityIcons name={st.icon as any} size={s(14)} color={C.white} />
                                        <Text style={styles.statLabel} maxFontSizeMultiplier={1.1}>{st.label}</Text>
                                    </View>
                                    <Text style={styles.statValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {st.value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* white bottom */}
                    <View style={styles.bottom}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.idLabel} maxFontSizeMultiplier={1.1}>PET ID</Text>
                            <Text style={styles.idValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {petId}
                            </Text>
                            <Text style={[styles.idLabel, { marginTop: s(10) }]} maxFontSizeMultiplier={1.1}>
                                Issued on
                            </Text>
                            <Text style={styles.issued} maxFontSizeMultiplier={1.1}>{pet?.createdAt ? new Date(pet.createdAt).toLocaleDateString(appLocale()) : FALLBACK_PET.issued}</Text>
                        </View>

                        <View style={styles.qrBox}>
                            <QRCode value={getPetQrValue(pet)} size={s(88)} />
                        </View>
                    </View>
                </View>

                {/* NOTE */}
                <View style={styles.note}>
                    <View style={styles.noteIcon}>
                        <MaterialCommunityIcons name="shield-check-outline" size={s(22)} color={C.orange} />
                    </View>
                    <Text style={styles.noteText} maxFontSizeMultiplier={1.1}>
                        <Text style={styles.noteBold}>This is {petName}'s official identity.{"\n"}</Text>
                        Keep it safe and share when needed.
                    </Text>
                </View>

                {/* ACTIONS */}
                <PetActions
                    shareMessage={`${petName}'s PetCard QR
Pet ID: ${petId}
Scan link: ${getPetQrValue(pet)}`}
                    onDownload={() => downloadCard(cardRef)}
                    onPrint={() => printCard(cardRef, `${petName} PetID`)}
                />
            </ScrollView>

            <BottomNav active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    card: {
        ...cardStyle,
        marginHorizontal: SIDE,
        marginTop: s(6),
        borderColor: C.orange,
        overflow: "hidden",
    },
    top: { backgroundColor: C.orange, padding: s(16), paddingBottom: s(22) },
    topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardLabel: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(18),
        letterSpacing: 1,
        color: C.white,
    },
    pawBadge: {
        width: s(34),
        height: s(34),
        borderRadius: s(17),
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
    },

    petRow: { flexDirection: "row", alignItems: "center", gap: s(14), marginTop: s(10) },
    avatar: {
        width: s(112),
        height: s(112),
        borderRadius: s(56),
        backgroundColor: "#FFF3E3",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatarImg: { width: s(104), height: s(104) },
    nameRow: { flexDirection: "row", alignItems: "center", gap: s(6) },
    name: { fontFamily: "Fredoka_600SemiBold", fontSize: s(26), color: C.white },
    breed: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: "#FFE9D6", marginTop: s(2) },

    stats: { flexDirection: "row", marginTop: s(14), gap: s(8) },
    stat: { flex: 1 },
    statHead: { flexDirection: "row", alignItems: "center", gap: s(4) },
    statLabel: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: "#FFE9D6" },
    statValue: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.white, marginTop: s(2) },

    bottom: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderTopLeftRadius: s(20),
        borderTopRightRadius: s(20),
        marginTop: s(-14),
        padding: s(16),
        gap: s(12),
    },
    idLabel: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
    idValue: { fontFamily: "Fredoka_600SemiBold", fontSize: s(22), color: C.brown, marginTop: s(2) },
    issued: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown, marginTop: s(2) },
    qrBox: {
        padding: s(6),
        backgroundColor: C.white,
        borderRadius: s(10),
        borderWidth: 1,
        borderColor: C.peachBorder,
    },

    note: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        marginHorizontal: SIDE,
        marginTop: s(14),
        marginBottom: s(14),
        padding: s(12),
        borderRadius: s(12),
        backgroundColor: "#FFF3E3",
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    noteIcon: {
        width: s(38),
        height: s(38),
        borderRadius: s(19),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    noteText: { flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: s(12), lineHeight: s(17), color: C.brown },
    noteBold: { fontFamily: "Nunito_700Bold" },
});