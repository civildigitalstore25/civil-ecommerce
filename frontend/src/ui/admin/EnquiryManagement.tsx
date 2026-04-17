import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useEnquiryManagement } from "./enquiryManagement/useEnquiryManagement";
import { EnquiryManagementStatsCards } from "./enquiryManagement/EnquiryManagementStatsCards";
import { EnquiryManagementFilterTabs } from "./enquiryManagement/EnquiryManagementFilterTabs";
import { EnquiryManagementList } from "./enquiryManagement/EnquiryManagementList";
import { EnquiryManagementDetailModal } from "./enquiryManagement/EnquiryManagementDetailModal";

const EnquiryManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const {
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
  } = useEnquiryManagement();

  return (
    <div className="space-y-6">
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

      <EnquiryManagementStatsCards colors={colors} stats={stats} />

      <EnquiryManagementFilterTabs
        colors={colors}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <EnquiryManagementList
        colors={colors}
        loading={loading}
        enquiries={enquiries}
        filterStatus={filterStatus}
        onSelectEnquiry={selectEnquiry}
      />

      {selectedEnquiry && (
        <EnquiryManagementDetailModal
          colors={colors}
          enquiry={selectedEnquiry}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          isReplying={isReplying}
          onClose={() => setSelectedEnquiry(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSendReply={handleReply}
        />
      )}
    </div>
  );
};

export default EnquiryManagement;
