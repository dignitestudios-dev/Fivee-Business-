import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { savePaymentTerms } from "@/lib/features/form656Slice";
import toast from "react-hot-toast";

const usePaymentTerms = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);

  const handleSavePaymentTerms = async (
    info: PaymentTermsFormSchema,
    caseId: string | null
  ) => {
    if (!caseId) return;
    setLoading(true);

    try {
      await api.savePaymentTerms(info, caseId);
      dispatch(savePaymentTerms(info));
    } catch (error: any) {
      console.error("Error saving payment terms:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentTerms = async (
    caseId: string | null,
    section: Form656Section
  ) => {
    setLoadingFormData(true);

    try {
      if (!caseId) return;

      const response = await api.get656SectionInfo(caseId, section);
      dispatch(savePaymentTerms(response.data?.data || {}));
    } catch (error: any) {
      console.error("Error fetching payment terms:", error);
    } finally {
      setLoadingFormData(false);
    }
  };

  return {
    loading,
    loadingFormData,
    handleSavePaymentTerms,
    handleGetPaymentTerms,
  };
};

export default usePaymentTerms;
