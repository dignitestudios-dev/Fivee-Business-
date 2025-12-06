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

// Helper function to check if any employment field is filled
const hasAnyEmploymentField = (data: any): boolean => {
  return !!(
    (data.employerName && String(data.employerName).trim() !== "") ||
    (data.employerAddress && String(data.employerAddress).trim() !== "") ||
    (data.jobTitle && String(data.jobTitle).trim() !== "") ||
    (data.yearsWithEmployer !== undefined && data.yearsWithEmployer !== null && data.yearsWithEmployer !== "") ||
    (data.monthsWithEmployer !== undefined && data.monthsWithEmployer !== null && data.monthsWithEmployer !== "")
  );
};

// Helper function to check if any spouse employment field is filled
const hasAnySpouseEmploymentField = (data: any): boolean => {
  return !!(
    (data.spouseEmployerName && String(data.spouseEmployerName).trim() !== "") ||
    (data.spouseEmployerAddress && String(data.spouseEmployerAddress).trim() !== "") ||
    (data.spouseJobTitle && String(data.spouseJobTitle).trim() !== "") ||
    (data.spouseYearsWithEmployer !== undefined && data.spouseYearsWithEmployer !== null && data.spouseYearsWithEmployer !== "") ||
    (data.spouseMonthsWithEmployer !== undefined && data.spouseMonthsWithEmployer !== null && data.spouseMonthsWithEmployer !== "")
  );
};

export const employmentSchema = (maritalStatus: MaritalStatus) =>
  z
    .object({
      employerName: z.string()
        .optional()
        .refine((value) => !value || !/\d/.test(value), {
          message: "Employer name cannot contain numbers"
        })
        .refine((value) => !value || !/[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: "Employer name cannot contain special characters"
        })
        .refine((value) => !value || /[A-Za-zÀ-ÿ]/.test(value), {
          message: "Employer name must contain at least one letter"
        }),
      payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]).optional(),
      employerAddress: z.string().optional(),
      hasOwnershipInterest: z.boolean().default(false),
      jobTitle: z.string().optional(),
      yearsWithEmployer: z.preprocess(
        (v) => {
          // Keep string values as-is for the form
          if (typeof v === "string") return v;
          if (v === 0 || v === "0") return "0";
          return v;
        },
        z.string().regex(/^\d*$/, "Must be a number").optional()
      ),
      monthsWithEmployer: z.preprocess(
        (v) => {
          // Keep string values as-is for the form
          if (typeof v === "string") return v;
          if (v === 0 || v === "0") return "0";
          return v;
        },
        z.string().regex(/^\d*$/, "Must be a number").optional()
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
        // Keep string values as-is for the form
        if (typeof v === "string") return v;
        if (v === 0 || v === "0") return "0";
        if (v === "" || v === null || v === undefined) return "";
        return v;
      }, z.string().regex(/^\d*$/, "Must be a number").optional().nullable()),
      spouseMonthsWithEmployer: z.preprocess((v) => {
        // Keep string values as-is for the form
        if (typeof v === "string") return v;
        if (v === 0 || v === "0") return "0";
        if (v === "" || v === null || v === undefined) return "";
        return v;
      }, z.string().regex(/^\d*$/, "Must be a number").optional().nullable()),
    })
    .superRefine((data, ctx) => {
      // YOUR EMPLOYMENT SECTION - Conditional validation
      const hasAnyYourField = hasAnyEmploymentField(data);

      // Only validate if ownership interest is true AND any field is filled
      if (data.hasOwnershipInterest && hasAnyYourField) {
        // If any field is filled, all fields become required
        if (!data.employerName || String(data.employerName).trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Employer name is required",
            path: ["employerName"],
          });
        }

        if (!data.payPeriod) {
          ctx.addIssue({
            code: "custom",
            message: "Pay period is required",
            path: ["payPeriod"],
          });
        }

        if (!data.employerAddress || String(data.employerAddress).trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Employer address is required",
            path: ["employerAddress"],
          });
        }

        if (!data.jobTitle || String(data.jobTitle).trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Occupation is required",
            path: ["jobTitle"],
          });
        }

        if (data.yearsWithEmployer === undefined || data.yearsWithEmployer === null) {
          ctx.addIssue({
            code: "custom",
            message: "Years with employer is required",
            path: ["yearsWithEmployer"],
          });
        } else if (data.yearsWithEmployer !== "") {
          const yearsNum = Number(data.yearsWithEmployer);
          if (isNaN(yearsNum) || yearsNum < 0 || yearsNum > 99) {
            ctx.addIssue({
              code: "custom",
              message: "Years must be between 0 and 99",
              path: ["yearsWithEmployer"],
            });
          }
        }

        if (data.monthsWithEmployer === undefined || data.monthsWithEmployer === null) {
          ctx.addIssue({
            code: "custom",
            message: "Months with employer is required",
            path: ["monthsWithEmployer"],
          });
        } else if (data.monthsWithEmployer !== "") {
          const monthsNum = Number(data.monthsWithEmployer);
          if (isNaN(monthsNum) || monthsNum < 0 || monthsNum > 11) {
            ctx.addIssue({
              code: "custom",
              message: "Months must be between 0 and 11",
              path: ["monthsWithEmployer"],
            });
          }
        }
      }

      // SPOUSE EMPLOYMENT SECTION - Conditional validation
      if (maritalStatus === "married") {
        const hasAnySpouseField = hasAnySpouseEmploymentField(data);

        // Only validate if spouse ownership interest is true AND any field is filled
        if (data.spouseHasOwnershipInterest && hasAnySpouseField) {
          // If any field is filled, all fields become required
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

          if (!data.spousePayPeriod) {
            ctx.addIssue({
              code: "custom",
              message: "Spouse pay period is required",
              path: ["spousePayPeriod"],
            });
          }

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

          if (!data.spouseJobTitle || String(data.spouseJobTitle).trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Spouse occupation is required",
              path: ["spouseJobTitle"],
            });
          }

          if (
            data.spouseYearsWithEmployer === undefined ||
            data.spouseYearsWithEmployer === null
          ) {
            ctx.addIssue({
              code: "custom",
              message: "Years with employer is required",
              path: ["spouseYearsWithEmployer"],
            });
          } else if (data.spouseYearsWithEmployer !== "") {
            const yearsNum = Number(data.spouseYearsWithEmployer);
            if (isNaN(yearsNum) || yearsNum < 0) {
              ctx.addIssue({
                code: "custom",
                message: "Years must be at least 0",
                path: ["spouseYearsWithEmployer"],
              });
            }
          }

          if (
            data.spouseMonthsWithEmployer === undefined ||
            data.spouseMonthsWithEmployer === null
          ) {
            ctx.addIssue({
              code: "custom",
              message: "Months with employer is required",
              path: ["spouseMonthsWithEmployer"],
            });
          } else if (data.spouseMonthsWithEmployer !== "") {
            const monthsNum = Number(data.spouseMonthsWithEmployer);
            if (isNaN(monthsNum) || monthsNum < 0 || monthsNum > 11) {
              ctx.addIssue({
                code: "custom",
                message: "Months must be between 0 and 11",
                path: ["spouseMonthsWithEmployer"],
              });
            }
          }
        }
      }
    });
