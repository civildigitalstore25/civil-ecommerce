import React, { useState, useEffect } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import {
  getAllEnquiries,
  replyToEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  type Enquiry,
} from "../../api/enquiryApi";
import {
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Send,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

const EnquiryManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState({
    pending: 0,
    replied: 0,
    closed: 0,
  });

  useEffect(() => {
    loadEnquiries();
  }, [filterStatus]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      const response = await getAllEnquiries(params);
      setEnquiries(response.enquiries);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load enquiries",
      });
    } finally {
      setLoading(false);
    }
  };

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
        replyText
      );
      
      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === updatedEnquiry._id ? updatedEnquiry : enq))
      );
      
      setSelectedEnquiry(updatedEnquiry);
      setReplyText("");
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Reply sent successfully",
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to send reply",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (enquiryId: string, status: string) => {
    try {
      const updatedEnquiry = await updateEnquiryStatus(
        enquiryId,
        status as "pending" | "replied" | "closed"
      );
      
      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === updatedEnquiry._id ? updatedEnquiry : enq))
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
      
      loadEnquiries(); // Reload to update stats
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update status",
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
      
      loadEnquiries(); // Reload to update stats
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete enquiry",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Clock className="w-5 h-5" style={{ color: colors.status.warning }} />
        );
      case "replied":
        return (
          <CheckCircle
            className="w-5 h-5"
            style={{ color: colors.status.success }}
          />
        );
      case "closed":
        return (
          <XCircle className="w-5 h-5" style={{ color: colors.status.error }} />
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.status.warning;
      case "replied":
        return colors.status.success;
      case "closed":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          Enquiry Management
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Manage and respond to customer enquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="rounded-xl p-6 border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Pending
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: colors.status.warning }}
              >
                {stats.pending}
              </p>
            </div>
            <Clock
              className="w-12 h-12"
              style={{ color: colors.status.warning }}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-6 border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Replied
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: colors.status.success }}
              >
                {stats.replied}
              </p>
            </div>
            <CheckCircle
              className="w-12 h-12"
              style={{ color: colors.status.success }}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-6 border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Closed
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: colors.status.error }}
              >
                {stats.closed}
              </p>
            </div>
            <XCircle
              className="w-12 h-12"
              style={{ color: colors.status.error }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="inline-flex rounded-lg p-1"
        style={{
          backgroundColor: colors.background.accent,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        {["all", "pending", "replied", "closed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize"
            style={{
              backgroundColor:
                filterStatus === status
                  ? colors.interactive.primary
                  : "transparent",
              color:
                filterStatus === status
                  ? "#ffffff"
                  : colors.text.secondary,
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div
          className="flex items-center justify-center py-20 rounded-xl"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.secondary,
          }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.interactive.primary }}
            ></div>
            <p>Loading enquiries...</p>
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <Mail
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            style={{ color: colors.text.secondary }}
          />
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            No enquiries found
          </h3>
          <p style={{ color: colors.text.secondary }}>
            {filterStatus !== "all"
              ? `No ${filterStatus} enquiries at the moment`
              : "No enquiries have been submitted yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg cursor-pointer"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
              onClick={() => {
                setSelectedEnquiry(enquiry);
                setReplyText(enquiry.adminReply || "");
              }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                {(enquiry.productImage || enquiry.product?.image) && (
                  <div
                    className="w-24 h-24 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: colors.background.accent }}
                  >
                    <img
                      src={enquiry.productImage || enquiry.product?.image}
                      alt={enquiry.productName || enquiry.product?.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className="text-xl font-semibold mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {enquiry.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span style={{ color: colors.text.secondary }}>
                          From: {enquiry.user?.fullName || "Unknown User"}
                        </span>
                        <span style={{ color: colors.text.secondary }}>
                          {enquiry.user?.email}
                        </span>
                      </div>
                      {(enquiry.productName || enquiry.product?.name) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package
                            className="w-4 h-4"
                            style={{ color: colors.text.secondary }}
                          />
                          <span style={{ color: colors.text.secondary }}>
                            {enquiry.productName || enquiry.product?.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enquiry.status)}
                      <span
                        className="text-sm font-medium capitalize"
                        style={{ color: getStatusColor(enquiry.status) }}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                  </div>

                  <p
                    className="mb-4 line-clamp-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {enquiry.message}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <span style={{ color: colors.text.secondary }}>
                      {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {enquiry.adminReply && (
                      <span
                        className="font-medium"
                        style={{ color: colors.status.success }}
                      >
                        ✓ Reply sent
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.background.secondary }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 p-6 border-b"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Enquiry Details
                </h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleStatusChange(selectedEnquiry._id, e.target.value)
                    }
                    className="px-4 py-2 rounded-lg border outline-none transition-colors"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedEnquiry._id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.status.error,
                      color: "#ffffff",
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: colors.background.accent,
                      color: colors.text.primary,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.background.accent,
                  borderColor: colors.border.primary,
                }}
              >
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: colors.text.secondary }}
                >
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: colors.text.secondary }}
                    >
                      Name
                    </p>
                    <p style={{ color: colors.text.primary }}>
                      {selectedEnquiry.user?.fullName || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: colors.text.secondary }}
                    >
                      Email
                    </p>
                    <p style={{ color: colors.text.primary }}>
                      {selectedEnquiry.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              {(selectedEnquiry.productImage ||
                selectedEnquiry.product?.image) && (
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.background.accent,
                    borderColor: colors.border.primary,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedEnquiry.productImage ||
                        selectedEnquiry.product?.image
                      }
                      alt={
                        selectedEnquiry.productName ||
                        selectedEnquiry.product?.name
                      }
                      className="w-20 h-20 object-contain rounded-lg"
                      style={{ backgroundColor: colors.background.secondary }}
                    />
                    <div>
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: colors.text.primary }}
                      >
                        {selectedEnquiry.productName ||
                          selectedEnquiry.product?.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Product Enquiry
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.secondary }}
                >
                  Subject
                </h3>
                <p
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {selectedEnquiry.subject}
                </p>
              </div>

              {/* Customer Message */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.secondary }}
                >
                  Customer Message
                </h3>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.background.accent }}
                >
                  <p style={{ color: colors.text.primary }}>
                    {selectedEnquiry.message}
                  </p>
                </div>
                <p
                  className="text-sm mt-2"
                  style={{ color: colors.text.secondary }}
                >
                  Sent on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Reply Section */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.secondary }}
                >
                  Your Reply
                </h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border outline-none resize-none transition-colors"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  placeholder="Type your reply here..."
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleReply}
                    disabled={isReplying || !replyText.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colors.interactive.primary,
                      color: "#ffffff",
                    }}
                  >
                    {isReplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Previous Reply */}
              {selectedEnquiry.adminReply && selectedEnquiry.adminReply !== replyText && (
                <div>
                  <h3
                    className="text-sm font-medium mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Previous Reply
                  </h3>
                  <div
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: colors.background.accent,
                      borderColor: colors.status.success,
                    }}
                  >
                    <p style={{ color: colors.text.primary }}>
                      {selectedEnquiry.adminReply}
                    </p>
                  </div>
                  {selectedEnquiry.repliedAt && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Replied on{" "}
                      {new Date(selectedEnquiry.repliedAt).toLocaleString()}
                      {selectedEnquiry.repliedBy?.fullName &&
                        ` by ${selectedEnquiry.repliedBy.fullName}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
