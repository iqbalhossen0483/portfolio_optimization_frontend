"use client";

import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGetMeQuery } from "@/store/api";
import { EditProfileForm } from "./EditProfileForm";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { data: user, isLoading } = useGetMeQuery(undefined, { skip: !open });

  return (
    <Modal open={open} onClose={onClose} title="Profile Settings" size="md">
      {isLoading || !user ? (
        <Skeleton count={4} className="h-12 mb-3" />
      ) : (
        <EditProfileForm user={user} />
      )}
    </Modal>
  );
}
