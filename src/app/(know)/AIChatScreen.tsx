import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text as RawText,
    View,
} from "react-native";
/* Fixed labels are translated; the user's own messages and the AI's replies are shown exactly as they are. */
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { setTranslationPetName, tr } from "@/i18n/autoTranslate";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { router, useLocalSearchParams } from "expo-router";
import NoPetPopup from "@/components/NoPetPopup";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { petcardApi } from "@/services/petcardApi";
import BottomNav, { useNavHeight } from "../../components/BottomNav";
import { C, s, SIDE } from "../../components/KnowKit";

/* fixed: app-written text (welcome, error), translated on screen. Otherwise typed by the user or written by the AI. */
type Msg = { id: string; from: "bot" | "user"; text: string; fixed?: boolean };

const suggestionsFor = (name: string) => [
    `How much should I feed ${name}?`,
    "Vaccination schedule",
    `Why is ${name} scratching a lot?`,
    "Exercise tips",
];

export default function AiChatScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });

    const { pet, hasPet, loading: petLoading } = useSelectedPet();
    const PET_NAME = pet?.name || "your pet";
    if (pet?.name) setTranslationPetName(pet.name);
    const [messages, setMessages] = useState<Msg[]>([]);
    /* Welcome message selected pet ke naam ke saath; pet badle to chat reset */
    useEffect(() => {
        setMessages([{ id: "welcome", from: "bot", fixed: true, text: `Hi! I'm PawChat AI 🐾 Ask me about ${PET_NAME}'s food, health, training or care!` }]);
    }, [pet?.id, PET_NAME]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [kbVisible, setKbVisible] = useState(false);
    const listRef = useRef<FlatList<Msg>>(null);

    /* A question sent from the Know screen (Featured card) is asked once, as soon as the pet is loaded. */
    const params = useLocalSearchParams<{ ask?: string }>();
    const sendRef = useRef<(text: string) => void>(() => {});
    const sentAsk = useRef<string | null>(null);
    useEffect(() => {
        const ask = typeof params.ask === "string" ? params.ask.trim() : "";
        if (!ask || !fontsLoaded || !hasPet || !pet?.id || sentAsk.current === ask) return;
        sentAsk.current = ask;
        sendRef.current(ask);
    }, [params.ask, fontsLoaded, hasPet, pet?.id]);

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
        if (!clean || typing || !hasPet) return;

        setMessages((p) => [...p, { id: `u${Date.now()}`, from: "user", text: clean }]);
        setInput("");
        setTyping(true);

        try {
            if (!pet?.id) throw new Error("no pet");
            const history = messages.filter((m) => m.id !== "welcome").slice(-8).map((m) => ({ role: m.from === "user" ? ("user" as const) : ("assistant" as const), text: m.text }));
            const { reply } = await petcardApi.aiChat(pet.id, clean, history);
            setMessages((p) => [...p, { id: `b${Date.now()}`, from: "bot", text: reply }]);
        } catch {
            setMessages((p) => [
                ...p,
                { id: `e${Date.now()}`, from: "bot", fixed: true, text: "Sorry, I can't reach PawChat right now. Please check your connection and try again. 🐾" },
            ]);
        } finally {
            setTyping(false);
        }
    };

    sendRef.current = send;

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/HomeScreen" as any));
    const showSuggestions = messages.length === 1 && hasPet;

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
                                        {suggestionsFor(PET_NAME).map((q) => (
                                            <Pressable key={q} style={styles.chip} onPress={() => send(tr(q))}>
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
            <NoPetPopup visible={!petLoading && !hasPet} onLater={goBack} />
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
    const BodyText: React.ElementType = msg.fixed ? Text : RawText;
    if (msg.from === "user") {
        return (
            <View style={styles.userRow}>
                <View style={[styles.bubble, styles.userBubble]}>
                    <BodyText style={styles.userText} maxFontSizeMultiplier={1.1}>
                        {msg.text}
                    </BodyText>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.botRow}>
            <BotAvatar />
            <View style={[styles.bubble, styles.botBubble]}>
                <BodyText style={styles.botText} maxFontSizeMultiplier={1.1}>
                    {msg.text}
                </BodyText>
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