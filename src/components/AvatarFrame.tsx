import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* Frames get richer with the level: 1-3 plain ring, 4-6 two-tone gradient, 7-10 premium (3-tone gradient, glow, crown). */
export const FRAME_STYLES: Record<string, { level: number; colors: [string, string, ...string[]] }> = {
    frame_default: { level: 1, colors: ["#D8CABB", "#C9B7A5"] },
    frame_silver: { level: 2, colors: ["#C9D0D8", "#9AA5B1"] },
    frame_gold: { level: 3, colors: ["#F2C94C", "#C98F1A"] },
    frame_platinum: { level: 4, colors: ["#E6EEF4", "#8D9DAA", "#C7D4DE"] },
    frame_diamond: { level: 5, colors: ["#8EE6F2", "#3F9FB5", "#C9F6FB"] },
    frame_royal: { level: 6, colors: ["#A58BFF", "#5B3FE0", "#D2C4FF"] },
    frame_elite: { level: 7, colors: ["#5A4F7A", "#1E1A2E", "#B89CFF"] },
    frame_legendary: { level: 8, colors: ["#FFE27A", "#B8860B", "#FFF3B8", "#8C5E00"] },
    frame_mythic: { level: 9, colors: ["#FF8AC4", "#B02A78", "#FFC2E3", "#6A1B9A"] },
    frame_celestial: { level: 10, colors: ["#7FA2FF", "#3A4FB8", "#BFE0FF", "#FFD36B"] },
};

export default function AvatarFrame({ frameKey, size, children, locked }: { frameKey?: string | null; size: number; children: React.ReactNode; locked?: boolean }) {
    const f = FRAME_STYLES[frameKey ?? ""] ?? FRAME_STYLES.frame_default;
    const ring = f.level >= 7 ? size * 0.085 : f.level >= 4 ? size * 0.07 : size * 0.055;
    const premium = f.level >= 7;
    return (
        <View style={[{ width: size, height: size }, premium && { shadowColor: f.colors[1], shadowOpacity: 0.55, shadowRadius: size * 0.1, shadowOffset: { width: 0, height: 0 }, elevation: 8 }, locked && { opacity: 0.6 }]}>
            <LinearGradient colors={f.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]} />
            <View style={{ position: "absolute", top: ring, left: ring, right: ring, bottom: ring, borderRadius: size / 2, backgroundColor: "#FFF3E3", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{children}</View>
            {premium ? (
                <View style={{ position: "absolute", top: -size * 0.12, alignSelf: "center" }}>
                    <MaterialCommunityIcons name="crown" size={size * 0.26} color={f.colors[f.colors.length - 1]} />
                </View>
            ) : null}
        </View>
    );
}
