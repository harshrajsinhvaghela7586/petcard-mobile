import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Healthy treat ideas",
        body:
            "Treats are perfect for training and bonding, but they add up fast. Choose simple, healthy options and keep them to a small part of Milo's day.",
        facts: [
            { label: "Limit", value: "10% of daily calories", icon: "scale-bathroom" },
            { label: "Size", value: "Pea-sized for training", icon: "cookie-outline" },
            { label: "Best choice", value: "Single-ingredient", icon: "check-circle-outline" },
            { label: "Timing", value: "Reward right away", icon: "timer-outline" },
        ],
    },
    {
        type: "list",
        heading: "Treats Milo can enjoy",
        tone: "good",
        items: [
            { title: "Carrot sticks & cucumber", text: "Crunchy and very low in calories.", icon: "carrot" },
            { title: "Apple & blueberries", text: "Sweet, fresh and full of vitamins. Remove apple seeds.", icon: "food-apple-outline" },
            { title: "Freeze-dried meat", text: "Single-ingredient chicken or fish pieces are great training rewards.", icon: "food-drumstick-outline" },
            { title: "Pieces of his own kibble", text: "The easiest way to reward without adding extra calories.", icon: "bowl-mix-outline" },
            { title: "Vet-approved dental chews", text: "Help keep teeth clean as well.", icon: "tooth-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "Quick recipe: pumpkin & oat biscuits",
        intro: "Simple, sugar-free and easy to make at home.",
        steps: [
            { tag: "Step 1", title: "Mix", text: "Combine 1 cup oat flour, ½ cup plain pumpkin purée and 1 egg into a firm dough." },
            { tag: "Step 2", title: "Shape", text: "Roll it out and cut into small, bite-sized pieces." },
            { tag: "Step 3", title: "Bake", text: "Bake at 175 °C for about 20 minutes until firm." },
            { tag: "Step 4", title: "Cool & store", text: "Let them cool completely. Keep in an airtight container in the fridge for up to 5 days." },
        ],
    },
    {
        type: "list",
        heading: "Treat rules",
        tone: "warn",
        items: [
            { title: "Break treats into tiny pieces", text: "Milo doesn't need a whole biscuit to feel rewarded.", icon: "alert-outline" },
            { title: "Cut back his meals a little", text: "On treat-heavy training days, reduce his regular portion slightly.", icon: "alert-outline" },
            { title: "Avoid rawhide & tiny hard chews", text: "They can cause choking or blockages.", icon: "alert-outline" },
            { title: "Read the label", text: "Skip treats with xylitol, artificial colours, or lots of sugar and salt.", icon: "alert-outline" },
        ],
    },
];

export default function TreatsRewardsScreen() {
    return <KnowGuide title="Treats & Rewards" chip="Treats & Rewards" sections={SECTIONS} />;
}