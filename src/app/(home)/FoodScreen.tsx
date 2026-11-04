import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons } from "@expo/vector-icons";
import { ArcRing, BigValue, C, LogCard, LogRow, Shell, Tabs, s } from "../../components/TrackKit";
import AddLogSheet from "@/components/AddLogSheet";
import NoPetPopup from "@/components/NoPetPopup";
import { useTracker } from "@/hooks/use-tracker";
import { sum } from "@/services/trackerStore";

export default function FoodScreen() {
    const { day, add, remove, goals, hasPet, loading } = useTracker();
    const [sheet, setSheet] = useState(false);
    const total = sum(day.food);

    return (
        <Shell title="Food Tracking" footer={{ title: "+ Add Meal", onPress: () => (hasPet ? setSheet(true) : undefined) }}>
            <Tabs
                items={[
                    { label: "Food", active: true, color: C.orange },
                    { label: "Water", active: false, color: C.blue, onPress: () => router.replace("/WaterScreen" as any) },
                ]}
            />
            <ArcRing progress={total / goals.food}>
                <Image source={require("../../../assets/images/homepage/food.png")} resizeMode="contain" style={{ width: s(84), height: s(84), marginBottom: s(2) }} />
                <BigValue value={total} total={`${goals.food} g`} caption="Today's Food" />
            </ArcRing>
            <LogCard title="Meal Breakdown">
                {day.food.length === 0 ? (
                    <Text style={{ color: C.muted, fontFamily: "Nunito_600SemiBold", textAlign: "center", paddingVertical: s(12) }}>
                        {loading ? "Loading…" : "No meals added today. Tap + Add Meal."}
                    </Text>
                ) : null}
                {day.food.map((m, i) => (
                    <Pressable key={m.id} onLongPress={() => remove("food", m.id)}>
                        <LogRow title={m.label || "Meal"} sub={m.time} value={`${m.amount}g`} last={i === day.food.length - 1} />
                    </Pressable>
                ))}
                {day.food.length ? <Text style={{ color: C.muted, fontSize: s(10), textAlign: "center", marginTop: s(6) }}>Long-press a meal to delete it</Text> : null}
            </LogCard>

            <AddLogSheet
                visible={sheet} title="Add Meal" onClose={() => setSheet(false)}
                nameLabel="Meal name" namePlaceholder="e.g. Breakfast" namePresets={["Breakfast", "Lunch", "Dinner", "Snack"]}
                amountLabel="Amount" unit="g" presets={[25, 50, 100, 150]} step={5} max={1000}
                onSave={(v) => { void add("food", { label: v.label, amount: v.amount, time: v.time }); setSheet(false); }}
            />
            <NoPetPopup visible={!loading && !hasPet} onLater={() => router.back()} />
        </Shell>
    );
}
