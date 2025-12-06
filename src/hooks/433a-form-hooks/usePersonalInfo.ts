import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { getCaseId } from "@/utils/helper";
import { savePersonalInfo } from "@/lib/features/form433aSlice";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";

const usePersonalInfo = () => {
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useGlobalPopup();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSavePersonalInfo = async (
    info: PersonalInfoFromSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.savePersonalInfo(info, caseId);
      dispatch(savePersonalInfo(info));
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      showError(error?.message || "Failed to save personal info", "Personal Info Error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPersonalInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    setLoadingFormData(true);

    try {
      console.log("Fetching personal info for section:", section);
      if (!caseId) return;

      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(savePersonalInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching personal info:", error);
      throw error;
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSavePersonalInfo,
    handleGetPersonalInfo,
  };
};

export default usePersonalInfo;
