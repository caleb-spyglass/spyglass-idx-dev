import React from 'react';

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>{children}</select>;
}

export function SelectTrigger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ${className}`}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md">{children}</div>;
}

export function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
  return <option value={value} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm">{children}</option>;
}
