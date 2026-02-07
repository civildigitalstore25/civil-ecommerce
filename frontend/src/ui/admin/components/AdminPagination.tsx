import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const AdminPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) => {
  const { colors } = useAdminTheme();
  const [goTo, setGoTo] = React.useState<string>(String(currentPage));

  React.useEffect(() => {
    setGoTo(String(currentPage));
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const goToPage = () => {
    const parsed = Number.parseInt(goTo, 10);
    if (Number.isNaN(parsed)) return;
    onPageChange(clamp(parsed, 1, totalPages));
  };

  return (
    <div
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <label
          className="text-sm font-medium"
          style={{ color: colors.text.secondary }}
        >
          Rows
        </label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm" style={{ color: colors.text.secondary }}>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: colors.text.secondary }}
          >
            Go to
          </label>
          <input
            value={goTo}
            onChange={(e) => setGoTo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToPage();
            }}
            inputMode="numeric"
            className="w-20 rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
          <button
            onClick={goToPage}
            className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interactive.primaryHover || colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.interactive.primary;
            }}
          >
            Go
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPagination;
