import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveBusinessIncomeInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useBusinessIncomeInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessIncomeInfo = async (
    info: any,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      const data = { ...info };

      delete data.BoxB;

      await api.saveBusinessIncomeInfoFormB(data, caseId);
      dispatch(saveBusinessIncomeInfo(info));
    } catch (error: any) {
      toast.error(error?.message || "Failed to save business income info");
      throw new Error(error?.message || "Failed to save business income info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessIncomeInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveBusinessIncomeInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching business income info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveBusinessIncomeInfo,
    handleGetBusinessIncomeInfo,
  };
};

export default useBusinessIncomeInfo;
