import React, { useEffect, useState } from "react";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
    Slot,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, useColorScheme } from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import CustomSplashScreen from "./SplashScreen";
import OnboardingScreen from "./OnboardingScreen";

/*
 * Native Expo splash ko automatically hide mat hone do.
 */
SplashScreen.preventAutoHideAsync().catch(() => {});


function Shell({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                paddingBottom: insets.bottom,
            }}
        >
            {children}
        </View>
    );
}

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
     * Custom PetCard Splash (full screen, no inset)
     */
    if (showCustomSplash) {
        return (
            <SafeAreaProvider>
                <CustomSplashScreen
                    onFinish={() => {
                        setShowCustomSplash(false);
                        setShowOnboarding(true);
                    }}
                />
            </SafeAreaProvider>
        );
    }

    /*
     * STEP 2
     * Onboarding
     */
    if (showOnboarding) {
        return (
            <SafeAreaProvider>
                <Shell>
                    <OnboardingScreen
                        onFinish={() => {
                            setShowOnboarding(false);
                        }}
                    />
                </Shell>
            </SafeAreaProvider>
        );
    }

    /*
     * STEP 3
     * Actual App / Home
     */
    return (
        <SafeAreaProvider>
            <ThemeProvider
                value={
                    colorScheme === "dark"
                        ? DarkTheme
                        : DefaultTheme
                }
            >
                <Shell>
                    <Slot />
                </Shell>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}