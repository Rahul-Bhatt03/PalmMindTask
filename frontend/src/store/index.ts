import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  authReducer,
  setCredentials,
  logout,
  updateUser,
  selectAuth,
  selectCurrentUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectIsHydrated,
} from "./auth.slice";
