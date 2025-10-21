import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveBusinessAssetInfo } from "@/lib/features/form433bSlice";
import toast from "react-hot-toast";

const useBusinessAssetInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessAssetsInfo = async (
    info: any,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.saveBusinessAssetInfo(info, caseId);
      dispatch(saveBusinessAssetInfo(info));
    } catch (error: any) {
      toast.error(error?.message || "Failed to save business asset info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessAssetsInfo = async (
    caseId: string | null,
    section: Form433bSection
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;
      const response = await api.get433bSectionInfo(caseId, section);
      dispatch(saveBusinessAssetInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching business asset info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveBusinessAssetsInfo,
    handleGetBusinessAssetsInfo,
  };
};

export default useBusinessAssetInfo;