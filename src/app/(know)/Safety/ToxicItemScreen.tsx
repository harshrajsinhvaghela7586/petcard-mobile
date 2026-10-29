import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Things to keep away",
        body:
            "Many everyday foods, plants and household items are poisonous to dogs. Keep them out of Milo's reach, and know what to do if he gets into something.",
        facts: [
            { label: "Call", value: "Your vet right away", icon: "phone" },
            { label: "Don't", value: "Make him vomit unless told", icon: "close-circle-outline" },
            { label: "Bring", value: "The packaging", icon: "package-variant-closed" },
            { label: "Act", value: "Fast, don't wait", icon: "timer-outline" },
        ],
    },
    {
        type: "list",
        heading: "Foods",
        tone: "danger",
        items: [
            { title: "Chocolate & cocoa", text: "Darker chocolate is more dangerous.", icon: "skull-outline" },
            { title: "Grapes & raisins", text: "Can cause kidney failure.", icon: "skull-outline" },
            { title: "Onion, garlic & chives", text: "Damage red blood cells.", icon: "skull-outline" },
            { title: "Xylitol", text: "Found in sugar-free gum, sweets and some peanut butters.", icon: "skull-outline" },
            { title: "Macadamia nuts", text: "Cause weakness, vomiting and tremors.", icon: "skull-outline" },
            { title: "Alcohol, caffeine & raw yeast dough", text: "All toxic, even in small amounts.", icon: "skull-outline" },
            { title: "Cooked bones & avocado stones", text: "Choking and blockage hazards.", icon: "bone" },
        ],
    },
    {
        type: "list",
        heading: "Around the house",
        tone: "warn",
        items: [
            { title: "Human medicines", text: "Painkillers like paracetamol and ibuprofen are dangerous for dogs.", icon: "pill" },
            { title: "Rodent poison & pesticides", text: "Keep them where Milo can never reach.", icon: "alert-outline" },
            { title: "Antifreeze & car fluids", text: "Sweet-tasting and extremely toxic.", icon: "alert-outline" },
            { title: "Cleaning products & bleach", text: "Store them behind closed doors.", icon: "spray-bottle" },
            { title: "Batteries & coins", text: "Can burn or poison, and cause blockages.", icon: "alert-outline" },
            { title: "Cigarettes & vapes", text: "Nicotine is highly toxic to dogs.", icon: "alert-outline" },
        ],
    },
    {
        type: "list",
        heading: "Plants",
        tone: "warn",
        items: [
            { title: "Sago palm", text: "Very dangerous. All parts are toxic, especially the seeds.", icon: "flower-outline" },
            { title: "Oleander", text: "Can seriously affect the heart.", icon: "flower-outline" },
            { title: "Azalea & rhododendron", text: "Cause vomiting, drooling and weakness.", icon: "flower-outline" },
            { title: "Tulip & daffodil bulbs", text: "The bulbs are the most toxic part.", icon: "flower-outline" },
            { title: "Lily of the valley", text: "Can cause heart rhythm problems.", icon: "flower-outline" },
        ],
    },
    {
        type: "tip",
        title: "If you suspect poisoning 🚨",
        body: "Call your vet or the nearest emergency clinic immediately. Tell them what Milo ate, how much and when. Keep the packaging, and don't wait for symptoms to appear.",
        action: { label: "Open Emergency Card", route: "/PetEmergencyCardScreen" },
    },
];

export default function ToxicItemsScreen() {
    return <KnowGuide title="Toxic Items" chip="Toxic Items" sections={SECTIONS} />;
}