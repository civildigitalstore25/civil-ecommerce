import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import type { Product } from "../../api/types/productTypes";

interface UseProductDetailEnquiryProps {
  product: Product | undefined;
  selectedOption: { priceINR: number; priceUSD: number; label: string } | undefined;
  formatPriceWithSymbol: (priceINR: number, priceUSD: number) => string;
  colors: any;
}

export function useProductDetailEnquiry({
  product,
  selectedOption,
  formatPriceWithSymbol,
  colors,
}: UseProductDetailEnquiryProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [showSiteEnquiryModal, setShowSiteEnquiryModal] = useState(false);
  const enquiryTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const getDefaultMessage = () => {
    const productName = product?.name || "this product";
    const productPrice = selectedOption
      ? formatPriceWithSymbol(selectedOption.priceINR, selectedOption.priceUSD)
      : "";
    return `Hi, I'm interested in ${productName}${productPrice ? ` (${productPrice})` : ""}.\n\nI would like to know more about the product and pricing.\n\n`;
  };

  const openEnquiryModal = () => {
    setEnquiryMessage(getDefaultMessage());
    setIsCustomMessage(false);
    setShowEnquiryModal(true);
  };

  const closeEnquiryModal = () => {
    setShowEnquiryModal(false);
    setIsCustomMessage(false);
    setEnquiryMessage("");
  };

  const revertEnquiryToDefaultMessage = () => {
    setEnquiryMessage(getDefaultMessage());
    setIsCustomMessage(false);
  };

  const handleEnquirySubmit = () => {
    if (!enquiryMessage.trim()) {
      Swal.fire({
        title: "Message Required",
        text: "Please enter your enquiry message",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: colors.interactive.primary,
      });
      return;
    }

    const productName = product?.name || "this product";
    const productLink = window.location.href;
    const message = `Hi, I'm interested in ${productName}.\n\nMy Enquiry:\n${enquiryMessage}\n\nProduct Link: ${productLink}`;
    const whatsappNumber = "918807423228";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    closeEnquiryModal();

    Swal.fire({
      title: "Redirecting to WhatsApp",
      text: "Your enquiry will be sent via WhatsApp",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    if (isCustomMessage) {
      setTimeout(() => enquiryTextareaRef.current?.focus(), 0);
    }
  }, [isCustomMessage]);

  return {
    showEnquiryModal,
    setShowEnquiryModal,
    enquiryMessage,
    setEnquiryMessage,
    isCustomMessage,
    setIsCustomMessage,
    showSiteEnquiryModal,
    setShowSiteEnquiryModal,
    enquiryTextareaRef,
    openEnquiryModal,
    closeEnquiryModal,
    revertEnquiryToDefaultMessage,
    handleEnquirySubmit,
  };
}
