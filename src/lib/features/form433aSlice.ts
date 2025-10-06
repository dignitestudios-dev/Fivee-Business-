import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { personalInfoInitialValues } from "../validation/form433a/personal-info-section";

// --- Types ---
interface FormData433AState {
  personalInfo: PersonalInfoFromSchema;
}

// --- Initial State ---
const initialState: FormData433AState = {
  personalInfo: personalInfoInitialValues,
};

// --- Slice ---
const form433aSlice = createSlice({
  name: "form433a",
  initialState,
  reducers: {
    // Save entire personal info data
    savePersonalInfo: (
      state,
      action: PayloadAction<PersonalInfoFromSchema>
    ) => {
      state.personalInfo = action.payload;
    },
  },
});

// --- Export actions & reducer ---
export const { savePersonalInfo } = form433aSlice.actions;
export default form433aSlice.reducer;
