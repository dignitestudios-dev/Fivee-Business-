"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apiHandler, BASE_URL } from "@/lib/services";
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
      // Set the token in API headers
      const tempAPI = axios.create({
        baseURL: BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await apiHandler(() =>
        tempAPI.post("/user/verify-email")
      );

      // if (response?.data?.token && response?.data?.user) {
      // Store the new token and user data
      dispatch(
        loginUser({
          user: response.data.user,
          accessToken: response.data.token,
        })
      );

      setStatus("success");
      // Give users time to see the success message before redirecting
      router.push("/dashboard");
      // }
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
