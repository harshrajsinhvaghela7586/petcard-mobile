import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

/** Google ID-token sign-in shared by login and signup screens. */
export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const configured = Boolean(androidClientId && webClientId);
  /* The hook throws on render if a client id is empty, which would crash the login screen: use a placeholder and report "not configured" on tap instead. */
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: androidClientId || "not-configured.apps.googleusercontent.com",
    webClientId: webClientId || "not-configured.apps.googleusercontent.com",
  });

  const signIn = useCallback(async () => {
    if (!configured || !request) {
      Alert.alert("Google sign-in unavailable", "Google OAuth is not configured yet. Check the Google Client IDs in your environment variables.");
      return;
    }
    try {
      setBusy(true);
      const result = await promptAsync();
      if (result.type !== "success") return;
      const idToken = result.params?.id_token || result.authentication?.idToken;
      if (!idToken) throw new Error("Google did not return an ID token. Check your OAuth client configuration.");
      await signInWithGoogle(idToken);
    } catch (error) {
      Alert.alert("Google sign-in failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }, [configured, request, promptAsync, signInWithGoogle]);

  return { signInWithGoogle: signIn, googleLoading: busy };
}
