import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

interface UseSkipSectionProps {
  caseId: string | null;
  currentStep: number;
  onSkipSuccess: (step: number) => void;
  formType: "433a" | "433b" | "656";
}

const useSkipSection = ({ caseId, currentStep, onSkipSuccess, formType }: UseSkipSectionProps) => {
  const [skipping, setSkipping] = useState(false);

  const skipSection = async () => {
    if (!caseId) return;

    setSkipping(true);
    try {
      // The API expects a POST request with skipped=skipped query param and empty data
      await api.skipSection(caseId, currentStep, formType);
      toast.success("Section skipped successfully");
      onSkipSuccess(currentStep);
    } catch (error: any) {
      console.error("Error skipping section:", error);
      toast.error(error?.message || "Failed to skip section");
    } finally {
      setSkipping(false);
    }
  };

  return {
    skipping,
    skipSection,
  };
};

export default useSkipSection;