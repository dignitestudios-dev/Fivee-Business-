import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveSourceOfFunds } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useSourceOfFunds = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveSourceOfFunds = async (
    info: SourceOfFundsFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveSourceOfFunds(info, caseId);
      dispatch(saveSourceOfFunds(info));
    } catch (error: any) {
      console.error("Error saving source of funds:", error);
      toast.error(error?.message || "Failed to save source of funds");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSourceOfFunds = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveSourceOfFunds(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching source of funds:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveSourceOfFunds,
    handleGetSourceOfFunds,
  };
};

export default useSourceOfFunds;