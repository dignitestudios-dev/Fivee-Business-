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
      const data = { ...info };

      // Clear arrays if no
      if (!data.hasNotesReceivable) data.notesReceivable = [];
      if (!data.hasAccountsReceivable) data.accountsReceivable = [];

      // Remove calculated, only send payload fields
      const payload = { ...data };
      delete payload.hasNotesReceivable;
      delete payload.hasAccountsReceivable;
      delete payload.BoxA;

      await api.saveBusinessAssetInfo(payload, caseId);
      dispatch(saveBusinessAssetInfo(info));
    } catch (error: any) {
      throw error;
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
      console.log("response.data business info: ", response.data);
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
