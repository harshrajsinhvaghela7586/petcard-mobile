import { api, ApiError } from "./apiClient";

export { ApiError };

type Result = {
  success: boolean;
  message?: string;
  // OTP endpoints
  expiresInSeconds?: number;
  resendAfterSeconds?: number;
};

const post = (path: string, body: Record<string, unknown>) =>
  api<Result>(`/api/mobile-auth${path}`, { method: "POST", body, auth: false });

/*
 * Public (signed-out) auth calls. ApiError extends Error, so screens can keep using
 * `error instanceof Error ? error.message : ...`, and can also read error.code /
 * error.retryAfterSeconds (VERIFICATION_PENDING, OTP_COOLDOWN, OTP_LOCKED, RATE_LIMITED,
 * EMAIL_NOT_VERIFIED, ACCOUNT_LOCKED).
 *
 * Login is NOT here on purpose: use `useAuth().signIn(...)` so tokens are stored.
 */
export const mobileAuthApi = {
  signup: (payload: { name: string; email: string; phone: string; country?: string; password: string }) =>
    post("/signup", payload),
  verifyOtp: (payload: { email: string; otp: string }) => post("/verify-otp", payload),
  resendOtp: (email: string) => post("/resend-otp", { email }),
  forgotPassword: (email: string) => post("/forgot-password", { email }),
  resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
    post("/reset-password", payload),
};
