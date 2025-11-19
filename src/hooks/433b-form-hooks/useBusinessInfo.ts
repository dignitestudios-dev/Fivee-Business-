import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveBusinessInformation } from "@/lib/features/form433bSlice"; // We'll create the slice
import toast from "react-hot-toast";

const useBusinessInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessInfo = async (
    info: BusinessInfoFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveBusinessInfo(info, caseId);
      dispatch(saveBusinessInformation(info));
    } catch (error: any) {
      console.error("Error saving business info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      console.log("Fetching business info for section:", section);
      if (!caseId) return;

      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveBusinessInformation(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching business info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveBusinessInfo,
    handleGetBusinessInfo,
  };
};

export default useBusinessInfo;
