import { AppProviders } from "@/context";
import { AppRouter } from "@/routes";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
