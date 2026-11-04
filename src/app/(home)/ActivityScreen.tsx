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

export default function ActivityScreen() {
    const { day, add, remove, goals, hasPet, loading } = useTracker();
    const [sheet, setSheet] = useState(false);
    const total = sum(day.activity);

    return (
        <Shell title="Activity Tracking" footer={{ title: "+ Add Activity", onPress: () => (hasPet ? setSheet(true) : undefined) }}>
            <Tabs items={[{ label: "Your Activity", active: true, color: C.orange }]} />
            <ArcRing progress={total / goals.activity}>
                <Image source={require("../../../assets/images/homepage/activity.png")} resizeMode="contain" style={{ width: s(84), height: s(84), marginBottom: s(2) }} />
                <BigValue value={total} total={`${goals.activity} min`} caption="Today's Activity" />
            </ArcRing>
            <LogCard title="Activity Log">
                {day.activity.length === 0 ? (
                    <Text style={{ color: C.muted, fontFamily: "Nunito_600SemiBold", textAlign: "center", paddingVertical: s(12) }}>
                        {loading ? "Loading…" : "No activity yet today. Tap + Add Activity."}
                    </Text>
                ) : null}
                {day.activity.map((l, i) => (
                    <Pressable key={l.id} onLongPress={() => remove("activity", l.id)}>
                        <LogRow title={l.label || "Activity"} sub={l.time || undefined} value={`${String(l.amount).padStart(2, "0")} min`} last={i === day.activity.length - 1} />
                    </Pressable>
                ))}
                {day.activity.length ? <Text style={{ color: C.muted, fontSize: s(10), textAlign: "center", marginTop: s(6) }}>Long-press an entry to delete it</Text> : null}
            </LogCard>

            <AddLogSheet
                visible={sheet} title="Add Activity" onClose={() => setSheet(false)}
                nameLabel="Activity" namePlaceholder="e.g. Morning Walk" namePresets={["Walk", "Play Time", "Training", "Run", "Swim"]}
                amountLabel="Duration" unit="min" presets={[10, 15, 20, 30]} step={5} max={240}
                onSave={(v) => { void add("activity", { label: v.label, amount: v.amount, time: v.time }); setSheet(false); }}
            />
            <NoPetPopup visible={!loading && !hasPet} onLater={() => router.back()} />
        </Shell>
    );
}
