
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

/** Google ID-token sign-in shared by login and signup screens. */
export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);

  const androidClientId =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim();

  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();

  const configured = Boolean(androidClientId && webClientId);

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      androidClientId || "not-configured.apps.googleusercontent.com",
    webClientId:
      webClientId || "not-configured.apps.googleusercontent.com",
  });

  // TEMPORARY DEBUG: Check the exact OAuth redirect URI.
  useEffect(() => {
    if (!request?.url) {
      console.log("[Google OAuth] Request URL not ready yet.");
      return;
    }

    const redirectMatch = request.url.match(/[?&]redirect_uri=([^&]+)/);
    const redirectUri = redirectMatch
      ? decodeURIComponent(redirectMatch[1])
      : "REDIRECT_URI_NOT_FOUND";

    console.log("[Google OAuth] Redirect URI:", redirectUri);
    console.log("[Google OAuth] Request ready:", Boolean(request));
  }, [request]);

  const signIn = useCallback(async () => {
    if (!configured || !request) {
      Alert.alert(
        "Google sign-in unavailable",
        "Google OAuth is not configured yet. Check the Google Client IDs in your environment variables."
      );
      return;
    }

    try {
      setBusy(true);

      console.log("[Google OAuth] Opening authentication...");

      const result = await promptAsync();

      console.log("[Google OAuth] Result type:", result.type);

      if (result.type !== "success") {
        console.log("[Google OAuth] Authentication did not complete.");

        if (result.type === "error") {
          console.log("[Google OAuth] Error:", result.error);
        }

        return;
      }

      const idToken =
        result.params?.id_token || result.authentication?.idToken;

      if (!idToken) {
        throw new Error(
          "Google did not return an ID token. Check your OAuth client configuration."
        );
      }

      console.log("[Google OAuth] ID token received successfully.");

      await signInWithGoogle(idToken);

      console.log("[Google OAuth] Backend sign-in successful.");
    } catch (error) {
      console.error("[Google OAuth] Sign-in error:", error);

      Alert.alert(
        "Google sign-in failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setBusy(false);
    }
  }, [configured, request, promptAsync, signInWithGoogle]);

  return {
    signInWithGoogle: signIn,
    googleLoading: busy,
  };
}
