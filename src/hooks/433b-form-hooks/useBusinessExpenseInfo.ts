import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveBusinessExpenseInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useBusinessExpenseInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessExpenseInfo = async (
    info: any,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      const data = { ...info };

      delete data.BoxC;
      delete data.BoxD;

      await api.saveBusinessExpenseInfoFormB(data, caseId);
      dispatch(saveBusinessExpenseInfo(info));
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessExpenseInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveBusinessExpenseInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching business expense info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveBusinessExpenseInfo,
    handleGetBusinessExpenseInfo,
  };
};

export default useBusinessExpenseInfo;
