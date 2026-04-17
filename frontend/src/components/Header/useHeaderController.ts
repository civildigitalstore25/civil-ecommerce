import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, isAdmin } from "../../utils/auth";
import { useUser, useUserInvalidate, useLogout } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

export function useHeaderController() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<null | "auth" | "user">(
    null,
  );
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const autodeskButtonRef = useRef<HTMLDivElement>(null);
  const microsoftButtonRef = useRef<HTMLDivElement>(null);
  const adobeButtonRef = useRef<HTMLDivElement>(null);
  const antivirusButtonRef = useRef<HTMLDivElement>(null);
  const allCategoriesButtonRef = useRef<HTMLDivElement>(null);

  const { data: user } = useUser();
  const invalidateUser = useUserInvalidate();
  const navigate = useNavigate();
  const { getItemCount } = useCartContext();
  const { colors, theme } = useAdminTheme();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        invalidateUser();
        navigate("/");
        window.location.reload();
      },
      onError: () => {
        clearAuth();
        invalidateUser();
        navigate("/");
        window.location.reload();
      },
    });
  }, [logoutMutation, invalidateUser, navigate]);

  const handleNavigation = useCallback(
    (href: string) => {
      if (href === "/admin-login") {
        setShowAdminDashboard(true);
      } else if (href === "/") {
        setShowAdminDashboard(false);
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (href === "/logout") {
        handleLogout();
      } else {
        navigate(href);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setIsMenuOpen(false);
    },
    [handleLogout, navigate],
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((o) => !o), []);

  const handleDropdownOpen = useCallback(
    (key: typeof openDropdown) => setOpenDropdown(key),
    [],
  );

  const handleDropdownClose = useCallback(() => setOpenDropdown(null), []);

  return {
    refs: {
      autodeskButtonRef,
      microsoftButtonRef,
      adobeButtonRef,
      antivirusButtonRef,
      allCategoriesButtonRef,
    },
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu,
    openDropdown,
    handleDropdownOpen,
    handleDropdownClose,
    showAdminDashboard,
    setShowAdminDashboard,
    handleNavigation,
    handleLogout,
    user,
    getItemCount,
    colors,
    theme,
    isAdminUser: user ? isAdmin(user) : false,
  };
}
