export type LevelInfo = { level: number; name: string; color: string; xpToNext: number };

/** Cumulative XP thresholds; kept in sync with backend/config/rewards.js. */
export const LEVEL_THRESHOLDS = [0, 700, 1600, 2700, 4000, 5500, 7200, 9100, 11200, 13500] as const;
const NAMES = ["New Pet Parent", "Care Learner", "Habit Builder", "Care Companion", "Pet Expert", "Paw Master", "Paw Champion", "Paw Guardian", "Paw Legend", "Legendary Companion"];
const COLORS = ["#FF6A3D", "#3B8BEB", "#7A5CD6", "#FF7A00", "#9C9C9C", "#9C9C9C", "#D49A22", "#4D8C9A", "#7952A8", "#B8860B"];
export const LEVELS: LevelInfo[] = LEVEL_THRESHOLDS.map((threshold, index) => ({
  level: index + 1,
  name: NAMES[index],
  color: COLORS[index],
  xpToNext: LEVEL_THRESHOLDS[index + 1] ?? threshold,
}));
export const CURRENT_LEVEL = 1;
export const CURRENT_XP = 0;
