"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";

interface UseSkipW7SectionProps {
  caseId: string | null;
  onSkipSuccess: () => void;
}

/**
 * acceptanceAgentInfo is the only W-7 section the API allows skipping, and it
 * uses a dedicated POST /formw7/:caseId/skip/:section route rather than the
 * ?skipped= query param the other forms use.
 */
const useSkipW7Section = ({ caseId, onSkipSuccess }: UseSkipW7SectionProps) => {
  const [skipping, setSkipping] = useState(false);

  const skipSection = async () => {
    if (!caseId) return;

    setSkipping(true);
    try {
      await api.skipW7Section(caseId, "acceptanceAgentInfo");
      toast.success("Acceptance agent section skipped");
      onSkipSuccess();
    } catch (error: any) {
      console.error("Error skipping the acceptance agent section:", error);
      toast.error(error?.message || "Failed to skip the section");
    } finally {
      setSkipping(false);
    }
  };

  return { skipping, skipSection };
};

export default useSkipW7Section;
