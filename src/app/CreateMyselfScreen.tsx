import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

type AvatarTab = "Fur" | "Face" | "Ears" | "Eyes" | "Body" | "Markings" | "More";
type ImageChoice = {
  id: string;
  label: string;
  image: ImageSourcePropType;
  locked?: boolean;
  points?: number;
};

interface CreateMyselfScreenProps {
  onBack: () => void;
  onContinue: () => void;
  avatarImage?: ImageSourcePropType;
}

const TABS: AvatarTab[] = ["Fur", "Face", "Ears", "Eyes", "Body", "Markings", "More"];

const FUR_COLORS: ImageChoice[] = [
  { id: "fur-color-1", label: "Color 1", image: require("../../assets/images/createMyself/fur/furcolor1.png") },
  { id: "fur-color-2", label: "Color 2", image: require("../../assets/images/createMyself/fur/furcolor2.png") },
  { id: "fur-color-3", label: "Color 3", image: require("../../assets/images/createMyself/fur/furcolor3.png") },
  { id: "fur-color-4", label: "Color 4", image: require("../../assets/images/createMyself/fur/furcolor4.png") },
  { id: "fur-color-5", label: "Color 5", image: require("../../assets/images/createMyself/fur/furcolor5.png") },
  { id: "fur-color-6", label: "Color 6", image: require("../../assets/images/createMyself/fur/furcolor6.png") },
  { id: "fur-color-7", label: "Color 7", image: require("../../assets/images/createMyself/fur/furcolor7.png"), locked: true, points: 15 },
  { id: "fur-color-8", label: "Color 8", image: require("../../assets/images/createMyself/fur/furcolor8.png"), locked: true, points: 15 },
  { id: "fur-color-9", label: "Color 9", image: require("../../assets/images/createMyself/fur/furcolor9.png"), locked: true, points: 20 },
  { id: "fur-color-10", label: "Color 10", image: require("../../assets/images/createMyself/fur/furcolor10.png"), locked: true, points: 20 },
  { id: "fur-color-11", label: "Color 11", image: require("../../assets/images/createMyself/fur/furcolor11.png"), locked: true, points: 25 },
  { id: "fur-color-12", label: "Color 12", image: require("../../assets/images/createMyself/fur/furcolor12.png"), locked: true, points: 30 },
];

const FUR_PATTERNS: ImageChoice[] = [
  { id: "fur-pattern-1", label: "Pattern 1", image: require("../../assets/images/createMyself/fur/furpattern1.png") },
  { id: "fur-pattern-2", label: "Pattern 2", image: require("../../assets/images/createMyself/fur/furpattern2.png") },
  { id: "fur-pattern-3", label: "Pattern 3", image: require("../../assets/images/createMyself/fur/furpattern3.png") },
  { id: "fur-pattern-4", label: "Pattern 4", image: require("../../assets/images/createMyself/fur/furpattern4.png"), locked: true, points: 20 },
  { id: "fur-pattern-5", label: "Pattern 5", image: require("../../assets/images/createMyself/fur/furpattern5.png"), locked: true, points: 25 },
  { id: "fur-pattern-6", label: "Pattern 6", image: require("../../assets/images/createMyself/fur/furpattern6.png"), locked: true, points: 25 },
];

const FUR_LENGTHS: ImageChoice[] = [
  { id: "fur-length-1", label: "Short", image: require("../../assets/images/createMyself/fur/furlength1.png") },
  { id: "fur-length-2", label: "Medium", image: require("../../assets/images/createMyself/fur/furlength2.png") },
  { id: "fur-length-3", label: "Long", image: require("../../assets/images/createMyself/fur/furlength3.png"), locked: true, points: 20 },
];

const EAR_SHAPES: ImageChoice[] = [
  { id: "ear-shape-1", label: "Default", image: require("../../assets/images/createMyself/ears/shape1.png") },
  { id: "ear-shape-2", label: "Floppy", image: require("../../assets/images/createMyself/ears/shape2.png") },
  { id: "ear-shape-3", label: "Round", image: require("../../assets/images/createMyself/ears/shape3.png") },
  { id: "ear-shape-4", label: "Folded", image: require("../../assets/images/createMyself/ears/shape4.png") },
  { id: "ear-shape-5", label: "Pointed", image: require("../../assets/images/createMyself/ears/shape5.png") },
  { id: "ear-shape-6", label: "Big Ears", image: require("../../assets/images/createMyself/ears/shape6.png"), locked: true, points: 15 },
  { id: "ear-shape-7", label: "Droopy", image: require("../../assets/images/createMyself/ears/shape7.png"), locked: true, points: 15 },
  { id: "ear-shape-8", label: "Curly", image: require("../../assets/images/createMyself/ears/shape8.png"), locked: true, points: 20 },
  { id: "ear-shape-9", label: "Tufted", image: require("../../assets/images/createMyself/ears/shape9.png"), locked: true, points: 20 },
  { id: "ear-shape-10", label: "Up & Down", image: require("../../assets/images/createMyself/ears/shape10.png"), locked: true, points: 25 },
];

const EAR_SIZES: ImageChoice[] = [
  { id: "ear-size-1", label: "Small", image: require("../../assets/images/createMyself/earsize/earsize1.png") },
  { id: "ear-size-2", label: "Medium", image: require("../../assets/images/createMyself/earsize/earsize2.png") },
  { id: "ear-size-3", label: "Large", image: require("../../assets/images/createMyself/earsize/earsize3.png") },
];

const EAR_STYLES: ImageChoice[] = [
  { id: "ear-style-1", label: "None", image: require("../../assets/images/createMyself/earstyle/earstyle1.png") },
  { id: "ear-style-2", label: "Slightly Fluffy", image: require("../../assets/images/createMyself/earstyle/earstyle2.png") },
  { id: "ear-style-3", label: "Fluffy", image: require("../../assets/images/createMyself/earstyle/earstyle3.png") },
  { id: "ear-style-4", label: "Feathered", image: require("../../assets/images/createMyself/earstyle/earstyle4.png"), locked: true, points: 15 },
  { id: "ear-style-5", label: "Extra Fluffy", image: require("../../assets/images/createMyself/earstyle/earstyle5.png"), locked: true, points: 20 },
  { id: "ear-style-6", label: "Messy", image: require("../../assets/images/createMyself/earstyle/earstyle6.png"), locked: true, points: 25 },
];

const EAR_COLORS: ImageChoice[] = [
  { id: "ear-color-1", label: "Color 1", image: require("../../assets/images/createMyself/earcolor/earcolor1.png") },
  { id: "ear-color-2", label: "Color 2", image: require("../../assets/images/createMyself/earcolor/earcolor2.png") },
  { id: "ear-color-3", label: "Color 3", image: require("../../assets/images/createMyself/earcolor/earcolor3.png") },
  { id: "ear-color-4", label: "Color 4", image: require("../../assets/images/createMyself/earcolor/earcolor4.png") },
  { id: "ear-color-5", label: "Color 5", image: require("../../assets/images/createMyself/earcolor/earcolor5.png"), locked: true, points: 15 },
  { id: "ear-color-6", label: "Color 6", image: require("../../assets/images/createMyself/earcolor/earcolor6.png"), locked: true, points: 20 },
  { id: "ear-color-7", label: "Color 7", image: require("../../assets/images/createMyself/earcolor/earcolor7.png"), locked: true, points: 25 },
];


const EYE_SHAPES: ImageChoice[] = [
  { id: "eye-shape-1", label: "Default", image: require("../../assets/images/createMyself/eyes/shape1.png") },
  { id: "eye-shape-2", label: "Round", image: require("../../assets/images/createMyself/eyes/shape2.png") },
  { id: "eye-shape-3", label: "Almond", image: require("../../assets/images/createMyself/eyes/shape3.png") },
  { id: "eye-shape-4", label: "Sleepy", image: require("../../assets/images/createMyself/eyes/shape4.png") },
  { id: "eye-shape-5", label: "Smiling", image: require("../../assets/images/createMyself/eyes/shape5.png") },
  { id: "eye-shape-6", label: "Wide", image: require("../../assets/images/createMyself/eyes/shape6.png") },
  { id: "eye-shape-7", label: "Narrow", image: require("../../assets/images/createMyself/eyes/shape7.png"), locked: true, points: 15 },
  { id: "eye-shape-8", label: "Curious", image: require("../../assets/images/createMyself/eyes/shape8.png"), locked: true, points: 20 },
  { id: "eye-shape-9", label: "Serious", image: require("../../assets/images/createMyself/eyes/shape9.png"), locked: true, points: 25 },
  { id: "eye-shape-10", label: "Goofy", image: require("../../assets/images/createMyself/eyes/shape10.png"), locked: true, points: 30 },
];

const EYE_COLORS: ImageChoice[] = [
  { id: "eye-color-1", label: "Color 1", image: require("../../assets/images/createMyself/eyecolor/eyecolor1.png") },
  { id: "eye-color-2", label: "Color 2", image: require("../../assets/images/createMyself/eyecolor/eyecolor2.png") },
  { id: "eye-color-3", label: "Color 3", image: require("../../assets/images/createMyself/eyecolor/eyecolor3.png") },
  { id: "eye-color-4", label: "Color 4", image: require("../../assets/images/createMyself/eyecolor/eyecolor4.png") },
  { id: "eye-color-5", label: "Color 5", image: require("../../assets/images/createMyself/eyecolor/eyecolor5.png") },
  { id: "eye-color-6", label: "Color 6", image: require("../../assets/images/createMyself/eyecolor/eyecolor6.png"), locked: true, points: 15 },
  { id: "eye-color-7", label: "Color 7", image: require("../../assets/images/createMyself/eyecolor/eyecolor7.png"), locked: true, points: 15 },
  { id: "eye-color-8", label: "Color 8", image: require("../../assets/images/createMyself/eyecolor/eyecolor8.png"), locked: true, points: 15 },
  { id: "eye-color-9", label: "Color 9", image: require("../../assets/images/createMyself/eyecolor/eyecolor9.png"), locked: true, points: 30 },
];

const TAB_LABEL: Record<AvatarTab, string> = {
  Fur: "Fur Color",
  Face: "Face Style",
  Ears: "Ear Style",
  Eyes: "Eye Style",
  Body: "Body Style",
  Markings: "Markings",
  More: "More Options",
};

export default function CreateMyselfScreen({
  onBack,
  onContinue,
  avatarImage,
}: CreateMyselfScreenProps) {
  const { height } = useWindowDimensions()
  const [activeTab, setActiveTab] = useState<AvatarTab>("Fur");
  const [selectedColor, setSelectedColor] = useState("fur-color-1");
  const [selectedPattern, setSelectedPattern] = useState("fur-pattern-1");
  const [selectedLength, setSelectedLength] = useState("fur-length-1");
  const [selectedEarShape, setSelectedEarShape] = useState("ear-shape-1");
  const [selectedEarSize, setSelectedEarSize] = useState("ear-size-2");
  const [selectedEarStyle, setSelectedEarStyle] = useState("ear-style-1");
  const [selectedEarColor, setSelectedEarColor] = useState("ear-color-1");
  const [selectedEyeShape, setSelectedEyeShape] = useState("eye-shape-1");
  const [selectedEyeColor, setSelectedEyeColor] = useState("eye-color-1");

  const renderLockBadge = (points?: number) => (
    <View style={styles.lockBadge}>
      <Image
        source={require("../../assets/images/paw.png")}
        resizeMode="contain"
        style={styles.pointsPaw}
      />
      {points !== undefined && <Text style={styles.lockPoints}>{points}</Text>}
    </View>
  );

  const renderImageOption = (
    item: ImageChoice,
    selected: boolean,
    onSelect: () => void,
    compact = false,
  ) => {
    const locked = Boolean(item.locked);
    return (
      <Pressable
        key={item.id}
        accessibilityRole="button"
        accessibilityLabel={`${item.label}${locked ? ", locked" : ""}`}
        accessibilityState={{ disabled: locked, selected }}
        disabled={locked}
        onPress={locked ? undefined : onSelect}
        style={[styles.optionColumn, compact && styles.compactOptionColumn]}
      >
        <View
          style={[
            styles.imageOptionCard,
            compact && styles.compactImageOptionCard,
            selected && styles.imageOptionSelected,
          ]}
        >
          <View style={[styles.optionImageWrap, compact && styles.compactOptionImageWrap]}>
            <Image source={item.image} resizeMode="contain" style={styles.optionImage} />
            {locked && (
              <View style={styles.imageLockOverlay}>
                <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
              </View>
            )}
          </View>
          {!compact && (
            <Text numberOfLines={2} style={[styles.imageOptionLabel, selected && styles.imageOptionLabelSelected]}>
              {item.label}
            </Text>
          )}
        </View>
        {locked && renderLockBadge(item.points)}
      </Pressable>
    );
  };

  const renderImageRow = (
    items: ImageChoice[],
    selectedId: string,
    onSelect: (id: string) => void,
    compact = false,
  ) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.imageOptionsRow}
      nestedScrollEnabled
    >
      {items.map((item) =>
        renderImageOption(item, selectedId === item.id, () => onSelect(item.id), compact)
      )}
    </ScrollView>
  );

  const renderFurOptions = () => (
    <>
      <Text style={styles.groupLabel}>Fur Color</Text>
      {renderImageRow(FUR_COLORS, selectedColor, setSelectedColor, true)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Fur Pattern</Text>
      {renderImageRow(FUR_PATTERNS, selectedPattern, setSelectedPattern, true)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Fur Length</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lengthOptionsRow}
        nestedScrollEnabled
      >
        {FUR_LENGTHS.map((item) => {
          const selected = selectedLength === item.id;
          const locked = Boolean(item.locked);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}${locked ? ", locked" : ""}`}
              accessibilityState={{ disabled: locked, selected }}
              disabled={locked}
              onPress={locked ? undefined : () => setSelectedLength(item.id)}
              style={styles.lengthOptionColumn}
            >
              <View style={[styles.lengthOptionCard, selected && styles.imageOptionSelected]}>
                <View style={styles.lengthImageWrap}>
                  <Image source={item.image} resizeMode="contain" style={styles.optionImage} />
                  {locked && (
                    <View style={styles.imageLockOverlay}>
                      <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <Text style={[styles.lengthOptionLabel, selected && styles.imageOptionLabelSelected]}>
                  {item.label}
                </Text>
              </View>
              {locked && renderLockBadge(item.points)}
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );

  const renderEarOptions = () => (
    <>
      <Text style={styles.groupLabel}>Ear Shape</Text>
      {renderImageRow(EAR_SHAPES, selectedEarShape, setSelectedEarShape)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Ear Size</Text>
      {renderImageRow(EAR_SIZES, selectedEarSize, setSelectedEarSize)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Ear Style</Text>
      {renderImageRow(EAR_STYLES, selectedEarStyle, setSelectedEarStyle)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Ear Color</Text>
      {renderImageRow(EAR_COLORS, selectedEarColor, setSelectedEarColor, true)}
    </>
  );

  const renderEyeOptions = () => (
    <>
      <Text style={styles.groupLabel}>Eye Shape</Text>
      {renderImageRow(EYE_SHAPES, selectedEyeShape, setSelectedEyeShape)}

      <Text style={[styles.groupLabel, styles.sectionGap]}>Eye Color</Text>
      {renderImageRow(EYE_COLORS, selectedEyeColor, setSelectedEyeColor, true)}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(8, height * 0.055) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headingRow}>
              <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={styles.headingPaw}
              />
              <Text style={styles.heading}>Create Myself</Text>
            </View>
            <Text style={styles.subtitle}>
              Build Brownie’s avatar step by step and
              make it uniquely his!
            </Text>
          </View>

          <View style={styles.avatarStage}>
            <View style={styles.avatarBackdrop} />
            {avatarImage ? (
  <Image
    source={avatarImage}
    style={styles.avatarImage}
    resizeMode="contain"
  />
) : (
  <Image
    source={require("../../assets/images/chooseAvatar/dog.png")}
    style={styles.avatarImage}
    resizeMode="contain"
  />
)}
          </View>

          <View style={styles.customizerCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsRow}
            >
              {TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <Pressable
                    key={tab}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    onPress={() => setActiveTab(tab)}
                    style={styles.tabButton}
                  >
                    <Text style={[styles.tabText, active && styles.activeTabText]}>
                      {tab}
                    </Text>
                    {active && <View style={styles.activeTabLine} />}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.optionsArea}>
              {activeTab === "Fur" ? (
                renderFurOptions()
              ) : activeTab === "Ears" ? (
                renderEarOptions()
              ) : activeTab === "Eyes" ? (
                renderEyeOptions()
              ) : (
                <View style={styles.comingSoon}>
                  <Ionicons name="paw-outline" size={25} color="#D6A16C" />
                  <Text style={styles.comingSoonText}>
                    Choose {TAB_LABEL[activeTab].toLowerCase()} options
                  </Text>
                  <Text style={styles.comingSoonHint}>
                    More customization options will appear here.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <Ionicons name="arrow-back" size={16} color="#FF7A00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.continueButtonWrap}>
            <PrimaryButton
              title="Continue"
              onPress={() => router.push("/OptionalHealthBasicsScreen")}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  header: {
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 12,
  },
  headingRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headingPaw: {
    width: 31,
    height: 31,
    marginRight: 2,
    opacity: 0.11,
  },
  heading: {
    color: "#FF7A00",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 32,
    lineHeight: 36,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  subtitle: {
    marginTop: 2,
    color: "#382018",
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
  },

  avatarStage: {
    height: 202,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FFFAF5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFE0C2",
  },
  avatarBackdrop: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#FFE0C2",
  },
  avatarImage: { width: 178, height: 180, zIndex: 1,marginTop:-15 },
  avatarFallback: { alignItems: "center", justifyContent: "center", zIndex: 1 },
  avatarEmoji: { fontSize: 116 },

  customizerCard: {
    marginTop: -15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  tabsRow: {
    minWidth: "100%",
    height: 42,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  tabButton: {
    height: 42,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  tabText: { color: "#382018", fontFamily: "Nunito_700Bold", fontSize: 12,lineHeight:16 },
  activeTabText: { color: "#FF7A00" },
  activeTabLine: {
    position: "absolute",
    bottom: 0,
    left: 3,
    right: 3,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#FF7A00",
  },
  optionsArea: { paddingHorizontal: 7, paddingTop: 7, paddingBottom: 10 },
  groupLabel: {
    color: "#382018",
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    lineHeight:16,
    marginBottom: 5,
  },
  sectionGap: { marginTop: 10 },
  imageOptionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingBottom: 3,
    paddingRight: 8,
  },
  optionColumn: {
    alignItems: "center",
  },
  compactOptionColumn: {
    width: 52,
  },
  imageOptionCard: {
    width: 69,
    minHeight: 91,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingHorizontal: 3,
    paddingBottom: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFE0C2",
    backgroundColor: "#FFFAF5",
  },
  compactImageOptionCard: {
    width: 52,
    minHeight: 51,
    padding: 3,
    justifyContent: "center",
  },
  lengthOptionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingBottom: 3,
    paddingRight: 8,
  },
  lengthOptionColumn: {
    width: 145,
    alignItems: "center",
  },
  lengthOptionCard: {
    width: "100%",
    minHeight: 60,
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#FFE0C2",
    backgroundColor: "#FFFAF5",
  },
  lengthImageWrap: {
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  lengthOptionLabel: {
    flex: 1,
    color: "#382018",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    textAlign: "center",
  },
  imageOptionSelected: {
    borderColor: "#FF7A00",
    borderWidth: 1.3,
    backgroundColor: "#FFE0C2",
  },
  optionImageWrap: {
    width: 59,
    height: 57,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden",
  },
  compactOptionImageWrap: {
    width: 42,
    height: 42,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
  imageLockOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56,32,24,0.35)",
    borderRadius: 4,
  },
  imageOptionLabel: {
    marginTop: 3,
    minHeight: 22,
    color: "#382018",
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  imageOptionLabelSelected: {
    color: "#FF7A00",
  },
  pointsPaw: {
    width: 11,
    height: 11,
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 22,
    height: 16,
    paddingHorizontal: 5,
    marginTop: 5,
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: "#FF7A00",
    backgroundColor: "#FFF0E2",
  },
  lockPoints: {
    color: "#FF7A00",
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "Nunito_700Bold",
  },

  comingSoon: {
    minHeight: 185,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  comingSoonText: {
    marginTop: 8,
    color: "#382018",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  comingSoonHint: {
    marginTop: 4,
    color: "#9B765F",
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    textAlign: "center",
  },

  footer: {
    minHeight: 51,
    paddingHorizontal: 9,
    paddingTop: 4,
    paddingBottom: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 100,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#FFF0E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginRight:10
  },
  backText: { color: "#FF7A00", fontFamily: "Nunito_700Bold", fontSize: 12,lineHeight:16 },
  continueButtonWrap: { flex: 1 },
  continueButton: {
    width: "100%",
    height: 36,
    
    elevation: 0,
    shadowOpacity: 0,
  },
 
  buttonPaw: {  width: 40,
        height: 40,

        marginLeft: -10,

        zIndex: 10, },
  buttonPressed: { opacity: 0.8 },
});
