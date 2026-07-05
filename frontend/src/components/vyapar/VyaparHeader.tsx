import { Link } from "react-router-dom";

export function VyaparHeader() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/vyapar" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ED1A3B] to-[#F5A623] text-lg font-black text-white">
            V
          </span>
          <span className="text-xl font-bold text-[#ED1A3B]">Vyapar</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 sm:flex">
          <button type="button" onClick={() => scrollTo("solutions")}>
            Solution
          </button>
          <button type="button" onClick={() => scrollTo("pricing")}>
            Pricing
          </button>
        </nav>

        <Link
          to="/"
          className="text-xs font-medium text-gray-500 hover:text-[#ED1A3B] sm:text-sm"
        >
          Back to SoftZCart
        </Link>
      </div>
    </header>
  );
}
