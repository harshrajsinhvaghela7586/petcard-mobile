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

const { width, height } = Dimensions.get("window");
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

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
        console.log("Selected Avatar:", selectedAvatar);
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
                <Text style={styles.title}>Choose an Avatar</Text>
                <Text style={styles.subtitle}>
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
                                <Text style={styles.customizeTitle}>
                                    Customize More
                                </Text>
                                <Text style={styles.customizeDescription}>
                                    You can change fur, ears, eyes,{"\n"}
                                    body and add fun accessories{"\n"}
                                    in the next step.
                                </Text>
                            </View>

                            <View style={styles.customizeArrow}>
                                <Ionicons
                                    name="arrow-forward"
                                    size={21}
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
        paddingHorizontal: 5,
        paddingTop: height * 0.112,
        marginBottom: 15,
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: 32,
        lineHeight: 36,
        color: "#FF7A00",
        textAlign: "center",
        letterSpacing: 0,
    },

    subtitle: {
        marginTop: 2,
        fontFamily: "Nunito_700Bold",
        fontSize: 20,
        lineHeight: 28,
        color: "#381B0E",
        textAlign: "center",
    },

    listContent: {
        paddingHorizontal: 10,
        paddingTop: 1,
        paddingBottom: 125,
    },

    avatarRow: {
        justifyContent: "space-between",
        marginBottom: 14,
    },

    avatarCard: {
        width: (width - 52) / 3,
        height: 141,
        borderRadius: 20,
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop:10
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
        paddingTop: 106,
        paddingBottom: 8,
    },

    customizeCard: {
        width: "100%",
        height: 107,
        borderRadius: 25,
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        marginTop:85
    },

    customizePressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.94,
    },

    customizeDog: {
        width: 110,
        height: 105,
        marginRight: 5,
        alignSelf: "flex-end",
    },

    customizeTextArea: {
        flex: 1,
        marginLeft: -3,
        paddingRight: 48,
        justifyContent: "center",
        zIndex: 3,
    },

    customizeTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: 20,
        lineHeight: 28,
        color: "#FF7F00",
    },

    customizeDescription: {
        marginTop: 0,
        fontFamily: "Nunito_700Bold",
        fontSize: 12,
        lineHeight: 16,
        color: "#381B0E",
    },

    customizeArrow: {
        position: "absolute",
        right: 6,
        top: "50%",
        marginTop: -21,
        width: 43,
        height: 43,
        borderRadius: 22,
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
        paddingHorizontal: 6,
        paddingBottom: 27,
        backgroundColor: "transparent",
        zIndex: 20,
    },

    continueButton: {
        width: "100%",
        height: 50,
        borderRadius: 15,
    },

    buttonPaw: {
        position: "absolute",


        top: "-30%",

        width: 40,
        height: 40,

        marginTop: -11.5,
        marginLeft: 20,

        zIndex: 10,
    },
});
