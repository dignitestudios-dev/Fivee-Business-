"use client";
import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { SECURITY_CONFIG } from "@/lib/constants";
import { BiCheckCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";

const ResetPasswordForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>();

  const watchNewPassword = watch("password");

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

  const onSubmit = async (data: ResetPasswordFormValues) => {
    console.log(data);
    router.push("/auth/login");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="p-8 border rounded-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <BiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Password reset successful
              </h2>
              <p className="mt-2  text-gray-600 dark:text-gray-400">
                Your password has been updated successfully.
              </p>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full"
              >
                Continue to login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        autoFocus
        {...register("password", {
          required: "Password is required",
          validate: validatePassword,
          onChange: (e) => {
            e.target.value = e.target.value.replace(/\s+/g, ""); // 🚫 remove spaces live
          },
        })}
        error={errors.password?.message}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        }
      />

      <Input
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        autoComplete="new-password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === watchNewPassword || "Passwords do not match",
          onChange: (e) => {
            e.target.value = e.target.value.replace(/\s+/g, ""); // 🚫 remove spaces live
          },
        })}
        error={errors.confirmPassword?.message}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
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

      <Button type="submit" className="w-full" loading={false} disabled={false}>
        {false ? "Reseting..." : "Reset"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
