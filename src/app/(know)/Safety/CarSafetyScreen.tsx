import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Travel safe with Milo",
        body:
            "An unrestrained dog can be injured in a sudden stop and can distract the driver. A little preparation makes every trip safer and calmer for everyone.",
        facts: [
            { label: "Restraint", value: "Crash-tested harness or crate", icon: "seatbelt" },
            { label: "Seat", value: "Back seat", icon: "car" },
            { label: "Windows", value: "Head stays inside", icon: "window-closed-variant" },
            { label: "Breaks", value: "Every 2 hours", icon: "timer-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "Before you set off",
        steps: [
            { tag: "Practise", title: "Start with short drives", text: "Make the car a happy place with treats and a trip to somewhere fun." },
            { tag: "Prepare", title: "Exercise and potty first", text: "A tired dog who has been to the toilet settles much better." },
            { tag: "Feed light", title: "Small meal 2 – 3 hours before", text: "A full stomach can cause motion sickness." },
            { tag: "Secure", title: "Harness or crate", text: "Use a crash-tested harness clipped to a seat belt, or a well-secured crate." },
            { tag: "Pack", title: "Travel kit", text: "Water and bowl, leash, poop bags, towel, treats and Milo's PetCard." },
        ],
    },
    {
        type: "list",
        heading: "Never",
        tone: "danger",
        items: [
            { title: "Leave Milo in a parked car", text: "Even with windows open, temperatures can become deadly within minutes.", icon: "alert-circle-outline" },
            { title: "Let him ride with his head out", text: "Dust and debris can hurt his eyes, ears and nose.", icon: "alert-circle-outline" },
            { title: "Hold him on your lap", text: "It's unsafe for both of you, and can make you lose control.", icon: "alert-circle-outline" },
            { title: "Put him in the front seat", text: "Airbags can seriously injure a dog.", icon: "alert-circle-outline" },
            { title: "Travel in an open truck bed", text: "Unrestrained dogs can fall or be thrown out.", icon: "alert-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Motion sickness? 💡",
        body: "Drooling, yawning, whining and vomiting are common signs. Try shorter trips, fresh air and a light meal. If it continues, ask your vet about help.",
    },
];

export default function CarSafetyScreen() {
    return <KnowGuide title="Car Safety" chip="Car Safety" sections={SECTIONS} />;
}