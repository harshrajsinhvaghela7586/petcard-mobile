import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSelectedPet } from "@/hooks/use-selected-pet";
import { canOnPet } from "@/services/petPermissions";
import { appAlert } from "@/components/AppDialog";
import { DayLog, TrackerEntry, TrackerKind, TrackerSummary, emptyDay, trackerStore, newId, goalsFor, careScore } from "@/services/trackerStore";

/** Selected pet ka aaj ka log. Pet nahi hai to kuch load/save nahi hota (hasPet=false). */
export function useTracker() {
    const { pet, hasPet, loading: petLoading } = useSelectedPet();
    const [day, setDay] = useState<DayLog>(emptyDay());
    const [summary, setSummary] = useState<TrackerSummary | null>(null);
    const [date, setDate] = useState(trackerStore.today());
    const [loading, setLoading] = useState(true);

    const petId = pet?.id;
    /* Logging food/water/activity/etc. needs the owner's "manage tasks" permission. */
    const canEdit = canOnPet(pet, "manage_tasks");
    const blocked = () => appAlert("View only", "The pet owner has not allowed you to change tracking for this pet.");
    useFocusEffect(useCallback(() => {
        let alive = true;
        const d = trackerStore.today();
        setDate(d);
        if (!petId) { setDay(emptyDay()); setSummary(null); setLoading(false); return; }
        setLoading(true);
        trackerStore.loadFull(petId, d)
            .then((v) => { if (alive) { setDay(v.day); setSummary(v.summary); } })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, [petId]));

    /* Food / water / activity change the care score, so re-read the server's totals after each change. */
    const refresh = useCallback(async (fallback: DayLog) => {
        if (!petId) return;
        const full = await trackerStore.loadFull(petId, date);
        if (full.summary) { setDay(full.day); setSummary(full.summary); }
        else setDay(fallback);
    }, [petId, date]);

    const add = useCallback(async (kind: TrackerKind, entry: Omit<TrackerEntry, "id">) => {
        if (!petId) return;
        if (!canEdit) { blocked(); return; }
        const next = await trackerStore.add(petId, date, day, kind, { ...entry, id: newId() });
        setDay(next);
        if (kind === "food" || kind === "water" || kind === "activity") await refresh(next);
    }, [petId, date, day, refresh, canEdit]);

    const remove = useCallback(async (kind: TrackerKind, id: string) => {
        if (!petId) return;
        if (!canEdit) { blocked(); return; }
        const next = await trackerStore.remove(petId, date, day, kind, id);
        setDay(next);
        if (kind === "food" || kind === "water" || kind === "activity") await refresh(next);
    }, [petId, date, day, refresh, canEdit]);

    /* Server goals / score when available (same numbers as Home); local estimate only as a fallback. */
    const local = goalsFor(pet?.type);
    const goals = summary
        ? { food: summary.goals.foodGrams, water: summary.goals.waterMl, activity: summary.goals.activityMin }
        : local;
    const care = summary
        ? { food: summary.careScore.breakdown.nutrition, water: summary.careScore.breakdown.hydration, activity: summary.careScore.breakdown.activity, score: summary.careScore.score }
        : careScore(day, pet?.type);

    return {
        pet, hasPet, day, add, remove, canEdit,
        loading: petLoading || loading,
        goals,
        care,
    };
}