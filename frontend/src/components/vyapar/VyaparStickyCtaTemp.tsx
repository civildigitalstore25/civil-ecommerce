import { VyaparCtaButton } from "./VyaparCtaButton";

interface VyaparStickyCtaProps {
  onOpenModal?: () => void;
}

/** Fixed bottom bar — matches Vyapar marketing sticky trial CTA. */
export function VyaparStickyCta({ onOpenModal }: VyaparStickyCtaProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-3 pt-2 sm:px-6"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto max-w-xl">
        <div className="rounded-full bg-gradient-to-t from-white via-white/90 to-transparent px-1 pt-3">
          <VyaparCtaButton
            fullWidth
            onClick={onOpenModal}
            className="py-4 text-base shadow-[0_8px_32px_rgba(237,26,59,0.35)] sm:text-lg"
          />
        </div>
      </div>
    </div>
  );
}
