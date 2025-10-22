import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveOtherInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useOtherInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveOtherInfo = async (info: any, caseId: string | null) => {
    if (!caseId) return;
    setLoading(true);

    try {
      const parsedData = { ...info };

      if (!parsedData.hasFiledBankruptcyInPast10Years) {
        delete parsedData.bankruptcyHistory;
      }

      if (!parsedData.hasLinesOfCredit) {
        delete parsedData.lineOfCredit;
      }

      await api.saveOtherInfoFormB(parsedData, caseId);
      dispatch(saveOtherInfo(info));
    } catch (error: any) {
      toast.error(error?.message || "Failed to save other info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtherInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveOtherInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching other info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveOtherInfo,
    handleGetOtherInfo,
  };
};

export default useOtherInfo;
