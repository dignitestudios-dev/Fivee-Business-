import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { personalInfoInitialValues } from "../validation/form433a/personal-info-section";
import { formatDateForInput } from "@/utils/helper";

// --- Types ---
interface FormData433AState {
  personalInfo: PersonalInfoFromSchema | null;
  employmentInfo: EmploymentFromSchema | null;
}

// --- Initial State ---
const initialState: FormData433AState = {
  personalInfo: null,
  employmentInfo: null,
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
      action.payload.dob = formatDateForInput(action.payload?.dob);
      action.payload.dateOfMarriage = formatDateForInput(
        action.payload?.dateOfMarriage
      );
      action.payload.spouseDOB = formatDateForInput(action.payload?.spouseDOB);

      state.personalInfo = action.payload;
    },

    // Save entire employment info data
    saveEmploymentInfo: (
      state,
      action: PayloadAction<EmploymentFromSchema>
    ) => {
      state.employmentInfo = action.payload;
    },
  },
});

// --- Export actions & reducer ---
export const { savePersonalInfo } = form433aSlice.actions;
export default form433aSlice.reducer;
