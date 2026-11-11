import type { Pet } from "./petcardApi";

/*
 * What the signed-in person may do with ONE pet. The server enforces the same rules; this only
 * decides what the app shows. The owner can do everything; a co-guardian only what the owner switched on.
 */
export type PetPermission =
    | "view_pet" | "view_card" | "view_qr" | "view_emergency"
    | "view_tasks" | "manage_tasks" | "view_health" | "manage_health" | "view_memories" | "manage_memories";

export const isPetOwner = (pet?: Pet | null) => !pet?.role || pet.role === "owner";

export function canOnPet(pet: Pet | null | undefined, permission: PetPermission): boolean {
    if (!pet) return false;
    if (isPetOwner(pet)) return true;
    const granted = pet.permissions ?? [];
    if (granted.includes("*") || granted.includes(permission)) return true;
    // "manage_x" always includes "view_x"
    return permission.startsWith("view_") && permission !== "view_pet" && permission !== "view_card" && permission !== "view_qr" && permission !== "view_emergency"
        ? granted.includes(permission.replace("view_", "manage_"))
        : false;
}

/** Short summary for the guardian list: what this guardian can actually do. */
export function accessLabel(permissions: string[] = []): string {
    const manage = permissions.filter((p) => p.startsWith("manage_")).length;
    const view = permissions.filter((p) => p.startsWith("view_") && p !== "view_pet").length;
    if (manage >= 3) return "Full Access";
    if (manage > 0) return "Custom Access";
    return view > 0 ? "View Only" : "Basic Access";
}
