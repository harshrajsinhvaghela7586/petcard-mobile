import { Decor, Hero, KnowFrame, KnowItem, ListCard, s, TipCard } from "../../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "brushing", title: "Brushing", sub: "How often & how to brush", icon: "brush", color: "#3B6FB6", tint: "#E6F0FA", route: "Grooming/BrushingScreen" },
    { key: "bathing", title: "Bathing", sub: "Tips for a good bath", icon: "bathtub-outline", color: "#2E9C8A", tint: "#E3F4F1", route: "Grooming/BathingScreen" },
    { key: "nails", title: "Nail Care", sub: "Keep those nails trimmed", icon: "content-cut", color: "#FF7A00", tint: "#FFE9D6", route: "Grooming/NailCareScreen" },
    { key: "ears", title: "Ear Cleaning", sub: "Clean ears safely", icon: "ear-hearing", color: "#7A5CFF", tint: "#EFE9FF", route: "Grooming/EarCleaningScreen" },
    { key: "shedding", title: "Shedding Care", sub: "Manage loose fur", icon: "spray-bottle", color: "#3B6FB6", tint: "#E6F0FA", route: "Grooming/SheddingCareScreen" },
];

export default function GroomingScreen() {
    return (
        <KnowFrame title="Grooming">
            <Hero tint="#FDEBDD" heroHeight={140}>
                <Decor name="brush" size={64} color="#E07A2F" style={{ left: s(28), top: s(40) }} />
                <Decor name="spray-bottle" size={84} color="#E9C28A" style={{ alignSelf: "center" }} />
                <Decor name="bathtub-outline" size={64} color="#5B9BD5" style={{ right: s(28), top: s(46) }} />
                <Decor name="water" size={22} color="#9CCBEF" style={{ left: s(14), top: s(14) }} />
                <Decor name="water" size={18} color="#9CCBEF" style={{ right: s(20), top: s(14) }} />
            </Hero>

            <ListCard heading="Keep Milo looking and feeling great!" items={ITEMS} />

            <TipCard
                title="Grooming Tip ✨"
                text="Regular grooming prevents skin issues and keeps Milo comfortable."
            />
        </KnowFrame>
    );
}