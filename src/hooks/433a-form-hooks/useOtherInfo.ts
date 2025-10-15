import { saveOtherInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";

const useOtherInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveOtherInfo = async (
    info: OtherInfoFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) {
      throw new Error("Case ID is required");
    }
    setLoading(true);

    try {
      const parsedInfo = { ...info };

      if (!parsedInfo.assetTransfers.transferredAssets)
        delete parsedInfo.assetTransfers.transfers;

      await api.saveOtherInfo(info, caseId);
      dispatch(saveOtherInfo(info));
    } catch (error: any) {
      console.error("Error saving other info:", error);
      throw new Error(error?.message || "Failed to save other information");
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtherInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) {
      throw new Error("Case ID is required");
    }
    setLoadingFormData(true);

    try {
      console.log("Fetching other info for section:", section);
      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(saveOtherInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching other info:", error);
      throw new Error(error?.message || "Failed to fetch other information");
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
