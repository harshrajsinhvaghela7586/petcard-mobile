import { appAlert } from "@/components/AppDialog";
import AvatarFrame from "@/components/AvatarFrame";
import React, { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, { C, PawBackground, SIDE, cardStyle, s, useAppFonts } from "@/components/SectionHeader";
import { petcardApi, type Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";
import { petImageSource } from "@/services/stickerImage";
import BottomNav, { useNavHeight } from "@/components/BottomNav";

const FRAMES = [
  { key: "frame_default", name: "Classic Paw", level: 1, color: "#C9B7A5" },
  { key: "frame_silver", name: "Silver Paw", level: 2, color: "#A7B0BA" },
  { key: "frame_gold", name: "Golden Paw", level: 3, color: "#D5A02E" },
  { key: "frame_platinum", name: "Platinum Paw", level: 4, color: "#8D9DAA" },
  { key: "frame_diamond", name: "Diamond Paw", level: 5, color: "#55AFC1" },
  { key: "frame_royal", name: "Royal Paw", level: 6, color: "#7A5CFF" },
  { key: "frame_elite", name: "Elite Paw", level: 7, color: "#39334E" },
  { key: "frame_legendary", name: "Legendary Paw", level: 8, color: "#B8860B" },
  { key: "frame_mythic", name: "Mythic Paw", level: 9, color: "#C04D8A" },
  { key: "frame_celestial", name: "Celestial Paw", level: 10, color: "#5C77C7" },
];

export default function AvatarFramesScreen() {
  const NAV_HEIGHT = useNavHeight();
  const [fontsLoaded] = useAppFonts();
  const [pet, setPet] = useState<Pet | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let alive = true;
    petcardApi.listPets().then(({ pets }) => { if (alive) setPet(null); resolveSelectedPet(pets ?? []).then((p) => { if (alive) setPet(p ?? null); }); })
      .catch((error) => { if (alive) appAlert("Unable to load pet", error instanceof Error ? error.message : "Please try again."); });
    return () => { alive = false; };
  }, []);
  if (!fontsLoaded) return null;
  const unlocked = new Set(pet?.unlockedFrameKeys ?? ["frame_default"]);
  const choose = async (frameKey: string) => {
    if (!pet || saving || !unlocked.has(frameKey)) return;
    setSaving(true);
    try {
      const { pet: updated } = await petcardApi.updatePet(pet.id, { activeFrameKey: frameKey });
      setPet(updated);
    } catch (error) { appAlert("Could not apply frame", error instanceof Error ? error.message : "Please try again."); }
    finally { setSaving(false); }
  };
  return (
    <View style={styles.container}>
      <PawBackground />
      <ScreenHeader title="Avatar & Frames" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}>
        <View style={styles.previewCard}>
          <View>
            <AvatarFrame frameKey={pet?.activeFrameKey} size={s(136)}>
              <Image source={petImageSource(pet)} resizeMode="contain" style={styles.avatar} />
            </AvatarFrame>
            <View style={styles.pawBadge}><MaterialCommunityIcons name="paw" size={s(16)} color={C.white} /></View>
          </View>
          <Text style={styles.petName} numberOfLines={1}>{pet?.name ?? "Your pet"}</Text>
          <Text style={styles.level}>Level {pet?.progress?.level ?? 1} · {(pet?.progress?.xp ?? 0).toLocaleString()} XP</Text>
          <Text style={styles.helper}>Frames unlock as your pet levels up. Select any unlocked frame to apply it.</Text>
        </View>
        <Text style={styles.sectionTitle}>Available Frames</Text>
        <View style={styles.frameGrid}>
          {FRAMES.map((frame) => {
            const isUnlocked = unlocked.has(frame.key);
            const selected = pet?.activeFrameKey === frame.key;
            return (
              <Pressable key={frame.key} disabled={!isUnlocked || saving} onPress={() => void choose(frame.key)} style={[styles.frameCard, selected && styles.frameSelected, !isUnlocked && styles.frameLocked]}>
                <AvatarFrame frameKey={frame.key} size={s(84)} locked={!isUnlocked}>
                  <Image source={petImageSource(pet)} resizeMode="contain" style={styles.framePet} />
                  {!isUnlocked ? <View style={styles.lock}><Ionicons name="lock-closed" size={s(16)} color={C.muted} /></View> : null}
                </AvatarFrame>
                {selected ? <View style={styles.selected}><Ionicons name="checkmark" size={s(12)} color={C.white} /></View> : null}
                <Text style={styles.frameName} numberOfLines={1}>{frame.name}</Text>
                <Text style={styles.frameLevel}>{isUnlocked ? (selected ? "Equipped" : "Unlocked") : `Unlock at Level ${frame.level}`}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },
  previewCard: { ...cardStyle, marginHorizontal: SIDE, marginTop: s(8), alignItems: "center", padding: s(18) },
  avatarRing: { width: s(132), height: s(132), borderRadius: s(66), borderWidth: s(6), backgroundColor: "#FFF3E3", alignItems: "center", justifyContent: "center" },
  avatar: { width: s(112), height: s(112) }, pawBadge: { position: "absolute", right: -s(2), bottom: s(4), width: s(30), height: s(30), borderRadius: s(15), backgroundColor: C.orange, alignItems: "center", justifyContent: "center" },
  petName: { marginTop: s(10), fontFamily: "Fredoka_600SemiBold", fontSize: s(21), color: C.brown }, level: { marginTop: s(2), fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.orange },
  helper: { marginTop: s(8), textAlign: "center", fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.muted },
  sectionTitle: { marginHorizontal: SIDE, marginTop: s(18), marginBottom: s(10), fontFamily: "Fredoka_600SemiBold", fontSize: s(18), color: C.brown },
  frameGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: SIDE, rowGap: s(10) },
  frameCard: { width: "48%", ...cardStyle, padding: s(10), alignItems: "center", borderWidth: 1, borderColor: C.peachBorder }, frameSelected: { borderColor: C.orange, borderWidth: 2 }, frameLocked: { opacity: 0.62 },
  framePreview: { width: s(82), height: s(82), borderRadius: s(41), borderWidth: s(5), backgroundColor: "#FFF3E3", alignItems: "center", justifyContent: "center" }, framePet: { width: s(68), height: s(68) },
  lock: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", borderRadius: s(40) },
  selected: { position: "absolute", right: -s(4), top: -s(4), width: s(22), height: s(22), borderRadius: s(11), backgroundColor: C.orange, alignItems: "center", justifyContent: "center" },
  frameName: { marginTop: s(8), fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown }, frameLevel: { marginTop: s(2), fontFamily: "Nunito_600SemiBold", fontSize: s(10), color: C.muted },
});