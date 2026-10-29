import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "How much sleep does Milo need?",
        body:
            "Dogs sleep far more than people. Rest helps Milo's body repair, his brain process the day and his mood stay balanced. Needs change with age and activity.",
        facts: [
            { label: "Adult", value: "12 – 14 hours", icon: "sleep" },
            { label: "Puppy", value: "18 – 20 hours", icon: "bed-outline" },
            { label: "Senior", value: "14 – 18 hours", icon: "bed" },
            { label: "Best spot", value: "Quiet, dim & cosy", icon: "home-outline" },
        ],
    },
    {
        type: "list",
        heading: "Create a great sleep space",
        tone: "good",
        items: [
            { title: "Supportive bed", text: "An orthopaedic bed is great for a breed prone to joint problems.", icon: "bed-outline" },
            { title: "Quiet corner", text: "Away from doors, the TV and heavy footfall.", icon: "home-outline" },
            { title: "Comfortable temperature", text: "Goldens overheat easily, so keep the spot cool in summer.", icon: "thermometer" },
            { title: "Regular bedtime", text: "Winding down at the same time each night helps him settle.", icon: "clock-outline" },
            { title: "Cosy crate (if he likes it)", text: "A blanket and a favourite toy make it a safe den.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Sleep red flags",
        tone: "warn",
        items: [
            { title: "Can't settle or keeps pacing", text: "May point to pain, anxiety or needing the toilet.", icon: "alert-outline" },
            { title: "Sleeping far more than usual", text: "Along with low energy or appetite loss, see your vet.", icon: "alert-outline" },
            { title: "New loud snoring or laboured breathing", text: "Needs a check-up.", icon: "alert-outline" },
            { title: "Panting or whining at night", text: "Can signal discomfort or stress.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Twitching, paddling paws and soft barks during sleep are normal. Milo is probably dreaming! It's best not to wake a dog during deep sleep.",
    },
];

export default function SleepRestScreen() {
    return <KnowGuide title="Sleep & Rest" chip="Sleep & Rest" sections={SECTIONS} />;
}