import { Link } from "react-router-dom";
import { Button } from "@/components";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-slate-700">404</h1>
      <p className="text-slate-400">Page not found</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
