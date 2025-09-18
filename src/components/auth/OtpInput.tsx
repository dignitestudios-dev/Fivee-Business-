import { useState, useRef } from "react";

const OtpInput: React.FC<{
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  length?: number;
  onComplete?: (otp: string) => void;
  disabled: boolean;
}> = ({ otp, setOtp, label, length = 6, onComplete, disabled }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(length).fill(null)
  );

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input if available
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // If OTP is complete, trigger onComplete
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").replace(/\D/g, ""); // Extract digits only
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < length && i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Move focus to the last entered digit
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    // If OTP is complete, trigger onComplete
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <p className="sm:text-lg font-medium">{label}</p>
      <div className="w-full flex justify-between space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            autoFocus={index === 0}
            type="text" // Use "text" instead of "number" to avoid browser auto-clear issues
            inputMode="numeric" // Ensures numeric keyboard on mobile
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined} // Only handle paste on the first input
            disabled={disabled}
            className="w-full sm:h-16 h-12 text-center text-xl border-2 border-gray-300 rounded-xl outline-none focus:border-[var(--primary)]"
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;
