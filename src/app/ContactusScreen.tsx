import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import PrimaryButton from "@/components/Button/PrimaryButton";

const BROWN = "#381B0E";
const ORANGE = "#FF7A00";
const BORDER = "#E3D3C6";
const PLACEHOLDER = "#A89B90";
const ERROR = "#D64545";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; message?: string };

function Label({ text, required }: { text: string; required?: boolean }) {
    return (
        <Text style={styles.label} maxFontSizeMultiplier={1.1}>
            {text}
            {required ? <Text style={{ color: ORANGE }}> *</Text> : null}
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

    const validate = () => {
        const e: Errors = {};
        if (!name.trim()) e.name = "Please enter your name.";
        if (!email.trim()) e.email = "Please enter your email.";
        else if (!EMAIL_RE.test(email.trim())) e.email = "Please enter a valid email.";
        if (!message.trim()) e.message = "Please write your message.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSend = async () => {
        if (sending || !validate()) return;
        setSending(true);
        try {
            // TODO: backend API yahan lagana
            console.log("contact message", {
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
            });
            Alert.alert("Message sent", "Thanks for reaching out! Our team will get back to you soon.");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setErrors({});
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Contact Us" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}
                >
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Send us a <Text style={{ color: ORANGE }}>message</Text>
                    </Text>

                    <Label text="Name" required />
                    <TextInput
                        value={name}
                        onChangeText={(t) => {
                            setName(t);
                            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                        }}
                        placeholder="Your name"
                        placeholderTextColor={PLACEHOLDER}
                        autoCapitalize="words"
                        style={[styles.input, errors.name && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                    />
                    {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

                    <Label text="Email" required />
                    <TextInput
                        value={email}
                        onChangeText={(t) => {
                            setEmail(t);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        placeholder="you@example.com"
                        placeholderTextColor={PLACEHOLDER}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, errors.email && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                    />
                    {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

                    <Label text="Subject" />
                    <TextInput
                        value={subject}
                        onChangeText={setSubject}
                        placeholder="How can we help?"
                        placeholderTextColor={PLACEHOLDER}
                        style={styles.input}
                        maxFontSizeMultiplier={1.1}
                    />

                    <Label text="Message" required />
                    <TextInput
                        value={message}
                        onChangeText={(t) => {
                            setMessage(t);
                            if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                        }}
                        placeholder="Write your message..."
                        placeholderTextColor={PLACEHOLDER}
                        multiline
                        textAlignVertical="top"
                        style={[styles.input, styles.messageInput, errors.message && styles.inputError]}
                        maxFontSizeMultiplier={1.1}
                    />
                    {errors.message ? <Text style={styles.error}>{errors.message}</Text> : null}
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title={sending ? "Sending..." : "Send Message"}
                        onPress={handleSend}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    content: { paddingHorizontal: SIDE, paddingTop: s(6), paddingBottom: s(140) },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(26),
        lineHeight: s(32),
        color: BROWN,
        marginBottom: s(6),
    },

    label: {
        marginTop: s(14),
        marginBottom: s(6),
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