import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
interface FormData433BState {
  businessInformation: BusinessInfoFormSchema | null;
  // Add other sections: businessAssetInfo, etc.
}

// --- Initial State ---
const initialState: FormData433BState = {
  businessInformation: null,
  // Add others: null,
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
    // Add reducers for other sections as implemented
  },
});

// --- Export actions & reducer ---
export const { saveBusinessInformation } = form433bSlice.actions;
export default form433bSlice.reducer;
