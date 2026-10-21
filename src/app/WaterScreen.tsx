import React, { useState } from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import { ArcRing, BigValue, C, LogCard, LogRow, Shell, Tabs, nowTime, s } from "../components/TrackKit";

const GOAL = 500;

export default function WaterScreen() {
    const [logs, setLogs] = useState([
        { id: 1, time: "10:00 AM", ml: 200 },
        { id: 2, time: "01:00 PM", ml: 100 },
        { id: 3, time: "04:00 PM", ml: 100 },
    ]);
    const total = logs.reduce((a, l) => a + l.ml, 0);

    const addWater = () => setLogs((p) => [...p, { id: Date.now(), time: nowTime(), ml: 100 }]);

    return (
        <Shell title="Water Tracking" footer={{ title: "+ Add Water", onPress: addWater }}>
            <Tabs
                items={[
                    { label: "Food", active: false, color: C.orange, onPress: () => router.replace("/FoodScreen" as any) },
                    { label: "Water", active: true, color: C.blue },
                ]}
            />
            <ArcRing progress={total / GOAL} color={C.blue} track={C.blueTrack}>
                <Image
                    source={require("../../assets/images/homepage/water.png")}
                    resizeMode="contain"
                    style={{ width: s(84), height: s(84), marginBottom: s(2) }}
                />
                <BigValue value={total} total={`${GOAL} ml`} caption="Today's Water" />
            </ArcRing>
            <LogCard title="Intake Log">
                {logs.map((l, i) => (
                    <LogRow key={l.id} title={l.time} value={`${l.ml} ml`} last={i === logs.length - 1} />
                ))}
            </LogCard>
        </Shell>
    );
}