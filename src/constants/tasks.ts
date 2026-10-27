/* Shared task data (abhi mock hai, baad me API se aayega) */
export type TaskInfo = {
    key: string;
    title: string;
    description: string;
    date: string;
    time: string;
    repeat: string;
    reminder: string;
    xp: number;
    icon: string;
    color: string;
    tint: string;
};

export const TASKS: Record<string, TaskInfo> = {
    breakfast: {
        key: "breakfast",
        title: "Breakfast",
        description: "Give Milo a healthy breakfast to\nstart his day right.",
        date: "20 May 2025",
        time: "08:00 AM",
        repeat: "Everyday",
        reminder: "10 min before",
        xp: 50,
        icon: "food-variant",
        color: "#5E9B2D",
        tint: "#EAF3DC",
    },
    walk: {
        key: "walk",
        title: "Evening Walk",
        description: "Take Milo for a good evening walk\nto keep him healthy and happy.",
        date: "20 May 2025",
        time: "06:00 PM",
        repeat: "Everyday",
        reminder: "10 min before",
        xp: 50,
        icon: "dog-service",
        color: "#FF7A00",
        tint: "#FFF0D6",
    },
    medicine: {
        key: "medicine",
        title: "Medicine",
        description: "Give Milo his medicine on time\nto keep him healthy.",
        date: "20 May 2025",
        time: "08:00 PM",
        repeat: "Everyday",
        reminder: "10 min before",
        xp: 40,
        icon: "pill",
        color: "#3B6FB6",
        tint: "#E6F0FA",
    },
    brush: {
        key: "brush",
        title: "Brush Fur",
        description: "Brush Milo's fur to keep his coat\nshiny and tangle free.",
        date: "20 May 2025",
        time: "Every Sunday",
        repeat: "Every Sunday",
        reminder: "30 min before",
        xp: 30,
        icon: "brush",
        color: "#7A5CFF",
        tint: "#F3EAFF",
    },
};

export const getTask = (key?: string) => TASKS[key ?? "walk"] ?? TASKS.walk;