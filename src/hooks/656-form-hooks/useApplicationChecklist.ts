import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveApplicationChecklist } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useApplicationChecklist = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveApplicationChecklist = async (
    info: ApplicationChecklistFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveApplicationChecklist(info, caseId);
      dispatch(saveApplicationChecklist(info));
    } catch (error: any) {
      console.error("Error saving application checklist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetApplicationChecklist = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveApplicationChecklist(response.data?.data || {}));
    } catch (error: any) {
      console.error("Error fetching application checklist:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveApplicationChecklist,
    handleGetApplicationChecklist,
  };
};

export default useApplicationChecklist;
