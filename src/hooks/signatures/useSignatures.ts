import { setSignatures } from "@/lib/features/signaturesSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useSignatures = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const fetchSignatures = async () => {
    setLoading(true);
    try {
      const response = await api.getSignatures();
      dispatch(setSignatures(response.data?.images || []));
    } catch (error) {
      console.error("Error fetching signatures:", error);
      toast.error("Failed to fetch signatures");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchSignatures,
  };
};

export default useSignatures;
