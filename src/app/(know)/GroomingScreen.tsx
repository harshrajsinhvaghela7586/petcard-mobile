import { KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "brushing", title: "Brushing", sub: "How often & how to brush", icon: "brush", color: "#3B6FB6", tint: "#E6F0FA", route: "Grooming/BrushingScreen" },
    { key: "bathing", title: "Bathing", sub: "Tips for a good bath", icon: "bathtub-outline", color: "#2E9C8A", tint: "#E3F4F1", route: "Grooming/BathingScreen" },
    { key: "nails", title: "Nail Care", sub: "Keep those nails trimmed", icon: "content-cut", color: "#FF7A00", tint: "#FFE9D6", route: "Grooming/NailCareScreen" },
    { key: "ears", title: "Ear Cleaning", sub: "Clean ears safely", icon: "ear-hearing", color: "#7A5CFF", tint: "#EFE9FF", route: "Grooming/EarCleaningScreen" },
    { key: "shedding", title: "Shedding Care", sub: "Manage loose fur", icon: "spray-bottle", color: "#3B6FB6", tint: "#E6F0FA", route: "Grooming/SheddingCareScreen" },
];

export default function GroomingScreen() {
    return (
        <KnowMenuPage
            menuKey="grooming"
            title="Grooming"
            tint="#FDEBDD"
            chip="Grooming"
            heroTitle="Looking good, feeling great"
            heroSub="A little grooming each week keeps Milo's coat, skin and nails healthy."
            heading="Keep Milo looking and feeling great!"
            tip={{ title: "Grooming Tip ✨", text: "Regular grooming prevents skin issues and keeps Milo comfortable." }}
            items={ITEMS}
            decor={[
                { name: "brush", size: 28, color: "#E8955A", pos: { top: s(14), right: s(22) } },
                { name: "water", size: 22, color: "#9CCBEF", pos: { top: s(76), right: s(120) } },
                { name: "spray-bottle", size: 26, color: "#E9C28A", pos: { bottom: s(16), left: s(14) } },
            ]}
        />
    );
}