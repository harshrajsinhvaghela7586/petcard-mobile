import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ArcRing, C, LogCard, Shell, nowTime, s } from "../../components/TrackKit";

const COMMANDS = ["Sit", "Come", "Stay", "Down", "Heel"];
const RING = s(230);

export default function ClickerScreen() {
    const [total, setTotal] = useState(128);
    const [logs, setLogs] = useState([
        { id: 1, time: "10:00 AM", label: "Sit" },
        { id: 2, time: "01:00 PM", label: "Come" },
        { id: 3, time: "04:00 PM", label: "Stay" },
    ]);

    /* press ("dab") animation: button sinks on press-in, springs back on release */
    const scale = useRef(new Animated.Value(1)).current;
    const bump = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const pressOut = () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 14 }).start();

    const click = () => {
        setTotal((t) => t + 1);
        setLogs((p) => [
            { id: Date.now(), time: nowTime(), label: COMMANDS[p.length % COMMANDS.length] },
            ...p,
        ]);
        /* count pop */
        bump.setValue(1.25);
        Animated.spring(bump, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start();
    };

    const remove = (id: number) => setLogs((p) => p.filter((l) => l.id !== id));

    return (
        <Shell
            title="Clicker"
            subtitle="Use the clicker to mark good behavior and reinforce positive habits."
            footer={{ title: "+ Add Click", onPress: click }}
        >
            <View style={{ marginTop: s(6) }}>
                <ArcRing size={RING} sweep={360} progress={(total % 100) / 100} stroke={12}>
                    <Pressable onPress={click} onPressIn={pressIn} onPressOut={pressOut}>
                        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
                            <View style={styles.innerRing} />
                            <View style={styles.gloss} />
                            <Image
                                source={require("../../../assets/images/paw.png")}
                                resizeMode="contain"
                                style={[styles.paw, styles.pawShadow, { tintColor: C.brown }]}
                            />
                            <Image
                                source={require("../../../assets/images/paw.png")}
                                resizeMode="contain"
                                style={[styles.paw, { tintColor: C.white }]}
                            />
                        </Animated.View>
                    </Pressable>
                </ArcRing>
            </View>

            <Animated.Text
                style={[styles.total, { transform: [{ scale: bump }] }]}
                maxFontSizeMultiplier={1.1}
            >
                {total}
            </Animated.Text>
            <Text style={styles.totalLabel} maxFontSizeMultiplier={1.1}>
                Total Clicks
            </Text>

            <LogCard
                title="Click Log"
                plain
                right={
                    <View style={styles.today}>
                        <Text style={styles.todayText} maxFontSizeMultiplier={1.1}>
                            Today
                        </Text>
                        <Ionicons name="chevron-down" size={s(14)} color={C.orange} />
                    </View>
                }
            >
                {logs.map((l) => (
                    <View key={l.id} style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Image
                                source={require("../../../assets/images/paw.png")}
                                resizeMode="contain"
                                style={styles.rowPaw}
                            />
                        </View>
                        <Text style={styles.rowTime} maxFontSizeMultiplier={1.1}>
                            {l.time}
                        </Text>
                        <Text style={styles.rowLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {l.label}
                        </Text>
                        <Pressable onPress={() => remove(l.id)} hitSlop={8}>
                            <Ionicons name="trash-outline" size={s(18)} color={C.muted} />
                        </Pressable>
                    </View>
                ))}
            </LogCard>
        </Shell>
    );
}

const styles = StyleSheet.create({
    button: {
        width: RING * 0.74,
        height: RING * 0.74,
        borderRadius: RING,
        backgroundColor: C.orange,
        borderWidth: s(6),
        borderColor: "#E86F00",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        shadowColor: "#B34F00",
        shadowOffset: { width: 0, height: s(10) },
        shadowOpacity: 0.45,
        shadowRadius: s(14),
        elevation: 12,
    },
    innerRing: {
        position: "absolute",
        top: s(6),
        left: s(6),
        right: s(6),
        bottom: s(6),
        borderRadius: RING,
        borderWidth: s(2),
        borderColor: "rgba(255,255,255,0.45)",
    },
    gloss: {
        position: "absolute",
        top: s(8),
        left: RING * 0.12,
        right: RING * 0.12,
        height: RING * 0.2,
        borderRadius: RING,
        backgroundColor: "rgba(255,255,255,0.22)",
    },
    pawShadow: {
        position: "absolute",
        opacity: 0.22,
        marginTop: s(5),
        marginLeft: s(2),
    },
    paw: { width: RING * 0.42, height: RING * 0.42 },
    total: { fontFamily: "Fredoka_600SemiBold", fontSize: s(30), color: C.orange, marginTop: s(8) },
    totalLabel: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown, marginTop: s(-2) },

    today: { flexDirection: "row", alignItems: "center", gap: s(2) },
    todayText: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.orange },

    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.cardLight,
        borderRadius: s(12),
        paddingVertical: s(6),
        paddingHorizontal: s(8),
        marginBottom: s(6),
        borderWidth: 1,
        borderColor: C.peach,
    },
    rowIcon: {
        width: s(32),
        height: s(32),
        borderRadius: s(16),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
    },
    rowPaw: { width: s(18), height: s(18) },
    rowTime: { fontFamily: "Nunito_400Regular", fontSize: s(12), color: C.muted, marginLeft: s(12), width: s(76) },
    rowLabel: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
});