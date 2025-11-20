import { formatDateForInput } from "@/utils/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FormData656State = {
  caseId: null,
  individualInfo: null,
  businessInfo: null,
  reasonForOffer: null,
  paymentTerms: null,
  designationEftps: null,
  sourceOfFunds: null,
  signaturesInfo: null,
  paidPreparer: null,
  applicationChecklist: null,
};

const form656Slice = createSlice({
  name: "form656",
  initialState,
  reducers: {
    setCaseId: (state, action: PayloadAction<string | null>) => {
      const newCaseId = action.payload;
      if (state.caseId !== newCaseId) {
        state.caseId = newCaseId;
        state.individualInfo = null;
        state.businessInfo = null;
        state.reasonForOffer = null;
        state.paymentTerms = null;
        state.designationEftps = null;
        state.sourceOfFunds = null;
      }
    },
    saveIndividualInformation: (
      state,
      action: PayloadAction<IndividualInfoFormSchema | null>
    ) => {
      state.individualInfo = action.payload;
    },
    saveBusinessInformation: (
      state,
      action: PayloadAction<BusinessInfoFormSchema | null>
    ) => {
      state.businessInfo = action.payload;
    },
    saveReasonForOffer: (state, action: PayloadAction<string | null>) => {
      state.reasonForOffer = action.payload;
    },
    savePaymentTerms: (
      state,
      action: PayloadAction<PaymentTermsFormSchema | null>
    ) => {
      state.paymentTerms = action.payload;
    },
    saveDesignationEftps: (
      state,
      action: PayloadAction<DesignationEftpsFormSchema | null>
    ) => {
      action.payload.eftpsPayments.offerApplicationFeeDate = action.payload
        .eftpsPayments?.offerApplicationFeeDate
        ? formatDateForInput(
            action.payload.eftpsPayments.offerApplicationFeeDate
          )
        : action.payload.eftpsPayments.offerApplicationFeeDate;

      action.payload.eftpsPayments.offerPaymentDate = action.payload
        .eftpsPayments?.offerPaymentDate
        ? formatDateForInput(action.payload.eftpsPayments.offerPaymentDate)
        : action.payload.eftpsPayments.offerPaymentDate;

      state.designationEftps = action.payload;
    },
    saveSourceOfFunds: (
      state,
      action: PayloadAction<SourceOfFundsFormSchema | null>
    ) => {
      state.sourceOfFunds = action.payload;
    },
    saveSignatures: (
      state,
      action: PayloadAction<SignaturesFormSchema | null>
    ) => {
      state.signaturesInfo = action.payload;
    },
    savePaidPreparer: (
      state,
      action: PayloadAction<PaidPreparerFormSchema | null>
    ) => {
      action.payload.preparerSignatureDate = formatDateForInput(
        action.payload.preparerSignatureDate
      );
      state.paidPreparer = action.payload;
    },
    saveApplicationChecklist: (
      state,
      action: PayloadAction<ApplicationChecklistFormSchema | null>
    ) => {
      state.applicationChecklist = action.payload;
    },
  },
});

export const {
  setCaseId,
  saveIndividualInformation,
  saveBusinessInformation,
  saveReasonForOffer,
  savePaymentTerms,
  saveDesignationEftps,
  saveSourceOfFunds,
  saveSignatures,
  savePaidPreparer,
  saveApplicationChecklist,
} = form656Slice.actions;

export default form656Slice.reducer;
