import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Manage loose fur",
        body:
            "Golden Retrievers shed all year, and much more in spring and autumn when they \"blow\" their coat. It's completely normal, and the right routine keeps your home and Milo's coat in great shape.",
        facts: [
            { label: "Heavy seasons", value: "Spring & autumn", icon: "weather-sunny" },
            { label: "Brushing", value: "Daily at peak", icon: "brush" },
            { label: "Diet", value: "Omega-3 supports coat", icon: "fish" },
            { label: "Cleaning", value: "Frequent vacuuming", icon: "broom" },
        ],
    },
    {
        type: "list",
        heading: "What helps",
        tone: "good",
        items: [
            { title: "Brush more often", text: "Daily brushing during shedding season takes out loose fur before it lands on the floor.", icon: "brush" },
            { title: "Use an undercoat rake", text: "Go gently over the neck, chest and thighs where undercoat builds up.", icon: "brush" },
            { title: "Bath and blow-dry", text: "A bath followed by a thorough blow-dry loosens a lot of dead undercoat.", icon: "bathtub-outline" },
            { title: "Feed a quality diet", text: "A good diet with omega-3 fatty acids supports skin and coat. Ask your vet before adding supplements.", icon: "food-drumstick-outline" },
            { title: "Wash bedding weekly", text: "Keeps fur, dander and smells under control.", icon: "bed-outline" },
            { title: "Rubber broom or lint roller", text: "Quick fixes for furniture and clothes.", icon: "broom" },
        ],
    },
    {
        type: "list",
        heading: "When shedding isn't normal",
        tone: "warn",
        intro: "See your vet if you notice any of these:",
        items: [
            { title: "Bald patches", text: "Fur missing in spots rather than thinning evenly.", icon: "alert-outline" },
            { title: "Red, flaky or sore skin", text: "Could point to allergies, parasites or infection.", icon: "alert-outline" },
            { title: "Constant scratching or licking", text: "Itching that doesn't settle.", icon: "alert-outline" },
            { title: "Dull, brittle coat", text: "May signal a nutrition or health problem.", icon: "alert-outline" },
            { title: "Heavy shedding out of season", text: "Sudden changes can be linked to stress or hormone problems.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "Don't shave to reduce shedding 💡",
        body: "Shaving a double coat doesn't stop shedding and can harm the coat. Regular brushing is a much better solution.",
    },
];

export default function SheddingCareScreen() {
    return <KnowGuide title="Shedding Care" chip="Shedding Care" sections={SECTIONS} />;
}