import { useState, useEffect, useCallback } from "react";
import {
  getAllEnquiries,
  replyToEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  type Enquiry,
} from "../../../api/enquiryApi";
import Swal from "sweetalert2";

const INITIAL_STATS = { pending: 0, replied: 0, closed: 0 };

export function useEnquiryManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState(INITIAL_STATS);

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params =
        filterStatus !== "all" ? { status: filterStatus } : undefined;
      const response = await getAllEnquiries(params);
      setEnquiries(response.enquiries);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load enquiries";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const handleReply = async () => {
    if (!selectedEnquiry || !replyText.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a reply message",
      });
      return;
    }

    try {
      setIsReplying(true);
      const updatedEnquiry = await replyToEnquiry(
        selectedEnquiry._id,
        replyText,
      );

      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === updatedEnquiry._id ? updatedEnquiry : enq)),
      );

      setSelectedEnquiry(updatedEnquiry);
      setReplyText("");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Reply sent successfully",
        timer: 2000,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send reply";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (enquiryId: string, status: string) => {
    try {
      const updatedEnquiry = await updateEnquiryStatus(
        enquiryId,
        status as "pending" | "replied" | "closed",
      );

      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === updatedEnquiry._id ? updatedEnquiry : enq)),
      );

      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry(updatedEnquiry);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Status updated successfully",
        timer: 2000,
      });

      loadEnquiries();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  const handleDelete = async (enquiryId: string) => {
    const result = await Swal.fire({
      title: "Delete Enquiry",
      text: "Are you sure you want to delete this enquiry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteEnquiry(enquiryId);
      setEnquiries((prev) => prev.filter((enq) => enq._id !== enquiryId));
      setSelectedEnquiry(null);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Enquiry deleted successfully",
        timer: 2000,
      });

      loadEnquiries();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete enquiry";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  const selectEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyText(enquiry.adminReply || "");
  };

  return {
    enquiries,
    loading,
    selectedEnquiry,
    setSelectedEnquiry,
    replyText,
    setReplyText,
    isReplying,
    filterStatus,
    setFilterStatus,
    stats,
    handleReply,
    handleStatusChange,
    handleDelete,
    selectEnquiry,
  };
}
