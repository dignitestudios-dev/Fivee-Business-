import z from "zod";
import {
  nameSchema,
  phoneSchemaOptional,
  moneySchema,
  shortTextSchema,
} from "@/lib/validation-schemas";

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
  totalEmployees: "",
  taxDepositFrequency: "",
  averageGrossMonthlyPayroll: "",
  hasOtherBusinessInterests: false,
  otherBusinessInterests: [],
};

export const selfEmployedSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    isSoleProprietorship: z.boolean().optional(),
    businessName: nameSchema.optional(),
    businessAddress: shortTextSchema.optional(),
    businessTelephone: phoneSchemaOptional,
    employerIdentificationNumber: z
      .string()
      .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)")
      .optional()
      .or(z.literal("")),
    businessWebsite: z
      .string()
      .regex(/^(https?:\/\/).+/i, "Enter a valid URL beginning with http:// or https://")
      .optional()
      .or(z.literal("")),
    tradeName: nameSchema.optional(),
    businessDescription: z.string().min(1, "Business description is required").max(1000, "Business description must be at most 1000 characters").optional(),
    totalEmployees: z.coerce.number().min(0, "Must be 0 or greater").max(1000000, "Total employees seems too large").optional(),
    taxDepositFrequency: shortTextSchema.optional(),
    averageGrossMonthlyPayroll: moneySchema.optional(),
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
            businessAddress: shortTextSchema.min(1, "Business address is required"),
            businessName: nameSchema.min(1, "Business name is required"),
            businessTelephone: phoneSchemaOptional,
            employerIdentificationNumber: z
              .string()
              .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)")
              .optional()
              .or(z.literal("")),
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
