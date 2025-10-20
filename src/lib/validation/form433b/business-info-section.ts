import z from "zod";

export const businessInfoInitialValues: BusinessInfoFormSchema = {
  businessName: "",
  ein: "",
  physicalAddress: "",
  county: "",
  description: "",
  primaryPhone: "",
  secondaryPhone: "",
  website: "",
  mailingAddress: "",
  faxNumber: "",
  federalContractor: false,
  totalEmployees: "",
  onlyEmployee: false,
  taxDepositFrequency: "",
  averageMonthlyPayroll: "",
  outsourcePayroll: false,
  payrollProviderName: "",
  payrollProviderAddress: "",
  associates: [],
};

const einRegex = /^\d{2}-\d{7}$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

const associateSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  title: z.string().min(1, "Title is required"),
  percentOwnership: z
    .string()
    .min(1, "Percent ownership and annual salary is required"),
  ssn: z
    .string()
    .min(1, "SSN is required")
    .regex(ssnRegex, "SSN must be in the format XXX-XX-XXXX"),
  homeAddress: z.string().min(1, "Home address is required"),
  primaryPhone: z
    .string()
    .min(1, "Primary phone is required")
    .regex(phoneLooseRegex, "Invalid phone number"),
  secondaryPhone: z
    .string()
    .regex(phoneLooseRegex, "Invalid phone number")
    .optional()
    .nullable(),
});

export const businessInfoSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    ein: z
      .string()
      .min(1, "EIN is required")
      .regex(einRegex, "EIN must be in the format XX-XXXXXXX"),
    physicalAddress: z.string().min(1, "Physical address is required"),
    county: z.string().min(1, "County is required"),
    description: z.string().min(1, "Description is required"),
    primaryPhone: z
      .string()
      .min(1, "Primary phone is required")
      .regex(phoneLooseRegex, "Invalid phone number"),
    secondaryPhone: z
      .string()
      .regex(phoneLooseRegex, "Invalid phone number")
      .optional()
      .nullable(),
    website: z.string().optional().nullable(),
    mailingAddress: z.string().optional().nullable(),
    faxNumber: z
      .string()
      .regex(phoneLooseRegex, "Invalid fax number")
      .optional()
      .nullable(),
    federalContractor: z.boolean(),
    totalEmployees: z.preprocess(
      (v) => Number(v),
      z.number().min(1, "Total employees is required").int().nonnegative()
    ),
    onlyEmployee: z.boolean().optional().default(false),
    taxDepositFrequency: z
      .string()
      .min(1, "Frequency of tax deposits is required"),
    averageMonthlyPayroll: z.preprocess(
      (v) => Number(v),
      z.number().min(0, "Average monthly payroll is required").nonnegative()
    ),
    outsourcePayroll: z.boolean(),
    payrollProviderName: z.string().optional().nullable(),
    payrollProviderAddress: z.string().optional().nullable(),
    associates: z
      .array(associateSchema)
      .min(1, "At least one associate is required"),
  })
  .superRefine((data, ctx) => {
    if (data.outsourcePayroll) {
      if (!data.payrollProviderName) {
        ctx.addIssue({
          code: "custom",
          message: "Provider name is required",
          path: ["payrollProviderName"],
        });
      }
      if (!data.payrollProviderAddress) {
        ctx.addIssue({
          code: "custom",
          message: "Provider address is required",
          path: ["payrollProviderAddress"],
        });
      }
    }
  });
