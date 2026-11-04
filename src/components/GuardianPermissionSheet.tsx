import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";

/* Backend ke GUARDIAN_PERMISSIONS ke saath same keys */
export const PERMISSION_OPTIONS: { key: string; label: string; sub: string }[] = [
    { key: "view_pet", label: "View pet profile", sub: "See pet details and the PetCard" },
    { key: "view_tasks", label: "View tasks", sub: "See daily tasks and the calendar" },
    { key: "manage_tasks", label: "Manage tasks", sub: "Add, edit and complete tasks" },
    { key: "view_health", label: "View health records", sub: "See vaccines, vet visits and more" },
    { key: "manage_health", label: "Manage health records", sub: "Add and edit health records" },
    { key: "view_memories", label: "View memories", sub: "See photos and moments" },
    { key: "manage_memories", label: "Manage memories", sub: "Add and edit memories" },
];
export const DEFAULT_PERMISSIONS = ["view_pet", "view_tasks"];

/* "manage_x" ke liye "view_x" zaroori hai, isliye saath me on/off */
const withDeps = (set: Set<string>, key: string, on: boolean) => {
    const next = new Set(set);
    if (on) {
        next.add(key);
        if (key.startsWith("manage_")) next.add(key.replace("manage_", "view_"));
    } else {
        next.delete(key);
        if (key.startsWith("view_") && key !== "view_pet") next.delete(key.replace("view_", "manage_"));
    }
    next.add("view_pet"); // minimum access
    return next;
};

export default function GuardianPermissionSheet({ visible, name, initial, saving, onClose, onSave, onRemove }: {
    visible: boolean; name: string; initial: string[]; saving?: boolean;
    onClose: () => void; onSave: (permissions: string[]) => void; onRemove?: () => void;
}) {
    const [sel, setSel] = useState<Set<string>>(new Set(initial));
    useEffect(() => { if (visible) setSel(new Set(initial.length ? initial : DEFAULT_PERMISSIONS)); }, [visible, initial]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.grab} />
                <Text style={styles.title} maxFontSizeMultiplier={1.1}>{name}'s permissions</Text>
                {PERMISSION_OPTIONS.map((p, i) => (
                    <View key={p.key} style={[styles.row, i > 0 && styles.rowBorder]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label} maxFontSizeMultiplier={1.1}>{p.label}</Text>
                            <Text style={styles.sub} maxFontSizeMultiplier={1.1}>{p.sub}</Text>
                        </View>
                        <Switch
                            value={sel.has(p.key)}
                            disabled={p.key === "view_pet"}
                            onValueChange={(v) => setSel((cur) => withDeps(cur, p.key, v))}
                            trackColor={{ false: C.divider, true: C.peach }}
                            thumbColor={sel.has(p.key) ? C.orange : "#FFFFFF"}
                        />
                    </View>
                ))}
                <PrimaryButton title={saving ? "Saving..." : "Save Permissions"} disabled={saving} onPress={() => onSave(Array.from(sel))} style={{ alignSelf: "stretch", marginTop: s(14) }} />
                {onRemove ? (
                    <Pressable onPress={onRemove} style={styles.remove} hitSlop={8}>
                        <Text style={styles.removeText} maxFontSizeMultiplier={1.1}>Remove co-guardian</Text>
                    </Pressable>
                ) : null}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)" },
    sheet: { backgroundColor: C.white, borderTopLeftRadius: s(24), borderTopRightRadius: s(24), padding: s(18), paddingBottom: s(26) },
    grab: { alignSelf: "center", width: s(40), height: s(4), borderRadius: s(2), backgroundColor: C.peachBorder, marginBottom: s(10) },
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown, textAlign: "center", marginBottom: s(6) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(8), gap: s(10) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    label: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    sub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(1) },
    remove: { alignItems: "center", paddingTop: s(14) },
    removeText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.red },
});
