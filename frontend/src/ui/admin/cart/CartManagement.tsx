import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Mail, Phone, ShoppingCart } from "lucide-react";
import { useAdminCarts } from "../../../api/cartApi";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

const CartManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "has-items" | "abandoned">("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status,
      page,
      limit: 10,
    }),
    [search, status, page],
  );

  const { data, isLoading, error } = useAdminCarts(queryParams);
  const carts = data?.data?.carts || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          Cart Management
        </h2>
        <div className="text-sm" style={{ color: colors.text.secondary }}>
          Track users with products in cart for manual follow-up
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by user, email, phone, product..."
          className="border rounded-lg px-3 py-2"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | "has-items" | "abandoned");
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option value="all">All Carts</option>
          <option value="has-items">Has Items</option>
          <option value="abandoned">Abandoned (24h+)</option>
        </select>
        <div
          className="rounded-lg px-3 py-2 text-sm flex items-center"
          style={{
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.primary}`,
            color: colors.text.secondary,
          }}
        >
          {pagination?.totalCarts ?? 0} cart{(pagination?.totalCarts ?? 0) !== 1 ? "s" : ""} found
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: colors.text.secondary }}>Loading carts...</div>
      ) : error ? (
        <div style={{ color: colors.status.error }}>Failed to load cart data.</div>
      ) : carts.length === 0 ? (
        <div style={{ color: colors.text.secondary }}>No carts found for this filter.</div>
      ) : (
        <div className="space-y-3">
          {carts.map((cart) => {
            const user = cart.user || {};
            const isExpanded = expandedId === cart._id;
            return (
              <div
                key={cart._id}
                className="rounded-xl border"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <button
                  type="button"
                  className="w-full p-4 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : cart._id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                    <div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>
                        {user.fullName || "Unknown User"}
                      </div>
                      <div className="text-sm" style={{ color: colors.text.secondary }}>
                        {user.email || "No email"} {user.phoneNumber ? `• ${user.phoneNumber}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm" style={{ color: colors.text.secondary }}>
                      <span className="inline-flex items-center gap-1">
                        <ShoppingCart size={14} />
                        {cart.summary?.itemCount || 0} items
                      </span>
                      <span>Total: Rs. {Number(cart.summary?.total || 0).toFixed(2)}</span>
                      <span>Updated: {new Date(cart.updatedAt).toLocaleString()}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: colors.border.primary }}>
                    <div className="flex flex-wrap gap-2 mt-3 mb-3">
                      {user.email && (
                        <a
                          href={`mailto:${user.email}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm"
                          style={{ backgroundColor: `${colors.interactive.primary}20`, color: colors.interactive.primary }}
                        >
                          <Mail size={14} /> Email
                        </a>
                      )}
                      {user.phoneNumber && (
                        <a
                          href={`tel:${user.phoneNumber}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm"
                          style={{ backgroundColor: `${colors.status.success}20`, color: colors.status.success }}
                        >
                          <Phone size={14} /> Call
                        </a>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ color: colors.text.secondary }}>
                            <th className="text-left py-2">Product</th>
                            <th className="text-left py-2">Brand</th>
                            <th className="text-left py-2">Category</th>
                            <th className="text-left py-2">License</th>
                            <th className="text-right py-2">Qty</th>
                            <th className="text-right py-2">Price</th>
                            <th className="text-right py-2">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item) => (
                            <tr key={item._id} className="border-t" style={{ borderColor: colors.border.primary }}>
                              <td className="py-2" style={{ color: colors.text.primary }}>
                                {item.product?.name || "Deleted product"}
                              </td>
                              <td className="py-2" style={{ color: colors.text.secondary }}>
                                {item.product?.brand || item.product?.company || "-"}
                              </td>
                              <td className="py-2" style={{ color: colors.text.secondary }}>
                                {item.product?.category || "-"}
                              </td>
                              <td className="py-2" style={{ color: colors.text.secondary }}>
                                {item.licenseType}
                              </td>
                              <td className="py-2 text-right" style={{ color: colors.text.primary }}>
                                {item.quantity}
                              </td>
                              <td className="py-2 text-right" style={{ color: colors.text.primary }}>
                                Rs. {Number(item.price || 0).toFixed(2)}
                              </td>
                              <td className="py-2 text-right font-semibold" style={{ color: colors.text.primary }}>
                                Rs. {Number(item.totalPrice || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
            style={{ borderColor: colors.border.primary, color: colors.text.primary }}
          >
            Prev
          </button>
          <span style={{ color: colors.text.secondary }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
            style={{ borderColor: colors.border.primary, color: colors.text.primary }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CartManagement;
