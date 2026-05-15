import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { setTokenGetter } from "@/api";
import { disconnectSocket } from "@/sockets";
import { logout, store } from "@/store";
import { selectAccessToken } from "@/store/auth.slice";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    setTokenGetter(() => selectAccessToken(store.getState()));

    const onUnauthorized = () => {
      disconnectSocket();
      store.dispatch(logout());
    };

    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
