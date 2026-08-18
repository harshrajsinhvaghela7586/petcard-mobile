import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
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
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronDown, Globe } from "lucide-react-native";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyOtpScreen() {
  type Language =
    | "en"
    | "hi"
    | "es"
    | "fr"
    | "de"
    | "nl"
    | "it";

  const params = useLocalSearchParams<{
    email?: string;
    language?: string;
  }>();

  const email =
    typeof params.email === "string"
      ? params.email
      : "youremail@domain.com";

  const languageParam =
    typeof params.language === "string"
      ? params.language
      : "en";

  const [language, setLanguage] = useState<Language>(
    ["en", "hi", "es", "fr", "de", "nl", "it"].includes(languageParam)
      ? (languageParam as Language)
      : "en"
  );

  const [languageOpen, setLanguageOpen] = useState(false);

  const languages: Array<{
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

  const translations: Record<
    Language,
    {
      verifyTitle: string;
      description: string;
      resendIn: string;
      resend: string;
      verifyButton: string;
    }
  > = {
    en: {
      verifyTitle: "Verify Your Email",
      description: "We’ve sent a 6-digit code to",
      resendIn: "Resend code in",
      resend: "Resend Code",
      verifyButton: "Verify Email",
    },
    hi: {
      verifyTitle: "अपना ईमेल सत्यापित करें",
      description: "हमने 6 अंकों का कोड भेजा है",
      resendIn: "कोड दोबारा भेजें",
      resend: "कोड दोबारा भेजें",
      verifyButton: "ईमेल सत्यापित करें",
    },
    es: {
      verifyTitle: "Verifica tu correo electrónico",
      description: "Hemos enviado un código de 6 dígitos a",
      resendIn: "Reenviar código en",
      resend: "Reenviar código",
      verifyButton: "Verificar correo",
    },
    fr: {
      verifyTitle: "Vérifiez votre e-mail",
      description: "Nous avons envoyé un code à 6 chiffres à",
      resendIn: "Renvoyer le code dans",
      resend: "Renvoyer le code",
      verifyButton: "Vérifier l’e-mail",
    },
    de: {
      verifyTitle: "E-Mail bestätigen",
      description: "Wir haben einen 6-stelligen Code gesendet an",
      resendIn: "Code erneut senden in",
      resend: "Code erneut senden",
      verifyButton: "E-Mail bestätigen",
    },
    nl: {
      verifyTitle: "Verifieer je e-mail",
      description: "We hebben een 6-cijferige code gestuurd naar",
      resendIn: "Code opnieuw verzenden over",
      resend: "Code opnieuw verzenden",
      verifyButton: "E-mail verifiëren",
    },
    it: {
      verifyTitle: "Verifica la tua e-mail",
      description: "Abbiamo inviato un codice di 6 cifre a",
      resendIn: "Invia nuovamente il codice tra",
      resend: "Invia nuovamente il codice",
      verifyButton: "Verifica e-mail",
    },
  };

  const t = translations[language];

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [secondsLeft, setSecondsLeft] =
    useState(RESEND_SECONDS);

  const inputRefs = useRef<
    Array<TextInput | null>
  >([]);

  /* ================================
     RESEND TIMER
  ================================= */

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  /* ================================
     OTP INPUT
  ================================= */

  const handleOtpChange = (
    value: string,
    index: number
  ) => {
    const cleanValue = value
      .replace(/\D/g, "")
      .slice(-1);

    const newOtp = [...otp];
    newOtp[index] = cleanValue;

    setOtp(newOtp);

    if (
      cleanValue &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }

    if (
      cleanValue &&
      index === OTP_LENGTH - 1
    ) {
      Keyboard.dismiss();
    }
  };

  /* ================================
     BACKSPACE
  ================================= */

  const handleKeyPress = (
    event: any,
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

  /* ================================
     VERIFY
  ================================= */

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      return;
    }

    try {
      /*
       * Existing verify OTP API yahan connect karna hai.
       *
       * Example:
       *
       * await verifyOtp({
       *   email,
       *   otp: code,
       * });
       *
       * Success:
       *
       * router.replace("/(tabs)/home");
       */
    } catch (error) {
      console.log(
        "OTP verification error:",
        error
      );
    }
  };

  /* ================================
     RESEND
  ================================= */

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    try {
      /*
       * Existing resend OTP API:
       *
       * await resendOtp({ email });
       */

      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);

      inputRefs.current[0]?.focus();
    } catch (error) {
      console.log(
        "Resend OTP error:",
        error
      );
    }
  };

  const formattedTime = `00:${String(
    secondsLeft
  ).padStart(2, "0")}`;

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
        <View style={styles.languageSelectorWrapper}>
          <Pressable
            style={styles.languageSelector}
            onPress={() => setLanguageOpen((prev) => !prev)}
          >
            <Globe size={18} color="#E98A3A" strokeWidth={2} />
            <Text style={styles.languageSelectorText}>
              {languages.find((item) => item.code === language)?.label}
            </Text>
            <ChevronDown
              size={17}
              color="#7A6A61"
              strokeWidth={2}
              style={{
                transform: [{ rotate: languageOpen ? "180deg" : "0deg" }],
              }}
            />
          </Pressable>

          {languageOpen && (
            <View style={styles.languageDropdown}>
              {languages.map((item) => {
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* ================================
              BACK
          ================================= */}

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

          {/* ================================
              LOGO
          ================================= */}

          <View style={styles.logoSection}>
            <Image
              source={require("../../../assets/images/auth/authlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* ================================
              HEADING
          ================================= */}

          <View style={styles.headingSection}>
            <Text style={styles.title}>
              {t.verifyTitle}
            </Text>

            <Text style={styles.description}>
              {t.description}
            </Text>

            <Text
              style={styles.email}
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          {/* ================================
              ENVELOPE
          ================================= */}

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

          {/* ================================
              OTP
          ================================= */}

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] =
                    ref;
                }}
                value={digit}
                onChangeText={(value) =>
                  handleOtpChange(
                    value,
                    index
                  )
                }
                onKeyPress={(event) =>
                  handleKeyPress(
                    event,
                    index
                  )
                }
                keyboardType="number-pad"
                maxLength={1}
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                style={[
                  styles.otpInput,
                  digit &&
                    styles.otpInputFilled,
                ]}
                selectionColor="#FF7412"
              />
            ))}
          </View>

          {/* ================================
              RESEND
          ================================= */}

          <View style={styles.resendContainer}>
            {secondsLeft > 0 ? (
              <Text style={styles.resendText}>
                {t.resendIn}{" "}
                <Text style={styles.timer}>
                  {formattedTime}
                </Text>
              </Text>
            ) : (
              <Pressable
                onPress={handleResend}
              >
                <Text style={styles.resendLink}>
                  {t.resend}
                </Text>
              </Pressable>
            )}
          </View>

          {/* ================================
              VERIFY BUTTON
          ================================= */}

          <Pressable
            onPress={handleVerify}
            disabled={otp.join("").length !== 6}
            style={[
              styles.verifyButton,
              otp.join("").length !== 6 &&
                styles.verifyButtonDisabled,
            ]}
          >
            <Text style={styles.verifyText}>
              {t.verifyButton}
            </Text>
          </Pressable>
        </ScrollView>

        {/* ================================
            BOTTOM DECORATION
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

  /* ================================
     BACK
  ================================= */

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  /* ================================
     LOGO
  ================================= */

  logoSection: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 30,
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
    marginBottom: 19,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#482719",
    marginBottom: 14,
  },

  description: {
    fontSize: 14,
    color: "#4D403A",
    marginBottom: 4,
  },

  email: {
    maxWidth: "90%",
    fontSize: 14,
    color: "#F36E1C",
    fontWeight: "500",
  },

  /* ================================
     ENVELOPE
  ================================= */

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
      {
        rotate: "45deg",
      },
      {
        translateX: 25,
      },
      {
        translateY: -27,
      },
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

  /* ================================
     OTP
  ================================= */

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },

  otpInput: {
    width: 35,
    height: 50,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#DCDCDC",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    color: "#38271F",
  },

  otpInputFilled: {
    borderColor: "#FF7412",
  },

  /* ================================
     RESEND
  ================================= */

  resendContainer: {
    alignItems: "center",
    marginTop: 27,
  },

  resendText: {
    fontSize: 13,
    color: "#3E3029",
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

  /* ================================
     VERIFY BUTTON
  ================================= */

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

  /* ================================
     BOTTOM PAWS
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
        bottom: 20,
        right: 16,
        opacity: 0.10,
        transform: [
            {
                rotate: "8deg",
            },
        ],
    },
});