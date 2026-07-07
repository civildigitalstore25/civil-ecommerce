const VYAPAR_LOGO_SRC = "/vyappar-logo.svg";

interface VyaparLogoProps {
  className?: string;
}

export function VyaparLogo({ className = "h-8 w-auto" }: VyaparLogoProps) {
  return (
    <img
      src={VYAPAR_LOGO_SRC}
      alt="Vyapar"
      className={`object-contain ${className}`}
    />
  );
}
