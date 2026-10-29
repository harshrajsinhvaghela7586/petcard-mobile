import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Tips for a good bath",
        body:
            "Most Goldens only need a bath every 4 – 8 weeks, or when they're really dirty. Washing too often can dry out his skin and strip the natural oils that keep his coat healthy.",
        facts: [
            { label: "How often", value: "Every 4 – 8 weeks", icon: "calendar-check-outline" },
            { label: "Water", value: "Lukewarm", icon: "water-outline" },
            { label: "Shampoo", value: "Dog-specific only", icon: "bottle-tonic-outline" },
            { label: "Drying", value: "Thorough, to the skin", icon: "hair-dryer-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "Bath steps",
        steps: [
            { tag: "Step 1", title: "Brush first", text: "Mats tighten when wet, so remove tangles and loose fur before the bath." },
            { tag: "Step 2", title: "Set up safely", text: "Use a non-slip mat and have shampoo, towels and treats within reach." },
            { tag: "Step 3", title: "Wet the coat", text: "Use lukewarm water from the neck down. Keep water away from ears and eyes." },
            { tag: "Step 4", title: "Lather gently", text: "Massage in dog shampoo, working through the thick undercoat to the skin." },
            { tag: "Step 5", title: "Rinse really well", text: "Leftover shampoo causes itching and dryness. Keep rinsing until the water runs clear." },
            { tag: "Step 6", title: "Dry completely", text: "Towel dry, then use a blow dryer on cool or low. Damp undercoat can lead to hot spots." },
        ],
    },
    {
        type: "list",
        heading: "Avoid",
        tone: "warn",
        items: [
            { title: "Human shampoo", text: "Dog skin has a different pH and can get irritated.", icon: "alert-outline" },
            { title: "Hot water", text: "It can scald skin and dry it out.", icon: "alert-outline" },
            { title: "Water in the ears", text: "Floppy ears trap moisture and can get infected. Dry them gently afterwards.", icon: "ear-hearing" },
            { title: "Leaving the coat damp", text: "Moisture under a thick coat is a common cause of skin infections.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "After a swim 💡",
        body: "Milo loves water, so rinse him with fresh water after pools or the sea and dry his coat and ears. Chlorine and salt can irritate his skin.",
    },
];

export default function BathingScreen() {
    return <KnowGuide title="Bathing" chip="Bathing" sections={SECTIONS} />;
}