import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { ArcRing, BigValue, C, LogCard, LogRow, Shell, Tabs, s } from "../../components/TrackKit";
import AddLogSheet from "@/components/AddLogSheet";
import NoPetPopup from "@/components/NoPetPopup";
import { useTracker } from "@/hooks/use-tracker";
import { sum } from "@/services/trackerStore";

export default function WaterScreen() {
    const { day, add, remove, goals, hasPet, loading } = useTracker();
    const [sheet, setSheet] = useState(false);
    const total = sum(day.water);

    return (
        <Shell title="Water Tracking" footer={{ title: "+ Add Water", onPress: () => (hasPet ? setSheet(true) : undefined) }}>
            <Tabs
                items={[
                    { label: "Food", active: false, color: C.orange, onPress: () => router.replace("/FoodScreen" as any) },
                    { label: "Water", active: true, color: C.blue },
                ]}
            />
            <ArcRing progress={total / goals.water} color={C.blue} track={C.blueTrack}>
                <Image source={require("../../../assets/images/homepage/water.png")} resizeMode="contain" style={{ width: s(84), height: s(84), marginBottom: s(2) }} />
                <BigValue value={total} total={`${goals.water} ml`} caption="Today's Water" />
            </ArcRing>
            <LogCard title="Intake Log">
                {day.water.length === 0 ? (
                    <Text style={{ color: C.muted, fontFamily: "Nunito_600SemiBold", textAlign: "center", paddingVertical: s(12) }}>
                        {loading ? "Loading…" : "No water logged today. Tap + Add Water."}
                    </Text>
                ) : null}
                {day.water.map((l, i) => (
                    <Pressable key={l.id} onLongPress={() => remove("water", l.id)}>
                        <LogRow title={l.time} value={`${l.amount} ml`} last={i === day.water.length - 1} />
                    </Pressable>
                ))}
                {day.water.length ? <Text style={{ color: C.muted, fontSize: s(10), textAlign: "center", marginTop: s(6) }}>Long-press an entry to delete it</Text> : null}
            </LogCard>

            <AddLogSheet
                visible={sheet} title="Add Water" onClose={() => setSheet(false)}
                amountLabel="Amount" unit="ml" presets={[50, 100, 200, 250]} step={10} max={2000}
                onSave={(v) => { void add("water", { amount: v.amount, time: v.time }); setSheet(false); }}
            />
            <NoPetPopup visible={!loading && !hasPet} onLater={() => router.back()} />
        </Shell>
    );
}
