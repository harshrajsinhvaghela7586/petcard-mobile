import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Walks & outdoor tips",
        body:
            "Walks and outdoor adventures are the best part of Milo's day. A few simple habits keep them safe and make sure he can always find his way home.",
        facts: [
            { label: "ID", value: "Tag + microchip", icon: "card-account-details-outline" },
            { label: "Leash", value: "Always in public", icon: "dog-service" },
            { label: "Water", value: "Carry on walks", icon: "cup-water" },
            { label: "Paws", value: "Check after walks", icon: "paw" },
        ],
    },
    {
        type: "list",
        heading: "Walk safety",
        tone: "good",
        items: [
            { title: "ID tag with your phone number", text: "And keep his microchip details up to date.", icon: "check-circle-outline" },
            { title: "Leash in busy places", text: "Even well-trained dogs can bolt when startled.", icon: "check-circle-outline" },
            { title: "Ask before dogs say hello", text: "Not every dog is friendly. Check with the other owner first.", icon: "check-circle-outline" },
            { title: "Pack water and bags", text: "Offer water regularly, especially in warm weather.", icon: "check-circle-outline" },
            { title: "Choose cool hours", text: "Early morning and evening are kinder on his thick coat.", icon: "check-circle-outline" },
            { title: "Check him after walks", text: "Look for ticks, burrs, cuts and sore paws.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Watch out for",
        tone: "warn",
        items: [
            { title: "Hot pavement", text: "Press the back of your hand on it for 5 seconds. If it's too hot for you, it's too hot for his paws.", icon: "alert-outline" },
            { title: "Stagnant water & puddles", text: "Can carry bacteria such as leptospirosis, or harmful algae.", icon: "alert-outline" },
            { title: "Other dogs and strays", text: "Keep a safe distance from unfamiliar or unvaccinated dogs.", icon: "alert-outline" },
            { title: "Litter and poison baits", text: "Don't let him eat things off the ground.", icon: "alert-outline" },
            { title: "Traffic", text: "Keep Milo on the side away from the road.", icon: "alert-outline" },
            { title: "Strong currents", text: "Goldens love swimming, but rivers and the sea can be dangerous.", icon: "swim" },
        ],
    },
    {
        type: "tip",
        title: "If Milo gets lost 🔎",
        body: "Search nearby, tell neighbours and share his details quickly. His Digital PetCard has everything someone needs to contact you.",
        action: { label: "Open Digital PetCard", route: "/DigitalPetCardScreen" },
    },
];

export default function OutdoorSafetyScreen() {
    return <KnowGuide title="Outdoor Safety" chip="Outdoor Safety" sections={SECTIONS} />;
}