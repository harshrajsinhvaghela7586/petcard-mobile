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
import { ChevronLeft, Smartphone } from "lucide-react-native";

import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import PrimaryButton from "@/components/Button/PrimaryButton";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

// Focus hone par OTP boxes screen ke top se itna neeche rakhne hain (px).
// Isse OTP ke neeche wala Resend aur Verify button bhi keyboard ke upar dikhta hai.
const OTP_TOP_MARGIN = 24;

type LanguageCode = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";

type Translation = {
  back: string;
  title: string;
  description: string;
  resendIn: string;
  resend: string;
  sending: string;
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

const translations: Record<LanguageCode, Translation> = {
  en: {
    back: "Back",
    title: "Verify Your Number",
    description: "We’ve sent a 6-digit code to",
    resendIn: "Resend code in",
    resend: "Resend Code",
    sending: "Sending...",
    verifyButton: "Verify Number",
    verifying: "Verifying...",
    enterCodeTitle: "Enter code",
    enterCodeMessage: "Please enter the 6-digit verification code.",
    verifiedTitle: "Number verified",
    verifiedMessage: "Your phone number has been verified.",
    continueText: "Continue",
    failedTitle: "Verification failed",
    invalidCode: "Invalid or expired code.",
    sentTitle: "Code sent",
    sentMessage: "A new verification code has been sent to your number.",
    resendFailedTitle: "Unable to resend",
    tryAgain: "Please try again.",
  },
  hi: {
    back: "वापस",
    title: "अपना नंबर सत्यापित करें",
    description: "हमने 6 अंकों का कोड भेजा है",
    resendIn: "कोड दोबारा भेजें",
    resend: "कोड दोबारा भेजें",
    sending: "भेजा जा रहा है...",
    verifyButton: "नंबर सत्यापित करें",
    verifying: "सत्यापित हो रहा है...",
    enterCodeTitle: "कोड दर्ज करें",
    enterCodeMessage: "कृपया 6 अंकों का सत्यापन कोड दर्ज करें।",
    verifiedTitle: "नंबर सत्यापित हुआ",
    verifiedMessage: "आपका फ़ोन नंबर सत्यापित हो गया है।",
    continueText: "जारी रखें",
    failedTitle: "सत्यापन विफल",
    invalidCode: "कोड गलत है या उसकी समय सीमा समाप्त हो गई है।",
    sentTitle: "कोड भेज दिया गया",
    sentMessage: "नया सत्यापन कोड आपके नंबर पर भेज दिया गया है।",
    resendFailedTitle: "कोड दोबारा नहीं भेज सके",
    tryAgain: "कृपया फिर से प्रयास करें।",
  },
  es: {
    back: "Atrás",
    title: "Verifica tu número",
    description: "Hemos enviado un código de 6 dígitos a",
    resendIn: "Reenviar código en",
    resend: "Reenviar código",
    sending: "Enviando...",
    verifyButton: "Verificar número",
    verifying: "Verificando...",
    enterCodeTitle: "Introduce el código",
    enterCodeMessage: "Introduce el código de verificación de 6 dígitos.",
    verifiedTitle: "Número verificado",
    verifiedMessage: "Tu número de teléfono ha sido verificado.",
    continueText: "Continuar",
    failedTitle: "Error de verificación",
    invalidCode: "El código no es válido o ha caducado.",
    sentTitle: "Código enviado",
    sentMessage: "Se ha enviado un nuevo código a tu número.",
    resendFailedTitle: "No se pudo reenviar",
    tryAgain: "Inténtalo de nuevo.",
  },
  fr: {
    back: "Retour",
    title: "Vérifiez votre numéro",
    description: "Nous avons envoyé un code à 6 chiffres au",
    resendIn: "Renvoyer le code dans",
    resend: "Renvoyer le code",
    sending: "Envoi...",
    verifyButton: "Vérifier le numéro",
    verifying: "Vérification...",
    enterCodeTitle: "Saisissez le code",
    enterCodeMessage: "Saisissez le code de vérification à 6 chiffres.",
    verifiedTitle: "Numéro vérifié",
    verifiedMessage: "Votre numéro de téléphone a été vérifié.",
    continueText: "Continuer",
    failedTitle: "Échec de la vérification",
    invalidCode: "Code invalide ou expiré.",
    sentTitle: "Code envoyé",
    sentMessage: "Un nouveau code a été envoyé à votre numéro.",
    resendFailedTitle: "Impossible de renvoyer",
    tryAgain: "Veuillez réessayer.",
  },
  de: {
    back: "Zurück",
    title: "Nummer bestätigen",
    description: "Wir haben einen 6-stelligen Code gesendet an",
    resendIn: "Code erneut senden in",
    resend: "Code erneut senden",
    sending: "Wird gesendet...",
    verifyButton: "Nummer bestätigen",
    verifying: "Wird überprüft...",
    enterCodeTitle: "Code eingeben",
    enterCodeMessage: "Bitte gib den 6-stelligen Bestätigungscode ein.",
    verifiedTitle: "Nummer bestätigt",
    verifiedMessage: "Deine Telefonnummer wurde bestätigt.",
    continueText: "Weiter",
    failedTitle: "Bestätigung fehlgeschlagen",
    invalidCode: "Der Code ist ungültig oder abgelaufen.",
    sentTitle: "Code gesendet",
    sentMessage: "Ein neuer Bestätigungscode wurde an deine Nummer gesendet.",
    resendFailedTitle: "Erneutes Senden fehlgeschlagen",
    tryAgain: "Bitte versuche es erneut.",
  },
  nl: {
    back: "Terug",
    title: "Verifieer je nummer",
    description: "We hebben een 6-cijferige code gestuurd naar",
    resendIn: "Code opnieuw verzenden over",
    resend: "Code opnieuw verzenden",
    sending: "Verzenden...",
    verifyButton: "Nummer verifiëren",
    verifying: "Bezig met verifiëren...",
    enterCodeTitle: "Voer de code in",
    enterCodeMessage: "Voer de 6-cijferige verificatiecode in.",
    verifiedTitle: "Nummer geverifieerd",
    verifiedMessage: "Je telefoonnummer is geverifieerd.",
    continueText: "Doorgaan",
    failedTitle: "Verificatie mislukt",
    invalidCode: "De code is ongeldig of verlopen.",
    sentTitle: "Code verzonden",
    sentMessage: "Er is een nieuwe verificatiecode naar je nummer gestuurd.",
    resendFailedTitle: "Opnieuw verzenden mislukt",
    tryAgain: "Probeer het opnieuw.",
  },
  it: {
    back: "Indietro",
    title: "Verifica il tuo numero",
    description: "Abbiamo inviato un codice di 6 cifre al",
    resendIn: "Invia nuovamente il codice tra",
    resend: "Invia nuovamente il codice",
    sending: "Invio...",
    verifyButton: "Verifica numero",
    verifying: "Verifica in corso...",
    enterCodeTitle: "Inserisci il codice",
    enterCodeMessage: "Inserisci il codice di verifica a 6 cifre.",
    verifiedTitle: "Numero verificato",
    verifiedMessage: "Il tuo numero di telefono è stato verificato.",
    continueText: "Continua",
    failedTitle: "Verifica non riuscita",
    invalidCode: "Il codice non è valido o è scaduto.",
    sentTitle: "Codice inviato",
    sentMessage: "Un nuovo codice di verifica è stato inviato al tuo numero.",
    resendFailedTitle: "Impossibile inviare di nuovo",
    tryAgain: "Riprova.",
  },
};

const LANGUAGE_CODES: LanguageCode[] = [
  "en",
  "hi",
  "es",
  "fr",
  "de",
  "nl",
  "it",
];

export default function VerifyNumberScreen() {
  const params = useLocalSearchParams<{
    phone?: string;
    language?: string;
  }>();

  const phone = typeof params.phone === "string" ? params.phone.trim() : "";

  const initialLanguage = (
    LANGUAGE_CODES.includes((params.language || "") as LanguageCode)
      ? params.language
      : "en"
  ) as LanguageCode;

  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const scrollRef = useRef<ScrollView>(null);
  const otpY = useRef(0);
  const t = translations[language];

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

    // Full OTP paste ya autofill handle karo.
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

      // TODO: backend ke time yahan OTP verify API lagani hai

      Alert.alert(t.verifiedTitle, t.verifiedMessage, [
        {
          text: t.continueText,
          onPress: () => router.back(),
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

      // TODO: backend ke time yahan resend OTP API lagani hai

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDFC" />

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
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={21} color="#382018" />
            <Text style={styles.backText}>{t.back}</Text>
          </Pressable>

          {/* Heading */}
          <View style={styles.headingSection}>
            <View style={styles.iconCircle}>
              <Smartphone size={27} color="#FF7A00" />
            </View>

            <Text style={styles.title}>{t.title}</Text>

            <Text style={styles.description}>{t.description}</Text>

            <Text style={styles.phone} numberOfLines={1}>
              {phone || "+91 00000 00000"}
            </Text>
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
                importantForAutofill={index === 0 ? "yes" : "no"}
                selectTextOnFocus
                style={[styles.otpInput, digit && styles.otpInputFilled]}
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
                  {isResending ? t.sending : t.resend}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Verify Button */}
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={isVerifying ? t.verifying : t.verifyButton}
              onPress={handleVerify}
              disabled={!isOtpComplete || isVerifying}
              icon={
                <Image
                  source={require("../../../assets/images/paw-white.png")}
                  resizeMode="contain"
                  style={styles.buttonPaw}
                />
              }
            />
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

  // Keyboard open hone par extra jagah, taaki OTP boxes + Verify button upar tak scroll ho sakein
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
    marginBottom: 28,
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
    marginBottom: 12,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    color: "#4D403A",
    marginBottom: 4,
    textAlign: "center",
  },

  phone: {
    maxWidth: "90%",
    fontSize: 14,
    color: "#F36E1C",
    fontWeight: "600",
    textAlign: "center",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
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

  buttonWrapper: {
    marginTop: 25,
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