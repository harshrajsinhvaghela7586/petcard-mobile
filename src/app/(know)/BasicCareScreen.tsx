import { C, KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "routine", title: "Daily Routine", sub: "Create a daily schedule", icon: "timer-outline", color: "#FF7A00", tint: "#FFE9D6", route: "BasicCare/DailyRoutineScreen" },
    { key: "hydration", title: "Hydration", sub: "Water intake guide", icon: "water", color: "#5E9B2D", tint: "#EAF3DC", route: "BasicCare/HydrationScreen" },
    { key: "sleep", title: "Sleep & Rest", sub: "How much sleep does your pet need?", icon: "sleep", color: "#3B6FB6", tint: "#E6F0FA", route: "BasicCare/SleepRestScreen" },
    { key: "play", title: "Playtime", sub: "Importance of play", icon: "tennis-ball", color: "#7A5CFF", tint: "#EFE9FF", route: "BasicCare/PlayTimeScreen" },
    { key: "love", title: "Love & Attention", sub: "Bonding with your pet ❤️", icon: "heart", color: "#FF4B32", tint: "#FFE5E1", route: "BasicCare/LoveAttentionScreen" },
];

export default function BasicCareScreen() {
    return (
        <KnowMenuPage
            menuKey="basic_care"
            title="Basic Care"
            tint="#FFEBD6"
            chip="Basic Care"
            heroTitle="Care. Love. Every Day."
            heroSub="Small daily habits keep your pet happy and healthy."
            heading="Daily Care Essentials 🐾"
            headingColor={C.brown}
            sub="Little things every day make your pet's life amazing!"
            tip={{ title: "Care Tip 💛", text: "A steady daily routine for food, water, play and rest keeps your pet calm and happy." }}
            items={ITEMS}
            decor={[
                { name: "home-heart", size: 30, color: "#C8895A", pos: { top: s(14), right: s(22) } },
                { name: "water", size: 26, color: "#6FB1E8", pos: { top: s(76), right: s(120) } },
                { name: "paw", size: 26, color: "#8DBB6A", pos: { bottom: s(16), left: s(14) } },
            ]}
        />
    );
}