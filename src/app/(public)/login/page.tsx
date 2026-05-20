"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { loginSchema, type LoginSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Invalid email or password");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/chat";
    router.push(callbackUrl);
  };

  return (
    <AuthCard>
      <div className="mb-7 text-center">
        <Typography variant="h2" className="text-foreground tracking-tight">
          Sign in
        </Typography>
        <p className="mt-1.5 text-xs text-muted tracking-wide">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Type your password"
          error={errors.password?.message}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...register("password")}
        />

        {authError && <AlertMessage message={authError} />}

        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="text-center mt-6 text-xs text-muted">
        No account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline underline-offset-2"
        >
          Register →
        </Link>
      </p>
    </AuthCard>
  );
}
