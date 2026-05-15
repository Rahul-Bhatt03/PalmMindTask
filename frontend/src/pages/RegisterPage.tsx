import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm, type RegisterFormValues } from "@/features/auth";
import { authService } from "@/services";
import { setCredentials } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { getErrorMessage } from "@/utils";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: RegisterFormValues) => {
    setError(null);
    try {
      const result = await authService.register(values);
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
        }),
      );
      navigate("/chat", { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "Registration failed"));
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Create account</h1>
        <p className="mt-2 text-slate-400">Join the real-time chat platform</p>
      </div>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  );
}
