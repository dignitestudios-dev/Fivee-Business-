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
  businessIncomeInfo: BusinessIncomeFormSchema | null;
  householdIncomeInfo: HouseholdIncomeFormSchema | null;
  calculationInfo: CalculationFormSchema | null;
  otherInfo: OtherInfoFormSchema | null;
}

// --- Initial State ---
const initialState: FormData433AState = {
  personalInfo: null,
  employmentInfo: null,
  assetsInfo: null,
  selfEmployedInfo: null,
  businessAssetsInfo: null,
  businessIncomeInfo: null,
  householdIncomeInfo: null,
  calculationInfo: null,
  otherInfo: null,
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
      action: PayloadAction<PersonalAssetsFormSchema | null>
    ) => {
      action.payload.realProperties = action.payload?.realProperties?.map(
        (realProperty: any) => {
          realProperty.purchaseDate =
            formatDateForInput(realProperty.purchaseDate) ||
            realProperty.purchaseDate;
          realProperty.finalPaymentDate =
            formatDateForInput(realProperty.finalPaymentDate) ||
            realProperty.finalPaymentDate;
          return realProperty;
        }
      );

      action.payload.vehicles = action.payload?.vehicles?.map(
        (vehicle: any) => {
          vehicle.purchaseDate =
            formatDateForInput(vehicle.purchaseDate) || vehicle.purchaseDate;
          vehicle.finalPaymentDate =
            formatDateForInput(vehicle.finalPaymentDate) ||
            vehicle.finalPaymentDate;
          return vehicle;
        }
      );

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

    // Save entire business income and expense info data
    saveBusinessIncomeInfo: (
      state,
      action: PayloadAction<BusinessIncomeFormSchema | null>
    ) => {
      action.payload.periodStart = formatDateForInput(
        action.payload?.periodStart
      );
      action.payload.periodEnd = formatDateForInput(action.payload?.periodEnd);
      state.businessIncomeInfo = action.payload;
    },

    // Save entire household income and expense info data
    saveHouseholdIncomeInfo: (
      state,
      action: PayloadAction<HouseholdIncomeFormSchema | null>
    ) => {
      state.householdIncomeInfo = action.payload;
    },

    // Save entire calculation info data
    saveCalculationInfo: (
      state,
      action: PayloadAction<CalculationFormSchema | null>
    ) => {
      state.calculationInfo = action.payload;
    },

    // Save entire other info data
    saveOtherInfo: (
      state,
      action: PayloadAction<OtherInfoFormSchema | null>
    ) => {
      state.otherInfo = action.payload;
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
  saveBusinessIncomeInfo,
  saveHouseholdIncomeInfo,
  saveCalculationInfo,
  saveOtherInfo,
} = form433aSlice.actions;
export default form433aSlice.reducer;
