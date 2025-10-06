import z from "zod";

export const personalInfoInitialValues: PersonalInfoFromSchema = {
  firstName: "",
  lastName: "",
  dob: "",
  ssnOrItin: "",
  maritalStatus: "unmarried",
  homeAddress: "",
  mailingAddress: "",
  countyOfResidence: "",
  primaryPhone: "",
  secondaryPhone: "",
  faxNumber: "",
  housingStatus: "own",
  livedInCommunityPropertyStateInLast10Years: false,
  housingOtherDetails: "",
  spouseFirstName: "",
  spouseLastName: "",
  spouseDOB: "",
  spouseSSN: "",
  dateOfMarriage: "",
  householdMembers: [],
};

// Personal Information Schema
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/; // permissive US-style phone

// Accepts a string date (like "2025-10-06" or "10/06/2025")
// Converts to "YYYY-MM-DD" format. If invalid, returns original so zod can throw an error.
const dateStringToDate = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const parsed = new Date(val);
      if (isNaN(parsed.getTime())) return val; // let z.date() handle the error
      return parsed.toISOString().split("T")[0]; // 👈 return "YYYY-MM-DD"
    }

    if (val instanceof Date) {
      return val.toISOString().split("T")[0]; // handle actual Date objects too
    }

    return val;
  },
  z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Please enter a valid date in YYYY-MM-DD format",
  })
);

/**
 * Household member schema
 */
const householdMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Some forms submit numbers as strings — coerce to number and validate
  age: z.preprocess((v) => {
    if (typeof v === "string" && v.trim() !== "") return Number(v);
    return v;
  }, z.number().min(1, { message: "Age is required" }).int().nonnegative("Age must be >= 0")),
  relationship: z.string().min(1, "Relationship is required"),
  claimedAsDependent: z.boolean().optional().default(false),
  contributesToIncome: z.boolean().optional().default(false),
});

/**
 * Main schema
 */
export const personalInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: dateStringToDate,
    ssnOrItin: z
      .string()
      .min(1, "SSN/ITIN is required")
      .regex(ssnRegex, "SSN must be in the format XXX-XX-XXXX"),
    maritalStatus: z.enum(["unmarried", "married"]),
    dateOfMarriage: z
      .union([dateStringToDate, z.string().optional()])
      .optional(),
    homeAddress: z.string().min(1, "Home address is required"),
    mailingAddress: z.string().optional().nullable(),
    countyOfResidence: z.string().min(1, "County of residence is required"),
    primaryPhone: z
      .string()
      .min(1, "Primary phone is required")
      .regex(phoneLooseRegex, "Invalid phone number"),
    secondaryPhone: z
      .string()
      .regex(phoneLooseRegex, { message: "Invalid phone number" })
      .optional()
      .nullable()
      .or(z.literal(""))
      .optional(),
    faxNumber: z.string().optional().nullable(),
    housingStatus: z.enum(["own", "rent", "other"]),
    livedInCommunityPropertyStateInLast10Years: z
      .boolean()
      .optional()
      .default(false),
    housingOtherDetails: z.string().optional().nullable(),
    spouseFirstName: z.string().optional().nullable(),
    spouseLastName: z.string().optional().nullable(),
    spouseDOB: z.union([dateStringToDate, z.string().optional()]).optional(),
    spouseSSN: z.string().optional().nullable(),
    householdMembers: z.array(householdMemberSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    // If married, spouse fields and dateOfMarriage should be present
    if (data.maritalStatus === "married") {
      if (!data.dateOfMarriage) {
        ctx.addIssue({
          code: "custom",
          message:
            "Date of marriage is required when marital status is 'married'",
          path: ["dateOfMarriage"],
        });
      }
      if (!data.spouseFirstName || String(data.spouseFirstName).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message:
            "Spouse first name is required when marital status is 'married'",
          path: ["spouseFirstName"],
        });
      }
      if (!data.spouseLastName || String(data.spouseLastName).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message:
            "Spouse last name is required when marital status is 'married'",
          path: ["spouseLastName"],
        });
      }
      if (!data.spouseDOB) {
        ctx.addIssue({
          code: "custom",
          message:
            "Spouse date of birth is required when marital status is 'married'",
          path: ["spouseDOB"],
        });
      }
      // spouseSSN: optional but if present, validate format
      if (data.spouseSSN && !ssnRegex.test(String(data.spouseSSN))) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse SSN must be in the format XXX-XX-XXXX",
          path: ["spouseSSN"],
        });
      }
    }

    // If housingStatus === "other", housingOtherDetails must be present and non-empty
    if (data.housingStatus === "other") {
      if (
        !data.housingOtherDetails ||
        String(data.housingOtherDetails).trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Please specify other housing details when 'Other' is selected",
          path: ["housingOtherDetails"],
        });
      }
    }

    // Validate household members uniqueness / sensible ages (example check)
    if (Array.isArray(data.householdMembers)) {
      data.householdMembers.forEach((m, i) => {
        if (typeof m.age === "number" && (m.age < 0 || m.age > 150)) {
          ctx.addIssue({
            code: "custom",
            message: "Age looks invalid",
            path: ["householdMembers", i, "age"],
          });
        }
      });
    }
  });
