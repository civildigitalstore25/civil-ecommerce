import React from "react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  required,
  ...props
}) => (
  <div>
    <label className="block font-medium mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      required={required}
      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
    />
  </div>
);

export default FormTextarea;
