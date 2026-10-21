import React from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import BottomNav, { useNavHeight } from "../components/BottomNav";

const { width, height } = Dimensions.get("window");
const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const C = {
    orange: "#FF7A00",
    brown: "#382018",
    muted: "#8F7365",
    iconMuted: "#8B6D5C",
    peach: "#FFE0C4",
    peachBorder: "#FFDCC5",
    card: "#FFFCFA",
    white: "#FFFFFF",
    divider: "#F0E4DD",
    red: "#FF4B32",
    purple: "#7A5CFF",
    green: "#5E9B2D",
};

const PETS = [
    { key: "milo", name: "Milo", active: true },
    { key: "bruno", name: "Bruno", active: false },
];

/* Menu rows: abhi sirf links, pages baad me */
const MENU = [
    {
        key: "rewards",
        title: "Rewards",
        sub: "Track your points, redeem rewards & perks",
        icon: "trophy",
        tint: "#FFF0D6",
        color: "#E08A00",
        route: "/rewards",
        right: "xp",
    },
    {
        key: "achievements",
        title: "Achievements",
        sub: "See all badges & milestones you've earned",
        icon: "medal",
        tint: "#EAF3DC",
        color: "#5E9B2D",
        route: "/achievements",
        right: "badges",
    },
    {
        key: "notifications",
        title: "Notifications",
        sub: "Stay updated with reminders & alerts",
        icon: "bell",
        tint: "#E6F0FA",
        color: "#3B6FB6",
        route: "/notifications",
        right: "count",
    },
    {
        key: "settings",
        title: "Settings",
        sub: "Manage your account, preferences & more",
        icon: "cog",
        tint: "#F3EAFF",
        color: "#7A5CFF",
        route: "/settings",
        right: "none",
    },
    {
        key: "help",
        title: "Help & Support",
        sub: "Get help or contact our support team",
        icon: "help-circle",
        tint: "#E3F4F1",
        color: "#2E9C8A",
        route: "/help-support",
        right: "none",
    },
    {
        key: "about",
        title: "About PetCard",
        sub: "Learn more about PetCard",
        icon: "paw",
        tint: "#FFE9D6",
        color: "#FF7A00",
        route: "/about",
        right: "none",
    },
] as const;

const BADGE_COLORS = ["#7A5CFF", "#FF7A00", "#5E9B2D"];

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    if (!fontsLoaded) return null;

    const open = (route: string) => router.push(route as any);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 150 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 470 * SCALE, left: -20 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <Pressable style={styles.iconButton}>
                        <Ionicons name="menu" size={s(24)} color={C.brown} />
                    </Pressable>

                    <View style={styles.titleBox}>
                        <Text style={styles.pageTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            My Profile 
                        </Text>
                        <Text style={styles.pageSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            All about you & your furry friend
                        </Text>
                    </View>

                    <Pressable style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>3</Text>
                        </View>
                    </Pressable>

                    <View style={styles.xpPill}>
                        <View style={styles.xpCoin}>
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.xpCoinPaw}
                            />
                        </View>
                        <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>XP 1,250</Text>
                    </View>
                </View>

                {/* PROFILE CARD */}
                <View style={[styles.card, styles.profileCard]}>
                    <View style={styles.profileTop}>
                        <View>
                            <View style={styles.avatarRing}>
                                <Image
                                    source={require("../../assets/images/pets/huchiko.png")}
                                    resizeMode="contain"
                                    style={styles.avatar}
                                />
                            </View>
                            <View style={styles.cameraBadge}>
                                <Ionicons name="camera" size={s(11)} color={C.white} />
                            </View>
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.name} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    ABC
                                </Text>
                                <Pressable style={styles.editBtn} onPress={() => open("/edit-profile")}>
                                    <Ionicons name="pencil" size={s(12)} color={C.orange} />
                                    <Text style={styles.editText} maxFontSizeMultiplier={1.1}>Edit Profile</Text>
                                </Pressable>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    abc@gmail.com
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    +91 98765 43210
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    Dehradun, Uttarakhand
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.pillRow}>
                        <View style={[styles.infoPill, { backgroundColor: "#FFF0D6" }]}>
                            <View style={[styles.pillIcon, { backgroundColor: C.orange }]}>
                                <MaterialCommunityIcons name="paw" size={s(14)} color={C.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pillLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    Pet Parent Since
                                </Text>
                                <Text style={styles.pillValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    May 2021
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.infoPill, { backgroundColor: "#F3EAFF" }]}>
                            <View style={[styles.pillIcon, { backgroundColor: C.purple }]}>
                                <MaterialCommunityIcons name="shield-star" size={s(14)} color={C.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pillLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    Member ID
                                </Text>
                                <Text style={styles.pillValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    PGD-2021-1548
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* MY PETS */}
                <View style={[styles.card, styles.petsCard]}>
                    <View>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>My Pets</Text>
                        <Text style={styles.petCount} maxFontSizeMultiplier={1.1}>{PETS.length} Pets</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.petsRow}
                    >
                        {PETS.map((p) => (
                            <Pressable key={p.key} style={styles.petItem} onPress={() => open(`/pet/${p.key}`)}>
                                <View style={[styles.petRing, p.active && styles.petRingActive]}>
                                    <Image
                                        source={require("../../assets/images/pets/huchiko.png")}
                                        resizeMode="contain"
                                        style={styles.petImg}
                                    />
                                    {p.active ? (
                                        <View style={styles.petCheck}>
                                            <Ionicons name="checkmark" size={s(9)} color={C.white} />
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={styles.petName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {p.name}
                                </Text>
                            </Pressable>
                        ))}

                        <Pressable style={styles.petItem} onPress={() => open("/add-pet")}>
                            <View style={styles.addPetCircle}>
                                <Ionicons name="add" size={s(24)} color={C.muted} />
                            </View>
                            <Text style={styles.petName} maxFontSizeMultiplier={1.1}>Add Pet</Text>
                        </Pressable>
                    </ScrollView>
                </View>

                {/* MENU */}
                <View style={[styles.card, styles.menuCard]}>
                    {MENU.map((m, i) => (
                        <Pressable
                            key={m.key}
                            onPress={() => open(m.route)}
                            style={[styles.menuRow, i > 0 && styles.menuRowBorder]}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: m.tint }]}>
                                <MaterialCommunityIcons name={m.icon as any} size={s(22)} color={m.color} />
                            </View>

                            <View style={styles.menuInfo}>
                                <Text style={styles.menuTitle} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {m.title}
                                </Text>
                                <Text style={styles.menuSub} maxFontSizeMultiplier={1.1} numberOfLines={2}>
                                    {m.sub}
                                </Text>
                            </View>

                            {m.right === "xp" ? (
                                <View style={styles.xpSmall}>
                                    <View style={styles.xpSmallCoin}>
                                        <MaterialCommunityIcons name="paw" size={s(9)} color={C.white} />
                                    </View>
                                    <Text style={styles.xpSmallText} maxFontSizeMultiplier={1.1}>1,250 XP</Text>
                                </View>
                            ) : null}

                            {m.right === "badges" ? (
                                <View style={styles.badgesRow}>
                                    {BADGE_COLORS.map((bc, bi) => (
                                        <View key={bi} style={[styles.miniBadge, { backgroundColor: bc }]}>
                                            <MaterialCommunityIcons name="paw" size={s(11)} color={C.white} />
                                        </View>
                                    ))}
                                </View>
                            ) : null}

                            {m.right === "count" ? (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countBadgeText} maxFontSizeMultiplier={1}>3</Text>
                                </View>
                            ) : null}

                            <Ionicons name="chevron-forward" size={s(16)} color={C.iconMuted} />
                        </Pressable>
                    ))}
                </View>

                {/* LOGOUT */}
                <Pressable style={styles.logoutCard} onPress={() => open("/logout")}>
                    <View style={styles.logoutIcon}>
                        <MaterialCommunityIcons name="logout" size={s(22)} color={C.red} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.logoutTitle} maxFontSizeMultiplier={1.1}>Logout</Text>
                        <Text style={styles.logoutSub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            Sign out from your account
                        </Text>
                    </View>
                    <Image
                        source={require("../../assets/images/chooseSticker/Huchiko/image15.png")}
                        resizeMode="contain"
                        style={styles.logoutPet}
                    />
                </Pressable>
            </ScrollView>

            <BottomNav active="profile" />
        </View>
    );
}

const SIDE = s(14);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
    backgroundPaw: {
        position: "absolute",
        width: 92 * SCALE,
        height: 92 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },
    card: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.peachBorder,
        borderRadius: s(16),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(3) },
        shadowOpacity: 0.08,
        shadowRadius: s(6),
        elevation: 2,
    },

    /* top bar */
    topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: SIDE, gap: s(8) },
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
    titleBox: { flex: 1 },
    pageTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        lineHeight: s(28),
        color: C.brown,
    },
    pageSub: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(11),
        lineHeight: s(15),
        color: C.brown,
    },
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
    xpPill: {
        height: s(40),
        paddingLeft: s(5),
        paddingRight: s(10),
        borderRadius: s(20),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
        flexDirection: "row",
        alignItems: "center",
        gap: s(5),
    },
    xpCoin: {
        width: s(28),
        height: s(28),
        borderRadius: s(14),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    xpCoinPaw: { width: s(16), height: s(16) },
    xpText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },

    /* profile card */
    profileCard: {
        marginHorizontal: SIDE,
        marginTop: s(14),
        padding: s(12),
        backgroundColor: "#FFF3E3",
    },
    profileTop: { flexDirection: "row", alignItems: "center", gap: s(12) },
    avatarRing: {
        width: s(100),
        height: s(100),
        borderRadius: s(50),
        borderWidth: 3,
        borderColor: C.orange,
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatar: { width: s(92), height: s(92) },
    cameraBadge: {
        position: "absolute",
        right: s(2),
        bottom: s(4),
        width: s(24),
        height: s(24),
        borderRadius: s(12),
        backgroundColor: C.orange,
        borderWidth: 2,
        borderColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    profileInfo: { flex: 1, gap: s(4) },
    nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: s(6) },
    name: {
        flexShrink: 1,
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(20),
        color: C.brown,
    },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
        paddingHorizontal: s(10),
        paddingVertical: s(5),
        borderRadius: s(12),
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.peachBorder,
    },
    editText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.orange },
    infoRow: { flexDirection: "row", alignItems: "center", gap: s(6) },
    infoText: { flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown },

    pillRow: { flexDirection: "row", gap: s(8), marginTop: s(12) },
    infoPill: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
        padding: s(8),
        borderRadius: s(12),
    },
    pillIcon: {
        width: s(26),
        height: s(26),
        borderRadius: s(13),
        alignItems: "center",
        justifyContent: "center",
    },
    pillLabel: { fontFamily: "Nunito_600SemiBold", fontSize: s(9), color: C.muted },
    pillValue: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },

    /* pets */
    petsCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        paddingVertical: s(10),
        paddingHorizontal: s(12),
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
    },
    sectionTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    petCount: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.orange, marginTop: s(2) },
    petsRow: { gap: s(12), alignItems: "center", paddingRight: s(4) },
    petItem: { alignItems: "center", gap: s(3) },
    petRing: {
        width: s(56),
        height: s(56),
        borderRadius: s(28),
        borderWidth: 2,
        borderColor: C.peachBorder,
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    petRingActive: { borderColor: C.orange },
    petImg: { width: s(48), height: s(48) },
    petCheck: {
        position: "absolute",
        top: s(-2),
        right: s(-2),
        width: s(16),
        height: s(16),
        borderRadius: s(8),
        backgroundColor: C.green,
        borderWidth: 1.5,
        borderColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    petName: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.brown },
    addPetCircle: {
        width: s(56),
        height: s(56),
        borderRadius: s(28),
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: C.muted,
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },

    /* menu */
    menuCard: { marginHorizontal: SIDE, marginTop: s(12), paddingHorizontal: s(12) },
    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(11),
        gap: s(10),
    },
    menuRowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    menuIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(12),
        alignItems: "center",
        justifyContent: "center",
    },
    menuInfo: { flex: 1 },
    menuTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    menuSub: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(10),
        lineHeight: s(13),
        color: C.muted,
        marginTop: s(1),
    },
    xpSmall: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(4),
        paddingHorizontal: s(8),
        paddingVertical: s(4),
        borderRadius: s(12),
        backgroundColor: "#FFF0D6",
    },
    xpSmallCoin: {
        width: s(16),
        height: s(16),
        borderRadius: s(8),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
    },
    xpSmallText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.brown },
    badgesRow: { flexDirection: "row", gap: s(4) },
    miniBadge: {
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        alignItems: "center",
        justifyContent: "center",
    },
    countBadge: {
        minWidth: s(20),
        height: s(20),
        borderRadius: s(10),
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(5),
    },
    countBadgeText: { fontFamily: "Nunito_700Bold", fontSize: s(11), color: C.white },

    /* logout */
    logoutCard: {
        marginHorizontal: SIDE,
        marginTop: s(12),
        padding: s(12),
        borderRadius: s(16),
        backgroundColor: "#FFE5E1",
        borderWidth: 1,
        borderColor: "#FFCFC8",
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        overflow: "hidden",
    },
    logoutIcon: {
        width: s(42),
        height: s(42),
        borderRadius: s(12),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
    },
    logoutTitle: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.red },
    logoutSub: { fontFamily: "Nunito_600SemiBold", fontSize: s(10), color: C.muted },
    zzz: { fontFamily: "Fredoka_600SemiBold", fontSize: s(12), color: C.muted },
    logoutPet: { width: s(84), height: s(52) },
});