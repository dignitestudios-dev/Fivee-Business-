"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/services";
import VerificationStatus from "@/components/auth/VerificationStatus";
import Image from "next/image";
import { constants } from "@/lib/constants";
import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/features/userSlice";

export default function VerifyEmail() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string>();

  const verifyEmailToken = async (token: string) => {
    try {
      const response = await api.verifyEmail(token);

      // Auto login after verification
      // dispatch(
      //   loginUser({
      //     user: response.data.user,
      //     accessToken: response.data.token,
      //   })
      // );

      setStatus("success");
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setStatus("error");
      setError(error?.message || "Verification failed. Please try again.");
    }
  };

  useEffect(() => {
    const token = searchParams.get("key");
    if (!token) {
      setStatus("error");
      setError(
        "No verification token found. Please use the link from your email."
      );
      return;
    }

    verifyEmailToken(token);
  }, [searchParams]);

  const handleRetry = () => {
    const token = searchParams.get("key");
    if (token) {
      setStatus("verifying");
      verifyEmailToken(token);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-fit p-2 bg-[var(--primary)] rounded-xl mb-5">
        <Image
          src={constants.APP_CONFIG.logo}
          alt={constants.APP_CONFIG.name}
          height={50}
          width={50}
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <VerificationStatus
          status={status}
          error={error}
          onRetry={status === "error" ? handleRetry : undefined}
        />
      </div>
    </div>
  );
}
