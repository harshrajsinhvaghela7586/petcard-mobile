import { appLocale } from "@/i18n/autoTranslate";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { router, useFocusEffect } from "expo-router";
import PetHubDrawer from "@/components/PetHubDrawer";
import AvatarFrame from "@/components/AvatarFrame";
import { useAuth } from "@/context/AuthContext";
import SwipeTabs from "@/components/SwipeTabs";
import BottomNav, { useNavHeight } from "../../components/BottomNav";
import { petcardApi, Pet, Bootstrap } from "@/services/petcardApi";
import SafeImage from "@/components/SafeImage";
import { avatarSlug, petImageSource, stickerUri } from "@/services/stickerImage";
import { resolveSelectedPet, setSelectedPetId } from "@/services/petSelection";

const { width, height } = Dimensions.get("window");
const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;
const MAX_PETS = 2;
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

/* Routes: file name = route name (src/app/<name>.tsx) */
const ROUTES = {
    editProfile: "/edit-profile",
    rewards: "/RewardScreen",
    achievements: "/AchievementScreen",
    notifications: "/notifications", // src/app/notifications/index.tsx
    settings: "/settings", // src/app/settings/index.tsx
    help: "settings/HelpSupportScreen",
    about: "/AboutScreen",
    refer: "/ReferFriendScreen",
};

const petImage = (pet?: Pet) => petImageSource(pet);

const MENU = [
    {
        key: "rewards",
        title: "Rewards",
        sub: "Track your points, redeem rewards & perks",
        icon: "trophy",
        tint: "#FFF0D6",
        color: "#E08A00",
        route: ROUTES.rewards,
        right: "xp",
    },
    {
        key: "achievements",
        title: "Achievements",
        sub: "See all badges & milestones you've earned",
        icon: "medal",
        tint: "#EAF3DC",
        color: "#5E9B2D",
        route: ROUTES.achievements,
        right: "badges",
    },
    {
        key: "notifications",
        title: "Notifications",
        sub: "Stay updated with reminders & alerts",
        icon: "bell",
        tint: "#E6F0FA",
        color: "#3B6FB6",
        route: ROUTES.notifications,
        right: "count",
    },
    {
        key: "refer",
        title: "Refer a Friend",
        sub: "Share your code & earn 200 PawPoints",
        icon: "gift",
        tint: "#FFE7E1",
        color: "#FF4B32",
        route: ROUTES.refer,
        right: "none",
    },
    {
        key: "settings",
        title: "Settings",
        sub: "Manage your account, preferences & more",
        icon: "cog",
        tint: "#F3EAFF",
        color: "#7A5CFF",
        route: ROUTES.settings,
        right: "none",
    },
    {
        key: "help",
        title: "Help & Support",
        sub: "Get help or contact our support team",
        icon: "help-circle",
        tint: "#E3F4F1",
        color: "#2E9C8A",
        route: ROUTES.help,
        right: "none",
    },
    {
        key: "about",
        title: "About PetCard",
        sub: "Learn more about PetCard",
        icon: "paw",
        tint: "#FFE9D6",
        color: "#FF7A00",
        route: ROUTES.about,
        right: "none",
    },
] as const;

const BADGE_COLORS = ["#7A5CFF", "#FF7A00", "#5E9B2D"];

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const NAV_HEIGHT = useNavHeight();

    /* Pet Hub drawer (left se slide) */
    const [hubOpen, setHubOpen] = useState(false);

    /* kisi aur page pe jaate hi drawer band (wapas aane pe khula na mile) */
    useFocusEffect(
        useCallback(() => {
            return () => setHubOpen(false);
        }, [])
    );

    const { signOut, user } = useAuth();
    const [bootstrap, setBootstrap] = useState<Bootstrap | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [selectedPetId, setSelectedPetIdState] = useState<string | null>(null);
    const activePet = bootstrap?.pets?.find((pet) => pet.id === selectedPetId) ?? bootstrap?.pets?.[0];
    /* a person who only co-guards (owns no pet) cannot refer friends or create pets: they scan the owner's QR instead */
    const isGuardianOnly = (bootstrap?.pets?.length ?? 0) > 0 && (bootstrap?.pets ?? []).every((p) => p.role && p.role !== "owner");

    /* Reloads every time the screen is focused, so a new photo / location / relationship shows up right after editing. */
    useFocusEffect(useCallback(() => {
        let alive = true;
        (async () => {
            try {
                const data = await petcardApi.bootstrap();
                const selected = await resolveSelectedPet(data.pets ?? []);
                if (alive) {
                    setBootstrap(data); setSelectedPetIdState(selected?.id ?? null); setProfileError(null);
                }
            } catch (error) {
                if (alive) setProfileError(error instanceof Error ? error.message : "Unable to load profile.");
            }
        })();
        return () => { alive = false; };
    }, []));

    const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Nunito_600SemiBold, Nunito_700Bold });
    if (!fontsLoaded) return null;

    const open = (route: string) => router.push(route as any);
const ownedPets = (bootstrap?.pets ?? []).filter((p) => !p.role || p.role === "owner").length;
const handleAddPet = () => {
    if (isGuardianOnly) { router.push("/ScanQRScreen" as any); return; }
    if (ownedPets >= MAX_PETS) { Alert.alert("Pet limit reached", "You can add a maximum of 2 pets."); return; }
    router.push("/PetTypeScreen" as any);
};
    /* Location: exactly what the user saved in Edit Profile (no country / timezone guessing). */
    const profileUser = (bootstrap?.user ?? user) as any;
    const locationText = profileUser?.location ? String(profileUser.location) : "Location not set";
    const relationshipText = profileUser?.relationship ? String(profileUser.relationship) : "Relationship not set";

    const stickerSlug = avatarSlug(activePet?.avatarLocalId, activePet?.avatarKey);
    const userPhoto = bootstrap?.user?.photoUrl ?? null;
    /* Logout card shows the sticker the active pet has selected (falls back to the avatar image). */
    const rawSticker: any = stickerUri((activePet as any)?.activeStickerKey);
    const logoutSource: any = rawSticker ? (typeof rawSticker === "string" ? { uri: rawSticker } : rawSticker) : petImage(activePet);

    return (
        <SwipeTabs active="profile">
        <View style={styles.container}>
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 150 * SCALE, right: -10 * SCALE, transform: [{ rotate: "15deg" }] }]}
            />
            <Image
                source={require("../../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, { top: 470 * SCALE, left: -20 * SCALE, transform: [{ rotate: "-15deg" }] }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + s(8), paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    {/* menu -> Pet Hub drawer */}
                    <Pressable style={styles.iconButton} onPress={() => setHubOpen(true)}>
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

                    {/* bell -> Notifications */}
                    <Pressable style={styles.iconButton} onPress={() => open(ROUTES.notifications)}>
                        <Ionicons name="notifications-outline" size={s(22)} color={C.brown} />
                        {(bootstrap?.unreadNotifications ?? 0) > 0 ? <View style={styles.badge}>
                            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>{(bootstrap?.unreadNotifications ?? 0) > 99 ? "99+" : bootstrap?.unreadNotifications}</Text>
                        </View> : null}
                    </Pressable>

                    {/* XP pill -> Rewards */}
                    <Pressable style={styles.xpPill} onPress={() => open(ROUTES.rewards)}>
                        <View style={styles.xpCoin}>
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.xpCoinPaw}
                            />
                        </View>
                        <Text style={styles.xpText} maxFontSizeMultiplier={1.1}>XP {(activePet?.progress?.xp ?? 0).toLocaleString()}</Text>
                    </Pressable>
                </View>

                {profileError ? <Text style={{ color: C.red, marginHorizontal: s(18), marginBottom: s(8) }}>{profileError}</Text> : null}

                {/* PROFILE CARD: the guardian's own photo and details */}
                <View style={[styles.card, styles.profileCard]}>
                    <View style={styles.profileTop}>
                        <View>
                            <View style={styles.avatarRing}>
                                {userPhoto ? (
                                    <SafeImage
                                        fallback={require("../../../assets/images/paw.png")}
                                        source={{ uri: userPhoto }}
                                        resizeMode="cover"
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                ) : (
                                    <MaterialCommunityIcons name="account-circle" size={s(92)} color={C.orange} />
                                )}
                            </View>
                            <Pressable style={styles.cameraBadge} onPress={() => open(ROUTES.editProfile)}>
                                <Ionicons name="camera" size={s(11)} color={C.white} />
                            </Pressable>
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.name} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {bootstrap?.user?.name || user?.name || "Pet Parent"}
                                </Text>
                                <Pressable style={styles.editBtn} onPress={() => open(ROUTES.editProfile)}>
                                    <Ionicons name="pencil" size={s(12)} color={C.orange} />
                                    <Text style={styles.editText} maxFontSizeMultiplier={1.1}>Edit Profile</Text>
                                </Pressable>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {bootstrap?.user?.email || user?.email || "No email available"}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {bootstrap?.user?.phone || user?.phone || "Add your phone number"}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {locationText}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="paw-outline" size={s(14)} color={C.iconMuted} />
                                <Text style={styles.infoText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                    {relationshipText}
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
                                    {bootstrap?.user?.createdAt ? new Date(bootstrap.user.createdAt).toLocaleDateString(appLocale(), { month: "short", year: "numeric" }) : activePet?.createdAt ? new Date(activePet.createdAt).toLocaleDateString(appLocale(), { month: "short", year: "numeric" }) : "New member"}
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
                                    {(user?.id || bootstrap?.user?.id || "PETCARD").slice(-12).toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* MY PETS: each pet with its equipped avatar frame */}
                <View style={[styles.card, styles.petsCard]}>
                    <View>
                        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>My Pets</Text>
                        <Text style={styles.petCount} maxFontSizeMultiplier={1.1}>{bootstrap?.pets?.length ?? 0} Pets</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.petsRow}
                    >
                        {(bootstrap?.pets ?? []).map((p) => {
                            const active = p.id === activePet?.id;
                            return (
                                <Pressable key={p.id} style={styles.petItem} onPress={async () => { await setSelectedPetId(p.id); setSelectedPetIdState(p.id); }}>
                                    <View>
                                        <AvatarFrame frameKey={p.activeFrameKey} size={s(60)}>
                                            {p.photoUrl ? (
                                                <SafeImage
                                                    fallback={petImage(p)}
                                                    source={{ uri: p.photoUrl }}
                                                    resizeMode="cover"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            ) : (
                                                <Image source={petImage(p)} resizeMode="contain" style={styles.petImg} />
                                            )}
                                        </AvatarFrame>
                                        {active ? <View style={styles.petCheck}><Ionicons name="checkmark" size={s(9)} color={C.white} /></View> : null}
                                    </View>
                                    <Text style={[styles.petName, active && { color: C.orange }]} maxFontSizeMultiplier={1.1} numberOfLines={1}>{p.name.length > 10 ? `${p.name.slice(0, 10)}…` : p.name}</Text>
                                </Pressable>
                            );
                        })}

                       <Pressable style={styles.petItem} onPress={handleAddPet}>
                             <View style={styles.addPetCircle}>
                                <Ionicons name="add" size={s(24)} color={C.muted} />
                            </View>
                            <Text style={styles.petName} maxFontSizeMultiplier={1.1}>Add Pet</Text>
                        </Pressable>
                    </ScrollView>
                </View>

                {/* SELECTED PET DETAILS — loaded from the persisted backend pet record */}
                {activePet ? (
                    <View style={[styles.card, { padding: s(16), marginTop: s(12) }]}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: s(10) }}>
                            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>{activePet.name.length > 10 ? `${activePet.name.slice(0, 10)}…` : activePet.name}'s Details</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}>
                                {stickerSlug ? <Pressable onPress={() => router.push({ pathname: "/ChooseStickerScreen", params: { petId: activePet.id, avatar: stickerSlug } } as any)}>
                                    <Text style={{ color: C.orange, fontFamily: "Nunito_700Bold", fontSize: s(12) }}>Sticker Shop</Text>
                                </Pressable> : null}
                                <Pressable onPress={() => router.push({ pathname: "/DigitalPetCardScreen", params: { petId: activePet.id } } as any)}>
                                    <Text style={{ color: C.orange, fontFamily: "Nunito_700Bold", fontSize: s(12) }}>View PetCard</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: s(8) }}>
                            {[
                              ["Type", activePet.type],
                              ["Breed", activePet.breed || "Not set"],
                              ["Gender", activePet.gender || "Not set"],
                              ["Weight", activePet.weightKg ? `${activePet.weightKg} kg` : "Not set"],
                              ["Date of birth", activePet.birthDate ? new Date(activePet.birthDate).toLocaleDateString(appLocale()) : "Not set"],
                              ["Vaccinated", activePet.health?.vaccinated === true ? "Yes" : activePet.health?.vaccinated === false ? "No" : "Not set"],
                              ["Allergies", activePet.health?.allergies?.length ? activePet.health.allergies.join(", ") : "None recorded"],
                              ["Conditions", activePet.health?.conditions?.length ? activePet.health.conditions.join(", ") : "None recorded"],
                              ["Reminders", activePet.reminders?.enabled ? `Enabled · ${activePet.reminders.time ?? "set"}` : "Disabled"],
                              ["Level", String(activePet.progress?.level ?? 1)],
                              ["XP", String(activePet.progress?.xp ?? 0)],
                              ["Care streak", `${activePet.streak?.current ?? 0} days`],
                              ["Role", activePet.role && activePet.role !== "owner" ? "Co-Guardian" : "Owner"],
                            ].map(([label, value]) => (
                              <View key={label} style={{ width: "47%", backgroundColor: "#FFFAF5", borderRadius: s(10), padding: s(10) }}>
                                <Text style={{ color: C.muted, fontFamily: "Nunito_600SemiBold", fontSize: s(11) }}>{label}</Text>
                                <Text style={{ color: C.brown, fontFamily: "Nunito_700Bold", fontSize: s(13), marginTop: s(2) }} numberOfLines={2}>{value}</Text>
                              </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={[styles.card, { padding: s(16), marginTop: s(12) }]}>
                        <Text style={styles.sectionTitle}>No pet profile yet</Text>
                        <Text style={styles.infoText}>Finish pet setup to save your pet details and avatar here.</Text>
                        <Pressable onPress={() => router.push("/PetTypeScreen" as any)} style={{ marginTop: s(8) }}><Text style={{ color: C.orange, fontFamily: "Nunito_700Bold" }}>Set up a pet</Text></Pressable>
                    </View>
                )}

                {/* MENU */}
                <View style={[styles.card, styles.menuCard]}>
                    {MENU.filter((m) => !(isGuardianOnly && m.key === "refer")).map((m, i) => (
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
                                    <Text style={styles.xpSmallText} maxFontSizeMultiplier={1.1}>{(activePet?.progress?.xp ?? 0).toLocaleString()} XP</Text>
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
                                    <Text style={styles.countBadgeText} maxFontSizeMultiplier={1}>{(bootstrap?.unreadNotifications ?? 0) > 99 ? "99+" : bootstrap?.unreadNotifications ?? 0}</Text>
                                </View>
                            ) : null}

                            <Ionicons name="chevron-forward" size={s(16)} color={C.iconMuted} />
                        </Pressable>
                    ))}
                </View>

                {/* LOGOUT */}
                <Pressable style={styles.logoutCard} onPress={() => { void signOut(); }}>
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
                        source={logoutSource}
                        resizeMode="contain"
                        style={styles.logoutPet}
                    />
                </Pressable>
            </ScrollView>

            <BottomNav active="profile" />

            {/* PET HUB DRAWER (sabse upar render hona chahiye) */}
            <PetHubDrawer visible={hubOpen} onClose={() => setHubOpen(false)} petName={activePet?.name ?? "your pet"} petType={activePet?.type ?? "dog"} avatarKey={activePet?.avatarKey ?? ""} photoUrl={stickerUri((activePet as any)?.activeStickerKey) ?? activePet?.photoUrl ?? null} unreadCount={bootstrap?.unreadNotifications ?? 0} />
        </View>
        </SwipeTabs>
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
    /* paddingTop keeps the crown of level 7+ frames from being clipped by the horizontal scroll view */
    petsRow: { gap: s(12), alignItems: "center", paddingRight: s(4), paddingTop: s(10) },
    petItem: { alignItems: "center", gap: s(3) },
    petImg: { width: s(44), height: s(44) },
    petCheck: {
        position: "absolute",
        bottom: s(-2),
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