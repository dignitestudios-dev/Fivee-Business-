"use client";

import { BiLoaderAlt } from "react-icons/bi";
import { HiCheckCircle } from "react-icons/hi";
import { MdError } from "react-icons/md";
import FButton from "../ui/FButton";

interface VerificationStatusProps {
  status: "verifying" | "success" | "error";
  error?: string;
  onRetry?: () => void;
}

const VerificationStatus = ({
  status,
  error,
  onRetry,
}: VerificationStatusProps) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-center">
      {status === "verifying" && (
        <>
          <BiLoaderAlt className="w-16 h-16 text-[var(--primary)] animate-spin" />
          <h2 className="text-2xl font-bold">Verifying Your Email</h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <HiCheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-bold text-green-700">Email Verified Successfully!</h2>
          <div className="space-y-2">
            <p className="text-green-600">
              Your email address has been verified and your account is now active.
            </p>
            <p className="text-gray-600">
              You will be redirected to your dashboard in a few moments...
            </p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <MdError className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold">Verification Failed</h2>
          <p className="text-gray-600 max-w-md">
            {error ||
              "We couldn't verify your email. The link might be expired or invalid."}
          </p>
          {onRetry && (
            <FButton
              variant="primary"
              size="lg"
              onClick={onRetry}
              className="mt-4"
            >
              Try Again
            </FButton>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Please try opening the verification link from your email again.
          </p>
        </>
      )}
    </div>
  );
};

export default VerificationStatus;