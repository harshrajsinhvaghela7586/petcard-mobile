import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Bonding with Milo",
        body:
            "Golden Retrievers crave closeness and affection. Spending focused, loving time with Milo every day builds trust, boosts his confidence and keeps him emotionally healthy.",
        facts: [
            { label: "Every day", value: "One-on-one time", icon: "account-heart-outline" },
            { label: "Touch", value: "Gentle petting & massage", icon: "hand-heart-outline" },
            { label: "Voice", value: "Calm and happy", icon: "message-text-outline" },
            { label: "Learning", value: "Bond through training", icon: "school-outline" },
        ],
    },
    {
        type: "list",
        heading: "Ways to bond",
        tone: "good",
        items: [
            { title: "Daily cuddle time", text: "Sit with him and give him your full attention, with no phone.", icon: "heart-outline" },
            { title: "Massage", text: "Gently rub his ears, chest and shoulders. Most dogs love it.", icon: "hand-heart-outline" },
            { title: "Grooming together", text: "Brushing turns care into a calm, loving ritual.", icon: "brush" },
            { title: "Learn something new", text: "Tricks and games build teamwork.", icon: "school-outline" },
            { title: "Share adventures", text: "New walks, car rides and trips make memories.", icon: "walk" },
            { title: "Let him be near you", text: "Goldens are happiest when included in family life.", icon: "home-heart" },
        ],
    },
    {
        type: "list",
        heading: "Reading Milo's feelings",
        tone: "good",
        items: [
            { title: "Happy & relaxed", text: "Loose body, soft eyes, wagging tail, open mouth.", icon: "emoticon-happy-outline" },
            { title: "Worried or anxious", text: "Tucked tail, lip licking, yawning, showing the whites of his eyes.", icon: "emoticon-sad-outline" },
            { title: "Wants space", text: "Turns away, stiffens or moves off. Respect it.", icon: "hand-back-left-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💗",
        body: "Studies show that gazing at each other raises oxytocin, the \"love hormone\", in both dogs and their owners. A few quiet minutes of eye contact and a soft voice really do strengthen your bond.",
    },
];

export default function LoveAttentionScreen() {
    return <KnowGuide title="Love & Attention" chip="Love & Attention" sections={SECTIONS} />;
}