import React from "react";
import { C, Decor, Hero, HeroPet, KnowFrame, KnowItem, ListCard, s } from "../../components/KnowKit";

const ITEMS: KnowItem[] = [
    { key: "home", title: "Home Safety", sub: "Pet-proof your home", icon: "home", color: "#FF7A00", tint: "#FFE9D6", route: "Safety/HomeSafetyScreen" },
    { key: "car", title: "Car Safety", sub: "Travel safe with Milo", icon: "car", color: "#3B6FB6", tint: "#E6F0FA", route: "Safety/CarSafetyScreen" },
    { key: "outdoor", title: "Outdoor Safety", sub: "Walks & outdoor tips", icon: "tree", color: "#2E9C8A", tint: "#E3F4F1", route: "/OutdoorSafetyScreen" },
    { key: "weather", title: "Weather Safety", sub: "Hot, cold & rainy care", icon: "weather-partly-rainy", color: "#5E9B2D", tint: "#EAF3DC", route: "Safety/WeatherSafetyScreen" },
    { key: "toxic", title: "Toxic Items", sub: "Things to keep away", icon: "alert", color: "#FF4B32", tint: "#FFE5E1", route: "Safety/ToxicItemsScreen" },
];

export default function SafetyScreen() {
    return (
        <KnowFrame title="Safety">
            <Hero tint="#E9E3DA" heroHeight={170}>
                <HeroPet size={150} style={{ bottom: s(-4) }} />
                <Decor name="shield-check" size={64} color={C.green} style={{ right: s(18), bottom: s(14) }} />
            </Hero>

            <ListCard
                heading="Safety First, Always. 🛡️"
                sub="Keep Milo safe at home and on every adventure."
                items={ITEMS}
            />
        </KnowFrame>
    );
}