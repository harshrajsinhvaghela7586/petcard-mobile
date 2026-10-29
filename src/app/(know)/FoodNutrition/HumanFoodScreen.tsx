import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "What's safe & what's not",
        body:
            "Some human foods make healthy snacks, but others are toxic to dogs. Stick to small portions of safe foods, and when you're not sure, skip it and ask your vet.",
        facts: [
            { label: "Safe", value: "Carrot, apple, pumpkin", icon: "carrot" },
            { label: "Toxic", value: "Chocolate, grapes, xylitol", icon: "skull-outline" },
            { label: "Portion", value: "Small bites only", icon: "scale-bathroom" },
            { label: "Rule", value: "When in doubt, ask", icon: "help-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Generally safe (in moderation)",
        tone: "good",
        items: [
            { title: "Carrots, cucumber, green beans", text: "Crunchy, low-calorie snacks.", icon: "carrot" },
            { title: "Apple slices", text: "Remove the core and seeds.", icon: "food-apple-outline" },
            { title: "Blueberries & watermelon", text: "Seedless and without rind.", icon: "fruit-watermelon" },
            { title: "Plain cooked chicken or turkey", text: "No bones, skin, salt or seasoning.", icon: "food-drumstick-outline" },
            { title: "Plain cooked rice & pumpkin", text: "Gentle on the tummy and often used for upset stomachs.", icon: "grain" },
            { title: "Cooked egg", text: "Fully cooked and plain.", icon: "egg-outline" },
            { title: "Peanut butter", text: "Only xylitol-free, unsalted, and in tiny amounts.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Never feed",
        tone: "danger",
        items: [
            { title: "Chocolate & cocoa", text: "Contains theobromine, which can cause vomiting, tremors and seizures.", icon: "skull-outline" },
            { title: "Grapes & raisins", text: "Can cause sudden kidney failure, even in small amounts.", icon: "skull-outline" },
            { title: "Onion, garlic & chives", text: "Damage red blood cells. Cooked or powdered forms are also unsafe.", icon: "skull-outline" },
            { title: "Xylitol", text: "A sweetener in sugar-free gum, sweets and some peanut butters. Very dangerous.", icon: "skull-outline" },
            { title: "Macadamia nuts, alcohol & caffeine", text: "Toxic to dogs, even in small quantities.", icon: "skull-outline" },
            { title: "Cooked bones", text: "They splinter and can injure the mouth or gut.", icon: "bone" },
            { title: "Fried, salty & fatty foods", text: "Can trigger pancreatitis and obesity.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "If Milo eats something toxic 🚨",
        body: "Don't wait for symptoms. Call your vet right away and keep the packaging handy. See the full list of toxic items for more.",
        action: { label: "View Toxic Items", route: "/Safety/ToxicItemsScreen" },
    },
];

export default function HumanFoodsScreen() {
    return <KnowGuide title="Human Foods" chip="Human Foods" sections={SECTIONS} />;
}