import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  icon?: LucideIcon;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick, title, icon: Icon, gradient = false }) => {
  const baseClasses = "rounded-2xl p-5 relative overflow-hidden transition-all duration-300";
  const bgClasses = gradient 
    ? "bg-gradient-to-br from-surfaceHighlight to-surface border border-white/10" 
    : "bg-surfaceHighlight/50 backdrop-blur-md border border-white/5";
  
  const hoverClasses = onClick ? "cursor-pointer hover:bg-surfaceHighlight/70 active:scale-[0.98]" : "";

  return (
    <div className={`${baseClasses} ${bgClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon size={20} className="text-primary" />}
          <h3 className="font-semibold text-gray-100">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = "", isLoading, ...props }) => {
  let variantClasses = "";
  
  switch (variant) {
    case 'primary':
      variantClasses = "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40";
      break;
    case 'secondary':
      variantClasses = "bg-surfaceHighlight border border-white/10 text-cyan-400 hover:bg-white/10";
      break;
    case 'danger':
      variantClasses = "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30";
      break;
    case 'ghost':
      variantClasses = "bg-transparent text-gray-400 hover:text-white";
      break;
  }

  return (
    <button 
      className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : children}
    </button>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colors = "bg-gray-500/20 text-gray-400";
  
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'active':
      colors = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      break;
    case 'pending':
    case 'processing':
      colors = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      break;
    case 'failed':
      colors = "bg-red-500/20 text-red-400 border border-red-500/30";
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
};

export const SectionHeader: React.FC<{ title: string; action?: ReactNode }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4 mt-6 px-1">
    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
    {action}
  </div>
);