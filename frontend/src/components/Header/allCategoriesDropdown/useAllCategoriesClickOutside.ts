import { useEffect, type RefObject } from "react";

export function useAllCategoriesClickOutside(
  isOpen: boolean,
  onClose: () => void,
  buttonRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);
}
