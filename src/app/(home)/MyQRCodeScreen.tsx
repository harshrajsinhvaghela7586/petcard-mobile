import FakeQR from "@/components/FakeQR";
import PetActions from "@/components/PetActions";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import { PET } from "@/constants/pet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
    if (!fontsLoaded) return null;

    const isPet = tab === "pet";
    const title = isPet ? `${PET.name}'s PetCard QR` : `Invite a Co-Guardian`;
    const sub = isPet
        ? `Scan this code to view ${PET.name}'s PetCard`
        : `Ask them to scan this to join ${PET.name}'s care team`;

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
                    {TABS.map((t) => {
                        const on = t.key === tab;
                        return (
                            <Pressable
                                key={t.key}
                                onPress={() => setTab(t.key)}
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
                <View style={styles.qrCard}>
                    <View style={styles.qrWrap}>
                        <FakeQR
                            value={isPet ? PET.id : `${PET.id}-INVITE`}
                            size={QR_SIZE}
                            logoGap
                        />
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
                    shareMessage={`${PET.name}'s PetCard — Pet ID: ${PET.id}`}
                    // TODO: onDownload / onPrint
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