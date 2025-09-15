import React from "react";

interface GoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ text, ...props }) => (
  <button
    {...props}
    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200"
  >
    <img
      src="https://www.svgrepo.com/show/355037/google.svg"
      alt="Google"
      className="w-5 h-5"
    />
    {text}
  </button>
);

export default GoogleButton;
