import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import BottomNav, { useNavHeight } from "../../components/BottomNav";
import { C, s, SIDE } from "../../components/KnowKit";

const PET_NAME = "Milo";

type Msg = { id: string; from: "bot" | "user"; text: string };

const SUGGESTIONS = [
    "How much should I feed Milo?",
    "Vaccination schedule",
    "Why is Milo scratching a lot?",
    "Exercise tips",
];

/*
 * ABHI MOCK REPLY HAI.
 * Real AI jodne ke liye bas ye function replace karo
 * (apni API call karke text return karo).
 */
async function getBotReply(question: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 900));
    const q = question.toLowerCase();

    if (q.includes("feed") || q.includes("food") || q.includes("diet"))
        return `Adult dogs usually do best with 2 meals a day. Exact quantity ${PET_NAME} ke weight, age aur activity pe depend karti hai, to food packet ka feeding chart dekho aur vet se confirm kar lo. Fresh water hamesha available rakho. 🥣`;
    if (q.includes("vaccin"))
        return `Puppies ko usually 6–8 weeks se vaccines shuru hote hain (jaise DHPP), phir boosters aur rabies vaccine. Adult dogs ko yearly boosters lagte hain. ${PET_NAME} ka exact schedule apne vet se confirm karo. 💉`;
    if (q.includes("scratch") || q.includes("itch"))
        return `Zyada scratching ke common reasons: fleas/ticks, allergies, dry skin. Skin pe redness, hair loss ya wounds dikhein to vet ko dikhana best rahega. 🐾`;
    if (q.includes("exercise") || q.includes("walk") || q.includes("play"))
        return `Zyada tar dogs ko roz 30–60 minute walk ya play chahiye hota hai. Breed aur age ke hisaab se kam-zyada ho sakta hai. 🎾`;

    return `Achha sawal hai! ${PET_NAME} ke baare me aur detail batao to main behtar help kar paunga. Serious health issue ho to vet se zaroor milo. 🐶`;
}

export default function AiChatScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });

    const [messages, setMessages] = useState<Msg[]>([
        {
            id: "welcome",
            from: "bot",
            text: `Hi! I'm PawChat AI 🐾 Ask me anything about ${PET_NAME}'s food, health, training or care!`,
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [kbVisible, setKbVisible] = useState(false);
    const listRef = useRef<FlatList<Msg>>(null);

    useEffect(() => {
        const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
        const a = Keyboard.addListener(showEvt, () => setKbVisible(true));
        const b = Keyboard.addListener(hideEvt, () => setKbVisible(false));
        return () => {
            a.remove();
            b.remove();
        };
    }, []);

    useEffect(() => {
        const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
        return () => clearTimeout(t);
    }, [messages, typing]);

    if (!fontsLoaded) return null;

    const send = async (text: string) => {
        const clean = text.trim();
        if (!clean || typing) return;

        setMessages((p) => [...p, { id: `u${Date.now()}`, from: "user", text: clean }]);
        setInput("");
        setTyping(true);

        try {
            const reply = await getBotReply(clean);
            setMessages((p) => [...p, { id: `b${Date.now()}`, from: "bot", text: reply }]);
        } catch {
            setMessages((p) => [
                ...p,
                { id: `e${Date.now()}`, from: "bot", text: "Oops, kuch gadbad ho gayi. Thodi der baad try karo. 🐾" },
            ]);
        } finally {
            setTyping(false);
        }
    };

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/HomeScreen" as any));
    const showSuggestions = messages.length === 1;

    /* keyboard khula ho to nav hide, input bar neeche chipak jaye */
    const inputBottom = kbVisible ? s(10) : NAV_HEIGHT + s(30);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* HEADER */}
                <View style={[styles.header, { paddingTop: insets.top + s(8) }]}>
                    <Pressable onPress={goBack} style={styles.headerSlot} hitSlop={8}>
                        <Ionicons name="arrow-back" size={s(26)} color={C.brown} />
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <View style={styles.botAvatarLg}>
                            <MaterialCommunityIcons name="robot-happy" size={s(24)} color={C.orange} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                PawChat AI
                            </Text>
                            <View style={styles.onlineRow}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.onlineText} maxFontSizeMultiplier={1.1}>
                                    Online
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerSlot} />
                </View>

                {/* MESSAGES */}
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(m) => m.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => <Bubble msg={item} />}
                    ListFooterComponent={
                        <>
                            {typing ? (
                                <View style={styles.botRow}>
                                    <BotAvatar />
                                    <View style={[styles.bubble, styles.botBubble]}>
                                        <Text style={styles.typing} maxFontSizeMultiplier={1.1}>
                                            PawChat is typing…
                                        </Text>
                                    </View>
                                </View>
                            ) : null}

                            {showSuggestions ? (
                                <View style={styles.suggestWrap}>
                                    <Text style={styles.suggestLabel} maxFontSizeMultiplier={1.1}>
                                        Try asking
                                    </Text>
                                    <View style={styles.chips}>
                                        {SUGGESTIONS.map((q) => (
                                            <Pressable key={q} style={styles.chip} onPress={() => send(q)}>
                                                <Text style={styles.chipText} maxFontSizeMultiplier={1.1}>
                                                    {q}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            ) : null}
                        </>
                    }
                />

                {/* INPUT */}
                <View style={[styles.inputBar, { paddingBottom: inputBottom }]}>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder={`Ask anything about ${PET_NAME}...`}
                            placeholderTextColor={C.muted}
                            style={styles.input}
                            multiline
                            maxFontSizeMultiplier={1.1}
                            onSubmitEditing={() => send(input)}
                        />
                    </View>
                    <Pressable
                        onPress={() => send(input)}
                        disabled={!input.trim() || typing}
                        style={[styles.sendBtn, (!input.trim() || typing) && { opacity: 0.5 }]}
                    >
                        <Ionicons name="send" size={s(18)} color={C.white} />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* BOTTOM NAV: paw button active (white + orange paw) */}
            {!kbVisible ? <BottomNav /> : null}
        </View>
    );
}

function BotAvatar() {
    return (
        <View style={styles.botAvatar}>
            <MaterialCommunityIcons name="robot-happy" size={s(18)} color={C.orange} />
        </View>
    );
}

function Bubble({ msg }: { msg: Msg }) {
    if (msg.from === "user") {
        return (
            <View style={styles.userRow}>
                <View style={[styles.bubble, styles.userBubble]}>
                    <Text style={styles.userText} maxFontSizeMultiplier={1.1}>
                        {msg.text}
                    </Text>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.botRow}>
            <BotAvatar />
            <View style={[styles.bubble, styles.botBubble]}>
                <Text style={styles.botText} maxFontSizeMultiplier={1.1}>
                    {msg.text}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.cream, overflow: "hidden" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE,
        paddingBottom: s(10),
        backgroundColor: C.card,
        borderBottomWidth: 1,
        borderBottomColor: C.peachBorder,
    },
    headerSlot: { width: s(44), height: s(44), alignItems: "center", justifyContent: "center" },
    headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: s(10) },
    botAvatarLg: {
        width: s(40),
        height: s(40),
        borderRadius: s(20),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(19), lineHeight: s(24), color: C.brown },
    onlineRow: { flexDirection: "row", alignItems: "center", gap: s(5) },
    onlineDot: { width: s(8), height: s(8), borderRadius: s(4), backgroundColor: C.green },
    onlineText: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },

    list: { paddingHorizontal: SIDE, paddingVertical: s(14), gap: s(10), flexGrow: 1 },

    botRow: { flexDirection: "row", alignItems: "flex-end", gap: s(8), maxWidth: "88%" },
    userRow: { flexDirection: "row", justifyContent: "flex-end" },
    botAvatar: {
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    bubble: {
        paddingHorizontal: s(14),
        paddingVertical: s(10),
        borderRadius: s(18),
        flexShrink: 1,
    },
    botBubble: {
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderBottomLeftRadius: s(4),
    },
    userBubble: {
        backgroundColor: C.orange,
        borderBottomRightRadius: s(4),
        maxWidth: "82%",
    },
    botText: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), lineHeight: s(20), color: C.brown },
    userText: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), lineHeight: s(20), color: C.white },
    typing: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.muted },

    suggestWrap: { marginTop: s(8) },
    suggestLabel: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.muted, marginBottom: s(8) },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: s(8) },
    chip: {
        paddingHorizontal: s(12),
        paddingVertical: s(8),
        borderRadius: s(16),
        backgroundColor: C.peach,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    chipText: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },

    inputBar: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: s(8),
        paddingHorizontal: SIDE,
        paddingTop: s(10),
        backgroundColor: C.cream,
    },
    inputBox: {
        flex: 1,
        minHeight: s(44),
        maxHeight: s(120),
        borderRadius: s(22),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        paddingHorizontal: s(16),
        justifyContent: "center",
    },
    input: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),
        color: C.brown,
        paddingVertical: s(8),
    },
    sendBtn: {
        width: s(44),
        height: s(44),
        borderRadius: s(22),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
});