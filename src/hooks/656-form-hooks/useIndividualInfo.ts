import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { saveIndividualInformation } from "@/lib/features/form656Slice"; // We'll create
import toast from "react-hot-toast";

const useIndividualInfo = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSaveIndividualInfo = async (
    info: IndividualInfoFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      console.log("Individual Info: ", info, " caseId is ", caseId);
      if (!info?.lowIncomeCertification?.familySize) {
        info.lowIncomeCertification.familySize = 0;
      }
      await api.saveIndividualInfo(info, caseId);
      dispatch(saveIndividualInformation(info));
    } catch (error: any) {
      console.error("Error saving individual info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetIndividualInfo = async (
    caseId: string | null,
    section: Form656Section // e.g. type Form656Section = "individualInfo" | ...
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(saveIndividualInformation(response.data?.data || {}));
    } catch (error: any) {
      console.error("Error fetching individual info:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSaveIndividualInfo,
    handleGetIndividualInfo,
  };
};

export default useIndividualInfo;
