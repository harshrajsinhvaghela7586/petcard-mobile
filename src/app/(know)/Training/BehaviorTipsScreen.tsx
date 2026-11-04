import KnowGuide, { Section } from "@/components/KnowGuide";

/* Yaha se content change kar sakte ho */
const SECTIONS: Section[] = [
    {
        type: "about",
        heading: "Solve common behaviours",
        body:
            "Most behaviour problems come from boredom, too much energy or simply not knowing what is expected. Meeting Milo's needs and rewarding what you like works better than punishing what you don't.",
        facts: [
            { label: "Common cause", value: "Boredom or extra energy", icon: "emoticon-sad-outline" },
            { label: "First fix", value: "Exercise + training", icon: "run" },
            { label: "Method", value: "Reward good, redirect bad", icon: "star-outline" },
            { label: "Timeline", value: "Weeks, not days", icon: "calendar-clock" },
        ],
    },
    {
        type: "list",
        heading: "Common problems & what to try",
        tone: "warn",
        items: [
            { title: "Jumping on people", text: "Turn away and ignore him until all four paws are on the floor, then reward. Ask visitors to do the same.", icon: "alert-outline" },
            { title: "Mouthing & nipping", text: "Goldens are mouthy. Offer a toy instead and pause play when teeth touch skin.", icon: "alert-outline" },
            { title: "Excessive barking", text: "Find the trigger, teach a \"Quiet\" cue and reward silence. Shouting only joins in.", icon: "alert-outline" },
            { title: "Chewing furniture", text: "Provide plenty of chew toys, puppy-proof your home and redirect him when he picks the wrong thing.", icon: "alert-outline" },
            { title: "Digging", text: "Give him more exercise and a spot where digging is allowed.", icon: "alert-outline" },
            { title: "Separation anxiety", text: "Practise short absences, keep goodbyes calm and leave a puzzle toy. For severe cases ask your vet.", icon: "alert-outline" },
        ],
    },
    {
        type: "list",
        heading: "Golden rules",
        tone: "good",
        items: [
            { title: "Be consistent", text: "Everyone in the family should use the same rules and cues.", icon: "check-circle-outline" },
            { title: "Catch him being good", text: "Reward calm and quiet behaviour, not only tricks.", icon: "check-circle-outline" },
            { title: "Manage the environment", text: "Remove temptations while he's still learning.", icon: "check-circle-outline" },
        ],
    },
    {
        type: "tip",
        title: "Never punish 💡",
        body: "Scolding and physical punishment damage trust and can make problems worse. If you see aggression or behaviour that isn't improving, talk to your vet or a certified trainer.",
    },
];

export default function BehaviorTipsScreen() {
    return <KnowGuide title="Behavior Tips" chip="Behavior Tips" sections={SECTIONS} />;
}