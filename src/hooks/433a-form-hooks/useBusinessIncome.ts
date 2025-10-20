import { saveBusinessIncomeInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useBusinessIncome = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessIncomeInfo = async (
    info: BusinessIncomeFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      console.log("parsedInfo: ", parsedInfo);

      delete parsedInfo.boxC;

      await api.saveBusinessIncomeInfo(parsedInfo, caseId);
      dispatch(saveBusinessIncomeInfo(info));
    } catch (error: any) {
      console.error("Error saving business income info:", error);
      toast.error(error?.message || "Failed to save business income info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessIncomeInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      const response = await api.get433aSectionInfo(caseId, section);
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

export default useBusinessIncome;
