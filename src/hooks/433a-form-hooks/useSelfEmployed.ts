import { saveSelfEmployedInfo } from "@/lib/features/form433aSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useSelfEmployed = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveSelfEmployedInfo = async (
    info: SelfEmployedFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      let parsedInfo = { ...info };

      if (!parsedInfo.isSelfEmployed) {
        parsedInfo = { isSelfEmployed: false };
      } else {
        if (parsedInfo.hasOtherBusinessInterests) {
          if (parsedInfo.otherBusinessInterests) {
            parsedInfo.otherBusinessInterests =
              parsedInfo.otherBusinessInterests.map((business: any) => {
                business.ownershipPercentage = String(
                  business.ownershipPercentage
                );

                if (business.businessType !== "other") {
                  const { otherBusinessTypeDescription, ...rest } = business;
                  return rest;
                }

                return business;
              });
          }
        } else {
          delete parsedInfo.otherBusinessInterests;
        }
      }
      await api.saveSelfEmployedInfo(parsedInfo, caseId);
      dispatch(saveSelfEmployedInfo(info));
    } catch (error: any) {
      console.error("Error saving self-employed info:", error);
      toast.error(error?.message || "Failed to save self-employed info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSelfEmployedInfo = async (
    caseId: string | null,
    section: Form433aSection
  ) => {
    if (!caseId) return;
    setLoadingFormData(true);

    try {
      const response = await api.get433aSectionInfo(caseId, section);
      dispatch(
        saveSelfEmployedInfo({ ...response.data, isSelfEmployed: true })
      );
    } catch (error: any) {
      console.error("Error fetching self-employed info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveSelfEmployedInfo,
    handleGetSelfEmployedInfo,
  };
};

export default useSelfEmployed;
