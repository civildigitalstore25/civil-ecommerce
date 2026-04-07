import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Banner } from "../../../types/Banner";
import { parseActiveBannersResponse } from "./parseActiveBannersResponse";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`;

export function useBannerCarousel(page: "home" | "product") {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/banners/active/${page}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setBanners(parseActiveBannersResponse(result));
      } catch (err) {
        console.error(`Error fetching banners for ${page}:`, err);
        setBanners([]);
      }
    };
    fetchBanners();
  }, [page]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handleClick = useCallback((link?: string) => {
    if (!link) return;
    if (link.startsWith("http")) window.open(link, "_blank");
    else navigate(link);
  }, [navigate]);

  const banner = banners[current] ?? null;
  const totalSlides = banners.length;

  return {
    banners,
    current,
    setCurrent,
    banner,
    totalSlides,
    prevSlide,
    nextSlide,
    handleClick,
  };
}
