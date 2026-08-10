// src/app/_components/ui/button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  ariaLabel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ariaLabel, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
      default: "bg-primary-500 text-ink hover:bg-primary-600",
      destructive: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30",
      outline: "border border-dark-border bg-transparent text-ink-muted hover:border-primary-500 hover:text-primary-400",
      secondary: "bg-dark-surface text-ink border border-dark-border hover:bg-dark-hover",
      ghost: "text-ink-muted hover:bg-dark-surface hover:text-ink",
      link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-400",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

    if (asChild) {
      return (
        <span className={combinedClassName} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
          {children}
        </span>
      );
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
