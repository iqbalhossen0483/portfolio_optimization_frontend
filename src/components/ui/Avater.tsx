import { cn } from "@/lib/cn";
import Image from "next/image";

function getInitials(name: string) {
  const source = (name || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

type Props = {
  profileImage: string | null;
  userName: string;
  size?: "sm" | "md" | "lg";
};
const Avater = ({ profileImage, userName, size }: Props) => {
  const sizeClasses = {
    sm: "size-9",
    md: "size-11",
    lg: "size-20",
  };
  const textClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden bg-primary text-primary-fg flex items-center justify-center font-semibold border border-border",
        sizeClasses[size || "md"],
        textClasses[size || "md"],
      )}
    >
      {profileImage ? (
        <Image
          height={80}
          width={80}
          src={profileImage}
          alt="Avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(userName)
      )}
    </div>
  );
};

export default Avater;
