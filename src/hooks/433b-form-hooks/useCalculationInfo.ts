import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveCalculationInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useCalculationInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveCalculationInfo = async (
    info: any,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveCalculationInfoFormB(info, caseId);
      dispatch(saveCalculationInfo(info));
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetCalculationInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveCalculationInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching calculation info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveCalculationInfo,
    handleGetCalculationInfo,
  };
};

export default useCalculationInfo;
