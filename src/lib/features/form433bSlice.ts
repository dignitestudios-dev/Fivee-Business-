import { formatDateForInput } from "@/utils/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Initial State ---
const initialState: FormData433BState = {
  businessInformation: null,
  businessAssetsInfo: null,
  businessIncomeInfo: null,
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
  },
});

// --- Export actions & reducer ---
export const {
  saveBusinessInformation,
  saveBusinessAssetInfo,
  saveBusinessIncomeInfo,
} = form433bSlice.actions;
export default form433bSlice.reducer;
