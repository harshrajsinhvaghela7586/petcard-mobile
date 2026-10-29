import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";

const MAX_IMAGES = 6;
const TITLE_MAX = 60;
const NOTE_MAX = 200;

const formatToday = () => {
    const d = new Date();
    const m = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ][d.getMonth()];
    return `${String(d.getDate()).padStart(2, "0")} ${m} ${d.getFullYear()}`;
};

/*
 * Add ke liye: params nahi aayenge.
 * Edit ke liye: MemoryScreen se id, title, date, note (aur optional images JSON) aate hain.
 */
export default function AddMemoryScreen() {
    const [fontsLoaded] = useAppFonts();
    const params = useLocalSearchParams<{
        id?: string;
        title?: string;
        date?: string;
        note?: string;
        images?: string; // JSON string of uri[]
        petName?: string;
    }>();

    const isEdit = !!params.id;
    const petName = params.petName || "your pet";

    const [images, setImages] = useState<string[]>(() => {
        try {
            return params.images ? JSON.parse(params.images) : [];
        } catch {
            return [];
        }
    });
    const [title, setTitle] = useState(params.title ?? "");
    const [date, setDate] = useState(params.date ?? formatToday());
    const [note, setNote] = useState(params.note ?? "");
    const [error, setError] = useState("");

    if (!fontsLoaded) return null;

    const pickImages = async () => {
        const left = MAX_IMAGES - images.length;
        if (left <= 0) {
            Alert.alert("Limit reached", `You can add up to ${MAX_IMAGES} photos.`);
            return;
        }

        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert(
                "Permission needed",
                "Please allow gallery access to add photos."
            );
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: left,
            quality: 0.8,
        });

        if (!res.canceled) {
            setImages((prev) =>
                [...prev, ...res.assets.map((a) => a.uri)].slice(0, MAX_IMAGES)
            );
            setError("");
        }
    };

    const removeImage = (uri: string) =>
        setImages((prev) => prev.filter((u) => u !== uri));

    const handleSave = () => {
        if (images.length === 0) {
            setError("Please add at least one photo.");
            return;
        }
        if (!title.trim()) {
            setError("Please give this memory a title.");
            return;
        }
        // TODO: API call (create / update) yahan lagana
        console.log(isEdit ? "update memory" : "create memory", {
            id: params.id,
            title: title.trim(),
            date,
            note: note.trim(),
            images,
        });
        router.back();
    };

    const handleDelete = () =>
        Alert.alert("Delete memory?", "This can't be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    // TODO: delete API
                    router.back();
                },
            },
        ]);

    const hero = images[0];
    const rest = images.slice(1);

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title={isEdit ? "Edit Memory" : "Add Memory"} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}
                >
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        Capture & save your special moments with {petName}.
                    </Text>

                    {/* IMAGE PREVIEW */}
                    {hero ? (
                        <View style={styles.heroWrap}>
                            <Image source={{ uri: hero }} resizeMode="cover" style={styles.heroImg} />
                            <Pressable
                                onPress={() => removeImage(hero)}
                                style={styles.removeBtn}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Remove photo"
                            >
                                <Ionicons name="close" size={s(16)} color={C.white} />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable onPress={pickImages} style={styles.uploadBox}>
                            <View style={styles.uploadIcon}>
                                <Ionicons name="images-outline" size={s(30)} color={C.orange} />
                                <View style={styles.plus}>
                                    <Ionicons name="add" size={s(14)} color={C.white} />
                                </View>
                            </View>
                            <Text style={styles.uploadTitle} maxFontSizeMultiplier={1.1}>
                                Add Photos
                            </Text>
                            <Text style={styles.uploadHint} maxFontSizeMultiplier={1.1}>
                                Tap to upload from your gallery
                            </Text>
                        </Pressable>
                    )}

                    {/* THUMBNAILS */}
                    {hero ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.thumbRow}
                        >
                            {rest.map((uri) => (
                                <View key={uri} style={styles.thumbWrap}>
                                    <Image source={{ uri }} resizeMode="cover" style={styles.thumb} />
                                    <Pressable
                                        onPress={() => removeImage(uri)}
                                        style={styles.thumbRemove}
                                        hitSlop={8}
                                        accessibilityRole="button"
                                        accessibilityLabel="Remove photo"
                                    >
                                        <Ionicons name="close" size={s(12)} color={C.white} />
                                    </Pressable>
                                </View>
                            ))}

                            {images.length < MAX_IMAGES ? (
                                <Pressable onPress={pickImages} style={styles.thumbAdd}>
                                    <Ionicons name="add" size={s(26)} color={C.orange} />
                                </Pressable>
                            ) : null}
                        </ScrollView>
                    ) : null}

                    {/* TITLE */}
                    <Text style={styles.label} maxFontSizeMultiplier={1.1}>Title</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={title}
                            onChangeText={(t) => {
                                setTitle(t.slice(0, TITLE_MAX));
                                setError("");
                            }}
                            placeholder="Give this memory a title..."
                            placeholderTextColor="#B8A090"
                            style={styles.input}
                            maxFontSizeMultiplier={1.1}
                        />
                    </View>
                    <Text style={styles.counter}>{title.length}/{TITLE_MAX}</Text>

                    {/* DATE */}
                    <Text style={styles.label} maxFontSizeMultiplier={1.1}>Date</Text>
                    <View style={[styles.inputBox, styles.dateBox]}>
                        <TextInput
                            value={date}
                            onChangeText={setDate}
                            placeholder="DD Mon YYYY"
                            placeholderTextColor="#B8A090"
                            style={[styles.input, { flex: 1 }]}
                            maxFontSizeMultiplier={1.1}
                        />
                        <Ionicons name="calendar-outline" size={s(18)} color={C.orange} />
                    </View>

                    {/* NOTE */}
                    <Text style={styles.label} maxFontSizeMultiplier={1.1}>Add a note</Text>
                    <View style={[styles.inputBox, { minHeight: s(110) }]}>
                        <TextInput
                            value={note}
                            onChangeText={(t) => setNote(t.slice(0, NOTE_MAX))}
                            placeholder="Write a note about this memory"
                            placeholderTextColor="#B8A090"
                            style={[styles.input, styles.noteInput]}
                            multiline
                            textAlignVertical="top"
                            maxFontSizeMultiplier={1.1}
                        />
                    </View>
                    <Text style={styles.counter}>{note.length}/{NOTE_MAX}</Text>

                    {error ? (
                        <Text style={styles.error} maxFontSizeMultiplier={1.1}>{error}</Text>
                    ) : null}

                    {isEdit ? (
                        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                            <Ionicons name="trash-outline" size={s(16)} color="#D64545" />
                            <Text style={styles.deleteText} maxFontSizeMultiplier={1.1}>
                                Delete Memory
                            </Text>
                        </Pressable>
                    ) : null}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* SAVE */}
            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title={isEdit ? "Update Memory" : "Save Memory"}
                        onPress={handleSave}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingHorizontal: SIDE, paddingBottom: s(140), paddingTop: s(2) },

    subtitle: {
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(20),
        color: C.brown,
        marginBottom: s(14),
    },

    uploadBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: s(26),
        borderRadius: s(20),
        borderWidth: 1.5,
        borderColor: C.orange,
        borderStyle: "dashed",
        backgroundColor: "#FFFAF4",
    },
    uploadIcon: {
        width: s(64),
        height: s(64),
        borderRadius: s(32),
        backgroundColor: "#FFE0C4",
        alignItems: "center",
        justifyContent: "center",
    },
    plus: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    uploadTitle: { marginTop: s(10), fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    uploadHint: { fontFamily: "Nunito_400Regular", fontSize: s(12), color: C.brown, opacity: 0.7 },

    heroWrap: { borderRadius: s(20), overflow: "hidden", borderWidth: 1.5, borderColor: C.orange },
    heroImg: { width: "100%", aspectRatio: 1.35, backgroundColor: "#FFE0C4" },
    removeBtn: {
        position: "absolute",
        top: s(10),
        right: s(10),
        width: s(28),
        height: s(28),
        borderRadius: s(14),
        backgroundColor: "rgba(56,27,14,0.75)",
        alignItems: "center",
        justifyContent: "center",
    },

    thumbRow: { gap: s(10), paddingTop: s(10), paddingBottom: s(4) },
    thumbWrap: { width: s(64), height: s(64) },
    thumb: { width: "100%", height: "100%", borderRadius: s(12), backgroundColor: "#FFE0C4" },
    thumbRemove: {
        position: "absolute",
        top: -s(5),
        right: -s(5),
        width: s(20),
        height: s(20),
        borderRadius: s(10),
        backgroundColor: "#D64545",
        alignItems: "center",
        justifyContent: "center",
    },
    thumbAdd: {
        width: s(64),
        height: s(64),
        borderRadius: s(12),
        borderWidth: 1.5,
        borderColor: C.orange,
        borderStyle: "dashed",
        backgroundColor: "#FFFAF4",
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        marginTop: s(14),
        marginBottom: s(6),
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
    },
    inputBox: {
        borderRadius: s(14),
        borderWidth: 1,
        borderColor: C.orange,
        backgroundColor: "#FFFAF4",
        paddingHorizontal: s(14),
    },
    dateBox: { flexDirection: "row", alignItems: "center" },
    input: {
        paddingVertical: s(12),
        fontFamily: "Nunito_400Regular",
        fontSize: s(14),
        color: C.brown,
    },
    noteInput: { minHeight: s(100) },
    counter: {
        alignSelf: "flex-end",
        marginTop: s(3),
        fontFamily: "Nunito_400Regular",
        fontSize: s(11),
        color: C.brown,
        opacity: 0.6,
    },
    error: {
        marginTop: s(10),
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(12.5),
        color: "#D64545",
    },

    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(6),
        marginTop: s(18),
        paddingVertical: s(10),
    },
    deleteText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: "#D64545" },

    bottomContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: s(10),
        paddingBottom: s(27),
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },
    buttonWrapper: { width: "96%", maxWidth: 380, position: "relative", alignSelf: "center" },
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