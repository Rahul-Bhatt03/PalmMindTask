import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "@/store/auth.slice";
import { useAppSelector } from "@/store/hooks";

export function AdminRoute() {
  const user = useAppSelector(selectCurrentUser);

  if (user?.role !== "admin") {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
