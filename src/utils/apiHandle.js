import axios from "axios";
import { siteConfig } from "@/config/site";
import { mockAdapter } from "@/mock/adapter";

/**
 * Single axios instance for every API call.
 * - Demo mode (no NEXT_PUBLIC_API_URL): requests are served by the simulated
 *   backend in src/mock, backed by seeded data in localStorage.
 * - Real backend: set NEXT_PUBLIC_API_URL and the same thunks hit your API.
 */
const apiHandle = axios.create({
  baseURL: siteConfig.apiUrl || "/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
  ...(siteConfig.demoMode ? { adapter: mockAdapter } : {}),
});

let storeRef = null;
let onSessionExpired = null;

/** Called once by the store so the interceptor can read the token without a circular import. */
export function injectStore(store, sessionExpiredHandler) {
  storeRef = store;
  onSessionExpired = sessionExpiredHandler;
}

apiHandle.interceptors.request.use((config) => {
  const token = storeRef?.getState()?.auth?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiHandle.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && storeRef?.getState()?.auth?.user_auth) {
      onSessionExpired?.();
    }
    return Promise.reject(error);
  }
);

export default apiHandle;
