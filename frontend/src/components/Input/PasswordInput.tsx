import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAdminTheme } from '../../contexts/AdminThemeContext';

interface PasswordInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder = "Enter password",
    required = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { colors } = useAdminTheme();

    return (
        <div>
            <label
                className="block font-medium mb-1 transition-colors duration-200"
                style={{ color: colors.text.primary }}
            >
                {label}
                {required && <span style={{ color: colors.status.error }}>*</span>}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full pl-3 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
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
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                    }}
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    input::placeholder {
                        color: ${colors.text.secondary};
                        opacity: 0.7;
                    }
                `
            }} />
        </div>
    );
};

export default PasswordInput;
