import { makeStore } from "@/lib/store";
import z from "zod";

export const employmentInitialValues: EmploymentFromSchema = {
  employerName: "",
  payPeriod: "weekly",
  employerAddress: "",
  hasOwnershipInterest: false,
  jobTitle: "",
  yearsWithEmployer: "",
  monthsWithEmployer: "",
  spouseEmployerName: "",
  spousePayPeriod: "weekly",
  spouseEmployerAddress: "",
  spouseHasOwnershipInterest: false,
  spouseJobTitle: "",
  spouseYearsWithEmployer: "",
  spouseMonthsWithEmployer: "",
};

export const employmentSchema = (maritalStatus: MaritalStatus) =>
  z
    .object({
      employerName: z.string()
        .min(1, "Employer name is required")
        .min(2, "Employer name must be at least 2 characters")
        .max(20, "Employer name cannot exceed 20 characters")
        .refine((value) => !/\d/.test(value), {
          message: "Employer name cannot contain numbers"
        })
        .refine((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: "Employer name cannot contain special characters"
        })
        .refine((value) => /[A-Za-zÀ-ÿ]/.test(value), {
          message: "Employer name must contain at least one letter"
        }),
      payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]),
      employerAddress: z.string().min(1, "Employer address is required"),
      hasOwnershipInterest: z.boolean().default(false),
      jobTitle: z.string().min(1, "Occupation is required"),
      yearsWithEmployer: z.preprocess(
        (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
        z.number()
          .int("Must be a whole number")
          .min(0, "Years must be at least 0")
          .max(99, "Years cannot be 100 or more")
      ),
      monthsWithEmployer: z.preprocess(
        (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
        z
          .number()
          .int()
          .min(0, "Months must be at least 0")
          .max(11, "Months must be 11 or less")
      ),

      // spouse fields
      spouseEmployerName: z.string().optional().nullable(),
      spousePayPeriod: z
        .enum(["weekly", "bi-weekly", "monthly", "other"])
        .optional()
        .nullable(),
      spouseEmployerAddress: z.string().optional().nullable(),
      spouseHasOwnershipInterest: z.boolean().optional().default(false),
      spouseJobTitle: z.string().optional().nullable(),
      spouseYearsWithEmployer: z.preprocess((v) => {
        if (v === "" || v === null || v === undefined) return undefined;
        if (typeof v === "string") return Number(v);
        return v;
      }, z.number().int().min(0, "Years must be at least 0").optional().nullable()),
      spouseMonthsWithEmployer: z.preprocess((v) => {
        if (v === "" || v === null || v === undefined) return undefined;
        if (typeof v === "string") return Number(v);
        return v;
      }, z.number().int().min(0, "Months must be at least 0").max(11, "Months must be 11 or less").optional().nullable()),
    })
    .superRefine((data, ctx) => {
      if (maritalStatus === "married") {
        // ✅ Spouse employer name
        if (
          !data.spouseEmployerName ||
          String(data.spouseEmployerName).trim() === ""
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Spouse employer name is required",
            path: ["spouseEmployerName"],
          });
        }

        // ✅ Spouse pay period
        if (!data.spousePayPeriod) {
          ctx.addIssue({
            code: "custom",
            message: "Spouse pay period is required",
            path: ["spousePayPeriod"],
          });
        }

        // ✅ Spouse employer address
        if (
          !data.spouseEmployerAddress ||
          String(data.spouseEmployerAddress).trim() === ""
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Spouse employer address is required",
            path: ["spouseEmployerAddress"],
          });
        }

        // ✅ Spouse job title
        if (!data.spouseJobTitle || String(data.spouseJobTitle).trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Spouse occupation is required",
            path: ["spouseJobTitle"],
          });
        }

        // ✅ Years with spouse employer
        if (
          data.spouseYearsWithEmployer === undefined ||
          data.spouseYearsWithEmployer === null
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Years with employer is required",
            path: ["spouseYearsWithEmployer"],
          });
        }

        // ✅ Months with spouse employer
        if (
          data.spouseMonthsWithEmployer === undefined ||
          data.spouseMonthsWithEmployer === null
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Years with employer is required",
            path: ["spouseMonthsWithEmployer"],
          });
        }
      }
    });
