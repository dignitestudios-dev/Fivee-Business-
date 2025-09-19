import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

const FInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "block px-3 py-2 w-full h-[48px] border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:";
    const errorClasses = error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="block  font-semibold text-black">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseClasses} ${errorClasses} ${
              leftIcon ? "pl-10" : ""
            } ${
              rightIcon ? "pr-10" : ""
            } ${className} bg-white border-gray-300`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className=" text-red-600">{error}</p>}
        {helperText && !error && (
          <p className=" text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FInput.displayName = "FInput";

export default FInput;
