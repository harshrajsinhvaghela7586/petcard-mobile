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
import { ChevronDown, ChevronLeft, Globe } from "lucide-react-native";

import { mobileAuthApi } from "@/services/mobileAuthApi";
import PrimaryButton from "@/components/Button/PrimaryButton";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

// Focus hone par OTP boxes screen ke top se itna neeche rakhne hain (px).
// Isse OTP ke neeche wala Resend aur Verify button bhi keyboard ke upar dikhta hai.
const OTP_TOP_MARGIN = 24;

type Language = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";

type Translation = {
  verifyTitle: string;
  description: string;
  resendIn: string;
  resend: string;
  verifyButton: string;
  verifying: string;
  enterCodeTitle: string;
  enterCodeMessage: string;
  verifiedTitle: string;
  verifiedMessage: string;
  continueText: string;
  failedTitle: string;
  invalidCode: string;
  sentTitle: string;
  sentMessage: string;
  resendFailedTitle: string;
  tryAgain: string;
};

const LANGUAGES: Array<{
  code: Language;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
];

const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    verifyTitle: "Verify Your Email",
    description: "We’ve sent a 6-digit code to",
    resendIn: "Resend code in",
    resend: "Resend Code",
    verifyButton: "Verify Email",
    verifying: "Verifying...",
    enterCodeTitle: "Enter code",
    enterCodeMessage: "Please enter the 6-digit verification code.",
    verifiedTitle: "Email verified",
    verifiedMessage: "Your email is verified. Please sign in.",
    continueText: "Continue",
    failedTitle: "Verification failed",
    invalidCode: "Invalid or expired code.",
    sentTitle: "Code sent",
    sentMessage: "A new verification code has been sent to your email.",
    resendFailedTitle: "Unable to resend",
    tryAgain: "Please try again.",
  },
  hi: {
    verifyTitle: "अपना ईमेल सत्यापित करें",
    description: "हमने 6 अंकों का कोड भेजा है",
    resendIn: "कोड दोबारा भेजें",
    resend: "कोड दोबारा भेजें",
    verifyButton: "ईमेल सत्यापित करें",
    verifying: "सत्यापित हो रहा है...",
    enterCodeTitle: "कोड दर्ज करें",
    enterCodeMessage: "कृपया 6 अंकों का सत्यापन कोड दर्ज करें।",
    verifiedTitle: "ईमेल सत्यापित हुआ",
    verifiedMessage: "आपका ईमेल सत्यापित हो गया है। कृपया साइन इन करें।",
    continueText: "जारी रखें",
    failedTitle: "सत्यापन विफल",
    invalidCode: "कोड गलत है या उसकी समय सीमा समाप्त हो गई है।",
    sentTitle: "कोड भेज दिया गया",
    sentMessage: "नया सत्यापन कोड आपके ईमेल पर भेज दिया गया है।",
    resendFailedTitle: "कोड दोबारा नहीं भेज सके",
    tryAgain: "कृपया फिर से प्रयास करें।",
  },
  es: {
    verifyTitle: "Verifica tu correo electrónico",
    description: "Hemos enviado un código de 6 dígitos a",
    resendIn: "Reenviar código en",
    resend: "Reenviar código",
    verifyButton: "Verificar correo",
    verifying: "Verificando...",
    enterCodeTitle: "Introduce el código",
    enterCodeMessage: "Introduce el código de verificación de 6 dígitos.",
    verifiedTitle: "Correo verificado",
    verifiedMessage: "Tu correo está verificado. Inicia sesión.",
    continueText: "Continuar",
    failedTitle: "Error de verificación",
    invalidCode: "El código no es válido o ha caducado.",
    sentTitle: "Código enviado",
    sentMessage: "Se ha enviado un nuevo código a tu correo.",
    resendFailedTitle: "No se pudo reenviar",
    tryAgain: "Inténtalo de nuevo.",
  },
  fr: {
    verifyTitle: "Vérifiez votre e-mail",
    description: "Nous avons envoyé un code à 6 chiffres à",
    resendIn: "Renvoyer le code dans",
    resend: "Renvoyer le code",
    verifyButton: "Vérifier l’e-mail",
    verifying: "Vérification...",
    enterCodeTitle: "Saisissez le code",
    enterCodeMessage: "Saisissez le code de vérification à 6 chiffres.",
    verifiedTitle: "E-mail vérifié",
    verifiedMessage: "Votre e-mail est vérifié. Veuillez vous connecter.",
    continueText: "Continuer",
    failedTitle: "Échec de la vérification",
    invalidCode: "Code invalide ou expiré.",
    sentTitle: "Code envoyé",
    sentMessage: "Un nouveau code a été envoyé à votre adresse e-mail.",
    resendFailedTitle: "Impossible de renvoyer",
    tryAgain: "Veuillez réessayer.",
  },
  de: {
    verifyTitle: "E-Mail bestätigen",
    description: "Wir haben einen 6-stelligen Code gesendet an",
    resendIn: "Code erneut senden in",
    resend: "Code erneut senden",
    verifyButton: "E-Mail bestätigen",
    verifying: "Wird überprüft...",
    enterCodeTitle: "Code eingeben",
    enterCodeMessage: "Bitte gib den 6-stelligen Bestätigungscode ein.",
    verifiedTitle: "E-Mail bestätigt",
    verifiedMessage: "Deine E-Mail wurde bestätigt. Bitte melde dich an.",
    continueText: "Weiter",
    failedTitle: "Bestätigung fehlgeschlagen",
    invalidCode: "Der Code ist ungültig oder abgelaufen.",
    sentTitle: "Code gesendet",
    sentMessage: "Ein neuer Bestätigungscode wurde an deine E-Mail gesendet.",
    resendFailedTitle: "Erneutes Senden fehlgeschlagen",
    tryAgain: "Bitte versuche es erneut.",
  },
  nl: {
    verifyTitle: "Verifieer je e-mail",
    description: "We hebben een 6-cijferige code gestuurd naar",
    resendIn: "Code opnieuw verzenden over",
    resend: "Code opnieuw verzenden",
    verifyButton: "E-mail verifiëren",
    verifying: "Bezig met verifiëren...",
    enterCodeTitle: "Voer de code in",
    enterCodeMessage: "Voer de 6-cijferige verificatiecode in.",
    verifiedTitle: "E-mail geverifieerd",
    verifiedMessage: "Je e-mail is geverifieerd. Log nu in.",
    continueText: "Doorgaan",
    failedTitle: "Verificatie mislukt",
    invalidCode: "De code is ongeldig of verlopen.",
    sentTitle: "Code verzonden",
    sentMessage: "Er is een nieuwe verificatiecode naar je e-mail gestuurd.",
    resendFailedTitle: "Opnieuw verzenden mislukt",
    tryAgain: "Probeer het opnieuw.",
  },
  it: {
    verifyTitle: "Verifica la tua e-mail",
    description: "Abbiamo inviato un codice di 6 cifre a",
    resendIn: "Invia nuovamente il codice tra",
    resend: "Invia nuovamente il codice",
    verifyButton: "Verifica e-mail",
    verifying: "Verifica in corso...",
    enterCodeTitle: "Inserisci il codice",
    enterCodeMessage: "Inserisci il codice di verifica a 6 cifre.",
    verifiedTitle: "E-mail verificata",
    verifiedMessage: "La tua e-mail è verificata. Accedi.",
    continueText: "Continua",
    failedTitle: "Verifica non riuscita",
    invalidCode: "Il codice non è valido o è scaduto.",
    sentTitle: "Codice inviato",
    sentMessage: "Un nuovo codice di verifica è stato inviato alla tua e-mail.",
    resendFailedTitle: "Impossibile inviare di nuovo",
    tryAgain: "Riprova.",
  },
};

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    language?: string;
  }>();

  const email =
    typeof params.email === "string" ? params.email.trim() : "";

  const languageParam =
    typeof params.language === "string" ? params.language : "en";

  const initialLanguage: Language = LANGUAGES.some(
    (item) => item.code === languageParam
  )
    ? (languageParam as Language)
    : "en";

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const scrollRef = useRef<ScrollView>(null);
  const otpY = useRef(0);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Keyboard dikhe to niche extra jagah do, taaki OTP boxes upar tak scroll ho sakein
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

  const scrollToOtp = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, otpY.current - OTP_TOP_MARGIN),
        animated: true,
      });
    }, 250);
  };

  const handleOtpChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "");

    // Handle full OTP pasted or received through autofill.
    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, OTP_LENGTH).split("");
      const nextOtp = Array(OTP_LENGTH).fill("");

      pastedDigits.forEach((digit, digitIndex) => {
        nextOtp[digitIndex] = digit;
      });

      setOtp(nextOtp);

      if (pastedDigits.length >= OTP_LENGTH) {
        Keyboard.dismiss();
      } else {
        inputRefs.current[pastedDigits.length]?.focus();
      }

      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = digits;
    setOtp(nextOtp);

    if (digits && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digits && index === OTP_LENGTH - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (
    event: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      Alert.alert(t.enterCodeTitle, t.enterCodeMessage);
      return;
    }

    if (isVerifying) {
      return;
    }

    try {
      setIsVerifying(true);

      await mobileAuthApi.verifyOtp({
        email,
        otp: code,
      });

      Alert.alert(t.verifiedTitle, t.verifiedMessage, [
        {
          text: t.continueText,
          onPress: () =>
            router.replace({
              pathname: "/(auth)/login",
              params: { language },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        t.failedTitle,
        error instanceof Error ? error.message : t.invalidCode
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) {
      return;
    }

    try {
      setIsResending(true);

      await mobileAuthApi.resendOtp(email);

      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);
      inputRefs.current[0]?.focus();

      Alert.alert(t.sentTitle, t.sentMessage);
    } catch (error) {
      Alert.alert(
        t.resendFailedTitle,
        error instanceof Error ? error.message : t.tryAgain
      );
    } finally {
      setIsResending(false);
    }
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;
  const isOtpComplete = otp.join("").length === OTP_LENGTH;

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
        {/* Language Selector */}
        <View style={styles.languageSelectorWrapper}>
          <Pressable
            style={styles.languageSelector}
            onPress={() => setLanguageOpen((previous) => !previous)}
          >
            <Globe size={18} color="#E98A3A" strokeWidth={2} />

            <Text style={styles.languageSelectorText}>
              {LANGUAGES.find((item) => item.code === language)?.label}
            </Text>

            <ChevronDown
              size={17}
              color="#7A6A61"
              strokeWidth={2}
              style={{
                transform: [
                  { rotate: languageOpen ? "180deg" : "0deg" },
                ],
              }}
            />
          </Pressable>

          {languageOpen && (
            <View style={styles.languageDropdown}>
              {LANGUAGES.map((item) => {
                const selected = item.code === language;

                return (
                  <Pressable
                    key={item.code}
                    style={[
                      styles.languageOption,
                      selected && styles.languageOptionSelected,
                    ]}
                    onPress={() => {
                      setLanguage(item.code);
                      setLanguageOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        selected && styles.languageOptionTextSelected,
                      ]}
                    >
                      {item.nativeLabel}
                    </Text>

                    {selected && (
                      <Text style={styles.languageCheck}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
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
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <ChevronLeft
              size={28}
              color="#35251E"
              strokeWidth={1.8}
            />
          </Pressable>

          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require("../../../assets/images/auth/authlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>{t.verifyTitle}</Text>

            <Text style={styles.description}>{t.description}</Text>

            <Text style={styles.email} numberOfLines={1}>
              {email || "youremail@domain.com"}
            </Text>
          </View>

          {/* Envelope Illustration */}
          <View style={styles.envelopeContainer}>
            <View style={styles.envelopeBack}>
              <View style={styles.envelopeFlap} />
            </View>

            <View style={styles.paper}>
              <View style={styles.pawCircle}>
                <Image
                  source={require("../../../assets/images/paw-white.png")}
                  style={styles.pawWhite}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.envelopeFront} />
          </View>

          {/* OTP Inputs */}
          <View
            style={styles.otpContainer}
            onLayout={(e: LayoutChangeEvent) => {
              otpY.current = e.nativeEvent.layout.y;
            }}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                onFocus={scrollToOtp}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                textContentType={index === 0 ? "oneTimeCode" : "none"}
                autoComplete={index === 0 ? "sms-otp" : "off"}
                importantForAutofill={
                  index === 0 ? "yes" : "no"
                }
                selectTextOnFocus
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                selectionColor="#FF7412"
                accessibilityLabel={`Verification digit ${index + 1}`}
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            {secondsLeft > 0 ? (
              <Text style={styles.resendText}>
                {t.resendIn}{" "}
                <Text style={styles.timer}>{formattedTime}</Text>
              </Text>
            ) : (
              <Pressable
                onPress={handleResend}
                disabled={isResending}
                hitSlop={10}
              >
                <Text
                  style={[
                    styles.resendLink,
                    isResending && styles.resendLinkDisabled,
                  ]}
                >
                  {isResending ? "Sending..." : t.resend}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Verify Button */}
          <PrimaryButton
            title={isVerifying ? t.verifying : t.verifyButton}
            onPress={handleVerify}
            disabled={!isOtpComplete || isVerifying}
            style={styles.verifyButton}
            textStyle={styles.verifyText}
          />
        </ScrollView>

        {/* Bottom Decorations */}
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

  languageSelectorWrapper: {
    position: "absolute",
    top: 8,
    right: 23,
    zIndex: 50,
    alignItems: "flex-end",
  },

  languageSelector: {
    minWidth: 145,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
  },

  languageSelectorText: {
    fontSize: 14,
    color: "#3A2A22",
    fontWeight: "600",
  },

  languageDropdown: {
    width: 165,
    marginTop: 7,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F0E5DE",
  },

  languageOption: {
    minHeight: 38,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageOptionSelected: {
    backgroundColor: "#FFF4EC",
  },

  languageOptionText: {
    fontSize: 13,
    color: "#4D403A",
    fontWeight: "500",
  },

  languageOptionTextSelected: {
    color: "#F16D1D",
    fontWeight: "700",
  },

  languageCheck: {
    color: "#F16D1D",
    fontSize: 15,
    fontWeight: "700",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingTop: 58,
    paddingBottom: 40,
  },

  // Keyboard open hone par extra jagah, taaki OTP boxes + Verify button upar tak scroll ho sakein
  scrollContentKeyboard: {
    paddingBottom: 320,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  logoSection: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 30,
  },

  logo: {
    width: 290,
    height: 135,
  },

  headingSection: {
    alignItems: "center",
    marginBottom: 19,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#482719",
    marginBottom: 14,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    color: "#4D403A",
    marginBottom: 4,
    textAlign: "center",
  },

  email: {
    maxWidth: "90%",
    fontSize: 14,
    color: "#F36E1C",
    fontWeight: "500",
    textAlign: "center",
  },

  envelopeContainer: {
    width: 170,
    height: 180,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20,
    position: "relative",
  },

  envelopeBack: {
    position: "absolute",
    bottom: 5,
    left: 0,
    width: 170,
    height: 130,
    backgroundColor: "#FFC58F",
    borderRadius: 11,
  },

  envelopeFlap: {
    position: "absolute",
    top: -1,
    left: 12,
    width: 146,
    height: 90,
    backgroundColor: "#FFD0A0",
    transform: [
      { rotate: "45deg" },
      { translateX: 25 },
      { translateY: -27 },
    ],
    borderRadius: 7,
  },

  paper: {
    position: "absolute",
    top: 12,
    left: 22,
    width: 126,
    height: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  pawCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
  },

  pawWhite: {
    width: 38,
    height: 38,
  },

  envelopeFront: {
    position: "absolute",
    bottom: 5,
    left: 0,
    width: 170,
    height: 92,
    backgroundColor: "#FFC28B",
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    zIndex: 5,
    opacity: 0.92,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  otpInput: {
    width: 42,
    height: 50,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#DCDCDC",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    color: "#38271F",
    padding: 0,
  },

  otpInputFilled: {
    borderColor: "#FF7412",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 27,
  },

  resendText: {
    fontSize: 13,
    color: "#3E3029",
    textAlign: "center",
  },

  timer: {
    color: "#F16D1D",
    fontWeight: "500",
  },

  resendLink: {
    fontSize: 13,
    color: "#F16D1D",
    fontWeight: "600",
  },

  resendLinkDisabled: {
    opacity: 0.55,
  },

  verifyButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#FF760D",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  verifyButtonDisabled: {
    opacity: 0.45,
  },

  verifyText: {
    color: "#FFFFFF",
    fontSize: 13,
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
    bottom: 20,
    right: 16,
    opacity: 0.1,
    transform: [{ rotate: "8deg" }],
  },
});