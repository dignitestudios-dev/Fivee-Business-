import React, { useState } from "react";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import api from "@/lib/services";

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
      showError(msg, "Form Initialization Error");
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.startForm433a({ title });
      // res is expected to be the standardized response { status, statusCode, data }
      const caseId = res?.data?.caseId;
      showSuccess("Form initialized successfully", "Success");
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
