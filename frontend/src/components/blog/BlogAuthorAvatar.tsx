import { getProfileInitials } from "../../utils/userDisplay";
import { blogTheme } from "./blogTheme";

type Props = {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md";
};

export function BlogAuthorAvatar({ name, avatarUrl, size = "md" }: Props) {
  const dim = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`${dim} rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <span
      className={`${dim} rounded-full shrink-0 inline-flex items-center justify-center font-bold ring-2 ring-white shadow-sm`}
      style={{
        backgroundColor: blogTheme.tagBg,
        color: blogTheme.tagText,
      }}
      aria-hidden
    >
      {getProfileInitials(name) || "?"}
    </span>
  );
}
