import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { router } from "expo-router";
import type { TabKey } from "@/components/BottomNav";

/* BottomNav ke order ke hisab se: Home <-> Tasks <-> Know <-> Profile */
const ORDER: TabKey[] = ["home", "tasks", "know", "profile"];
const ROUTES: Record<TabKey, string> = {
    home: "/HomeScreen",
    tasks: "/TasksScreen",
    know: "/KnowScreen",
    profile: "/ProfileScreen",
};

/**
 * Tab screens ko wrap karo: left swipe -> next tab, right swipe -> previous tab.
 * Vertical scroll aur horizontal lists (jaise My Pets) disturb na hon isliye gesture sirf
 * tab "clearly horizontal" ho tab activate hota hai.
 */
export default function SwipeTabs({ active, children }: { active: TabKey; children: React.ReactNode }) {
    const gesture = useMemo(() => {
        const index = ORDER.indexOf(active);
        return Gesture.Pan()
            .runOnJS(true)
            .activeOffsetX([-28, 28])
            .failOffsetY([-18, 18])
            .onEnd((e) => {
                const fast = Math.abs(e.velocityX) > 500;
                if (Math.abs(e.translationX) < 70 && !fast) return;
                const next = e.translationX < 0 ? index + 1 : index - 1;
                if (next < 0 || next >= ORDER.length) return;
                router.replace(ROUTES[ORDER[next]] as any);
            });
    }, [active]);

    return (
        <GestureDetector gesture={gesture}>
            {/* collapsable=false: Android pe gesture view flatten na ho */}
            <View style={styles.fill} collapsable={false}>{children}</View>
        </GestureDetector>
    );
}
const styles = StyleSheet.create({ fill: { flex: 1 } });
