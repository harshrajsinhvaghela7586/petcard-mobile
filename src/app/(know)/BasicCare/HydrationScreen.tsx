import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Water intake guide",
        body:
            "Water is essential for digestion, temperature control and healthy organs. As a rough guide, dogs drink about 50 – 60 ml of water per kg of body weight a day, and more when it's hot, when they're active or when they eat dry food.",
        facts: [
            { label: "Rule of thumb", value: "50 – 60 ml per kg a day", icon: "water-outline" },
            { label: "Drinks more when", value: "Hot or very active", icon: "weather-sunny" },
            { label: "Bowl", value: "Washed & refilled daily", icon: "cup-water" },
            { label: "Outdoors", value: "Carry water", icon: "walk" },
        ],
    },
    {
        type: "list",
        heading: "Keep Milo hydrated",
        tone: "good",
        items: [
            { title: "Place water in more than one spot", text: "Make it easy to find at home and in the garden.", icon: "check-circle-outline" },
            { title: "Use a clean bowl", text: "Stainless steel or ceramic bowls are easy to keep clean.", icon: "check-circle-outline" },
            { title: "Try a pet fountain", text: "Moving water encourages some dogs to drink more.", icon: "check-circle-outline" },
            { title: "Add water to meals", text: "Mix a little water or wet food into his kibble.", icon: "check-circle-outline" },
            { title: "Offer ice cubes", text: "A fun way to cool him down in summer.", icon: "snowflake" },
            { title: "Take water on walks", text: "Offer a drink during and after exercise.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Signs of dehydration",
        tone: "danger",
        items: [
            { title: "Dry, sticky gums", text: "They should feel moist.", icon: "alert-circle-outline" },
            { title: "Loss of skin elasticity", text: "When you gently lift the skin on his back, it should snap back quickly.", icon: "alert-circle-outline" },
            { title: "Sunken eyes & tiredness", text: "He may seem weak or low on energy.", icon: "alert-circle-outline" },
            { title: "Thick saliva & heavy panting", text: "Especially when he hasn't been exercising.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Watch out for sudden changes 💧",
        body: "Drinking much more or much less than usual can be a sign of illness, such as diabetes or kidney problems. Tell your vet if you notice a change.",
        action: { label: "Open Water tracker", route: "/WaterScreen" },
    },
];

export default function HydrationScreen() {
    return <KnowGuide title="Hydration" chip="Hydration" sections={SECTIONS} />;
}