import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import { AddUserModalFormFields } from "./addUserModal/AddUserModalFormFields";
import { useAddUserModalForm } from "./addUserModal/useAddUserModalForm";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { colors } = useAdminTheme();
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleClose,
    createUserMutation,
  } = useAddUserModalForm(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.background.primary }}
      >
        <AddUserModalFormFields
          colors={colors}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          createUserMutation={createUserMutation}
        />
      </div>
    </div>
  );
};

export default AddUserModal;
