import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";

const ITEM_H = s(42);
const VISIBLE = 5; // odd number

const pad = (n: number) => String(n).padStart(2, "0");

/** "06:30 PM" -> "18:30" (backend format) */
export function to24h(h12: number, minute: number, meridiem: "AM" | "PM") {
    let h = h12 % 12;
    if (meridiem === "PM") h += 12;
    return `${pad(h)}:${pad(minute)}`;
}
export const formatTime = (h12: number, minute: number, meridiem: "AM" | "PM") => `${pad(h12)}:${pad(minute)} ${meridiem}`;

function Wheel({ items, index, onChange, width }: { items: string[]; index: number; onChange: (i: number) => void; width: number }) {
    const ref = useRef<ScrollView>(null);
    useEffect(() => {
        const t = setTimeout(() => ref.current?.scrollTo({ y: index * ITEM_H, animated: false }), 30);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
        onChange(Math.min(items.length - 1, Math.max(0, i)));
    };
    const pad2 = ((VISIBLE - 1) / 2) * ITEM_H;
    return (
        <View style={{ width, height: ITEM_H * VISIBLE }}>
            <ScrollView
                ref={ref}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_H}
                decelerationRate="fast"
                onMomentumScrollEnd={settle}
                onScrollEndDrag={settle}
                contentContainerStyle={{ paddingVertical: pad2 }}
            >
                {items.map((label, i) => (
                    <Pressable key={label} onPress={() => { onChange(i); ref.current?.scrollTo({ y: i * ITEM_H, animated: true }); }} style={styles.item}>
                        <Text style={[styles.itemText, i === index && styles.itemTextOn]} maxFontSizeMultiplier={1}>{label}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const HOURS = Array.from({ length: 12 }, (_, i) => pad(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i));
const MERIDIEMS = ["AM", "PM"];

export type TimeValue = { h12: number; minute: number; meridiem: "AM" | "PM" };

export function nowTimeValue(): TimeValue {
    const d = new Date();
    return { h12: d.getHours() % 12 || 12, minute: d.getMinutes(), meridiem: d.getHours() >= 12 ? "PM" : "AM" };
}

/** Inline hour / minute / AM-PM scroll wheels (modal ke andar ya kisi bhi sheet me use karo). */
export function TimeWheels({ value, onChange }: { value: TimeValue; onChange: (v: TimeValue) => void }) {
    return (
        <View style={styles.wheels}>
            <View pointerEvents="none" style={styles.band} />
            <Wheel items={HOURS} index={value.h12 - 1} onChange={(i) => onChange({ ...value, h12: i + 1 })} width={s(80)} />
            <Text style={styles.colon}>:</Text>
            <Wheel items={MINUTES} index={value.minute} onChange={(i) => onChange({ ...value, minute: i })} width={s(80)} />
            <Wheel items={MERIDIEMS} index={value.meridiem === "AM" ? 0 : 1} onChange={(i) => onChange({ ...value, meridiem: i === 0 ? "AM" : "PM" })} width={s(80)} />
        </View>
    );
}

/** Scroll-wheel time picker in a bottom sheet. */
export default function TimeWheelModal({
    visible, initial, onClose, onConfirm,
}: {
    visible: boolean;
    initial: TimeValue;
    onClose: () => void;
    onConfirm: (v: TimeValue) => void;
}) {
    const [val, setVal] = useState<TimeValue>(initial);
    useEffect(() => { if (visible) setVal(initial); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.grab} />
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>Select time</Text>
                {visible ? <TimeWheels value={val} onChange={setVal} /> : null}
                <PrimaryButton title="Set Time" onPress={() => onConfirm(val)} style={{ alignSelf: "stretch", marginTop: s(8) }} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(18), paddingBottom: s(28) },
    grab: { alignSelf: "center", width: s(40), height: s(4), borderRadius: s(2), backgroundColor: C.peachBorder, marginBottom: s(10) },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown, textAlign: "center", marginBottom: s(6) },
    wheels: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    band: { position: "absolute", left: 0, right: 0, top: ITEM_H * ((VISIBLE - 1) / 2), height: ITEM_H, backgroundColor: "#FFF3E6", borderRadius: s(12), borderWidth: 1, borderColor: C.peachBorder },
    item: { height: ITEM_H, alignItems: "center", justifyContent: "center" },
    itemText: { fontFamily: "Nunito_700Bold", fontSize: s(18), color: C.muted },
    itemTextOn: { fontFamily: "Fredoka_600SemiBold", fontSize: s(24), color: C.orange },
    colon: { fontFamily: "Fredoka_600SemiBold", fontSize: s(24), color: C.brown },
});
