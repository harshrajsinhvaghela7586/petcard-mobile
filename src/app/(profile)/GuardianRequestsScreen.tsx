import { appAlert } from "@/components/AppDialog";
import React, { useCallback, useState } from "react";
import {
    Image,
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
type Requester = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  relationship?: string;
  photoUrl?: string | null;
};
type Request = { id: string; requester: Requester; createdAt: string };
type Kind = "guardian" | "contact";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

export default function GuardianRequestsScreen() {
  const NAV_HEIGHT = useNavHeight();
  const [fontsLoaded] = useAppFonts();
  const [pet, setPet] = useState<Pet | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  /* "Someone scanned the QR and wants my details" */
  const [contactRequests, setContactRequests] = useState<Request[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { pets } = await petcardApi.listPets();
      const selected = await resolveSelectedPet(pets ?? []);
      setPet(selected);
      if (!selected?.id) { setRequests([]); setContactRequests([]); return; }
      const data = await petcardApi.listGuardians(selected.id) as { pendingRequests?: Request[]; pendingContactRequests?: Request[] };
      setContactRequests(data.pendingContactRequests ?? []);
      const rows = data.pendingRequests ?? [];
      setRequests(rows);
      setPermissions((old) => Object.fromEntries(rows.map((r) => [r.id, old[r.id] ?? ["view_pet", "view_tasks"]])));
    } catch (error) { appAlert("Could not load guardian requests", error instanceof Error ? error.message : "Please try again."); }
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
  const decide = async (request: Request, action: "approve" | "reject", kind: Kind = "guardian") => {
    if (!pet?.id || busyId) return;
    setBusyId(request.id);
    try {
      /* The server tells the two kinds apart by id; permissions are ignored for a details request. */
      if (action === "approve") await petcardApi.approveGuardianRequest(pet.id, request.id, kind === "contact" ? ["view_pet"] : (permissions[request.id] ?? ["view_pet", "view_tasks"]));
      else await petcardApi.rejectGuardianRequest(pet.id, request.id);
      if (kind === "contact") setContactRequests((old) => old.filter((r) => r.id !== request.id));
      else setRequests((old) => old.filter((r) => r.id !== request.id));
      if (kind === "contact") appAlert(action === "approve" ? "Details shared" : "Request declined", action === "approve" ? `${request.requester.name} can now see your pet parent details.` : "Your details stay private.");
      else appAlert(action === "approve" ? "Guardian approved" : "Request declined", action === "approve" ? "The guardian can now access the pet using the permissions you selected. An email notification will be sent." : "The requester has been notified.");
    } catch (error) { appAlert("Action failed", error instanceof Error ? error.message : "Please try again."); }
    finally { setBusyId(null); }
  };
  return (
    <View style={styles.container}>
      <PawBackground /><ScreenHeader title="Guardian Requests" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SIDE, paddingBottom: NAV_HEIGHT + s(24) }}>
        <Text style={styles.intro}>{pet ? `Choose exactly what a guardian can access for ${pet.name}.` : "Create a pet profile to manage guardians."}</Text>
        {loading ? <Text style={styles.empty}>Loading requests…</Text> : null}
        {!loading && requests.length === 0 && contactRequests.length === 0 ? <View style={styles.emptyCard}><Text style={styles.empty}>No pending guardian requests.</Text></View> : null}
        {contactRequests.map((request) => {
          const r = request.requester;
          return (
            <View key={request.id} style={styles.card}>
              <View style={styles.contactBadge}><Text style={styles.contactBadgeText}>Wants your pet parent details</Text></View>
              <View style={styles.requesterHead}>
                {r.photoUrl
                  ? <Image source={{ uri: r.photoUrl }} style={styles.avatar} />
                  : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(r.name || "?").trim().charAt(0).toUpperCase()}</Text></View>}
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{r.name}</Text>
                  <Text style={styles.relationship}>{r.email}</Text>
                </View>
              </View>
              <View style={styles.detailsBox}>
                {([["Phone", r.phone || "Not provided"], ["Address", r.address || "Not provided"], ["Requested on", formatDate(request.createdAt) || "—"]] as [string, string][]).map(([label, value]) => (
                  <View key={label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.contactNote}>They scanned {pet?.name ?? "your pet"}'s QR code. If you approve, your phone number and address are shown to this person only. Approve only if you know them.</Text>
              <View style={styles.actions}>
                <Pressable style={styles.reject} onPress={() => void decide(request, "reject", "contact")} disabled={busyId === request.id}><Text style={styles.rejectText}>Decline</Text></Pressable>
                <Pressable style={styles.approve} onPress={() => void decide(request, "approve", "contact")} disabled={busyId === request.id}><Text style={styles.approveText}>{busyId === request.id ? "Please wait…" : "Share my details"}</Text></Pressable>
              </View>
            </View>
          );
        })}
        {requests.map((request) => {
          const r = request.requester;
          const details: [string, string][] = [
            ["Email", r.email || "Not provided"],
            ["Phone", r.phone || "Not provided"],
            ["Address", r.address || "Not provided"],
            ["Requested on", formatDate(request.createdAt) || "—"],
          ];
          return (
          <View key={request.id} style={styles.card}>
            <View style={styles.requesterHead}>
              {r.photoUrl
                ? <Image source={{ uri: r.photoUrl }} style={styles.avatar} />
                : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(r.name || "?").trim().charAt(0).toUpperCase()}</Text></View>}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{r.name}</Text>
                {r.relationship ? <Text style={styles.relationship}>{r.relationship}</Text> : null}
              </View>
            </View>
            <View style={styles.detailsBox}>
              {details.map(([label, value]) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
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
          );
        })}
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" }, intro: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(13), marginTop: s(8), marginBottom: s(12) },
  card: { ...cardStyle, padding: s(14), marginBottom: s(12) }, name: { fontFamily: "Fredoka_600SemiBold", color: C.brown, fontSize: s(19) }, permissionHeading: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(13), marginTop: s(14), marginBottom: s(4) },
  contactBadge: { alignSelf: "flex-start", backgroundColor: "#FFF0E2", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: s(10) },
  contactBadgeText: { fontFamily: "Nunito_700Bold", color: C.orange, fontSize: s(11) },
  contactNote: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(11), lineHeight: s(16), marginTop: s(12) },
  requesterHead: { flexDirection: "row", alignItems: "center", gap: s(12) },
  avatar: { width: s(52), height: s(52), borderRadius: s(26) },
  avatarFallback: { backgroundColor: "#FFF0E2", alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: "Fredoka_600SemiBold", color: C.orange, fontSize: s(22) },
  relationship: { fontFamily: "Nunito_700Bold", color: C.muted, fontSize: s(11), marginTop: s(2) },
  detailsBox: { backgroundColor: "#FFF8F1", borderRadius: s(12), paddingHorizontal: s(12), paddingVertical: s(6), marginTop: s(12) },
  detailRow: { paddingVertical: s(6) },
  detailLabel: { fontFamily: "Nunito_700Bold", color: C.muted, fontSize: s(10) },
  detailValue: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(12), marginTop: s(2) },
  permissionRow: { flexDirection: "row", alignItems: "center", paddingVertical: s(8), borderTopWidth: 1, borderTopColor: C.peachBorder, gap: s(8) }, permissionLabel: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(12) }, permissionDescription: { fontFamily: "Nunito_600SemiBold", color: C.muted, fontSize: s(10) },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: s(10), marginTop: s(12) }, reject: { paddingVertical: s(10), paddingHorizontal: s(14), borderRadius: s(10), backgroundColor: "#FFF0EE" }, rejectText: { fontFamily: "Nunito_700Bold", color: "#C94B43" }, approve: { paddingVertical: s(10), paddingHorizontal: s(14), borderRadius: s(10), backgroundColor: C.orange }, approveText: { fontFamily: "Nunito_700Bold", color: "#FFFFFF" },
  emptyCard: { ...cardStyle, padding: s(22), marginTop: s(8) }, empty: { textAlign: "center", color: C.muted, fontFamily: "Nunito_600SemiBold", paddingVertical: s(16) },
});
