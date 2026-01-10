import React from 'react';

export default function Card({
  title,
  value,
  children,
  className = '',
}: {
  title?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white border border-gray-200 shadow-sm p-5 ${className}`}
    >
      {title && (
        <div className="text-sm text-gray-500 mb-1">{title}</div>
      )}

      {value !== undefined && (
        <div className="text-2xl font-semibold text-gray-900">
          {value}
        </div>
      )}

      {children}
    </div>
  );
}
