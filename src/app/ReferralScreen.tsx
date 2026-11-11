import { appAlert } from "@/components/AppDialog";
import React, { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    Share,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text, TranslatedTextInput as TextInput } from "@/i18n/TranslatedText";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import { petcardApi } from "@/services/petcardApi";
import { appFlags } from "@/services/appFlags";
import { useAuth } from "@/context/AuthContext";

export default function ReferralScreen() {
  const [fontsLoaded] = useAppFonts();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [canApply, setCanApply] = useState(true);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  useEffect(() => {
    let active = true;
    petcardApi.getReferral().then((data) => { if (active) { setMyCode(data.code); setCanApply(data.canApplyCode); } })
      .catch((error) => { if (active) appAlert("Referral unavailable", error instanceof Error ? error.message : "You can skip this step and continue."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (!fontsLoaded) return null;
  const continueToSetup = async () => { await appFlags.setReferralSeen(user?.id ?? ""); router.replace("/PetTypeScreen"); };
  const applyCode = async () => {
    if (!code.trim() || applying) return;
    setApplying(true);
    try {
      const result = await petcardApi.applyReferral(code.trim().toUpperCase());
      appAlert("Congratulations!", "Your referral has been applied successfully. Your friend will receive the reward after you complete your pet setup.", [{ text: "Continue", onPress: () => { void continueToSetup(); } }]);
    } catch (error) { appAlert("Referral not applied", error instanceof Error ? error.message : "Please check the code and try again."); }
    finally { setApplying(false); }
  };
  const shareCode = () => Share.share({ message: `Join me on PetCard! Use my referral code ${myCode} when you sign up.` });
  return (
    <View style={styles.container}>
      <PawBackground />
      <View style={styles.header}><Text style={styles.title}>A Little More Paw-some Together!</Text><Text style={styles.subtitle}>Have a friend's referral code? Add it now, or skip and set up your pet.</Text></View>
      <View style={styles.hero}><Image source={require("../../assets/images/rewards/pawcoin.png")} resizeMode="contain" style={styles.coin} /><View style={{ flex: 1 }}><Text style={styles.reward}>Successful referrals reward your friend</Text><Text style={styles.rewardValue}>+200 Paw Points</Text></View></View>
      <View style={styles.card}>
        <Text style={styles.label}>Enter referral code</Text>
        <TextInput value={code} onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="ENTER CODE" placeholderTextColor={C.muted} autoCapitalize="characters" maxLength={16} style={styles.input} />
        <PrimaryButton title={applying ? "Applying..." : "Apply Referral"} onPress={applyCode} disabled={!code.trim() || applying || !canApply} />
        {!canApply ? <Text style={styles.note}>A referral code has already been applied or the referral period has ended.</Text> : null}
      </View>
      <View style={styles.myCodeCard}>
        <MaterialCommunityIcons name="gift-outline" size={s(28)} color={C.orange} />
        <Text style={styles.myCodeLabel}>Your referral code</Text>
        <Text style={styles.myCode}>{loading ? "Loading…" : myCode || "Unavailable"}</Text>
        <Pressable onPress={shareCode} disabled={!myCode} style={styles.share}><MaterialCommunityIcons name="share-variant" size={s(16)} color={C.white} /><Text style={styles.shareText}>Share Code</Text></Pressable>
      </View>
      <Pressable onPress={continueToSetup} style={styles.skip}><Text style={styles.skipText}>Skip for now</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: SIDE, paddingTop: s(40) },
  header: { alignItems: "center", marginTop: s(24) }, title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(26), color: C.brown, textAlign: "center" }, subtitle: { marginTop: s(8), fontFamily: "Nunito_600SemiBold", fontSize: s(13), lineHeight: s(19), color: C.muted, textAlign: "center" },
  hero: { flexDirection: "row", alignItems: "center", gap: s(12), backgroundColor: "#FFF3E3", borderRadius: s(18), padding: s(14), marginTop: s(24), borderWidth: 1, borderColor: C.peachBorder }, coin: { width: s(62), height: s(62) }, reward: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(13) }, rewardValue: { fontFamily: "Fredoka_600SemiBold", color: C.orange, fontSize: s(22), marginTop: s(2) },
  card: { marginTop: s(16), backgroundColor: "#FFFCFA", borderWidth: 1, borderColor: C.peachBorder, borderRadius: s(18), padding: s(16), gap: s(10) }, label: { fontFamily: "Nunito_700Bold", color: C.brown, fontSize: s(14) }, input: { borderWidth: 1, borderColor: C.peachBorder, borderRadius: s(12), padding: s(13), color: C.brown, letterSpacing: 2, fontFamily: "Nunito_700Bold", textAlign: "center" }, note: { color: C.muted, fontFamily: "Nunito_600SemiBold", fontSize: s(11) },
  myCodeCard: { alignItems: "center", marginTop: s(16), backgroundColor: "#FFFCFA", borderWidth: 1, borderColor: C.peachBorder, borderRadius: s(18), padding: s(16) }, myCodeLabel: { fontFamily: "Nunito_700Bold", color: C.brown, marginTop: s(6) }, myCode: { fontFamily: "Fredoka_600SemiBold", color: C.orange, fontSize: s(25), letterSpacing: 2, marginTop: s(4) }, share: { flexDirection: "row", alignItems: "center", gap: s(6), backgroundColor: C.orange, borderRadius: s(20), paddingHorizontal: s(16), paddingVertical: s(9), marginTop: s(10) }, shareText: { color: C.white, fontFamily: "Nunito_700Bold" },
  skip: { alignItems: "center", paddingVertical: s(18) }, skipText: { color: C.muted, textDecorationLine: "underline", fontFamily: "Nunito_700Bold", fontSize: s(13) },
});
