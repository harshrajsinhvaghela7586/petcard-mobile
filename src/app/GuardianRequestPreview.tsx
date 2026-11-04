import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ScreenHeader, { PawBackground } from "@/components/SectionHeader";
import { petcardApi } from "@/services/petcardApi";
import { useAuth } from "@/context/AuthContext";
import { pendingGuardianInvite } from "@/services/pendingGuardianInvite";
import { ApiError } from "@/services/apiClient";

type PetPreview = { name: string; type: string; breed?: string; gender?: string; birthDate?: string | null; weightKg?: number | null; photoUrl?: string | null; avatarKey?: string | null; ownerName?: string };
export default function GuardianRequestPreview() {
  const params = useLocalSearchParams<{ token?: string; mode?: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const inviteMode = params.mode === "invite";
  const { user, status } = useAuth();
  const [pet, setPet] = useState<PetPreview | null>(null);
  const [ownerName, setOwnerName] = useState("Pet parent");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!token || status === "loading") return;
    (async () => {
      try {
        if (inviteMode && status === "signedOut") {
          await pendingGuardianInvite.save(token);
          if (alive) router.replace("/(auth)/login" as any);
          return;
        }
        if (inviteMode) {
          const data = await petcardApi.lookupGuardianInvite(token) as any;
          if (alive) {
            setPet(data.pet as PetPreview);
            setOwnerName(data.invitedBy || "Pet parent");
          }
        } else {
          const data = await petcardApi.lookupPublicPetQr(token);
          if (alive) {
            setPet(data.pet as PetPreview);
            setOwnerName((data.pet as any).ownerName || "Pet parent");
          }
        }
      } catch (error) {
        if (inviteMode && error instanceof ApiError && error.code === "INVITE_INVALID") await pendingGuardianInvite.clear();
        if (alive) Alert.alert("PetCard invite unavailable", error instanceof Error ? error.message : "This QR code is invalid or expired.", [{ text: "OK", onPress: () => router.back() }]);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [token, inviteMode, status]);

  const submit = async () => {
    if (!token || submitting) return;
    if (status !== "signedIn") {
      if (inviteMode) await pendingGuardianInvite.save(token);
      router.replace("/(auth)/login" as any);
      return;
    }
    setSubmitting(true);
    try {
      if (inviteMode) await petcardApi.redeemGuardianInvite(token);
      else await petcardApi.requestGuardianByPetQr(token);
      if (inviteMode) await pendingGuardianInvite.clear();
      Alert.alert("Request sent", "The pet owner has been notified. Guardian access will be granted only after the owner approves your request.", [{ text: "OK", onPress: () => router.replace("/HomeScreen" as any) }]);
    } catch (error) {
      if (error instanceof ApiError && error.code === "GUARDIAN_LIMIT") {
        Alert.alert("Guardian limit reached", "This pet already has the maximum of 2 co-guardians. Please ask the owner to free up a spot.");
      } else {
        Alert.alert("Could not send request", error instanceof Error ? error.message : "Please try again.");
      }
    } finally { setSubmitting(false); }
  };

  return <View style={s.root}><PawBackground /><ScreenHeader title="Guardian Request" /><ScrollView contentContainerStyle={s.content}>
    {loading ? <ActivityIndicator size="large" color="#F28A32" /> : pet ? <>
      <View style={s.card}>
        {pet.photoUrl ? <Image source={{ uri: pet.photoUrl }} style={s.photo} /> : <View style={s.photoFallback}><Text style={{ fontSize: 42 }}>🐾</Text></View>}
        <Text style={s.name}>{pet.name}</Text><Text style={s.type}>{pet.type}{pet.breed ? ` • ${pet.breed}` : ""}</Text>
        <Text style={s.owner}>Pet parent: {ownerName}</Text>
        <View style={s.grid}>{[["Gender", pet.gender || "Not provided"], ["Date of birth", pet.birthDate || "Not provided"], ["Weight", pet.weightKg != null ? `${pet.weightKg} kg` : "Not provided"]].map(([k, v]) => <View style={s.info} key={k}><Text style={s.label}>{k}</Text><Text style={s.value}>{v}</Text></View>)}</View>
        <Text style={s.privacy}>Private pet records and guardian permissions remain unavailable until the owner approves your request.</Text>
      </View>
      <View style={s.requestCard}><Text style={s.section}>Your guardian request</Text><Text style={s.note}>Review the pet and owner details, then submit your request. The owner will decide whether to approve you and which permissions to grant.</Text>
        <Pressable disabled={submitting} onPress={submit}><LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>{submitting ? <ActivityIndicator color="white" /> : <Text style={s.buttonText}>{status === "signedIn" ? "Submit Guardian Request" : "Login to Continue"}</Text>}</LinearGradient></Pressable>
        {inviteMode ? <Pressable style={{ alignItems: "center", padding: 12 }} onPress={async () => { await pendingGuardianInvite.clear(); router.replace(status === "signedIn" ? "/HomeScreen" as any : "/(auth)/login" as any); }}><Text style={{ color: "#8A7668", fontWeight: "700" }}>Cancel invitation</Text></Pressable> : null}
      </View>
    </> : null}
  </ScrollView></View>;
}
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: "#FFFCF8" }, content: { padding: 20, gap: 16 }, card: { backgroundColor: "white", borderRadius: 24, padding: 20, alignItems: "center", elevation: 2 }, photo: { width: 120, height: 120, borderRadius: 60 }, photoFallback: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFF0E2", alignItems: "center", justifyContent: "center" }, name: { fontSize: 24, fontWeight: "900", color: "#352A24", marginTop: 12 }, type: { color: "#88766A", marginTop: 4 }, owner: { color: "#6F6259", fontSize: 13, marginTop: 8, fontWeight: "700" }, grid: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 22 }, info: { width: "48%", backgroundColor: "#FFF8F1", padding: 12, borderRadius: 14 }, label: { fontSize: 11, color: "#927F71", fontWeight: "700" }, value: { fontSize: 14, color: "#40332B", fontWeight: "800", marginTop: 5 }, privacy: { fontSize: 12, color: "#8C796B", textAlign: "center", marginTop: 18, lineHeight: 18 }, requestCard: { backgroundColor: "white", borderRadius: 22, padding: 18 }, section: { fontSize: 18, fontWeight: "900", color: "#382C25" }, note: { fontSize: 13, color: "#796B61", lineHeight: 20, marginVertical: 12 }, button: { borderRadius: 18, padding: 16, alignItems: "center" }, buttonText: { color: "white", fontSize: 15, fontWeight: "900" } });
