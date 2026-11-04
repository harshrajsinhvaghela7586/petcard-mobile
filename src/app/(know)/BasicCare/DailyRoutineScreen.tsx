import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Create a daily schedule",
        body:
            "Dogs feel safest when they know what comes next. A steady routine for meals, walks, play and rest reduces anxiety and makes training and house manners easier.",
        facts: [
            { label: "Meals", value: "2 a day, same time", icon: "food-variant" },
            { label: "Walks", value: "2 – 3 a day", icon: "walk" },
            { label: "Training", value: "10 – 15 min", icon: "school-outline" },
            { label: "Sleep", value: "12 – 14 hours", icon: "sleep" },
        ],
    },
    {
        type: "timeline",
        heading: "A sample day",
        steps: [
            { tag: "7:00 AM", title: "Wake up", text: "Potty break and fresh water." },
            { tag: "7:30 AM", title: "Breakfast", text: "Followed by a calm 30 – 60 minute rest." },
            { tag: "8:30 AM", title: "Morning walk", text: "A good 30 minutes, with sniffing time." },
            { tag: "12:00 PM", title: "Potty & play", text: "A short game or training session." },
            { tag: "3:00 PM", title: "Rest & brain games", text: "A chew toy or puzzle feeder while you work or relax." },
            { tag: "5:30 PM", title: "Evening walk or fetch", text: "Burn off the day's energy." },
            { tag: "7:00 PM", title: "Dinner", text: "The second meal of the day." },
            { tag: "9:30 PM", title: "Last potty, then bed", text: "Wind down with cuddles or brushing." },
        ],
    },
    {
        type: "list",
        heading: "Daily care checklist",
        tone: "good",
        items: [
            { title: "Fresh water", text: "Clean the bowl and refill daily.", icon: "cup-water" },
            { title: "Balanced meals", text: "Measured portions at set times.", icon: "food-variant" },
            { title: "Exercise", text: "60 – 90 minutes of activity for an adult Golden.", icon: "run" },
            { title: "Potty breaks", text: "At least 3 – 5 times a day.", icon: "walk" },
            { title: "Quick body check", text: "Eyes, ears, paws and skin.", icon: "magnify" },
            { title: "Cuddle time", text: "Undivided attention matters just as much.", icon: "heart-outline" },
        ],
    },
    {
        type: "tip",
        title: "Make it a habit 📅",
        body: "Add Milo's meals, walks and medicines as tasks and let reminders help you keep the routine going, even on busy days.",
        action: { label: "Create a task", route: "/CreateTaskScreen" },
    },
];

export default function DailyRoutineScreen() {
    return <KnowGuide title="Daily Routine" chip="Daily Routine" sections={SECTIONS} />;
}