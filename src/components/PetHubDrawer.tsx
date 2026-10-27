import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    BackHandler,
    Dimensions,
    Easing,
    Image,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { C, PawBackground, cardStyle, s } from "@/components/SectionHeader";
import BottomNav, { useNavHeight } from "./BottomNav";
import { PET } from "@/constants/pet";

/* Full screen: poori width ka panel left se slide hota hai */
const { width: SCREEN_W } = Dimensions.get("window");

/* route na ho to row abhi sirf dikhegi (page baad me) */
const ITEMS = [
    { key: "petcard", title: "Digital PetCard", sub: "View your pet's digital ID", icon: "card-account-details-outline", tint: "#FFF0D6", color: "#E08A00", route: "/DigitalPetCardScreen" },
    { key: "qr", title: "QR Code", sub: "Share or view your QR code", icon: "qrcode", tint: "#EAF3DC", color: "#5E9B2D", route: "/MyQRCodeScreen" },
    { key: "scan", title: "Scan QR", sub: "Scan to view another PetCard", icon: "qrcode-scan", tint: "#FFE5E1", color: "#FF4B32", route: "/ScanQRScreen" },
    { key: "emergency", title: "Emergency Card", sub: "Important info in emergencies", icon: "heart-pulse", tint: "#FFE5E1", color: "#E5484D", route: "/EmergencyCardScreen" },
    { key: "health", title: "Health Records", sub: "Vaccinations, meds & more", icon: "clipboard-pulse-outline", tint: "#F3EAFF", color: "#7A5CFF", route: "/HealthRecordScreen" },
    { key: "guardians", title: "Guardians", sub: "Manage pet guardians", icon: "account-group", tint: "#EAF3DC", color: "#5E9B2D", route: "/GuardianScreen" },
    { key: "avatar", title: "Avatar", sub: `Customize ${PET.name}'s avatar`, icon: "hanger", tint: "#E6F0FA", color: "#3B6FB6", route: "/ChoosePetAvatar" }, 
    { key: "pets", title: "My Pets", sub: "Switch or add another pet", icon: "paw", tint: "#FFF0D6", color: "#FF7A00", route: "/PetTypeScreen" }, // TODO
];

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function PetHubDrawer({ visible, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();
    const [mounted, setMounted] = useState(visible);
    const progress = useRef(new Animated.Value(0)).current;

    const closeRef = useRef(onClose);
    closeRef.current = onClose;

    /* open / close animation */
    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.timing(progress, {
                toValue: 1,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(progress, {
                toValue: 0,
                duration: 260,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setMounted(false);
            });
        }
    }, [visible, progress]);

    /* Android back button closes drawer */
    useEffect(() => {
        if (!visible) return;
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            closeRef.current();
            return true;
        });
        return () => sub.remove();
    }, [visible]);

    /* swipe left to close */
    const pan = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) =>
                g.dx < -12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
            onPanResponderRelease: (_, g) => {
                if (g.dx < -50 || g.vx < -0.5) closeRef.current();
            },
        })
    ).current;

    if (!mounted) return null;

    const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_W, 0],
    });

    const go = (route?: string) => {
        if (!route) return;
        onClose();
        router.push(route as any);
    };

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Animated.View
                {...pan.panHandlers}
                style={[styles.panel, { transform: [{ translateX }] }]}
            >
                <PawBackground />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: insets.top + s(8),
                        paddingBottom: NAV_HEIGHT + s(24),
                    }}
                >
                    {/* top bar: close (☰) | title | bell */}
                    <View style={styles.topBar}>
                        <Pressable style={styles.iconButton} onPress={onClose}>
                            <Ionicons name="menu" size={s(24)} color={C.brown} />
                        </Pressable>

                        <View style={styles.titleBox}>
                            <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                Pet Hub
                            </Text>
                            <Text style={styles.subtitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                All things {PET.name}, in one place! 🐾
                            </Text>
                        </View>

                        <Pressable style={styles.iconButton} onPress={() => go("/notifications")}>
                            <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText} maxFontSizeMultiplier={1}>3</Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* avatar */}
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatarRing}>
                            <Image
                                source={require("../../assets/images/pets/huchiko.png")}
                                resizeMode="contain"
                                style={styles.avatar}
                            />
                        </View>
                        <Pressable style={styles.pencil}>
                            <Ionicons name="pencil" size={s(12)} color={C.white} />
                        </Pressable>
                    </View>

                    {/* menu */}
                    <View style={styles.menuCard}>
                        {ITEMS.map((it, i) => (
                            <Pressable
                                key={it.key}
                                onPress={() => go(it.route)}
                                style={[styles.row, i > 0 && styles.rowBorder]}
                            >
                                <View style={[styles.rowIcon, { backgroundColor: it.tint }]}>
                                    <MaterialCommunityIcons name={it.icon as any} size={s(22)} color={it.color} />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.rowTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {it.title}
                                    </Text>
                                    <Text style={styles.rowSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                        {it.sub}
                                    </Text>
                                </View>

                                <Ionicons name="chevron-forward" size={s(16)} color={C.iconMuted} />
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                 <BottomNav active="home" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 100,
        elevation: 100,
    },

    panel: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: s(14),
        gap: s(8),
    },
    iconButton: {
        width: s(44),
        height: s(44),
        borderRadius: s(12),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    titleBox: { flex: 1, alignItems: "center" },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(24), lineHeight: s(30), color: C.brown },
    subtitle: { fontFamily: "Nunito_700Bold", fontSize: s(12), lineHeight: s(16), color: C.brown },
    badge: {
        position: "absolute",
        top: s(-5),
        right: s(-5),
        minWidth: s(17),
        height: s(17),
        borderRadius: s(9),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: C.white,
    },
    badgeText: { fontFamily: "Nunito_700Bold", fontSize: s(9), color: C.white },

    avatarWrap: { alignSelf: "center", marginTop: s(14) },
    avatarRing: {
        width: s(124),
        height: s(124),
        borderRadius: s(62),
        borderWidth: 3,
        borderColor: C.orange,
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatar: { width: s(112), height: s(112) },
    pencil: {
        position: "absolute",
        right: s(4),
        bottom: s(6),
        width: s(28),
        height: s(28),
        borderRadius: s(14),
        backgroundColor: C.orange,
        borderWidth: 2,
        borderColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },

    menuCard: { ...cardStyle, marginHorizontal: s(14), marginTop: s(16), paddingHorizontal: s(12) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(11), gap: s(10) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    rowIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(12),
        alignItems: "center",
        justifyContent: "center",
    },
    rowTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    rowSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(10), color: C.muted, marginTop: s(1) },
});