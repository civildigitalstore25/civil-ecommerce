import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  onClick,
  style
}) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-blue-600 text-white hover:bg-blue-700"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};