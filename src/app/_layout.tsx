import React, { useEffect, useState } from "react";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
    Slot,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import CustomSplashScreen from "./SplashScreen";
import OnboardingScreen from "./OnboardingScreen";

/*
 * Native Expo splash ko automatically hide mat hone do.
 */
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [showCustomSplash, setShowCustomSplash] =
        useState(true);

    const [showOnboarding, setShowOnboarding] =
        useState(false);

    /*
     * Native splash hide karo after React render.
     */
    useEffect(() => {
        const hideNativeSplash = async () => {
            try {
                await SplashScreen.hideAsync();
            } catch (error) {
                console.warn(
                    "Unable to hide native splash:",
                    error
                );
            }
        };

        const frame = requestAnimationFrame(() => {
            hideNativeSplash();
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    /*
     * STEP 1
     * Custom PetCard Splash
     */
    if (showCustomSplash) {
        return (
            <CustomSplashScreen
                onFinish={() => {
                    setShowCustomSplash(false);
                    setShowOnboarding(true);
                }}
            />
        );
    }

    /*
     * STEP 2
     * Onboarding
     */
    if (showOnboarding) {
        return (
            <OnboardingScreen
                onFinish={() => {
                    setShowOnboarding(false);
                }}
            />
        );
    }

    /*
     * STEP 3
     * Actual App / Home
     */
    return (
        <ThemeProvider
            value={
                colorScheme === "dark"
                    ? DarkTheme
                    : DefaultTheme
            }
        >
            <Slot />
        </ThemeProvider>
    );
}