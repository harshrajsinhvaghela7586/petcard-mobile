import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ArcRing, C, LogCard, Shell, nowTime, s } from "../../components/TrackKit";

const COMMANDS = ["Recall Training", "Sit Command", "Stay Command", "Heel Command"];
const RING = s(230);
const PET_NAME = "Milo";

export default function WhistleScreen() {
    const [total, setTotal] = useState(15);
    const [logs, setLogs] = useState([
        { id: 1, time: "10:00 AM", label: "Recall Training", n: 1 },
        { id: 2, time: "01:00 PM", label: "Sit Command", n: 2 },
        { id: 3, time: "05:00 PM", label: "Stay Command", n: 1 },
    ]);

    const scale = useRef(new Animated.Value(1)).current;
    const bump = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const pressOut = () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 14 }).start();

    const whistle = () => {
        setTotal((t) => t + 1);
        setLogs((p) => [
            { id: Date.now(), time: nowTime(), label: COMMANDS[p.length % COMMANDS.length], n: 1 },
            ...p,
        ]);
        bump.setValue(1.25);
        Animated.spring(bump, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start();
    };

    const remove = (id: number) => setLogs((p) => p.filter((l) => l.id !== id));

    return (
        <Shell
            title="Whistle"
            subtitle={`Train, communicate and build a stronger bond with ${PET_NAME}.`}
            footer={{ title: "+ Add Whistle", onPress: whistle }}
        >
            <View style={{ marginTop: s(6) }}>
                <ArcRing size={RING} sweep={360} progress={(total % 50) / 50} stroke={12}>
                    <Pressable onPress={whistle} onPressIn={pressIn} onPressOut={pressOut}>
                        <Animated.View style={[styles.center, { transform: [{ scale }] }]}>
                            <Image
                                source={require("../../../assets/images/homepage/whistle.png")}
                                resizeMode="contain"
                                style={styles.whistleImg}
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
                Tap to Whistle
            </Text>

            <LogCard
                title="Whistle Log"
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
                                source={require("../../../assets/images/homepage/whistle.png")}
                                resizeMode="contain"
                                style={styles.rowImg}
                            />
                        </View>
                        <View style={{ marginLeft: s(8), flex: 1 }}>
                            <Text style={styles.rowTime} maxFontSizeMultiplier={1.1}>
                                {l.time}
                            </Text>
                            <Text style={styles.rowLabel} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {l.label}
                            </Text>
                        </View>
                        <View style={styles.pill}>
                            <Text style={styles.pillText} maxFontSizeMultiplier={1}>
                                {l.n} {l.n > 1 ? "whistles" : "whistle"}
                            </Text>
                        </View>
                        <Pressable onPress={() => remove(l.id)} hitSlop={8} style={{ marginLeft: s(10) }}>
                            <Ionicons name="trash-outline" size={s(18)} color={C.muted} />
                        </Pressable>
                    </View>
                ))}
            </LogCard>
        </Shell>
    );
}

const styles = StyleSheet.create({
    center: { alignItems: "center", justifyContent: "center" },
    whistleImg: { width: RING * 0.7, height: RING * 0.7 },
    rowImg: { width: s(22), height: s(22) },
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
    rowTime: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    rowLabel: { fontFamily: "Nunito_400Regular", fontSize: s(10), color: C.muted },
    pill: { paddingHorizontal: s(10), paddingVertical: s(3), borderRadius: s(10), backgroundColor: C.peach },
    pillText: { fontFamily: "Nunito_700Bold", fontSize: s(10), color: C.orange },
});