import React, { useEffect, useState } from "react";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
    Slot,
    useRootNavigationState,
    useRouter,
    useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import {
    Nunito_600SemiBold,
    Nunito_700Bold,
    useFonts,
} from "@expo-google-fonts/nunito";
import { View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import CustomSplashScreen from "./SplashScreen";
import { DialogHost } from "../components/AppDialog";
import OnboardingScreen from "./OnboardingScreen";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LanguageProvider, useLang } from "../i18n/LanguageContext";
import { retryDeferredTranslations } from "../i18n/autoTranslate";
import { appFlags } from "../services/appFlags";
import { petcardApi } from "../services/petcardApi";
import { pendingGuardianInvite } from "../services/pendingGuardianInvite";

/*
 * Native Expo splash ko automatically hide mat hone do.
 */
SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    paddingBottom: insets.bottom,
                }}
            >
                {children}
            </View>
            <DialogHost />
        </GestureHandlerRootView>
    );
}

/*
 * Auth gate (no UI).
 * - signed out + outside (auth)  -> /login
 * - signed in  + inside  (auth)  -> Home, or pet setup if this user has not finished it on this device
 */
function AuthGate() {
    const { status, user } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationReady = !!useRootNavigationState()?.key;

    const inAuthGroup = (segments[0] as string | undefined) === "(auth)";
    // QR scanning and the public pet preview must be reachable before sign-in.
    // Keep the exception narrow: do not make the rest of the home app public.
    const isPublicQrFlow =
        ((segments[0] as string | undefined) === "(home)" &&
            ((segments as string[])[1] as string | undefined) === "ScanQRScreen") ||
        (segments[0] as string | undefined) === "GuardianRequestPreview";
    const userId = user?.id ?? "";

    useEffect(() => {
        if (!navigationReady || status === "loading") return;

        if (status === "signedOut" && !inAuthGroup && !isPublicQrFlow) {
            router.replace("/login");
            return;
        }

        if (status === "signedIn" && inAuthGroup) {
            let cancelled = false;
            (async () => {
                try {
                    const pendingInvite = await pendingGuardianInvite.get();
                    if (cancelled) return;
                    if (pendingInvite) {
                        router.replace({ pathname: "/GuardianRequestPreview", params: { token: pendingInvite, mode: "invite" } } as any);
                        return;
                    }
                    // The server is authoritative: setup status is based on persisted pet membership.
                    const bootstrap = await petcardApi.bootstrap();
                    if (cancelled) return;
                    if (bootstrap.hasPet) { router.replace("/HomeScreen"); return; }
                    const seenReferral = await appFlags.getReferralSeen(userId);
                    if (!seenReferral) {
                        try {
                            const referral = await petcardApi.getReferral();
                            if (!cancelled && referral.canApplyCode) { router.replace("/ReferralScreen" as any); return; }
                        } catch { /* Referral is optional; continue to pet setup if unavailable. */ }
                    }
                    if (!cancelled) router.replace("/PetTypeScreen");
                } catch {
                    // If the API is temporarily unavailable, preserve the previous local fallback.
                    const done = await appFlags.getSetupDone(userId);
                    if (!cancelled) router.replace(done ? "/" : "/PetTypeScreen");
                }
            })();
            return () => {
                cancelled = true;
            };
        }
    }, [navigationReady, status, inAuthGroup, isPublicQrFlow, userId, router]);

    return null;
}

function AppFlow() {
    const colorScheme = useColorScheme();
    const { status } = useAuth();
    const { applyAccountLanguage } = useLang();
    const navigationReady = !!useRootNavigationState()?.key;

    const [splashDone, setSplashDone] = useState(false);
    const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);
    const router = useRouter();

    // Account preference is the source of truth after login; local storage prevents a language flash.
    useEffect(() => {
        if (status !== "signedIn") return;
        retryDeferredTranslations();
        let alive = true;
        petcardApi.getProfile()
            .then(({ user }) => { if (alive && user?.language) applyAccountLanguage(user.language); })
            .catch(() => {});
        return () => { alive = false; };
    }, [status, applyAccountLanguage]);

    useEffect(() => {
        let alive = true;
        const handleUrl = async (url: string | null) => {
            if (!url) return;
            const parsed = Linking.parse(url);
            const isGuardianInvite = parsed.hostname === "guardian-invite" || parsed.path === "guardian-invite";
            const token = typeof parsed.queryParams?.token === "string" ? parsed.queryParams.token : null;
            if (!isGuardianInvite || !token || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) return;
            try {
                await pendingGuardianInvite.save(token);
                if (alive && status === "signedOut") {
                    await appFlags.setOnboardingSeen();
                    setOnboardingSeen(true);
                }
                if (alive && status === "signedIn" && splashDone && navigationReady) {
                    router.replace({ pathname: "/GuardianRequestPreview", params: { token, mode: "invite" } } as any);
                }
            } catch { /* Invalid or unavailable secure storage: do not navigate with an unpersisted token. */ }
        };
        Linking.getInitialURL().then(handleUrl).catch(() => {});
        const subscription = Linking.addEventListener("url", ({ url }) => { void handleUrl(url); });
        return () => { alive = false; subscription.remove(); };
    }, [status, splashDone, navigationReady, router]);

    useEffect(() => {
        if (!splashDone || !navigationReady || status !== "signedIn") return;
        let alive = true;
        pendingGuardianInvite.get().then((token) => {
            if (alive && token) router.replace({ pathname: "/GuardianRequestPreview", params: { token, mode: "invite" } } as any);
        }).catch(() => {});
        return () => { alive = false; };
    }, [splashDone, navigationReady, status, router]);

    useEffect(() => {
        let alive = true;
        Promise.all([appFlags.getOnboardingSeen(), pendingGuardianInvite.get()])
            .then(([seen, pendingInvite]) => {
                if (alive) setOnboardingSeen(Boolean(seen || pendingInvite));
            })
            .catch(() => { if (alive) setOnboardingSeen(false); });
        return () => {
            alive = false;
        };
    }, []);

    /*
     * STEP 1
     * Custom PetCard Splash (full screen, no inset)
     */
    if (!splashDone) {
        return <CustomSplashScreen onFinish={() => setSplashDone(true)} />;
    }

    // Keychain read is quick; this only avoids flashing the wrong screen.
    if (status === "loading" || onboardingSeen === null) {
        return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
    }

    /*
     * STEP 2
     * Onboarding: only for signed-out users who have not seen it yet.
     * Both "Get Started" and "Skip" end here; the gate then sends them to /login.
     */
    if (status === "signedOut" && !onboardingSeen) {
        return (
            <Shell>
                <OnboardingScreen
                    onFinish={() => {
                        setOnboardingSeen(true);
                        void appFlags.setOnboardingSeen();
                    }}
                />
            </Shell>
        );
    }

    /*
     * STEP 3
     * Actual App
     */
    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Shell>
                <AuthGate />
                <Slot />
            </Shell>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    /*
     * Fonts ek hi baar yahin load hote hain (native splash tab tak rukta hai),
     * to screens pe blank flash kam hota hai.
     */
    const [fontsLoaded, fontError] = useFonts({
        Fredoka_600SemiBold,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });
    const fontsReady = fontsLoaded || !!fontError;

    useEffect(() => {
        if (fontsReady) {
            SplashScreen.hideAsync().catch(() => {});
        }
    }, [fontsReady]);

    if (!fontsReady) return null;

    return (
        <SafeAreaProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppFlow />
                </AuthProvider>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}
