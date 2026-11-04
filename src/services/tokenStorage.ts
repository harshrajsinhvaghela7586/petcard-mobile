import * as SecureStore from "expo-secure-store";

const KEYS = {
  access: "petcard.accessToken",
  refresh: "petcard.refreshToken",
  user: "petcard.user",
} as const;

export type StoredUser = { id: string; name: string; email: string; phone?: string };

// In-memory copy so API calls don't hit the keychain on every request.
let accessCache: string | null = null;

export const tokenStorage = {
  async load() {
    const [access, refresh, user] = await Promise.all([
      SecureStore.getItemAsync(KEYS.access),
      SecureStore.getItemAsync(KEYS.refresh),
      SecureStore.getItemAsync(KEYS.user),
    ]);
    accessCache = access;
    let parsed: StoredUser | null = null;
    try {
      parsed = user ? (JSON.parse(user) as StoredUser) : null;
    } catch {
      parsed = null;
    }
    return { access, refresh, user: parsed };
  },

  getAccess: () => accessCache,

  getRefresh: () => SecureStore.getItemAsync(KEYS.refresh),

  async saveTokens(accessToken: string, refreshToken: string) {
    accessCache = accessToken;
    await Promise.all([
      SecureStore.setItemAsync(KEYS.access, accessToken),
      SecureStore.setItemAsync(KEYS.refresh, refreshToken),
    ]);
  },

  saveUser: (user: StoredUser) => SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),

  async clear() {
    accessCache = null;
    await Promise.all(
      Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k).catch(() => undefined))
    );
  },
};
