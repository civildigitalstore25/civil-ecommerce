import { Link } from "react-router-dom";

export function VyaparHeader() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Link to="/vyapar" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ED1A3B] to-[#F5A623] text-xl font-black text-white shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
            V
          </span>
          <span className="text-2xl font-bold text-[#ED1A3B] sm:text-3xl">Vyapar</span>
        </Link>

        <nav className="hidden items-center gap-8 text-base font-medium text-gray-700 sm:flex">
          <button type="button" onClick={() => scrollTo("solutions")} className="hover:text-[#ED1A3B] transition-colors">
            Solution
          </button>
          <button type="button" onClick={() => scrollTo("pricing")} className="hover:text-[#ED1A3B] transition-colors">
            Pricing
          </button>
        </nav>

        <Link
          to="/"
          className="text-sm font-medium text-gray-500 hover:text-[#ED1A3B] transition-colors sm:text-base"
        >
          Back to SoftZCart
        </Link>
      </div>
    </header>
  );
}
