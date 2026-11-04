import { C, KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "types", title: "Best Food Types", sub: "What to feed Milo", icon: "food-drumstick", color: "#E0502F", tint: "#FFE5E1", route: "FoodNutrition/BestFoodTypeScreen" },
    { key: "schedule", title: "Feeding Schedule", sub: "How much & how often", icon: "alarm", color: "#E08A00", tint: "#FFF0D6", route: "FoodNutrition/FeedingScheduleScreen" },
    { key: "human", title: "Human Foods", sub: "What's safe & what's not", icon: "carrot", color: "#FF7A00", tint: "#FFE9D6", route: "FoodNutrition/HumanFoodScreen" },
    { key: "treats", title: "Treats & Rewards", sub: "Healthy treat ideas", icon: "bone", color: "#C8895A", tint: "#F7E6D6", route: "FoodNutrition/TreatsRewardScreen" },
];

export default function FoodNutritionScreen() {
    return (
        <KnowMenuPage
            menuKey="food_nutrition"
            title="Food & Nutrition"
            tint="#FFEBD6"
            chip="Food & Nutrition"
            heroTitle="Fuel Milo the right way"
            heroSub="Balanced meals, steady portions and fresh water every day."
            heading="Recommended Diet"
            headingColor={C.orangeDeep}
            sub="A balanced diet keeps Milo energetic and strong."
            tip={{ title: "Nutrition Tip 🥕", text: "Always provide fresh water and avoid overfeeding.", titleColor: C.orangeDeep }}
            items={ITEMS}
            decor={[
                { name: "carrot", size: 30, color: "#FF9A3C", pos: { top: s(14), right: s(22) } },
                { name: "bowl-mix", size: 26, color: "#C99366", pos: { top: s(76), right: s(118) } },
                { name: "bone", size: 24, color: "#D9A87C", pos: { bottom: s(16), left: s(14) } },
            ]}
        />
    );
}