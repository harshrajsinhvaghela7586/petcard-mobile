import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Brushing Milo's double coat",
        body:
            "Golden Retrievers have a thick, water-repellent double coat. Regular brushing removes loose fur, spreads natural oils, prevents painful mats and lets you check Milo's skin.",
        facts: [
            { label: "How often", value: "2 – 3 times a week", icon: "calendar-check-outline" },
            { label: "Shedding season", value: "Daily", icon: "weather-sunny" },
            { label: "Time", value: "10 – 15 minutes", icon: "clock-outline" },
            { label: "Mat spots", value: "Ears, legs, tail, belly", icon: "paw" },
        ],
    },
    {
        type: "timeline",
        heading: "How to brush",
        steps: [
            { tag: "Step 1", title: "Get him relaxed", text: "Pick a calm spot, have treats ready and check for tangles, ticks or sore skin." },
            { tag: "Step 2", title: "Slicker brush in sections", text: "Brush in the direction of hair growth, working from legs up to the body." },
            { tag: "Step 3", title: "Ease out mats gently", text: "Hold the fur at the base so it doesn't pull, and use fingers or a detangler. Don't yank. Ask a groomer for stubborn mats." },
            { tag: "Step 4", title: "Use an undercoat rake", text: "Go over the neck, chest and thighs to lift loose undercoat." },
            { tag: "Step 5", title: "Finish with a comb", text: "Comb the feathering on ears, legs and tail, then reward Milo." },
        ],
    },
    {
        type: "list",
        heading: "Tools you'll need",
        tone: "good",
        items: [
            { title: "Slicker brush", text: "Removes loose fur and light tangles.", icon: "brush" },
            { title: "Undercoat rake", text: "Reaches the dense layer beneath the topcoat.", icon: "brush" },
            { title: "Metal comb", text: "Checks that no knots are left, especially on feathering.", icon: "check-circle-outline" },
            { title: "Treats", text: "Keeps grooming a positive experience.", icon: "cookie-outline" },
        ],
    },
    {
        type: "tip",
        title: "Never shave a Golden 💡",
        body: "The double coat protects against both heat and sunburn. Shaving can damage the way it grows back. If Milo is too warm, brush out loose undercoat and keep him cool instead.",
    },
];

export default function BrushingScreen() {
    return <KnowGuide title="Brushing" chip="Brushing" sections={SECTIONS} />;
}