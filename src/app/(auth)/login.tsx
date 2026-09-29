import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react-native";

import { FontAwesome } from "@expo/vector-icons";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import PrimaryButton from "@/components/Button/PrimaryButton";

type LanguageCode =
    | "en"
    | "hi"
    | "es"
    | "fr"
    | "de"
    | "nl"
    | "it";

const translations: Record<
    LanguageCode,
    {
        welcome: string;
        subtitle: string;
        login: string;
        signup: string;
        emailLabel: string;
        emailPlaceholder: string;
        passwordLabel: string;
        passwordPlaceholder: string;
        forgotPassword: string;
        signIn: string;
        continueWith: string;
        google: string;
        apple: string;
        noAccount: string;
        signUpLink: string;
    }
> = {
    en: {
        welcome: "Welcome Back!",
        subtitle: "Sign in to continue your pet care journey",
        login: "Login",
        signup: "Sign Up",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email address",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        forgotPassword: "Forgot Password?",
        signIn: "Sign In",
        continueWith: "or continue with",
        google: "Continue with Google",
        apple: "Continue with Apple",
        noAccount: "Don't have an account?",
        signUpLink: "Sign Up",
    },

    hi: {
        welcome: "वापसी पर स्वागत है!",
        subtitle: "अपनी पेट केयर यात्रा जारी रखने के लिए साइन इन करें",
        login: "लॉगिन",
        signup: "साइन अप",
        emailLabel: "ईमेल पता",
        emailPlaceholder: "अपना ईमेल पता दर्ज करें",
        passwordLabel: "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        forgotPassword: "पासवर्ड भूल गए?",
        signIn: "साइन इन",
        continueWith: "या इसके साथ जारी रखें",
        google: "Google के साथ जारी रखें",
        apple: "Apple के साथ जारी रखें",
        noAccount: "क्या आपका अकाउंट नहीं है?",
        signUpLink: "साइन अप",
    },

    es: {
        welcome: "¡Bienvenido de nuevo!",
        subtitle: "Inicia sesión para continuar con el cuidado de tu mascota",
        login: "Iniciar sesión",
        signup: "Registrarse",
        emailLabel: "Correo electrónico",
        emailPlaceholder: "Introduce tu correo electrónico",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Introduce tu contraseña",
        forgotPassword: "¿Olvidaste tu contraseña?",
        signIn: "Iniciar sesión",
        continueWith: "o continuar con",
        google: "Continuar con Google",
        apple: "Continuar con Apple",
        noAccount: "¿No tienes una cuenta?",
        signUpLink: "Regístrate",
    },

    fr: {
        welcome: "Bon retour !",
        subtitle: "Connectez-vous pour continuer votre parcours de soins pour votre animal",
        login: "Connexion",
        signup: "S'inscrire",
        emailLabel: "Adresse e-mail",
        emailPlaceholder: "Entrez votre adresse e-mail",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        forgotPassword: "Mot de passe oublié ?",
        signIn: "Se connecter",
        continueWith: "ou continuer avec",
        google: "Continuer avec Google",
        apple: "Continuer avec Apple",
        noAccount: "Vous n'avez pas de compte ?",
        signUpLink: "S'inscrire",
    },

    de: {
        welcome: "Willkommen zurück!",
        subtitle: "Melden Sie sich an, um Ihre Haustierpflege fortzusetzen",
        login: "Anmelden",
        signup: "Registrieren",
        emailLabel: "E-Mail-Adresse",
        emailPlaceholder: "E-Mail-Adresse eingeben",
        passwordLabel: "Passwort",
        passwordPlaceholder: "Passwort eingeben",
        forgotPassword: "Passwort vergessen?",
        signIn: "Anmelden",
        continueWith: "oder fortfahren mit",
        google: "Mit Google fortfahren",
        apple: "Mit Apple fortfahren",
        noAccount: "Noch kein Konto?",
        signUpLink: "Registrieren",
    },

    nl: {
        welcome: "Welkom terug!",
        subtitle: "Log in om verder te gaan met de verzorging van je huisdier",
        login: "Inloggen",
        signup: "Registreren",
        emailLabel: "E-mailadres",
        emailPlaceholder: "Voer je e-mailadres in",
        passwordLabel: "Wachtwoord",
        passwordPlaceholder: "Voer je wachtwoord in",
        forgotPassword: "Wachtwoord vergeten?",
        signIn: "Inloggen",
        continueWith: "of doorgaan met",
        google: "Doorgaan met Google",
        apple: "Doorgaan met Apple",
        noAccount: "Heb je nog geen account?",
        signUpLink: "Registreren",
    },

    it: {
        welcome: "Bentornato!",
        subtitle: "Accedi per continuare il percorso di cura del tuo animale",
        login: "Accedi",
        signup: "Registrati",
        emailLabel: "Indirizzo e-mail",
        emailPlaceholder: "Inserisci il tuo indirizzo e-mail",
        passwordLabel: "Password",
        passwordPlaceholder: "Inserisci la tua password",
        forgotPassword: "Password dimenticata?",
        signIn: "Accedi",
        continueWith: "oppure continua con",
        google: "Continua con Google",
        apple: "Continua con Apple",
        noAccount: "Non hai un account?",
        signUpLink: "Registrati",
    },
};

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [language, setLanguage] =
        useState<LanguageCode>("en");

    const t = translations[language];

    const handleLogin = async () => {
    try {
        setLoading(true);

        router.push("/PetTypeScreen");

    } catch (error) {
        console.log("Login error:", error);
    } finally {
        setLoading(false);
    }
};

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFDFC"
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >

                {/* ================================
                    LANGUAGE SELECTOR
                ================================= */}

                <View style={styles.topBar}>
                    <LanguageSelector
                        value={language}
                        onChange={(value) =>
                            setLanguage(
                                value as LanguageCode
                            )
                        }
                    />
                </View>

                {/* ================================
                    AUTH LOGO
                ================================= */}

                <View style={styles.logoSection}>
                    <Image
                        source={require("../../../assets/images/auth/authlogo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={
                        styles.scrollContent
                    }
                >

                    {/* ================================
                        HEADING
                    ================================= */}

                    <View style={styles.headingSection}>
                        <Text style={styles.title}>
                            {t.welcome}
                        </Text>

                        <Text style={styles.subtitle}>
                            {t.subtitle}
                        </Text>
                    </View>

                    {/* ================================
                        LOGIN / SIGNUP TOGGLE
                    ================================= */}

                    <View style={styles.authToggle}>

                        <View style={styles.activeToggle}>
                            <Text style={styles.activeToggleText}>
                                {t.login}
                            </Text>
                        </View>

                        <Pressable
                            style={styles.toggleItem}
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/(auth)/signup",
                                    params: {
                                        language,
                                    },
                                })
                            }
                        >
                            <Text
                                style={
                                    styles.inactiveToggleText
                                }
                            >
                                {t.signup}
                            </Text>
                        </Pressable>

                    </View>

                    {/* ================================
                        FORM
                    ================================= */}

                    <View style={styles.form}>

                        {/* Email */}

                        <View style={styles.fieldWrapper}>
                            <Text style={styles.label}>
                                {t.emailLabel}
                            </Text>

                            <View style={styles.inputWrapper}>

                                <Mail
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={
                                        t.emailPlaceholder
                                    }
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />

                            </View>
                        </View>

                        {/* Password */}

                        <View style={styles.fieldWrapper}>
                            <Text style={styles.label}>
                                {t.passwordLabel}
                            </Text>

                            <View style={styles.inputWrapper}>

                                <LockKeyhole
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder={
                                        t.passwordPlaceholder
                                    }
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    secureTextEntry={
                                        !showPassword
                                    }
                                    autoCapitalize="none"
                                    editable={!loading}
                                />

                                <Pressable
                                    onPress={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    hitSlop={10}
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={19}
                                            color="#6F5A4B"
                                        />
                                    ) : (
                                        <Eye
                                            size={19}
                                            color="#6F5A4B"
                                        />
                                    )}
                                </Pressable>

                            </View>
                        </View>

                        {/* ================================
                            FORGOT PASSWORD
                        ================================= */}

                        <View style={styles.forgotRow}>
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/(auth)/forgot-password",
                                        params: {
                                            language,
                                        },
                                    })
                                }
                            >
                                <Text style={styles.forgotText}>
                                    {t.forgotPassword}
                                </Text>
                            </Pressable>
                        </View>

                        {/* ================================
                            SIGN IN
                        ================================= */}

                      <PrimaryButton
    title={loading ? "Loading..." : t.signIn}
    onPress={handleLogin}
    disabled={loading}
   icon={
                                                     <Image
                                                         source={require("../../../assets/images/paw-white.png")}
                                                         resizeMode="contain"
                                                         style={styles.buttonPaw}
                                                     />
                                                 }
/>

                        {/* ================================
                            DIVIDER
                        ================================= */}

                        <View style={styles.dividerRow}>

                            <View style={styles.divider} />

                            <Text style={styles.orText}>
                                {t.continueWith}
                            </Text>

                            <View style={styles.divider} />

                        </View>

                        {/* ================================
                            SOCIAL LOGIN
                        ================================= */}

                        <View style={styles.socialRow}>

                            <Pressable
                                style={styles.socialButton}
                            >
                                <Image
                                    source={require("../../../assets/images/auth/google.png")}
                                    style={
                                        styles.googleIcon
                                    }
                                    resizeMode="contain"
                                />

                                <Text
                                    style={
                                        styles.socialText
                                    }
                                >
                                    {t.google}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.socialButton}
                            >
                                <FontAwesome
                                    name="apple"
                                    size={20}
                                    color="#111111"
                                />

                                <Text
                                    style={
                                        styles.socialText
                                    }
                                >
                                    {t.apple}
                                </Text>
                            </Pressable>

                        </View>

                        {/* ================================
                            SIGN UP LINK
                        ================================= */}

                        <View style={styles.signupRow}>

                            <Text style={styles.signupText}>
                                {t.noAccount}{" "}
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.replace({
                                        pathname:
                                            "/(auth)/signup",
                                        params: {
                                            language,
                                        },
                                    })
                                }
                            >
                                <Text style={styles.signupLink}>
                                    {t.signUpLink}
                                </Text>
                            </Pressable>

                        </View>

                    </View>

                </ScrollView>

                {/* ================================
                    BOTTOM PAWS
                ================================= */}

                <Image
                    source={require("../../../assets/images/paw.png")}
                    style={styles.bottomPawLeft}
                    resizeMode="contain"
                />

                <Image
                    source={require("../../../assets/images/paw.png")}
                    style={styles.bottomPawRight}
                    resizeMode="contain"
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFDFC",
    },

    keyboardView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 23,
        paddingTop: 8,
        paddingBottom: 45,
    },

    /* ================================
        LANGUAGE
    ================================= */

    topBar: {
        alignItems: "flex-end",
        paddingHorizontal: 23,
        paddingTop: 8,
        marginBottom: 8,
        zIndex: 1000,
    },

    /* ================================
        LOGO
    ================================= */

    logoSection: {
        alignItems: "center",
        marginBottom: 18,
        marginTop: 0,
    },

    logo: {
        width: 290,
        height: 135,
    },

    /* ================================
        HEADING
    ================================= */

    headingSection: {
        alignItems: "center",
        marginBottom: 24,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#482719",
        marginBottom: 6,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 12,
        color: "#978B84",
        textAlign: "center",
    },

    /* ================================
        TOGGLE
    ================================= */

    authToggle: {
        height: 45,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F2E3DA",
        backgroundColor: "#FFF9F5",
        flexDirection: "row",
        padding: 2,
        marginBottom: 27,
    },

    toggleItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    activeToggle: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#FF7412",
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    activeToggleText: {
        color: "#F26D1D",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },
 buttonPaw: {
        position: "absolute",

        
        top: "-30%",

        width: 40,
        height: 40,

        marginTop: -11.5,
        marginLeft:20,

        zIndex: 10,
    },

    inactiveToggleText: {
        color: "#432A1E",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },

    /* ================================
        FORM
    ================================= */

    form: {
        width: "100%",
    },

    fieldWrapper: {
        marginBottom: 18,
    },

    label: {
        fontSize: 10,
        fontWeight: "700",
        color: "#56372A",
        marginBottom: 8,
    },

    inputWrapper: {
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E1DE",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    input: {
        flex: 1,
        marginLeft: 9,
        fontSize: 12,
        color: "#3C302A",
        paddingVertical: 9,
    },

    googleIcon: {
        width: 19,
        height: 19,
    },

    /* ================================
        FORGOT
    ================================= */

    forgotRow: {
        alignItems: "flex-end",
        marginTop: -5,
        marginBottom: 25,
    },

    forgotText: {
        fontSize: 10,
        color: "#F16E1C",
        fontWeight: "600",
    },

    /* ================================
        BUTTON
    ================================= */

    signInButton: {
        height: 49,
        borderRadius: 11,
        backgroundColor: "#FF760D",
        alignItems: "center",
        justifyContent: "center",

        elevation: 2,

        shadowColor: "#FF760D",

        shadowOffset: {
            width: 0,
            height: 5,
        },

        shadowOpacity: 0.18,
        shadowRadius: 8,
    },

    signInButtonPressed: {
        transform: [
            {
                scale: 0.985,
            },
        ],
    },

    signInButtonDisabled: {
        opacity: 0.65,
    },

    signInText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
    },

    btnPaw: {
        position: "absolute",
        right: 0,
        width: 50,
        height: 50,
        opacity: 0.3,
    },

    /* ================================
        DIVIDER
    ================================= */

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E6E1DE",
    },

    orText: {
        marginHorizontal: 12,
        fontSize: 10,
        color: "#8D817A",
        textAlign: "center",
    },

    /* ================================
        SOCIAL
    ================================= */

    socialRow: {
        flexDirection: "row",
        gap: 10,
    },

    socialButton: {
        flex: 1,
        height: 41,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#E5E1DE",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
    },

    socialText: {
        marginLeft: 7,
        fontSize: 9.5,
        color: "#3E332D",
        fontWeight: "500",
        textAlign: "center",
        flexShrink: 1,
    },

    /* ================================
        SIGN UP
    ================================= */

    signupRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        flexWrap: "wrap",
    },

    signupText: {
        fontSize: 10,
        color: "#604F46",
        textAlign: "center",
    },

    signupLink: {
        fontSize: 10,
        color: "#F16D1D",
        fontWeight: "700",
        textAlign: "center",
    },

    /* ================================
        PAWS
    ================================= */

    bottomPawLeft: {
        position: "absolute",
        width: 40,
        height: 40,
        bottom: 10,
        left: 16,
        opacity: 0.1,
    },

    bottomPawRight: {
        position: "absolute",
        width: 40,
        height: 40,
        bottom: 25,
        right: 16,
        opacity: 0.1,

        transform: [
            {
                rotate: "8deg",
            },
        ],
    },
});