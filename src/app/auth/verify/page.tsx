import React from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import OTPForm from "@/components/auth/OTPForm";

const Verify = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      <Link href={"/auth/forgot-password"}>
        <GoArrowLeft size={32} className="mb-5" />
      </Link>

      <h2 className="text-4xl font-bold">Check Your Email</h2>
      <p className="text-[var(--desc)]">
        Check your email and enter the 4 digit code here{" "}
      </p>

      <OTPForm />
    </div>
  );
};

export default Verify;
