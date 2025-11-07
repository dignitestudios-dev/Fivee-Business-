import * as z from "zod";

const einRegex = /^\d{2}-\d{7}$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const businessTaxPeriodsSchema = z
  .object({
    isIndividualIncomeTax: z.boolean(),
    individualTaxDescription: z.string().optional(),
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

export const businessInfoSchema656 = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    businessPhysicalAddress: z.string().min(1, "Physical address is required"),
    businessMailingAddress: z.string().optional(),
    isNewAddressSinceLastFiled: z.boolean(),
    updateRecordsToThisAddress: z.boolean(),
    employerIdentificationNumber: z
      .string()
      .regex(einRegex, "Invalid EIN format"),
    primaryContactNameAndTitle: z
      .string()
      .min(1, "Primary contact name and title required"),
    telephoneNumber: z.string().regex(phoneRegex, "Invalid phone format"),
    businessTaxPeriods: businessTaxPeriodsSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.businessTaxPeriods.isIndividualIncomeTax &&
      !data.businessTaxPeriods.individualTaxDescription
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Individual tax description is required",
        path: ["businessTaxPeriods.individualTaxDescription"],
      });
    }

    if (
      data.businessTaxPeriods.isEmployerQuarterlyTax &&
      !data.businessTaxPeriods.quarterlyPeriods
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quarterly periods are required",
        path: ["businessTaxPeriods.quarterlyPeriods"],
      });
    }

    if (
      data.businessTaxPeriods.isEmployerAnnualFUTATax &&
      !data.businessTaxPeriods.annualYears
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Annual years are required",
        path: ["businessTaxPeriods.annualYears"],
      });
    }

    if (
      data.businessTaxPeriods.isOtherFederalTax &&
      !data.businessTaxPeriods.otherTaxDescription
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Other tax description is required",
        path: ["businessTaxPeriods.otherTaxDescription"],
      });
    }
  });

export const businessInfoInitialValues: BusinessInfoFormSchema = {
  businessName: "",
  businessPhysicalAddress: "",
  businessMailingAddress: "",
  isNewAddressSinceLastFiled: false,
  updateRecordsToThisAddress: false,
  employerIdentificationNumber: "",
  primaryContactNameAndTitle: "",
  telephoneNumber: "",
  businessTaxPeriods: {
    isIndividualIncomeTax: false,
    individualTaxDescription: "",
    isEmployerQuarterlyTax: false,
    quarterlyPeriods: "",
    isEmployerAnnualFUTATax: false,
    annualYears: "",
    isOtherFederalTax: false,
    otherTaxDescription: "",
    attachmentToForm656Dated: "",
  },
};
