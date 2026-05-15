import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "@/store";
import { useAppSelector } from "@/store/hooks";

export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
