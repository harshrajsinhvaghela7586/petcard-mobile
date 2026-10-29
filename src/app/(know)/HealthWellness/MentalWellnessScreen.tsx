import KnowGuide, { Section } from "../../../components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "A happy mind, a happy Milo",
        body:
            "Golden Retrievers are smart, social and people-loving. When they get too little company or too little to do, they can become bored, anxious and destructive. Mental exercise matters as much as physical exercise.",
        facts: [
            { label: "Company", value: "Needs lots of it", icon: "account-heart-outline" },
            { label: "Time alone", value: "Under 4 – 5 hours", icon: "clock-outline" },
            { label: "Brain games", value: "10 – 15 min daily", icon: "puzzle-outline" },
            { label: "Sleep", value: "12 – 14 hours", icon: "sleep" },
        ],
    },
    {
        type: "list",
        heading: "Daily mind boosters",
        tone: "good",
        items: [
            { title: "Puzzle feeders & snuffle mats", text: "Make mealtime a brain game instead of a 30-second gulp.", icon: "puzzle-outline" },
            { title: "Short training sessions", text: "Practise a new trick for 5 – 10 minutes. Goldens love learning and praise.", icon: "school-outline" },
            { title: "Scent games", text: "Hide treats or a favourite toy and let Milo find them.", icon: "magnify" },
            { title: "Toy rotation", text: "Swap toys every few days so they always feel new.", icon: "tennis-ball" },
            { title: "Social time", text: "Meet friendly dogs and people regularly, and include Milo in family activities.", icon: "account-heart-outline" },
        ],
    },
    {
        type: "list",
        heading: "Signs of stress or boredom",
        tone: "warn",
        items: [
            { title: "Barking, whining or howling", text: "Especially when left alone or without any clear reason.", icon: "alert-outline" },
            { title: "Destructive chewing or digging", text: "Often a sign of pent-up energy or separation anxiety.", icon: "alert-outline" },
            { title: "Pacing or panting when not hot", text: "He may be restless or worried.", icon: "alert-outline" },
            { title: "Hiding or withdrawing", text: "A normally friendly Golden pulling away deserves attention.", icon: "alert-outline" },
            { title: "Change in appetite", text: "Eating much less or much more than usual.", icon: "alert-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "Build a calm routine",
        steps: [
            { tag: "Step 1", title: "Keep a steady schedule", text: "Feed, walk and play at similar times each day so Milo knows what to expect." },
            { tag: "Step 2", title: "Give him a safe spot", text: "A cosy bed or crate where he can rest without being disturbed." },
            { tag: "Step 3", title: "Practise short absences", text: "Leave for a few minutes and return calmly. Slowly increase the time." },
            { tag: "Step 4", title: "Reward calm behaviour", text: "Praise and treat quiet, relaxed moments, not just tricks." },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Goldens were bred to work closely with people, so they are usually happiest when they feel included. If stress signs last for weeks, talk to your vet or a certified trainer.",
    },
];

export default function MentalWellnessScreen() {
    return <KnowGuide title="Mental Wellness" chip="Mental Wellness" sections={SECTIONS} />;
}