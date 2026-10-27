import React from "react";
import { C, Decor, Hero, HeroPet, KnowFrame, KnowItem, ListCard, s } from "../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "commands", title: "Basic Commands", sub: "Sit, stay, come & more", icon: "dog-service", color: "#5E9B2D", tint: "#EAF3DC", route: "/BasicCommandsScreen" },
    { key: "house", title: "House Training", sub: "Tips for potty training", icon: "toilet", color: "#7A5CFF", tint: "#EFE9FF", route: "/HouseTrainingScreen" },
    { key: "leash", title: "Leash Training", sub: "Walk nicely on leash", icon: "link-variant", color: "#3B6FB6", tint: "#E6F0FA", route: "/LeashTrainingScreen" },
    { key: "behavior", title: "Behavior Tips", sub: "Solve common behaviors", icon: "lightbulb-on-outline", color: "#E08A00", tint: "#FFF0D6", route: "/BehaviorTipsScreen" },
    { key: "games", title: "Fun Games", sub: "Make training fun!", icon: "puzzle", color: "#FF7A00", tint: "#FFE9D6", route: "/FunGamesScreen" },
];

export default function TrainingScreen() {
    return (
        <KnowFrame title="Training">
            <Hero tint="#FDEBDD" heroHeight={170}>
                <Decor name="school" size={44} color="#2C2C2C" style={{ top: s(8), alignSelf: "center" }} />
                <HeroPet size={150} style={{ bottom: s(-6) }} />
                <Decor name="tennis-ball" size={34} color="#3B8FD6" style={{ right: s(24), bottom: s(18) }} />
                <Decor name="gesture-tap" size={30} color="#5E9B2D" style={{ left: s(26), bottom: s(24) }} />
            </Hero>

            <ListCard
                heading="Train. Bond. Repeat. 🐾"
                headingColor={C.brown}
                sub="Positive training builds trust and good behavior."
                items={ITEMS}
            />
        </KnowFrame>
    );
}