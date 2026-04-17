import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { getUserEnquiries, type Enquiry } from "../../api/enquiryApi";

export function useUserEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEnquiries, setExpandedEnquiries] = useState<Set<string>>(
    new Set(),
  );

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserEnquiries({ limit: 100 });
      setEnquiries(response.enquiries);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load enquiries";
      void Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  const toggleReply = useCallback((enquiryId: string) => {
    setExpandedEnquiries((prev) => {
      const next = new Set(prev);
      if (next.has(enquiryId)) {
        next.delete(enquiryId);
      } else {
        next.add(enquiryId);
      }
      return next;
    });
  }, []);

  return {
    enquiries,
    loading,
    expandedEnquiries,
    toggleReply,
  };
}
