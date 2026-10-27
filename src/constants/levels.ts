export type LevelInfo = {
    level: number;
    name: string;
    /* shield colour of that level */
    color: string;
    /* XP needed to reach the NEXT level */
    xpToNext: number;
};

export const LEVELS: LevelInfo[] = [
    { level: 1, name: "New Pet Parent", color: "#FF6A3D", xpToNext: 250 },
    { level: 2, name: "Care Learner", color: "#3B8BEB", xpToNext: 600 },
    { level: 3, name: "Habit Builder", color: "#7A5CD6", xpToNext: 1000 },
    { level: 4, name: "Care Companion", color: "#FF7A00", xpToNext: 2000 },
    { level: 5, name: "Pet Expert", color: "#9C9C9C", xpToNext: 3500 },
    { level: 6, name: "Paw Master", color: "#9C9C9C", xpToNext: 5000 },
];

/*
 * Abhi static (Home ke numbers jaise). Backend se level/XP aane par
 * sirf yahi do values replace hongi.
 */
export const CURRENT_LEVEL = 4;
export const CURRENT_XP = 1250;
