import React, { useState } from "react";
import { Image } from "react-native";
import { ArcRing, BigValue, C, LogCard, LogRow, Shell, Tabs, nowTime, s } from "../components/TrackKit";

const GOAL = 60;

export default function ActivityScreen() {
    const [logs, setLogs] = useState([
        { id: 1, title: "Morning Walk", time: "08:00 AM", min: 20 },
        { id: 2, title: "Play Time", time: "05:00 PM", min: 10 },
        { id: 3, title: "Training", time: "", min: 0 },
    ]);
    const total = logs.reduce((a, l) => a + l.min, 0);

    const addActivity = () =>
        setLogs((p) => [...p, { id: Date.now(), title: "Play Time", time: nowTime(), min: 10 }]);

    return (
        <Shell title="Activity Tracking" footer={{ title: "+ Add Activity", onPress: addActivity }}>
            <Tabs items={[{ label: "Your Activity", active: true, color: C.orange }]} />
            <ArcRing progress={total / GOAL}>
                <Image
                    source={require("../../assets/images/homepage/activity.png")}
                    resizeMode="contain"
                    style={{ width: s(84), height: s(84), marginBottom: s(2) }}
                />
                <BigValue value={total} total={`${GOAL} min`} caption="Today's Activity" />
            </ArcRing>
            <LogCard title="Activity Log">
                {logs.map((l, i) => (
                    <LogRow
                        key={l.id}
                        title={l.title}
                        sub={l.time || undefined}
                        value={`${l.min.toString().padStart(2, "0")} min`}
                        last={i === logs.length - 1}
                    />
                ))}
            </LogCard>
        </Shell>
    );
}