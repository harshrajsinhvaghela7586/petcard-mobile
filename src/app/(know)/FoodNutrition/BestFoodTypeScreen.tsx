import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "What to feed Milo",
        body:
            "Adult Golden Retrievers do best on a complete and balanced food made for large breeds. Look for real meat as the first ingredient and a good mix of protein, healthy fats and digestible carbs.",
        facts: [
            { label: "Protein", value: "Real meat first", icon: "food-drumstick-outline" },
            { label: "Healthy fats", value: "Omega-3 for coat & joints", icon: "fish" },
            { label: "Carbs & fibre", value: "Rice, oats, veggies", icon: "grain" },
            { label: "Water", value: "Always fresh", icon: "cup-water" },
        ],
    },
    {
        type: "list",
        heading: "Food options",
        tone: "good",
        items: [
            { title: "Dry kibble", text: "Convenient, affordable and good for teeth. Pick a large-breed adult formula.", icon: "bowl-mix-outline" },
            { title: "Wet / canned food", text: "Tasty and high in moisture. Great as a topper for picky eaters, but costlier.", icon: "food-variant" },
            { title: "Home-cooked meals", text: "Only with a recipe balanced by your vet or a pet nutritionist. Home recipes often miss key nutrients.", icon: "pot-steam-outline" },
            { title: "Raw diets", text: "Carry a risk of bacteria for Milo and your family. Talk to your vet before trying one.", icon: "alert-outline" },
        ],
    },
    {
        type: "list",
        heading: "What to check on the label",
        tone: "good",
        items: [
            { title: "\"Complete and balanced\"", text: "The pack should say it suits Milo's life stage (puppy, adult or senior).", icon: "check-circle-outline" },
            { title: "Named protein first", text: "Chicken, fish or lamb rather than vague \"meat\" or \"by-products\".", icon: "check-circle-outline" },
            { title: "Large-breed formula", text: "Controls calcium and calories to protect growing joints.", icon: "check-circle-outline" },
            { title: "No artificial colours", text: "Dyes and heavy sugar add nothing for Milo.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Switching foods? Go slow 💡",
        body: "Mix the new food into the old over 7 – 10 days: start with about 25% new and increase every 2 – 3 days. A sudden change can upset Milo's tummy.",
    },
];

export default function BestFoodTypesScreen() {
    return <KnowGuide title="Best Food Types" chip="Best Food Types" sections={SECTIONS} />;
}