import { C, Decor, Hero, KnowFrame, KnowItem, ListCard, s } from "../../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "routine", title: "Daily Routine", sub: "Create a daily schedule", icon: "timer-outline", color: "#FF7A00", tint: "#FFE9D6", route: "BasicCare/DailyRoutineScreen" },
    { key: "hydration", title: "Hydration", sub: "Water intake guide", icon: "water", color: "#5E9B2D", tint: "#EAF3DC", route: "BasicCare/HydrationScreen" },
    { key: "sleep", title: "Sleep & Rest", sub: "How much sleep does Milo need?", icon: "sleep", color: "#3B6FB6", tint: "#E6F0FA", route: "BasicCare/SleepRestScreen" },
    { key: "play", title: "Playtime", sub: "Importance of play", icon: "tennis-ball", color: "#7A9BD6", tint: "#E6F0FA", route: "BasicCare/PlaytimeScreen" },
    { key: "love", title: "Love & Attention", sub: "Bonding with Milo ❤️", icon: "heart", color: "#FF4B32", tint: "#FFE5E1", route: "BasicCare/LoveAttentionScreen" },
];

export default function BasicCareScreen() {
    return (
        <KnowFrame title="Basic Care">
            <Hero tint="#FFEBD6" heroHeight={150}>
                <Decor name="bowl-mix" size={50} color="#C0504D" style={{ left: s(26), bottom: s(18) }} />
                <Decor name="home-roof" size={120} color="#C8895A" style={{ alignSelf: "center" }} />
                <Decor name="paw" size={26} color={C.orange} style={{ alignSelf: "center", top: s(70) }} />
                <Decor name="flower-outline" size={46} color="#5E9B2D" style={{ right: s(26), top: s(26) }} />
                <Decor name="tennis-ball" size={30} color="#3B8FD6" style={{ right: s(34), bottom: s(16) }} />
            </Hero>

            <ListCard
                heading="Daily Care Essentials"
                headingColor={C.orangeDeep}
                sub="Little things every day make Milo's life amazing!"
                items={ITEMS}
            />
        </KnowFrame>
    );
}