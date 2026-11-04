import React from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_400Regular,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { readPetSetupDraft, updatePetSetupDraft } from "@/services/petSetupDraft";
import { petcardApi } from "@/services/petcardApi";
import { useImagesReady } from "@/hooks/use-images-ready";
import ScreenLoader from "@/components/ScreenLoader";
import { useLang } from "@/i18n/LanguageContext";

const { width, height } = Dimensions.get("window");
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

const NUM_COLUMNS = 3;
const resolveLocalAvatar = (localId?: string | null, catalogKey?: string | null) => {
    const value = String(localId || catalogKey || "").toLowerCase();
    const known = ["huchiko", "browny", "noir", "kiki", "oreo", "cupid", "waffle"];
    return known.find((name) => value === name || value.endsWith(`_${name}`) || value.endsWith(`-${name}`)) ?? "";
};
const LIST_PADDING = s(10);
const CARD_GAP = s(16);
const CARD_WIDTH =
    (width - LIST_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

type StickerItem = {
    id: string;
    image?: any;
    catalogKey?: string;
    price?: number;
    owned?: boolean;
    empty?: boolean;
    locked?: boolean;
    cost?: number;
    catalogIndex?: number;
};

/*
 * Avatar-wise sticker assets. Keep require() paths static for Metro.
 * The selected local avatar ID comes from ChoosePetAvatarScreen.
 */
const stickerAssetSets: Record<string, any[]> = {
    huchiko: [
        require("../../../assets/images/chooseSticker/Huchiko/image1.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image2.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image3.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image4.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image5.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image6.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image7.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image8.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image9.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image10.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image11.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image12.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image13.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image14.png"),
        require("../../../assets/images/chooseSticker/Huchiko/image15.png"),
    ],
    browny: [
        require("../../../assets/images/chooseSticker/Browny/image1.png"),
        require("../../../assets/images/chooseSticker/Browny/image2.png"),
        require("../../../assets/images/chooseSticker/Browny/image3.png"),
        require("../../../assets/images/chooseSticker/Browny/image4.png"),
        require("../../../assets/images/chooseSticker/Browny/image5.png"),
        require("../../../assets/images/chooseSticker/Browny/image6.png"),
        require("../../../assets/images/chooseSticker/Browny/image7.png"),
        require("../../../assets/images/chooseSticker/Browny/image8.png"),
        require("../../../assets/images/chooseSticker/Browny/image9.png"),
        require("../../../assets/images/chooseSticker/Browny/image10.png"),
        require("../../../assets/images/chooseSticker/Browny/image11.png"),
        require("../../../assets/images/chooseSticker/Browny/image12.png"),
        require("../../../assets/images/chooseSticker/Browny/image13.png"),
        require("../../../assets/images/chooseSticker/Browny/image14.png"),
        require("../../../assets/images/chooseSticker/Browny/image15.png"),
    ],
    noir: [
        require("../../../assets/images/chooseSticker/Noir/image1.png"),
        require("../../../assets/images/chooseSticker/Noir/image2.png"),
        require("../../../assets/images/chooseSticker/Noir/image3.png"),
        require("../../../assets/images/chooseSticker/Noir/image4.png"),
        require("../../../assets/images/chooseSticker/Noir/image5.png"),
        require("../../../assets/images/chooseSticker/Noir/image6.png"),
        require("../../../assets/images/chooseSticker/Noir/image7.png"),
        require("../../../assets/images/chooseSticker/Noir/image8.png"),
        require("../../../assets/images/chooseSticker/Noir/image9.png"),
        require("../../../assets/images/chooseSticker/Noir/image10.png"),
        require("../../../assets/images/chooseSticker/Noir/image11.png"),
        require("../../../assets/images/chooseSticker/Noir/image12.png"),
        require("../../../assets/images/chooseSticker/Noir/image13.png"),
        require("../../../assets/images/chooseSticker/Noir/image14.png"),
        require("../../../assets/images/chooseSticker/Noir/image15.png"),
    ],
    kiki: [
        require("../../../assets/images/chooseSticker/Kiki/image1.png"),
        require("../../../assets/images/chooseSticker/Kiki/image2.png"),
        require("../../../assets/images/chooseSticker/Kiki/image3.png"),
        require("../../../assets/images/chooseSticker/Kiki/image4.png"),
        require("../../../assets/images/chooseSticker/Kiki/image5.png"),
        require("../../../assets/images/chooseSticker/Kiki/image6.png"),
        require("../../../assets/images/chooseSticker/Kiki/image7.png"),
        require("../../../assets/images/chooseSticker/Kiki/image8.png"),
        require("../../../assets/images/chooseSticker/Kiki/image9.png"),
        require("../../../assets/images/chooseSticker/Kiki/image10.png"),
        require("../../../assets/images/chooseSticker/Kiki/image11.png"),
        require("../../../assets/images/chooseSticker/Kiki/image12.png"),
        require("../../../assets/images/chooseSticker/Kiki/image13.png"),
        require("../../../assets/images/chooseSticker/Kiki/image14.png"),
        require("../../../assets/images/chooseSticker/Kiki/image15.png"),
    ],
    oreo: [
        require("../../../assets/images/chooseSticker/Oreo/image1.png"),
        require("../../../assets/images/chooseSticker/Oreo/image2.png"),
        require("../../../assets/images/chooseSticker/Oreo/image3.png"),
        require("../../../assets/images/chooseSticker/Oreo/image4.png"),
        require("../../../assets/images/chooseSticker/Oreo/image5.png"),
        require("../../../assets/images/chooseSticker/Oreo/image6.png"),
        require("../../../assets/images/chooseSticker/Oreo/image7.png"),
        require("../../../assets/images/chooseSticker/Oreo/image8.png"),
        require("../../../assets/images/chooseSticker/Oreo/image9.png"),
        require("../../../assets/images/chooseSticker/Oreo/image10.png"),
        require("../../../assets/images/chooseSticker/Oreo/image11.png"),
        require("../../../assets/images/chooseSticker/Oreo/image12.png"),
        require("../../../assets/images/chooseSticker/Oreo/image13.png"),
        require("../../../assets/images/chooseSticker/Oreo/image14.png"),
        require("../../../assets/images/chooseSticker/Oreo/image15.png"),
    ],
    cupid: [
        require("../../../assets/images/chooseSticker/Cupid/image1.png"),
        require("../../../assets/images/chooseSticker/Cupid/image2.png"),
        require("../../../assets/images/chooseSticker/Cupid/image3.png"),
        require("../../../assets/images/chooseSticker/Cupid/image4.png"),
        require("../../../assets/images/chooseSticker/Cupid/image5.png"),
        require("../../../assets/images/chooseSticker/Cupid/image6.png"),
        require("../../../assets/images/chooseSticker/Cupid/image7.png"),
        require("../../../assets/images/chooseSticker/Cupid/image8.png"),
        require("../../../assets/images/chooseSticker/Cupid/image9.png"),
        require("../../../assets/images/chooseSticker/Cupid/image10.png"),
        require("../../../assets/images/chooseSticker/Cupid/image11.png"),
        require("../../../assets/images/chooseSticker/Cupid/image12.png"),
        require("../../../assets/images/chooseSticker/Cupid/image13.png"),
        require("../../../assets/images/chooseSticker/Cupid/image14.png"),
        require("../../../assets/images/chooseSticker/Cupid/image15.png"),
    ],
    waffle: [
        require("../../../assets/images/chooseSticker/Waffle/image1.png"),
        require("../../../assets/images/chooseSticker/Waffle/image2.png"),
        require("../../../assets/images/chooseSticker/Waffle/image3.png"),
        require("../../../assets/images/chooseSticker/Waffle/image4.png"),
        require("../../../assets/images/chooseSticker/Waffle/image5.png"),
        require("../../../assets/images/chooseSticker/Waffle/image6.png"),
        require("../../../assets/images/chooseSticker/Waffle/image7.png"),
        require("../../../assets/images/chooseSticker/Waffle/image8.png"),
        require("../../../assets/images/chooseSticker/Waffle/image9.png"),
        require("../../../assets/images/chooseSticker/Waffle/image10.png"),
        require("../../../assets/images/chooseSticker/Waffle/image11.png"),
        require("../../../assets/images/chooseSticker/Waffle/image12.png"),
        require("../../../assets/images/chooseSticker/Waffle/image13.png"),
        require("../../../assets/images/chooseSticker/Waffle/image14.png"),
        require("../../../assets/images/chooseSticker/Waffle/image15.png"),
    ],
};

const PAW_IMG = require("../../../assets/images/paw.png");
const PAW_WHITE_IMG = require("../../../assets/images/paw-white.png");

const makeStickerSet = (avatarId: string): StickerItem[] => {
    const assets = stickerAssetSets[avatarId];
    if (!assets) return [];
    return assets.map((image, index) => ({ id: `${avatarId}-${index + 1}`, image, catalogIndex: index }));
};

/* Last row ko complete karne ke liye invisible placeholders */
const withPlaceholders = (data: StickerItem[]): StickerItem[] => {
    const remainder = data.length % NUM_COLUMNS;
    if (remainder === 0) return data;

    const placeholders: StickerItem[] = Array.from(
        { length: NUM_COLUMNS - remainder },
        (_, index) => ({ id: `empty-${index}`, empty: true })
    );

    return [...data, ...placeholders];
};

export default function ChooseStickerScreen() {
    const { avatar, petId } = useLocalSearchParams<{ avatar?: string; petId?: string }>();

    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    const [selectedSticker, setSelectedSticker] = React.useState<string | null>(null);
    const [localAvatarId, setLocalAvatarId] = React.useState("");
    const [catalogKeys, setCatalogKeys] = React.useState<string[]>([]);
    const [catalogItems, setCatalogItems] = React.useState<Array<{ key: string; price?: number; label: string; petType: string }>>([]);
    const [ownedKeys, setOwnedKeys] = React.useState<string[]>([]);
    const [activePetId, setActivePetId] = React.useState<string | null>(petId ?? null);
    const [pawPoints, setPawPoints] = React.useState(0);
    const [catalogLoading, setCatalogLoading] = React.useState(true);
    const [catalogError, setCatalogError] = React.useState<string | null>(null);

    const avatarKey = (avatar || "").toLowerCase();

const stickers = React.useMemo(() => {
    if (!localAvatarId || catalogItems.length !== 15) {
        return [];
    }

    const base = makeStickerSet(localAvatarId);

    return base.map((item, index) => {
        const catalog = catalogItems[index];

        const key = catalog.key;
        const price = Number(catalog.price ?? 0);

        const owned = ownedKeys.includes(key);

        return {
            ...item,
            catalogKey: key,
            price,
            owned,
            locked: price > 0 && !owned,
        };
    });
}, [localAvatarId, catalogItems, ownedKeys]);

    // Load server catalogue as soon as this screen opens, before the user picks a sticker.
React.useEffect(() => {
    let alive = true;

    setCatalogLoading(true);
    setCatalogError(null);
    setCatalogItems([]);
    setCatalogKeys([]);
    setOwnedKeys([]);
    setSelectedSticker(null);

    const loadStickerCatalogue = async () => {
        try {
            const draft = await readPetSetupDraft();

            let type = draft.petType ?? "dog";
            let selectedLocalAvatar = resolveLocalAvatar(
                draft.avatarLocalId,
                avatarKey
            );

            // Edit mode: backend pet data is the source of truth.
            if (petId) {
                const { pet } = await petcardApi.getPet(petId);

                if (!alive) return;

                type = String(pet.type || "").toLowerCase() as typeof type;

                selectedLocalAvatar = resolveLocalAvatar(
                    pet.avatarLocalId,
                    pet.avatarKey
                );

                setActivePetId(pet.id);
            } else {
                setActivePetId(null);
            }

            if (
                !["dog", "cat", "rabbit"].includes(type) ||
                !selectedLocalAvatar ||
                !stickerAssetSets[selectedLocalAvatar]
            ) {
                throw new Error(
                    "Selected pet avatar is invalid. Please select your avatar again."
                );
            }

            if (!alive) return;

            setLocalAvatarId(selectedLocalAvatar);

            // Fetch account ownership and wallet.
            const ownership = await petcardApi.ownedStickers();

            if (!alive) return;

            setOwnedKeys(
                ownership.owned.map((item) => item.key)
            );

            setPawPoints(
                ownership.wallet?.pawPoints ?? 0
            );

            // IMPORTANT:
            // Backend query avatarKey expects the LOCAL avatar ID:
            // kiki, huchiko, browny, etc.
            const { items } = await petcardApi.listStickers(
                type,
                selectedLocalAvatar
            );

            if (!alive) return;

            const prefix = `${selectedLocalAvatar}-`;

            const eligible = items
                .filter((item) => {
                    const itemType = String(
                        item.petType ?? ""
                    ).toLowerCase();

                    return (
                        item.key.startsWith(prefix) &&
                        (itemType === type || itemType === "all")
                    );
                })
                .sort(
                    (a, b) =>
                        (a.order ?? 0) - (b.order ?? 0)
                );

            if (eligible.length !== 15) {
                throw new Error(
                    `Expected 15 stickers for ${selectedLocalAvatar}, but received ${eligible.length}. Please check the backend catalogue.`
                );
            }

            setCatalogItems(eligible);
            setCatalogKeys(
                eligible.map((item) => item.key)
            );
        } catch (error) {
            if (!alive) return;

            // Do not use the old unfiltered catalogue cache.
            // It can map another avatar's stickers to this avatar.
            setCatalogItems([]);
            setCatalogKeys([]);

            setCatalogError(
                error instanceof Error
                    ? error.message
                    : "Could not load stickers."
            );
        } finally {
            if (alive) {
                setCatalogLoading(false);
            }
        }
    };

    loadStickerCatalogue();

    return () => {
        alive = false;
    };
}, [avatarKey, petId]);

    const gridData = React.useMemo(
        () => withPlaceholders(stickers),
        [stickers]
    );

    /* The page opens only when the catalogue answered AND this avatar's 15 stickers are loaded. */
    const stickerImages = React.useMemo(
        () => [PAW_IMG, PAW_WHITE_IMG, ...(localAvatarId ? (stickerAssetSets[localAvatarId] ?? []) : [])],
        [localAvatarId]
    );
    const imagesReady = useImagesReady(stickerImages, !!localAvatarId || !!catalogError);
    const { lang } = useLang();
    const tall = lang === "hi";
    const showLoader = !fontsLoaded || (catalogLoading && !catalogError) || !imagesReady;

    if (showLoader) return <ScreenLoader />;

    const handleStickerPress = (item: StickerItem) => {
        if (item.owned) { setSelectedSticker(item.id); return; }
        if ((item.price ?? 0) > 0) {
            if (!activePetId) {
                Alert.alert("Paid sticker", `This sticker costs ${item.price} Paw Points. Complete pet setup first, then open Sticker Shop to purchase it.`);
                return;
            }
            if (pawPoints < (item.price ?? 0)) {
                Alert.alert("Not enough Paw Points", `This sticker costs ${item.price} Paw Points. Your current balance is ${pawPoints}.`);
                return;
            }
            Alert.alert("Unlock sticker?", `Spend ${item.price} Paw Points to permanently unlock this sticker? Your balance is ${pawPoints} Paw Points.`, [
                { text: "Cancel", style: "cancel" },
                { text: "Unlock", onPress: async () => {
                    try {
                        const result = await petcardApi.purchaseSticker(item.catalogKey!);
                        if (activePetId) await petcardApi.selectStickerForPet(activePetId, item.catalogKey!);
                        const ownership = await petcardApi.ownedStickers();
                        setOwnedKeys(ownership.owned.map((entry) => entry.key));
                        setPawPoints(ownership.wallet?.pawPoints ?? result.wallet?.pawPoints ?? 0);
                        setSelectedSticker(item.id);
                        Alert.alert(result.alreadyOwned ? "Sticker already unlocked" : "Sticker unlocked", "This sticker is permanently available across your account.");
                    } catch (error) { Alert.alert("Purchase failed", error instanceof Error ? error.message : "Please try again."); }
                } },
            ]);
            return;
        }
        setSelectedSticker(item.id);
    };

    const handleContinue = async () => {
        const selected = stickers.find((item) => item.id === selectedSticker);
        if (catalogError) { Alert.alert("Sticker catalogue unavailable", "Reconnect and reload stickers before continuing. Prices must be confirmed by the server."); return; }
        if (!selected || selected.locked) return;
        if (catalogLoading || catalogError || catalogKeys.length === 0) return;
        const index = stickers.filter((item) => !item.empty).findIndex((item) => item.id === selected.id);
        const stickerKey = selected.catalogKey ?? catalogKeys[index];
        if (!stickerKey) return;
        if (activePetId) {
            try {
                if (!ownedKeys.includes(stickerKey)) {
                    const purchase = await petcardApi.purchaseSticker(stickerKey);
                    setPawPoints(purchase.wallet?.pawPoints ?? pawPoints);
                }
                await petcardApi.selectStickerForPet(activePetId, stickerKey);
                const ownership = await petcardApi.ownedStickers();
                setOwnedKeys(ownership.owned.map((entry) => entry.key));
                setPawPoints(ownership.wallet?.pawPoints ?? pawPoints);
            } catch (error) { Alert.alert("Could not select sticker", error instanceof Error ? error.message : "Please try again."); return; }
        } else {
            if (!ownedKeys.includes(stickerKey)) {
                try {
                    const purchase = await petcardApi.purchaseSticker(stickerKey);
                    setPawPoints(purchase.wallet?.pawPoints ?? pawPoints);
                    setOwnedKeys((current) => current.includes(stickerKey) ? current : [...current, stickerKey]);
                } catch (error) { Alert.alert("Could not unlock sticker", error instanceof Error ? error.message : "Please try again."); return; }
            }
            await updatePetSetupDraft({ stickerKeys: [stickerKey] });
        }
        if (petId) { router.back(); return; }
        router.push("/OptionalHealthBasicsScreen");
    };

    return (
        <View style={styles.container}>
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawMiddleRight]}
            />
            <Image
                source={PAW_IMG}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            <View style={styles.header}>
                <Text style={[styles.title, tall && styles.titleTall, lang !== "en" && { letterSpacing: 0 }]} maxFontSizeMultiplier={1.1}>
                    Choose a Sticker
                </Text>
                <Text style={[styles.subtitle, tall && styles.subtitleTall]} maxFontSizeMultiplier={1.1}>
                    Pick the sticker that matches your pet&apos;s mood.
                </Text>
                <View style={{ marginTop: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, backgroundColor: "#FFF3E8" }}>
                    <Text style={{ color: "#A64C12", fontFamily: "Nunito_700Bold" }}>🐾 {pawPoints} Paw Points</Text>
                </View>
            </View>

            {catalogLoading ? <Text style={styles.subtitle}>Loading stickers…</Text> : null}
            {catalogError ? <Text style={[styles.subtitle, { color: "#B42318" }]}>{catalogError} Please check your connection and reopen this screen.</Text> : null}

            <FlatList
                data={gridData}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.stickerRow}
                initialNumToRender={15}
                renderItem={({ item }) => {
                    if (item.empty) {
                        return <View style={styles.stickerPlaceholder} />;
                    }

                    const selected = selectedSticker === item.id;
                    const locked = !!item.locked;

                    return (
                        <View style={styles.stickerItemWrapper}>
                            <Pressable
                                onPress={() => handleStickerPress(item)}
                                style={[
                                    styles.stickerCard,
                                    selected && styles.stickerCardSelected,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    locked
                                        ? `Sticker ${item.id} locked, ${item.price} points`
                                        : `Sticker ${item.id}`
                                }
                                accessibilityState={{ selected, disabled: locked }}
                            >
                                <Image
                                    source={item.image}
                                    resizeMode="contain"
                                    style={[
                                        styles.stickerImage,
                                        locked && styles.stickerImageLocked,
                                    ]}
                                />

                                {item.owned ? <View style={styles.ownedBadge}><Ionicons name="checkmark-circle" size={s(22)} color="#5E9B2D" /></View> : null}
                                {locked && (
                                    <View
                                        style={styles.lockOverlay}
                                        pointerEvents="none"
                                    >
                                        <Ionicons
                                            name="lock-closed"
                                            size={s(30)}
                                            color="#381B0E"
                                        />
                                    </View>
                                )}
                            </Pressable>

                            {/* Free and already-owned stickers show nothing; paid ones show only their points (50 / 70 / 80). */}
                            {(item.price ?? 0) > 0 && !item.owned ? (
                                <View style={styles.pointsPill}>
                                    <Ionicons name="paw" size={s(14)} color="#FF7A00" />
                                    <Text style={styles.pointsText} numberOfLines={1}>
                                        {item.price} Points
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    );
                }}
            />

            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    title={catalogLoading ? "Loading stickers…" : "Continue"}
                    onPress={handleContinue}
                    style={styles.continueButton}
                    icon={
                        <Image
                            source={PAW_WHITE_IMG}
                            resizeMode="contain"
                            style={styles.buttonPaw}
                        />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    header: {
        alignItems: "center",
        paddingHorizontal: s(5),
        paddingTop: height * 0.112,
        marginBottom: s(15),
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

    titleTall: { lineHeight: s(46) },
    subtitleTall: { lineHeight: s(34) },

    listContent: {
        paddingHorizontal: LIST_PADDING,
        paddingTop: s(1),
        // Continue button ke neeche last row (aur points pill) na chhupe
        paddingBottom: s(130),
    },

    stickerRow: {
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: s(14),
    },

    stickerItemWrapper: {
        width: CARD_WIDTH,
        alignItems: "center",
    },

    stickerCard: {
        width: CARD_WIDTH,
        aspectRatio: 0.9,
        borderRadius: s(20),
        backgroundColor: "#FFFAF4",
        borderWidth: 1,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    stickerCardSelected: {
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
    },

    stickerPlaceholder: {
        width: CARD_WIDTH,
        aspectRatio: 0.9,
    },

    stickerImage: {
        width: "86%",
        height: "86%",
    },

    stickerImageLocked: {
        opacity: 0.35,
    },

    lockOverlay: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },

    ownedBadge: { position: "absolute", top: s(5), right: s(5), backgroundColor: "#FFFFFF", borderRadius: s(12), padding: s(2) },
    pointsPill: {
        marginTop: s(6),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: s(8),
        paddingVertical: s(3),
        maxWidth: "100%",
        borderRadius: s(20),
        backgroundColor: "#FFE0C4",
        borderWidth: 1.5,
        borderColor: "#FF7A00",
        gap: s(5),
    },

    pointsText: {
        textAlign: "center",
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(14),
        lineHeight: s(24),
        color: "#FF7A00",
    },

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
        top: 145 * SCALE,
        right: -15 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawMiddleRight: {
        top: 390 * SCALE,
        right: 0,
        transform: [{ rotate: "-8deg" }],
    },

    pawBottomRight: {
        bottom: 10 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /*
     * List scroll hoti hai, isliye yahan white background hai,
     * warna stickers button ke peeche se dikhte.
     */
    bottomButtonContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: s(6),
        paddingTop: s(10),
        paddingBottom: s(27),
        backgroundColor: "#FFFFFF",
        zIndex: 20,
    },

    continueButton: {
        width: "100%",
        height: s(50),
        borderRadius: s(15),
    },

    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },
});