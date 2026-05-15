import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "@/sockets";
import {
  logout,
  selectAccessToken,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const signOut = useCallback(() => {
    disconnectSocket();
    dispatch(logout());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return {
    user,
    accessToken,
    isAuthenticated,
    signOut,
  };
}
