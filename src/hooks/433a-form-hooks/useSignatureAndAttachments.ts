import { saveSignatureInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useSignatureAndAttachments = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveSignatureInfo = async (
    info: SignatureFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveSignatureInfo(info, caseId);
      dispatch(saveSignatureInfo(info));
    } catch (error: any) {
      console.error("Error saving signature info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetSignatureInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433aSectionInfo(caseId, section);
      console.log("Signature data: ", response);
      dispatch(saveSignatureInfo(response?.data || {}));
    } catch (error: any) {
      console.error("Error fetching signature info:", error);
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

export default useSignatureAndAttachments;
