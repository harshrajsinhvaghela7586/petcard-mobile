import React from "react";
import { KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "home", title: "Home Safety", sub: "Pet-proof your home", icon: "home", color: "#FF7A00", tint: "#FFE9D6", route: "Safety/HomeSafetyScreen" },
    { key: "car", title: "Car Safety", sub: "Travel safe with Milo", icon: "car", color: "#3B6FB6", tint: "#E6F0FA", route: "Safety/CarSafetyScreen" },
    { key: "outdoor", title: "Outdoor Safety", sub: "Walks & outdoor tips", icon: "tree", color: "#2E9C8A", tint: "#E3F4F1", route: "/Safety/OutdoorSafetyScreen" },
    { key: "weather", title: "Weather Safety", sub: "Hot, cold & rainy care", icon: "weather-partly-rainy", color: "#5E9B2D", tint: "#EAF3DC", route: "Safety/WeatherSafetyScreen" },
    { key: "toxic", title: "Toxic Items", sub: "Things to keep away", icon: "alert", color: "#FF4B32", tint: "#FFE5E1", route: "Safety/ToxicItemScreen" },
];

export default function SafetyScreen() {
    return (
        <KnowMenuPage
            menuKey="safety"
            title="Safety"
            tint="#E4EEDD"
            chip="Safety"
            heroTitle="Safety first, always"
            heroSub="Keep Milo safe at home, in the car and on every walk."
            heading="Safety First, Always. 🛡️"
            sub="Keep Milo safe at home and on every adventure."
            tip={{ title: "Safety Tip 🚨", text: "Keep an ID tag and microchip details up to date, and save your vet's emergency number." }}
            items={ITEMS}
            decor={[
                { name: "shield-check", size: 32, color: "#8DBB6A", pos: { top: s(14), right: s(22) } },
                { name: "paw", size: 24, color: "#B7D5A0", pos: { top: s(76), right: s(120) } },
                { name: "lock-outline", size: 24, color: "#A9CC8F", pos: { bottom: s(16), left: s(14) } },
            ]}
        />
    );
}