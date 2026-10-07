import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  useFonts,
} from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, image,
 * icon size...) is multiplied by the same scale factor, so the screen
 * looks like the design (393 x 852) on every device.
 *
 * - Small phones  -> everything shrinks proportionally
 * - Medium phones -> ~ same as design
 * - Large phones  -> grows proportionally, capped at 1.3
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const SCALE = Math.min(
  SCREEN_WIDTH / DESIGN_WIDTH,
  SCREEN_HEIGHT / DESIGN_HEIGHT
);

const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

type HealthField = "bloodType" | "allergies" | "medicalConditions" | "specialNotes";

export interface OptionalHealthBasics {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  specialNotes: string;
}

interface OptionalHealthBasicsScreenProps {
  onContinue: (details: OptionalHealthBasics) => void;
  onSkip: () => void;
}

const FIELD_OPTIONS: Record<Exclude<HealthField, "specialNotes">, string[]> = {
  bloodType: ["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  allergies: ["None", "Chicken", "Beef", "Dairy", "Pollen", "Dust", "Flea bites", "Other"],
  medicalConditions: [
    "None",
    "Skin allergy",
    "Asthma",
    "Arthritis",
    "Diabetes",
    "Heart condition",
    "Other",
  ],
};

const FIELD_META: Record<HealthField, { title: string; placeholder: string }> = {
  bloodType: { title: "Blood Type", placeholder: "Select blood type" },
  allergies: { title: "Allergies", placeholder: "Eg. Chicken, Pollen" },
  medicalConditions: {
    title: "Medical Conditions",
    placeholder: "Eg. Skin allergy, Asthma",
  },
  specialNotes: { title: "Special Notes", placeholder: "Any important notes?" },
};

export default function OptionalHealthBasicsScreen({
  onContinue,
  onSkip,
}: OptionalHealthBasicsScreenProps) {
  const { height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [details, setDetails] = useState<OptionalHealthBasics>({
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    specialNotes: "",
  });
  const [activeField, setActiveField] = useState<HealthField | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const activeMeta = activeField ? FIELD_META[activeField] : null;
  const options = useMemo(() => {
    if (!activeField || activeField === "specialNotes") return [];
    return FIELD_OPTIONS[activeField];
  }, [activeField]);

  if (!fontsLoaded) return null;

  const updateField = (field: HealthField, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const openField = (field: HealthField) => {
    if (field === "specialNotes") setNotesDraft(details.specialNotes);
    setActiveField(field);
  };

  const selectOption = (option: string) => {
    if (!activeField || activeField === "specialNotes") return;

    if (activeField === "bloodType" || option === "None") {
      updateField(activeField, option);
      setActiveField(null);
      return;
    }

    const selectedValues = details[activeField].split(", ").filter(Boolean);
    const nextValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues.filter((item) => item !== "None"), option];

    updateField(activeField, nextValues.join(", "));
  };

  const renderField = (field: HealthField) => {
    const meta = FIELD_META[field];
    const value = details[field];

    return (
      <View key={field} style={styles.fieldCard}>
        <Text style={styles.fieldTitle} maxFontSizeMultiplier={1.1}>{meta.title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${meta.title}, ${value || meta.placeholder}`}
          onPress={() => openField(field)}
          style={[styles.fieldInput, field === "bloodType" && !value && styles.bloodTypeInput]}
        >
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.1}
            style={[styles.fieldValue, !value && styles.placeholder]}
          >
            {value || meta.placeholder}
          </Text>
          <Ionicons name="chevron-down" size={s(17)} color="#A77C59" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/paw.png")}
        style={[styles.backgroundPaw, styles.pawTopLeft]}
        resizeMode="contain"
        
      />
      <Image
        source={require("../../assets/images/paw.png")}
        style={[styles.backgroundPaw, styles.pawTopRight]}
        resizeMode="contain"
        
      />
      <Image
        source={require("../../assets/images/paw.png")}
        style={[styles.backgroundPaw, styles.pawMiddleRight]}
        resizeMode="contain"
        
      />
      <Image
        source={require("../../assets/images/paw.png")}
        style={[styles.backgroundPaw, styles.pawBottomRight]}
        resizeMode="contain"
        
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: height * 0.112 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title} maxFontSizeMultiplier={1.1}>Optional Health Basics</Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
            Add a few health details to help us take better care of your pet.
          </Text>
        </View>

        <View style={styles.fields}>
          {renderField("bloodType")}
          {renderField("allergies")}
          {renderField("medicalConditions")}
          {renderField("specialNotes")}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText} maxFontSizeMultiplier={1.1}>
            You can always add or update these details later in the Health section.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="Continue"
          onPress={() => router.push("/RemindersetupScreen")}
          style={styles.continueButton}
          icon={
            <Image
              source={require("../../assets/images/paw-white.png")}
              resizeMode="contain"
              style={styles.buttonPaw}
            />
          }
        />
        <Pressable
          accessibilityRole="button"
          onPress={onSkip}
          hitSlop={10}
          style={styles.skipButton}
        >
          <Text style={styles.skipText} maxFontSizeMultiplier={1.1}>Skip for now</Text>
        </Pressable>
      </View>

      <Modal
        visible={activeField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveField(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setActiveField(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} maxFontSizeMultiplier={1.1}>{activeMeta?.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setActiveField(null)}
                hitSlop={10}
              >
                <Ionicons name="close" size={s(22)} color="#381B0E" />
              </Pressable>
            </View>

            {activeField === "specialNotes" ? (
              <>
                <TextInput
                  value={notesDraft}
                  onChangeText={setNotesDraft}
                  placeholder="Any important notes?"
                  placeholderTextColor="#A69A91"
                  multiline
                  textAlignVertical="top"
                  maxFontSizeMultiplier={1.1}
                  style={styles.notesInput}
                />
                <Pressable
                  style={styles.doneButton}
                  onPress={() => {
                    updateField("specialNotes", notesDraft.trim());
                    setActiveField(null);
                  }}
                >
                  <Text style={styles.doneButtonText} maxFontSizeMultiplier={1.1}>Save Notes</Text>
                </Pressable>
              </>
            ) : (
              <ScrollView
                style={styles.optionsList}
                contentContainerStyle={styles.optionsContent}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option) => {
                  const selected =
                    activeField === "bloodType"
                      ? details.bloodType === option
                      : details[activeField].split(", ").filter(Boolean).includes(option);

                  return (
                    <Pressable
                      key={option}
                      onPress={() => selectOption(option)}
                      style={styles.optionRow}
                    >
                      <Text style={styles.optionText} maxFontSizeMultiplier={1.1}>{option}</Text>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={s(20)} color="#FF7F00" />
                      ) : (
                        <View style={styles.optionCircle} />
                      )}
                    </Pressable>
                  );
                })}
                {activeField !== "bloodType" && (
                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setActiveField(null)}
                  >
                    <Text style={styles.doneButtonText} maxFontSizeMultiplier={1.1}>Done</Text>
                  </Pressable>
                )}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(10),
    paddingBottom: s(170),
  },
  header: {
    alignItems: "center",
    paddingHorizontal: s(5),
    marginBottom: s(30),
  },
  title: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: s(32),
    lineHeight: s(36),
    color: "#FF7F00",
    textAlign: "center",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: s(2),
    fontFamily: "Nunito_700Bold",
    fontSize: s(20),
    lineHeight: s(28),
    color: "#381B0E",
    textAlign: "center",
  },
  fields: {
    gap: s(5),
    paddingHorizontal: s(12),
  },
  fieldCard: {
    width: "100%",
    minHeight: s(74),
    paddingHorizontal: s(29),
    paddingTop: s(12),
    paddingBottom: s(10),
    borderRadius: s(11),
    borderWidth: 1,
    borderColor: "#FF7F00",
    backgroundColor: "#FFFCF9",
    justifyContent: "center",
  },
  fieldTitle: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: s(16),
    lineHeight: s(20),
    marginBottom: s(1),
  },
  fieldInput: {
    minHeight: s(31),
    borderWidth: 1,
    borderColor: "#FFDCC0",
    borderRadius: s(10),
    paddingHorizontal: s(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFCF9",
  },
  bloodTypeInput: {
    borderColor: "#FF7F00",
    backgroundColor: "#FFE0C4",
  },
  fieldValue: {
    flex: 1,
    color: "#381B0E",
    fontFamily: "Nunito_400Regular",
    fontSize: s(13),
    paddingRight: s(8),
  },
  placeholder: { color: "#A69A91" },
  infoBox: {
    marginTop: s(80),
    minHeight: s(74),
    paddingVertical: s(15),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: "#FF7F00",
    backgroundColor: "#FFE0C4",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: s(12),
  },
  infoText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: s(16),
    lineHeight: s(20),
    textAlign: "center",
    paddingHorizontal: s(25),
  },
  backgroundPaw: {
    position: "absolute",
    width: 72 * SCALE,
    height: 72 * SCALE,
    opacity: 0.075,
    zIndex: 0,
  },
  pawTopLeft: {
    top: 28 * SCALE,
    left: 22 * SCALE,
    transform: [{ rotate: "-12deg" }],
  },
  pawTopRight: {
    top: 150 * SCALE,
    right: -15 * SCALE,
    transform: [{ rotate: "15deg" }],
  },
  pawMiddleRight: {
    top: 390 * SCALE,
    right: 0,
    transform: [{ rotate: "-8deg" }],
  },
  pawBottomRight: {
    bottom: 10 * SCALE,
    right: 20 * SCALE,
    transform: [{ rotate: "-12deg" }],
  },
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: s(6),
    paddingBottom: s(10),
    backgroundColor: "transparent",
    zIndex: 20,
    alignItems: "center",
  },
  continueButton: {
    width: "100%",
    height: s(50),
    borderRadius: s(15),
  },
  buttonPaw: {
    position: "absolute",
    top: "-30%",
    width: s(40),
    height: s(40),
    marginTop: s(-11.5),
    marginLeft: s(20),
    zIndex: 10,
  },
  skipButton: {
    alignSelf: "center",
    marginTop: s(9),
    paddingHorizontal: s(12),
    paddingVertical: s(2),
  },
  skipText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontWeight: 900,
    fontSize: s(14),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(25, 15, 10, 0.32)",
    justifyContent: "center",
    paddingHorizontal: s(25),
  },
  modalCard: {
    maxHeight: "75%",
    borderRadius: s(16),
    padding: s(18),
    backgroundColor: "#FFFCF9",
    borderWidth: 1,
    borderColor: "#FFDCC0",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: s(12),
  },
  modalTitle: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: s(18),
  },
  optionsList: { maxHeight: s(360) },
  optionsContent: { paddingBottom: s(4) },
  optionRow: {
    minHeight: s(45),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0DCCB",
    paddingHorizontal: s(4),
  },
  optionText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: s(15),
  },
  optionCircle: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 1,
    borderColor: "#D7BDA8",
  },
  notesInput: {
    minHeight: s(115),
    borderWidth: 1,
    borderColor: "#FFDCC0",
    borderRadius: s(10),
    padding: s(12),
    color: "#381B0E",
    fontFamily: "Nunito_400Regular",
    fontSize: s(14),
    backgroundColor: "#FFFFFF",
  },
  doneButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: s(13),
    minHeight: s(42),
    borderRadius: s(10),
    backgroundColor: "#FF7F00",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: s(14),
  },
});