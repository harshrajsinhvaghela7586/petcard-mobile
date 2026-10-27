import React from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C, SIDE, cardStyle, s } from "@/components/SectionHeader";

type Key = "download" | "share" | "print";

interface Props {
    shareMessage: string;
    order?: Key[];
    onDownload?: () => void; // TODO: file save
    onPrint?: () => void; // TODO: print
}

export default function PetActions({
    shareMessage,
    order = ["download", "share", "print"],
    onDownload,
    onPrint,
}: Props) {
    const ITEMS: Record<Key, { label: string; icon: string; onPress: () => void }> = {
        download: { label: "Download", icon: "download-outline", onPress: () => onDownload?.() },
        share: {
            label: "Share",
            icon: "share-variant-outline",
            onPress: () => {
                Share.share({ message: shareMessage });
            },
        },
        print: { label: "Print", icon: "printer-outline", onPress: () => onPrint?.() },
    };

    return (
        <View style={styles.row}>
            {order.map((k) => (
                <Pressable key={k} onPress={ITEMS[k].onPress} style={styles.item}>
                    <MaterialCommunityIcons name={ITEMS[k].icon as any} size={s(26)} color={C.brown} />
                    <Text style={styles.label} maxFontSizeMultiplier={1.1}>{ITEMS[k].label}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", gap: s(10), marginHorizontal: SIDE },
    item: {
        ...cardStyle,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: s(14),
        gap: s(6),
    },
    label: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown },
});