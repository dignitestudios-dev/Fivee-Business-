import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveReasonForOffer } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const useReasonForOffer = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveReasonForOffer = async (
    info: ReasonForOfferFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveReasonForOffer(info, caseId);
      dispatch(saveReasonForOffer(info.reasonType));
    } catch (error: any) {
      console.error("Error saving reason for offer:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetReasonForOffer = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveReasonForOffer(response.data?.data?.reasonType || null));
    } catch (error: any) {
      console.error("Error fetching reason for offer:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveReasonForOffer,
    handleGetReasonForOffer,
  };
};

export default useReasonForOffer;
