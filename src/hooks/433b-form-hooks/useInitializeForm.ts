import React, { useState } from "react";
import api from "@/lib/services";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";

type InitResult = {
  caseId?: string;
  message?: string;
};

const useInitializeForm = () => {
  const { showError, showSuccess } = useGlobalPopup();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const start = async (title: string): Promise<InitResult> => {
    if (!title || !title.trim()) {
      const msg = "Form title is required";
      setError(msg);
      showError(msg, "Form Title Required");
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.startForm433b({ title });
      const caseId = res?.data?.caseId;
      showSuccess("Form initialized successfully");
      return { caseId, message: res?.message };
    } catch (err: any) {
      const msg = err?.message || "Unable to start form";
      setError(msg);
      showError(msg, "Form Initialization Error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { start, loading, error };
};

export default useInitializeForm;
