import type { Banner } from "../../../types/Banner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchBannersList(): Promise<Banner[]> {
  const res = await fetch(`${API_URL}/api/banners`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function deleteBannerById(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/banners/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("delete failed");
}

export async function saveBannerRequest(
  editingBanner: Banner | null,
  data: Banner,
): Promise<void> {
  const url = editingBanner
    ? `${API_URL}/api/banners/${editingBanner._id}`
    : `${API_URL}/api/banners`;
  const method = editingBanner ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("save failed");
}
