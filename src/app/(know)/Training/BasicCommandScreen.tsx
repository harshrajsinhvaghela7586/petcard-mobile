import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Sit, stay, come & more",
        body:
            "Golden Retrievers are eager to please and learn quickly. Positive training with treats and praise builds trust, and a few short sessions a day work far better than one long one.",
        facts: [
            { label: "Session", value: "5 – 10 minutes", icon: "timer-outline" },
            { label: "Frequency", value: "2 – 3 times a day", icon: "calendar-check-outline" },
            { label: "Rewards", value: "Treats & praise", icon: "cookie-outline" },
            { label: "Start in", value: "A quiet place", icon: "home-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "The core commands",
        steps: [
            { tag: "Sit", title: "Treat over the nose", text: "Hold a treat just above Milo's nose and move it back over his head. His bottom lowers, so say \"Sit\" and reward." },
            { tag: "Down", title: "From sit to floor", text: "With Milo sitting, lower a treat to the floor between his paws. When he lies down, say \"Down\" and reward." },
            { tag: "Stay", title: "Build duration slowly", text: "Ask for a sit, show your palm and say \"Stay\". Take one step back, return and reward. Add distance and time bit by bit." },
            { tag: "Come", title: "Make it the best word", text: "Say his name and \"Come\" in a happy voice and reward generously. Never scold him when he comes to you." },
            { tag: "Leave it", title: "Look away = reward", text: "Hold a treat in your closed fist. When Milo stops trying to get it and looks away, say \"Leave it\" and reward from the other hand." },
        ],
    },
    {
        type: "list",
        heading: "Training rules",
        tone: "good",
        items: [
            { title: "Reward within 2 seconds", text: "Dogs link the reward with whatever they just did.", icon: "timer-outline" },
            { title: "One cue, one word", text: "Use the same word every time and avoid repeating it.", icon: "check-circle-outline" },
            { title: "Keep it happy", text: "Calm, upbeat energy makes learning easier.", icon: "check-circle-outline" },
            { title: "End on a win", text: "Finish with something Milo does well, then play.", icon: "check-circle-outline" },
            { title: "Practise in new places", text: "Move on to the garden, the park and then busier areas.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Goldens love working with their person, so training doubles as quality time. If Milo seems bored or distracted, shorten the session and make the rewards more exciting.",
    },
];

export default function BasicCommandsScreen() {
    return <KnowGuide title="Basic Commands" chip="Basic Commands" sections={SECTIONS} />;
}