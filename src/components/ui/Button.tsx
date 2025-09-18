import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "outline";

type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right"; // NEW
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left", // default left
      disabled = false,
      loading = false,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center cursor-pointer font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-[var(--primary)]/90 hover:bg-[var(--primary)] text-white focus:ring-[var(--primary)]",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
      ghost:
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      warning:
        "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
      outline:
        "border-2 border-[var(--primary)] text-black bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 focus:ring-[var(--primary)]",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 ",
      md: "px-4 py-2 ",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && <div className="w-4 h-4 mr-2 spinner" />}

        {/* Icon Left */}
        {icon && !loading && iconPosition === "left" && (
          <span className={children ? "mr-2" : ""}>{icon}</span>
        )}

        {children}

        {/* Icon Right */}
        {icon && !loading && iconPosition === "right" && (
          <span className={children ? "ml-2" : ""}>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
