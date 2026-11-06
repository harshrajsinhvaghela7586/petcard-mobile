import * as SecureStore from "expo-secure-store";

export const WHISTLES = [
    { key: "classic", label: "Classic", src: () => require("../../assets/sounds/whistle_classic.wav") },
    { key: "short", label: "Short", src: () => require("../../assets/sounds/whistle_short.wav") },
    { key: "trill", label: "Trill", src: () => require("../../assets/sounds/whistle_trill.wav") },
    { key: "sharp", label: "Sharp", src: () => require("../../assets/sounds/whistle_sharp.wav") },
    { key: "soft", label: "Soft", src: () => require("../../assets/sounds/whistle_soft.wav") },
] as const;
export type WhistleKey = (typeof WHISTLES)[number]["key"];
const KEY = "petcard.whistleSound.v1";

export async function getWhistle(): Promise<WhistleKey> {
    try {
        const v = await SecureStore.getItemAsync(KEY);
        return WHISTLES.some((w) => w.key === v) ? (v as WhistleKey) : "classic";
    } catch { return "classic"; }
}
export const saveWhistle = (k: WhistleKey) => SecureStore.setItemAsync(KEY, k).catch(() => {});

let player: any = null;
/** Plays the chosen whistle. Needs `npx expo install expo-audio`; silent without it. */
export function playWhistle(key: WhistleKey) {
    try {
        const item = WHISTLES.find((w) => w.key === key);
        if (!item) return;
        const audio = require("expo-audio");
        /* play even when the phone is on silent / vibrate */
        audio.setAudioModeAsync?.({ playsInSilentMode: true, interruptionMode: "mixWithOthers" })?.catch?.(() => {});
        player?.remove?.();
        player = audio.createAudioPlayer(item.src());
        player.volume = 1;
        player.play();
    } catch { /* expo-audio missing */ }
}

let clickPlayer: any = null;
/** Short "pop" for the Clicker. Reuses one player (rewinds each tap) so rapid clicks stay instant; silent if expo-audio is missing. */
export function playClickSound() {
    try {
        const audio = require("expo-audio");
        if (!clickPlayer) {
            audio.setAudioModeAsync?.({ playsInSilentMode: true, interruptionMode: "mixWithOthers" })?.catch?.(() => {});
            clickPlayer = audio.createAudioPlayer(require("../../assets/sounds/tone_pop.wav"));
            clickPlayer.volume = 1;
        }
        clickPlayer.seekTo?.(0);
        clickPlayer.play();
    } catch { /* expo-audio missing */ }
}
