import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";

const useClone433a = () => {
  const [loading, setLoading] = useState(false);

  const clone = useCallback(async (caseId: string, title: string) => {
    setLoading(true);
    try {
      const res = await api.duplicateForm433a(caseId, title);
      const newCaseId = res?.data?.caseId;
      toast.success("Form cloned");
      return newCaseId;
    } catch (err: any) {
      const msg = err?.message || "Failed to clone form";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, clone } as const;
};

export default useClone433a;
