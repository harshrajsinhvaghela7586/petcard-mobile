import * as SecureStore from "expo-secure-store";
import type { Pet } from "./petcardApi";

const KEY = "petcard.selectedPetId.v1";
export async function getSelectedPetId() {
  try { return await SecureStore.getItemAsync(KEY); } catch { return null; }
}
export async function setSelectedPetId(petId: string) {
  try { await SecureStore.setItemAsync(KEY, petId); } catch { /* selection falls back to first pet */ }
}
export async function resolveSelectedPet(pets: Pet[]) {
  if (!pets?.length) return null;
  const selectedId = await getSelectedPetId();
  const selected = selectedId ? pets.find((pet) => pet.id === selectedId) : null;
  const pet = selected ?? pets[0];
  if (pet?.id && pet.id !== selectedId) await setSelectedPetId(pet.id);
  return pet;
}
