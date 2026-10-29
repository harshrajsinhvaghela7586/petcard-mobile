import { router } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import { ArcRing, BigValue, C, LogCard, LogRow, Shell, Tabs, nowTime, s } from "../../components/TrackKit";

const GOAL = 300;

export default function FoodScreen() {
    const [meals, setMeals] = useState([
        { id: 1, title: "Breakfast", time: "08:00 AM", g: 50 },
        { id: 2, title: "Lunch", time: "01:00 PM", g: 50 },
        { id: 3, title: "Dinner", time: "07:00 PM", g: 50 },
    ]);
    const total = meals.reduce((a, m) => a + m.g, 0);

    const addMeal = () =>
        setMeals((p) => [...p, { id: Date.now(), title: "Snack", time: nowTime(), g: 50 }]);

    return (
        <Shell title="Food Tracking" footer={{ title: "+ Add Meal", onPress: addMeal }}>
            <Tabs
                items={[
                    { label: "Food", active: true, color: C.orange },
                    { label: "Water", active: false, color: C.blue, onPress: () => router.replace("/WaterScreen" as any) },
                ]}
            />
            <ArcRing progress={total / GOAL}>
                <Image
                    source={require("../../../assets/images/homepage/food.png")}
                    resizeMode="contain"
                    style={{ width: s(84), height: s(84), marginBottom: s(2) }}
                />
                <BigValue value={total} total={`${GOAL} g`} caption="Today's Food" />
            </ArcRing>
            <LogCard title="Meal Breakdown">
                {meals.map((m, i) => (
                    <LogRow key={m.id} title={m.title} sub={m.time} value={`${m.g}g`} last={i === meals.length - 1} />
                ))}
            </LogCard>
        </Shell>
    );
}