import React from "react";
import { ActivityIndicator, View } from "react-native";

/** White screen with a small spinner, shown while a screen's images are loading. */
export default function ScreenLoader() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="small" color="#FF7A00" />
    </View>
  );
}
