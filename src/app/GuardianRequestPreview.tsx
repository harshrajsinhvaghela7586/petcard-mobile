import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader, { PawBackground } from "@/components/SectionHeader";
import { petcardApi } from "@/services/petcardApi";
import { useAuth } from "@/context/AuthContext";
import { pendingGuardianInvite } from "@/services/pendingGuardianInvite";
import { ApiError } from "@/services/apiClient";

type OwnerPreview = { name: string; phone?: string; address?: string; relationship?: string; photoUrl?: string | null };
type ViewerRole = "none" | "owner" | "co_guardian";
type ContactStatus = "none" | "pending" | "approved" | "rejected" | "expired";
type PetPreview = { name: string; type: string; breed?: string; gender?: string; birthDate?: string | null; weightKg?: number | null; photoUrl?: string | null; avatarKey?: string | null; avatarLocalId?: string | null; activeStickerKey?: string | null; ownerName?: string };

/* ---- Pet picture: static requires (Metro needs literal paths) ---- */
const AVATAR_IMAGES: Record<string, any> = {
  huchiko: require("../../assets/images/chooseAvatar/DogAvatar/Huchiko.png"),
  browny: require("../../assets/images/chooseAvatar/DogAvatar/Browny.png"),
  noir: require("../../assets/images/chooseAvatar/DogAvatar/Noir.png"),
  kiki: require("../../assets/images/chooseAvatar/CatAvatar/Kiki.png"),
  oreo: require("../../assets/images/chooseAvatar/CatAvatar/Oreo.png"),
  cupid: require("../../assets/images/chooseAvatar/RabbitAvatar/Cupid.png"),
  waffle: require("../../assets/images/chooseAvatar/RabbitAvatar/Waffle.png"),
};
const STICKER_IMAGES: Record<string, any[]> = {
  huchiko: [
    require("../../assets/images/chooseSticker/Huchiko/image1.png"),
    require("../../assets/images/chooseSticker/Huchiko/image2.png"),
    require("../../assets/images/chooseSticker/Huchiko/image3.png"),
    require("../../assets/images/chooseSticker/Huchiko/image4.png"),
    require("../../assets/images/chooseSticker/Huchiko/image5.png"),
    require("../../assets/images/chooseSticker/Huchiko/image6.png"),
    require("../../assets/images/chooseSticker/Huchiko/image7.png"),
    require("../../assets/images/chooseSticker/Huchiko/image8.png"),
    require("../../assets/images/chooseSticker/Huchiko/image9.png"),
    require("../../assets/images/chooseSticker/Huchiko/image10.png"),
    require("../../assets/images/chooseSticker/Huchiko/image11.png"),
    require("../../assets/images/chooseSticker/Huchiko/image12.png"),
    require("../../assets/images/chooseSticker/Huchiko/image13.png"),
    require("../../assets/images/chooseSticker/Huchiko/image14.png"),
    require("../../assets/images/chooseSticker/Huchiko/image15.png"),
  ],
  browny: [
    require("../../assets/images/chooseSticker/Browny/image1.png"),
    require("../../assets/images/chooseSticker/Browny/image2.png"),
    require("../../assets/images/chooseSticker/Browny/image3.png"),
    require("../../assets/images/chooseSticker/Browny/image4.png"),
    require("../../assets/images/chooseSticker/Browny/image5.png"),
    require("../../assets/images/chooseSticker/Browny/image6.png"),
    require("../../assets/images/chooseSticker/Browny/image7.png"),
    require("../../assets/images/chooseSticker/Browny/image8.png"),
    require("../../assets/images/chooseSticker/Browny/image9.png"),
    require("../../assets/images/chooseSticker/Browny/image10.png"),
    require("../../assets/images/chooseSticker/Browny/image11.png"),
    require("../../assets/images/chooseSticker/Browny/image12.png"),
    require("../../assets/images/chooseSticker/Browny/image13.png"),
    require("../../assets/images/chooseSticker/Browny/image14.png"),
    require("../../assets/images/chooseSticker/Browny/image15.png"),
  ],
  noir: [
    require("../../assets/images/chooseSticker/Noir/image1.png"),
    require("../../assets/images/chooseSticker/Noir/image2.png"),
    require("../../assets/images/chooseSticker/Noir/image3.png"),
    require("../../assets/images/chooseSticker/Noir/image4.png"),
    require("../../assets/images/chooseSticker/Noir/image5.png"),
    require("../../assets/images/chooseSticker/Noir/image6.png"),
    require("../../assets/images/chooseSticker/Noir/image7.png"),
    require("../../assets/images/chooseSticker/Noir/image8.png"),
    require("../../assets/images/chooseSticker/Noir/image9.png"),
    require("../../assets/images/chooseSticker/Noir/image10.png"),
    require("../../assets/images/chooseSticker/Noir/image11.png"),
    require("../../assets/images/chooseSticker/Noir/image12.png"),
    require("../../assets/images/chooseSticker/Noir/image13.png"),
    require("../../assets/images/chooseSticker/Noir/image14.png"),
    require("../../assets/images/chooseSticker/Noir/image15.png"),
  ],
  kiki: [
    require("../../assets/images/chooseSticker/Kiki/image1.png"),
    require("../../assets/images/chooseSticker/Kiki/image2.png"),
    require("../../assets/images/chooseSticker/Kiki/image3.png"),
    require("../../assets/images/chooseSticker/Kiki/image4.png"),
    require("../../assets/images/chooseSticker/Kiki/image5.png"),
    require("../../assets/images/chooseSticker/Kiki/image6.png"),
    require("../../assets/images/chooseSticker/Kiki/image7.png"),
    require("../../assets/images/chooseSticker/Kiki/image8.png"),
    require("../../assets/images/chooseSticker/Kiki/image9.png"),
    require("../../assets/images/chooseSticker/Kiki/image10.png"),
    require("../../assets/images/chooseSticker/Kiki/image11.png"),
    require("../../assets/images/chooseSticker/Kiki/image12.png"),
    require("../../assets/images/chooseSticker/Kiki/image13.png"),
    require("../../assets/images/chooseSticker/Kiki/image14.png"),
    require("../../assets/images/chooseSticker/Kiki/image15.png"),
  ],
  oreo: [
    require("../../assets/images/chooseSticker/Oreo/image1.png"),
    require("../../assets/images/chooseSticker/Oreo/image2.png"),
    require("../../assets/images/chooseSticker/Oreo/image3.png"),
    require("../../assets/images/chooseSticker/Oreo/image4.png"),
    require("../../assets/images/chooseSticker/Oreo/image5.png"),
    require("../../assets/images/chooseSticker/Oreo/image6.png"),
    require("../../assets/images/chooseSticker/Oreo/image7.png"),
    require("../../assets/images/chooseSticker/Oreo/image8.png"),
    require("../../assets/images/chooseSticker/Oreo/image9.png"),
    require("../../assets/images/chooseSticker/Oreo/image10.png"),
    require("../../assets/images/chooseSticker/Oreo/image11.png"),
    require("../../assets/images/chooseSticker/Oreo/image12.png"),
    require("../../assets/images/chooseSticker/Oreo/image13.png"),
    require("../../assets/images/chooseSticker/Oreo/image14.png"),
    require("../../assets/images/chooseSticker/Oreo/image15.png"),
  ],
  cupid: [
    require("../../assets/images/chooseSticker/Cupid/image1.png"),
    require("../../assets/images/chooseSticker/Cupid/image2.png"),
    require("../../assets/images/chooseSticker/Cupid/image3.png"),
    require("../../assets/images/chooseSticker/Cupid/image4.png"),
    require("../../assets/images/chooseSticker/Cupid/image5.png"),
    require("../../assets/images/chooseSticker/Cupid/image6.png"),
    require("../../assets/images/chooseSticker/Cupid/image7.png"),
    require("../../assets/images/chooseSticker/Cupid/image8.png"),
    require("../../assets/images/chooseSticker/Cupid/image9.png"),
    require("../../assets/images/chooseSticker/Cupid/image10.png"),
    require("../../assets/images/chooseSticker/Cupid/image11.png"),
    require("../../assets/images/chooseSticker/Cupid/image12.png"),
    require("../../assets/images/chooseSticker/Cupid/image13.png"),
    require("../../assets/images/chooseSticker/Cupid/image14.png"),
    require("../../assets/images/chooseSticker/Cupid/image15.png"),
  ],
  waffle: [
    require("../../assets/images/chooseSticker/Waffle/image1.png"),
    require("../../assets/images/chooseSticker/Waffle/image2.png"),
    require("../../assets/images/chooseSticker/Waffle/image3.png"),
    require("../../assets/images/chooseSticker/Waffle/image4.png"),
    require("../../assets/images/chooseSticker/Waffle/image5.png"),
    require("../../assets/images/chooseSticker/Waffle/image6.png"),
    require("../../assets/images/chooseSticker/Waffle/image7.png"),
    require("../../assets/images/chooseSticker/Waffle/image8.png"),
    require("../../assets/images/chooseSticker/Waffle/image9.png"),
    require("../../assets/images/chooseSticker/Waffle/image10.png"),
    require("../../assets/images/chooseSticker/Waffle/image11.png"),
    require("../../assets/images/chooseSticker/Waffle/image12.png"),
    require("../../assets/images/chooseSticker/Waffle/image13.png"),
    require("../../assets/images/chooseSticker/Waffle/image14.png"),
    require("../../assets/images/chooseSticker/Waffle/image15.png"),
  ],
};

/* "browny-3" -> sticker image 3 of the Browny set. */
function stickerSource(key?: string | null) {
  const m = /^([a-z]+)-(\d{1,2})$/i.exec(key || "");
  if (!m) return null;
  return STICKER_IMAGES[m[1].toLowerCase()]?.[Number(m[2]) - 1] ?? null;
}

/* Avatar slug from avatarLocalId, else sticker prefix, else avatarKey ("dog_browny"). */
function avatarSource(pet: PetPreview) {
  const slug = (pet.avatarLocalId || (pet.activeStickerKey || "").split("-")[0] || (pet.avatarKey || "").split("_").pop() || "").toLowerCase();
  return AVATAR_IMAGES[slug] ?? null;
}

/*
 * What the user chose for this pet:
 *   1. uploaded photo  2. active sticker  3. chosen avatar  4. paw icon
 */
function petPicture(pet: PetPreview): { uri?: string; source?: any } | null {
  if (pet.photoUrl) return { uri: pet.photoUrl };
  const sticker = stickerSource(pet.activeStickerKey);
  if (sticker) return { source: sticker };
  const avatar = avatarSource(pet);
  return avatar ? { source: avatar } : null;
}

const ORANGE = "#F28A32";
const BROWN = "#352A24";
const MUTED = "#8A7668";
const TINT = "#FFF4EA";
const LINE = "#F3E6DA";

const cap = (v?: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");

function petAge(birth?: string | null): string {
  if (!birth) return "Not provided";
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return "Not provided";
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 0) return "Not provided";
  if (months < 1) return "< 1 month";
  const y = Math.floor(months / 12), m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? "yr" : "yrs"}`);
  if (m) parts.push(`${m} ${m === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

function formatDob(birth?: string | null): string {
  if (!birth) return "Not provided";
  const d = new Date(birth);
  if (Number.isNaN(d.getTime())) return String(birth).slice(0, 10);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function genderIcon(g?: string): keyof typeof Ionicons.glyphMap {
  const v = (g || "").toLowerCase();
  if (v === "male") return "male";
  if (v === "female") return "female";
  return "male-female";
}

function Avatar({ uri, source, size, fallback }: { uri?: string | null; source?: any; size: number; fallback: React.ReactNode }) {
  return (
    <View style={[s.avatarRing, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      {uri || source
        ? <Image source={uri ? { uri } : source} resizeMode={uri ? "cover" : "contain"} style={{ width: size, height: size, borderRadius: size / 2 }} />
        : <View style={[s.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>{fallback}</View>}
    </View>
  );
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={s.stat}>
      <View style={s.statIcon}><Ionicons name={icon} size={17} color={ORANGE} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.statLabel}>{label}</Text>
        <Text style={s.statValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function InfoTile({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onPress?: () => void }) {
  const body = (
    <View style={s.tile}>
      <View style={s.statIcon}><Ionicons name={icon} size={17} color={ORANGE} /></View>
      <Text style={[s.statLabel, { marginTop: 10 }]}>{label}</Text>
      <Text style={s.tileValue}>{value}</Text>
    </View>
  );
  return <View style={{ flex: 1 }}>{onPress ? <Pressable style={{ flex: 1 }} onPress={onPress}>{body}</Pressable> : body}</View>;
}

export default function GuardianRequestPreview() {
  const params = useLocalSearchParams<{ token?: string; mode?: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const inviteMode = params.mode === "invite";
  const { user, status } = useAuth();
  const [pet, setPet] = useState<PetPreview | null>(null);
  /* Pet-parent details. The server sends them ONLY after the owner approved this user's request, so null = locked. */
  const [owner, setOwner] = useState<OwnerPreview | null>(null);
  const [contactStatus, setContactStatus] = useState<ContactStatus>("none");
  /* ISO time when the next request is allowed (24h rule) and when approved access ends (3 days). */
  const [nextRequestAt, setNextRequestAt] = useState<string | null>(null);
  const [accessExpiresAt, setAccessExpiresAt] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  /* When the request was made / reached the pet parent / was answered: shown in the "Check status" popup. */
  const [timeline, setTimeline] = useState<{ requestedAt?: string | null; deliveredAt?: string | null; decidedAt?: string | null }>({});
  const [statusOpen, setStatusOpen] = useState(false);
  /* Who is looking: the pet's owner, an existing guardian, or someone new. */
  const [viewer, setViewer] = useState<{ role: ViewerRole; petId?: string | null }>({ role: "none" });
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
            setOwner(data.owner || { name: data.invitedBy || "Pet parent" });
          }
        } else {
          const data = await petcardApi.lookupPublicPetQr(token);
          if (alive) {
            setPet(data.pet as PetPreview);
            setOwner((data as any).owner || null);
            setContactStatus((data as any).contactAccess?.status || "none");
            setTimeline({ requestedAt: (data as any).contactAccess?.requestedAt, deliveredAt: (data as any).contactAccess?.deliveredAt, decidedAt: (data as any).contactAccess?.decidedAt });
            setNextRequestAt((data as any).contactAccess?.nextRequestAt || null);
            setAccessExpiresAt((data as any).contactAccess?.expiresAt || null);
            setViewer((data as any).viewer || { role: "none" });
          }
        }
      } catch (error) {
        if (!inviteMode && error instanceof ApiError && error.code === "ALREADY_OWNER") {
          if (alive) Alert.alert("This is your own pet", "You can't open your own pet's QR code as a scan.", [{ text: "OK", onPress: () => router.back() }]);
          return;
        }
        if (inviteMode && error instanceof ApiError && (error.code === "ALREADY_OWNER" || error.code === "ALREADY_MEMBER")) {
          await pendingGuardianInvite.clear();
          if (alive) setViewer({ role: error.code === "ALREADY_OWNER" ? "owner" : "co_guardian" });
          return;
        }
        if (inviteMode && error instanceof ApiError && error.code === "INVITE_INVALID") await pendingGuardianInvite.clear();
        if (alive) Alert.alert("PetCard invite unavailable", error instanceof Error ? error.message : "This QR code is invalid or expired.", [{ text: "OK", onPress: () => router.back() }]);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [token, inviteMode, status, reloadKey]);

  /* Waiting for the pet parent? Re-check when the user comes back to the app. */
  useEffect(() => {
    if (inviteMode || contactStatus !== "pending") return;
    const sub = AppState.addEventListener("change", (st) => { if (st === "active") setReloadKey((k) => k + 1); });
    return () => sub.remove();
  }, [inviteMode, contactStatus]);

  const waitUntil = nextRequestAt && new Date(nextRequestAt).getTime() > Date.now() ? new Date(nextRequestAt) : null;

  const submit = async () => {
    if (!token || submitting || viewer.role !== "none") return;
    if (status !== "signedIn") {
      if (inviteMode) await pendingGuardianInvite.save(token);
      router.replace("/(auth)/login" as any);
      return;
    }
    setSubmitting(true);
    try {
      if (!inviteMode) {
        /* QR scan: ask the pet parent for permission to see their details. Nothing is revealed until they approve. */
        const res = await petcardApi.requestGuardianByPetQr(token) as any;
        const next: ContactStatus = res?.status === "approved" ? "approved" : "pending";
        setContactStatus(next);
        if (next === "approved") setReloadKey((k) => k + 1);
        else if (res?.created === false) Alert.alert("Already requested", "Your request is already waiting for the pet parent.");
        else Alert.alert("Request sent", "The pet parent has been notified by app notification and email. Their details will appear here only if they approve.");
        return;
      }
      await petcardApi.redeemGuardianInvite(token);
      await pendingGuardianInvite.clear();
      Alert.alert("Request sent", "The pet owner has been notified. Guardian access will be granted only after the owner approves your request.", [{ text: "OK", onPress: () => router.replace("/HomeScreen" as any) }]);
    } catch (error) {
      if (error instanceof ApiError && error.code === "GUARDIAN_LIMIT") {
        Alert.alert("Guardian limit reached", "This pet already has the maximum of 2 co-guardians. Please ask the owner to free up a spot.");
      } else if (error instanceof ApiError && error.code === "CONTACT_REQUEST_COOLDOWN") {
        const at = (error.data as any)?.retryAt as string | undefined;
        if (at) setNextRequestAt(at);
        Alert.alert("Please wait", at ? `You can send only one request every 24 hours. Try again after ${new Date(at).toLocaleString()}.` : error.message);
      } else {
        Alert.alert("Could not send request", error instanceof Error ? error.message : "Please try again.");
      }
    } finally { setSubmitting(false); }
  };

  const openPetCard = () => router.replace({ pathname: "/DigitalPetCardScreen", params: viewer.petId ? { petId: viewer.petId } : {} } as any);

  const callOwner = () => { if (owner?.phone) void Linking.openURL(`tel:${owner.phone}`); };

  return (
    <View style={s.root}>
      <PawBackground />
      <ScreenHeader title={inviteMode ? "Guardian Request" : "Pet Details"} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 40 }} /> : !pet && viewer.role !== "none" ? (
          <View style={s.requestCard}>
            <Text style={s.section}>{viewer.role === "owner" ? "This is your pet" : "You already look after this pet"}</Text>
            <Text style={s.note}>{viewer.role === "owner" ? "You are the owner of this pet, so there is nothing to request." : "You already have guardian access to this pet, so there is nothing to request."}</Text>
            <Pressable onPress={() => router.replace("/HomeScreen" as any)}>
              <LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}><Text style={s.buttonText}>Go to Home</Text></LinearGradient>
            </Pressable>
          </View>
        ) : pet ? <>

          {/* ================= PET CARD ================= */}
          <View style={s.card}>
            <LinearGradient colors={["#FFE9D6", "#FFF6EE"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.petHeader}>
              <Avatar
                uri={petPicture(pet)?.uri}
                source={petPicture(pet)?.source}
                size={84}
                fallback={<Ionicons name="paw" size={38} color={ORANGE} />}
              />
              <View style={s.petHeaderInfo}>
                <Text style={s.tag}>PET</Text>
                <Text style={s.petName} numberOfLines={2}>{pet.name}</Text>
                <View style={s.chips}>
                  {pet.type ? <View style={s.chip}><Text style={s.chipText}>{cap(pet.type)}</Text></View> : null}
                  {pet.breed ? <View style={[s.chip, s.chipSoft]}><Text style={[s.chipText, { color: BROWN }]} numberOfLines={1}>{pet.breed}</Text></View> : null}
                </View>
              </View>
            </LinearGradient>

            <View style={s.statGrid}>
              <View style={s.statRow}>
                <Stat icon={genderIcon(pet.gender)} label="Gender" value={pet.gender ? cap(pet.gender) : "Not provided"} />
                <Stat icon="barbell-outline" label="Weight" value={pet.weightKg != null ? `${pet.weightKg} kg` : "Not provided"} />
              </View>
              <View style={s.statRow}>
                <Stat icon="hourglass-outline" label="Age" value={petAge(pet.birthDate)} />
                <Stat icon="calendar-outline" label="Date of birth" value={formatDob(pet.birthDate)} />
              </View>
            </View>
          </View>

          {/* ================= OWNER CARD ================= */}
          {owner && viewer.role !== "owner" ? <View style={s.card}>
            <View style={s.ownerBody}>
              <Text style={s.tag}>PET PARENT</Text>
              <View style={s.ownerHead}>
                <Avatar
                  uri={owner.photoUrl}
                  size={60}
                  fallback={<Text style={s.initial}>{(owner.name || "?").trim().charAt(0).toUpperCase()}</Text>}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.ownerName} numberOfLines={2}>{owner.name}</Text>
                  {owner.relationship ? <View style={[s.chip, { alignSelf: "flex-start", marginTop: 6 }]}><Text style={s.chipText}>{owner.relationship}</Text></View> : null}
                </View>
              </View>

              {owner.phone !== undefined || owner.address !== undefined ? (
                <View style={s.ownerGrid}>
                  <InfoTile icon="call-outline" label="Phone number" value={owner.phone || "Not provided"} onPress={owner.phone ? callOwner : undefined} />
                  <InfoTile icon="location-outline" label="Address" value={owner.address || "Not provided"} />
                </View>
              ) : null}
            </View>

            <View style={s.privacyBar}>
              <Ionicons name={inviteMode ? "lock-closed" : "checkmark-circle"} size={14} color={MUTED} />
              <Text style={s.privacy}>{inviteMode ? "Private pet records and guardian permissions stay locked until the owner approves your request." : "The pet parent approved your request. Please use these details only to contact them about this pet."}</Text>
            </View>
          </View> : null}

          {/* ================= REQUEST ================= */}
          {viewer.role !== "none" ? (
            <View style={s.requestCard}>
              <View style={s.ownBadge}>
                <Ionicons name={viewer.role === "owner" ? "heart" : "shield-checkmark"} size={18} color={ORANGE} />
                <Text style={s.ownBadgeText}>{viewer.role === "owner" ? "This is your pet" : "This is already your pet"}</Text>
              </View>
              <Text style={s.note}>{viewer.role === "owner"
                ? "You are the owner of this pet. You can open its PetCard anytime."
                : "You are already a guardian of this pet, so you don't need to send a request."}</Text>
              <Pressable onPress={openPetCard}>
                <LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>
                  <Text style={s.buttonText}>Open Pet Card</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : !inviteMode ? (
            contactStatus === "approved" ? null : (
            <View style={s.requestCard}>
              {contactStatus === "pending" ? (
                <>
                  <View style={s.ownBadge}>
                    <Ionicons name="time" size={18} color={ORANGE} />
                    <Text style={s.ownBadgeText}>Waiting for the pet parent</Text>
                  </View>
                  <Text style={s.note}>We told the pet parent by app notification and email. Their details will appear here only if they approve.</Text>
                  <Pressable onPress={() => { setReloadKey((k) => k + 1); setStatusOpen(true); }}>
                    <LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>
                      <Text style={s.buttonText}>Check status</Text>
                    </LinearGradient>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={s.ownBadge}>
                    <Ionicons name="lock-closed" size={18} color={ORANGE} />
                    <Text style={s.ownBadgeText}>Pet parent details are private</Text>
                  </View>
                  <Text style={s.note}>{waitUntil
                    ? `You can send only one request every 24 hours. You can request again after ${waitUntil.toLocaleString()}.`
                    : contactStatus === "rejected"
                    ? "The pet parent declined your earlier request. You can ask again now."
                    : contactStatus === "expired"
                    ? "Your 3-day access has ended. Send a new request to see the pet parent's details again."
                    : "Request access and the pet parent will get a notification and an email. Their details are shown to you only if they approve, for 3 days."}</Text>
                  <Pressable disabled={submitting || (status === "signedIn" && !!waitUntil)} onPress={submit} style={status === "signedIn" && waitUntil ? { opacity: 0.5 } : undefined}>
                    <LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>
                      {submitting ? <ActivityIndicator color="white" /> : <Text style={s.buttonText}>{status === "signedIn" ? (contactStatus === "rejected" || contactStatus === "expired" ? "Request Again" : "Request Pet Parent Details") : "Login to Continue"}</Text>}
                    </LinearGradient>
                  </Pressable>
                </>
              )}
            </View>
            )
          ) : (
          <View style={s.requestCard}>
            <Text style={s.section}>Your guardian request</Text>
            <Text style={s.note}>Review the pet and owner details, then submit your request. The owner will decide whether to approve you and which permissions to grant.</Text>
            <Pressable disabled={submitting} onPress={submit}>
              <LinearGradient colors={["#FFB14A", "#F07825"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>
                {submitting ? <ActivityIndicator color="white" /> : <Text style={s.buttonText}>{status === "signedIn" ? "Submit Guardian Request" : "Login to Continue"}</Text>}
              </LinearGradient>
            </Pressable>
            {inviteMode ? (
              <Pressable style={{ alignItems: "center", padding: 12 }} onPress={async () => { await pendingGuardianInvite.clear(); router.replace(status === "signedIn" ? "/HomeScreen" as any : "/(auth)/login" as any); }}>
                <Text style={{ color: MUTED, fontWeight: "700" }}>Cancel invitation</Text>
              </Pressable>
            ) : null}
          </View>
          )}
        </> : null}
      </ScrollView>
      <Modal visible={statusOpen} transparent animationType="fade" onRequestClose={() => setStatusOpen(false)}>
        <View style={s.modalBack}>
          <View style={s.modalCard}>
            <Text style={s.section}>Request status</Text>
            {(() => {
              const answered = contactStatus === "approved" || contactStatus === "rejected" || contactStatus === "expired";
              const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : "");
              const steps: { label: string; done: boolean; at?: string; bad?: boolean }[] = [
                { label: "Requested", done: true, at: when(timeline.requestedAt) },
                { label: "Delivered to pet parent", done: !!timeline.deliveredAt || answered, at: when(timeline.deliveredAt) },
                contactStatus === "rejected"
                  ? { label: "Declined", done: true, bad: true, at: when(timeline.decidedAt) }
                  : contactStatus === "approved" || contactStatus === "expired"
                  ? { label: "Approved", done: true, at: when(timeline.decidedAt) }
                  : { label: "Waiting for approval", done: false },
              ];
              return steps.map((st, i) => (
                <View key={st.label} style={s.stepRow}>
                  <View style={s.stepRail}>
                    <View style={[s.stepDot, st.done && { backgroundColor: st.bad ? "#E5484D" : "#5E9B2D", borderColor: st.bad ? "#E5484D" : "#5E9B2D" }]}>
                      {st.done ? <Ionicons name={st.bad ? "close" : "checkmark"} size={13} color="#fff" /> : null}
                    </View>
                    {i < steps.length - 1 ? <View style={[s.stepLine, st.done && { backgroundColor: "#5E9B2D" }]} /> : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 14 }}>
                    <Text style={[s.stepLabel, !st.done && { color: MUTED }]}>{st.label}</Text>
                    {st.at ? <Text style={s.stepTime}>{st.at}</Text> : null}
                  </View>
                </View>
              ));
            })()}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
              <Pressable style={[s.modalBtn, { backgroundColor: TINT }]} onPress={() => setReloadKey((k) => k + 1)}><Text style={[s.modalBtnText, { color: BROWN }]}>Refresh</Text></Pressable>
              <Pressable style={[s.modalBtn, { backgroundColor: ORANGE }]} onPress={() => setStatusOpen(false)}><Text style={s.modalBtnText}>Close</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const shadow = { shadowColor: "#8A5A2B", shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 } as const;

const s = StyleSheet.create({
  modalBack: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard: { width: "100%", maxWidth: 380, backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  stepRow: { flexDirection: "row", gap: 12 },
  stepRail: { alignItems: "center", width: 22 },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: LINE, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  stepLine: { flex: 1, width: 2, backgroundColor: LINE, marginVertical: 2 },
  stepLabel: { fontSize: 14, fontWeight: "700", color: BROWN },
  stepTime: { fontSize: 11, color: MUTED, marginTop: 2 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  modalBtnText: { fontWeight: "700", color: "#fff" },
  root: { flex: 1, backgroundColor: "#FFFCF8" },
  content: { padding: 20, paddingBottom: 40, gap: 16 },

  card: { backgroundColor: "white", borderRadius: 26, overflow: "hidden", ...shadow },

  /* pet */
  petHeader: { flexDirection: "row", alignItems: "center", gap: 16, padding: 18 },
  petHeaderInfo: { flex: 1 },
  tag: { fontSize: 11, fontWeight: "900", color: ORANGE, letterSpacing: 1.4 },
  petName: { fontSize: 26, fontWeight: "900", color: BROWN, marginTop: 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { backgroundColor: ORANGE, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, maxWidth: "100%" },
  chipSoft: { backgroundColor: "white" },
  chipText: { color: "white", fontSize: 12, fontWeight: "800" },

  statGrid: { gap: 10, padding: 14 },
  statRow: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: TINT, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 10 },
  statIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: "white", alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "700" },
  statValue: { fontSize: 14, color: BROWN, fontWeight: "900", marginTop: 2 },

  /* avatar */
  avatarRing: { borderWidth: 2, borderColor: ORANGE, alignItems: "center", justifyContent: "center", backgroundColor: "white" },
  avatarFallback: { backgroundColor: "#FFF0E2", alignItems: "center", justifyContent: "center" },
  initial: { fontSize: 26, fontWeight: "900", color: ORANGE },

  /* owner */
  ownerBody: { padding: 18 },
  ownerHead: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
  ownerName: { fontSize: 20, fontWeight: "900", color: BROWN },
  ownerGrid: { flexDirection: "row", gap: 10, marginTop: 16, alignItems: "stretch" },
  tile: { flex: 1, backgroundColor: TINT, borderRadius: 16, padding: 12 },
  tileValue: { fontSize: 14, color: BROWN, fontWeight: "900", marginTop: 2, lineHeight: 19 },

  privacyBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FBF6F1", paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 1, borderTopColor: LINE },
  privacy: { flex: 1, fontSize: 11.5, color: MUTED, lineHeight: 16 },

  /* request */
  requestCard: { backgroundColor: "white", borderRadius: 22, padding: 18, ...shadow },
  section: { fontSize: 18, fontWeight: "900", color: "#382C25" },
  note: { fontSize: 13, color: "#796B61", lineHeight: 20, marginVertical: 12 },
  ownBadge: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: TINT, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  ownBadgeText: { fontSize: 14, fontWeight: "900", color: BROWN },
  button: { borderRadius: 18, padding: 16, alignItems: "center" },
  buttonText: { color: "white", fontSize: 15, fontWeight: "900" },
});
