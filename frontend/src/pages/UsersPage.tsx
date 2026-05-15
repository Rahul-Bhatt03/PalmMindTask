import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Spinner } from "@/components";
import { UsersTable } from "@/features/users";
import { useAuth } from "@/hooks";
import { userService } from "@/services";
import type { PaginatedUsers, UserProfile } from "@/types";
import { getErrorMessage } from "@/utils";

export function UsersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.list({ page: targetPage, limit: 20 });
      setData(result);
      setPage(result.page);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers(page);
  }, [loadUsers, page]);

  const handleDelete = async (target: UserProfile) => {
    if (!window.confirm(`Delete ${target.displayName}? This cannot be undone.`)) return;
    setDeletingId(target.id);
    setError(null);
    try {
      await userService.remove(target.id);
      await loadUsers(page);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to delete user"));
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-950 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">User management</h1>
            <p className="mt-1 text-sm text-slate-400">Admin-only list of registered users.</p>
          </div>
          <Link to="/chat" className="shrink-0">
            <Button variant="ghost" size="sm" type="button" className="w-full sm:w-auto">
              Back to chat
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading && !data ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
            <UsersTable
              users={data?.users ?? []}
              currentUser={user}
              onDelete={handleDelete}
              deletingId={deletingId}
            />

            {data && data.totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-slate-500 sm:text-left">
                  Page {data.page} of {data.totalPages} · {data.total} users
                </p>
                <div className="flex justify-center gap-2 sm:justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.page >= data.totalPages || loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
