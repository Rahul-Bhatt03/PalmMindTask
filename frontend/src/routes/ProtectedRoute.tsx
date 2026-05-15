import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated, selectIsHydrated } from "@/store/auth.slice";
import { useAppSelector } from "@/store/hooks";
import { Spinner } from "@/components";

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
