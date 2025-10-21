import z from "zod";

export const businessInfoInitialValues: BusinessInfoFormSchema = {
  userId: "",
  businessName: "",
  employerIdentificationNumber: "",
  businessPhysicalAddress: "",
  countyOfBusinessLocation: "",
  descriptionOfBusiness: "",
  dbaTradeName: "",
  primaryPhone: "",
  secondaryPhone: "",
  businessMailingAddress: "",
  businessWebsiteAddress: "",
  faxNumber: "",
  federalContractor: false,
  totalNumberOfEmployees: 0,
  isSoleEmployee: false,
  frequencyOfTaxDeposits: 0,
  averageGrossMonthlyPayroll: 0,
  doesOutsourcePayroll: false,
  payrollProviderName: "",
  payrollProviderAddress: "",
  partners: [],
};

const einRegex = /^\d{2}-\d{7}$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

const partnerSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  title: z.string().min(1, "Title is required"),
  percentOwnership: z.preprocess(
    (v) => Number(v),
    z
      .number()
      .min(0, "Percent ownership must be non-negative")
      .max(100, "Percent ownership cannot exceed 100")
  ),
  annualSalary: z.preprocess(
    (v) => Number(v),
    z.number().min(0, "Annual salary must be non-negative")
  ),
  socialSecurityNumber: z
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
    userId: z.string().optional().nullable(),
    businessName: z.string().min(1, "Business name is required"),
    employerIdentificationNumber: z
      .string()
      .min(1, "EIN is required")
      .regex(einRegex, "EIN must be in the format XX-XXXXXXX"),
    businessPhysicalAddress: z.string().min(1, "Physical address is required"),
    countyOfBusinessLocation: z.string().min(1, "County is required"),
    descriptionOfBusiness: z.string().min(1, "Description is required"),
    dbaTradeName: z.string().min(1, "DBA or trade name is required"),
    primaryPhone: z
      .string()
      .min(1, "Primary phone is required")
      .regex(phoneLooseRegex, "Invalid phone number"),
    secondaryPhone: z
      .string()
      .regex(phoneLooseRegex, "Invalid phone number")
      .optional()
      .nullable(),
    businessMailingAddress: z.string().optional().nullable(),
    businessWebsiteAddress: z.string().optional().nullable(),
    faxNumber: z
      .string()
      .regex(phoneLooseRegex, "Invalid fax number")
      .optional()
      .nullable(),
    federalContractor: z.boolean(),
    totalNumberOfEmployees: z.preprocess(
      (v) => Number(v),
      z.number().min(1, "Total employees is required").int().nonnegative()
    ),
    isSoleEmployee: z.boolean().optional().default(false),
    frequencyOfTaxDeposits: z.preprocess(
      (v) => Number(v),
      z.number().min(0, "Frequency of tax deposits is required").nonnegative()
    ),
    averageGrossMonthlyPayroll: z.preprocess(
      (v) => Number(v),
      z.number().min(0, "Average monthly payroll is required").nonnegative()
    ),
    doesOutsourcePayroll: z.boolean(),
    payrollProviderName: z.string().optional().nullable(),
    payrollProviderAddress: z.string().optional().nullable(),
    partners: z.array(partnerSchema).min(1, "At least one partner is required"),
  })
  .superRefine((data, ctx) => {
    if (data.doesOutsourcePayroll) {
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
