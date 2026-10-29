import React, { useMemo } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

/* =========================================================
   DEMO DATA  (replace with real pet data / route params)
========================================================= */

const PET = {
    name: "Milo",
    breed: "Golden Retriever",
    gender: "Male",
    age: "2 Years",
    weight: "12.5 kg",
    petId: "PC-DOG-8247",
};

/* =========================================================
   PLACEHOLDER QR
   Looks like a QR code. For a real, scannable QR install
   `react-native-qrcode-svg` and replace <FakeQR /> with:
   <QRCode value={PET.petId} size={s(62)} />
========================================================= */

const QR_CELLS = 21;

const FakeQR = ({ size }: { size: number }) => {
    const cell = size / QR_CELLS;

    const cells = useMemo(() => {
        const inFinder = (r: number, c: number) =>
            (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);

        const finderOn = (r: number, c: number) => {
            const rr = r > 13 ? r - 14 : r;
            const cc = c > 13 ? c - 14 : c;
            const edge = rr === 0 || rr === 6 || cc === 0 || cc === 6;
            const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
            return edge || core;
        };

        const list: { key: string; r: number; c: number }[] = [];
        for (let r = 0; r < QR_CELLS; r++) {
            for (let c = 0; c < QR_CELLS; c++) {
                const on = inFinder(r, c)
                    ? finderOn(r, c)
                    : (r * 7 + c * 13 + r * c) % 3 === 0;
                if (on) list.push({ key: `${r}-${c}`, r, c });
            }
        }
        return list;
    }, []);

    return (
        <View style={{ width: size, height: size }}>
            {cells.map(({ key, r, c }) => (
                <View
                    key={key}
                    style={{
                        position: "absolute",
                        left: c * cell,
                        top: r * cell,
                        width: cell,
                        height: cell,
                        backgroundColor: "#381B0E",
                    }}
                />
            ))}
        </View>
    );
};

/* =========================================================
   SCREEN
========================================================= */

export default function PetCardReadyScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded) return null;

    const handleContinue = () => {
        router.push("/CareSetupCompleteScreen");
    };

    return (
        <View style={styles.container}>
            {/* BACKGROUND PAWS */}
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomLeft]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            {/* CONTENT */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Your PetCard is Ready!
                    </Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        Here&apos;s your pet&apos;s digital identity.
                    </Text>
                </View>

                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* PET CARD */}
                    <View style={styles.card}>
                        {/* top orange strip */}
                        <View style={styles.cardTop}>
                            <Text style={styles.cardLabel} maxFontSizeMultiplier={1.1}>
                                PETCARD
                            </Text>
                            <Ionicons name="paw" size={s(22)} color="#FFFFFF" />
                        </View>

                        {/* body */}
                        <View style={styles.cardBody}>
                            <View style={styles.identityRow}>
                                <View style={styles.avatarRing}>
                                    <Image
                                        source={require("../../../assets/images/pets/huchiko.png")}
                                        resizeMode="contain"
                                        style={styles.avatar}
                                    />
                                </View>

                                <View style={styles.identityText}>
                                    <View style={styles.primaryPill}>
                                        <Text style={styles.primaryPillText} maxFontSizeMultiplier={1.1}>
                                            Primary Pet
                                        </Text>
                                    </View>

                                    <View style={styles.nameRow}>
                                        <Text style={styles.petName} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                                            {PET.name}
                                        </Text>
                                        <Ionicons name="paw" size={s(14)} color="#FF7A00" />
                                    </View>

                                    <Text style={styles.petBreed} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                                        {PET.breed}
                                    </Text>
                                </View>
                            </View>

                            {/* info row */}
                            <View style={styles.infoRow}>
                                <InfoItem label="Gender" value={PET.gender} icon="male" />
                                <InfoItem label="Age" value={PET.age} icon="calendar-outline" />
                                <InfoItem label="Weight" value={PET.weight} icon="barbell-outline" />
                            </View>

                            {/* id + qr */}
                            <View style={styles.idRow}>
                                <View style={styles.idTextWrapper}>
                                    <Text style={styles.idLabel} maxFontSizeMultiplier={1.1}>
                                        PET ID
                                    </Text>
                                    <Text style={styles.idValue} maxFontSizeMultiplier={1.1}>
                                        {PET.petId}
                                    </Text>
                                </View>

                                <View style={styles.qrBox}>
                                    <FakeQR size={s(62)} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actionsRow}>
                        <ActionButton
                            icon="download-outline"
                            label="Download"
                            onPress={() => console.log("Download")}
                        />
                        <ActionButton
                            icon="share-social-outline"
                            label="Share QR"
                            onPress={() => console.log("Share QR")}
                        />
                        <ActionButton
                            icon="print-outline"
                            label="Print"
                            onPress={() => console.log("Print")}
                        />
                    </View>
                </ScrollView>
            </View>

            {/* BOTTOM ACTIONS (no skip on this screen) */}
            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Continue to Dashboard"
                        onPress={handleContinue}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
                {/* keeps the button at the exact same position as the other screens */}
                <View style={styles.skipSpacer} />
            </View>
        </View>
    );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}) => (
    <View style={styles.infoItem}>
        <View style={styles.infoLabelRow}>
            <Ionicons name={icon} size={s(12)} color="#A77C59" />
            <Text style={styles.infoLabel} maxFontSizeMultiplier={1.1}>
                {label}
            </Text>
        </View>
        <Text style={styles.infoValue} numberOfLines={1} maxFontSizeMultiplier={1.1}>
            {value}
        </Text>
    </View>
);

const ActionButton = ({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.actionButton}
    >
        <Ionicons name={icon} size={s(22)} color="#FF7A00" />
        <Text style={styles.actionText} maxFontSizeMultiplier={1.1}>
            {label}
        </Text>
    </Pressable>
);

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        paddingTop: height * 0.112,
    },

    /* HEADER (identical on all screens) */
    header: {
        alignItems: "center",
        paddingHorizontal: s(5),
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(36),
        color: "#FF7F00",
        textAlign: "center",
        letterSpacing: 0,
    },

    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#381B0E",
        textAlign: "center",
    },

    list: {
        flex: 1,
        marginTop: s(18),
    },

    listContent: {
        paddingHorizontal: s(16),
        paddingBottom: s(130),
    },

    /* CARD */
    card: {
        borderRadius: s(18),
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#FF7F00",
        backgroundColor: "#FFF3E6",
    },

    cardTop: {
        height: s(40),
        backgroundColor: "#FF7F00",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(16),
    },

    cardLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        letterSpacing: 0.5,
        color: "#FFFFFF",
    },

    cardBody: {
        backgroundColor: "#FFF3E6",
        paddingHorizontal: s(16),
        paddingTop: s(14),
        paddingBottom: s(16),
    },

    identityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(14),
    },

    avatarRing: {
        width: s(96),
        height: s(96),
        borderRadius: s(48),
        borderWidth: s(2),
        borderColor: "#FF7F00",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    avatar: {
        width: s(84),
        height: s(84),
    },

    identityText: {
        flex: 1,
        alignItems: "flex-start",
    },

    primaryPill: {
        alignSelf: "flex-end",
        borderRadius: s(8),
        backgroundColor: "#FFE0C4",
        paddingHorizontal: s(10),
        paddingVertical: s(3),
        marginBottom: s(8),
    },

    primaryPillText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        color: "#FF7A00",
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
    },

    petName: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(24),
        lineHeight: s(28),
        color: "#381B0E",
    },

    petBreed: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#6B554A",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(16),
        paddingHorizontal: s(4),
    },

    infoItem: {
        flex: 1,
        alignItems: "flex-start",
    },

    infoLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
    },

    infoLabel: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(11),
        lineHeight: s(15),
        color: "#6B554A",
    },

    infoValue: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(19),
        color: "#381B0E",
    },

    idRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginTop: s(14),
    },

    idTextWrapper: {
        flex: 1,
        paddingBottom: s(4),
    },

    idLabel: {
        fontFamily: "Nunito_400Regular",
        fontSize: s(11),
        lineHeight: s(15),
        color: "#6B554A",
    },

    idValue: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(18),
        lineHeight: s(24),
        color: "#381B0E",
    },

    qrBox: {
        padding: s(6),
        borderRadius: s(8),
        backgroundColor: "#FFFFFF",
    },

    /* ACTIONS */
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: s(22),
        gap: s(12),
    },

    actionButton: {
        flex: 1,
        height: s(66),
        borderRadius: s(11),
        borderWidth: 1,
        borderColor: "#FF7F00",
        backgroundColor: "#FFFCF9",
        alignItems: "center",
        justifyContent: "center",
        gap: s(4),
    },

    actionText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#381B0E",
    },

    /* BACKGROUND PAWS */
    backgroundPaw: {
        position: "absolute",
        width: 72 * SCALE,
        height: 72 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    pawTopLeft: {
        top: 40 * SCALE,
        left: 24 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 160 * SCALE,
        right: 17 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawBottomLeft: {
        bottom: 105 * SCALE,
        left: 16 * SCALE,
        transform: [{ rotate: "12deg" }],
    },

    pawBottomRight: {
        bottom: 20 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /* BOTTOM ACTIONS (identical on all screens) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: height * 0.014,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },

    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
    },

    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },

    skipSpacer: {
        height: s(34),
        marginTop: s(1),
    },
});