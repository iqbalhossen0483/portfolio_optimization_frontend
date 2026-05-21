"use client";

import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppSelector } from "@/store/hooks";
import { EditProfileForm } from "./EditProfileForm";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const user = useAppSelector((s) => s.user.user);

  return (
    <Modal open={open} onClose={onClose} title="Profile Settings" size="md">
      {user ? (
        <EditProfileForm user={user} />
      ) : (
        <Skeleton count={4} className="h-12 mb-3" />
      )}
    </Modal>
  );
}
