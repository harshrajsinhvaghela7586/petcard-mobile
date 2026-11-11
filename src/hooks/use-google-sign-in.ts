import { appAlert } from "@/components/AppDialog";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();

function loadGoogle(): any {
  try {
    return require("@react-native-google-signin/google-signin");
  } catch {
    return null;
  }
}

export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const mod = loadGoogle();
    if (mod && webClientId) {
      try {
       
        mod.GoogleSignin.configure({ webClientId });
      } catch (e) {
        console.log("[Google OAuth] configure failed:", e);
      }
    }
  }, []);

  const signIn = useCallback(async () => {
    const mod = loadGoogle();
    if (!mod) {
      appAlert(
        "Google sign-in unavailable",
        "This build does not include Google Sign-In. Use the preview APK or a new development build."
      );
      return;
    }
    if (!webClientId) {
      appAlert("Google sign-in unavailable", "Google Web Client ID is not configured.");
      return;
    }

    const { GoogleSignin, isSuccessResponse, statusCodes } = mod;

    try {
      setBusy(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

       try {
        await GoogleSignin.signOut();
      } catch {
        
      }

      const result = await GoogleSignin.signIn();
      if (!isSuccessResponse(result)) return; 

      const idToken: string | undefined = result.data?.idToken;
      if (!idToken) {
        appAlert("Google sign-in failed", "No ID token returned. Check the Web Client ID.");
        return;
      }
      await signInWithGoogle(idToken);
    } catch (error: unknown) {
      const code = (error as { code?: string } | null)?.code;

      if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) return;
      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        appAlert("Google sign-in failed", "Google Play Services is not available.");
        return;
      }

      console.error("[Google OAuth] error:", error);
      appAlert(
        "Google sign-in failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setBusy(false);
    }
  }, [signInWithGoogle]);

  return { signInWithGoogle: signIn, googleLoading: busy };
}