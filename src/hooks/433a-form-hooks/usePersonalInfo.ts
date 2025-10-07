import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { getCaseId } from "@/utils/helper";
import { savePersonalInfo } from "@/lib/features/form433aSlice";

const usePersonalInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSavePersonalInfo = async (info: PersonalInfoFromSchema) => {
    setLoading(true);

    try {
      const caseId = getCaseId();
      if (!caseId) return;

      await api.savePersonalInfo(info, caseId);
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      throw new Error(error?.message || "Failed to save personal info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPersonalInfo = async (section: Form433aSection) => {
    setLoadingFormData(true);

    try {
      console.log("Fetching personal info for section:", section);
      const caseId = getCaseId();
      console.log("caseId: ", caseId);
      if (!caseId) return;

      const response = await api.getPersonalInfo(caseId, section);

      dispatch(savePersonalInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching personal info:", error);
      throw new Error(error?.message || "Failed to fetch personal info");
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
