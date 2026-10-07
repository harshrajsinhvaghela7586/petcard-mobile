import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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

const NUM_COLUMNS = 3;
const LIST_PADDING = s(10);
const CARD_GAP = s(16);
const CARD_WIDTH =
    (width - LIST_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

type StickerItem = {
    id: string;
    image?: any;
    empty?: boolean;
    locked?: boolean;
    cost?: number;
};

/*
 * Index (0-based) ke hisaab se cost nikalta hai:
 * 1-7   -> free (unlocked)
 * 8-10  -> 15 points
 * 11-13 -> 20 points
 * 14-15 -> 30 points
 */
const UNLOCKED_COUNT = 7;
const getCost = (index: number): number | undefined => {
    if (index < UNLOCKED_COUNT) return undefined;
    if (index < 10) return 15;
    if (index < 13) return 20;
    return 30;
};

/* require ke paths static hone chahiye (Metro limitation) */
const RAW_HUCHIKO = [
    require("../../assets/images/chooseSticker/Huchiko/image1.png"),
    require("../../assets/images/chooseSticker/Huchiko/image2.png"),
    require("../../assets/images/chooseSticker/Huchiko/image3.png"),
    require("../../assets/images/chooseSticker/Huchiko/image4.png"),
    require("../../assets/images/chooseSticker/Huchiko/image5.png"),
    require("../../assets/images/chooseSticker/Huchiko/image6.png"),
    require("../../assets/images/chooseSticker/Huchiko/image7.png"),
    require("../../assets/images/chooseSticker/Huchiko/image8.png"),
    require("../../assets/images/chooseSticker/Huchiko/image9.png"),
    require("../../assets/images/chooseSticker/Huchiko/image10.png"),
    require("../../assets/images/chooseSticker/Huchiko/image11.png"),
    require("../../assets/images/chooseSticker/Huchiko/image12.png"),
    require("../../assets/images/chooseSticker/Huchiko/image13.png"),
    require("../../assets/images/chooseSticker/Huchiko/image14.png"),
    require("../../assets/images/chooseSticker/Huchiko/image15.png"),
];

const HUCHIKO_STICKERS: StickerItem[] = RAW_HUCHIKO.map((image, index) => {
    const cost = getCost(index);
    return {
        id: `huchiko-${index + 1}`,
        image,
        locked: cost !== undefined,
        cost,
    };
});

/*
 * Baad me dusre avatars ke sticker sets yahan add karna:
 * noir: NOIR_STICKERS, oreo: OREO_STICKERS ...
 * Key wahi honi chahiye jo ChoosePetAvatarScreen se `avatar` param me aaye.
 */
const STICKER_SETS: Record<string, StickerItem[]> = {
    huchiko: HUCHIKO_STICKERS,
};

/* Last row ko complete karne ke liye invisible placeholders */
const withPlaceholders = (data: StickerItem[]): StickerItem[] => {
    const remainder = data.length % NUM_COLUMNS;
    if (remainder === 0) return data;

    const placeholders: StickerItem[] = Array.from(
        { length: NUM_COLUMNS - remainder },
        (_, index) => ({ id: `empty-${index}`, empty: true })
    );

    return [...data, ...placeholders];
};

export default function ChooseStickerScreen() {
    const { avatar } = useLocalSearchParams<{ avatar?: string }>();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    const [selectedSticker, setSelectedSticker] =
        React.useState<string | null>(null);

    const avatarKey = (avatar || "huchiko").toLowerCase();

    const stickers = React.useMemo(
        () => STICKER_SETS[avatarKey] ?? HUCHIKO_STICKERS,
        [avatarKey]
    );

    const gridData = React.useMemo(
        () => withPlaceholders(stickers),
        [stickers]
    );

    if (!fontsLoaded) return null;

    const handleContinue = () => {
        const selected = stickers.find(
            (item) => item.id === selectedSticker
        );

        if (!selected) {
            console.log("Please select a sticker");
            return;
        }

        if (selected.locked) {
            console.log("This sticker is locked");
            return;
        }

        router.push("/OptionalHealthBasicsScreen");
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawMiddleRight]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            <View style={styles.header}>
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                    Choose a Sticker
                </Text>
                <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                    Pick the sticker that matches your
                    pet&apos;s mood.
                </Text>
            </View>

            <FlatList
                data={gridData}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.stickerRow}
                initialNumToRender={15}
                renderItem={({ item }) => {
                    if (item.empty) {
                        return <View style={styles.stickerPlaceholder} />;
                    }

                    const selected = selectedSticker === item.id;
                    const locked = !!item.locked;

                    return (
                        <View style={styles.stickerItemWrapper}>
                            <Pressable
                                disabled={locked}
                                onPress={() => setSelectedSticker(item.id)}
                                style={[
                                    styles.stickerCard,
                                    selected && styles.stickerCardSelected,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    locked
                                        ? `Sticker ${item.id} locked, ${item.cost} points`
                                        : `Sticker ${item.id}`
                                }
                                accessibilityState={{ selected, disabled: locked }}
                            >
                                <Image
                                    source={item.image}
                                    resizeMode="contain"
                                    style={[
                                        styles.stickerImage,
                                        locked && styles.stickerImageLocked,
                                    ]}
                                />

                                {locked && (
                                    <View
                                        style={styles.lockOverlay}
                                        pointerEvents="none"
                                    >
                                        <Ionicons
                                            name="lock-closed"
                                            size={s(30)}
                                            color="#381B0E"
                                        />
                                    </View>
                                )}
                            </Pressable>

                            {locked && (
                                <View style={styles.pointsPill}>
                                    <Ionicons
                                        name="paw"
                                        size={s(16)}
                                        color="#FF7A00"
                                    />
                                    <Text style={styles.pointsText}>
                                        {item.cost}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                }}
            />

            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    title="Continue"
                    onPress={handleContinue}
                    style={styles.continueButton}
                    icon={
                        <Image
                            source={require("../../assets/images/paw-white.png")}
                            resizeMode="contain"
                            style={styles.buttonPaw}
                        />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    header: {
        alignItems: "center",
        paddingHorizontal: s(5),
        paddingTop: height * 0.112,
        marginBottom: s(15),
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(36),
        color: "#FF7A00",
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

    listContent: {
        paddingHorizontal: LIST_PADDING,
        paddingTop: s(1),
        // Continue button ke neeche last row (aur points pill) na chhupe
        paddingBottom: s(130),
    },

    stickerRow: {
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: s(14),
    },

    stickerItemWrapper: {
        width: CARD_WIDTH,
        alignItems: "center",
    },

    stickerCard: {
        width: CARD_WIDTH,
        aspectRatio: 0.9,
        borderRadius: s(20),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    stickerCardSelected: {
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
    },

    stickerPlaceholder: {
        width: CARD_WIDTH,
        aspectRatio: 0.9,
    },

    stickerImage: {
        width: "86%",
        height: "86%",
    },

    stickerImageLocked: {
        opacity: 0.35,
    },

    lockOverlay: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },

    pointsPill: {
        marginTop: s(6),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(12),
        paddingVertical: s(3),
        borderRadius: s(20),
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
        gap: s(5),
    },

    pointsText: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(20),
        lineHeight: s(24),
        color: "#FF7A00",
    },

    backgroundPaw: {
        position: "absolute",
        width: 72 * SCALE,
        height: 72 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    pawTopLeft: {
        top: 28 * SCALE,
        left: 22 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 145 * SCALE,
        right: -15 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawMiddleRight: {
        top: 390 * SCALE,
        right: 0,
        transform: [{ rotate: "-8deg" }],
    },

    pawBottomRight: {
        bottom: 10 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /*
     * List scroll hoti hai, isliye yahan white background hai,
     * warna stickers button ke peeche se dikhte.
     */
    bottomButtonContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: s(6),
        paddingTop: s(10),
        paddingBottom: s(27),
        backgroundColor: "#FFFFFF",
        zIndex: 20,
    },

    continueButton: {
        width: "100%",
        height: s(50),
        borderRadius: s(15),
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
});