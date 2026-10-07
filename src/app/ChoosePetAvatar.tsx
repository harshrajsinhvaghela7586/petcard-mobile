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
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, image,
 * icon size...) is multiplied by the same scale factor, so the screen
 * looks like the design (393 x 852) on every device.
 *
 * - Small phones  -> everything shrinks proportionally
 * - Medium phones -> ~ same as design
 * - Large phones  -> grows proportionally, capped at 1.3
 */
const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

/*
 * Avatar grid (3 columns)
 * Same math as before ((width - 52) / 3 on the 393 design):
 * 10px side padding on both sides + 16px gap between the 3 cards.
 * Padding and gap are scaled, card width fills the rest,
 * so the 3 cards always fit exactly on every screen width.
 */
const LIST_PADDING = s(10);
const CARD_GAP = s(16);
const AVATAR_CARD_WIDTH =
    (width - LIST_PADDING * 2 - CARD_GAP * 2) / 3;

// Temporary frontend data. Replace this array with API response later.
const AVATAR_DATA = [
    {
        id: "dog-1",
        type: "dog",
        image: require("../../assets/images/chooseAvatar/dog.png"),
    },
    {
        id: "cat-1",
        type: "cat",
        image: require("../../assets/images/chooseAvatar/cat.png"),
    },
    {
        id: "rabbit-1",
        type: "rabbit",
        image: require("../../assets/images/chooseAvatar/rabbit.png"),
    },
];

export default function ChooseAvatarScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    const [selectedAvatar, setSelectedAvatar] =
        React.useState<string | null>(null);

    if (!fontsLoaded) return null;

    const handleAvatarSelect = (id: string) => {
        setSelectedAvatar(id);
    };

    const handleCustomize = () => {
        console.log("Customize More");
    };

    const handleContinue = () => {
       router.push("/ChooseStickerScreen")
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
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>Choose an Avatar</Text>
                <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                    Select an avatar that looks just like your
                    pet.
                </Text>
            </View>

            <FlatList
                data={AVATAR_DATA}
                keyExtractor={(item) => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.avatarRow}
                renderItem={({ item }) => {
                    const selected = selectedAvatar === item.id;

                    return (
                        <Pressable
                            onPress={() => handleAvatarSelect(item.id)}
                            style={[
                                styles.avatarCard,
                                selected && styles.avatarCardSelected,
                            ]}
                        >
                            <Image
                                source={item.image}
                                resizeMode="contain"
                                style={styles.avatarImage}
                            />
                        </Pressable>
                    );
                }}
                ListFooterComponent={
                    <View style={styles.footerContent}>
                        <Pressable
                            onPress={handleCustomize}
                            style={({ pressed }) => [
                                styles.customizeCard,
                                pressed && styles.customizePressed,
                            ]}
                        >
                            <Image
                                source={require("../../assets/images/chooseAvatar/Customizedog.png")}
                                resizeMode="contain"
                                style={styles.customizeDog}
                            />

                            <View style={styles.customizeTextArea}>
                                <Text style={styles.customizeTitle} maxFontSizeMultiplier={1.1}>
                                    Customize More
                                </Text>
                                <Text style={styles.customizeDescription} maxFontSizeMultiplier={1.1}>
                                    You can change fur, ears, eyes,{"\n"}
                                    body and add fun accessories{"\n"}
                                    in the next step.
                                </Text>
                            </View>

                            <View style={styles.customizeArrow}>
                                <Ionicons
                                    name="arrow-forward"
                                    size={s(21)}
                                    color="#FF7A00"
                                />
                            </View>
                        </Pressable>
                    </View>
                }
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
        paddingBottom: s(125),
    },

    avatarRow: {
        justifyContent: "space-between",
        marginBottom: s(14),
    },

    avatarCard: {
        width: AVATAR_CARD_WIDTH,
        height: s(141),
        borderRadius: s(20),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: s(10),
    },

    avatarCardSelected: {
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
    },

    avatarImage: {
        width: "92%",
        height: "94%",
    },

    footerContent: {
        paddingTop: s(106),
        paddingBottom: s(8),
    },

    customizeCard: {
        width: "100%",
        height: s(107),
        borderRadius: s(25),
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        marginTop: s(155),
    },

    customizePressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },

    customizeDog: {
        width: s(110),
        height: s(105),
        marginRight: s(5),
        alignSelf: "flex-end",
    },

    customizeTextArea: {
        flex: 1,
        marginLeft: s(-3),
        paddingRight: s(48),
        justifyContent: "center",
        zIndex: 3,
    },

    customizeTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#FF7F00",
    },

    customizeDescription: {
        marginTop: 0,
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#381B0E",
    },

    customizeArrow: {
        position: "absolute",
        right: s(6),
        top: "50%",
        marginTop: s(-21),
        width: s(43),
        height: s(43),
        borderRadius: s(22),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
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

    bottomButtonContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: s(6),
        paddingBottom: s(27),
        backgroundColor: "transparent",
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