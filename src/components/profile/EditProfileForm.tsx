"use client";

import { AlertMessage } from "@/components/ui/AlertMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useUpdateMeMutation } from "@/store/api";
import type { UserProfile } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Avater from "../ui/Avater";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const FILE_INPUT_ID = "profile-avatar-input";

const profileSchema = z
  .object({
    name: z.string().min(3).max(64).optional().or(z.literal("")),
    about_me: z.string().max(2000).optional().or(z.literal("")),
    password: z.string().min(8).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileSchema = z.infer<typeof profileSchema>;

export function EditProfileForm({ user }: { user: UserProfile }) {
  const [updateMe] = useUpdateMeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    reset,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      about_me: user.about_me ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!ACCEPTED_TYPES.includes(picked.type)) {
      setFileError("Unsupported image type. Use JPG, PNG, WEBP, or GIF.");
      return;
    }
    if (picked.size > MAX_AVATAR_BYTES) {
      setFileError("Image exceeds 5MB limit.");
      return;
    }
    setFile(picked);
  };

  const clearPickedFile = () => {
    setFile(null);
    setFileError(null);
    setFileInputKey((k) => k + 1);
  };

  const onSubmit = async (data: ProfileSchema) => {
    const fd = new FormData();
    let dirty = false;

    if (data.name && data.name !== user.name) {
      fd.append("name", data.name);
      dirty = true;
    }
    if ((data.about_me ?? "") !== (user.about_me ?? "")) {
      fd.append("about_me", data.about_me ?? "");
      dirty = true;
    }
    if (data.password) {
      fd.append("password", data.password);
      dirty = true;
    }
    if (file) {
      fd.append("profile", file);
      dirty = true;
    }

    if (!dirty) return;

    try {
      await updateMe(fd).unwrap();
      toast.success("Profile updated");
      reset({
        name: data.name,
        about_me: data.about_me,
        password: "",
        confirmPassword: "",
      });
      clearPickedFile();
    } catch {
      setError("root", { message: "Update failed. Please try again." });
    }
  };

  const currentAvatar = previewUrl ?? user.profile;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avater profileImage={currentAvatar} userName={user.name} size="lg" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor={FILE_INPUT_ID}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-raised hover:bg-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors"
            >
              <Camera className="w-4 h-4" />
              {file ? "Change" : "Upload Photo"}
            </label>
            {file && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearPickedFile}
                aria-label="Remove selected photo"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-subtle">JPG, PNG · max 5MB</p>
          {file && (
            <p className="text-xs text-muted truncate max-w-48">{file.name}</p>
          )}
          {fileError && <p className="text-xs text-destructive">{fileError}</p>}
        </div>
        <input
          key={fileInputKey}
          id={FILE_INPUT_ID}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFilePick}
        />
      </div>

      <Input
        label="Name"
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register("name")}
      />

      <TextArea
        label="About me"
        rows={4}
        placeholder="Tell us a bit about yourself"
        error={errors.about_me?.message}
        {...register("about_me")}
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

      <Button type="submit" loading={isSubmitting} disabled={!isDirty && !file}>
        Save Changes
      </Button>
    </form>
  );
}
