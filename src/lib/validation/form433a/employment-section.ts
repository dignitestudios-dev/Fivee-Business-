import z from "zod";

export const employmentInitialValues: EmploymentFromSchema = {
  maritalStatus: "unmarried",
  employerName: "",
  payPeriod: "weekly",
  employerAddress: "",
  hasOwnershipInterest: false,
  jobTitle: "",
  yearsWithEmployer: 0,
  monthsWithEmployer: 0,
  spouseEmployerName: "",
  spousePayPeriod: "weekly",
  spouseEmployerAddress: "",
  spouseHasOwnershipInterest: false,
  spouseJobTitle: "",
  spouseYearsWithEmployer: 0,
  spouseMonthsWithEmployer: 0,
};

/**
 * Main schema
 */
export const employmentSchema = z
  .object({
    maritalStatus: z.enum(["unmarried", "married"]),
    employerName: z.string().min(1, "Employer name is required"),
    payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]),
    employerAddress: z.string().min(1, "Employer address is required"),
    hasOwnershipInterest: z.boolean().default(false),
    jobTitle: z.string().min(1, "Occupation is required"),
    yearsWithEmployer: z.preprocess(
      (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
      z.number().int().min(0, "Years must be at least 0")
    ),
    monthsWithEmployer: z.preprocess(
      (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
      z.number().int().min(0, "Months must be at least 0").max(11, "Months must be 11 or less")
    ),
    spouseEmployerName: z.string().optional().nullable(),
    spousePayPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]).optional().nullable(),
    spouseEmployerAddress: z.string().optional().nullable(),
    spouseHasOwnershipInterest: z.boolean().optional().default(false),
    spouseJobTitle: z.string().optional().nullable(),
    spouseYearsWithEmployer: z.preprocess(
      (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined),
      z.number().int().min(0).optional()
    ),
    spouseMonthsWithEmployer: z.preprocess(
      (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined),
      z.number().int().min(0).max(11).optional()
    ),
  })
  .superRefine((data, ctx) => {
    // If married, spouse fields should be present
    if (data.maritalStatus === "married") {
      if (!data.spouseEmployerName || String(data.spouseEmployerName).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Spouse employer name is required when marital status is 'married'",
          path: ["spouseEmployerName"],
        });
      }
      if (!data.spousePayPeriod) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse pay period is required when marital status is 'married'",
          path: ["spousePayPeriod"],
        });
      }
      if (!data.spouseEmployerAddress || String(data.spouseEmployerAddress).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Spouse employer address is required when marital status is 'married'",
          path: ["spouseEmployerAddress"],
        });
      }
      if (!data.spouseJobTitle || String(data.spouseJobTitle).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Spouse occupation is required when marital status is 'married'",
          path: ["spouseJobTitle"],
        });
      }
      if (data.spouseYearsWithEmployer == null) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse years with employer is required when marital status is 'married'",
          path: ["spouseYearsWithEmployer"],
        });
      }
      if (data.spouseMonthsWithEmployer == null) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse months with employer is required when marital status is 'married'",
          path: ["spouseMonthsWithEmployer"],
        });
      }
    }
  });