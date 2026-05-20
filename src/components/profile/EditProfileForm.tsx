"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useUpdateMeMutation } from "@/store/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertMessage } from "@/components/ui/AlertMessage";
import type { UserProfile } from "@/types/api";

const profileSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    username: z.string().min(3).max(64).optional().or(z.literal("")),
    password: z.string().min(8).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) return false;
      return true;
    },
    { message: "Passwords do not match", path: ["confirmPassword"] },
  );

type ProfileSchema = z.infer<typeof profileSchema>;

export function EditProfileForm({ user }: { user: UserProfile }) {
  const [updateMe] = useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user.email, username: user.username },
  });

  const onSubmit = async (data: ProfileSchema) => {
    const body: Partial<{ email: string; username: string; password: string }> = {};
    if (data.email && data.email !== user.email) body.email = data.email;
    if (data.username && data.username !== user.username) body.username = data.username;
    if (data.password) body.password = data.password;

    if (Object.keys(body).length === 0) return;

    try {
      await updateMe(body).unwrap();
      toast.success("Profile updated");
    } catch {
      setError("root", { message: "Update failed. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Username"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        label="New Password"
        type="password"
        placeholder="Leave blank to keep current"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {errors.root && <AlertMessage message={errors.root.message ?? ""} />}
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        Save Changes
      </Button>
    </form>
  );
}
