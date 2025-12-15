import { savePersonalAssetsInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const usePersonalAssets = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveAssetsInfo = async (
    info: PersonalAssetsFormSchema,
    caseId: string | null
  ) => {
    console.log("assets indo: ", info);
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      if (parsedInfo.investmentAccounts) {
        parsedInfo.investmentAccounts = parsedInfo.investmentAccounts.map(
          (account: any) => {
            if (account.investmentType !== "other") {
              const { investmentTypeText, ...rest } = account;
              return rest;
            }
            return account;
          }
        );
      }

      if (parsedInfo.retirementAccounts) {
        parsedInfo.retirementAccounts = parsedInfo.retirementAccounts.map(
          (account: any) => {
            if (account.retirementType !== "other") {
              const { retirementTypeText, ...rest } = account;
              return rest;
            }
            return account;
          }
        );
      }

      delete parsedInfo.boxA;

      await api.savePersonalAssetsInfo(parsedInfo, caseId);
      dispatch(savePersonalAssetsInfo(info));
    } catch (error: any) {
      console.error("Error saving assets info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetAssetsInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      console.log("Fetching assets info for section:", section);

      const response = await api.get433aSectionInfo(caseId, section);
      console.log("assets data from API: ", response.data);
      dispatch(savePersonalAssetsInfo(response.data?.data || {}));
    } catch (error: any) {
      console.error("Error fetching assets info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveAssetsInfo,
    handleGetAssetsInfo,
  };
};

export default usePersonalAssets;
