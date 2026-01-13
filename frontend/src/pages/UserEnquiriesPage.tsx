import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getUserEnquiries, type Enquiry } from "../api/enquiryApi";
import { Mail, Clock, Package, ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";

const UserEnquiriesPage: React.FC = () => {
  const { colors } = useAdminTheme();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEnquiries, setExpandedEnquiries] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const response = await getUserEnquiries({ limit: 100 });
      setEnquiries(response.enquiries);
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

  const toggleReply = (enquiryId: string) => {
    setExpandedEnquiries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(enquiryId)) {
        newSet.delete(enquiryId);
      } else {
        newSet.add(enquiryId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" style={{ color: colors.status.warning }} />;
      case "replied":
        return null;
      case "closed":
        return null;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "replied":
        return "Replied";
      case "closed":
        return "Closed";
      default:
        return status;
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
    <div
      className="min-h-screen py-4 md:py-8 px-2 md:px-4 transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold mb-2 mt-20"
            style={{ color: colors.text.primary }}
          >
            My Enquiries
          </h1>
          <p className="text-sm md:text-base" style={{ color: colors.text.secondary }}>
            View and track your product enquiries
          </p>
        </div>

        {loading ? (
          <div
            className="flex items-center justify-center py-20"
            style={{ color: colors.text.secondary }}
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
            className="rounded-2xl p-12 text-center"
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
              No enquiries yet
            </h3>
            <p style={{ color: colors.text.secondary }} className="mb-6">
              You haven't submitted any enquiries yet
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.interactive.primary,
                color: "#ffffff",
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                className="rounded-2xl p-4 md:p-6 border transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="flex flex-col gap-4">
                  {/* Header: Status and Reply Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="hidden sm:inline-block"
                      >
                        {getStatusIcon(enquiry.status)}
                      </span>
                      <span
                        className="text-xs md:text-sm font-medium px-2 py-1 rounded-full"
                        style={{
                          color: getStatusColor(enquiry.status),
                          backgroundColor: colors.background.primary,
                          border: `1px solid ${getStatusColor(enquiry.status)}`
                        }}
                      >
                        {getStatusText(enquiry.status)}
                      </span>
                    </div>
                    {enquiry.adminReply && (
                      <button
                        onClick={() => toggleReply(enquiry._id)}
                        className="flex items-center gap-1 text-xs md:text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: colors.status.success }}
                      >
                        {expandedEnquiries.has(enquiry._id) ? (
                          <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                        <span className="hidden sm:inline">Softzcart </span>Reply
                      </button>
                    )}
                  </div>

                  {/* Image and Title Row */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Product Image - Hidden on small screens */}
                    {(enquiry.productImage || enquiry.product?.image) && (
                      <div
                        className="hidden sm:block w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: colors.background.accent }}
                      >
                        <img
                          src={enquiry.productImage || enquiry.product?.image}
                          alt={enquiry.productName || enquiry.product?.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base md:text-lg lg:text-xl font-semibold mb-1 truncate"
                        style={{ color: colors.text.primary }}
                      >
                        {enquiry.subject}
                      </h3>
                      {(enquiry.productName || enquiry.product?.name) && (
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                          <Package
                            className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0"
                            style={{ color: colors.text.secondary }}
                          />
                          <span className="truncate" style={{ color: colors.text.secondary }}>
                            {enquiry.productName || enquiry.product?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: colors.text.secondary }}
                  >
                    {enquiry.message.length > 150 ? `${enquiry.message.substring(0, 150)}...` : enquiry.message}
                  </p>

                  {/* Date */}
                  <div className="text-xs md:text-sm">
                    <span style={{ color: colors.text.secondary }}>
                      {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Expanded Reply */}
                  {enquiry.adminReply && expandedEnquiries.has(enquiry._id) && (
                    <div
                      className="mt-2 p-3 md:p-4 rounded-lg border-l-4"
                      style={{
                        backgroundColor: colors.background.accent,
                        borderColor: colors.status.success,
                      }}
                    >
                      <p className="text-sm md:text-base" style={{ color: colors.text.primary }}>
                        {enquiry.adminReply}
                      </p>
                      {enquiry.repliedAt && (
                        <p
                          className="text-xs md:text-sm mt-2"
                          style={{ color: colors.text.secondary }}
                        >
                          Replied on{" "}
                          {new Date(enquiry.repliedAt).toLocaleString()}
                          {enquiry.repliedBy?.fullName &&
                            ` by ${enquiry.repliedBy.fullName}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnquiriesPage;
