import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";
import { useAppDispatch } from "@/lib/hooks";
import { set433bCases } from "@/lib/features/formsSlice";

const useUser433bCases = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.getUserForm433BCases();
      const cases: FormCase[] = Array.isArray(res?.data)
        ? res.data
        : res?.data?.cases || [];

      dispatch(set433bCases(cases));
      return cases;
    } catch (err: any) {
      const msg = err?.message || "Failed to load cases";
      setError(msg);
      console.log(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return { loading, error, refetch: fetchCases } as const;
};

export default useUser433bCases;
