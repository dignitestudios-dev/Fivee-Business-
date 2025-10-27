import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatDateForInput } from "@/utils/helper";

// --- Types ---
interface FormData433AState {
  caseId: string | null;
  personalInfo: PersonalInfoFromSchema | null;
  employmentInfo: EmploymentFromSchema | null;
  assetsInfo: PersonalAssetsFormSchema | null;
  selfEmployedInfo: SelfEmployedFormSchema | null;
  businessAssetsInfo: BusinessAssetsFormSchema | null;
  businessIncomeInfo: BusinessIncomeFormSchema | null;
  householdIncomeInfo: HouseholdIncomeFormSchema | null;
  calculationInfo: CalculationFormSchema | null;
  otherInfo: OtherInfoFormSchema | null;
  signatureInfo: SignatureFormSchema | null;
}

// --- Initial State ---
const initialState: FormData433AState = {
  caseId: null,
  personalInfo: null,
  employmentInfo: null,
  assetsInfo: null,
  selfEmployedInfo: null,
  businessAssetsInfo: null,
  businessIncomeInfo: null,
  householdIncomeInfo: null,
  calculationInfo: null,
  otherInfo: null,
  signatureInfo: null,
};

// --- Slice ---
const form433aSlice = createSlice({
  name: "form433a",
  initialState,
  reducers: {
    setCaseId: (state, action: PayloadAction<string | null>) => {
      const newCaseId = action.payload;
      // If caseId changed, clear any previously stored form data so stale
      // values from another case are not reused.
      if (state.caseId !== newCaseId) {
        state.caseId = newCaseId;
        state.personalInfo = null;
        state.employmentInfo = null;
        state.assetsInfo = null;
        state.selfEmployedInfo = null;
        state.businessAssetsInfo = null;
        state.businessIncomeInfo = null;
        state.householdIncomeInfo = null;
        state.calculationInfo = null;
        state.otherInfo = null;
        state.signatureInfo = null;
      }
    },
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
      if (action.payload) {
        // Format litigation date
        action.payload.litigation.possibleCompletionDate = formatDateForInput(
          action.payload.litigation?.possibleCompletionDate
        );

        // Format bankruptcy dates
        action.payload.bankruptcy.dateFiled = formatDateForInput(
          action.payload.bankruptcy?.dateFiled
        );
        action.payload.bankruptcy.dateDismissed = formatDateForInput(
          action.payload.bankruptcy?.dateDismissed
        );
        action.payload.bankruptcy.dateDischarged = formatDateForInput(
          action.payload.bankruptcy?.dateDischarged
        );

        // Format foreignResidence dates
        action.payload.foreignResidence.dateFrom = formatDateForInput(
          action.payload.foreignResidence?.dateFrom
        );
        action.payload.foreignResidence.dateTo = formatDateForInput(
          action.payload.foreignResidence?.dateTo
        );

        // // Format trustBeneficiary date
        // action.payload.trustBeneficiary.whenAmountReceived = formatDateForInput(
        //   action.payload.trustBeneficiary?.whenAmountReceived
        // );

        // Format assetTransfers dates in array
        if (action.payload.assetTransfers?.transfers) {
          action.payload.assetTransfers.transfers =
            action.payload.assetTransfers.transfers.map((transfer: any) => ({
              ...transfer,
              dateTransferred: formatDateForInput(transfer.dateTransferred),
            }));
        }

        state.otherInfo = action.payload;
      } else {
        state.otherInfo = null;
      }
    },

    // Save entire calculation info data
    saveSignatureInfo: (
      state,
      action: PayloadAction<SignatureFormSchema | null>
    ) => {
      state.signatureInfo = action.payload;
    },
  },
});

// --- Export actions & reducer ---
export const {
  setCaseId,
  savePersonalInfo,
  saveEmploymentInfo,
  savePersonalAssetsInfo,
  saveSelfEmployedInfo,
  saveBusinessAssetsInfo,
  saveBusinessIncomeInfo,
  saveHouseholdIncomeInfo,
  saveCalculationInfo,
  saveOtherInfo,
  saveSignatureInfo,
} = form433aSlice.actions;
export default form433aSlice.reducer;
