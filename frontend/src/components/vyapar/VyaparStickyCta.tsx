import { VyaparCtaButton } from "./VyaparCtaButton";

interface VyaparStickyCtaProps {
  onOpenModal?: () => void;
}

/** Fixed bottom bar - matches Vyapar marketing sticky trial CTA.
 *  Mobile: solid white card with top shadow (replaces the footer).
 *  Desktop (sm+): gradient pill centered at bottom.
 */
export function VyaparStickyCta({ onOpenModal }: VyaparStickyCtaProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-0 pb-0 sm:px-6 sm:pb-3 sm:pt-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="pointer-events-auto mx-auto max-w-xl">
        {/* Mobile: solid white sticky bar with shadow */}
        <div className="rounded-t-2xl bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] sm:rounded-full sm:bg-gradient-to-t sm:from-white sm:via-white/90 sm:to-transparent sm:px-1 sm:pt-3 sm:pb-0 sm:shadow-none">
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