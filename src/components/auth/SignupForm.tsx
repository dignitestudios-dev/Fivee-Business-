"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";

import FInput from "@/components/ui/FInput";
import { DUMMY_USER, SECURITY_CONFIG } from "@/lib/constants";
import FButton from "../ui/FButton";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

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

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);

    dispatch(
      loginUser({
        user: DUMMY_USER,
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDEzOWI1YzBmMDViZGI2NmFhNjJlOCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwOTQwOTY4LCJleHAiOjE3NjEwMjczNjh9.jbP5NMkaprF3NLtM3rEE_w3mwo6vbN6NMxXqiiQ2wtA",
      })
    );

    router.push("/dashboard/onboard");
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
        {...register("email", { required: "Email is required" })}
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
        />{" "}
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

      <FButton variant="primary" size="lg" className="w-full">
        Sign Up
      </FButton>
    </form>
  );
};

export default SignupForm;
