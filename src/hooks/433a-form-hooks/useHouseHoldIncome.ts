import { saveHouseholdIncomeInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useHouseholdIncome = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveHouseholdIncomeInfo = async (
    info: HouseholdIncomeFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      delete parsedInfo.boxD;
      delete parsedInfo.boxE;
      delete parsedInfo.boxF;
      delete parsedInfo.income.netBusinessIncomeFromBoxC;

      console.log("Box F when saving: ", info);

      await api.saveHouseholdIncomeInfo(parsedInfo, caseId);
      dispatch(saveHouseholdIncomeInfo(info));
    } catch (error: any) {
      console.error("Error saving household income info:", error);
      toast.error(error?.message || "Failed to save household income info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetHouseholdIncomeInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(saveHouseholdIncomeInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching household income info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveHouseholdIncomeInfo,
    handleGetHouseholdIncomeInfo,
  };
};

export default useHouseholdIncome;
