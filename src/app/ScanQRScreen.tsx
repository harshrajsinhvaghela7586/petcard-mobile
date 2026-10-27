import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, { C, PawBackground, SIDE, SCALE, s, useAppFonts } from "@/components/SectionHeader";
import FakeQR from "@/components/FakeQR";
import BottomNav, { useNavHeight } from "../components/BottomNav";

const FRAME = s(250);
const CORNER = s(48);

export default function ScanQRScreen() {
    const NAV_HEIGHT = useNavHeight();
    const [fontsLoaded] = useAppFonts();
    const [flash, setFlash] = useState(false);

    /* scan line up/down */
    const line = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(line, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(line, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [line]);

    if (!fontsLoaded) return null;

    const lineY = line.interpolate({ inputRange: [0, 1], outputRange: [s(10), FRAME - s(10)] });

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Scan QR" />

            <View style={[styles.camera, { marginBottom: NAV_HEIGHT + s(14) }]}>
                {/* paws decoration */}
                <Image
                    source={require("../../assets/images/paw.png")}
                    resizeMode="contain"
                    style={[styles.paw, { top: 20 * SCALE, left: 18 * SCALE }]}
                />
                <Image
                    source={require("../../assets/images/paw.png")}
                    resizeMode="contain"
                    style={[styles.paw, { top: 90 * SCALE, right: 14 * SCALE }]}
                />
                <Image
                    source={require("../../assets/images/paw.png")}
                    resizeMode="contain"
                    style={[styles.paw, { bottom: 120 * SCALE, left: 10 * SCALE }]}
                />

                <Text style={styles.hint} maxFontSizeMultiplier={1.1}>
                    Position the QR code{"\n"}inside the frame to scan
                </Text>

                {/* FRAME */}
                <View style={styles.frame}>
                    {/* TODO: yaha camera lagana:
                        <CameraView style={StyleSheet.absoluteFill} enableTorch={flash}
                          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                          onBarcodeScanned={({ data }) => ... } />  (expo-camera) */}
                    <View style={styles.preview}>
                        <FakeQR value="scan-preview" size={FRAME - s(70)} color="#8C7B70" bg="#F4EEE9" />
                    </View>

                    <Animated.View style={[styles.line, { transform: [{ translateY: lineY }] }]} />

                    <View style={[styles.corner, styles.tl]} />
                    <View style={[styles.corner, styles.tr]} />
                    <View style={[styles.corner, styles.bl]} />
                    <View style={[styles.corner, styles.br]} />
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <Pressable style={styles.action} onPress={() => setFlash((f) => !f)}>
                        <View style={[styles.circle, flash && styles.circleOn]}>
                            <MaterialCommunityIcons
                                name={flash ? "flash" : "flash-outline"}
                                size={s(26)}
                                color={flash ? C.white : C.orange}
                            />
                        </View>
                        <Text style={styles.actionLabel} maxFontSizeMultiplier={1.1}>Flash</Text>
                    </Pressable>

                    <Pressable
                        style={styles.action}
                        onPress={() => {
                            // TODO: expo-image-picker se gallery se QR image
                        }}
                    >
                        <View style={styles.circle}>
                            <MaterialCommunityIcons name="image-outline" size={s(26)} color={C.orange} />
                        </View>
                        <Text style={styles.actionLabel} maxFontSizeMultiplier={1.1}>Gallery</Text>
                    </Pressable>
                </View>
            </View>

            <BottomNav active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    camera: {
        flex: 1,
        marginHorizontal: SIDE,
        marginTop: s(4),
        borderRadius: s(22),
        backgroundColor: "#8A786C",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: s(24),
        paddingBottom: s(22),
    },
    paw: { position: "absolute", width: 70 * SCALE, height: 70 * SCALE, opacity: 0.12 },

    hint: {
        textAlign: "center",
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(20),
        color: C.white,
    },

    frame: { width: FRAME, height: FRAME, alignItems: "center", justifyContent: "center" },
    preview: {
        width: FRAME - s(30),
        height: FRAME - s(30),
        borderRadius: s(14),
        backgroundColor: "#F4EEE9",
        opacity: 0.6,
        alignItems: "center",
        justifyContent: "center",
    },
    line: {
        position: "absolute",
        top: 0,
        left: s(10),
        right: s(10),
        height: 2,
        backgroundColor: C.white,
        opacity: 0.85,
    },

    corner: { position: "absolute", width: CORNER, height: CORNER, borderColor: C.orange, borderWidth: 0 },
    tl: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: s(16) },
    tr: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: s(16) },
    bl: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: s(16) },
    br: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: s(16) },

    actions: { flexDirection: "row", gap: s(56) },
    action: { alignItems: "center", gap: s(6) },
    circle: {
        width: s(62),
        height: s(62),
        borderRadius: s(31),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    circleOn: { backgroundColor: C.orange },
    actionLabel: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.white },
});