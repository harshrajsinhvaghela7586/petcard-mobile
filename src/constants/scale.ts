import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const SCALE = Math.min(width / 393, height / 852);
const UI_SCALE = Math.min(SCALE, 1.3);

/* Same responsive helper as every other screen */
export const s = (size: number) => size * UI_SCALE;
export { width, height, SCALE };
