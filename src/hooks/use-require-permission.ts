import { useEffect, useRef } from "react";
import { router } from "expo-router";
import type { Pet } from "@/services/petcardApi";
import { canOnPet, type PetPermission } from "@/services/petPermissions";
import { appAlert } from "@/components/AppDialog";

/**
 * Screens call this with the pet they loaded. If the owner has not allowed this person
 * to open the screen (for example through a deep link), a popup explains it and the
 * person is sent back. Returns true while the screen may be shown.
 */
export function useRequirePermission(pet: Pet | null | undefined, permission: PetPermission, loaded = true): boolean {
    const allowed = !pet || canOnPet(pet, permission);
    const warned = useRef(false);
    useEffect(() => {
        if (!loaded || !pet || allowed || warned.current) return;
        warned.current = true;
        appAlert("No access", "The pet owner has not given you access to this. Ask them to turn it on in Guardians.", [
            { text: "OK", onPress: () => (router.canGoBack() ? router.back() : router.replace("/HomeScreen" as any)) },
        ], { cancelable: false });
    }, [loaded, pet, allowed]);
    return allowed;
}
