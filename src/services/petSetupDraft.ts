import * as SecureStore from "expo-secure-store";

const KEY = "petcard.petSetupDraft.v1";

export type PetSetupDraft = {
  petType?: "dog" | "cat" | "rabbit";
  name?: string;
  breed?: string;
  gender?: "male" | "female" | "unknown";
  birthDate?: string | null;
  age?: string;
  weightKg?: number | null;
  colour?: string;
  avatarKey?: string;
  avatarLocalId?: string;
  stickerKeys?: string[];
  catalogStickerKeys?: string[];
  photoUri?: string | null;
  health?: { vaccinated?: boolean | null; allergies?: string[]; conditions?: string[]; vetName?: string; vetPhone?: string; notes?: string };
  reminders?: { enabled: boolean; time: string };
  firstTask?: { title: string; category: string; timeOfDay?: string | null };
  initialTasks?: Array<{ title: string; category: string; timeOfDay?: string | null }>;
  idempotencyKey?: string;
  petId?: string;
};

export async function readPetSetupDraft(): Promise<PetSetupDraft> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? JSON.parse(raw) as PetSetupDraft : {};
  } catch {
    return {};
  }
}

export async function updatePetSetupDraft(patch: Partial<PetSetupDraft>): Promise<PetSetupDraft> {
  const current = await readPetSetupDraft();
  const next = { ...current, ...patch };
  await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  return next;
}

export async function clearPetSetupDraft(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY).catch(() => undefined);
}
