import { appLocale } from "@/i18n/autoTranslate";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { petcardApi, type HealthRecord } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import { C, Shell, s } from "../../components/TrackKit";
import NoPetPopup from "@/components/NoPetPopup";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { router as __router } from "expo-router";


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDate = (key: string) => { const [y, m, d] = key.split("-").map(Number); return new Date(y, m - 1, d); };
type CalendarEvent = HealthRecord & { tint: string; icon: string; color: string; paw?: boolean };
const eventStyle = (record: HealthRecord) => {
    const title = `${record.title} ${record.type}`.toLowerCase();
    if (title.includes("vaccin")) return { tint: "#E9E1FF", icon: "needle", color: "#6A4FD6" };
    if (title.includes("medic")) return { tint: C.peach, icon: "pill", color: C.orange };
    if (title.includes("walk")) return { tint: "#EAF3DC", icon: "paw", color: "#5E9B2D", paw: true };
    if (title.includes("groom")) return { tint: "#FFE3EE", icon: "brush", color: "#E0457B" };
    return { tint: C.peach, icon: "calendar-star", color: C.orange };
};
const typeForTitle = (title: string): HealthRecord["type"] => {
    const value = title.toLowerCase();
    if (value.includes("vaccin")) return "vaccination";
    if (value.includes("medic")) return "medication";
    if (value.includes("vet")) return "vet_visit";
    return "other";
};

export default function CalendarScreen() {
    const gate = useSelectedPet();
    const today = new Date();
    const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
    const [selected, setSelected] = useState(dateKey(today));
    const [petId, setPetId] = useState<string | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CalendarEvent | null>(null);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(dateKey(today));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { pets } = await petcardApi.listPets();
                const selectedPet = await resolveSelectedPet(pets ?? []);
                const id = selectedPet?.id;
                if (!active || !id) return;
                setPetId(id);
                const { records } = await petcardApi.listHealthRecords(id, undefined, undefined, 50);
                if (active) setEvents((records ?? []).map((r) => ({ ...r, ...eventStyle(r) })));
            } catch { if (active) Alert.alert("Calendar unavailable", "Events could not be loaded. Please check your connection and retry."); }
        })();
        return () => { active = false; };
    }, []);

    const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    const dim = new Date(view.y, view.m + 1, 0).getDate();
    const prevDim = new Date(view.y, view.m, 0).getDate();
    const cells: { d: number; cur: boolean; key: string }[] = [];
    for (let i = first - 1; i >= 0; i--) { const d = prevDim - i; cells.push({ d, cur: false, key: dateKey(new Date(view.y, view.m - 1, d)) }); }
    for (let d = 1; d <= dim; d++) cells.push({ d, cur: true, key: dateKey(new Date(view.y, view.m, d)) });
    let n = 1;
    while (cells.length % 7 !== 0) { cells.push({ d: n, cur: false, key: dateKey(new Date(view.y, view.m + 1, n)) }); n += 1; }

    const move = (delta: number) => setView((v) => { const d = new Date(v.y, v.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
    const selectedEvents = useMemo(() => events.filter((e) => e.date === selected || e.nextDueDate === selected), [events, selected]);
    const openAdd = () => { setEditing(null); setTitle(""); setDate(selected); setModalOpen(true); };
    const openEdit = (event: CalendarEvent) => { setEditing(event); setTitle(event.title); setDate(event.date); setModalOpen(true); };
    const saveEvent = async () => {
        if (!petId) return Alert.alert("Pet not found", "Create a pet profile before adding calendar events.");
        if (!title.trim()) return Alert.alert("Event name required", "Enter an event name such as Grooming, Vaccination, Walk or Medicine.");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parseDate(date).getTime())) return Alert.alert("Invalid date", "Use YYYY-MM-DD for the event date.");
        setSaving(true);
        try {
            const payload = { type: typeForTitle(title), title: title.trim(), date };
            if (editing) {
                const { record } = await petcardApi.updateHealthRecord(petId, editing.id, payload);
                setEvents((old) => old.map((e) => e.id === editing.id ? { ...record, ...eventStyle(record) } : e));
            } else {
                const { record } = await petcardApi.createHealthRecord(petId, payload);
                setEvents((old) => [...old, { ...record, ...eventStyle(record) }]);
            }
            setSelected(date); setView({ y: parseDate(date).getFullYear(), m: parseDate(date).getMonth() }); setModalOpen(false);
        } catch (error) { Alert.alert("Could not save event", error instanceof Error ? error.message : "Please try again."); }
        finally { setSaving(false); }
    };
    const deleteEvent = (event: CalendarEvent) => Alert.alert("Delete event?", `Remove ${event.title}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            if (!petId) return;
            try { await petcardApi.deleteHealthRecord(petId, event.id); setEvents((old) => old.filter((e) => e.id !== event.id)); }
            catch (error) { Alert.alert("Could not delete", error instanceof Error ? error.message : "Please try again."); }
        } },
    ]);

    return (
        <Shell title="Calendar" footer={{ title: "+ Add Event", onPress: openAdd }}>
            <View style={styles.calCard}>
                <View style={styles.monthRow}>
                    <Pressable onPress={() => move(-1)} hitSlop={10}><Ionicons name="chevron-back" size={s(18)} color={C.brown} /></Pressable>
                    <Text style={styles.month}>{MONTHS[view.m]} {view.y}</Text>
                    <Pressable onPress={() => move(1)} hitSlop={10}><Ionicons name="chevron-forward" size={s(18)} color={C.brown} /></Pressable>
                </View>
                <View style={styles.weekRow}>{DAYS.map((d) => <Text key={d} style={styles.weekText}>{d}</Text>)}</View>
                <View style={styles.grid}>
                    {cells.map((c, i) => {
                        const active = c.key === selected;
                        const hasEvent = events.some((e) => e.date === c.key || e.nextDueDate === c.key);
                        return <Pressable key={`${c.key}-${i}`} disabled={!c.cur} onPress={() => setSelected(c.key)} style={styles.cell}>
                            <View style={[styles.dayBox, active && styles.dayActive]}>
                                <Text style={[styles.dayText, !c.cur && { color: C.muted, opacity: 0.4 }, active && { color: C.white }]}>{c.d}</Text>
                                {hasEvent ? <View style={[styles.dot, active && { backgroundColor: C.white }]} /> : null}
                            </View>
                        </Pressable>;
                    })}
                </View>
            </View>
            <View style={{ width: "100%", marginTop: s(16) }}>
                {selectedEvents.length === 0 ? <Text style={styles.empty}>No events for {parseDate(selected).toLocaleDateString(appLocale())}.</Text> : selectedEvents.map((e) => (
                    <View key={e.id} style={styles.event}>
                        <View style={[styles.eventIcon, { backgroundColor: e.tint }]}>
                            {e.paw ? <Image source={require("../../../assets/images/paw.png")} resizeMode="contain" style={[styles.eventPaw, { tintColor: e.color }]} /> : <MaterialCommunityIcons name={e.icon as any} size={s(24)} color={e.color} />}
                        </View>
                        <Pressable style={{ flex: 1 }} onPress={() => openEdit(e)}>
                            <Text style={styles.eventTitle} numberOfLines={1}>{e.title}</Text>
                            <Text style={styles.eventSub} numberOfLines={1}>{e.date}</Text>
                        </Pressable>
                        <Pressable onPress={() => openEdit(e)} hitSlop={8}><Ionicons name="create-outline" size={s(20)} color={C.muted} /></Pressable>
                        <Pressable onPress={() => deleteEvent(e)} hitSlop={8}><Ionicons name="trash-outline" size={s(19)} color="#C94B43" /></Pressable>
                    </View>
                ))}
            </View>
            <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
                <View style={styles.modalBackdrop}><View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>{editing ? "Edit Event" : "Add Event"}</Text>
                    <TextInput value={title} onChangeText={setTitle} placeholder="Event name (e.g. Grooming)" placeholderTextColor={C.muted} style={styles.input} maxLength={100} />
                    <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={C.muted} style={styles.input} />
                    <Text style={styles.hint}>Selected date is prefilled from the calendar. You can edit it if needed.</Text>
                    <View style={styles.modalActions}>
                        <Pressable onPress={() => setModalOpen(false)} style={styles.cancel}><Text style={styles.cancelText}>Cancel</Text></Pressable>
                        <Pressable onPress={saveEvent} disabled={saving} style={styles.save}><Text style={styles.saveText}>{saving ? "Saving…" : "Save Event"}</Text></Pressable>
                    </View>
                </View></View>
            </Modal>
            <NoPetPopup visible={!gate.loading && !gate.hasPet} onLater={() => (__router.canGoBack() ? __router.back() : __router.replace("/HomeScreen" as any))} />
        </Shell>
    );
}

const styles = StyleSheet.create({
    calCard: { width: "100%", marginTop: s(10), paddingVertical: s(14), paddingHorizontal: s(12), borderRadius: s(22), backgroundColor: C.cardLight, borderWidth: 1, borderColor: C.peach },
    monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: s(6), marginBottom: s(10) },
    month: { fontFamily: "Fredoka_600SemiBold", fontSize: s(16), color: C.brown },
    weekRow: { flexDirection: "row", marginBottom: s(4) }, weekText: { flex: 1, textAlign: "center", fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.muted },
    grid: { flexDirection: "row", flexWrap: "wrap" }, cell: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: s(4) },
    dayBox: { width: s(36), height: s(36), borderRadius: s(10), alignItems: "center", justifyContent: "center" }, dayActive: { backgroundColor: C.orange },
    dayText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown }, dot: { position: "absolute", bottom: s(3), width: s(4), height: s(4), borderRadius: s(2), backgroundColor: C.orange },
    event: { flexDirection: "row", alignItems: "center", gap: s(10), padding: s(8), marginBottom: s(8), borderRadius: s(14), backgroundColor: C.card, borderWidth: 1, borderColor: C.peach },
    eventIcon: { width: s(44), height: s(44), borderRadius: s(12), alignItems: "center", justifyContent: "center" }, eventPaw: { width: s(24), height: s(24) },
    eventTitle: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown }, eventSub: { fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.muted },
    empty: { paddingVertical: s(16), textAlign: "center", fontFamily: "Nunito_600SemiBold", color: C.muted },
    modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: s(20) },
    modalCard: { backgroundColor: "#FFFFFF", borderRadius: s(18), padding: s(18), borderWidth: 1, borderColor: C.peach }, modalTitle: { fontFamily: "Fredoka_600SemiBold", fontSize: s(21), color: C.brown, marginBottom: s(12) },
    input: { borderWidth: 1, borderColor: C.peach, borderRadius: s(10), paddingHorizontal: s(12), paddingVertical: s(11), marginBottom: s(10), color: C.brown, fontFamily: "Nunito_600SemiBold" },
    hint: { fontFamily: "Nunito_400Regular", fontSize: s(11), color: C.muted }, modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: s(10), marginTop: s(16) },
    cancel: { paddingHorizontal: s(14), paddingVertical: s(10) }, cancelText: { color: C.muted, fontFamily: "Nunito_700Bold" }, save: { backgroundColor: C.orange, borderRadius: s(10), paddingHorizontal: s(16), paddingVertical: s(10) }, saveText: { color: "#FFFFFF", fontFamily: "Nunito_700Bold" },
});
