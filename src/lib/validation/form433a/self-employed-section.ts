import z from "zod";
import {
  nameSchema,
  phoneSchema,
  phoneSchemaOptional,
  moneySchema,
  shortTextSchema,
} from "@/lib/validation-schemas";

// Initial values
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
  totalEmployees: 0, // numeric default
  taxDepositFrequency: "",
  averageGrossMonthlyPayroll: 0, // numeric default
  hasOtherBusinessInterests: false,
  otherBusinessInterests: [],
};

// Schema
export const selfEmployedSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    isSoleProprietorship: z.boolean().optional(),
    businessName: z.string().optional().or(z.literal("")),
    businessAddress: z.string().optional().or(z.literal("")),
    businessTelephone: z.string().optional().or(z.literal("")),
    employerIdentificationNumber: z
      .string()
      .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)")
      .optional()
      .or(z.literal("")),
    businessWebsite: z
      .string()
      .regex(
        /^(https?:\/\/).+/i,
        "Enter a valid URL starting with http:// or https://"
      )
      .optional()
      .or(z.literal("")),
    tradeName: z.string().optional().or(z.literal("")),
    businessDescription: z.string().optional().or(z.literal("")),
    totalEmployees: z.coerce.number().optional(),
    taxDepositFrequency: z.string().optional().or(z.literal("")),
    averageGrossMonthlyPayroll: z.coerce.number().optional(),
    hasOtherBusinessInterests: z.boolean().optional(),
    otherBusinessInterests: z
      .array(
        z
          .object({
            ownershipPercentage: z.coerce
              .number({ message: "Must be a number" })
              .min(0, "Percentage cannot be less than 0")
              .max(100, "Percentage cannot exceed 100"),
            title: z.string().optional().or(z.literal("")),
            businessAddress: z.string().min(1, "Business address is required"),
            businessName: z.string().min(1, "Business name is required"),
            businessTelephone: phoneSchema,
            employerIdentificationNumber: z
              .string()
              .min(1, "EIN is required")
              .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)"),
            businessType: z
              .enum(["partnership", "llc", "corporation", "other"])
              .optional(),
            otherBusinessTypeDescription: z
              .string()
              .optional()
              .or(z.literal("")),
          })
          .refine(
            (data) =>
              data.businessType !== "other" ||
              (data.otherBusinessTypeDescription &&
                data.otherBusinessTypeDescription.trim().length > 0),
            {
              message: "Please specify the other business type",
              path: ["otherBusinessTypeDescription"],
            }
          )
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isSelfEmployed) return; // skip validation if not self-employed

    // Helper to validate string fields
    const requiredStrings = [
      "businessName",
      "businessTelephone",
      "employerIdentificationNumber",
      "businessDescription",
      "taxDepositFrequency",
    ];
    requiredStrings.forEach((field) => {
      const value = data[field as keyof typeof data];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} is required`,
          path: [field],
        });
      }
    });

    // Boolean field
    if (data.isSoleProprietorship === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sole proprietorship status is required",
        path: ["isSoleProprietorship"],
      });
    }

    // Number fields
    if (data.totalEmployees === undefined || data.totalEmployees === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total employees is required",
        path: ["totalEmployees"],
      });
    }
    if (
      data.averageGrossMonthlyPayroll === undefined ||
      data.averageGrossMonthlyPayroll === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Average gross monthly payroll is required",
        path: ["averageGrossMonthlyPayroll"],
      });
    }

    // Other business interests
    if (data.hasOtherBusinessInterests === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Other business interests status is required",
        path: ["hasOtherBusinessInterests"],
      });
    }
  });
