import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveDesignationEftps } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useDesignationEftps = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveDesignationEftps = async (
    info: DesignationEftpsFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveDesignationEftps(info, caseId);
      dispatch(saveDesignationEftps(info));
    } catch (error: any) {
      console.error("Error saving designation eftps:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetDesignationEftps = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveDesignationEftps(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching designation eftps:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveDesignationEftps,
    handleGetDesignationEftps,
  };
};

export default useDesignationEftps;
