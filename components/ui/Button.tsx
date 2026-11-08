"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "disabled";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: "_blank" | "_self";
}

const variants = {
  primary:
    "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] active:translate-y-px transition-[background-color,box-shadow,transform] duration-200",
  secondary:
    "border border-white/15 text-white/70 hover:border-signal/60 hover:bg-signal/[0.06] hover:text-white active:translate-y-px transition-[border-color,background-color,color,transform] duration-200",
  ghost:
    "text-white/50 hover:text-white transition-colors duration-200",
  disabled:
    "border border-white/8 text-white/20 cursor-not-allowed opacity-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-sm",
  md: "px-6 py-3 text-sm rounded-sm",
  lg: "px-8 py-4 text-base rounded-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled,
  type = "button",
  target,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold tracking-wide ${variants[disabled ? "disabled" : variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
