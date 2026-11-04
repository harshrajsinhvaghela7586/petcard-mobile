import KnowGuide, { Section } from "@/components/KnowGuide";

/*
 * Server se breed-wise guide aata hai (page key "breed_information", title se banti hai).
 * Neeche ka text sirf fallback hai, jab server guide na de.
 */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Know Milo's breed",
        body:
            "Every pet is different. Breed, age, weight, health and personality all shape what Milo needs, so use this as a general guide.",
        facts: [
            { label: "Origin", value: "Varies by breed", icon: "crown-outline" },
            { label: "Size", value: "Breed dependent", icon: "paw" },
            { label: "Lifespan", value: "Breed dependent", icon: "clock-outline" },
            { label: "Temperament", value: "Varies by individual", icon: "emoticon-happy-outline" },
        ],
    },
    {
        type: "list",
        heading: "Common health concerns",
        tone: "warn",
        intro: "Good to know about, not a guarantee. Ask your vet which check-ups suit this pet.",
        items: [
            { title: "Dental disease", text: "Tartar and gum problems are very common. Ask the vet to check the teeth.", icon: "tooth-outline" },
            { title: "Obesity", text: "Extra weight strains joints and the heart. Measure meals and keep treats small.", icon: "scale-bathroom" },
            { title: "Skin and ear infections", text: "Itching, redness, smell or head shaking need a vet check.", icon: "ear-hearing" },
            { title: "Parasites", text: "Fleas, ticks and worms need regular prevention. Ask the vet for a plan.", icon: "bug-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Breed is only one part of Milo's needs. Age, weight, health and personality matter too.",
    },
];

export default function BreedInformationScreen() {
    return <KnowGuide title="Breed Information" chip="Breed Information" sections={SECTIONS} />;
}