import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components";
import { ProfileForm } from "@/features/users";
import type { ProfileFormValues } from "@/features/users/schemas/profile.schema";
import { useAuth } from "@/hooks";
import { userService } from "@/services";
import { updateUser } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { getErrorMessage } from "@/utils";

export function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (values: ProfileFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      const updated = await userService.update(user.id, values);
      dispatch(
        updateUser({
          id: updated.id,
          email: updated.email,
          displayName: updated.displayName,
          role: updated.role,
        }),
      );
      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(getErrorMessage(e, "Failed to update profile"));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">Your profile</h1>
            <p className="mt-1 text-sm text-slate-400">Update your display name and email.</p>
          </div>
          <Link to="/chat" className="shrink-0">
            <Button variant="ghost" size="sm" type="button" className="w-full sm:w-auto">
              Back to chat
            </Button>
          </Link>
        </div>

        <ProfileForm
          defaultValues={{ displayName: user.displayName, email: user.email }}
          onSubmit={handleSubmit}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
}
