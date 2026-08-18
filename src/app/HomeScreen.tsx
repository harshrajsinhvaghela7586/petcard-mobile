import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            Welcome to PetCard
          </Text>
        </View>

        <Text style={styles.code}>
          Get Started
        </Text>

        <View style={styles.stepContainer}>
          <Text style={styles.text}>
            Try editing{" "}
            <Text style={styles.codeText}>
              src/app/index.tsx
            </Text>
          </Text>

          <Text style={styles.text}>
            {Platform.OS === "web"
              ? "Use browser devtools"
              : "Shake device for dev menu"}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },

  code: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF7A00",
    textTransform: "uppercase",
    marginBottom: 20,
  },

  stepContainer: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    gap: 10,
  },

  text: {
    fontSize: 14,
    color: "#333333",
  },

  codeText: {
    fontWeight: "bold",
    color: "#FF7A00",
  },
});