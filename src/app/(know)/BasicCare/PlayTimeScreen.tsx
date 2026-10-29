import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Importance of play",
        body:
            "Play isn't just fun. It burns energy, builds muscles, exercises the brain and strengthens the bond between you and Milo. A well-played dog is calmer and better behaved.",
        facts: [
            { label: "Daily play", value: "30 – 60 minutes", icon: "clock-outline" },
            { label: "Types", value: "Fetch, tug & puzzles", icon: "tennis-ball" },
            { label: "Mix", value: "Active + calm play", icon: "puzzle-outline" },
            { label: "Always", value: "Supervise", icon: "eye-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "A playtime routine",
        steps: [
            { tag: "Warm-up", title: "5-minute walk", text: "Gets muscles ready before running and jumping." },
            { tag: "Active play", title: "10 – 15 minutes", text: "Fetch, chase or tug. This is where he burns energy." },
            { tag: "Brain game", title: "5 – 10 minutes", text: "A puzzle toy or find-the-treat game." },
            { tag: "Cool-down", title: "Calm time", text: "Cuddles, fresh water and a rest." },
        ],
    },
    {
        type: "list",
        heading: "Play ideas",
        tone: "good",
        items: [
            { title: "Fetch", text: "A Golden classic. Use balls or soft toys.", icon: "tennis-ball" },
            { title: "Tug with rules", text: "Start and stop on cue to keep it fun and safe.", icon: "rope" },
            { title: "Hide & seek", text: "Hide behind a door and call his name.", icon: "eye-off-outline" },
            { title: "Water play", text: "Sprinklers, kiddie pools or safe swimming spots.", icon: "swim" },
            { title: "Puzzle toys", text: "Treat-dispensing toys keep him busy for ages.", icon: "puzzle-outline" },
            { title: "Playdates", text: "Meet friendly, vaccinated dogs.", icon: "paw" },
        ],
    },
    {
        type: "list",
        heading: "Play safety",
        tone: "warn",
        items: [
            { title: "Choose the right size", text: "Toys that are too small can be swallowed.", icon: "alert-outline" },
            { title: "Skip sticks", text: "They can splinter and injure his mouth or throat.", icon: "alert-outline" },
            { title: "Check toys for wear", text: "Throw away anything torn or crumbling.", icon: "alert-outline" },
            { title: "Rest after meals", text: "Hold off on vigorous play for about an hour after eating.", icon: "alert-outline" },
            { title: "Stop if he limps or pants heavily", text: "Give him a break and fresh water.", icon: "alert-outline" },
        ],
    },
];

export default function PlaytimeScreen() {
    return <KnowGuide title="Playtime" chip="Playtime" sections={SECTIONS} />;
}