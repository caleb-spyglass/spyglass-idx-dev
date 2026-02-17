import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

const variants: Record<string, string> = {
  default: 'bg-blue-600 text-white',
  secondary: 'bg-gray-100 text-gray-800',
  outline: 'border border-gray-200 text-gray-800 bg-transparent',
  destructive: 'bg-red-600 text-white',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
