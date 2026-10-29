import PrimaryButton from "@/components/Button/PrimaryButton";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav, { useNavHeight } from "../../components/BottomNav";
import { C, s, SIDE } from "../../components/KnowKit";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/* Card header: PrimaryButton jaisa hi animated orange gradient */
function GradientHead({ title }: { title: string }) {
    const gradientX = useSharedValue(0);

    useEffect(() => {
        gradientX.value = withRepeat(
            withTiming(-140, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedGradientStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: gradientX.value }],
    }));

    return (
        <View style={styles.cardHead}>
            <AnimatedGradient
                colors={["#ff7a00", "#ff9b2f", "#ff8400", "#ffb347", "#ff7a00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headGradient, animatedGradientStyle]}
            />
            <Text style={styles.cardHeadText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                {title}
            </Text>
            <View style={styles.cross}>
                <MaterialCommunityIcons name="plus-thick" size={s(24)} color={C.orange} />
            </View>
        </View>
    );
}

/* Baad me real data (store / API) se replace karna */
const PET = { name: "Milo", breed: "Golden Retriever", id: "PC-DOG-8247" };

const MEDICAL = [
    { key: "allergy", label: "Allergy", value: "Chicken, Pollen" },
    { key: "blood", label: "Blood Type", value: "DEA 1.1 Positive" },
    { key: "cond", label: "Medical Conditions", value: "None" },
    { key: "meds", label: "Medication", value: "None" },
];

const CONTACTS = [
    { key: "primary", role: "Primary Guardian", name: "Falguni Pathak", phone: "+91 98765 43210" },
    { key: "co", role: "Co-Guardian", name: "Raj Gadhavi", phone: "+91 91234 56789" },
];

const VET = { clinic: "Happy Paws Clinic", doctor: "Dr. Rohan Mehta", phone: "+91 99887 76655" };

const call = (phone: string) => Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);

export default function EmergencyCardScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    if (!fontsLoaded) return null;

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/ProfileScreen" as any));

    /* TODO: card ko image/PDF banane ke liye react-native-view-shot + expo-sharing use kar sakte ho */
    const onDownload = () => Alert.alert("Download Card", "Download feature jald hi connect hoga.");

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(40) }}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerSlot} hitSlop={8}>
                        <Ionicons name="arrow-back" size={s(26)} color={C.brown} />
                    </Pressable>
                    <Text style={styles.headerTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                        Emergency Card
                    </Text>
                    <Pressable onPress={onDownload} style={styles.headerSlot} hitSlop={8}>
                        <Ionicons name="download-outline" size={s(24)} color={C.brown} />
                    </Pressable>
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    <GradientHead title="EMERGENCY CARD" />

                    <View style={styles.cardBody}>
                        {/* pet */}
                        <View style={styles.petRow}>
                            <View style={styles.avatarRing}>
                                <Image
                                    source={require("../../../assets/images/pets/huchiko.png")}
                                    resizeMode="contain"
                                    style={styles.avatar}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.petName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {PET.name} 🐾
                                </Text>
                                <Text style={styles.petBreed} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {PET.breed}
                                </Text>
                                <Text style={styles.petId} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    PET ID: {PET.id}
                                </Text>
                            </View>
                        </View>

                        {/* medical */}
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>
                            Medical Information
                        </Text>
                        <View style={styles.medGrid}>
                            {MEDICAL.map((m) => (
                                <View key={m.key} style={styles.medItem}>
                                    <MaterialCommunityIcons name="paw" size={s(14)} color={C.orange} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.medLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                            {m.label}
                                        </Text>
                                        <Text style={styles.medValue} maxFontSizeMultiplier={1.1}>
                                            {m.value}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* contacts */}
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>
                            Emergency Contacts
                        </Text>
                        {CONTACTS.map((c, i) => (
                            <View key={c.key} style={[styles.contactRow, i > 0 && styles.divider]}>
                                <View style={styles.contactAvatar}>
                                    <Ionicons name="person" size={s(22)} color={C.orange} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.contactRole} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {c.role}
                                    </Text>
                                    <Text style={styles.contactName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {c.name}
                                    </Text>
                                </View>
                                <Text style={styles.phone} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {c.phone}
                                </Text>
                                <Pressable style={styles.callBtn} onPress={() => call(c.phone)}>
                                    <Ionicons name="call" size={s(16)} color={C.orange} />
                                </Pressable>
                            </View>
                        ))}

                        {/* vet */}
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>
                            Vet Information
                        </Text>
                        <View style={styles.contactRow}>
                            <View style={styles.contactAvatar}>
                                <MaterialCommunityIcons name="hospital-building" size={s(22)} color={C.orange} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.contactName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {VET.clinic}
                                </Text>
                                <Text style={styles.contactRole} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {VET.doctor}
                                </Text>
                            </View>
                            <Text style={styles.phone} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {VET.phone}
                            </Text>
                            <Pressable style={styles.callBtn} onPress={() => call(VET.phone)}>
                                <Ionicons name="call" size={s(16)} color={C.orange} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* DOWNLOAD (same PrimaryButton as Create Pet Avatar) */}
                <View style={styles.buttonWrap}>
                    <PrimaryButton
                        title="Download Card"
                        onPress={onDownload}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
                <Text style={styles.share} maxFontSizeMultiplier={1.1}>
                    Share in emergencies
                </Text>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.cream, overflow: "hidden" },

    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SIDE, marginBottom: s(12) },
    headerSlot: { width: s(44), height: s(44), alignItems: "center", justifyContent: "center" },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(21),
        lineHeight: s(28),
        color: C.brown,
    },

    card: {
        marginHorizontal: SIDE,
        borderRadius: s(22),
        overflow: "hidden",
        backgroundColor: "#FFF3E8",
        borderWidth: 1,
        borderColor: C.peachBorder,
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(4) },
        shadowOpacity: 0.12,
        shadowRadius: s(8),
        elevation: 3,
    },
    cardHead: {
        height: 52,
        overflow: "hidden",
        paddingHorizontal: s(16),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headGradient: {
        position: "absolute",
        width: "260%",
        height: "260%",
        left: "-80%",
        top: "-80%",
    },
    cardHeadText: {
        flex: 1,
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    cross: {
        zIndex: 2,
        width: s(38),
        height: s(38),
        borderRadius: s(19),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    cardBody: { padding: s(16) },

    petRow: { flexDirection: "row", alignItems: "center", gap: s(14), marginBottom: s(8) },
    avatarRing: {
        width: s(92),
        height: s(92),
        borderRadius: s(46),
        borderWidth: 3,
        borderColor: C.orange,
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatar: { width: s(84), height: s(84) },
    petName: { fontFamily: "Fredoka_600SemiBold", fontSize: s(22), color: C.brown },
    petBreed: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.muted, marginTop: s(2) },
    petId: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown, marginTop: s(2) },

    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(15),
        color: C.orange,
        marginTop: s(14),
        paddingBottom: s(8),
        borderBottomWidth: 1,
        borderBottomColor: "#F2D9CC",
        marginBottom: s(10),
    },

    medGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: s(12) },
    medItem: { width: "48%", flexDirection: "row", gap: s(6), alignItems: "flex-start" },
    medLabel: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
    medValue: { fontFamily: "Nunito_700Bold", fontSize: s(13), lineHeight: s(17), color: C.brown, marginTop: s(1) },

    contactRow: { flexDirection: "row", alignItems: "center", gap: s(10), paddingVertical: s(8) },
    divider: { borderTopWidth: 1, borderTopColor: "#F2D9CC" },
    contactAvatar: {
        width: s(42),
        height: s(42),
        borderRadius: s(21),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    contactRole: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
    contactName: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    phone: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown, flexShrink: 1 },
    callBtn: {
        width: s(34),
        height: s(34),
        borderRadius: s(17),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },

    /* PrimaryButton: default size/gradient */
    buttonWrap: { marginTop: s(16), paddingHorizontal: SIDE },
    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },
    share: {
        textAlign: "center",
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.muted,
        marginTop: s(8),
    },
});