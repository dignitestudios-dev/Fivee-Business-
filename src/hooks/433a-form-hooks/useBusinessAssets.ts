import { saveBusinessAssetsInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";

const useBusinessAssets = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveBusinessAssetsInfo = async (
    info: BusinessAssetsFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      if (!parsedInfo.digitalAssetsInfo?.digitalAssets?.length) {
        delete parsedInfo.digitalAssetsInfo;
      }

      if (!parsedInfo.bankAccountsInfo?.bankAccounts?.length) {
        delete parsedInfo.bankAccountsInfo;
      }

      if (!parsedInfo.assetItems?.assets?.length) {
        delete parsedInfo.assetItems;
      } else {
        parsedInfo.assetItems.assets = parsedInfo.assetItems?.assets.map(
          (asset: any) => {
            delete asset.totalValue;
            return asset;
          }
        );
      }

      console.log("parsedInfo: ", parsedInfo);

      await api.saveBusinessAssetsInfo(parsedInfo, caseId);
      dispatch(saveBusinessAssetsInfo(info));
    } catch (error: any) {
      console.error("Error saving business assets info:", error);
      throw new Error(error?.message || "Failed to save business assets info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBusinessAssetsInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(saveBusinessAssetsInfo(response.data || {}));
    } catch (error: any) {
      console.error("Error fetching business assets info:", error);
      throw new Error(error?.message || "Failed to fetch business assets info");
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

export default useBusinessAssets;
