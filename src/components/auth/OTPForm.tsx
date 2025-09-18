"use client";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OtpInput from "./OtpInput";

const OTPForm = () => {
  const router = useRouter();
  const length = 4;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If OTP is complete, trigger onComplete
    if (otp.every((digit) => digit !== "")) {
      handleVerifyOtp(otp.join(""));
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    console.log(otp);

    router.push("/auth/reset-password");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 items-center mt-5 w-full"
    >
      <OtpInput
        otp={otp}
        setOtp={setOtp}
        onComplete={handleVerifyOtp}
        disabled={false}
        length={length}
        label=""
      />

      <Button variant="primary" size="lg" className="w-full">
        Confirm
      </Button>
    </form>
  );
};

export default OTPForm;
