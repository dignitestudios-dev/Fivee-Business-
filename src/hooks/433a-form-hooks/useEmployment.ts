import { saveEmploymentInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";

const useEmployment = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveEmployment = async (
    info: EmploymentFromSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveEmploymentInfo(info, caseId);
      dispatch(saveEmploymentInfo(info));
    } catch (error: any) {
      console.error("Error saving employment info:", error);
      throw new Error(error?.message || "Failed to save employment info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetEmploymentInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    setLoadingFormData(true);

    try {
      console.log("Fetching employment info for section:", section);
      if (!caseId) return;

      const response = await api.get433aSectionInfo(caseId, section);

      dispatch(saveEmploymentInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching employment info:", error);
      throw new Error(error?.message || "Failed to fetch employment info");
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveEmployment,
    handleGetEmploymentInfo,
  };
};

export default useEmployment;
