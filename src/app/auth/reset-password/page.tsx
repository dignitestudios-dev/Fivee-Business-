import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { constants } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowLeft } from "react-icons/go";

const ResetPassword = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      <h2 className="text-4xl font-bold">Reset Password</h2>
      <p className="text-[var(--desc)]">
        Please enter your new password to reset.
      </p>

      <ResetPasswordForm />

      <div className="flex justify-center text-black  mt-3">
        <Link
          href={"/auth/login"}
          className="flex gap-1 items-center text-black hover:underline"
        >
          <GoArrowLeft size={22} />
          Back to Login
        </Link>{" "}
      </div>
    </div>
  );
};

export default ResetPassword;
