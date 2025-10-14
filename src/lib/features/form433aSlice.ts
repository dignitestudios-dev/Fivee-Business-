import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { personalInfoInitialValues } from "../validation/form433a/personal-info-section";
import { formatDateForInput } from "@/utils/helper";

// --- Types ---
interface FormData433AState {
  personalInfo: PersonalInfoFromSchema | null;
  employmentInfo: EmploymentFromSchema | null;
  assetsInfo: PersonalAssetsFormSchema | null;
  selfEmployedInfo: SelfEmployedFormSchema | null;
  businessAssetsInfo: BusinessAssetsFormSchema | null;
}

// --- Initial State ---
const initialState: FormData433AState = {
  personalInfo: null,
  employmentInfo: null,
  assetsInfo: null,
  selfEmployedInfo: null,
  businessAssetsInfo: null,
};

// --- Slice ---
const form433aSlice = createSlice({
  name: "form433a",
  initialState,
  reducers: {
    // Save entire personal info data
    savePersonalInfo: (
      state,
      action: PayloadAction<PersonalInfoFromSchema | null>
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
      action: PayloadAction<EmploymentFromSchema | null>
    ) => {
      state.employmentInfo = action.payload;
    },

    // Save entire personal assets info data
    savePersonalAssetsInfo: (
      state,
      action: PayloadAction<EmploymentFromSchema | null>
    ) => {
      state.assetsInfo = action.payload;
    },

    // Save entire personal assets info data
    saveSelfEmployedInfo: (
      state,
      action: PayloadAction<SelfEmployedFormSchema | null>
    ) => {
      state.selfEmployedInfo = action.payload;
    },

    // Save entire business assets info data
    saveBusinessAssetsInfo: (
      state,
      action: PayloadAction<BusinessAssetsFormSchema | null>
    ) => {
      state.businessAssetsInfo = action.payload;
    },
  },
});

// --- Export actions & reducer ---
export const {
  savePersonalInfo,
  saveEmploymentInfo,
  savePersonalAssetsInfo,
  saveSelfEmployedInfo,
  saveBusinessAssetsInfo,
} = form433aSlice.actions;
export default form433aSlice.reducer;
