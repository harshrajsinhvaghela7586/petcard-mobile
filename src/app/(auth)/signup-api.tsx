import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { mobileAuthApi } from "@/services/mobileAuthApi";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
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
import { router, useLocalSearchParams } from "expo-router";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
} from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import PrimaryButton from "@/components/Button/PrimaryButton";


type LanguageCode = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";

const translations: Record<
    LanguageCode,
    {
        title: string;
        subtitle: string;
        login: string;
        signup: string;
        fullName: string;
        fullNamePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        confirmPassword: string;
        confirmPasswordPlaceholder: string;
        agree: string;
        terms: string;
        and: string;
        privacy: string;
        createAccount: string;
        continueWith: string;
        google: string;
        apple: string;
        alreadyAccount: string;
        loginLink: string;
    }
> = {
    en: {
        title: "Create Your Account",
        subtitle: "Start your pet care journey with PetCard",
        login: "Login",
        signup: "Sign Up",
        fullName: "Full Name",
        fullNamePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        password: "Password",
        passwordPlaceholder: "Create a secure password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm your password",
        agree: "I agree to the",
        terms: "Terms of Use",
        and: "and",
        privacy: "Privacy Policy",
        createAccount: "Create Account",
        continueWith: "or continue with",
        google: "Continue with Google",
        apple: "Continue with Apple",
        alreadyAccount: "Already have an account?",
        loginLink: "Login",
    },
    hi: {
        title: "अपना अकाउंट बनाएं",
        subtitle: "PetCard के साथ अपनी पेट केयर यात्रा शुरू करें",
        login: "लॉगिन",
        signup: "साइन अप",
        fullName: "पूरा नाम",
        fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
        email: "ईमेल पता",
        emailPlaceholder: "अपना ईमेल पता दर्ज करें",
        phone: "फ़ोन नंबर",
        phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
        password: "पासवर्ड",
        passwordPlaceholder: "एक सुरक्षित पासवर्ड बनाएं",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        confirmPasswordPlaceholder: "अपना पासवर्ड फिर से दर्ज करें",
        agree: "मैं सहमत हूँ",
        terms: "उपयोग की शर्तों",
        and: "और",
        privacy: "गोपनीयता नीति",
        createAccount: "अकाउंट बनाएं",
        continueWith: "या इसके साथ जारी रखें",
        google: "Google के साथ जारी रखें",
        apple: "Apple के साथ जारी रखें",
        alreadyAccount: "क्या आपका पहले से अकाउंट है?",
        loginLink: "लॉगिन",
    },
    es: {
        title: "Crea tu cuenta",
        subtitle: "Comienza tu viaje de cuidado de mascotas con PetCard",
        login: "Iniciar sesión",
        signup: "Registrarse",
        fullName: "Nombre completo",
        fullNamePlaceholder: "Introduce tu nombre completo",
        email: "Correo electrónico",
        emailPlaceholder: "Introduce tu correo electrónico",
        phone: "Número de teléfono",
        phonePlaceholder: "Introduce tu número de teléfono",
        password: "Contraseña",
        passwordPlaceholder: "Crea una contraseña segura",
        confirmPassword: "Confirmar contraseña",
        confirmPasswordPlaceholder: "Confirma tu contraseña",
        agree: "Acepto los",
        terms: "Términos de uso",
        and: "y la",
        privacy: "Política de privacidad",
        createAccount: "Crear cuenta",
        continueWith: "o continuar con",
        google: "Continuar con Google",
        apple: "Continuar con Apple",
        alreadyAccount: "¿Ya tienes una cuenta?",
        loginLink: "Iniciar sesión",
    },
    fr: {
        title: "Créez votre compte",
        subtitle: "Commencez votre parcours de soins pour animaux avec PetCard",
        login: "Connexion",
        signup: "S'inscrire",
        fullName: "Nom complet",
        fullNamePlaceholder: "Entrez votre nom complet",
        email: "Adresse e-mail",
        emailPlaceholder: "Entrez votre adresse e-mail",
        phone: "Numéro de téléphone",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        password: "Mot de passe",
        passwordPlaceholder: "Créez un mot de passe sécurisé",
        confirmPassword: "Confirmer le mot de passe",
        confirmPasswordPlaceholder: "Confirmez votre mot de passe",
        agree: "J'accepte les",
        terms: "Conditions d'utilisation",
        and: "et la",
        privacy: "Politique de confidentialité",
        createAccount: "Créer un compte",
        continueWith: "ou continuer avec",
        google: "Continuer avec Google",
        apple: "Continuer avec Apple",
        alreadyAccount: "Vous avez déjà un compte ?",
        loginLink: "Connexion",
    },
    de: {
        title: "Konto erstellen",
        subtitle: "Beginnen Sie Ihre Haustierpflege mit PetCard",
        login: "Anmelden",
        signup: "Registrieren",
        fullName: "Vollständiger Name",
        fullNamePlaceholder: "Vollständigen Namen eingeben",
        email: "E-Mail-Adresse",
        emailPlaceholder: "E-Mail-Adresse eingeben",
        phone: "Telefonnummer",
        phonePlaceholder: "Telefonnummer eingeben",
        password: "Passwort",
        passwordPlaceholder: "Sicheres Passwort erstellen",
        confirmPassword: "Passwort bestätigen",
        confirmPasswordPlaceholder: "Passwort bestätigen",
        agree: "Ich stimme den",
        terms: "Nutzungsbedingungen",
        and: "und der",
        privacy: "Datenschutzerklärung",
        createAccount: "Konto erstellen",
        continueWith: "oder fortfahren mit",
        google: "Mit Google fortfahren",
        apple: "Mit Apple fortfahren",
        alreadyAccount: "Sie haben bereits ein Konto?",
        loginLink: "Anmelden",
    },
    nl: {
        title: "Maak je account aan",
        subtitle: "Begin je huisdierenzorg met PetCard",
        login: "Inloggen",
        signup: "Registreren",
        fullName: "Volledige naam",
        fullNamePlaceholder: "Voer je volledige naam in",
        email: "E-mailadres",
        emailPlaceholder: "Voer je e-mailadres in",
        phone: "Telefoonnummer",
        phonePlaceholder: "Voer je telefoonnummer in",
        password: "Wachtwoord",
        passwordPlaceholder: "Maak een veilig wachtwoord",
        confirmPassword: "Wachtwoord bevestigen",
        confirmPasswordPlaceholder: "Bevestig je wachtwoord",
        agree: "Ik ga akkoord met de",
        terms: "Gebruiksvoorwaarden",
        and: "en het",
        privacy: "Privacybeleid",
        createAccount: "Account aanmaken",
        continueWith: "of doorgaan met",
        google: "Doorgaan met Google",
        apple: "Doorgaan met Apple",
        alreadyAccount: "Heb je al een account?",
        loginLink: "Inloggen",
    },
    it: {
        title: "Crea il tuo account",
        subtitle: "Inizia il tuo percorso di cura degli animali con PetCard",
        login: "Accedi",
        signup: "Registrati",
        fullName: "Nome completo",
        fullNamePlaceholder: "Inserisci il tuo nome completo",
        email: "Indirizzo e-mail",
        emailPlaceholder: "Inserisci il tuo indirizzo e-mail",
        phone: "Numero di telefono",
        phonePlaceholder: "Inserisci il tuo numero di telefono",
        password: "Password",
        passwordPlaceholder: "Crea una password sicura",
        confirmPassword: "Conferma password",
        confirmPasswordPlaceholder: "Conferma la tua password",
        agree: "Accetto i",
        terms: "Termini di utilizzo",
        and: "e la",
        privacy: "Privacy Policy",
        createAccount: "Crea account",
        continueWith: "oppure continua con",
        google: "Continua con Google",
        apple: "Continua con Apple",
        alreadyAccount: "Hai già un account?",
        loginLink: "Accedi",
    },
};

type FieldKey = "name" | "email" | "phone" | "password" | "confirm";

// Focus hone par field screen ke top se itna neeche rakhna hai (px).
const FIELD_TOP_MARGIN = 16;

export default function SignupScreen() {
    const params = useLocalSearchParams<{ language?: string }>();
    const initialLanguage =
        params.language &&
        ["en", "hi", "es", "fr", "de", "nl", "it"].includes(params.language)
            ? (params.language as LanguageCode)
            : "en";

    const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
    const t = translations[language];

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    /* ================================
        FOCUS / SCROLL HELPERS
    ================================= */

    const scrollRef = useRef<ScrollView>(null);
    const formY = useRef(0);
    const fieldY = useRef<Partial<Record<FieldKey, number>>>({});

    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    // Keyboard dikhe to niche extra jagah do, taaki last fields bhi upar scroll ho sakein
    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSub = Keyboard.addListener(showEvent, () =>
            setKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener(hideEvent, () =>
            setKeyboardVisible(false)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const registerField = (key: FieldKey) => (e: LayoutChangeEvent) => {
        fieldY.current[key] = e.nativeEvent.layout.y;
    };

    const scrollToField = (key: FieldKey) => {
        setTimeout(() => {
            const y =
                formY.current + (fieldY.current[key] ?? 0) - FIELD_TOP_MARGIN;
            scrollRef.current?.scrollTo({
                y: Math.max(0, y),
                animated: true,
            });
        }, 250);
    };

    const passwordValid = useMemo(
        () => password.length >= 8,
        [password]
    );

    const passwordsMatch = useMemo(
        () =>
            password.length > 0 &&
            confirmPassword.length > 0 &&
            password === confirmPassword,
        [password, confirmPassword]
    );

    const handleSignup = async () => {
        if (!fullName.trim()) return Alert.alert("Name required", "Enter your full name.");
        const normalizedEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return Alert.alert("Invalid email", "Enter a valid email address.");
        if (phone.trim() && !/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) return Alert.alert("Invalid phone", "Enter a valid phone number.");
        if (password.length < 8) return Alert.alert("Weak password", "Password must contain at least 8 characters.");
        if (password !== confirmPassword) return Alert.alert("Password mismatch", "Passwords do not match.");
        if (!acceptedTerms) return Alert.alert("Terms required", "Please accept the terms to continue.");
        try {
            setLoading(true);
            const result = await mobileAuthApi.signup({ name: fullName.trim(), email: normalizedEmail, phone: phone.trim(), password });
            router.push({ pathname: "/(auth)/verify-otp", params: { email: normalizedEmail, language } });
            Alert.alert("Check your email", result.message || "Verification code sent.");
        } catch (error) {
            Alert.alert("Signup failed", error instanceof Error ? error.message : "Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFDFC"
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                {/* ================================
                    LANGUAGE SELECTOR
                ================================= */}

                <View style={styles.topBar}>
                    <LanguageSelector
                        value={language}
                        onChange={(value) =>
                            setLanguage(value as LanguageCode)
                        }
                    />
                </View>

                {/* ================================
                    TOP LOGO
                ================================= */}

                <View style={styles.logoSection}>
                    <Image
                        source={require("../../../assets/images/auth/authlogo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        styles.scrollContent,
                        keyboardVisible && styles.scrollContentKeyboard,
                    ]}
                >

                    {/* ================================
                        HEADING
                    ================================= */}

                    <View style={styles.headingSection}>
                        <Text style={styles.title}>
                            {t.title}
                        </Text>

                        <Text style={styles.subtitle}>
                            {t.subtitle}
                        </Text>
                    </View>

                    {/* ================================
                        LOGIN / SIGNUP TOGGLE
                    ================================= */}

                    <View style={styles.authToggle}>
                        <Pressable
                            style={styles.toggleItem}
                            onPress={() => router.replace({
                                pathname: "/(auth)/login",
                                params: { language },
                            })}
                        >
                            <Text style={styles.inactiveToggleText}>
                                {t.login}
                            </Text>
                        </Pressable>

                        <View style={styles.activeToggle}>
                            <Text style={styles.activeToggleText}>
                                {t.signup}
                            </Text>
                        </View>
                    </View>

                    {/* ================================
                        FORM
                    ================================= */}

                    <View
                        style={styles.form}
                        onLayout={(e) => {
                            formY.current = e.nativeEvent.layout.y;
                        }}
                    >
                        {/* Full Name */}

                        <View
                            style={styles.fieldWrapper}
                            onLayout={registerField("name")}
                        >
                            <Text style={styles.label}>
                                {t.fullName}
                            </Text>

                            <View style={styles.inputWrapper}>
                                <UserRound
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    ref={nameRef}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder={t.fullNamePlaceholder}
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    autoCapitalize="words"
                                    editable={!loading}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onFocus={() => scrollToField("name")}
                                    onSubmitEditing={() =>
                                        emailRef.current?.focus()
                                    }
                                />
                            </View>
                        </View>

                        {/* Email */}

                        <View
                            style={styles.fieldWrapper}
                            onLayout={registerField("email")}
                        >
                            <Text style={styles.label}>
                                {t.email}
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Mail
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    ref={emailRef}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={t.emailPlaceholder}
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onFocus={() => scrollToField("email")}
                                    onSubmitEditing={() =>
                                        phoneRef.current?.focus()
                                    }
                                />
                            </View>
                        </View>

                        {/* Phone Number */}

                        <View
                            style={styles.fieldWrapper}
                            onLayout={registerField("phone")}
                        >
                            <Text style={styles.label}>
                                {t.phone}
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Phone
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    ref={phoneRef}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder={t.phonePlaceholder}
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    editable={!loading}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onFocus={() => scrollToField("phone")}
                                    onSubmitEditing={() =>
                                        passwordRef.current?.focus()
                                    }
                                />
                            </View>
                        </View>

                        {/* Password */}

                        <View
                            style={styles.fieldWrapper}
                            onLayout={registerField("password")}
                        >
                            <Text style={styles.label}>
                                {t.password}
                            </Text>

                            <View style={styles.inputWrapper}>
                                <LockKeyhole
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    ref={passwordRef}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder={t.passwordPlaceholder}
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    editable={!loading}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onFocus={() => scrollToField("password")}
                                    onSubmitEditing={() =>
                                        confirmRef.current?.focus()
                                    }
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

                        {/* Confirm Password */}

                        <View
                            style={styles.fieldWrapper}
                            onLayout={registerField("confirm")}
                        >
                            <Text style={styles.label}>
                                {t.confirmPassword}
                            </Text>

                            <View
                                style={[
                                    styles.inputWrapper,
                                    confirmPassword.length > 0 &&
                                    !passwordsMatch &&
                                    styles.errorInput,
                                ]}
                            >
                                <LockKeyhole
                                    size={17}
                                    color="#9A9997"
                                    strokeWidth={1.7}
                                />

                                <TextInput
                                    ref={confirmRef}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder={t.confirmPasswordPlaceholder}
                                    placeholderTextColor="#A7A5A3"
                                    style={styles.input}
                                    secureTextEntry={
                                        !showConfirmPassword
                                    }
                                    autoCapitalize="none"
                                    editable={!loading}
                                    returnKeyType="done"
                                    onFocus={() => scrollToField("confirm")}
                                    onSubmitEditing={Keyboard.dismiss}
                                />

                                <Pressable
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    hitSlop={10}
                                >
                                    {showConfirmPassword ? (
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
                            TERMS
                        ================================= */}

                        <Pressable
                            style={styles.termsRow}
                            onPress={() =>
                                setAcceptedTerms(
                                    (prev) => !prev
                                )
                            }
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    acceptedTerms &&
                                    styles.checkboxActive,
                                ]}
                            >
                                {acceptedTerms && (
                                    <Text style={styles.checkmark}>
                                        ✓
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.termsText}>
                                {t.agree}{" "}
                                <Text style={styles.termsLink}>
                                    {t.terms}
                                </Text>{" "}
                                {t.and}{" "}
                                <Text style={styles.termsLink}>
                                    {t.privacy}
                                </Text>
                            </Text>
                        </Pressable>

                        {/* ================================
                            CREATE ACCOUNT
                        ================================= */}

                        <PrimaryButton
                            title={t.createAccount}
                            onPress={handleSignup}
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
                            OR
                        ================================= */}

                        <View style={styles.dividerRow}>
                            <View
                                style={styles.divider}
                            />

                            <Text style={styles.orText}>
                                {t.continueWith}
                            </Text>

                            <View
                                style={styles.divider}
                            />
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
                                    style={styles.googleIcon}
                                    resizeMode="contain"
                                />

                                <Text
                                    style={styles.socialText}
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
                                    style={styles.socialText}
                                >
                                    {t.apple}
                                </Text>
                            </Pressable>
                        </View>

                        {/* ================================
                            LOGIN LINK
                        ================================= */}

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>
                                {t.alreadyAccount}{" "}
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/(auth)/login",
                                        params: { language },
                                    })
                                }
                            >
                                <Text style={styles.loginLink}>
                                    {t.loginLink}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

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
                </ScrollView>

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

    // Keyboard open hone par extra jagah, taaki password/confirm fields upar tak scroll ho sakein
    scrollContentKeyboard: {
        paddingBottom: 320,
    },

    googleIcon: {
        width: 19,
        height: 19,
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
        marginTop: 0,
        marginBottom: 18,
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
        marginBottom: 18,
    },

    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#482719",
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 12,
        color: "#9B8D85",
    },

    /* ================================
       TOGGLE
    ================================= */

    authToggle: {
        height: 43,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F0D9CA",
        backgroundColor: "#FFFDFB",
        flexDirection: "row",
        padding: 2,
        marginBottom: 18,
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    inactiveToggleText: {
        color: "#6C5042",
        fontSize: 13,
        fontWeight: "500",
    },

    activeToggleText: {
        color: "#FF7412",
        fontSize: 13,
        fontWeight: "600",
    },

    /* ================================
       FORM
    ================================= */

    form: {
        width: "100%",
    },

    fieldWrapper: {
        marginBottom: 13,
    },

    label: {
        fontSize: 10,
        fontWeight: "700",
        color: "#5B3B2D",
        marginBottom: 6,
    },

    inputWrapper: {
        minHeight: 43,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E7E3E0",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    errorInput: {
        borderColor: "#E88970",
    },

    input: {
        flex: 1,
        marginLeft: 9,
        fontSize: 12,
        color: "#3C302A",
        paddingVertical: 9,
    },

    /* ================================
       TERMS
    ================================= */

    termsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 1,
        marginBottom: 14,
    },

    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#FF7412",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },

    checkboxActive: {
        backgroundColor: "#FF7412",
    },

    checkmark: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
        lineHeight: 13,
    },

    termsText: {
        flex: 1,
        fontSize: 9.5,
        color: "#6D625C",
        lineHeight: 15,
    },

    termsLink: {
        color: "#E96619",
        fontWeight: "600",
    },

    /* ================================
       DIVIDER
    ================================= */

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 18,
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
    },

    /* ================================
       SOCIAL
    ================================= */

    socialRow: {
        flexDirection: "row",
        gap: 9,
    },

    socialButton: {
        flex: 1,
        minHeight: 39,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#E5E1DE",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 7,
    },

    socialText: {
        marginLeft: 7,
        fontSize: 9.5,
        color: "#4E4038",
        fontWeight: "500",
    },

    /* ================================
       LOGIN
    ================================= */

    loginRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },

    loginText: {
        fontSize: 10,
        color: "#765F53",
    },

    loginLink: {
        fontSize: 10,
        color: "#F26D1D",
        fontWeight: "700",
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
        opacity: 0.10,
    },

    bottomPawRight: {
        position: "absolute",
        width: 40,
        height: 40,
        bottom: 25,
        right: 16,
        opacity: 0.10,
        transform: [
            {
                rotate: "8deg",
            },
        ],
    },
});