import KnowGuide, { Section } from "../../../components/KnowGuide";
import { PET } from "@/constants/pet";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Why regular check-ups matter",
        body:
            "Many health problems show no obvious signs until they are advanced. Regular vet visits catch issues early, keep vaccines and parasite protection up to date, and build a record of what is normal for Milo.",
        facts: [
            { label: "Adult dogs", value: "Once a year", icon: "calendar-check-outline" },
            { label: "Senior (7+)", value: "Every 6 months", icon: "clock-outline" },
            { label: "Next visit", value: "02 Jun 2025", icon: "calendar-clock" },
            { label: "Clinic", value: PET.vet.clinic, icon: "hospital-building" },
        ],
    },
    {
        type: "timeline",
        heading: "Check-ups through Milo's life",
        steps: [
            { tag: "8 – 16 weeks", title: "Puppy visits", text: "Every 3 – 4 weeks for vaccines, deworming and a growth check." },
            { tag: "6 months", title: "Growth & joint check", text: "Discuss neutering or spaying, diet changes and joint health." },
            { tag: "1 – 7 years", title: "Yearly wellness exam", text: "Full exam, boosters, parasite prevention and a dental check." },
            { tag: "7+ years", title: "Senior screening", text: "Twice a year, often with blood and urine tests to catch problems early." },
        ],
    },
    {
        type: "list",
        heading: "What a check-up covers",
        tone: "good",
        items: [
            { title: "Physical exam", text: "Weight, heart and lungs, joints, skin, coat, eyes and ears.", icon: "stethoscope" },
            { title: "Vaccines & boosters", text: "Reviewing what is due and updating Milo's records.", icon: "needle" },
            { title: "Parasite prevention", text: "Fleas, ticks, heartworm and regular deworming.", icon: "shield-check-outline" },
            { title: "Dental check", text: "Looking for plaque, tartar and gum disease.", icon: "tooth-outline" },
            { title: "Blood & urine tests", text: "Recommended for senior dogs or if your vet suspects a problem.", icon: "water-outline" },
            { title: "Diet & weight advice", text: "Portion sizes and the right food for his age and activity.", icon: "food-apple-outline" },
        ],
    },
    {
        type: "list",
        heading: "Before you go",
        tone: "warn",
        items: [
            { title: "Bring Milo's PetCard and records", text: "Vaccination history and past reports help the vet.", icon: "clipboard-check-outline" },
            { title: "Note any changes", text: "Appetite, energy, toileting, limping or behaviour. Jot them down so you don't forget.", icon: "pencil-outline" },
            { title: "List medicines & supplements", text: "Include doses and how long he has been taking them.", icon: "pill" },
            { title: "Ask about fasting", text: "Some blood tests need an empty stomach. Check with the clinic first.", icon: "clock-outline" },
            { title: "Keep him calm and safe", text: "Use a leash or carrier and bring a few treats.", icon: "paw" },
        ],
    },
    {
        type: "tip",
        title: "Stay on schedule 📅",
        body: "Log every visit in Milo's health records and add a reminder for the next one, so check-ups never slip by.",
        action: { label: "Open Health Records", route: "/HealthRecordsScreen" },
    },
];

export default function VetCheckupsScreen() {
    return <KnowGuide title="Vet Check-ups" chip="Vet Check-ups" sections={SECTIONS} />;
}