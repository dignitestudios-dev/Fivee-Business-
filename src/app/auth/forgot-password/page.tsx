import React from "react";
import { GoArrowLeft } from "react-icons/go";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

const ForgotPassword = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      <Link href={"/auth/login"}>
        <GoArrowLeft size={32} className="mb-5" />
      </Link>

      <h2 className="text-4xl font-bold">Forgot Password</h2>
      <p className="text-[var(--desc)]">
        Enter your email for password recovery process{" "}
      </p>

      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
