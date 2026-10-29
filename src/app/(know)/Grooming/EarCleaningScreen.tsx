import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Clean ears safely",
        body:
            "Milo's floppy ears trap warmth and moisture, which makes ear infections common in Goldens. A quick weekly check and regular cleaning keeps them healthy.",
        facts: [
            { label: "Check", value: "Once a week", icon: "magnify" },
            { label: "Clean", value: "Every 1 – 2 weeks", icon: "calendar-check-outline" },
            { label: "Use", value: "Vet-approved cleaner", icon: "bottle-tonic-outline" },
            { label: "Never", value: "Cotton buds deep inside", icon: "close-circle-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "How to clean",
        steps: [
            { tag: "Step 1", title: "Have a look first", text: "Healthy ears are light pink with little or no smell." },
            { tag: "Step 2", title: "Fill the canal", text: "Hold the ear flap up and squeeze in enough cleaner to fill the canal." },
            { tag: "Step 3", title: "Massage the base", text: "Rub the base of the ear for 20 – 30 seconds. You should hear a squishing sound." },
            { tag: "Step 4", title: "Let him shake", text: "Step back. Shaking brings the loosened dirt up." },
            { tag: "Step 5", title: "Wipe and reward", text: "Wipe the visible part of the ear with cotton or gauze, dry it, and give a treat." },
        ],
    },
    {
        type: "list",
        heading: "See your vet if you notice",
        tone: "danger",
        items: [
            { title: "Strong smell", text: "A sour or yeasty odour often means infection.", icon: "alert-circle-outline" },
            { title: "Redness or swelling", text: "The ear flap or canal looks inflamed.", icon: "alert-circle-outline" },
            { title: "Dark or yellow discharge", text: "Brown, black or pus-like gunk.", icon: "alert-circle-outline" },
            { title: "Head shaking or scratching", text: "Especially if Milo tilts his head or whines.", icon: "alert-circle-outline" },
            { title: "Pain when touched", text: "Pulling away or yelping when you touch his ear.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "After water play 💡",
        body: "Dry Milo's ears gently after baths and swimming. Moisture left behind is the most common cause of infections.",
    },
];

export default function EarCleaningScreen() {
    return <KnowGuide title="Ear Cleaning" chip="Ear Cleaning" sections={SECTIONS} />;
}