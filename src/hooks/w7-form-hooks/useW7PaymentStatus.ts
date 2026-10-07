"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/services";

/**
 * PDF generation is not payment-gated on the backend, so the UI checks the
 * payment status itself before offering the generate/download action.
 */
const useW7PaymentStatus = (caseId: string | null, autoFetch = true) => {
  const [paid, setPaid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  const checkStatus = useCallback(async () => {
    if (!caseId) return null;
    setChecking(true);
    try {
      const response = await api.getW7SectionInfo(caseId, "paymentStatus");
      const isPaid = response?.data?.status === "completed";
      setPaid(isPaid);
      return isPaid;
    } catch (error: any) {
      console.error("Error checking W-7 payment status:", error);
      return null;
    } finally {
      setChecking(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (autoFetch) checkStatus();
  }, [autoFetch, checkStatus]);

  /**
   * Stripe confirms asynchronously through a webhook, so the status is polled
   * for a short window after a successful card confirmation.
   */
  const pollUntilPaid = useCallback(
    async (attempts = 6, delayMs = 2000) => {
      for (let attempt = 0; attempt < attempts; attempt++) {
        const isPaid = await checkStatus();
        if (isPaid) return true;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      return false;
    },
    [checkStatus]
  );

  return { paid, checking, checkStatus, pollUntilPaid };
};

export default useW7PaymentStatus;
