import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfileAvatarBackgroundColor } from "./profileAvatarColor";
interface ProfileAvatarProps {
  fullName: string;
  userId?: string;
}
export default function ProfileAvatar({ fullName, userId }: ProfileAvatarProps) {
  const navigate = useNavigate();
 const { initials, backgroundColor } = useMemo(() => {
    const cleanName = fullName.trim();
    const extractedInitials = cleanName
      ? cleanName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join("")
      : "";

    return {
      initials: extractedInitials,
      backgroundColor: getProfileAvatarBackgroundColor(
        userId?.trim() || cleanName
      ),
    };
  }, [fullName, userId]);

  const handleNavigateToProfile = () => {
    navigate({ to: "/account/profile" });
  };
return (
    <button
      type="button"
      onClick={handleNavigateToProfile}
      aria-label={fullName ? `Go to ${fullName}'s profile` : "Go to profile"}
      className="group cursor-pointer relative inline-flex rounded-full outline-none"
    >
      <Avatar className="size-8.5">
        <AvatarFallback
          style={{ backgroundColor }}
          className="text-[14px] leading-[18px] font-medium text-white select-none"
        >
          {initials || <UserRound className="size-4" aria-hidden="true" />}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}