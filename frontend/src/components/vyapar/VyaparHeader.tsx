import { Link } from "react-router-dom";
import { VyaparLogo } from "./VyaparLogo";

export function VyaparHeader() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/vyapar" className="shrink-0">
          <VyaparLogo className="h-8 w-auto sm:h-12" />
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700 sm:gap-8 sm:text-base">
          <button
            type="button"
            onClick={() => scrollTo("solutions")}
            className="whitespace-nowrap transition-colors hover:text-[#ED1A3B]"
          >
            Solution
          </button>
          <button
            type="button"
            onClick={() => scrollTo("pricing")}
            className="whitespace-nowrap transition-colors hover:text-[#ED1A3B]"
          >
            Pricing
          </button>
        </nav>

        <Link
          to="/"
          className="shrink-0 text-xs font-medium text-gray-500 transition-colors hover:text-[#ED1A3B] sm:text-sm md:text-base"
        >
          <span className="sm:hidden">Back</span>
          <span className="hidden sm:inline">Back to SoftZCart</span>
        </Link>
      </div>
    </header>
  );
}
