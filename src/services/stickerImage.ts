import { Image } from "react-native";
import { RAW_STICKER_SETS } from "@/constants/stickerSets";
import { getPetAvatarSource } from "@/services/petAvatar";

export const STICKER_AVATARS = ["huchiko", "browny", "noir", "kiki", "oreo", "cupid", "waffle"];

/** "dog_huchiko" / "huchiko" / "huchiko-6"  ->  "huchiko" ("" if unknown) */
export const avatarSlug = (...values: Array<string | null | undefined>): string => {
    for (const value of values) {
        const raw = String(value || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");
        const hit = STICKER_AVATARS.find((n) => raw === n || raw.startsWith(`${n}-`) || raw.endsWith(`_${n}`) || raw.endsWith(`-${n}`));
        if (hit) return hit;
    }
    return "";
};

/** Sticker key like "huchiko-6" -> its image (1-based, same order as the catalogue). */
export const stickerImage = (key?: string | null): any | null => {
    const m = /^([a-z]+)-(\d{1,2})$/.exec(String(key || ""));
    if (!m) return null;
    return (RAW_STICKER_SETS as Record<string, any[]>)[m[1]]?.[Number(m[2]) - 1] ?? null;
};

/** Same image as a URI string, for components that only accept `photoUrl`. */
export const stickerUri = (key?: string | null): string | null => {
    const img = stickerImage(key);
    if (!img) return null;
    try { return Image.resolveAssetSource(img)?.uri ?? null; } catch { return null; }
};

/** What to draw for a pet: its active sticker, else its avatar. */
export const petImageSource = (pet?: any): any =>
    stickerImage(pet?.activeStickerKey) ?? getPetAvatarSource(pet?.type, pet?.avatarKey, pet?.avatarLocalId);