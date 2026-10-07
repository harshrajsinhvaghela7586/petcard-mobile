import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const SCALE = Math.min(
  width / DESIGN_WIDTH,
  height / DESIGN_HEIGHT
);

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, gap,
 * icon size...) is multiplied by the same scale factor, so the
 * screen looks like the design (393 x 852) on every device.
 *
 * - Small phones  -> everything shrinks proportionally
 * - Medium phones -> ~ same as design
 * - Large phones  -> grows proportionally, capped at 1.3
 */
const UI_SCALE = Math.min(SCALE, 1.3);

const s = (size: number) => size * UI_SCALE;

/*
 * Exactly the same avatar geometry as GuardianProfileScreen:
 * 125px design circle, centered on every device, with the camera
 * and remove controls anchored to the same circle edge.
 */
const PROFILE_SIZE = s(125);
const PROFILE_EDGE = (width - PROFILE_SIZE) / 2;

interface CreateMyselfScreenProps {
  onBack: () => void;
  onContinue: () => void;
  avatarImage?: ImageSourcePropType;
}

export default function CreateMyselfScreen({
  onBack,
  onContinue,
  avatarImage,
}: CreateMyselfScreenProps) {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Nunito_700Bold,
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!fontsLoaded) {
    return null;
  }

  const handleChoosePhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.length) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    setUploadedImage(null);
  };

  const displayImage = uploadedImage || avatarImage;

  return (
    /*
     * "top" edge is not used here, so the title starts at the same
     * place as GuardianProfileScreen (height * 0.112 from screen top).
     */
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <View style={styles.container}>

        {/* BACKGROUND PAWS (same as GuardianProfileScreen) */}

        <Image
          source={require("../../assets/images/paw.png")}
          resizeMode="contain"
          style={[styles.backgroundPaw, styles.pawTopLeft]}
        />

        <Image
          source={require("../../assets/images/paw.png")}
          resizeMode="contain"
          style={[styles.backgroundPaw, styles.pawTopRight]}
        />

        <Image
          source={require("../../assets/images/paw.png")}
          resizeMode="contain"
          style={[styles.backgroundPaw, styles.pawBottomLeft]}
        />

        <Image
          source={require("../../assets/images/paw.png")}
          resizeMode="contain"
          style={[styles.backgroundPaw, styles.pawBottomRight]}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER — same alignment as GuardianProfileScreen */}
          <View style={styles.header}>
            <Text style={styles.title} maxFontSizeMultiplier={1.1}>
              Create Myself
            </Text>

            <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
              Upload your avatar and make it uniquely yours!
            </Text>
          </View>

          {/* AVATAR UPLOAD — same as GuardianProfileScreen */}
          <View style={styles.profileSection}>
            <Pressable
              onPress={handleChoosePhoto}
              accessibilityRole="button"
              accessibilityLabel={
                uploadedImage
                  ? "Change avatar image"
                  : "Upload avatar image"
              }
              style={styles.profileCircle}
            >
              {displayImage ? (
                <Image
                  source={
                    uploadedImage
                      ? { uri: uploadedImage }
                      : displayImage
                  }
                  resizeMode="cover"
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.emptyPhotoContent}>
                  <Ionicons
                    name="camera-outline"
                    size={s(31)}
                    color="#FF7A00"
                  />

                  <Text
                    style={styles.photoHint}
                    maxFontSizeMultiplier={1.1}
                  >
                    Add Photo
                  </Text>
                </View>
              )}
            </Pressable>

            {!uploadedImage && (
              <Pressable
                onPress={handleChoosePhoto}
                accessibilityRole="button"
                accessibilityLabel="Upload avatar image"
                style={({ pressed }) => [
                  styles.cameraButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="camera"
                  size={s(20)}
                  color="#382018"
                />
              </Pressable>
            )}

            {uploadedImage && (
              <Pressable
                onPress={handleRemovePhoto}
                accessibilityRole="button"
                accessibilityLabel="Remove uploaded avatar"
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="close"
                  size={s(17)}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>

          {/* INFO */}
          <View style={styles.infoCard}>
            <Ionicons
              name="image-outline"
              size={s(21)}
              color="#FF7A00"
            />

            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle} maxFontSizeMultiplier={1.1}>
                Upload your avatar
              </Text>

              <Text style={styles.infoText} maxFontSizeMultiplier={1.1}>
                Choose a square image from your gallery. You can change or
                remove it anytime.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={s(16)}
              color="#FF7A00"
            />

            <Text style={styles.backText} maxFontSizeMultiplier={1.1}>
              Back
            </Text>
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
              style={styles.continueButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  /*
   * Same top alignment as PetTypeScreen, PetDetailsScreen and
   * GuardianProfileScreen: 11.2% of the screen height.
   */
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: s(10),
    paddingTop: height * 0.112,
    paddingBottom: s(30),
  },

  /* ==============================
     HEADER
  ============================== */

  header: {
    alignItems: "center",
    paddingHorizontal: s(5),
  },

  title: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: s(32),
    lineHeight: s(36),
    color: "#FF7A00",
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

  /* ==============================
     AVATAR UPLOAD (same as GuardianProfileScreen)
  ============================== */

  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: s(25),
    height: s(110),
    position: "relative",
  },

  profileCircle: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: 100,
    backgroundColor: "#FFE0C4",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  // fills the whole circle (no gap around the photo)
  avatarImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
  },

  emptyPhotoContent: {
    top: s(-40),
    alignItems: "center",
    justifyContent: "center",
  },

  photoHint: {
    marginTop: s(3),
    fontFamily: "Nunito_700Bold",
    fontSize: s(10),
    color: "#FF7A00",
  },

  cameraButton: {
    position: "absolute",
    right: PROFILE_EDGE,
    bottom: s(-10),

    width: s(40),
    height: s(40),
    borderRadius: s(20),

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#F0E1D8",

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: s(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: s(4),

    zIndex: 10,
  },

  removeButton: {
    position: "absolute",
    // top-right corner of the circle, 5px from its bounding box
    // (same offset as PetDetailsScreen: right 5 / top 5)
    right: PROFILE_EDGE + s(5),
    top: (s(110) - PROFILE_SIZE) / 2 + s(5),

    width: s(29),
    height: s(29),
    borderRadius: s(15),

    backgroundColor: "#FF4B32",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",

    elevation: 5,
    zIndex: 20,
  },

  pressed: {
    opacity: 0.75,
  },

  /* ==============================
     INFO
  ============================== */

  infoCard: {
    flexDirection: "row",
    alignItems: "center",

    // 25 + 15: keeps the same gap as before now that the
    // upload section height is 110 (same as GuardianProfileScreen)
    marginTop: s(40),
    marginHorizontal: s(2),
    paddingHorizontal: s(14),
    paddingVertical: s(14),

    backgroundColor: "#FFFAF5",
    borderWidth: 1,
    borderColor: "#FFE0C2",
    borderRadius: s(12),
  },

  infoTextWrap: {
    flex: 1,
    marginLeft: s(10),
  },

  infoTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: s(14),
    lineHeight: s(19),
    color: "#382018",
  },

  infoText: {
    marginTop: s(2),
    fontFamily: "Nunito_700Bold",
    fontSize: s(11),
    lineHeight: s(16),
    color: "#8B6D5C",
  },

  /* ==============================
     BACKGROUND PAWS
  ============================== */

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
    top: 135 * SCALE,
    right: 15 * SCALE,

    transform: [{ rotate: "15deg" }],
  },

  pawBottomLeft: {
    bottom: 125 * SCALE,
    left: 15 * SCALE,

    transform: [{ rotate: "12deg" }],
  },

  pawBottomRight: {
    bottom: 10 * SCALE,
    right: 20 * SCALE,

    transform: [{ rotate: "-12deg" }],
  },

  /* ==============================
     FOOTER
  ============================== */

  footer: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: s(16),
    paddingTop: s(8),
    paddingBottom: s(8),

    backgroundColor: "#FFFFFF",
  },

  backButton: {
    height: s(46),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: s(5),
    marginRight: s(10),
  },

  backText: {
    marginLeft: s(5),
    fontFamily: "Nunito_700Bold",
    fontSize: s(14),
    color: "#FF7A00",
  },

  continueButtonWrap: {
    flex: 1,
    maxWidth: 380,
  },

  continueButton: {
    width: "100%",
    height: Math.min(height * 0.061, 52),
    borderRadius: s(15),
  },

  buttonPaw: {
    width: s(40),
    height: s(40),
  },
});