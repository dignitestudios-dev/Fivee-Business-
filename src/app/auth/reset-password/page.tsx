"use client";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import FButton from "@/components/ui/FButton";
import { constants } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import { GoArrowLeft } from "react-icons/go";

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  return (
    <div className="flex flex-col justify-center gap-3">
      {(() => {
        const title = isSuccess ? "" : "Reset Password";
        const description = isSuccess
          ? ""
          : "Please enter your new password to reset.";
        return (
          <>
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-[var(--desc)]">{description}</p>
          </>
        );
      })()}

      <ResetPasswordForm onSuccess={() => setIsSuccess(true)} />

      {!isSuccess && (
        <div className="flex justify-center text-black  mt-3">
          <Link
            href={"/auth/login"}
            className="flex gap-1 items-center text-black hover:underline"
          >
            <GoArrowLeft size={22} />
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
