import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline" | "muted";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-pale-mint text-primary border-primary/25",
    secondary: "bg-secondary text-secondary-foreground border-border",
    success: "bg-[#E5F6EF] text-success border-success/25",
    warning: "bg-[#FEF7EC] text-warning border-warning/25",
    danger: "bg-[#FDF2F2] text-danger border-danger/25",
    outline: "border-border text-foreground bg-card",
    muted: "bg-background text-muted-foreground border-border",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
