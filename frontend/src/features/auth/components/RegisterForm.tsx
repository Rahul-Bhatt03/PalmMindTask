import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Alert, Button, Input } from "@/components";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  error?: string | null;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4"
      noValidate
    >
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Display name"
        autoComplete="name"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-400 hover:text-brand-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}
