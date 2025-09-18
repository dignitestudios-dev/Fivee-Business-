"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

import Input from "@/components/ui/Input";
import { DUMMY_USER, SECURITY_CONFIG } from "@/lib/constants";
import Link from "next/link";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/features/userSlice";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>();

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

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    dispatch(
      loginUser({ user: { ...DUMMY_USER, employmentType: "self-employed" } })
    );

    router.push("/dashboard");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 items-center mt-5 w-full"
    >
      <Input
        label="Email"
        placeholder="email@example.com"
        autoComplete="email"
        id="email"
        type="email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />

      {/* New Password */}
      <Input
        label="Password"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
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

      <Link
        href={"/auth/forgot-password"}
        className="self-end text-[var(--primary)] text-xs hover:underline"
      >
        Forgot Password?
      </Link>

      <Button variant="primary" size="lg" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
