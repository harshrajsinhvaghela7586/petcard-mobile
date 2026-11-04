import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";
import { pendingGuardianInvite } from "@/services/pendingGuardianInvite";

function extractQr(value: string): { token: string; mode: "invite" | "public" } | null {
  const trimmed = value.trim();
  const inviteUrl = trimmed.match(/guardian-invite\?[^#]*token=([A-Za-z0-9_-]{32,128})/i);
  if (inviteUrl?.[1]) return { token: inviteUrl[1], mode: "invite" };
  const publicUrl = trimmed.match(/\/api\/public\/pets\/qr\/([A-Za-z0-9_-]{20,})/i);
  if (publicUrl?.[1]) return { token: publicUrl[1], mode: "public" };
  if (/^[A-Za-z0-9_-]{32,128}$/.test(trimmed)) return { token: trimmed, mode: "public" };
  return null;
}

export default function ScanQRScreen() {
  const [fontsLoaded] = useAppFonts();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);

  const processValue = useCallback(async (value: string) => {
    const parsed = extractQr(value);
    if (!parsed) { Alert.alert("Invalid PetCard QR", "Please scan a valid PetCard QR code."); setScanned(false); return; }
    setScanned(true);
    if (parsed.mode === "invite") {
      try { await pendingGuardianInvite.save(parsed.token); }
      catch { Alert.alert("Invite unavailable", "Could not securely save this invite. Please scan again."); setScanned(false); return; }
    }
    router.push({ pathname: "/GuardianRequestPreview", params: { token: parsed.token, mode: parsed.mode } } as any);
  }, []);

  const onBarcodeScanned = useCallback(({ data }: { data: string }) => {
    if (scanned || busy) return;
    void processValue(data);
  }, [busy, processValue, scanned]);

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 1 });
    if (result.canceled || !result.assets[0]?.uri) return;
    setBusy(true);
    try {
      const codes = await Camera.scanFromURLAsync(result.assets[0].uri, ["qr"]);
      if (!codes.length) { Alert.alert("QR not found", "Select an image that contains a clear PetCard QR code."); return; }
      await processValue(codes[0].data);
    } catch (error) { Alert.alert("Could not read QR", error instanceof Error ? error.message : "Try another image."); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (permission && !permission.granted && permission.canAskAgain) void requestPermission(); }, [permission, requestPermission]);
  if (!fontsLoaded) return null;

  return <View style={styles.container}><PawBackground /><ScreenHeader title="Scan PetCard QR" />
    {!permission?.granted ? <View style={styles.permission}><MaterialCommunityIcons name="camera-lock-outline" size={44} color={C.orange}/><Text style={styles.title}>Camera access needed</Text><Text style={styles.body}>Allow camera access to scan a PetCard QR code.</Text><Pressable style={styles.primary} onPress={requestPermission}><Text style={styles.primaryText}>Allow Camera</Text></Pressable></View> :
      <View style={styles.content}>
        <Text style={styles.hint}>Place the PetCard QR code inside the frame</Text>
        <View style={styles.frame}><CameraView style={StyleSheet.absoluteFill} facing="back" enableTorch={flash} barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={scanned ? undefined : onBarcodeScanned}/><View pointerEvents="none" style={styles.overlay}><View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/></View></View>
        <View style={styles.actions}><Pressable style={styles.action} onPress={() => setFlash(v => !v)}><MaterialCommunityIcons name={flash ? "flash" : "flash-outline"} size={25} color={C.orange}/><Text style={styles.actionText}>Flash</Text></Pressable><Pressable style={styles.action} onPress={chooseImage} disabled={busy}>{busy ? <ActivityIndicator color={C.orange}/> : <MaterialCommunityIcons name="image-multiple-outline" size={25} color={C.orange}/>}<Text style={styles.actionText}>Gallery</Text></Pressable></View>
        {scanned ? <Pressable onPress={() => setScanned(false)}><Text style={styles.retry}>Scan another QR</Text></Pressable> : null}
      </View>}
  </View>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:"#FFFDFC"},permission:{flex:1,alignItems:"center",justifyContent:"center",padding:30,gap:14},content:{flex:1,marginHorizontal:SIDE,alignItems:"center",paddingTop:30,gap:24},hint:{fontSize:16,color:"#55463D",fontWeight:"700",textAlign:"center"},frame:{width:290,height:290,borderRadius:24,overflow:"hidden",backgroundColor:"#211C19"},overlay:{...StyleSheet.absoluteFill},cornerTL:{position:"absolute",top:0,left:0,width:52,height:52,borderTopWidth:5,borderLeftWidth:5,borderColor:C.orange,borderTopLeftRadius:18},cornerTR:{position:"absolute",top:0,right:0,width:52,height:52,borderTopWidth:5,borderRightWidth:5,borderColor:C.orange,borderTopRightRadius:18},cornerBL:{position:"absolute",bottom:0,left:0,width:52,height:52,borderBottomWidth:5,borderLeftWidth:5,borderColor:C.orange,borderBottomLeftRadius:18},cornerBR:{position:"absolute",bottom:0,right:0,width:52,height:52,borderBottomWidth:5,borderRightWidth:5,borderColor:C.orange,borderBottomRightRadius:18},actions:{flexDirection:"row",gap:60},action:{alignItems:"center",gap:7,backgroundColor:"white",padding:14,borderRadius:16,minWidth:90},actionText:{color:"#493B32",fontWeight:"700"},retry:{color:C.orange,fontWeight:"800"},title:{fontSize:20,fontWeight:"800",color:"#382D27"},body:{textAlign:"center",color:"#766A62"},primary:{backgroundColor:C.orange,paddingHorizontal:26,paddingVertical:14,borderRadius:18},primaryText:{color:"white",fontWeight:"800"}});
