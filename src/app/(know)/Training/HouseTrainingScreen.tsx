import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Tips for potty training",
        body:
            "House training takes patience and a steady routine. Most puppies get the hang of it by 4 – 6 months, and accidents along the way are completely normal.",
        facts: [
            { label: "Bladder limit", value: "About 1 hour per month of age", icon: "clock-outline" },
            { label: "Go out after", value: "Sleep, meals & play", icon: "walk" },
            { label: "Pick one spot", value: "Same place each time", icon: "map-marker-outline" },
            { label: "Reward", value: "Straight after he goes", icon: "cookie-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "A daily routine that works",
        steps: [
            { tag: "Morning", title: "First thing", text: "Take Milo out as soon as he wakes up." },
            { tag: "After meals", title: "5 – 30 minutes later", text: "Digestion makes him need to go soon after eating or drinking." },
            { tag: "After naps & play", title: "Every time", text: "Excitement and waking up both trigger the urge." },
            { tag: "Through the day", title: "Every 1 – 2 hours", text: "Young puppies need frequent trips. Stretch this gradually as he grows." },
            { tag: "Night", title: "Last trip before bed", text: "Keep it calm and boring so he knows it's time to settle." },
        ],
    },
    {
        type: "list",
        heading: "When accidents happen",
        tone: "warn",
        items: [
            { title: "Don't scold or rub his nose", text: "He won't connect it to the mistake. It only makes him fearful.", icon: "close-circle-outline" },
            { title: "Clean with an enzymatic cleaner", text: "It removes the smell that tells him to go there again.", icon: "spray-bottle" },
            { title: "Supervise and limit space", text: "Use a gate or crate when you can't watch him closely.", icon: "gate" },
            { title: "Learn his signals", text: "Sniffing, circling and whining often mean he needs to go.", icon: "magnify" },
        ],
    },
    {
        type: "tip",
        title: "Crate training helps 💡",
        body: "Dogs avoid soiling where they sleep, so a right-sized crate teaches bladder control. Never use it as punishment, and don't leave puppies in it longer than they can hold it.",
    },
];

export default function HouseTrainingScreen() {
    return <KnowGuide title="House Training" chip="House Training" sections={SECTIONS} />;
}