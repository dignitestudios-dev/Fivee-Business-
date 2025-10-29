"use client";

import type React from "react";

import { Label } from "./label";
import { Input } from "./Input";
import { Textarea } from "./textarea";
import { cn } from "../../utils/helper";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  id,
  error,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn("text-sm font-medium", error && "text-red-600")}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error as string}
        </p>
      )}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  required = false,
  className,
  ...props
}: FormInputProps) {
  return (
    <FormField
      label={label}
      id={props.id || ""}
      error={error}
      required={required}
    >
      <Input
        {...props}
        className={cn(
          "border-gray-300 focus:ring-[#22b573] focus:border-[#22b573]",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
      />
    </FormField>
  );
}

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  required = false,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <FormField
      label={label}
      id={props.id || ""}
      error={error}
      required={required}
    >
      <Textarea
        {...props}
        className={cn(
          "focus:ring-[#22b573] focus:border-[#22b573]",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
      />
    </FormField>
  );
}
