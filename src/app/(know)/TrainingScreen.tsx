import { C, KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "commands", title: "Basic Commands", sub: "Sit, stay, come & more", icon: "dog-service", color: "#5E9B2D", tint: "#EAF3DC", route: "Training/BasicCommandScreen" },
    { key: "house", title: "House Training", sub: "Tips for potty training", icon: "toilet", color: "#7A5CFF", tint: "#EFE9FF", route: "Training/HouseTrainingScreen" },
    { key: "leash", title: "Leash Training", sub: "Walk nicely on leash", icon: "link-variant", color: "#3B6FB6", tint: "#E6F0FA", route: "Training/LeashTrainingScreen" },
    { key: "behavior", title: "Behavior Tips", sub: "Solve common behaviors", icon: "lightbulb-on-outline", color: "#E08A00", tint: "#FFF0D6", route: "Training/BehaviorTipsScreen" },
    { key: "games", title: "Fun Games", sub: "Make training fun!", icon: "puzzle", color: "#FF7A00", tint: "#FFE9D6", route: "Training/FunGamesScreen" },
];

export default function TrainingScreen() {
    return (
        <KnowMenuPage
            menuKey="training"
            title="Training"
            tint="#FDEBDD"
            chip="Training"
            heroTitle="Train. Bond. Repeat."
            heroSub="Short, positive sessions build trust and good manners."
            heading="Train. Bond. Repeat. 🐾"
            headingColor={C.brown}
            sub="Positive training builds trust and good behavior."
            tip={{ title: "Training Tip 🎯", text: "Keep sessions to 5–10 minutes and always end on a success." }}
            items={ITEMS}
            decor={[
                { name: "school", size: 30, color: "#4A4A4A", pos: { top: s(14), right: s(22) } },
                { name: "tennis-ball", size: 26, color: "#6FB1E8", pos: { top: s(76), right: s(120) } },
                { name: "gesture-tap", size: 26, color: "#8DBB6A", pos: { bottom: s(16), left: s(14) } },
            ]}
        />
    );
}