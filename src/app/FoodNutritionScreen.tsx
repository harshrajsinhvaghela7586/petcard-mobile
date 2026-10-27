import React from "react";
import { C, Decor, Hero, KnowFrame, KnowItem, ListCard, s, TipCard } from "../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "types", title: "Best Food Types", sub: "What to feed Milo", icon: "food-drumstick", color: "#E0502F", tint: "#FFE5E1", route: "/BestFoodTypesScreen" },
    { key: "schedule", title: "Feeding Schedule", sub: "How much & how often", icon: "alarm", color: "#E08A00", tint: "#FFF0D6", route: "/FeedingScheduleScreen" },
    { key: "human", title: "Human Foods", sub: "What's safe & what's not", icon: "carrot", color: "#FF7A00", tint: "#FFE9D6", route: "/HumanFoodsScreen" },
    { key: "treats", title: "Treats & Rewards", sub: "Healthy treat ideas", icon: "bone", color: "#C8895A", tint: "#F7E6D6", route: "/TreatsRewardsScreen" },
];

export default function FoodNutritionScreen() {
    return (
        <KnowFrame title="Food & Nutrition">
            <Hero tint="#FFEBD6" heroHeight={140}>
                <Decor name="food-steak" size={44} color="#E0502F" style={{ left: s(22), top: s(30) }} />
                <Decor name="bowl-mix" size={96} color="#A9693A" style={{ alignSelf: "center" }} />
                <Decor name="carrot" size={44} color="#FF7A00" style={{ right: s(22), top: s(24) }} />
                <Decor name="bone" size={26} color="#C8895A" style={{ right: s(60), bottom: s(18) }} />
            </Hero>

            <ListCard
                heading="Recommended Diet"
                headingColor={C.orangeDeep}
                sub="A balanced diet keeps Milo energetic and strong."
                items={ITEMS}
            />

            <TipCard
                title="Nutrition Tip 🥕"
                titleColor={C.orangeDeep}
                text="Always provide fresh water and avoid overfeeding."
            />
        </KnowFrame>
    );
}