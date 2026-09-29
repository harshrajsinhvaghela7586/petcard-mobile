import React, { useMemo, useState } from "react";
import {
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
        <Text style={styles.fieldTitle}>{meta.title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${meta.title}, ${value || meta.placeholder}`}
          onPress={() => openField(field)}
          style={[styles.fieldInput, field === "bloodType" && !value && styles.bloodTypeInput]}
        >
          <Text
            numberOfLines={1}
            style={[styles.fieldValue, !value && styles.placeholder]}
          >
            {value || meta.placeholder}
          </Text>
          <Ionicons name="chevron-down" size={17} color="#A77C59" />
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
          <Text style={styles.title}>Optional Health Basics</Text>
          <Text style={styles.subtitle}>
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
          <Text style={styles.infoText}>
            You can always add or update these details later in the Health section.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="Continue"
          onPress={() => onContinue(details)}
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
          <Text style={styles.skipText}>Skip for now</Text>
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
              <Text style={styles.modalTitle}>{activeMeta?.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setActiveField(null)}
                hitSlop={10}
              >
                <Ionicons name="close" size={22} color="#381B0E" />
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
                  style={styles.notesInput}
                />
                <Pressable
                  style={styles.doneButton}
                  onPress={() => {
                    updateField("specialNotes", notesDraft.trim());
                    setActiveField(null);
                  }}
                >
                  <Text style={styles.doneButtonText}>Save Notes</Text>
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
                      <Text style={styles.optionText}>{option}</Text>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={20} color="#FF7F00" />
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
                    <Text style={styles.doneButtonText}>Done</Text>
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
    paddingHorizontal: 10,
    paddingBottom: 170,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 30,
  },
  title: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 32,
    lineHeight: 36,
    color: "#FF7F00",
    textAlign: "center",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    lineHeight: 28,
    color: "#381B0E",
    textAlign: "center",
  },
  fields: {
    gap: 5,
    paddingHorizontal: 12,
  },
  fieldCard: {
    width: "100%",
    minHeight: 74,
    paddingHorizontal: 29,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#FF7F00",
    backgroundColor: "#FFFCF9",
    justifyContent: "center",
  },
  fieldTitle: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 1,
  },
  fieldInput: {
    minHeight: 31,
    borderWidth: 1,
    borderColor: "#FFDCC0",
    borderRadius: 10,
    paddingHorizontal: 10,
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
    fontSize: 13,
    paddingRight: 8,
  },
  placeholder: { color: "#A69A91" },
  infoBox: {
    marginTop: 80,
    minHeight: 74,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF7F00",
    backgroundColor: "#FFE0C4",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  infoText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal:25
  },
  backgroundPaw: {
    position: "absolute",
    width: 72,
    height: 72,
    opacity: 0.075,
    zIndex: 0,
  },
  pawTopLeft: {
    top: 28,
    left: 22,
    transform: [{ rotate: "-12deg" }],
  },
  pawTopRight: {
    top: 150,
    right: -15,
    transform: [{ rotate: "15deg" }],
  },
  pawMiddleRight: {
    top: 390,
    right: 0,
    transform: [{ rotate: "-8deg" }],
  },
  pawBottomRight: {
    bottom: 10,
    right: 20,
    transform: [{ rotate: "-12deg" }],
  },
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
    paddingBottom: 10,
    backgroundColor: "transparent",
    zIndex: 20,
    alignItems: "center",
  },
  continueButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
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
  skipButton: {
    alignSelf: "center",
    marginTop: 9,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  skipText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontWeight:900,
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(25, 15, 10, 0.32)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  modalCard: {
    maxHeight: "75%",
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#FFFCF9",
    borderWidth: 1,
    borderColor: "#FFDCC0",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
  optionsList: { maxHeight: 360 },
  optionsContent: { paddingBottom: 4 },
  optionRow: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0DCCB",
    paddingHorizontal: 4,
  },
  optionText: {
    color: "#381B0E",
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
  },
  optionCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D7BDA8",
  },
  notesInput: {
    minHeight: 115,
    borderWidth: 1,
    borderColor: "#FFDCC0",
    borderRadius: 10,
    padding: 12,
    color: "#381B0E",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  doneButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 13,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: "#FF7F00",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
});
