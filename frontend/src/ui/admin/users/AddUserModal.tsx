import React, { useState } from "react";
import { X, User, Mail, Phone, Lock, Shield } from "lucide-react";
import { useCreateUser } from "../../../api/userApi";
import FormInput from "../../../components/Input/FormInput";
import FormButton from "../../../components/Button/FormButton";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import Swal from "sweetalert2";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserFormData {
    email: string;
    fullName: string;
    phoneNumber: string;
    role: 'user' | 'admin';
    password: string;
    confirmPassword: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const { colors } = useAdminTheme();
    const createUserMutation = useCreateUser();

    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        fullName: '',
        phoneNumber: '',
        role: 'user',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Partial<UserFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await createUserMutation.mutateAsync({
                email: formData.email.trim(),
                fullName: formData.fullName.trim(),
                phoneNumber: formData.phoneNumber.trim() || undefined,
                role: formData.role,
                password: formData.password
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'User created successfully',
                showConfirmButton: false,
                timer: 2000
            });

            // Reset form and close modal
            setFormData({
                email: '',
                fullName: '',
                phoneNumber: '',
                role: 'user',
                password: '',
                confirmPassword: ''
            });
            setErrors({});
            onClose();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to create user'
            });
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            fullName: '',
            phoneNumber: '',
            role: 'user',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: colors.background.primary }}
            >
                {/* Header */}
                <div
                    className="p-6 border-b flex items-center justify-between"
                    style={{ borderBottomColor: colors.border.primary }}
                >
                    <h2
                        className="text-xl font-bold flex items-center gap-2"
                        style={{ color: colors.text.primary }}
                    >
                        <User className="h-5 w-5" />
                        Add New User
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-lg hover:bg-opacity-10 transition-colors"
                        style={{
                            color: colors.text.secondary,
                            backgroundColor: `${colors.interactive.primary}10`
                        }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Email */}
                    <div>
                        <div className="relative">
                            <FormInput
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Enter email address"
                                required
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-9 pointer-events-none">
                                <Mail className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-sm mt-1" style={{ color: colors.status.error }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <div className="relative">
                            <FormInput
                                label="Full Name"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                placeholder="Enter full name"
                                required
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-9 pointer-events-none">
                                <User className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                        {errors.fullName && (
                            <p className="text-sm mt-1" style={{ color: colors.status.error }}>
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <div className="relative">
                            <FormInput
                                label="Phone Number (Optional)"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                placeholder="Enter phone number"
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-9 pointer-events-none">
                                <Phone className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            className="block font-medium mb-1"
                            style={{ color: colors.text.primary }}
                        >
                            Role <span style={{ color: colors.status.error }}>*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value as 'user' | 'admin')}
                                className="w-full border rounded p-2 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none"
                                style={{
                                    backgroundColor: colors.background.primary,
                                    borderColor: colors.border.primary,
                                    color: colors.text.primary,
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = colors.interactive.primary;
                                    e.target.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = colors.border.primary;
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="absolute left-3 top-2 pointer-events-none">
                                <Shield className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <FormInput
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Enter password"
                                required
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-9 pointer-events-none">
                                <Lock className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-sm mt-1" style={{ color: colors.status.error }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative">
                            <FormInput
                                label="Confirm Password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                placeholder="Confirm password"
                                required
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-9 pointer-events-none">
                                <Lock className="h-5 w-5" style={{ color: colors.text.secondary }} />
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm mt-1" style={{ color: colors.status.error }}>
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <FormButton
                            type="button"
                            onClick={handleClose}
                            className="flex-1"
                            style={{
                                backgroundColor: colors.background.tertiary,
                                color: colors.text.secondary,
                                border: `1px solid ${colors.border.primary}`
                            }}
                        >
                            Cancel
                        </FormButton>
                        <FormButton
                            type="submit"
                            disabled={createUserMutation.isPending}
                            className="flex-1"
                            style={{
                                backgroundColor: colors.interactive.primary,
                                color: colors.text.inverse
                            }}
                        >
                            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                        </FormButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;