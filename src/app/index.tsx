import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { petcardApi } from "@/services/petcardApi";
import { appFlags } from "@/services/appFlags";

/**
 * Root route resolver.
 * Keep `/` as the authenticated entry point; Settings lives only at `/settings`.
 * This also handles cold starts where a valid session already exists.
 */
export default function IndexRoute() {
  const { status, user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    if (status === "loading") return;
    if (status === "signedOut") {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        const bootstrap = await petcardApi.bootstrap();
        if (cancelled) return;
        if (bootstrap.hasPet) {
          router.replace("/HomeScreen");
          return;
        }
        const userId = user?.id ?? "";
        const referralSeen = await appFlags.getReferralSeen(userId);
        if (cancelled) return;
        if (!referralSeen) {
          try {
            const referral = await petcardApi.getReferral();
            if (!cancelled && referral.canApplyCode) {
              router.replace("/ReferralScreen" as any);
              return;
            }
          } catch {
            // Referral is optional; continue to pet setup if unavailable.
          }
        }
        if (!cancelled) router.replace("/PetTypeScreen");
      } catch {
        if (cancelled) return;
        const done = await appFlags.getSetupDone(user?.id ?? "");
        router.replace(done ? "/HomeScreen" : "/PetTypeScreen");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, user?.id]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
      <ActivityIndicator color="#FF7A00" />
    </View>
  );
}
