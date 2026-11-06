import React, { useState } from "react";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import ScreenHeader, {
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { petcardApi } from "@/services/petcardApi";

const BROWN = "#381B0E";
const ORANGE = "#FF7A00";
const BORDER = "#E3D3C6";
const PLACEHOLDER = "#A89B90";
const ERROR = "#D64545";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Same limits as the server (contactController.js), so nothing is rejected after pressing Send. */
const LIMITS = {
    nameMin: 2, nameMax: 100,
    emailMax: 254,
    subjectMax: 150,
    messageMin: 5, messageMax: 5000,
};

type Errors = { name?: string; email?: string; subject?: string; message?: string };

function Label({ text, required }: { text: string; required?: boolean }) {
    return (
        <Text style={styles.label} maxFontSizeMultiplier={1.1}>
            {text}
            {required ? <Text style={{ color: ORANGE }}> *</Text> : null}
        </Text>
    );
}

function FieldError({ text }: { text?: string }) {
    if (!text) return null;
    return (
        <Text style={styles.error} maxFontSizeMultiplier={1.1} accessibilityRole="alert">
            {text}
        </Text>
    );
}

export default function ContactUsScreen() {
    const [fontsLoaded] = useAppFonts();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [sending, setSending] = useState(false);

    if (!fontsLoaded) return null;

    const clearError = (key: keyof Errors) => {
        if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        const e: Errors = {};
        const n = name.trim();
        const m = message.trim();
        if (!n) e.name = "Please enter your name.";
        else if (n.length < LIMITS.nameMin) e.name = "Name must be at least 2 characters.";
        if (!email.trim()) e.email = "Please enter your email.";
        else if (!EMAIL_RE.test(email.trim())) e.email = "Please enter a valid email.";
        if (!m) e.message = "Please write your message.";
        else if (m.length < LIMITS.messageMin) e.message = "Message must be at least 5 characters.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSend = async () => {
        if (sending || !validate()) return;
        Keyboard.dismiss();
        setSending(true);
        try {
            const result = await petcardApi.sendContactMessage({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                subject: subject.trim(),
                message: message.trim(),
            });
            Alert.alert("Message sent", result.message || "Thanks for reaching out! Our team will get back to you soon.");
            setName(""); setEmail(""); setSubject(""); setMessage(""); setErrors({});
        } catch (error) {
            Alert.alert("Message not sent", error instanceof Error ? error.message : "Please check your connection and try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Contact Us" />

            {/* The button lives inside this view, so it moves up with the keyboard instead of being hidden by it. */}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.flex}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                    contentContainerStyle={styles.content}
                >
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Send us a <Text style={{ color: ORANGE }}>message</Text>
                    </Text>

                    <Label text="Name" required />
                    <TextInput
                        value={name}
                        onChangeText={(t) => { setName(t); clearError("name"); }}
                        placeholder="Your name"
                        placeholderTextColor={PLACEHOLDER}
                        autoCapitalize="words"
                        autoComplete="name"
                        textContentType="name"
                        returnKeyType="next"
                        maxLength={LIMITS.nameMax}
                        style={[styles.input, errors.name && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                        accessibilityLabel="Name"
                    />
                    <FieldError text={errors.name} />

                    <Label text="Email" required />
                    <TextInput
                        value={email}
                        onChangeText={(t) => { setEmail(t); clearError("email"); }}
                        placeholder="you@example.com"
                        placeholderTextColor={PLACEHOLDER}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        maxLength={LIMITS.emailMax}
                        style={[styles.input, errors.email && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                        accessibilityLabel="Email"
                    />
                    <FieldError text={errors.email} />

                    <Label text="Subject" />
                    <TextInput
                        value={subject}
                        onChangeText={(t) => { setSubject(t); clearError("subject"); }}
                        placeholder="How can we help?"
                        placeholderTextColor={PLACEHOLDER}
                        returnKeyType="next"
                        maxLength={LIMITS.subjectMax}
                        style={styles.input}
                        maxFontSizeMultiplier={1.1}
                        accessibilityLabel="Subject"
                    />

                    <Label text="Message" required />
                    <TextInput
                        value={message}
                        onChangeText={(t) => { setMessage(t); clearError("message"); }}
                        placeholder="Write your message..."
                        placeholderTextColor={PLACEHOLDER}
                        multiline
                        textAlignVertical="top"
                        maxLength={LIMITS.messageMax}
                        style={[styles.input, styles.messageInput, errors.message && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                        accessibilityLabel="Message"
                    />
                    <View style={styles.messageFooter}>
                        <View style={styles.flex}>
                            <FieldError text={errors.message} />
                        </View>
                        <Text style={styles.counter} maxFontSizeMultiplier={1.1}>
                            {message.length}/{LIMITS.messageMax}
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <View style={styles.buttonWrapper}>
                        <PrimaryButton
                            title={sending ? "Sending..." : "Send Message"}
                            onPress={handleSend}
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
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    flex: { flex: 1 },
    content: { paddingHorizontal: SIDE, paddingTop: s(6), paddingBottom: s(24) },

    title: {
        textAlign: "center",
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        lineHeight: s(32),
        color: BROWN,
        marginBottom: s(6),
    },

    label: {
        marginTop: s(14),
        marginBottom: s(6),
        marginLeft: s(4),
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: BROWN,
    },
    input: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: s(16),
        backgroundColor: "#FFFFFF",
        paddingHorizontal: s(16),
        paddingVertical: s(13),
        fontFamily: "Nunito_400Regular",
        fontSize: s(14),
        color: BROWN,
    },
    messageInput: {
        minHeight: s(170),
        borderRadius: s(20),
        paddingTop: s(14),
    },
    inputError: { borderColor: ERROR },
    error: {
        marginTop: s(4),
        marginLeft: s(6),
        fontFamily: "Nunito_700Bold",
        fontSize: s(11.5),
        color: ERROR,
    },
    messageFooter: { flexDirection: "row", alignItems: "flex-start" },
    counter: {
        marginTop: s(4),
        marginRight: s(6),
        fontFamily: "Nunito_400Regular",
        fontSize: s(11.5),
        color: PLACEHOLDER,
    },

    bottomContainer: {
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