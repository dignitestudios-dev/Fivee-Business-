import { saveCalculationInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useCalculation = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveCalculationInfo = async (
    info: CalculationFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      parsedInfo = { paymentTimeline: parsedInfo.paymentTimeline };

      await api.saveCalculationInfo(parsedInfo, caseId);
      dispatch(saveCalculationInfo(info));
    } catch (error: any) {
      console.error("Error saving calculation info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetCalculationInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(saveCalculationInfo(response.data?.data || {}));
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

export default useCalculation;
