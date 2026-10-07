import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react-native";

import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { mobileAuthApi } from "@/services/mobileAuthApi";

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
    back: string;
    forgotTitle: string;
    resetTitle: string;
    emailSubtitle: string;
    resetSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmLabel: string;
    confirmPlaceholder: string;
    sendCode: string;
    resetPassword: string;
    useDifferentEmail: string;
  }
> = {
  en: {
    back: "Back",
    forgotTitle: "Forgot Password?",
    resetTitle: "Reset Password",
    emailSubtitle:
      "Enter your registered email and we’ll send you a reset code.",
    resetSubtitle: "Enter the 6-digit code sent to your email and choose a new password.",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email address",
    codeLabel: "6-Digit Code",
    codePlaceholder: "Enter code",
    passwordLabel: "New Password",
    passwordPlaceholder: "At least 8 characters",
    confirmLabel: "Confirm Password",
    confirmPlaceholder: "Re-enter new password",
    sendCode: "Send Reset Code",
    resetPassword: "Reset Password",
    useDifferentEmail: "Use a different email",
  },
  hi: {
    back: "वापस",
    forgotTitle: "पासवर्ड भूल गए?",
    resetTitle: "पासवर्ड रीसेट करें",
    emailSubtitle: "अपना ईमेल दर्ज करें। हम आपको रीसेट कोड भेजेंगे।",
    resetSubtitle: "ईमेल पर भेजा गया 6 अंकों का कोड और नया पासवर्ड दर्ज करें।",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    codeLabel: "6 अंकों का कोड",
    codePlaceholder: "कोड दर्ज करें",
    passwordLabel: "नया पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षर",
    confirmLabel: "पासवर्ड की पुष्टि करें",
    confirmPlaceholder: "पासवर्ड दोबारा दर्ज करें",
    sendCode: "रीसेट कोड भेजें",
    resetPassword: "पासवर्ड रीसेट करें",
    useDifferentEmail: "दूसरा ईमेल इस्तेमाल करें",
  },
  es: {
    back: "Atrás",
    forgotTitle: "¿Olvidaste tu contraseña?",
    resetTitle: "Restablecer contraseña",
    emailSubtitle: "Introduce tu correo registrado para recibir un código.",
    resetSubtitle: "Introduce el código de 6 dígitos y elige una nueva contraseña.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Introduce tu correo",
    codeLabel: "Código de 6 dígitos",
    codePlaceholder: "Introduce el código",
    passwordLabel: "Nueva contraseña",
    passwordPlaceholder: "Al menos 8 caracteres",
    confirmLabel: "Confirmar contraseña",
    confirmPlaceholder: "Repite la contraseña",
    sendCode: "Enviar código",
    resetPassword: "Restablecer contraseña",
    useDifferentEmail: "Usar otro correo",
  },
  fr: {
    back: "Retour",
    forgotTitle: "Mot de passe oublié ?",
    resetTitle: "Réinitialiser le mot de passe",
    emailSubtitle: "Saisissez votre e-mail pour recevoir un code.",
    resetSubtitle: "Saisissez le code à 6 chiffres et choisissez un nouveau mot de passe.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "Saisissez votre e-mail",
    codeLabel: "Code à 6 chiffres",
    codePlaceholder: "Saisissez le code",
    passwordLabel: "Nouveau mot de passe",
    passwordPlaceholder: "Au moins 8 caractères",
    confirmLabel: "Confirmer le mot de passe",
    confirmPlaceholder: "Saisissez à nouveau le mot de passe",
    sendCode: "Envoyer le code",
    resetPassword: "Réinitialiser",
    useDifferentEmail: "Utiliser un autre e-mail",
  },
  de: {
    back: "Zurück",
    forgotTitle: "Passwort vergessen?",
    resetTitle: "Passwort zurücksetzen",
    emailSubtitle: "Gib deine E-Mail-Adresse ein, um einen Code zu erhalten.",
    resetSubtitle: "Gib den 6-stelligen Code und ein neues Passwort ein.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "E-Mail-Adresse eingeben",
    codeLabel: "6-stelliger Code",
    codePlaceholder: "Code eingeben",
    passwordLabel: "Neues Passwort",
    passwordPlaceholder: "Mindestens 8 Zeichen",
    confirmLabel: "Passwort bestätigen",
    confirmPlaceholder: "Passwort erneut eingeben",
    sendCode: "Code senden",
    resetPassword: "Passwort zurücksetzen",
    useDifferentEmail: "Andere E-Mail verwenden",
  },
  nl: {
    back: "Terug",
    forgotTitle: "Wachtwoord vergeten?",
    resetTitle: "Wachtwoord opnieuw instellen",
    emailSubtitle: "Voer je e-mailadres in om een code te ontvangen.",
    resetSubtitle: "Voer de 6-cijferige code en een nieuw wachtwoord in.",
    emailLabel: "E-mailadres",
    emailPlaceholder: "Voer je e-mailadres in",
    codeLabel: "6-cijferige code",
    codePlaceholder: "Voer de code in",
    passwordLabel: "Nieuw wachtwoord",
    passwordPlaceholder: "Minimaal 8 tekens",
    confirmLabel: "Bevestig wachtwoord",
    confirmPlaceholder: "Voer wachtwoord opnieuw in",
    sendCode: "Code verzenden",
    resetPassword: "Wachtwoord wijzigen",
    useDifferentEmail: "Ander e-mailadres gebruiken",
  },
  it: {
    back: "Indietro",
    forgotTitle: "Password dimenticata?",
    resetTitle: "Reimposta password",
    emailSubtitle: "Inserisci la tua e-mail per ricevere un codice.",
    resetSubtitle: "Inserisci il codice di 6 cifre e scegli una nuova password.",
    emailLabel: "Indirizzo e-mail",
    emailPlaceholder: "Inserisci la tua e-mail",
    codeLabel: "Codice a 6 cifre",
    codePlaceholder: "Inserisci il codice",
    passwordLabel: "Nuova password",
    passwordPlaceholder: "Almeno 8 caratteri",
    confirmLabel: "Conferma password",
    confirmPlaceholder: "Inserisci nuovamente la password",
    sendCode: "Invia codice",
    resetPassword: "Reimposta password",
    useDifferentEmail: "Usa un'altra e-mail",
  },
};

type FieldKey = "email" | "otp" | "password" | "confirm";

// Focus hone par field screen ke top se itna neeche rakhna hai (px).
const FIELD_TOP_MARGIN = 16;

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ language?: string }>();

  const initialLanguage = (
    ["en", "hi", "es", "fr", "de", "nl", "it"].includes(
      params.language || ""
    )
      ? params.language
      : "en"
  ) as LanguageCode;

  const [language, setLanguage] =
    useState<LanguageCode>(initialLanguage);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [stage, setStage] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const t = translations[language];

  /* ================================
      FOCUS / SCROLL HELPERS
  ================================= */

  const scrollRef = useRef<ScrollView>(null);
  const formY = useRef(0);
  const fieldY = useRef<Partial<Record<FieldKey, number>>>({});

  const emailRef = useRef<TextInput>(null);
  const otpRef = useRef<TextInput>(null);
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

  const sendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const result = await mobileAuthApi.forgotPassword(normalizedEmail);

      setEmail(normalizedEmail);
      setStage("reset");

      Alert.alert(
        "Check your email",
        result.message ||
          "If a verified account exists, a reset code has been sent."
      );
    } catch (error) {
      Alert.alert(
        "Request failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid code", "Enter the 6-digit code from your email.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await mobileAuthApi.resetPassword({
        email,
        otp,
        newPassword: password,
      });

      Alert.alert(
        "Password reset",
        result.message || "Password reset successfully.",
        [
          {
            text: "Sign in",
            onPress: () =>
              router.replace({
                pathname: "/(auth)/login",
                params: { language },
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Reset failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const backToEmailStage = () => {
    setStage("email");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    fieldY.current = {};
  };

  const handleBack = () => {
    if (stage === "reset") {
      backToEmailStage();
      return;
    }

    router.back();
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
        {/* Language selector */}
        <View style={styles.topBar}>
          <LanguageSelector
            value={language}
            onChange={(value) => setLanguage(value as LanguageCode)}
          />
        </View>

        {/* PetCard logo */}
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
          {/* Back */}
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={21} color="#382018" />
            <Text style={styles.backText}>{t.back}</Text>
          </Pressable>

          {/* Heading */}
          <View style={styles.headingSection}>
            <View style={styles.iconCircle}>
              <LockKeyhole size={27} color="#FF7A00" />
            </View>

            <Text style={styles.title}>
              {stage === "email" ? t.forgotTitle : t.resetTitle}
            </Text>

            <Text style={styles.subtitle}>
              {stage === "email"
                ? t.emailSubtitle
                : `${t.resetSubtitle}\n${email}`}
            </Text>
          </View>

          <View
            style={styles.form}
            onLayout={(e) => {
              formY.current = e.nativeEvent.layout.y;
            }}
          >
            {stage === "email" ? (
              <>
                <View
                  style={styles.fieldWrapper}
                  onLayout={registerField("email")}
                >
                  <Text style={styles.label}>{t.emailLabel}</Text>

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
                      returnKeyType="send"
                      onFocus={() => scrollToField("email")}
                      onSubmitEditing={sendCode}
                    />
                  </View>
                </View>

                <PrimaryButton
                  title={loading ? "Please wait..." : t.sendCode}
                  onPress={sendCode}
                  disabled={loading}
                  icon={
                    <Image
                      source={require("../../../assets/images/paw-white.png")}
                      resizeMode="contain"
                      style={styles.buttonPaw}
                    />
                  }
                />
              </>
            ) : (
              <>
                <View
                  style={styles.fieldWrapper}
                  onLayout={registerField("otp")}
                >
                  <Text style={styles.label}>{t.codeLabel}</Text>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={otpRef}
                      value={otp}
                      onChangeText={(value) => {
                        const cleaned = value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setOtp(cleaned);
                        // 6 digit poore hote hi password field par chale jao
                        if (cleaned.length === 6) {
                          passwordRef.current?.focus();
                        }
                      }}
                      placeholder={t.codePlaceholder}
                      placeholderTextColor="#A7A5A3"
                      style={styles.input}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!loading}
                      onFocus={() => scrollToField("otp")}
                    />
                  </View>
                </View>

                <View
                  style={styles.fieldWrapper}
                  onLayout={registerField("password")}
                >
                  <Text style={styles.label}>{t.passwordLabel}</Text>

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
                      onPress={() => setShowPassword((prev) => !prev)}
                      hitSlop={10}
                    >
                      {showPassword ? (
                        <EyeOff size={19} color="#6F5A4B" />
                      ) : (
                        <Eye size={19} color="#6F5A4B" />
                      )}
                    </Pressable>
                  </View>
                </View>

                <View
                  style={styles.fieldWrapper}
                  onLayout={registerField("confirm")}
                >
                  <Text style={styles.label}>{t.confirmLabel}</Text>

                  <View style={styles.inputWrapper}>
                    <LockKeyhole
                      size={17}
                      color="#9A9997"
                      strokeWidth={1.7}
                    />

                    <TextInput
                      ref={confirmRef}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder={t.confirmPlaceholder}
                      placeholderTextColor="#A7A5A3"
                      style={styles.input}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!loading}
                      returnKeyType="done"
                      onFocus={() => scrollToField("confirm")}
                      onSubmitEditing={Keyboard.dismiss}
                    />

                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      hitSlop={10}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} color="#6F5A4B" />
                      ) : (
                        <Eye size={19} color="#6F5A4B" />
                      )}
                    </Pressable>
                  </View>
                </View>

                <PrimaryButton
                  title={loading ? "Please wait..." : t.resetPassword}
                  onPress={resetPassword}
                  disabled={loading}
                  icon={
                    <Image
                      source={require("../../../assets/images/paw-white.png")}
                      resizeMode="contain"
                      style={styles.buttonPaw}
                    />
                  }
                />

                <Pressable
                  style={styles.differentEmail}
                  onPress={backToEmailStage}
                  disabled={loading}
                >
                  <Text style={styles.differentEmailText}>
                    {t.useDifferentEmail}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

        {/* Decorative paws */}
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

  topBar: {
    alignItems: "flex-end",
    paddingHorizontal: 23,
    paddingTop: 8,
    marginBottom: 8,
    zIndex: 1000,
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 0,
  },

  logo: {
    width: 290,
    height: 135,
  },

  scrollContent: {
    paddingHorizontal: 23,
    paddingTop: 8,
    paddingBottom: 45,
  },

  // Keyboard open hone par extra jagah, taaki niche wale fields upar tak scroll ho sakein
  scrollContentKeyboard: {
    paddingBottom: 320,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 18,
  },

  backText: {
    color: "#382018",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 2,
  },

  headingSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF0E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#482719",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: "#978B84",
    textAlign: "center",
    paddingHorizontal: 8,
  },

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
    minHeight: 45,
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

  buttonPaw: {
    position: "absolute",
    top: "-30%",
    width: 40,
    height: 40,
    marginTop: -11.5,
    marginLeft: 20,
    zIndex: 10,
  },

  differentEmail: {
    alignItems: "center",
    marginTop: 20,
  },

  differentEmailText: {
    color: "#F16E1C",
    fontSize: 11,
    fontWeight: "700",
  },

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
    transform: [{ rotate: "8deg" }],
  },
});