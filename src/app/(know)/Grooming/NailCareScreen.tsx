import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Keep those nails trimmed",
        body:
            "Long nails can be painful, change how Milo walks and even hurt his joints over time. Most dogs need a trim every 3 – 4 weeks.",
        facts: [
            { label: "How often", value: "Every 3 – 4 weeks", icon: "calendar-check-outline" },
            { label: "Sound test", value: "Clicking on the floor = too long", icon: "volume-high" },
            { label: "Tools", value: "Clippers or a grinder", icon: "content-cut" },
            { label: "Don't forget", value: "Dewclaws", icon: "paw" },
        ],
    },
    {
        type: "timeline",
        heading: "How to trim",
        steps: [
            { tag: "Step 1", title: "Get him comfortable", text: "Touch and hold his paws every day with treats, so trimming isn't scary." },
            { tag: "Step 2", title: "Hold the paw gently", text: "Keep it steady and press softly on the pad to extend the nail." },
            { tag: "Step 3", title: "Trim a little at a time", text: "Clip small bits at an angle. On light nails stay clear of the pink quick. On dark nails, trim thin slices until you see a dark dot in the centre." },
            { tag: "Step 4", title: "Smooth the edges", text: "File or grind sharp edges so they don't scratch." },
            { tag: "Step 5", title: "Reward", text: "Praise and a treat after every paw, even if you only do one at a time." },
        ],
    },
    {
        type: "list",
        heading: "If you cut the quick",
        tone: "warn",
        intro: "It happens to everyone. Stay calm, because Milo will copy your mood.",
        items: [
            { title: "Press styptic powder or cornstarch", text: "Apply to the nail tip and hold with gentle pressure.", icon: "check-circle-outline" },
            { title: "Wait a few minutes", text: "Bleeding usually stops quickly.", icon: "clock-outline" },
            { title: "Call your vet", text: "If it keeps bleeding for more than 10 minutes or the nail looks torn.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Not comfortable doing it? 💡",
        body: "There's no shame in asking a groomer or vet to do it. A quick trim every few weeks is better than overgrown nails.",
    },
];

export default function NailCareScreen() {
    return <KnowGuide title="Nail Care" chip="Nail Care" sections={SECTIONS} />;
}