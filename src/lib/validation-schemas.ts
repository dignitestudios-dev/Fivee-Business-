import { z } from "zod";

// US SSN regex
const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;

// US Date format validation
const dateSchema = z.string().refine((date) => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}, "Please enter a valid date");

// Personal Information Schema
export const personalInfoSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    dateOfBirth: dateSchema,
    ssn: z.string().regex(ssnRegex, "Please enter a valid SSN (XXX-XX-XXXX)"),
    maritalStatus: z.enum(["unmarried", "married"]),
    marriageDate: z.string().optional(),
    homeAddress: z.string().min(1, "Home address is required"),
    homeOwnership: z.enum(["own", "rent", "other"]),
    homeOwnershipOther: z.string().optional(),
    communityPropertyState: z.boolean(),
    county: z.string().min(1, "County is required"),
    primaryPhone: z
      .string()
      .regex(
        /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
        "Please enter a valid US phone number"
      ),
    secondaryPhone: z
      .string()
      .regex(
        /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
        "Please enter a valid US phone number"
      )
      .optional()
      .or(z.literal("")),
    faxNumber: z
      .string()
      .regex(
        /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
        "Please enter a valid US fax number"
      )
      .optional()
      .or(z.literal("")),
    mailingAddress: z.string().optional(),

    // Spouse fields (conditional)
    spouseFirstName: z.string().optional(),
    spouseLastName: z.string().optional(),
    spouseDateOfBirth: z.string().optional(),
    spouseSSN: z.string().optional(),
    spouseEmployerName: z.string().optional(),
    spousePayPeriod: z
      .enum(["weekly", "bi-weekly", "monthly", "other"])
      .optional(),
    spouseEmployerAddress: z.string().optional(),
    spouseOwnershipInterest: z.boolean().optional(),
    spouseOccupation: z.string().optional(),
    spouseEmploymentYears: z.string().optional(),
    spouseEmploymentMonths: z.string().optional(),
  })
  .refine(
    (data) => {
      // If married, spouse fields are required
      if (data.maritalStatus === "married") {
        return (
          data.spouseFirstName &&
          data.spouseLastName &&
          data.spouseDateOfBirth &&
          data.spouseSSN &&
          data.marriageDate &&
          data.spouseEmployerName &&
          data.spouseEmployerAddress &&
          data.spouseOccupation &&
          data.spouseEmploymentYears &&
          data.spouseEmploymentMonths
        );
      }
      return true;
    },
    {
      message: "Spouse information is required when married",
      path: ["spouseFirstName"],
    }
  )
  .refine(
    (data) => {
      // If homeOwnership is "other", homeOwnershipOther is required
      if (data.homeOwnership === "other") {
        return data.homeOwnershipOther && data.homeOwnershipOther.length > 0;
      }
      return true;
    },
    {
      message: "Please specify other home ownership type",
      path: ["homeOwnershipOther"],
    }
  );

// Employment Information Schema
export const employmentSchema = z
  .object({
    employerName: z.string().min(1, "Employer name is required"),
    payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]),
    employerAddress: z.string().min(1, "Employer address is required"),
    ownershipInterest: z.boolean(),
    occupation: z.string().min(1, "Occupation is required"),
    employmentYears: z.coerce.number().min(0, "Years must be 0 or greater"),
    employmentMonths: z.coerce
      .number()
      .min(0, "Months must be 0 or greater")
      .max(11, "Months must be 11 or less"),
    maritalStatus: z.enum(["unmarried", "married"]),

    // Spouse employment fields
    spouseEmployerName: z.string().optional(),
    spousePayPeriod: z
      .enum(["weekly", "bi-weekly", "monthly", "other"])
      .optional(),
    spouseEmployerAddress: z.string().optional(),
    spouseOwnershipInterest: z.boolean().optional(),
    spouseOccupation: z.string().optional(),
    spouseEmploymentYears: z.coerce.number().optional(),
    spouseEmploymentMonths: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      // If married, spouse employment fields are required
      if (data.maritalStatus === "married") {
        return (
          data.spouseEmployerName &&
          data.spouseEmployerAddress &&
          data.spouseOccupation &&
          data.spouseEmploymentYears !== undefined &&
          data.spouseEmploymentMonths !== undefined
        );
      }
      return true;
    },
    {
      message: "Spouse employment information is required when married",
      path: ["spouseEmployerName"],
    }
  );

// Personal Assets Schema (simplified for now)
export const personalAssetsSchema = z.object({
  // This will be expanded based on the complex asset structure
  assetsCompleted: z
    .boolean()
    .refine((val) => val === true, "Please complete all asset information"),
});

// Self-Employed Schema
export const selfEmployedSchema = z
  .object({
    isSoleProprietorship: z.boolean({
      error: (issue) => {
        if (issue.input === undefined) {
          return "Please select if your business is a sole proprietorship";
        }
        return "Must be a boolean value";
      },
    }),
    businessName: z.string().min(1, "Business name is required"),
    businessAddress: z.string().optional(),
    businessTelephone: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
            val
          ),
        "Please enter a valid US phone number"
      ),
    ein: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{2}-?\d{7}$/.test(val),
        "Please enter a valid EIN (XX-XXXXXXX)"
      ),
    businessWebsite: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(val),
        "Please enter a valid URL"
      ),
    tradeName: z.string().optional(),
    businessDescription: z
      .string()
      .min(1, "Description of business is required"),
    totalEmployees: z.coerce
      .number()
      .min(0, "Total employees must be 0 or greater")
      .optional(),
    taxDepositFrequency: z.string().optional(),
    avgGrossMonthlyPayroll: z.coerce
      .number()
      .min(0, "Average payroll must be 0 or greater")
      .optional(),
    hasOtherBusinessInterests: z.boolean(),
    otherBusinesses: z
      .array(
        z.object({
          percentageOwnership: z.coerce
            .number()
            .min(0, "Percentage must be at least 0")
            .max(100, "Percentage must be at most 100"),
          title: z.string().min(1, "Title is required"),
          businessAddress: z.string().min(1, "Business address is required"),
          businessName: z.string().min(1, "Business name is required"),
          businessTelephone: z
            .string()
            .regex(
              /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
              "Please enter a valid US phone number"
            ),
          ein: z
            .string()
            .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)"),
          businessType: z.enum(["partnership", "llc", "corporation", "other"], {
            message: "Type of business is required",
          }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.hasOtherBusinessInterests) {
        return data.otherBusinesses && data.otherBusinesses.length > 0;
      }
      return true;
    },
    {
      message: "Please add at least one other business interest if applicable",
      path: ["otherBusinesses"],
    }
  );

// Business Assets Schema
export const businessAssetsSchema = z.object({
  businessAssetsCompleted: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please complete all business asset information"
    ),
});

// Business Income Schema
export const businessIncomeSchema = z.object({
  businessIncomeCompleted: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please complete all business income information"
    ),
});

// Household Income Schema
export const householdIncomeSchema = z.object({
  householdIncomeCompleted: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please complete all household income information"
    ),
});

// Calculation Schema
export const calculationSchema = z.object({
  calculationCompleted: z
    .boolean()
    .refine((val) => val === true, "Please complete all calculations"),
});

// Other Information Schema
export const otherInfoSchema = z.object({
  otherInfoCompleted: z
    .boolean()
    .refine((val) => val === true, "Please complete all other information"),
});

// Signature Schema
export const signatureSchema = z
  .object({
    taxpayerSignature: z.string().optional(),
    taxpayerSignatureDate: z.string().optional(),
    spouseSignature: z.string().optional(),
    spouseSignatureDate: z.string().optional(),
    maritalStatus: z.enum(["unmarried", "married"]),
  })
  .refine(
    (data) => {
      // If married, spouse signature is required
      if (data.maritalStatus === "married") {
        return data.spouseSignature && data.spouseSignatureDate;
      }
      return true;
    },
    {
      message: "Spouse signature is required when married",
      path: ["spouseSignature"],
    }
  );

// Combined schema for all sections
export const formSchemas = {
  1: personalInfoSchema,
  2: employmentSchema,
  3: personalAssetsSchema,
  4: selfEmployedSchema,
  5: businessAssetsSchema,
  6: businessIncomeSchema,
  7: householdIncomeSchema,
  8: calculationSchema,
  9: otherInfoSchema,
  10: signatureSchema,
};

export type FormSchemas = typeof formSchemas;
export type SectionNumber = keyof FormSchemas;

export const completeFormSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  dateOfBirth: dateSchema,
  ssn: z.string().regex(ssnRegex, "Please enter a valid SSN (XXX-XX-XXXX)"),
  maritalStatus: z.enum(["unmarried", "married"]),
  marriageDate: z.string().optional(),
  homeAddress: z.string().min(1, "Home address is required"),
  homeOwnership: z.enum(["own", "rent", "other"]),
  homeOwnershipOther: z.string().optional(),
  communityPropertyState: z.boolean(),
  county: z.string().min(1, "County is required"),
  primaryPhone: z
    .string()
    .regex(
      /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Please enter a valid US phone number"
    ),
  secondaryPhone: z
    .string()
    .regex(
      /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Please enter a valid US phone number"
    )
    .optional()
    .or(z.literal("")),
  faxNumber: z
    .string()
    .regex(
      /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Please enter a valid US fax number"
    )
    .optional()
    .or(z.literal("")),
  mailingAddress: z.string().optional(),

  // Spouse fields
  spouseFirstName: z.string().optional(),
  spouseLastName: z.string().optional(),
  spouseDateOfBirth: z.string().optional(),
  spouseSSN: z.string().optional(),
  spouseEmployerName: z.string().optional(),
  spousePayPeriod: z
    .enum(["weekly", "bi-weekly", "monthly", "other"])
    .optional(),
  spouseEmployerAddress: z.string().optional(),
  spouseOwnershipInterest: z.boolean().optional(),
  spouseOccupation: z.string().optional(),
  spouseEmploymentYears: z.coerce.number().optional(),
  spouseEmploymentMonths: z.coerce.number().optional(),

  // Household members
  householdMembers: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        age: z
          .string()
          .min(1, "Age is required")
          .regex(/^\d+$/, "Age must be a number"),
        relationship: z.string().min(1, "Relationship is required"),
        claimedAsDependent: z.boolean(),
        contributesToIncome: z.boolean(),
      })
    )
    .optional(),

  // Employment Information
  employerName: z.string().min(1, "Employer name is required"),
  payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]),
  employerAddress: z.string().min(1, "Employer address is required"),
  ownershipInterest: z.boolean(),
  occupation: z.string().min(1, "Occupation is required"),
  employmentYears: z.coerce.number().min(0, "Years must be 0 or greater"),
  employmentMonths: z.coerce
    .number()
    .min(0, "Months must be 0 or greater")
    .max(11, "Months must be 11 or less"),

  // Placeholder fields for other sections
  assetsCompleted: z.boolean().optional(),
  businessAssetsCompleted: z.boolean().optional(),
  businessIncomeCompleted: z.boolean().optional(),
  householdIncomeCompleted: z.boolean().optional(),
  calculationCompleted: z.boolean().optional(),
  otherInfoCompleted: z.boolean().optional(),

  // Signature fields
  taxpayerSignature: z.string().optional(),
  taxpayerSignatureDate: z.string().optional(),
  spouseSignature: z.string().optional(),
  spouseSignatureDate: z.string().optional(),
});

export const validateSection = (sectionNumber: number, data: any): boolean => {
  try {
    switch (sectionNumber) {
      case 1:
        personalInfoSchema.parse(data);
        return true;
      case 2:
        // Include maritalStatus for employment validation
        employmentSchema.parse({ ...data, maritalStatus: data.maritalStatus });
        return true;
      case 3:
        return data.assetsCompleted === true;
      case 4:
        return true; // Placeholder
      case 5:
        return data.businessAssetsCompleted === true;
      case 6:
        return data.businessIncomeCompleted === true;
      case 7:
        return data.householdIncomeCompleted === true;
      case 8:
        return data.calculationCompleted === true;
      case 9:
        return data.otherInfoCompleted === true;
      case 10:
        signatureSchema.parse({ ...data, maritalStatus: data.maritalStatus });
        return true;
      default:
        return false;
    }
  } catch (error) {
    console.log("[v0] Validation errors:", error);
    return false;
  }
};
