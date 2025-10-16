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

      // Parse litigation
      if (!parsedInfo.litigation.isInvolvedInLitigation) {
        parsedInfo.litigation = {
          isInvolvedInLitigation: false,
          
        };
      }

      // Parse bankruptcy
      if (!parsedInfo.bankruptcy.filedBankruptcyInPast7Years) {
        parsedInfo.bankruptcy = {
          filedBankruptcyInPast7Years: false,
        };
      }

      // Parse foreignResidence
      if (!parsedInfo.foreignResidence.livedOutsideUS) {
        parsedInfo.foreignResidence = {
          livedOutsideUS: false,
        };
      }

      // Parse irsLitigation
      if (!parsedInfo.irsLitigation.involvedWithIRSLitigation) {
        parsedInfo.irsLitigation = {
          involvedWithIRSLitigation: false,
        };
      }

      // Parse trustBeneficiary
      if (!parsedInfo.trustBeneficiary.isBeneficiary) {
        parsedInfo.trustBeneficiary = {
          isBeneficiary: false,
        };
      }

      // Parse trustFiduciary
      if (!parsedInfo.trustFiduciary.isTrusteeOrFiduciary) {
        parsedInfo.trustFiduciary = {
          isTrusteeOrFiduciary: false,
        };
      }

      // Parse safeDepositBox
      if (!parsedInfo.safeDepositBox.hasSafeDepositBox) {
        parsedInfo.safeDepositBox = {
          hasSafeDepositBox: false,
        };
      }

      // Parse assetTransfers
      if (!parsedInfo.assetTransfers.transferredAssets) {
        parsedInfo.assetTransfers = {
          transferredAssets: false,
        };
      }

      // Parse foreignAssets
      if (!parsedInfo.foreignAssets.hasForeignAssets) {
        parsedInfo.foreignAssets = {
          hasForeignAssets: false,
        };
      }

      // Parse thirdPartyTrusts
      if (!parsedInfo.thirdPartyTrusts.hasThirdPartyTrustFunds) {
        parsedInfo.thirdPartyTrusts = {
          hasThirdPartyTrustFunds: false,
        };
      }

      await api.saveOtherInfo(parsedInfo, caseId);
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
