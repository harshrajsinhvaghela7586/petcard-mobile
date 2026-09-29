const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

type ApiResult<T = any> = T & { success: boolean; message?: string };

async function post<T = any>(path: string, body: Record<string, unknown>): Promise<ApiResult<T>> {
  if (!API_BASE_URL) throw new Error("API URL missing. Set EXPO_PUBLIC_API_URL in your Expo environment.");
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/mobile-auth${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to connect to PetCard. Check your internet connection and API URL.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

export const mobileAuthApi = {
  signup: (payload: { name: string; email: string; phone: string; password: string }) => post("/signup", payload),
  verifyOtp: (payload: { email: string; otp: string }) => post("/verify-otp", payload),
  resendOtp: (email: string) => post("/resend-otp", { email }),
  login: (payload: { email: string; password: string }) => post("/login", payload),
  forgotPassword: (email: string) => post("/forgot-password", { email }),
  resetPassword: (payload: { email: string; otp: string; newPassword: string }) => post("/reset-password", payload),
};
