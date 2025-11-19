import * as z from "zod";

const ssnItinRegex = /^\d{3}-\d{2}-\d{4}$/;
const einRegex = /^\d{2}-\d{7}$/;

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  county: z.string().min(1, "County is required"),
});

const taxpayerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleInitial: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    socialSecurityNumber: z
      .string()
      .regex(ssnItinRegex, "Invalid SSN format")
      .optional(),
    individualTaxpayerIdentificationNumber: z
      .string()
      .regex(ssnItinRegex, "Invalid ITIN format")
      .optional(),
  })
  .refine(
    (data) =>
      data.socialSecurityNumber || data.individualTaxpayerIdentificationNumber,
    {
      message: "Either SSN or ITIN is required",
      path: ["socialSecurityNumber"],
    }
  );

const taxPeriodsSchema = z
  .object({
    isIndividualIncomeTax: z.boolean(),
    individualTaxDescription: z.string().optional(),
    isTrustFundRecoveryPenalty: z.boolean(),
    trustFundBusinessName: z.string().optional(),
    trustFundPeriodEnding: z.string().optional(),
    isEmployerQuarterlyTax: z.boolean(),
    quarterlyPeriods: z.string().optional(),
    isEmployerAnnualFUTATax: z.boolean(),
    annualYears: z.string().optional(),
    isOtherFederalTax: z.boolean(),
    otherTaxDescription: z.string().optional(),
    attachmentToForm656Dated: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasSelection =
        data.isIndividualIncomeTax ||
        data.isTrustFundRecoveryPenalty ||
        data.isEmployerQuarterlyTax ||
        data.isEmployerAnnualFUTATax ||
        data.isOtherFederalTax ||
        !!data.attachmentToForm656Dated;
      return hasSelection;
    },
    {
      message:
        "At least one tax period must be specified or an attachment provided.",
    }
  );

const lowIncomeSchema = z.object({
  qualifiesForLowIncome: z.boolean(),
  qualificationBasis: z
    .enum(["adjusted_gross_income", "household_monthly_income"])
    .optional(),
  familySize: z.number({ message: "Must be a number" }).optional(),
  residenceState: z.enum(["contiguous_states", "alaska", "hawaii"]).optional(),
  adjustedGrossIncome: z
    .number({ message: "Must be a number" })
    .min(0, "Adjusted gross income must be non-negative")
    .optional(),
  householdMonthlyIncome: z
    .number({ message: "Must be a number" })
    .min(0, "Household monthly income must be non-negative")
    .optional(),
});

export const individualInfoSchema = z
  .object({
    primaryTaxpayer: taxpayerSchema,
    spouseTaxpayer: taxpayerSchema.optional(),
    isJointOffer: z.boolean(),
    addressInformation: z.object({
      physicalAddress: addressSchema,
      mailingAddress: addressSchema.optional(),
    }),
    isNewAddressSinceLastReturn: z.boolean(),
    updateRecordsToThisAddress: z.boolean(),
    employerIdentificationNumber: z
      .string()
      .regex(einRegex, "Invalid EIN format")
      .optional(),
    taxPeriods: taxPeriodsSchema,
    lowIncomeCertification: lowIncomeSchema,
  })
  .superRefine((data, ctx) => {
    if (data.isJointOffer && !data.spouseTaxpayer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Spouse information is required for joint offer",
        path: ["spouseTaxpayer"],
      });
    }

    if (
      data.taxPeriods.isIndividualIncomeTax &&
      !data.taxPeriods.individualTaxDescription
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Individual tax description is required",
        path: ["taxPeriods.individualTaxDescription"],
      });
    }

    if (data.taxPeriods.isTrustFundRecoveryPenalty) {
      if (!data.taxPeriods.trustFundBusinessName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Trust fund business name is required",
          path: ["taxPeriods.trustFundBusinessName"],
        });
      }
      if (!data.taxPeriods.trustFundPeriodEnding) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Trust fund period ending is required",
          path: ["taxPeriods.trustFundPeriodEnding"],
        });
      }
    }

    if (
      data.taxPeriods.isEmployerQuarterlyTax &&
      !data.taxPeriods.quarterlyPeriods
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quarterly periods are required",
        path: ["taxPeriods.quarterlyPeriods"],
      });
    }

    if (
      data.taxPeriods.isEmployerAnnualFUTATax &&
      !data.taxPeriods.annualYears
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Annual years are required",
        path: ["taxPeriods.annualYears"],
      });
    }

    if (
      data.taxPeriods.isOtherFederalTax &&
      !data.taxPeriods.otherTaxDescription
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Other tax description is required",
        path: ["taxPeriods.otherTaxDescription"],
      });
    }

    if (data.lowIncomeCertification.qualifiesForLowIncome) {
      if (!data.lowIncomeCertification.qualificationBasis) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Qualification basis is required",
          path: ["lowIncomeCertification.qualificationBasis"],
        });
      }
      if (data.lowIncomeCertification.familySize == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Family size is required",
          path: ["lowIncomeCertification.familySize"],
        });
      }
      if (
        data.lowIncomeCertification.familySize &&
        data.lowIncomeCertification.familySize < 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Family size must be at least 1",
          path: ["lowIncomeCertification.familySize"],
        });
      }
      if (!data.lowIncomeCertification.residenceState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Residence state is required",
          path: ["lowIncomeCertification.residenceState"],
        });
      }
      if (
        data.lowIncomeCertification.qualificationBasis ===
          "adjusted_gross_income" &&
        data.lowIncomeCertification.adjustedGrossIncome == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Adjusted gross income is required",
          path: ["lowIncomeCertification.adjustedGrossIncome"],
        });
      }
      if (
        data.lowIncomeCertification.qualificationBasis ===
          "household_monthly_income" &&
        data.lowIncomeCertification.householdMonthlyIncome == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Household monthly income is required",
          path: ["lowIncomeCertification.householdMonthlyIncome"],
        });
      }
    }
  });

export const individualInfoInitialValues: IndividualInfoFormSchema = {
  primaryTaxpayer: {
    firstName: "",
    middleInitial: "",
    lastName: "",
    socialSecurityNumber: "",
    individualTaxpayerIdentificationNumber: "",
  },
  // spouseTaxpayer should default to undefined so validation doesn't run for
  // spouse fields when this is not a joint offer. The form UI will set this
  // when the user checks the "isJointOffer" option.
  spouseTaxpayer: undefined,
  isJointOffer: false,
  addressInformation: {
    physicalAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      county: "",
    },
    mailingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      county: "",
    },
  },
  isNewAddressSinceLastReturn: false,
  updateRecordsToThisAddress: false,
  employerIdentificationNumber: "",
  taxPeriods: {
    isIndividualIncomeTax: false,
    individualTaxDescription: "",
    isTrustFundRecoveryPenalty: false,
    trustFundBusinessName: "",
    trustFundPeriodEnding: "",
    isEmployerQuarterlyTax: false,
    quarterlyPeriods: "",
    isEmployerAnnualFUTATax: false,
    annualYears: "",
    isOtherFederalTax: false,
    otherTaxDescription: "",
    attachmentToForm656Dated: "",
  },
  lowIncomeCertification: {
    qualifiesForLowIncome: false,
    qualificationBasis: undefined,
    familySize: null,
    residenceState: undefined,
    adjustedGrossIncome: undefined,
    householdMonthlyIncome: undefined,
  },
};
