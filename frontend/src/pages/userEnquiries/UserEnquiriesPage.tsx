import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { UserEnquiryCard } from "./UserEnquiryCard";
import { UserEnquiriesLoadingState } from "./UserEnquiriesLoadingState";
import { UserEnquiriesEmptyState } from "./UserEnquiriesEmptyState";
import { useUserEnquiriesPage } from "./useUserEnquiriesPage";

const UserEnquiriesPage: React.FC = () => {
  const { colors } = useAdminTheme();
  const navigate = useNavigate();
  const { enquiries, loading, expandedEnquiries, toggleReply } =
    useUserEnquiriesPage();

  return (
    <div
      className="min-h-screen py-4 md:py-8 px-2 md:px-4 transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold mb-2 mt-20"
            style={{ color: colors.text.primary }}
          >
            My Enquiries
          </h1>
          <p
            className="text-sm md:text-base"
            style={{ color: colors.text.secondary }}
          >
            View and track your product enquiries
          </p>
        </div>

        {loading ? (
          <UserEnquiriesLoadingState colors={colors} />
        ) : enquiries.length === 0 ? (
          <UserEnquiriesEmptyState colors={colors} navigate={navigate} />
        ) : (
          <div className="grid gap-6">
            {enquiries.map((enquiry) => (
              <UserEnquiryCard
                key={enquiry._id}
                enquiry={enquiry}
                colors={colors}
                replyExpanded={expandedEnquiries.has(enquiry._id)}
                onToggleReply={() => toggleReply(enquiry._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnquiriesPage;
