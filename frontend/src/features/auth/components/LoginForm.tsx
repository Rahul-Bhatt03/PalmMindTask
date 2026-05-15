import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Alert, Button, Input } from "@/components";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  error?: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4"
      noValidate
    >
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-400">
        No account?{" "}
        <Link to="/register" className="text-brand-400 hover:text-brand-300">
          Create one
        </Link>
      </p>
    </form>
  );
}
