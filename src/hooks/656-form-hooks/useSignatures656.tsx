import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveSignatures } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useSignatures656 = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveSignatures = async (
    info: SignaturesFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveSignatures(info, caseId);
      dispatch(saveSignatures(info));
    } catch (error: any) {
      console.error("Error saving signatures:", error);
      toast.error(error?.message || "Failed to save signatures");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSignatures656 = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveSignatures(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching signatures:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveSignatures,
    handleGetSignatures656,
  };
};

export default useSignatures656;
