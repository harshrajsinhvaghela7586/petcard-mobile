import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Hot, cold & rainy care",
        body:
            "Milo's thick double coat handles cold better than heat. Adjust his walks, water and rest to the weather to keep him comfortable all year.",
        facts: [
            { label: "Hot days", value: "Avoid 11 AM – 4 PM", icon: "weather-sunny" },
            { label: "Cold days", value: "Dry off after outings", icon: "snowflake" },
            { label: "Rainy days", value: "Dry paws & coat", icon: "weather-rainy" },
            { label: "Humid days", value: "Panting cools less", icon: "water-outline" },
        ],
    },
    {
        type: "list",
        heading: "Hot weather",
        tone: "danger",
        items: [
            { title: "Walk early or late", text: "Avoid the midday sun and hot pavement.", icon: "weather-sunny" },
            { title: "Shade and fresh water", text: "Always available, indoors and out.", icon: "cup-water" },
            { title: "Never in a parked car", text: "It can turn deadly within minutes.", icon: "car" },
            { title: "Know the signs of heatstroke", text: "Heavy panting, drooling, bright red gums, weakness or collapse. Cool him with lukewarm water and go straight to a vet.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "list",
        heading: "Cold weather",
        tone: "good",
        items: [
            { title: "Keep outings shorter in extreme cold", text: "Watch for shivering or lifting paws.", icon: "snowflake" },
            { title: "Dry him after walks", text: "A wet coat loses heat quickly.", icon: "check-circle-outline" },
            { title: "Wipe his paws", text: "Removes ice, salt and chemicals that irritate skin.", icon: "check-circle-outline" },
            { title: "Warm, draught-free bed", text: "Raised slightly off a cold floor.", icon: "bed-outline" },
        ],
    },
    {
        type: "list",
        heading: "Rainy & monsoon season",
        tone: "warn",
        items: [
            { title: "Dry fully", text: "A damp undercoat can lead to fungus and hot spots. Check between toes and ears.", icon: "alert-outline" },
            { title: "More ticks and fleas", text: "Keep his parasite prevention up to date.", icon: "alert-outline" },
            { title: "Avoid puddles and floodwater", text: "They can carry bacteria such as leptospirosis. Ask your vet about vaccination.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Dogs cool down mostly by panting and through their paws, so in humid weather they overheat faster than you think. When in doubt, keep Milo indoors with a fan or AC.",
    },
];

export default function WeatherSafetyScreen() {
    return <KnowGuide title="Weather Safety" chip="Weather Safety" sections={SECTIONS} />;
}