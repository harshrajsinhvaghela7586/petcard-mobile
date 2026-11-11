import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { api, ApiError, clearApiInflight, setSessionExpiredHandler } from "../services/apiClient";
import { StoredUser, tokenStorage } from "../services/tokenStorage";

type Status = "loading" | "signedOut" | "signedIn";

type AuthValue = {
  status: Status;
  user: StoredUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

// Clears the phone's cached Google account so the next Google sign-in shows the account picker.
// Lazy require: if the native module is missing (Expo Go / old build) this silently does nothing
// instead of crashing the whole app.
async function clearGoogleSession() {
  try {
    const mod = require("@react-native-google-signin/google-signin");
    await mod.GoogleSignin.signOut();
  } catch {
    // module unavailable or no active Google session
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<StoredUser | null>(null);

  const reset = useCallback(() => {
    clearApiInflight();
    setUser(null);
    setStatus("signedOut");
    // TODO: when a query cache is added, clear it here (logout / account switch).
  }, []);

  // Boot: read the keychain, show the app immediately from the stored session,
  // then validate in the background via /me (which refreshes the token if needed).
  useEffect(() => {
    setSessionExpiredHandler(reset);
    let alive = true;

    (async () => {
      const stored = await tokenStorage.load();
      if (!alive) return;

      if (!stored.refresh) {
        setStatus("signedOut");
        return;
      }

      setUser(stored.user);
      setStatus("signedIn");

      try {
        const data = await api<{ user: StoredUser }>("/api/mobile-auth/me");
        if (!alive) return;
        setUser(data.user);
        await tokenStorage.saveUser(data.user);
      } catch (e) {
        // Offline / slow server: keep the user signed in. Real 401s are handled by the client.
        if (!(e instanceof ApiError) || e.status !== 401) return;
      }
    })();

    return () => {
      alive = false;
      setSessionExpiredHandler(null);
    };
  }, [reset]);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await api("/api/mobile-auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    await tokenStorage.saveUser(data.user);
    setUser(data.user);
    setStatus("signedIn");
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    const data = await api("/api/mobile-auth/google", {
      method: "POST",
      body: { idToken },
      auth: false,
    });
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    await tokenStorage.saveUser(data.user);
    setUser(data.user);
    setStatus("signedIn");
  }, []);

  const signOut = useCallback(async () => {
    const refreshToken = await tokenStorage.getRefresh();
    // Clear locally first so the UI never waits on the network.
    await tokenStorage.clear();
    // Also forget the cached Google account so the next login/signup asks which account to use.
    await clearGoogleSession();
    clearApiInflight();
    reset();
    if (refreshToken) {
      api("/api/mobile-auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(
        () => undefined
      );
    }
  }, [reset]);

  const value = useMemo(() => ({ status, user, signIn, signInWithGoogle, signOut }), [status, user, signIn, signInWithGoogle, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}