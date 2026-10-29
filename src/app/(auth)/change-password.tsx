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
  KeyRound,
  LockKeyhole,
} from "lucide-react-native";

import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import PrimaryButton from "@/components/Button/PrimaryButton";

type LanguageCode = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";

type Translation = {
  back: string;
  title: string;
  subtitle: string;
  currentLabel: string;
  currentPlaceholder: string;
  newLabel: string;
  newPlaceholder: string;
  confirmLabel: string;
  confirmPlaceholder: string;
  button: string;
  loading: string;
  missingCurrentTitle: string;
  missingCurrentMessage: string;
  weakTitle: string;
  weakMessage: string;
  samePasswordTitle: string;
  samePasswordMessage: string;
  mismatchTitle: string;
  mismatchMessage: string;
  successTitle: string;
  successMessage: string;
  failedTitle: string;
  tryAgain: string;
  ok: string;
};

const translations: Record<LanguageCode, Translation> = {
  en: {
    back: "Back",
    title: "Change Password",
    subtitle: "Enter your current password and choose a new one.",
    currentLabel: "Current Password",
    currentPlaceholder: "Enter current password",
    newLabel: "New Password",
    newPlaceholder: "At least 8 characters",
    confirmLabel: "Confirm New Password",
    confirmPlaceholder: "Re-enter new password",
    button: "Update Password",
    loading: "Please wait...",
    missingCurrentTitle: "Current password",
    missingCurrentMessage: "Please enter your current password.",
    weakTitle: "Weak password",
    weakMessage: "Password must contain at least 8 characters.",
    samePasswordTitle: "Same password",
    samePasswordMessage: "New password must be different from the current one.",
    mismatchTitle: "Password mismatch",
    mismatchMessage: "Passwords do not match.",
    successTitle: "Password updated",
    successMessage: "Your password has been changed successfully.",
    failedTitle: "Update failed",
    tryAgain: "Please try again.",
    ok: "OK",
  },
  hi: {
    back: "वापस",
    title: "पासवर्ड बदलें",
    subtitle: "अपना मौजूदा पासवर्ड दर्ज करें और नया पासवर्ड चुनें।",
    currentLabel: "मौजूदा पासवर्ड",
    currentPlaceholder: "मौजूदा पासवर्ड दर्ज करें",
    newLabel: "नया पासवर्ड",
    newPlaceholder: "कम से कम 8 अक्षर",
    confirmLabel: "नए पासवर्ड की पुष्टि करें",
    confirmPlaceholder: "नया पासवर्ड दोबारा दर्ज करें",
    button: "पासवर्ड अपडेट करें",
    loading: "कृपया प्रतीक्षा करें...",
    missingCurrentTitle: "मौजूदा पासवर्ड",
    missingCurrentMessage: "कृपया अपना मौजूदा पासवर्ड दर्ज करें।",
    weakTitle: "कमज़ोर पासवर्ड",
    weakMessage: "पासवर्ड में कम से कम 8 अक्षर होने चाहिए।",
    samePasswordTitle: "वही पासवर्ड",
    samePasswordMessage: "नया पासवर्ड मौजूदा पासवर्ड से अलग होना चाहिए।",
    mismatchTitle: "पासवर्ड मेल नहीं खाते",
    mismatchMessage: "दोनों पासवर्ड एक जैसे नहीं हैं।",
    successTitle: "पासवर्ड अपडेट हुआ",
    successMessage: "आपका पासवर्ड सफलतापूर्वक बदल दिया गया है।",
    failedTitle: "अपडेट विफल",
    tryAgain: "कृपया फिर से प्रयास करें।",
    ok: "ठीक है",
  },
  es: {
    back: "Atrás",
    title: "Cambiar contraseña",
    subtitle: "Introduce tu contraseña actual y elige una nueva.",
    currentLabel: "Contraseña actual",
    currentPlaceholder: "Introduce la contraseña actual",
    newLabel: "Nueva contraseña",
    newPlaceholder: "Al menos 8 caracteres",
    confirmLabel: "Confirmar nueva contraseña",
    confirmPlaceholder: "Repite la nueva contraseña",
    button: "Actualizar contraseña",
    loading: "Espera...",
    missingCurrentTitle: "Contraseña actual",
    missingCurrentMessage: "Introduce tu contraseña actual.",
    weakTitle: "Contraseña débil",
    weakMessage: "La contraseña debe tener al menos 8 caracteres.",
    samePasswordTitle: "Misma contraseña",
    samePasswordMessage: "La nueva contraseña debe ser distinta de la actual.",
    mismatchTitle: "Las contraseñas no coinciden",
    mismatchMessage: "Las contraseñas no coinciden.",
    successTitle: "Contraseña actualizada",
    successMessage: "Tu contraseña se ha cambiado correctamente.",
    failedTitle: "Error al actualizar",
    tryAgain: "Inténtalo de nuevo.",
    ok: "Aceptar",
  },
  fr: {
    back: "Retour",
    title: "Changer le mot de passe",
    subtitle: "Saisissez votre mot de passe actuel et choisissez-en un nouveau.",
    currentLabel: "Mot de passe actuel",
    currentPlaceholder: "Saisissez le mot de passe actuel",
    newLabel: "Nouveau mot de passe",
    newPlaceholder: "Au moins 8 caractères",
    confirmLabel: "Confirmer le nouveau mot de passe",
    confirmPlaceholder: "Saisissez à nouveau le mot de passe",
    button: "Mettre à jour",
    loading: "Veuillez patienter...",
    missingCurrentTitle: "Mot de passe actuel",
    missingCurrentMessage: "Saisissez votre mot de passe actuel.",
    weakTitle: "Mot de passe faible",
    weakMessage: "Le mot de passe doit contenir au moins 8 caractères.",
    samePasswordTitle: "Même mot de passe",
    samePasswordMessage: "Le nouveau mot de passe doit être différent de l’actuel.",
    mismatchTitle: "Mots de passe différents",
    mismatchMessage: "Les mots de passe ne correspondent pas.",
    successTitle: "Mot de passe mis à jour",
    successMessage: "Votre mot de passe a été modifié avec succès.",
    failedTitle: "Échec de la mise à jour",
    tryAgain: "Veuillez réessayer.",
    ok: "OK",
  },
  de: {
    back: "Zurück",
    title: "Passwort ändern",
    subtitle: "Gib dein aktuelles Passwort ein und wähle ein neues.",
    currentLabel: "Aktuelles Passwort",
    currentPlaceholder: "Aktuelles Passwort eingeben",
    newLabel: "Neues Passwort",
    newPlaceholder: "Mindestens 8 Zeichen",
    confirmLabel: "Neues Passwort bestätigen",
    confirmPlaceholder: "Neues Passwort erneut eingeben",
    button: "Passwort aktualisieren",
    loading: "Bitte warten...",
    missingCurrentTitle: "Aktuelles Passwort",
    missingCurrentMessage: "Bitte gib dein aktuelles Passwort ein.",
    weakTitle: "Schwaches Passwort",
    weakMessage: "Das Passwort muss mindestens 8 Zeichen enthalten.",
    samePasswordTitle: "Gleiches Passwort",
    samePasswordMessage: "Das neue Passwort muss sich vom aktuellen unterscheiden.",
    mismatchTitle: "Passwörter stimmen nicht überein",
    mismatchMessage: "Die Passwörter stimmen nicht überein.",
    successTitle: "Passwort aktualisiert",
    successMessage: "Dein Passwort wurde erfolgreich geändert.",
    failedTitle: "Aktualisierung fehlgeschlagen",
    tryAgain: "Bitte versuche es erneut.",
    ok: "OK",
  },
  nl: {
    back: "Terug",
    title: "Wachtwoord wijzigen",
    subtitle: "Voer je huidige wachtwoord in en kies een nieuw wachtwoord.",
    currentLabel: "Huidig wachtwoord",
    currentPlaceholder: "Voer huidig wachtwoord in",
    newLabel: "Nieuw wachtwoord",
    newPlaceholder: "Minimaal 8 tekens",
    confirmLabel: "Bevestig nieuw wachtwoord",
    confirmPlaceholder: "Voer nieuw wachtwoord opnieuw in",
    button: "Wachtwoord bijwerken",
    loading: "Even geduld...",
    missingCurrentTitle: "Huidig wachtwoord",
    missingCurrentMessage: "Voer je huidige wachtwoord in.",
    weakTitle: "Zwak wachtwoord",
    weakMessage: "Het wachtwoord moet minimaal 8 tekens bevatten.",
    samePasswordTitle: "Zelfde wachtwoord",
    samePasswordMessage: "Het nieuwe wachtwoord moet verschillen van het huidige.",
    mismatchTitle: "Wachtwoorden komen niet overeen",
    mismatchMessage: "De wachtwoorden komen niet overeen.",
    successTitle: "Wachtwoord bijgewerkt",
    successMessage: "Je wachtwoord is succesvol gewijzigd.",
    failedTitle: "Bijwerken mislukt",
    tryAgain: "Probeer het opnieuw.",
    ok: "OK",
  },
  it: {
    back: "Indietro",
    title: "Cambia password",
    subtitle: "Inserisci la password attuale e scegline una nuova.",
    currentLabel: "Password attuale",
    currentPlaceholder: "Inserisci la password attuale",
    newLabel: "Nuova password",
    newPlaceholder: "Almeno 8 caratteri",
    confirmLabel: "Conferma nuova password",
    confirmPlaceholder: "Inserisci di nuovo la nuova password",
    button: "Aggiorna password",
    loading: "Attendi...",
    missingCurrentTitle: "Password attuale",
    missingCurrentMessage: "Inserisci la tua password attuale.",
    weakTitle: "Password debole",
    weakMessage: "La password deve contenere almeno 8 caratteri.",
    samePasswordTitle: "Stessa password",
    samePasswordMessage: "La nuova password deve essere diversa da quella attuale.",
    mismatchTitle: "Le password non coincidono",
    mismatchMessage: "Le password non coincidono.",
    successTitle: "Password aggiornata",
    successMessage: "La tua password è stata cambiata con successo.",
    failedTitle: "Aggiornamento non riuscito",
    tryAgain: "Riprova.",
    ok: "OK",
  },
};

type FieldKey = "current" | "new" | "confirm";

// Focus hone par field screen ke top se itna neeche rakhna hai (px).
const FIELD_TOP_MARGIN = 16;

const LANGUAGE_CODES: LanguageCode[] = [
  "en",
  "hi",
  "es",
  "fr",
  "de",
  "nl",
  "it",
];

export default function ChangePasswordScreen() {
  const params = useLocalSearchParams<{ language?: string }>();

  const initialLanguage = (
    LANGUAGE_CODES.includes((params.language || "") as LanguageCode)
      ? params.language
      : "en"
  ) as LanguageCode;

  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const t = translations[language];

  /* ================================
      FOCUS / SCROLL HELPERS
  ================================= */

  const scrollRef = useRef<ScrollView>(null);
  const formY = useRef(0);
  const fieldY = useRef<Partial<Record<FieldKey, number>>>({});

  const currentRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
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

  /* ================================
      SUBMIT
  ================================= */

  const handleChangePassword = async () => {
    if (loading) {
      return;
    }

    if (!currentPassword) {
      Alert.alert(t.missingCurrentTitle, t.missingCurrentMessage);
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t.weakTitle, t.weakMessage);
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(t.samePasswordTitle, t.samePasswordMessage);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.mismatchTitle, t.mismatchMessage);
      return;
    }

    try {
      setLoading(true);

      // TODO: backend ke time yahan API call lagani hai

      Alert.alert(t.successTitle, t.successMessage, [
        {
          text: t.ok,
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        t.failedTitle,
        error instanceof Error ? error.message : t.tryAgain
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
      PASSWORD FIELD (reusable)
  ================================= */

  const renderPasswordField = ({
    fieldKey,
    label,
    placeholder,
    value,
    onChange,
    visible,
    onToggle,
    inputRef,
    returnKeyType,
    onSubmit,
  }: {
    fieldKey: FieldKey;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    visible: boolean;
    onToggle: () => void;
    inputRef: React.RefObject<TextInput | null>;
    returnKeyType: "next" | "done";
    onSubmit: () => void;
  }) => (
    <View style={styles.fieldWrapper} onLayout={registerField(fieldKey)}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <LockKeyhole size={17} color="#9A9997" strokeWidth={1.7} />

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#A7A5A3"
          style={styles.input}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          returnKeyType={returnKeyType}
          blurOnSubmit={returnKeyType === "done"}
          onFocus={() => scrollToField(fieldKey)}
          onSubmitEditing={onSubmit}
        />

        <Pressable onPress={onToggle} hitSlop={10}>
          {visible ? (
            <EyeOff size={19} color="#6F5A4B" />
          ) : (
            <Eye size={19} color="#6F5A4B" />
          )}
        </Pressable>
      </View>
    </View>
  );

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
              <KeyRound size={27} color="#FF7A00" />
            </View>

            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          {/* Form */}
          <View
            style={styles.form}
            onLayout={(e) => {
              formY.current = e.nativeEvent.layout.y;
            }}
          >
            {renderPasswordField({
              fieldKey: "current",
              label: t.currentLabel,
              placeholder: t.currentPlaceholder,
              value: currentPassword,
              onChange: setCurrentPassword,
              visible: showCurrent,
              onToggle: () => setShowCurrent((prev) => !prev),
              inputRef: currentRef,
              returnKeyType: "next",
              onSubmit: () => newRef.current?.focus(),
            })}

            {renderPasswordField({
              fieldKey: "new",
              label: t.newLabel,
              placeholder: t.newPlaceholder,
              value: newPassword,
              onChange: setNewPassword,
              visible: showNew,
              onToggle: () => setShowNew((prev) => !prev),
              inputRef: newRef,
              returnKeyType: "next",
              onSubmit: () => confirmRef.current?.focus(),
            })}

            {renderPasswordField({
              fieldKey: "confirm",
              label: t.confirmLabel,
              placeholder: t.confirmPlaceholder,
              value: confirmPassword,
              onChange: setConfirmPassword,
              visible: showConfirm,
              onToggle: () => setShowConfirm((prev) => !prev),
              inputRef: confirmRef,
              returnKeyType: "done",
              onSubmit: Keyboard.dismiss,
            })}

            <PrimaryButton
              title={loading ? t.loading : t.button}
              onPress={handleChangePassword}
              disabled={loading}
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