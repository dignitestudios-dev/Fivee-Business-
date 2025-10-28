"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";

import FInput from "@/components/ui/FInput";
import { SECURITY_CONFIG } from "@/lib/constants";
import FButton from "../ui/FButton";
import useAuth from "@/hooks/auth/useAuth";

const SignupForm = () => {
  const { handleSignup, handleGoogleSignIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      employmentType: undefined,
    },
  });

  const watchNewPassword = watch("password");
  const watchEmploymentType = watch("employmentType");

  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < SECURITY_CONFIG.passwordMinLength) {
      errors.push(`At least ${SECURITY_CONFIG.passwordMinLength} characters`);
    }

    if (SECURITY_CONFIG.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }

    if (SECURITY_CONFIG.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }

    if (SECURITY_CONFIG.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push("One number");
    }

    if (
      SECURITY_CONFIG.passwordRequireSpecialChars &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push("One special character");
    }

    return errors.length === 0
      ? true
      : `Password must contain: ${errors.join(", ")}`;
  };

  const onSubmit = async (data: SignupFormValues) => {
    await handleSignup({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      employmentType: data.employmentType,
      socialLogin: false,
      provider: null,
      role: "user",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 items-center mt-5 w-full"
    >
      <FInput
        label="Email"
        placeholder="email@example.com"
        autoComplete="email"
        id="email"
        type="email"
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
        error={errors.email?.message}
      />

      <div className="w-full grid grid-cols-2 gap-5">
        <FInput
          label="First Name"
          placeholder="Siweh"
          type="text"
          id="firstName"
          {...register("firstName", { required: "First name is required" })}
          error={errors.firstName?.message}
        />
        <FInput
          label="Last Name"
          placeholder="Harris"
          type="text"
          id="lastName"
          {...register("lastName", { required: "Last name is required" })}
          error={errors.lastName?.message}
        />
      </div>

      {/* Employment Type Selection */}
      <div className="w-full">
        <h3 className="font-semibold mb-2">What would best describe you?</h3>
        <div className="space-y-3">
          <label className={`block h-[48px] w-full rounded-xl cursor-pointer border-2 relative ${
            watchEmploymentType === "self-employed" ? "border-[var(--primary)]" : "border-[#E3E3E3]"
          }`}>
            <input
              type="radio"
              value="self-employed"
              className="hidden"
              {...register("employmentType", { required: "Please select your employment type" })}
            />
            <div className="flex gap-2 items-center py-2 px-4 h-full">
              <div className={`p-1 w-5 h-5 rounded-full border border-gray-300 ${
                watchEmploymentType === "self-employed" ? "bg-[var(--primary)]" : "bg-white"
              }`}>
                <div className="h-full w-full bg-white rounded-full" />
              </div>
              Self Employed
            </div>
          </label>

          <label className={`block h-[48px] w-full rounded-xl cursor-pointer border-2 relative ${
            watchEmploymentType === "business-owner" ? "border-[var(--primary)]" : "border-[#E3E3E3]"
          }`}>
            <input
              type="radio"
              value="business-owner"
              className="hidden"
              {...register("employmentType", { required: "Please select your employment type" })}
            />
            <div className="flex gap-2 items-center py-2 px-4 h-full">
              <div className={`p-1 w-5 h-5 rounded-full border border-gray-300 ${
                watchEmploymentType === "business-owner" ? "bg-[var(--primary)]" : "bg-white"
              }`}>
                <div className="h-full w-full bg-white rounded-full" />
              </div>
              Business Owner
            </div>
          </label>
        </div>
        {errors.employmentType && (
          <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>
        )}
      </div>

      {/* New Password */}
      <FInput
        label="Password"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
        autoComplete="off"
        id="password"
        {...register("password", {
          required: "Password is required",
          validate: validatePassword,
        })}
        error={errors.password?.message}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        }
      />

      {/* Password Requirements */}
      {watchNewPassword && (
        <div className="rounded-lg w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`flex items-center  ${
                watchNewPassword.length >= SECURITY_CONFIG.passwordMinLength
                  ? "text-[var(--primary)]"
                  : "text-gray-400"
              }`}
            >
              <GoCheckCircleFill className="w-5 h-5 mr-2" />
              At least {SECURITY_CONFIG.passwordMinLength} characters
            </div>

            {SECURITY_CONFIG.passwordRequireUppercase && (
              <div
                className={`flex items-center  ${
                  /[A-Z]/.test(watchNewPassword)
                    ? "text-[var(--primary)]"
                    : "text-gray-400"
                }`}
              >
                <GoCheckCircleFill className="w-5 h-5 mr-2" />
                One uppercase letter
              </div>
            )}

            {SECURITY_CONFIG.passwordRequireLowercase && (
              <div
                className={`flex items-center  ${
                  /[a-z]/.test(watchNewPassword)
                    ? "text-[var(--primary)]"
                    : "text-gray-400"
                }`}
              >
                <GoCheckCircleFill className="w-5 h-5 mr-2" />
                One lowercase letter
              </div>
            )}

            {SECURITY_CONFIG.passwordRequireNumbers && (
              <div
                className={`flex items-center  ${
                  /\d/.test(watchNewPassword)
                    ? "text-[var(--primary)]"
                    : "text-gray-400"
                }`}
              >
                <GoCheckCircleFill className="w-5 h-5 mr-2" />
                One number
              </div>
            )}

            {SECURITY_CONFIG.passwordRequireSpecialChars && (
              <div
                className={`flex items-center  ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(watchNewPassword)
                    ? "text-[var(--primary)]"
                    : "text-gray-400"
                }`}
              >
                <GoCheckCircleFill className="w-5 h-5 mr-2" />
                One special character
              </div>
            )}
          </div>
        </div>
      )}

      <FButton 
        variant="primary" 
        size="lg" 
        className="w-full" 
        type="submit"
        disabled={loading || isSubmitting || !watchEmploymentType}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </FButton>
    </form>
  );
};

export default SignupForm;
