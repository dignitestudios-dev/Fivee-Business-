import { formatDateForInput } from "@/utils/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Initial State ---
const initialState: FormData433BState = {
  businessInformation: null,
  businessAssetsInfo: null,
  businessIncomeInfo: null,
  businessExpenseInfo: null,
  calculationInfo: null,
  otherInfo: null,
  signatureInfo: null,
};

// --- Slice ---
const form433bSlice = createSlice({
  name: "form433b",
  initialState,
  reducers: {
    // Save entire business information data
    saveBusinessInformation: (
      state,
      action: PayloadAction<BusinessInfoFormSchema | null>
    ) => {
      state.businessInformation = action.payload;
    },

    saveBusinessAssetInfo: (state, action: PayloadAction<any | null>) => {
      if (action.payload) {
        // Format dates
        action.payload.realEstate = action.payload.realEstate?.map(
          (r: any) => ({
            ...r,
            datePurchased: formatDateForInput(r.datePurchased),
            finalPaymentDate: formatDateForInput(r.finalPaymentDate),
          })
        );
        action.payload.vehicles = action.payload.vehicles?.map((v: any) => ({
          ...v,
          datePurchased: formatDateForInput(v.datePurchased),
          finalPaymentDate: formatDateForInput(v.finalPaymentDate),
        }));
      }
      state.businessAssetsInfo = action.payload;
    },

    saveBusinessIncomeInfo: (state, action: PayloadAction<any | null>) => {
      state.businessIncomeInfo = action.payload;
    },

    saveBusinessExpenseInfo: (state, action: PayloadAction<any | null>) => {
      action.payload.periodBeginning = formatDateForInput(
        action.payload.periodBeginning
      );
      action.payload.periodThrough = formatDateForInput(
        action.payload.periodThrough
      );

      state.businessExpenseInfo = action.payload;
    },

    saveCalculationInfo: (state, action: PayloadAction<any | null>) => {
      state.calculationInfo = action.payload;
    },

    saveOtherInfo: (state, action: PayloadAction<any | null>) => {
      if (action.payload) {
        // Format dates
        action.payload.bankruptcyHistory = {
          ...action.payload.bankruptcyHistory,
          dateFiled: formatDateForInput(
            action.payload.bankruptcyHistory.dateFiled
          ),
          dateDismissedOrDischarged: formatDateForInput(
            action.payload.bankruptcyHistory.dateDismissedOrDischarged
          ),
        };
        action.payload.litigationHistory = action.payload.litigationHistory.map(
          (lit: any) => ({
            ...lit,
            possibleCompletionDate: formatDateForInput(
              lit.possibleCompletionDate
            ),
          })
        );
        action.payload.assetTransfersOver10k =
          action.payload.assetTransfersOver10k.map((trans: any) => ({
            ...trans,
            date: formatDateForInput(trans.date),
          }));
        action.payload.realPropertyTransfers =
          action.payload.realPropertyTransfers.map((trans: any) => ({
            ...trans,
            date: formatDateForInput(trans.date),
          }));
      }
      state.otherInfo = action.payload;
    },

    saveSignatureInfo: (state, action: PayloadAction<any | null>) => {
      action.payload.taxpayerSignature.date = action.payload?.taxpayerSignature
        ?.date
        ? formatDateForInput(action.payload.taxpayerSignature.date)
        : action.payload.taxpayerSignature.date;
      state.signatureInfo = action.payload;
    },
  },
});

// --- Export actions & reducer ---
export const {
  saveBusinessInformation,
  saveBusinessAssetInfo,
  saveBusinessIncomeInfo,
  saveBusinessExpenseInfo,
  saveCalculationInfo,
  saveOtherInfo,
  saveSignatureInfo,
} = form433bSlice.actions;

export default form433bSlice.reducer;
