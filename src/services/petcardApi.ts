import { api } from "./apiClient";
import type { TrackerSummary } from "./trackerStore";
/** API contract for the PetCard mobile backend (see backend/docs/API.md). */
export type PetProgress = {
  level: number;
  xp: number;
  nextLevelXp?: number;
  currentLevelXp?: number;
  [key: string]: unknown;
};

export type Pet = {
  id: string;
  qrToken?: string;
  name: string;
  type: "dog" | "cat" | "rabbit" | string;
  breed?: string;
  color?: string;
  avatarKey?: string;
  avatarLocalId?: string | null;
  photoUrl?: string | null;
  stickerKeys?: string[];
  activeStickerKey?: string | null;
  unlockedFrameKeys?: string[];
  activeFrameKey?: string;
  role?: "owner" | "guardian" | string;
  permissions?: string[];
  progress?: PetProgress;
  streak?: { current: number; longest: number; lastDate?: string | null };
  createdAt?: string;
  birthDate?: string | null;
  weightKg?: number | null;
  gender?: string;
  health?: { vaccinated?: boolean | null; allergies?: string[]; conditions?: string[]; vetName?: string; vetPhone?: string; notes?: string };
  reminders?: { enabled?: boolean; time?: string };
  [key: string]: unknown;
};

export type Task = {
  id: string;
  petId: string;
  title: string;
  note?: string;
  category: string;
  recurrence?: { type: "once" | "daily" | "weekly"; daysOfWeek?: number[]; startDate: string; endDate?: string | null };
  timeOfDay?: string | null;
  completed?: boolean;
  completedAt?: string | null;
  points?: number;
  xp?: number;
};

export type HealthRecord = {
  id: string;
  petId: string;
  type: string;
  title: string;
  date: string;
  nextDueDate?: string | null;
  weightKg?: number | null;
  vetName?: string;
  notes?: string;
};

export type Memory = {
  id: string;
  petId: string;
  title: string;
  caption?: string;
  date: string;
  photo?: { url: string; width?: number | null; height?: number | null } | null;
  author?: { id: string; name?: string | null };
};

export type UploadedPhotoRef = { publicId: string; width?: number; height?: number; format?: string };

export type Bootstrap = {
  user: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    location?: string;
    relationship?: string;
    photoUrl?: string | null;
    language?: string;
    timezone?: string;
    createdAt?: string;
    notificationPrefs?: { push?: boolean; email?: boolean };
  };
  pets: Pet[];
  hasPet: boolean;
  wallet: { pawPoints: number; lifetimePoints?: number };
  unreadNotifications: number;
  pendingGuardianRequests: number;
};

export type ProfileUpdate = Partial<Pick<Bootstrap["user"], "name" | "phone" | "country" | "location" | "relationship" | "timezone" | "language">> & {
  notificationPrefs?: { push?: boolean; email?: boolean };
  /** Result of a Cloudinary upload (purpose "user_photo"), or null to remove the photo. */
  photo?: UploadedPhotoRef | null;
};

export type KnowMenuData = {
  chip?: string; heroTitle?: string; heroSub?: string; heading?: string; sub?: string;
  tip?: { title: string; text: string };
  items?: Array<{ key: string; title: string; sub: string }>;
};

export type KnowGuideData = {
  key: string;
  chip?: string;
  sections: any[];
  footer?: string;
  breed?: string | null;
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const q = (values: Record<string, string | number | boolean | null | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : "";
};
const petPath = (petId: string) => `/api/pets/${encodeURIComponent(petId)}`;

export const petcardApi = {
  sendContactMessage: (body: { name: string; email: string; subject?: string; message: string }) => api<{ message: string; id: string }>("/api/contact", { method: "POST", body, auth: false }),
  health: () => api<{ ok: boolean; name: string; db: string }>("/api/health", { auth: false }),
  changePassword: (currentPassword: string, newPassword: string) => api<{ message: string }>("/api/mobile-auth/change-password", { method: "POST", body: { currentPassword, newPassword } }),
  logoutAll: () => api<{ message: string }>("/api/mobile-auth/logout-all", { method: "POST", body: {} }),
  bootstrap: () => api<Bootstrap>("/api/me/bootstrap"),
  getProfile: () => api<{ user: Bootstrap["user"] }>("/api/me/profile"),
  updateProfile: (body: ProfileUpdate) =>
    api<{ user: Bootstrap["user"] }>("/api/me/profile", { method: "PATCH", body }),
  deleteAccount: (password: string) => api<{ message: string }>("/api/me", { method: "DELETE", body: { password } }),
  rewards: (cursor?: string, limit = 20) => api<{ wallet: Bootstrap["wallet"]; history: unknown[]; nextCursor?: string | null }>(`/api/me/rewards${q({ cursor, limit })}`),
  claimDailyLoginReward: (petId: string, date = todayKey()) => api<{ rewarded: boolean; points: number; xp: number; progress: PetProgress | null; wallet: Bootstrap["wallet"] }>("/api/me/daily-login", { method: "POST", body: { petId, date } }),
trackerSummary: (petId: string, date = todayKey()) => api<TrackerSummary>(`${petPath(petId)}/tracker/summary${q({ date })}`),

  listPets: () => api<{ pets: Pet[] }>("/api/pets"),
  getPet: (petId: string) => api<{ pet: Pet }>(`${petPath(petId)}`),
  createPet: (body: Record<string, unknown>, idempotencyKey: string) =>
    api<{ pet: Pet; created: boolean }>("/api/pets", { method: "POST", body, headers: { "Idempotency-Key": idempotencyKey } }),
  updatePet: (petId: string, body: Record<string, unknown>) => api<{ pet: Pet }>(petPath(petId), { method: "PATCH", body }),
  deletePet: (petId: string) => api<{ message: string }>(petPath(petId), { method: "DELETE" }),
  petProgress: (petId: string) => api<{ progress: PetProgress; wallet: Bootstrap["wallet"]; streak?: Pet["streak"] }>(`${petPath(petId)}/progress`),
  achievements: (petId: string) => api<{ achievements: Array<{ key: string; title: string; description: string; icon: string; target: number; progress: number; done: boolean; unlockedAt: string | null }>; unlockedCount: number; totalCount: number }>(`${petPath(petId)}/achievements`),
  addPetSticker: (petId: string, key: string) => api<{ pet: Pet; wallet: Bootstrap["wallet"] }>(`${petPath(petId)}/stickers`, { method: "POST", body: { key } }),
  removePetSticker: (petId: string, key: string) => api<{ pet: Pet }>(`${petPath(petId)}/stickers/${encodeURIComponent(key)}`, { method: "DELETE" }),

  listAvatars: (petType?: string) => api<{ items: Array<{ key: string; label: string; petType: string; order?: number }> }>(`/api/catalog/avatars${q({ petType })}`),
  listStickers: (petType?: string, avatarLocalId?: string) =>
  api<{
    items: Array<{
      key: string;
      label: string;
      petType: string;
      order?: number;
      price?: number;
    }>;
  }>(
    `/api/catalog/stickers${q({
      petType,
      avatarKey: avatarLocalId,
    })}`
  ),
  ownedStickers: () => api<{ owned: Array<{ key: string; pricePaid: number; purchasedAt: string }>; wallet: Bootstrap["wallet"] }>("/api/me/stickers"),
  purchaseSticker: (key: string) => api<{ purchased: boolean; alreadyOwned: boolean; wallet: Bootstrap["wallet"] }>(`/api/me/stickers/${encodeURIComponent(key)}/purchase`, { method: "POST", body: {} }),
  selectStickerForPet: (petId: string, key: string) => api<{ pet: Pet }>(`${petPath(petId)}/stickers/${encodeURIComponent(key)}/select`, { method: "POST", body: {} }),
  listBreeds: (petType: string) => api<{ items: Array<{ key: string; label: string; petType: string; order?: number }> }>(`/api/catalog/breeds${q({ petType })}`),
knowGuide: (petId: string, pageKey: string) => api<{ guide: KnowGuideData | null }>(`${petPath(petId)}/know-guide/${encodeURIComponent(pageKey)}`),
knowMenu: (petId: string, menuKey: string) => api<{ menu: KnowMenuData }>(`${petPath(petId)}/know-menu/${encodeURIComponent(menuKey)}`),
  listTasks: (petId: string, date = todayKey()) => api<{ date: string; tasks: Task[] }>(`${petPath(petId)}/tasks${q({ date })}`),
  listAllTasks: (petId: string) => api<{ tasks: Task[] }>(`${petPath(petId)}/tasks/all`),
  createTask: (petId: string, body: Record<string, unknown>) => api<{ task: Task }>(`${petPath(petId)}/tasks`, { method: "POST", body }),
  updateTask: (petId: string, taskId: string, body: Record<string, unknown>) => api<{ task: Task }>(`${petPath(petId)}/tasks/${encodeURIComponent(taskId)}`, { method: "PATCH", body }),
  archiveTask: (petId: string, taskId: string) => api<{ message: string }>(`${petPath(petId)}/tasks/${encodeURIComponent(taskId)}`, { method: "DELETE" }),
  completeTask: (petId: string, taskId: string, date = todayKey()) => api<{ alreadyCompleted?: boolean; reward?: { points?: number; xp?: number; streakBonus?: number; capped?: boolean }; progress?: PetProgress; streak?: Pet["streak"]; wallet?: Bootstrap["wallet"] }>(`${petPath(petId)}/tasks/${encodeURIComponent(taskId)}/complete`, { method: "POST", body: { date } }),
  taskHistory: (petId: string, cursor?: string, limit = 20) => api<{ items?: unknown[]; completions?: unknown[]; nextCursor?: string | null }>(`${petPath(petId)}/tasks/history${q({ cursor, limit })}`),
  calendar: (petId: string, from: string, to: string) => api<{ days: Record<string, { tasks: Task[]; health: HealthRecord[]; memories: Memory[] }> }>(`${petPath(petId)}/calendar${q({ from, to })}`),

  listHealthRecords: (petId: string, type?: string, cursor?: string, limit = 20) => api<{ records: HealthRecord[]; nextCursor?: string | null }>(`${petPath(petId)}/health${q({ type, cursor, limit })}`),
  upcomingHealth: (petId: string) => api<{ records: HealthRecord[] }>(`${petPath(petId)}/health/upcoming`),
  createHealthRecord: (petId: string, body: Partial<HealthRecord>) => api<{ record: HealthRecord }>(`${petPath(petId)}/health`, { method: "POST", body }),
  updateHealthRecord: (petId: string, recordId: string, body: Partial<HealthRecord>) => api<{ record: HealthRecord }>(`${petPath(petId)}/health/${encodeURIComponent(recordId)}`, { method: "PATCH", body }),
  deleteHealthRecord: (petId: string, recordId: string) => api<{ message: string }>(`${petPath(petId)}/health/${encodeURIComponent(recordId)}`, { method: "DELETE" }),

  listMemories: (petId: string, cursor?: string, limit = 12) => api<{ memories: Memory[]; nextCursor?: string | null }>(`${petPath(petId)}/memories${q({ cursor, limit })}`),
  createMemory: (petId: string, body: { title?: string; caption?: string; date?: string; photo?: { publicId: string; width?: number; height?: number; format?: string } | null }) => api<{ memory: Memory }>(`${petPath(petId)}/memories`, { method: "POST", body }),
  updateMemory: (petId: string, memoryId: string, body: Partial<{ title: string; caption: string; date: string; photo: { publicId: string; width?: number; height?: number; format?: string } | null }>) => api<{ memory: Memory }>(`${petPath(petId)}/memories/${encodeURIComponent(memoryId)}`, { method: "PATCH", body }),
  deleteMemory: (petId: string, memoryId: string) => api<{ message: string }>(`${petPath(petId)}/memories/${encodeURIComponent(memoryId)}`, { method: "DELETE" }),

  listGuardians: (petId: string) => api<Record<string, unknown>>(`${petPath(petId)}/guardians`),
  createGuardianInvite: (petId: string) => api<{ invite: { id: string; token: string; deepLink: string; expiresAt: string; maxUses: number } }>(`${petPath(petId)}/guardians/invites`, { method: "POST", body: {} }),
  revokeGuardianInvite: (petId: string, inviteId: string) => api<{ message: string }>(`${petPath(petId)}/guardians/invites/${encodeURIComponent(inviteId)}`, { method: "DELETE" }),
  approveGuardianRequest: (petId: string, requestId: string, permissions: string[] = ["view_pet", "view_tasks"]) => api<{ message: string }>(`${petPath(petId)}/guardians/requests/${encodeURIComponent(requestId)}/approve`, { method: "POST", body: { permissions } }),
  rejectGuardianRequest: (petId: string, requestId: string) => api<{ message: string }>(`${petPath(petId)}/guardians/requests/${encodeURIComponent(requestId)}/reject`, { method: "POST", body: {} }),
  /* Backend: PATCH /api/pets/:petId/guardians/:userId { permissions } (owner only) */
  updateGuardianPermissions: (petId: string, userId: string, permissions: string[]) => api<{ message: string }>(`${petPath(petId)}/guardians/${encodeURIComponent(userId)}`, { method: "PATCH", body: { permissions } }),
  removeGuardian: (petId: string, userId: string) => api<{ message: string }>(`${petPath(petId)}/guardians/${encodeURIComponent(userId)}`, { method: "DELETE" }),
  lookupPublicPetQr: (token: string) => api<{ pet: { name: string; type: string; breed?: string; gender?: string; birthDate?: string | null; weightKg?: number | null; avatarKey?: string | null; photoUrl?: string | null; emergency?: Record<string, unknown> } }>(`/api/public/pets/qr/${encodeURIComponent(token)}`),
  requestGuardianByPetQr: (token: string) => api<{ requestId: string; status: string; created: boolean }>("/api/guardian-requests/by-pet-qr", { method: "POST", body: { token } }),
  lookupGuardianInvite: (token: string) => api<Record<string, unknown>>("/api/guardian-invites/lookup", { method: "POST", body: { token } }),
  redeemGuardianInvite: (token: string) => api<Record<string, unknown>>("/api/guardian-invites/redeem", { method: "POST", body: { token } }),
  myGuardianRequests: () => api<Record<string, unknown>>("/api/guardian-requests/mine"),
  cancelGuardianRequest: (requestId: string) => api<{ message: string }>(`/api/guardian-requests/${encodeURIComponent(requestId)}`, { method: "DELETE" }),

  notifications: (options: { unread?: boolean; cursor?: string; limit?: number } = {}) => api<{ notifications: unknown[]; nextCursor?: string | null }>(`/api/me/notifications${q(options)}`),
  unreadNotificationCount: () => api<{ count: number }>("/api/me/notifications/unread-count"),
  markNotificationsRead: (ids: string[] | "all") => api<{ message: string }>("/api/me/notifications/read", { method: "POST", body: ids === "all" ? { all: true } : { ids } }),
  registerDevice: (token: string, platform: string) => api<{ success: boolean }>("/api/me/devices", { method: "POST", body: { token, platform } }),
  unregisterDevice: (token: string) => api<{ success: boolean }>("/api/me/devices/unregister", { method: "POST", body: { token } }),

  /* Backend (Gemini, key stays on server): POST /api/pets/:petId/assistant/chat { message, history } -> { reply }. Answers only about this pet's PetCard/care. */
  prewarmBreed: (type: string, breed: string) => api<{ accepted: boolean }>("/api/me/breed-prewarm", { method: "POST", body: { type, breed } }),
  knowAdapt: (body: { pageKey: string; petType: string; breed: string; sections: unknown[] }) => api<{ sections: any[] | null }>("/api/me/know-adapt", { method: "POST", body }),
  aiChat: (petId: string, message: string, history: Array<{ role: "user" | "assistant"; text: string }>) => api<{ reply: string }>(`${petPath(petId)}/assistant/chat`, { method: "POST", body: { message, history } }),

  referral: () => api<Record<string, unknown>>("/api/me/referral"),
  getReferral: () => api<{ code: string; invitedCount: number; rewards: { youGet: number; friendGets: number }; canApplyCode: boolean; alreadyReferred: boolean }>("/api/me/referral"),
  applyReferral: (code: string) => api<{ message: string; status: string; pointsEarned: number }>("/api/me/referral/apply", { method: "POST", body: { code } }),
  signUpload: (purpose: "pet_photo" | "memory" | "user_photo", petId?: string) => api<{ upload: { uploadUrl: string; apiKey: string; signature: string; params: Record<string, string | number> } }>("/api/uploads/sign", { method: "POST", body: { purpose, petId } }),
};

export const petcardTodayKey = todayKey;

/** A persisted backend token makes the generated QR stable across devices and sessions. */
export function getPetQrValue(pet: Pet | null | undefined): string {
  const apiOrigin = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  if (pet?.qrToken && apiOrigin) return `${apiOrigin}/api/public/pets/qr/${pet.qrToken}`;
  return pet?.id ?? "petcard-unavailable";
}