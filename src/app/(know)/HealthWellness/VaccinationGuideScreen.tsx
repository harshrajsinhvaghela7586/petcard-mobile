import KnowGuide, { Section } from "../../../components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Why vaccines matter",
        body:
            "Vaccines protect Milo from serious and sometimes deadly diseases. Puppies need a series of shots, and adult dogs need boosters to keep their protection strong.",
        facts: [
            { label: "Core vaccines", value: "DHPP & Rabies", icon: "needle" },
            { label: "Puppy series", value: "6 – 16 weeks", icon: "shield-check-outline" },
            { label: "Boosters", value: "Every 1 – 3 years", icon: "calendar-check-outline" },
            { label: "Records", value: "Keep the card handy", icon: "clipboard-check-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "Typical vaccination schedule",
        intro: "Your vet may adjust this based on Milo's health and where you live.",
        steps: [
            { tag: "6 – 8 weeks", title: "DHPP (1st dose)", text: "Protects against distemper, hepatitis, parvovirus and parainfluenza." },
            { tag: "10 – 12 weeks", title: "DHPP (2nd dose)", text: "Optional vaccines such as Leptospirosis or Bordetella can start here." },
            { tag: "14 – 16 weeks", title: "DHPP (3rd dose) + Rabies", text: "Rabies is given from about 12 weeks, as per local law." },
            { tag: "12 – 16 months", title: "First boosters", text: "DHPP and Rabies boosters complete the puppy course." },
            { tag: "Adult", title: "Regular boosters", text: "DHPP every 1 – 3 years as your vet advises. Rabies as per local rules, often yearly." },
        ],
    },
    {
        type: "list",
        heading: "Core vs optional",
        tone: "good",
        items: [
            { title: "DHPP (core)", text: "Distemper, Hepatitis, Parvovirus and Parainfluenza. Recommended for every dog.", icon: "shield-check-outline" },
            { title: "Rabies (core)", text: "Protects Milo and your family, and is legally required in many places.", icon: "shield-check-outline" },
            { title: "Bordetella (optional)", text: "Helps prevent kennel cough. Useful if Milo visits groomers, daycare or boarding.", icon: "needle" },
            { title: "Leptospirosis (optional)", text: "Spread through contaminated water and rodents. Worth asking about in rainy seasons.", icon: "needle" },
            { title: "Canine Influenza (optional)", text: "Suggested for dogs who mix often with other dogs.", icon: "needle" },
        ],
    },
    {
        type: "list",
        heading: "After the vaccine",
        tone: "warn",
        intro: "Most dogs feel fine. Mild side effects usually pass within a day or two.",
        items: [
            { title: "Normal", text: "Slight tiredness, lower appetite or a small tender lump where the shot was given.", icon: "check-circle-outline" },
            { title: "Call your vet if you see", text: "Facial swelling, hives, repeated vomiting, difficulty breathing or collapse. These are rare but need quick care.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Milo's next vaccine 💉",
        body: "Milo's DHPP booster is due on 25 May 2026. Check his vaccination records and set a reminder so it's never missed.",
        action: { label: "Open Health Records", route: "/HealthRecordsScreen" },
    },
];

export default function VaccinationGuideScreen() {
    return <KnowGuide title="Vaccination Guide" chip="Vaccination Guide" sections={SECTIONS} />;
}