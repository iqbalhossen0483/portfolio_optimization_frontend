"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { registerSchema, type RegisterSchema } from "@/lib/validators/auth";
import { useRegisterMutation } from "@/store/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [register] = useRegisterMutation();

  const {
    register: rhf,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterSchema) => {
    setServerError(null);
    try {
      await register({
        email: data.email,
        name: data.name,
        password: data.password,
      }).unwrap();
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.push("/chat");
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        setServerError("Email already taken");
      } else {
        setServerError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthCard>
      <Typography variant="h2" className="mb-6 text-center">
        Create account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...rhf("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...rhf("email")}
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
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...rhf("password")}
        />
        <Input
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...rhf("confirmPassword")}
        />
        {serverError && <AlertMessage message={serverError} />}
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
      <Typography variant="caption" as="p" className="text-center mt-4">
        Have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in →
        </Link>
      </Typography>
    </AuthCard>
  );
}
