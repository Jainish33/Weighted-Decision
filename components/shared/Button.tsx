"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed",
  secondary:
    "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${styles[variant]} ${className}`}
    />
  );
}
