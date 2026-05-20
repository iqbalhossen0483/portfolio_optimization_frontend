"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { Typography } from "@/components/ui/Typography";
import { loginSchema, type LoginSchema } from "@/lib/validators/auth";
import Link from "next/link";

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
      <Typography variant="h2" className="mb-6 text-center">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Sign in
        </Button>
      </form>
      <Typography variant="caption" as="p" className="text-center mt-4">
        No account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register →
        </Link>
      </Typography>
    </AuthCard>
  );
}
