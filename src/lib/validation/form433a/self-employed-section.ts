import z from "zod";

export const selfEmployedInitialValues: SelfEmployedFormSchema = {
  isSelfEmployed: false,
  isSoleProprietorship: false,
  businessName: "",
  businessAddress: "",
  businessTelephone: "",
  employerIdentificationNumber: "",
  businessWebsite: "",
  tradeName: "",
  businessDescription: "",
  totalEmployees: 0,
  taxDepositFrequency: "",
  averageGrossMonthlyPayroll: 0,
  hasOtherBusinessInterests: false,
  otherBusinessInterests: [],
};

export const selfEmployedSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    isSoleProprietorship: z.boolean().optional(),
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    businessTelephone: z.string().optional(),
    employerIdentificationNumber: z.string().optional(),
    businessWebsite: z.string().optional(),
    tradeName: z.string().optional(),
    businessDescription: z.string().optional(),
    totalEmployees: z.coerce.number().optional(),
    taxDepositFrequency: z.string().optional(),
    averageGrossMonthlyPayroll: z.coerce.number().optional(),
    hasOtherBusinessInterests: z.boolean().optional(),
    otherBusinessInterests: z
      .array(
        z
          .object({
            ownershipPercentage: z.coerce
              .number()
              .min(0, "Percentage cannot be less than 0")
              .max(100, "Percentage cannot exceed 100"),
            title: z.string().min(1, "Title is required"),
            businessAddress: z.string().min(1, "Business address is required"),
            businessName: z.string().min(1, "Business name is required"),
            businessTelephone: z
              .string()
              .min(1, "Business telephone is required"),
            employerIdentificationNumber: z
              .string()
              .min(1, "Employer identification number is required"),
            businessType: z.enum(
              ["partnership", "llc", "corporation", "other"],
              {
                message: "Business type is required",
              }
            ),
            otherBusinessTypeDescription: z.string().optional(),
          })
          .refine(
            (data) => {
              if (data.businessType === "other") {
                return (
                  data.otherBusinessTypeDescription &&
                  data.otherBusinessTypeDescription.trim().length > 0
                );
              }
              return true;
            },
            {
              message: "Please specify the other business type",
              path: ["otherBusinessTypeDescription"],
            }
          )
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isSelfEmployed) {
      if (data.isSoleProprietorship === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sole proprietorship status is required",
          path: ["isSoleProprietorship"],
        });
      }
      if (!data.businessName || data.businessName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business name is required",
          path: ["businessName"],
        });
      }
      if (!data.businessTelephone || data.businessTelephone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business telephone is required",
          path: ["businessTelephone"],
        });
      }
      if (
        !data.employerIdentificationNumber ||
        data.employerIdentificationNumber.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employer identification number is required",
          path: ["employerIdentificationNumber"],
        });
      }
      if (!data.businessDescription || data.businessDescription.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business description is required",
          path: ["businessDescription"],
        });
      }
      if (data.totalEmployees === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total employees is required",
          path: ["totalEmployees"],
        });
      } else if (data.totalEmployees < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total employees cannot be negative",
          path: ["totalEmployees"],
        });
      }
      if (!data.taxDepositFrequency || data.taxDepositFrequency.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tax deposit frequency is required",
          path: ["taxDepositFrequency"],
        });
      }
      if (data.averageGrossMonthlyPayroll === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Average gross monthly payroll is required",
          path: ["averageGrossMonthlyPayroll"],
        });
      } else if (data.averageGrossMonthlyPayroll < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Average gross monthly payroll cannot be negative",
          path: ["averageGrossMonthlyPayroll"],
        });
      }
      if (data.hasOtherBusinessInterests === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Other business interests status is required",
          path: ["hasOtherBusinessInterests"],
        });
      }
    }
  });
