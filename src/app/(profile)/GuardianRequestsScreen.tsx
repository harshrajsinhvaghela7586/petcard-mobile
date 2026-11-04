import React, { useCallback, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { useFocusEffect } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, cardStyle, s, useAppFonts } from "@/components/SectionHeader";
import BottomNav, { useNavHeight } from "@/components/BottomNav";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";

const PERMISSIONS = [
  { key: "view_pet", label: "View pet profile", description: "See pet name, photo and basic details" },
  { key: "view_tasks", label: "View tasks", description: "See daily care tasks and task history" },
  { key: "manage_tasks", label: "Manage tasks", description: "Create, edit and complete care tasks" },
  { key: "view_health", label: "View health records", description: "See vaccinations, medication and health notes" },
  { key: "manage_health", label: "Manage health records", description: "Add and update health records" },
  { key: "view_memories", label: "View memories", description: "See saved pet memories" },
  { key: "manage_memories", label: "Manage memories", description: "Add, edit and delete pet memories" },
] as const;
type Request = { id: string; requester: { id: string; name: string; email: string }; createdAt: string };

export default function GuardianRequestsScreen() {
  const NAV_HEIGHT = useNavHeight();
  const [fontsLoaded] = useAppFonts();
  const [pet, setPet] = useState<Pet | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { pets } = await petcardApi.listPets();
      const selected = await resolveSelectedPet(pets ?? []);
      setPet(selected);
      if (!selected?.id) { setRequests([]); return; }
      const data = await petcardApi.listGuardians(selected.id) as { pendingRequests?: Request[] };
      const rows = data.pendingRequests ?? [];
      setRequests(rows);
      setPermissions((old) => Object.fromEntries(rows.map((r) => [r.id, old[r.id] ?? ["view_pet", "view_tasks"]])));
    } catch (error) { Alert.alert("Could not load guardian requests", error instanceof Error ? error.message : "Please try again."); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (!fontsLoaded) return null;
  const toggle = (requestId: string, key: string, enabled: boolean) => setPermissions((old) => {
    const current = old[requestId] ?? ["view_pet", "view_tasks"];
    const next = enabled ? [...current, key] : current.filter((p) => p !== key);
    const requiredView: Record<string, string> = { manage_tasks: "view_tasks", manage_health: "view_health", manage_memories: "view_memories" };
    if (enabled && requiredView[key] && !next.includes(requiredView[key])) next.push(requiredView[key]);
    if (!next.includes("view_pet")) next.unshift("view_pet");
    return { ...old, [requestId]: next };
  });
  const decide = async (request: Request, action: "approve" | "reject") => {
    if (!pet?.id || busyId) return;
    setBusyId(request.id);
    try {
      if (action === "approve") await petcardApi.approveGuardianRequest(pet.id, request.id, permissions[request.id] ?? ["view_pet", "view_tasks"]);
      else await petcardApi.rejectGuardianRequest(pet.id, request.id);
      setRequests((old) => old.filter((r) => r.id !== request.id));
      Alert.alert(action === "approve" ? "Guardian approved" : "Request declined", action === "approve" ? "The guardian can now access the pet using the permissions you selected. An email notification will be sent." : "The requester has been notified.");
    } catch (error) { Alert.alert("Action failed", error instanceof Error ? error.message : "Please try again."); }
    finally { setBusyId(null); }
  };
  return (
    <View style={styles.container}>
      <PawBackground /><ScreenHeader title="Guardian Requests" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SIDE, paddingBottom: NAV_HEIGHT + s(24) }}>
        <Text style={styles.intro}>{pet ? `Choose exactly what a guardian can access for ${pet.name}.` : "Create a pet profile to manage guardians."}</Text>
        {loading ? <Text style={styles.empty}>Loading requests…</Text> : null}
        {!loading && requests.length === 0 ? <View style={styles.emptyCard}><Text style={styles.empty}>No pending guardian requests.</Text></View> : null}
        {requests.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text style={styles.name}>{request.requester.name}</Text>
            <Text style={styles.email}>{request.requester.email}</Text>
            <Text style={styles.permissionHeading}>Access to grant</Text>
            {PERMISSIONS.map((item) => {
              const enabled = (permissions[request.id] ?? []).includes(item.key);
              return <View key={item.key} style={styles.permissionRow}>
                <View style={{ flex: 1 }}><Text style={styles.permissionLabel}>{item.label}</Text><Text style={styles.permissionDescription}>{item.description}</Text></View>
                <Switch value={enabled} onValueChange={(value) => toggle(request.id, item.key, value)} disabled={item.key === "view_pet"} trackColor={{ false: "#E7D9CF", true: C.orange }} thumbColor="#FFFFFF" />
              </View>;
            })}
            <View style={styles.actions}>
              <Pressable style={styles.reject} onPress={() => void decide(request, "reject")} disabled={busyId === request.id}><Text style={styles.rejectText}>Decline</Text></Pressable>
              <Pressable style={styles.approve} onPress={() => void decide(request, "approve")} disabled={busyId === request.id}><Text style={styles.approveText}>{busyId === request.id ? "Please wait…" : "Approve Access"}</Text></Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" }, intro: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(13), marginTop: s(8), marginBottom: s(12) },
  card: { ...cardStyle, padding: s(14), marginBottom: s(12) }, name: { fontFamily: "Fredoka_600SemiBold", color: C.brown, fontSize: s(19) }, email: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(11), marginTop: s(2) }, permissionHeading: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(13), marginTop: s(14), marginBottom: s(4) },
  permissionRow: { flexDirection: "row", alignItems: "center", paddingVertical: s(8), borderTopWidth: 1, borderTopColor: C.peachBorder, gap: s(8) }, permissionLabel: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(12) }, permissionDescription: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(10) },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: s(10), marginTop: s(12) }, reject: { paddingVertical: s(10), paddingHorizontal: s(14), borderRadius: s(10), backgroundColor: "#FFF0EE" }, rejectText: { fontFamily: "Nunito_700Bold", color: "#C94B43" }, approve: { paddingVertical: s(10), paddingHorizontal: s(14), borderRadius: s(10), backgroundColor: C.orange }, approveText: { fontFamily: "Nunito_700Bold", color: "#FFFFFF" },
  emptyCard: { ...cardStyle, padding: s(22), marginTop: s(8) }, empty: { textAlign: "center", color: C.muted, fontFamily: "Nunito_600SemiBold", paddingVertical: s(16) },
});
