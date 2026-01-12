import * as z from "zod";

const einRegex = /^\d{2}-\d{7}$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const businessTaxPeriodsSchema = z.object({
  isIndividualIncomeTax: z.coerce.boolean().optional().default(false),
  individualTaxDescription: z.string().optional(),
  isEmployerQuarterlyTax: z.coerce.boolean().optional().default(false),
  quarterlyPeriods: z.string().optional(),
  isEmployerAnnualFUTATax: z.coerce.boolean().optional().default(false),
  annualYears: z.string().optional(),
  isOtherFederalTax: z.coerce.boolean().optional().default(false),
  otherTaxDescription: z.string().optional(),
  attachmentToForm656Dated: z.string().optional(),
});

export const businessInfoSchema656 = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    businessPhysicalAddress: z.string().min(1, "Physical address is required"),
    businessMailingAddress: z.string().optional(),
    isNewAddressSinceLastFiled: z.coerce.boolean().default(false),
    updateRecordsToThisAddress: z.coerce.boolean().default(false),
    employerIdentificationNumber: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => !val || einRegex.test(val),
        "Invalid EIN format"
      ),
    primaryContactNameAndTitle: z
      .string()
      .min(1, "Primary contact name and title required"),
    telephoneNumber: z.string().regex(phoneRegex, "Invalid phone format"),
    businessTaxPeriods: businessTaxPeriodsSchema,
  })
  .superRefine((data, ctx) => {
    // No conditional validation - all fields are optional
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
