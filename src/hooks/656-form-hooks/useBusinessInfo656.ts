import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveBusinessInformation } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useBusinessInfo656 = () => {
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
      await api.saveBusinessInfo656(info, caseId);
      dispatch(saveBusinessInformation(info));
    } catch (error: any) {
      console.error("Error saving business info:", error);
      toast.error(error?.message || "Failed to save business info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessInfo = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
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

export default useBusinessInfo656;


