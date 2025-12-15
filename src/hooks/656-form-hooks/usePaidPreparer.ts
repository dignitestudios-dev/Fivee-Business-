import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { savePaidPreparer } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const usePaidPreparer = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSavePaidPreparer = async (
    info: PaidPreparerFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.savePaidPreparer(info, caseId);
      dispatch(savePaidPreparer(info));
    } catch (error: any) {
      console.error("Error saving paid preparer:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaidPreparer = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(savePaidPreparer(response.data?.data || {}));
    } catch (error: any) {
      console.error("Error fetching paid preparer:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSavePaidPreparer,
    handleGetPaidPreparer,
  };
};

export default usePaidPreparer;
