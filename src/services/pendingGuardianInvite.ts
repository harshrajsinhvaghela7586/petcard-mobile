import * as SecureStore from "expo-secure-store";

const KEY = "petcard.pendingGuardianInvite.v1";

export const pendingGuardianInvite = {
  async save(token: string) {
    const value = token.trim();
    if (!/^[A-Za-z0-9_-]{32,128}$/.test(value)) throw new Error("Invalid guardian invite token.");
    await SecureStore.setItemAsync(KEY, value);
  },
  get: () => SecureStore.getItemAsync(KEY),
  clear: () => SecureStore.deleteItemAsync(KEY),
};
