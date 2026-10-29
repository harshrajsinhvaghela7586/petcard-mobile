import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Make training fun!",
        body:
            "Games turn training into play. They build skills, burn energy and strengthen your bond with Milo, so he'll look forward to every session.",
        facts: [
            { label: "Game length", value: "5 – 15 minutes", icon: "timer-outline" },
            { label: "Best time", value: "Before meals", icon: "clock-outline" },
            { label: "Rewards", value: "Small treats & praise", icon: "cookie-outline" },
            { label: "Stop when", value: "The fun fades", icon: "emoticon-happy-outline" },
        ],
    },
    {
        type: "list",
        heading: "Games to play",
        tone: "good",
        items: [
            { title: "Fetch with \"Drop it\"", text: "Trade the ball for a treat so he learns to let go happily.", icon: "tennis-ball" },
            { title: "Hide & seek", text: "Hide and call his name. A great way to practise coming when called.", icon: "eye-off-outline" },
            { title: "Find the treat", text: "Hide treats around the room and let his nose do the work.", icon: "magnify" },
            { title: "Tug with rules", text: "Start and stop on cue, and ask him to \"Drop it\" before play resumes.", icon: "rope" },
            { title: "Mini obstacle course", text: "Walk him over cushions, through hoops or under a chair.", icon: "run" },
            { title: "Trick time", text: "Teach spin, paw and roll over. Short tricks are great for confidence.", icon: "star-outline" },
        ],
    },
    {
        type: "list",
        heading: "Keep it safe",
        tone: "warn",
        items: [
            { title: "Non-slip floors", text: "Slippery surfaces are hard on growing and ageing joints.", icon: "alert-outline" },
            { title: "No high jumps for young dogs", text: "Wait until his growth plates close at 12 – 18 months.", icon: "alert-outline" },
            { title: "Watch for tiredness", text: "Stop if he's panting heavily, limping or losing interest.", icon: "alert-outline" },
            { title: "Supervise toys", text: "Remove pieces that come loose so they can't be swallowed.", icon: "alert-outline" },
        ],
    },
    {
        type: "tip",
        title: "Did You Know? 💡",
        body: "Sniffing games are surprisingly tiring. Ten minutes of nose work can tire a dog as much as a long walk.",
    },
];

export default function FunGamesScreen() {
    return <KnowGuide title="Fun Games" chip="Fun Games" sections={SECTIONS} />;
}