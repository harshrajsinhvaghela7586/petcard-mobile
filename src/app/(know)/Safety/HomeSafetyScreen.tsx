import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Pet-proof your home",
        body:
            "Dogs explore the world with their mouths, so anything within reach can become a chew toy. A quick walk-through of each room now can prevent an emergency later.",
        facts: [
            { label: "Cables", value: "Hide or cover", icon: "power-plug-outline" },
            { label: "Bins", value: "Closed lids", icon: "trash-can-outline" },
            { label: "Medicines", value: "Locked away", icon: "pill" },
            { label: "Plants", value: "Check if toxic", icon: "flower-outline" },
        ],
    },
    {
        type: "list",
        heading: "Room by room",
        tone: "warn",
        items: [
            { title: "Kitchen", text: "Use bins with lids, keep food off counters and store chocolate, onions and sweeteners in closed cupboards.", icon: "food-variant" },
            { title: "Living room", text: "Tuck away cables, and keep socks, small toys and remote batteries out of reach. They can cause choking or blockages.", icon: "sofa-outline" },
            { title: "Bathroom", text: "Close the toilet lid and store cleaners, razors and medicines in a cabinet Milo can't open.", icon: "shower-head" },
            { title: "Balcony & garden", text: "Secure railings and gates, and keep fertilisers, pesticides and slug pellets locked away.", icon: "fence" },
            { title: "Stairs", text: "Use a gate for puppies and older dogs to prevent falls.", icon: "stairs" },
        ],
    },
    {
        type: "list",
        heading: "Quick checklist",
        tone: "good",
        items: [
            { title: "ID tag and microchip", text: "Keep phone numbers up to date.", icon: "check-circle-outline" },
            { title: "Latched doors and gates", text: "Many dogs slip out in the seconds the door is open.", icon: "check-circle-outline" },
            { title: "Plenty of chew toys", text: "Gives him something safe to chew.", icon: "check-circle-outline" },
            { title: "A safe resting spot", text: "A quiet bed away from the hustle.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Be prepared 🚑",
        body: "Keep your vet's number and Milo's Emergency Card where everyone at home can find them quickly.",
        action: { label: "Open Emergency Card", route: "/PetEmergencyCardScreen" },
    },
];

export default function HomeSafetyScreen() {
    return <KnowGuide title="Home Safety" chip="Home Safety" sections={SECTIONS} />;
}