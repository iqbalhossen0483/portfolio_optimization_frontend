"use client";

import { useGetMeQuery } from "@/store/api";
import { AccountInfoCard } from "@/components/profile/AccountInfoCard";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Typography } from "@/components/ui/Typography";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery();

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <Typography variant="h2">Profile</Typography>
      {isLoading || !user ? (
        <Skeleton count={4} className="h-16 mb-4" />
      ) : (
        <>
          <AccountInfoCard user={user} />
          <div className="rounded-xl border border-border bg-surface p-6">
            <Typography variant="h3" className="mb-4">
              Edit Profile
            </Typography>
            <EditProfileForm user={user} />
          </div>
        </>
      )}
    </div>
  );
}
