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

// Personal Assets Schema
export const personalAssetsSchema = z.object({
  bankAccounts: z
    .array(
      z.object({
        accountType: z.string().min(1, "Account type is required"),
        bankName: z
          .string()
          .min(1, "Bank name and country location is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        balance: z.coerce.number().min(0, "Balance cannot be negative"),
      })
    )
    .optional(),
  investments: z
    .array(
      z.object({
        type: z.string().min(1, "Investment type is required"),
        institutionName: z
          .string()
          .min(
            1,
            "Name of financial institution and country location is required"
          ),
        accountNumber: z.string().min(1, "Account number is required"),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  digitalAssets: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, "Description of digital asset is required"),
        units: z.coerce.number().min(0, "Number of units cannot be negative"),
        location: z.string().min(1, "Location of digital asset is required"),
        accountOrAddress: z
          .string()
          .min(1, "Account number or digital asset address is required"),
        dollarValue: z.coerce
          .number()
          .min(0, "US dollar equivalent cannot be negative"),
      })
    )
    .optional(),
  retirementAccounts: z
    .array(
      z.object({
        type: z.string().min(1, "Retirement account type is required"),
        institutionName: z
          .string()
          .min(
            1,
            "Name of financial institution and country location is required"
          ),
        accountNumber: z.string().min(1, "Account number is required"),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  lifeInsurance: z
    .array(
      z.object({
        companyName: z.string().min(1, "Name of insurance company is required"),
        policyNumber: z.string().min(1, "Policy number is required"),
        cashValue: z.coerce
          .number()
          .min(0, "Current cash value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  realProperty: z
    .array(
      z.object({
        description: z.string().min(1, "Property description is required"),
        purchaseDate: z.string().min(1, "Purchase date is required"),
        mortgagePayment: z.coerce
          .number()
          .min(0, "Mortgage payment cannot be negative")
          .optional(),
        titleHeld: z.string().min(1, "How title is held is required"),
        location: z.string().min(1, "Location is required"),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  vehicles: z
    .array(
      z.object({
        makeModel: z.string().min(1, "Vehicle make and model is required"),
        year: z.coerce
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1, "Invalid year"),
        datePurchased: z.string().min(1, "Date purchased is required"),
        mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
        licenseNumber: z.string().min(1, "License/tag number is required"),
        status: z.string().min(1, "Vehicle status (lease/own) is required"),
        monthlyPayment: z.coerce
          .number()
          .min(0, "Monthly payment cannot be negative")
          .optional(),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  valuables: z
    .array(
      z.object({
        description: z.string().min(1, "Description of asset is required"),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  furniture: z
    .array(
      z.object({
        description: z.string().min(1, "Description of asset is required"),
        marketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
});

// Self-Employed Schema
export const selfEmployedSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    isSoleProprietorship: z.boolean().optional(),
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    businessTelephone: z
      .string()
      .regex(
        /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
        "Please enter a valid US phone number"
      )
      .optional()
      .or(z.literal("")),
    ein: z
      .string()
      .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)")
      .optional()
      .or(z.literal("")),
    businessWebsite: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    tradeName: z.string().optional(),
    businessDescription: z.string().optional(),
    totalEmployees: z.coerce.number().min(0, "Must be 0 or greater").optional(),
    taxDepositFrequency: z.string().optional(),
    avgGrossMonthlyPayroll: z.coerce
      .number()
      .min(0, "Must be 0 or greater")
      .optional(),
    hasOtherBusinessInterests: z.boolean().optional(),
    otherBusinesses: z
      .array(
        z.object({
          percentageOwnership: z.coerce
            .number()
            .min(0, "Must be between 0 and 100")
            .max(100, "Must be between 0 and 100")
            .optional(),
          title: z.string().optional(),
          businessAddress: z.string().optional(),
          businessName: z.string().optional(),
          businessTelephone: z
            .string()
            .regex(
              /^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
              "Please enter a valid US phone number"
            )
            .optional()
            .or(z.literal("")),
          ein: z
            .string()
            .regex(/^\d{2}-?\d{7}$/, "Please enter a valid EIN (XX-XXXXXXX)")
            .optional()
            .or(z.literal("")),
          businessType: z
            .enum(["partnership", "llc", "corporation", "other"])
            .optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isSelfEmployed) {
        return (
          data.isSoleProprietorship !== undefined &&
          data.businessName &&
          data.businessName.length > 0 &&
          data.businessTelephone &&
          data.businessTelephone.length > 0 &&
          data.businessDescription &&
          data.businessDescription.length > 0 &&
          data.totalEmployees !== undefined &&
          data.taxDepositFrequency &&
          data.taxDepositFrequency.length > 0 &&
          data.avgGrossMonthlyPayroll !== undefined &&
          data.hasOtherBusinessInterests !== undefined
        );
      }
      return true;
    },
    {
      message: "Please complete required business information",
      path: ["businessName"],
    }
  )
  .refine(
    (data) => {
      if (data.isSelfEmployed && data.isSoleProprietorship === false) {
        return data.ein && data.ein.length > 0;
      }
      return true;
    },
    {
      message: "EIN is required for non-sole proprietorship businesses",
      path: ["ein"],
    }
  )
  .refine(
    (data) => {
      if (data.isSelfEmployed && data.hasOtherBusinessInterests) {
        return data.otherBusinesses && data.otherBusinesses.length > 0;
      }
      return true;
    },
    {
      message: "Please add at least one other business interest",
      path: ["otherBusinesses"],
    }
  )
  .refine(
    (data) => {
      if (
        data.isSelfEmployed &&
        data.hasOtherBusinessInterests &&
        data.otherBusinesses
      ) {
        return data.otherBusinesses.every(
          (b) =>
            b.percentageOwnership !== undefined &&
            b.title &&
            b.title.length > 0 &&
            b.businessAddress &&
            b.businessAddress.length > 0 &&
            b.businessName &&
            b.businessName.length > 0 &&
            b.businessTelephone &&
            b.businessTelephone.length > 0 &&
            b.ein &&
            b.ein.length > 0 &&
            b.businessType
        );
      }
      return true;
    },
    {
      message: "Please complete all fields for each other business interest",
      path: ["otherBusinesses"],
    }
  );

// Business Assets Schema
export const businessAssetsSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    businessBankAccounts: z
      .array(
        z.object({
          accountType: z
            .string({
              required_error: "Account type is required",
              invalid_type_error: "Account type must be a string",
            })
            .min(1, { message: "Account type is required" }),
          bankNameCountry: z
            .string({
              required_error: "Bank name and country location is required",
              invalid_type_error:
                "Bank name and country location must be a string",
            })
            .min(1, { message: "Bank name and country location is required" }),
          accountNumber: z
            .string({
              required_error: "Account number is required",
              invalid_type_error: "Account number must be a string",
            })
            .min(1, { message: "Account number is required" }),
          amount: z.coerce
            .number({
              required_error: "Amount is required",
              invalid_type_error: "Amount must be a number",
            })
            .min(0, { message: "Amount must be 0 or greater" }),
        })
      )
      .default([]),
    businessDigitalAssets: z
      .array(
        z.discriminatedUnion("location", [
          z.object({
            description: z
              .string({
                required_error: "Description of digital asset is required",
                invalid_type_error:
                  "Description of digital asset must be a string",
              })
              .min(1, { message: "Description of digital asset is required" }),
            units: z.coerce
              .number({
                required_error: "Number of units is required",
                invalid_type_error: "Number of units must be a number",
              })
              .min(0, { message: "Number of units must be 0 or greater" }),
            location: z.literal("accountExchange"),
            custodianBroker: z
              .string({
                required_error: "Custodian or broker is required",
                invalid_type_error: "Custodian or broker must be a string",
              })
              .min(1, { message: "Custodian or broker is required" }),
            address: z.string().optional(),
            value: z.coerce
              .number({
                required_error: "Value is required",
                invalid_type_error: "Value must be a number",
              })
              .min(0, { message: "Value must be 0 or greater" }),
          }),
          z.object({
            description: z
              .string({
                required_error: "Description of digital asset is required",
                invalid_type_error:
                  "Description of digital asset must be a string",
              })
              .min(1, { message: "Description of digital asset is required" }),
            units: z.coerce
              .number({
                required_error: "Number of units is required",
                invalid_type_error: "Number of units must be a number",
              })
              .min(0, { message: "Number of units must be 0 or greater" }),
            location: z.literal("selfHostedWallet"),
            address: z
              .string({
                required_error: "Digital asset address is required",
                invalid_type_error: "Digital asset address must be a string",
              })
              .min(1, { message: "Digital asset address is required" }),
            custodianBroker: z.string().optional(),
            value: z.coerce
              .number({
                required_error: "Value is required",
                invalid_type_error: "Value must be a number",
              })
              .min(0, { message: "Value must be 0 or greater" }),
          }),
        ])
      )
      .default([])
      .refine(
        (assets) => {
          return assets.every((asset) => {
            if (asset.location === "selfHostedWallet") {
              return asset.address && asset.address.trim().length > 0;
            }
            if (asset.location === "accountExchange") {
              return (
                asset.custodianBroker && asset.custodianBroker.trim().length > 0
              );
            }
            return true;
          });
        },
        {
          message:
            "Please provide the address or custodian/broker for each digital asset",
        }
      ),
    totalBusinessBankAttachment: z.coerce
      .number({
        invalid_type_error: "Total must be a number",
      })
      .min(0, { message: "Total must be 0 or greater" })
      .optional(),
    businessOtherAssets: z
      .array(
        z.object({
          description: z
            .string({
              required_error: "Description of asset is required",
              invalid_type_error: "Description of asset must be a string",
            })
            .min(1, { message: "Description of asset is required" }),
          currentMarketValue: z.coerce
            .number({
              required_error: "Current market value is required",
              invalid_type_error: "Current market value must be a number",
            })
            .min(0, { message: "Current market value must be 0 or greater" }),
          quickSaleValue: z.coerce
            .number({
              required_error: "Quick sale value is required",
              invalid_type_error: "Quick sale value must be a number",
            })
            .min(0, { message: "Quick sale value must be 0 or greater" }),
          loanBalance: z.coerce
            .number({
              required_error: "Loan balance is required",
              invalid_type_error: "Loan balance must be a number",
            })
            .min(0, { message: "Loan balance must be 0 or greater" }),
          totalValue: z.coerce
            .number({
              required_error: "Total value is required",
              invalid_type_error: "Total value must be a number",
            })
            .min(0, { message: "Total value must be 0 or greater" }),
        })
      )
      .default([]),
    totalBusinessAssetsAttachment: z.coerce
      .number({
        invalid_type_error: "Total must be a number",
      })
      .min(0, { message: "Total must be 0 or greater" })
      .optional(),
    businessIrsDeduction: z.coerce
      .number({
        invalid_type_error: "Deduction must be a number",
      })
      .min(0, { message: "Deduction must be 0 or greater" })
      .optional(),
    hasBusinessNotesReceivable: z.boolean().optional(),
    businessNotesListing: z.string().optional(),
    hasBusinessAccountsReceivable: z.boolean().optional(),
    businessAccountsListing: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.isSelfEmployed) return true;
      return data.hasBusinessNotesReceivable !== undefined;
    },
    {
      message: "Please select yes or no for notes receivable",
      path: ["hasBusinessNotesReceivable"],
    }
  )
  .refine(
    (data) => {
      if (!data.isSelfEmployed) return true;
      return data.hasBusinessAccountsReceivable !== undefined;
    },
    {
      message: "Please select yes or no for accounts receivable",
      path: ["hasBusinessAccountsReceivable"],
    }
  )
  .refine(
    (data) => {
      if (!data.isSelfEmployed || !data.hasBusinessNotesReceivable) return true;
      return (
        data.businessNotesListing && data.businessNotesListing.trim().length > 0
      );
    },
    {
      message: "Please provide the listing for notes receivable",
      path: ["businessNotesListing"],
    }
  )
  .refine(
    (data) => {
      if (!data.isSelfEmployed || !data.hasBusinessAccountsReceivable)
        return true;
      return (
        data.businessAccountsListing &&
        data.businessAccountsListing.trim().length > 0
      );
    },
    {
      message: "Please provide the list for accounts receivable",
      path: ["businessAccountsListing"],
    }
  );

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

  // Business Assets (updated accountType instead of types)
  businessBankAccounts: z
    .array(
      z.object({
        accountType: z.string().optional(),
        bankNameCountry: z.string().optional(),
        accountNumber: z.string().optional(),
        amount: z.coerce.number().optional(),
      })
    )
    .optional(),
  businessDigitalAssets: z
    .array(
      z.object({
        description: z.string().optional(),
        units: z.coerce.number().optional(),
        location: z.enum(["accountExchange", "selfHostedWallet"]).optional(),
        custodianBroker: z.string().optional(),
        address: z.string().optional(),
        value: z.coerce.number().optional(),
      })
    )
    .optional(),
  totalBusinessBankAttachment: z.coerce.number().optional(),
  businessOtherAssets: z
    .array(
      z.object({
        description: z.string().optional(),
        currentMarketValue: z.coerce.number().optional(),
        quickSaleValue: z.coerce.number().optional(),
        loanBalance: z.coerce.number().optional(),
        totalValue: z.coerce.number().optional(),
      })
    )
    .optional(),
  totalBusinessAssetsAttachment: z.coerce.number().optional(),
  businessIrsDeduction: z.coerce.number().optional(),
  hasBusinessNotesReceivable: z.boolean().optional(),
  businessNotesListing: z.string().optional(),
  hasBusinessAccountsReceivable: z.boolean().optional(),
  businessAccountsListing: z.string().optional(),
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
