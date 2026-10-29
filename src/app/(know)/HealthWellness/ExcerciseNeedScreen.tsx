import KnowGuide, { Section } from "../../../components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "How much exercise does Milo need?",
        body:
            "Golden Retrievers were bred to retrieve all day, so they are energetic and love to work. A healthy adult needs about 60 – 90 minutes of activity every day, spread across walks, play and training.",
        facts: [
            { label: "Daily total", value: "60 – 90 minutes", icon: "clock-outline" },
            { label: "Walks", value: "2 – 3 per day", icon: "walk" },
            { label: "Play", value: "Fetch, tug & games", icon: "tennis-ball" },
            { label: "Swimming", value: "Great low-impact fun", icon: "swim" },
        ],
    },
    {
        type: "timeline",
        heading: "Exercise by life stage",
        steps: [
            { tag: "Puppy (2 – 6 months)", title: "Short & gentle", text: "About 5 minutes of structured exercise per month of age, twice a day, plus free play. Avoid forced running, long jumps and lots of stairs." },
            { tag: "Junior (6 – 18 months)", title: "Build stamina slowly", text: "Around 45 – 60 minutes a day. Skip long, hard runs until the growth plates close at roughly 12 – 18 months." },
            { tag: "Adult (1.5 – 7 years)", title: "Full energy", text: "60 – 90 minutes daily with a mix of walking, running, fetch and swimming." },
            { tag: "Senior (7+ years)", title: "Gentle & regular", text: "About 30 – 45 minutes in shorter outings. Swimming and slow walks protect stiff joints." },
        ],
    },
    {
        type: "list",
        heading: "Fun ways to keep Milo active",
        tone: "good",
        items: [
            { title: "Fetch & retrieve", text: "The classic Golden game. Use soft toys and a safe open space.", icon: "tennis-ball" },
            { title: "Swimming", text: "Easy on the joints and a great full-body workout. Rinse and dry his coat and ears afterwards.", icon: "swim" },
            { title: "Scent games", text: "Hide treats around the house or garden and let Milo sniff them out.", icon: "magnify" },
            { title: "Training sessions", text: "Short obedience or trick practice tires the mind and the body.", icon: "school-outline" },
            { title: "Easy trail walks", text: "New smells and surfaces keep walks exciting.", icon: "walk" },
        ],
    },
    {
        type: "list",
        heading: "Slow down if you notice",
        tone: "danger",
        items: [
            { title: "Heavy panting that doesn't settle", text: "Rest in a cool, shaded place and offer fresh water.", icon: "alert-circle-outline" },
            { title: "Limping or stiffness", text: "Stop the activity. If it lasts more than a day, see your vet.", icon: "alert-circle-outline" },
            { title: "Reluctance to move", text: "Lagging behind or lying down on walks can mean pain or tiredness.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Goldens have a thick double coat and overheat easily. In hot weather exercise early morning or evening, carry water, and never leave Milo in a parked car.",
    },
];

export default function ExerciseNeedsScreen() {
    return <KnowGuide title="Exercise Needs" chip="Exercise Needs" sections={SECTIONS} />;
}