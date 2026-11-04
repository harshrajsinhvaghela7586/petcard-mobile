import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { petcardApi, Pet } from "@/services/petcardApi";
import { resolveSelectedPet } from "@/services/petSelection";

/**
 * Single source of truth for "which pet is active right now".
 * - hasPet === false  -> screen ko kuch bhi load/create nahi karna chahiye (NoPetPopup dikhao).
 * - Selected pet change hone par (Profile > My Pets) screen focus pe sab kuch us pet ka reload hota hai.
 */
export function useSelectedPet() {
    const [pet, setPet] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        try {
            const data = await petcardApi.bootstrap();
            const list = data.pets ?? [];
            setPets(list);
            setPet((await resolveSelectedPet(list)) ?? null);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to load your pet.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { void reload(); }, [reload]));

    return { pet, pets, loading, error, hasPet: !!pet?.id, reload };
}
