import React, { useEffect, useState } from "react";
import { Edit3, Trash, Plus, Calendar, ExternalLink } from "lucide-react";
import BannerForm from "./BannerForm";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import type { Banner } from "../../types/Banner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const truncate = (s: string, n = 120) =>
  s && s.length > n ? s.slice(0, n).trim() + "..." : s;

const BannerManagement: React.FC = () => {
  const { cardStyle } = useAdminThemeStyles();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { colors, theme } = useAdminTheme();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBanners(data.success ? data.data : []);
    } catch (err) {
      console.error(err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("delete failed");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error deleting banner");
    }
  };

  const handleFormSubmit = async (data: Banner) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingBanner
        ? `${API_URL}/api/banners/${editingBanner._id}`
        : `${API_URL}/api/banners`;
      const method = editingBanner ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("save failed");
      setShowForm(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  };

  return (
    <div
      className="p-6 sm:p-8 min-h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => {
            setShowForm(false);
            setEditingBanner(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-6 gap-3">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Banner Management
          </h1>
          <div
            className="w-20 h-1 rounded-full"
            style={{ backgroundColor: colors.interactive.primary }}
          ></div>
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: colors.text.secondary }}
          >
            Create & manage promotional banners
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-md transition w-full sm:w-auto justify-center border-2"
          style={{
            background: theme === "dark"
              ? 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)'
              : 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
            color: colors.text.inverse,
            border: 'none',
          }}
        >
          <Plus size={20} /> Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="mt-4 sm:mt-6 flex flex-col gap-4">
        {loading ? (
          <div
            className="text-center py-16"
            style={{ color: colors.text.secondary }}
          >
            Loading...
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div
              className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-lg border-2 w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-28 md:min-h-32 lg:min-h-36"
              style={{
                borderColor: colors.interactive.primary,
                color: colors.text.secondary,
                backgroundColor: colors.background.secondary,
              }}
            >
              <div
                className="mb-3 md:mb-4 p-3 md:p-4 rounded-full"
                style={{
                  background: theme === "dark"
                    ? 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)'
                    : 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
                  color: colors.text.inverse,
                  border: 'none',
                }}
              >
                <Plus
                  size={24}
                  className="md:w-8 md:h-8"

                />
              </div>
              <h2
                className="text-lg sm:text-xl font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                No banners found
              </h2>
              <p className="text-sm sm:text-base mb-4 max-w-md" style={{ color: colors.text.secondary }}>
                Create your first banner to promote offers and updates to your
                customers.
              </p>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setShowForm(true);
                }}
                style={{
                  background: theme === "dark"
                    ? 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)'
                    : 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
                  color: colors.text.inverse,
                  border: 'none',
                }}
                className="rounded-lg px-4 py-2 font-medium hover:shadow-md transition border-2"
              >
                Create Your First Banner
              </button>
            </div>
          </div>
        ) : (
          banners.map((b, idx) => {
            return (
              <div
                key={b._id}
                className="relative rounded-xl p-4 sm:p-6 flex flex-col justify-between gap-4 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                style={{
                  ...cardStyle("secondary"),
                  border: `1px solid ${colors.interactive.primary}`,
                  backgroundColor: colors.background.secondary,
                  transitionDelay: `${idx * 50}ms`,
                }}
              >
                {/* === Top-right badges === */}
                <div className="absolute top-3 right-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-end items-end">
                  <span
                    className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
                    style={{
                      backgroundColor: colors.interactive.primary + "20",
                      color: colors.interactive.primary,
                      borderColor: colors.interactive.primary + "40",
                    }}
                  >
                    {b.bannerType}
                  </span>

                  <span
                    className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      color: colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {b.status}
                  </span>
                </div>

                {/* === Main Content === */}
                <div className="flex flex-col gap-2 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold" style={{ color: colors.text.primary }}>{b.title}</h3>
                  <p className="text-sm sm:text-base" style={{ color: colors.text.secondary }}>
                    {truncate(b.description, 100)}
                  </p>

                  {/* === Date + Priority + Position + Buttons Row === */}
                  <div className="flex flex-wrap justify-between items-center mt-3 gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={14} />
                        <span style={{ color: colors.text.secondary }}>
                          {new Date(b.startDate).toLocaleDateString()} —{" "}
                          {new Date(b.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="hidden sm:inline" style={{ color: colors.border.primary }}>|</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <ExternalLink size={14} />
                        <span className="font-semibold" style={{ color: colors.text.secondary }}>
                          Priority: {b.priority}/10
                        </span>
                      </div>
                      <span className="hidden sm:inline" style={{ color: colors.border.primary }}>|</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span
                          className="font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          Position: {b.position}
                        </span>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBanner(b);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-full border hover:opacity-80 transition"
                        style={{
                          backgroundColor: "transparent",
                          color: colors.interactive.primary,
                          borderColor: colors.interactive.primary,
                          borderWidth: "1px",
                        }}
                        title="Edit banner"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={() => b._id && handleDelete(b._id)}
                        className="p-2 rounded-full border hover:opacity-80 transition"
                        style={{
                          backgroundColor: "transparent",
                          color: colors.status.error,
                          borderColor: colors.status.error,
                          borderWidth: "1px",
                        }}
                        title="Delete banner"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
