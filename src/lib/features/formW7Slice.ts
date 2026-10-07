import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FormDataW7State = {
  caseId: null,
  applicationInfo: null,
  personalInfo: null,
  otherInformation: null,
  signatureDelegateInfo: null,
  acceptanceAgentInfo: null,
  sectionStatus: null,
};

const formW7Slice = createSlice({
  name: "formW7",
  initialState,
  reducers: {
    setCaseId: (state, action: PayloadAction<string | null>) => {
      const newCaseId = action.payload;
      // Switching cases must not leak another case's answers into the form
      if (state.caseId !== newCaseId) {
        state.caseId = newCaseId;
        state.applicationInfo = null;
        state.personalInfo = null;
        state.otherInformation = null;
        state.signatureDelegateInfo = null;
        state.acceptanceAgentInfo = null;
        state.sectionStatus = null;
      }
    },
    saveApplicationInfo: (
      state,
      action: PayloadAction<W7ApplicationInfoFormSchema | null>
    ) => {
      state.applicationInfo = action.payload;
    },
    savePersonalInfo: (
      state,
      action: PayloadAction<W7PersonalInfoFormSchema | null>
    ) => {
      state.personalInfo = action.payload;
    },
    saveOtherInformation: (
      state,
      action: PayloadAction<W7OtherInformationFormSchema | null>
    ) => {
      state.otherInformation = action.payload;
    },
    saveSignatureDelegateInfo: (
      state,
      action: PayloadAction<W7SignatureDelegateFormSchema | null>
    ) => {
      state.signatureDelegateInfo = action.payload;
    },
    saveAcceptanceAgentInfo: (
      state,
      action: PayloadAction<W7AcceptanceAgentFormSchema | null>
    ) => {
      state.acceptanceAgentInfo = action.payload;
    },
    setSectionStatus: (
      state,
      action: PayloadAction<Record<string, FormW7SectionStatus> | null>
    ) => {
      state.sectionStatus = action.payload;
    },
  },
});

export const {
  setCaseId,
  saveApplicationInfo,
  savePersonalInfo,
  saveOtherInformation,
  saveSignatureDelegateInfo,
  saveAcceptanceAgentInfo,
  setSectionStatus,
} = formW7Slice.actions;

export default formW7Slice.reducer;
