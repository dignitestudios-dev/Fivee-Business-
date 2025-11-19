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

// Helper function to calculate age from date string
const calculateAge = (dateString: string): number => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

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

// Enhanced date validation with minimum age requirement
const dateWithMinAge = (minAge: number = 18) =>
  z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = new Date(val);
        if (isNaN(parsed.getTime())) return val;
        return parsed.toISOString().split("T")[0];
      }
      if (val instanceof Date) {
        return val.toISOString().split("T")[0];
      }
      return val;
    },
    z
      .string()
      .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
        message: "Please enter a valid date in YYYY-MM-DD format",
      })
      .refine(
        (date) => {
          const age = calculateAge(date);
          return age >= minAge;
        },
        {
          message: `Must be at least ${minAge} years old`,
        }
      )
      .refine(
        (date) => {
          // Additional check to ensure date is not in the future
          const birthDate = new Date(date);
          const today = new Date();
          return birthDate <= today;
        },
        {
          message: "Date of birth cannot be in the future",
        }
      )
  );

/**
 * Household member schema
 */
const householdMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name cannot exceed 20 characters")
    .refine((value) => !/\d/.test(value), {
      message: "Name cannot contain numbers",
    })
    .refine((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Name cannot contain special characters",
    })
    .refine((value) => /[A-Za-zÀ-ÿ]/.test(value), {
      message: "Name must contain at least one letter",
    }),
  // Some forms submit numbers as strings — coerce to number and validate
  age: z.preprocess((v) => {
    if (typeof v === "string" && v.trim() !== "") return Number(v);
    return v;
  }, z.number({ message: "Must be a number" }).min(1, { message: "Age is required" }).int().nonnegative("Age must be >= 0")),
  relationship: z.string().min(1, "Relationship is required"),
  claimedAsDependent: z.boolean().optional().default(false),
  contributesToIncome: z.boolean().optional().default(false),
});

/**
 * Main schema
 */
export const personalInfoSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name cannot exceed 20 characters")
      .refine((value) => !/\d/.test(value), {
        message: "First name cannot contain numbers",
      })
      .refine((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "First name cannot contain special characters",
      })
      .refine((value) => /[A-Za-zÀ-ÿ]/.test(value), {
        message: "First name must contain at least one letter",
      }),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(20, "Last name cannot exceed 20 characters")
      .refine((value) => !/\d/.test(value), {
        message: "Last name cannot contain numbers",
      })
      .refine((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "Last name cannot contain special characters",
      })
      .refine((value) => /[A-Za-zÀ-ÿ]/.test(value), {
        message: "Last name must contain at least one letter",
      }),
    dob: dateWithMinAge(18), // Updated to use the enhanced validator
    ssnOrItin: z
      .string()
      .min(1, "SSN/ITIN is required")
      .regex(ssnRegex, "SSN must be in the format XXX-XX-XXXX"),
    maritalStatus: z.enum(["unmarried", "married"]),
    dateOfMarriage: z
      .union([dateStringToDate, z.string().optional()])
      .optional(),
    homeAddress: z
      .string()
      .min(1, "Home address is required")
      .max(200, "Home address cannot exceed 200 characters"),
    mailingAddress: z
      .string()
      .max(200, "Mailing address cannot exceed 200 characters")
      .optional()
      .nullable(),
    countyOfResidence: z
      .string()
      .min(1, "County of residence is required")
      .max(50, "County of residence cannot exceed 50 characters"),
    primaryPhone: z
      .string()
      .min(1, "Primary phone is required")
      .max(25, "Primary phone cannot exceed 25 characters")
      .regex(phoneLooseRegex, "Invalid phone number"),
    secondaryPhone: z
      .string()
      .max(25, "Secondary phone cannot exceed 25 characters")
      .optional()
      .nullable()
      .refine((v) => !v || phoneLooseRegex.test(v), {
        message: "Invalid phone number",
      }),
    faxNumber: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          if (!/^[\+]?[0-9\s\-\(\)\.\/]{6,20}$/.test(val)) {
            return false;
          }
          const digitCount = val.replace(/\D/g, "").length;
          return digitCount >= 6 && digitCount <= 20;
        },
        {
          message:
            "Fax number must contain only numbers, spaces, hyphens, parentheses, dots, slashes and have 6-20 digits",
        }
      ),
    housingStatus: z.enum(["own", "rent", "other"]),
    livedInCommunityPropertyStateInLast10Years: z
      .boolean()
      .optional()
      .default(false),
    housingOtherDetails: z
      .string()
      .max(500, "Housing details cannot exceed 500 characters")
      .optional()
      .nullable(),
    spouseFirstName: z
      .string()
      .max(20, "Spouse first name cannot exceed 20 characters")
      .optional()
      .nullable()
      .refine(
        (v) =>
          !v ||
          (v.trim().length >= 2 &&
            !/\d/.test(v) &&
            !/[!@#$%^&*(),.?":{}|<>]/.test(v)),
        {
          message:
            "Spouse first name must be 2-20 characters and cannot contain numbers or special characters",
        }
      ),
    spouseLastName: z
      .string()
      .max(20, "Spouse last name cannot exceed 20 characters")
      .optional()
      .nullable()
      .refine(
        (v) =>
          !v ||
          (v.trim().length >= 2 &&
            !/\d/.test(v) &&
            !/[!@#$%^&*(),.?":{}|<>]/.test(v)),
        {
          message:
            "Spouse last name must be 2-20 characters and cannot contain numbers or special characters",
        }
      ),
    spouseDOB: z.union([dateWithMinAge(18), z.string().optional()]).optional(), // Updated to use the enhanced validator
    spouseSSN: z
      .string()
      .optional()
      .nullable()
      .refine((v) => !v || ssnRegex.test(String(v)), {
        message: "Spouse SSN must be in the format XXX-XX-XXXX",
      }),
    householdMembers: z.array(householdMemberSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    // If married, spouse fields and dateOfMarriage should be present
    if (data.maritalStatus === "married") {
      if (!data.dateOfMarriage) {
        ctx.addIssue({
          code: "custom",
          message: "Date of marriage is required",
          path: ["dateOfMarriage"],
        });
      }
      if (!data.spouseFirstName || String(data.spouseFirstName).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Spouse first name is required",
          path: ["spouseFirstName"],
        });
      }
      if (!data.spouseLastName || String(data.spouseLastName).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Spouse last name is required",
          path: ["spouseLastName"],
        });
      }
      if (!data.spouseDOB) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse date of birth is required",
          path: ["spouseDOB"],
        });
      } else {
        // Additional age validation for spouse in superRefine for more specific error handling
        const spouseAge = calculateAge(data.spouseDOB);
        if (spouseAge < 18) {
          ctx.addIssue({
            code: "custom",
            message: "Spouse must be at least 18 years old",
            path: ["spouseDOB"],
          });
        }
      }
      if (!data.spouseSSN) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse SSN is required",
          path: ["spouseSSN"],
        });
      }
      if (data.spouseSSN && !ssnRegex.test(String(data.spouseSSN))) {
        ctx.addIssue({
          code: "custom",
          message: "Spouse SSN must be in the format XXX-XX-XXXX",
          path: ["spouseSSN"],
        });
      }

      // Additional validation: Marriage date should be after both birthdays
      if (data.dob && data.spouseDOB && data.dateOfMarriage) {
        const userDOB = new Date(data.dob);
        const spouseDOB = new Date(data.spouseDOB);
        const marriageDate = new Date(data.dateOfMarriage);

        if (marriageDate < userDOB) {
          ctx.addIssue({
            code: "custom",
            message: "Marriage date cannot be before your date of birth",
            path: ["dateOfMarriage"],
          });
        }

        if (marriageDate < spouseDOB) {
          ctx.addIssue({
            code: "custom",
            message: "Marriage date cannot be before spouse's date of birth",
            path: ["dateOfMarriage"],
          });
        }
      }
    }

    // Additional age validation for primary person in superRefine
    if (data.dob) {
      const userAge = calculateAge(data.dob);
      if (userAge < 18) {
        ctx.addIssue({
          code: "custom",
          message: "You must be at least 18 years old",
          path: ["dob"],
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
          message: "Please specify other housing details",
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
