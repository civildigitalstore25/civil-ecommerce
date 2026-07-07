import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VYAPAR_SHOP_HREF } from "./vyaparContent";

interface VyaparCtaButtonProps {
  label?: string;
  className?: string;
  fullWidth?: boolean;
  /** Override the default navigate behaviour (e.g. open a modal). */
  onClick?: () => void;
}

export function VyaparCtaButton({
  label = "Start 7 Day Free Trial",
  className = "",
  fullWidth = false,
  onClick,
}: VyaparCtaButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(VYAPAR_SHOP_HREF))}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ED1A3B] to-[#F0526D] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200/60 transition hover:brightness-105 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
