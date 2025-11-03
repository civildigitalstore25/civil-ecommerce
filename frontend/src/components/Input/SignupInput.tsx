import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  showPassword?: boolean;
  toggleShow?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, required, ...props }) => (
  <div>
    {label && (
      <label className="block font-medium mb-1 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      {...props}
      required={required}
      className={`w-full border-2 border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-blue-500/50  focus:border-2 focus:border-blue-500 placeholder-gray-400 transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none text-base font-medium shadow-sm hover:shadow-md focus:shadow-lg ${props.className || ""}`}
    />
  </div>
);

export default FormInput;
