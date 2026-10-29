import KnowGuide, { Section } from "../../../components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Spot illness early",
        body:
            "Dogs instinctively hide pain, so small changes are often the first clue that something is wrong. You know Milo best. If he just doesn't seem like himself, trust your instinct and check in with your vet.",
        facts: [
            { label: "Appetite", value: "Sudden change", icon: "food-apple-outline" },
            { label: "Energy", value: "Unusual tiredness", icon: "sleep" },
            { label: "Bathroom", value: "Diarrhea or straining", icon: "water-outline" },
            { label: "Behaviour", value: "Hiding or irritability", icon: "emoticon-sad-outline" },
        ],
    },
    {
        type: "list",
        heading: "See your vet soon if",
        tone: "warn",
        items: [
            { title: "Not eating for 24 hours", text: "Or a sudden big change in how much he eats or drinks.", icon: "food-apple-outline" },
            { title: "Vomiting or diarrhea", text: "Lasting more than a day, or with blood.", icon: "water-outline" },
            { title: "Limping or stiffness", text: "Lasting more than a day or getting worse.", icon: "bone" },
            { title: "Itching, redness or hair loss", text: "Constant scratching, sore patches or a bad skin smell.", icon: "alert-outline" },
            { title: "Head shaking or ear odour", text: "May point to an ear infection.", icon: "ear-hearing" },
            { title: "Cloudy eyes or discharge", text: "Squinting, redness or bumping into things.", icon: "eye-outline" },
            { title: "Bad breath, drooling or bleeding gums", text: "Often a dental problem.", icon: "tooth-outline" },
            { title: "New lump or weight change", text: "Any new or growing lump, or unexplained weight loss or gain.", icon: "scale-bathroom" },
        ],
    },
    {
        type: "list",
        heading: "Emergency: go to the vet right away",
        tone: "danger",
        items: [
            { title: "Difficulty breathing", text: "Laboured breathing, or pale or blue gums." },
            { title: "Collapse or seizure", text: "Sudden weakness, fainting or fits." },
            { title: "Bloated, hard belly", text: "With unproductive retching or restlessness. Deep-chested breeds like Goldens can get life-threatening bloat." },
            { title: "Poison or toxin", text: "Chocolate, grapes or raisins, xylitol, human medicines or rat poison." },
            { title: "Heavy bleeding or injury", text: "Road accidents, deep wounds or a suspected broken bone." },
            { title: "Heatstroke", text: "Heavy panting, drooling, weakness or a very hot body. Cool him gently and head to the vet." },
        ],
    },
    {
        type: "about",
        heading: "Know Milo's normal",
        body: "Check these while Milo is relaxed so you know his baseline. Changes from normal are easier to notice.",
        facts: [
            { label: "Temperature", value: "38.1 – 39.2 °C", icon: "thermometer" },
            { label: "Resting breathing", value: "15 – 30 per minute", icon: "heart-pulse" },
            { label: "Heart rate", value: "60 – 140 bpm", icon: "heart-pulse" },
            { label: "Gums", value: "Pink and moist", icon: "tooth-outline" },
        ],
    },
    {
        type: "tip",
        title: "Keep Milo's emergency info ready 🚑",
        body: "Save your vet's number and keep Milo's Emergency Card handy so anyone caring for him can act fast.",
        action: { label: "Open Emergency Card", route: "/PetEmergencyCardScreen" },
    },
];

export default function SignsToWatchScreen() {
    return <KnowGuide title="Signs to Watch" chip="Signs to Watch" sections={SECTIONS} />;
}