import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STORAGE_KEY } from "@/constants";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/lib/storage";
import type { AuthUser, PersistedAuth } from "@/types";

function loadPersistedAuth(): PersistedAuth | null {
  const raw = getStorageItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedAuth;
    if (parsed.user && !parsed.user.role) {
      parsed.user.role = "user";
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistAuth(state: PersistedAuth | null): void {
  if (!state) {
    removeStorageItem(AUTH_STORAGE_KEY);
    return;
  }
  setStorageItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

const persisted = loadPersistedAuth();

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: persisted?.user ?? null,
  accessToken: persisted?.accessToken ?? null,
  isAuthenticated: Boolean(persisted?.accessToken),
  isHydrated: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      persistAuth({
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      });
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      persistAuth(null);
    },
    updateUser(state, action: PayloadAction<AuthUser>) {
      if (!state.user || state.user.id !== action.payload.id) return;
      state.user = action.payload;
      if (state.accessToken) {
        persistAuth({ user: action.payload, accessToken: state.accessToken });
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsHydrated = (state: { auth: AuthState }) => state.auth.isHydrated;
