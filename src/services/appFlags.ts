import * as SecureStore from "expo-secure-store";

// Small on-device flags. Stored in SecureStore because it is already a dependency of the auth layer.
// TODO: once the pets API exists, the server (does this user have a pet?) replaces `setupDone`.

const ONBOARDING_KEY = "petcard.onboardingSeen";
const referralKey = (userId: string) => `petcard.referralSeen.${userId}`;
const setupKey = (userId: string) => `petcard.setupDone.${userId}`;

const read = async (key: string) => {
  try {
    return (await SecureStore.getItemAsync(key)) === "1";
  } catch {
    return false;
  }
};

const write = async (key: string) => {
  try {
    await SecureStore.setItemAsync(key, "1");
  } catch {
    // Non-fatal: the user simply sees the screen again next launch.
  }
};

export const appFlags = {
  getOnboardingSeen: () => read(ONBOARDING_KEY),
  setOnboardingSeen: () => write(ONBOARDING_KEY),
  getSetupDone: (userId: string) => (userId ? read(setupKey(userId)) : Promise.resolve(false)),
  setSetupDone: (userId: string) => (userId ? write(setupKey(userId)) : Promise.resolve()),
  getReferralSeen: (userId: string) => (userId ? read(referralKey(userId)) : Promise.resolve(false)),
  setReferralSeen: (userId: string) => (userId ? write(referralKey(userId)) : Promise.resolve()),
};
