import * as z from "zod";

const einRegex = /^\d{2}-\d{7}$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const taxPeriodSchema = z.object({
  taxType: z.string().min(1, "Tax type is required"),
  periodEnding: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  businessName: z.string().optional(),
});

export const businessInfoSchema656 = z.object({
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
  businessTaxPeriods: z
    .array(taxPeriodSchema)
    .min(1, "At least one tax period is required"),
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
  businessTaxPeriods: [],
};
