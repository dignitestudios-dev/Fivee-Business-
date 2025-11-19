import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveSignatureInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useSignaturesAndAttachments = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveSignatureInfo = async (info: any, caseId: string | null) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveSignaturesAndAttachmentsFormB(info, caseId);
      dispatch(saveSignatureInfo(info));
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetSignatureInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveSignatureInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching signatures info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveSignatureInfo,
    handleGetSignatureInfo,
  };
};

export default useSignaturesAndAttachments;
