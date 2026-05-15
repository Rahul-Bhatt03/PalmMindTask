import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";
import { AUTH_STORAGE_KEY } from "@/constants";
import { getStorageItem } from "@/lib/storage";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

type TokenGetter = () => string | null;

let tokenGetter: TokenGetter = () => {
  try {
    const raw = getStorageItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
};

export function setTokenGetter(getter: TokenGetter): void {
  tokenGetter = getter;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
