import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "How much & how often",
        body:
            "Most adult Goldens do well on two meals a day. The right portion depends on Milo's weight, age and activity, so start with the feeding guide on his food pack and adjust with your vet.",
        facts: [
            { label: "Adult", value: "2 meals a day", icon: "clock-outline" },
            { label: "Puppy", value: "3 – 4 meals a day", icon: "calendar-check-outline" },
            { label: "Senior", value: "2 smaller meals", icon: "food-apple-outline" },
            { label: "Gap", value: "10 – 12 hours apart", icon: "timer-outline" },
        ],
    },
    {
        type: "timeline",
        heading: "A sample day",
        steps: [
            { tag: "7:00 – 8:00 AM", title: "Breakfast", text: "Half of the daily portion plus fresh water. Wait 30 – 60 minutes before hard exercise." },
            { tag: "12:00 PM", title: "Water & light training", text: "Refill water. Any training treats count towards the daily total." },
            { tag: "6:00 – 7:00 PM", title: "Dinner", text: "The other half of the portion, at a calm pace." },
            { tag: "9:00 PM", title: "Last potty break", text: "Avoid big meals right before bed." },
        ],
    },
    {
        type: "list",
        heading: "Feeding tips",
        tone: "good",
        items: [
            { title: "Measure every meal", text: "Use a cup or kitchen scale. Eyeballing is the easiest way to overfeed.", icon: "scale-bathroom" },
            { title: "Keep the same times", text: "A steady routine helps digestion and toilet habits.", icon: "clock-outline" },
            { title: "Don't free-feed", text: "Leaving food out all day makes it hard to track how much Milo eats.", icon: "close-circle-outline" },
            { title: "Rest after meals", text: "Deep-chested breeds like Goldens can get bloat. Keep play calm for about an hour after eating.", icon: "alert-outline" },
            { title: "Treats under 10%", text: "Treats and chews should be no more than a tenth of his daily calories.", icon: "cookie-outline" },
        ],
    },
    {
        type: "tip",
        title: "Track Milo's meals 🍽️",
        body: "Log what Milo eats so you can see portions at a glance and spot changes in appetite early.",
        action: { label: "Open Food tracker", route: "/FoodScreen" },
    },
];

export default function FeedingScheduleScreen() {
    return <KnowGuide title="Feeding Schedule" chip="Feeding Schedule" sections={SECTIONS} />;
}