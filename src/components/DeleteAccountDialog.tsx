import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as Notifications from "expo-notifications";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { DialogShell, dialogStyles } from "@/components/AppDialog";
import { C, s } from "@/components/SectionHeader";
import { petcardApi } from "@/services/petcardApi";
import { useAuth } from "@/context/AuthContext";
import { Pressable } from "react-native";

/*
 * Permanent account deletion (required by Google Play). Password accounts confirm with their
 * password; accounts that only use Google confirm by typing DELETE. On success every local
 * reminder is cleared and the person is signed out.
 */
export default function DeleteAccountDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { signOut } = useAuth();
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) return;
        setValue(""); setError(null); setBusy(false);
        let alive = true;
        petcardApi.bootstrap().then((b) => { if (alive) setHasPassword(b.user?.hasPassword !== false); }).catch(() => { if (alive) setHasPassword(true); });
        return () => { alive = false; };
    }, [visible]);

    const confirm = async () => {
        if (busy) return;
        const text = value.trim();
        if (hasPassword && !text) { setError("Enter your password to confirm."); return; }
        if (!hasPassword && text.toUpperCase() !== "DELETE") { setError("Type DELETE to confirm."); return; }
        setBusy(true); setError(null);
        try {
            await petcardApi.deleteAccount(hasPassword ? { password: value } : { confirm: "DELETE" });
            await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
            onClose();
            await signOut(); // the auth gate then opens the login screen
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not delete your account. Please try again.");
            setBusy(false);
        }
    };

    return (
        <DialogShell visible={visible} onRequestClose={() => { if (!busy) onClose(); }}>
            <Text style={dialogStyles.title} maxFontSizeMultiplier={1.1}>Delete account?</Text>
            <Text style={dialogStyles.message} maxFontSizeMultiplier={1.1}>
                This permanently deletes your account, your pets, health records, memories, rewards and everything else linked to you. Co-guardians of your pets will lose access. This cannot be undone.
            </Text>

            <Text style={styles.label} maxFontSizeMultiplier={1.1}>{hasPassword === false ? "Type DELETE to confirm" : "Enter your password to confirm"}</Text>
            <TextInput
                value={value}
                onChangeText={(v) => { setValue(v); if (error) setError(null); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                secureTextEntry={hasPassword !== false}
                autoCapitalize={hasPassword === false ? "characters" : "none"}
                autoCorrect={false}
                editable={!busy}
                placeholder={hasPassword === false ? "DELETE" : "Password"}
                placeholderTextColor={C.muted}
                style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError]}
            />
            {error ? <Text style={styles.error} maxFontSizeMultiplier={1.1}>{error}</Text> : null}

            <View style={styles.actions}>
                <PrimaryButton compact variant="danger" title={busy ? "Deleting…" : "Delete my account"} disabled={busy || hasPassword === null} onPress={confirm} />
                <Pressable style={styles.cancel} disabled={busy} onPress={onClose}>
                    <Text style={styles.cancelText} maxFontSizeMultiplier={1.1}>Cancel</Text>
                </Pressable>
            </View>
        </DialogShell>
    );
}

const styles = StyleSheet.create({
    label: { fontFamily: "Nunito_700Bold", fontSize: s(12), color: C.brown, marginTop: s(16), marginBottom: s(6) },
    input: { height: s(46), borderRadius: s(12), borderWidth: 1.5, borderColor: C.peachBorder, backgroundColor: C.card, paddingHorizontal: s(12), fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },
    inputFocused: { borderColor: C.orange, backgroundColor: C.white },
    inputError: { borderColor: "#E5484D" },
    error: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: "#E5484D", marginTop: s(6) },
    actions: { marginTop: s(18), gap: s(10) },
    cancel: { height: s(44), alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1.5, borderColor: C.peachBorder, backgroundColor: C.card },
    cancelText: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
});
