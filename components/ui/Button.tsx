// components/ui/Button.tsx
"use client";

import clsx from "clsx";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  href,
  onClick,
  disabled,
  variant = "primary",
}: Props) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition";

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const className = clsx(
    base,
    styles[variant],
    disabled && "opacity-50 cursor-not-allowed"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
