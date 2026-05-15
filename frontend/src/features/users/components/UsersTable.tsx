import { Badge, Button } from "@/components";
import type { AuthUser, UserProfile } from "@/types";

interface UsersTableProps {
  users: UserProfile[];
  currentUser: AuthUser;
  onDelete: (user: UserProfile) => void;
  deletingId: string | null;
}

export function UsersTable({ users, currentUser, onDelete, deletingId }: UsersTableProps) {
  if (users.length === 0) {
    return <p className="text-sm text-slate-400">No users found.</p>;
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="flex flex-col gap-3 md:hidden">
        {users.map((user) => {
          const isSelf = user.id === currentUser.id;
          return (
            <li
              key={user.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-200">{user.displayName}</p>
                  <p className="mt-0.5 truncate text-sm text-slate-400">{user.email}</p>
                </div>
                <Badge variant={user.role === "admin" ? "online" : "offline"}>
                  {user.role}
                </Badge>
              </div>
              <div className="mt-3">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isSelf}
                  isLoading={deletingId === user.id}
                  onClick={() => onDelete(user)}
                >
                  Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop: table */}
      <div className="hidden w-full overflow-x-auto rounded-xl border border-slate-800 md:block">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => {
              const isSelf = user.id === currentUser.id;
              return (
                <tr key={user.id} className="bg-slate-950/40 hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium text-slate-200">{user.displayName}</td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-slate-400 xl:max-w-none">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "online" : "offline"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isSelf}
                      isLoading={deletingId === user.id}
                      onClick={() => onDelete(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
