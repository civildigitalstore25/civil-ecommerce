import { Link } from "react-router-dom";

export function VyaparFooter() {
  return (
    <footer className="hidden sm:block border-t border-red-50 bg-[#FFFBF8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs text-gray-500">
          Vyapar licenses available on{" "}
          <Link to="/" className="font-medium text-[#ED1A3B] hover:underline">
            SoftZCart
          </Link>
          . Pricing shown for reference; purchase through our store for instant
          delivery.
        </p>
        <p className="mt-3 text-xs text-gray-400">
          © {new Date().getFullYear()} SoftZCart. Vyapar is a trademark of
          Simply Vyapar Apps Pvt. Ltd.
        </p>
      </div>
    </footer>
  );
}
