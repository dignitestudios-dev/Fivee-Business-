import { z } from "zod";
import { ZodType } from "zod";

/**
 * @param schema - Zod created schema at src/schemas/
 * @param data - Data to validate
 * @throws {Error} If validation fails
 */
export const validate = <T extends ZodType>(
  schema: T,
  data: unknown
): T["_output"] => {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Create a single string message
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(", ");

    throw new Error(`${errorMessage}`);
  }

  return result.data; // Return the validated data
};

const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

// US Date format validation
const dateSchema = z.string().refine((date) => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}, "Please enter a valid date");

// Employment Information Schema
export const employmentSchema = z
  .object({
    employerName: z.string().min(1, "Employer name is required"),
    payPeriod: z.enum(["weekly", "bi-weekly", "monthly", "other"]),
    employerAddress: z.string().min(1, "Employer address is required"),
    jobTitle: z.string().min(1, "Occupation is required"),
    yearsWithEmployer: z.coerce.number().min(0, "Years must be 0 or greater"),
    monthsWithEmployer: z.coerce
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
    spouseHasOwnershipInterest: z.boolean().optional(),
    spouseJobTitle: z.string().optional(),
    spouseYearsWithEmployer: z.coerce.number().optional(),
    spouseMonthsWithEmployer: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      // If married, spouse employment fields are required
      if (data.maritalStatus === "married") {
        return (
          data.spouseEmployerName &&
          data.spouseEmployerAddress &&
          data.spouseJobTitle &&
          data.spouseYearsWithEmployer !== undefined &&
          data.spouseMonthsWithEmployer !== undefined
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
        bankName: z.string().min(1, "Bank name is required"),
        countryLocation: z.string().min(1, "Bank country location is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        balance: z.coerce.number().min(0, "Balance cannot be negative"),
      })
    )
    .optional(),
  investmentAccounts: z
    .array(
      z.object({
        investmentType: z.string().min(1, "Investment type is required"),
        investmentTypeText: z.string().optional(),
        institutionName: z
          .string()
          .min(1, "Name of financial institution is required"),
        countryLocation: z
          .string()
          .min(1, "Financial institution country location is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        currentMarketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
        // Whether this vehicle is part of a joint offer (default false)
        isJointOffer: z.boolean().optional(),
      })
    )
    .optional(),
  digitalAssets: z
    .array(
      z
        .object({
          description: z
            .string()
            .min(1, "Description of digital asset is required"),
          numberOfUnits: z.coerce
            .number()
            .min(0, "Number of units cannot be negative"),
          location: z.string().min(1, "Location of digital asset is required"),
          accountNumber: z.string().optional(),
          digitalAssetAddress: z.string().optional(),
          usdEquivalent: z.coerce
            .number()
            .min(0, "US dollar equivalent cannot be negative"),
        })
        .refine((data) => data.accountNumber || data.digitalAssetAddress, {
          message: "Either account number or digital asset address is required",
          path: ["accountNumber"],
        })
    )
    .optional(),
  retirementAccounts: z
    .array(
      z
        .object({
          institutionName: z
            .string()
            .min(1, "Name of financial institution is required"),
          countryLocation: z.string().min(1, "Country location is required"),
          accountNumber: z.string().min(1, "Account number is required"),
          retirementType: z.enum(["401k", "ira", "other"], {
            message: "Retirement account type is required",
          }),
          retirementTypeText: z.string().optional(),
          currentMarketValue: z.coerce
            .number()
            .min(0, "Current market value cannot be negative")
            .optional(),
          loanBalance: z.coerce
            .number()
            .min(0, "Loan balance cannot be negative")
            .optional(),
        })
        .refine(
          (data) => {
            if (data.retirementType === "other") {
              return (
                data.retirementTypeText &&
                data.retirementTypeText.trim().length > 0
              );
            }
            return true;
          },
          {
            message: "Please specify the retirement account type",
            path: ["retirementTypeText"],
          }
        )
    )
    .optional(),
  lifeInsurancePolicies: z
    .array(
      z.object({
        companyName: z.string().min(1, "Name of insurance company is required"),
        policyNumber: z.string().min(1, "Policy number is required"),
        currentCashValue: z.coerce
          .number()
          .min(0, "Current cash value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  realProperties: z
    .array(
      z.object({
        description: z.string().min(1, "Property description is required"),
        purchaseDate: z.string().min(1, "Purchase date is required"),
        mortgagePayment: z.coerce
          .number()
          .min(0, "Mortgage payment cannot be negative")
          .optional(),
        finalPaymentDate: z.string().optional(),
        titleHeld: z.string().min(1, "How title is held is required"),
        location: z.string().min(1, "Location is required"),
        lenderName: z.string().optional(),
        lenderAddress: z.string().optional(),
        lenderPhone: z.string().optional(),
        currentMarketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
        isForSale: z.boolean().optional(),
        anticipateSelling: z.boolean().optional(),
        listingPrice: z.coerce
          .number()
          .min(0, "Listing price cannot be negative")
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
        purchaseDate: z.string().min(1, "Date purchased is required"),
        mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
        licenseTagNumber: z.string().min(1, "License/tag number is required"),
        ownershipType: z.string().min(1, "Vehicle ownership type is required"),
        creditorName: z.string().optional(),
        finalPaymentDate: z.string().optional(),
        monthlyLeaseLoanAmount: z.coerce
          .number()
          .min(0, "Monthly payment cannot be negative")
          .optional(),
        currentMarketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  valuableItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description of asset is required"),
        currentMarketValue: z.coerce
          .number()
          .min(0, "Current market value cannot be negative"),
        loanBalance: z.coerce
          .number()
          .min(0, "Loan balance cannot be negative")
          .optional(),
      })
    )
    .optional(),
  furniturePersonalEffects: z
    .array(
      z.object({
        description: z.string().min(1, "Description of asset is required"),
        currentMarketValue: z.coerce
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
    employerIdentificationNumber: z
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
    averageGrossMonthlyPayroll: z.coerce
      .number()
      .min(0, "Must be 0 or greater")
      .optional(),
    hasOtherBusinessInterests: z.boolean().optional(),
    otherBusinesses: z
      .array(
        z.object({
          ownershipPercentage: z.coerce
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
          employerIdentificationNumber: z
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
          data.averageGrossMonthlyPayroll !== undefined &&
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
        return (
          data.employerIdentificationNumber &&
          data.employerIdentificationNumber.length > 0
        );
      }
      return true;
    },
    {
      message: "EIN is required for non-sole proprietorship businesses",
      path: ["employerIdentificationNumber"],
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
            b.ownershipPercentage !== undefined &&
            b.title &&
            b.title.length > 0 &&
            b.businessAddress &&
            b.businessAddress.length > 0 &&
            b.businessName &&
            b.businessName.length > 0 &&
            b.businessTelephone &&
            b.businessTelephone.length > 0 &&
            b.employerIdentificationNumber &&
            b.employerIdentificationNumber.length > 0 &&
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
              message: "Account type is required",
            })
            .min(1, { message: "Account type is required" }),
          bankNameCountry: z
            .string({
              message: "Bank name and country location is required",
            })
            .min(1, { message: "Bank name and country location is required" }),
          accountNumber: z
            .string({
              message: "Account number is required",
            })
            .min(1, { message: "Account number is required" }),
          amount: z.coerce
            .number({
              message: "Amount must be a number",
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
                message: "Description of digital asset is required",
              })
              .min(1, { message: "Description of digital asset is required" }),
            units: z.coerce
              .number({
                message: "Number of units must be a number",
              })
              .min(0, { message: "Number of units must be 0 or greater" }),
            custodianBroker: z
              .string({
                message: "Custodian or broker is required",
              })
              .min(1, { message: "Custodian or broker is required" }),
            address: z.string().optional(),
            value: z.coerce
              .number({
                message: "Value must be a number",
              })
              .min(0, { message: "Value must be 0 or greater" }),
          }),
          z.object({
            description: z
              .string({
                message: "Description of digital asset is required",
              })
              .min(1, { message: "Description of digital asset is required" }),
            units: z.coerce
              .number({
                message: "Number of units must be a number",
              })
              .min(0, { message: "Number of units must be 0 or greater" }),
            location: z.literal("selfHostedWallet"),
            address: z
              .string({
                message: "Digital asset address is required",
              })
              .min(1, { message: "Digital asset address is required" }),
            custodianBroker: z.string().optional(),
            value: z.coerce
              .number({
                message: "Value must be a number",
              })
              .min(0, { message: "Value must be 0 or greater" }),
          }),
        ])
      )
      .default([]),
    businessOtherAssets: z
      .array(
        z.object({
          description: z
            .string({
              message: "Description of asset is required",
            })
            .min(1, { message: "Description of asset is required" }),
          currentcurrentMarketValue: z.coerce
            .number({
              message: "Current market value must be a number",
            })
            .min(0, { message: "Current market value must be 0 or greater" }),
          quickSaleValue: z.coerce
            .number({
              message: "Quick sale value must be a number",
            })
            .min(0, { message: "Quick sale value must be 0 or greater" }),
          loanBalance: z.coerce
            .number({
              message: "Loan balance must be a number",
            })
            .min(0, { message: "Loan balance must be 0 or greater" }),
          totalValue: z.coerce
            .number({
              message: "Total value must be a number",
            })
            .min(0, { message: "Total value must be 0 or greater" }),
        })
      )
      .default([]),
    businessIrsDeduction: z.coerce
      .number({
        message: "Deduction must be a number",
      })
      .min(0, { message: "Deduction must be 0 or greater" })
      .optional(),
    hasBusinessNotesReceivable: z.boolean().optional(),
    hasBusinessAccountsReceivable: z.boolean().optional(),
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
  );

// Business Income Schema
export const businessIncomeSchema = z
  .object({
    isSelfEmployed: z.boolean(),
    periodStart: z
      .string({
        message: "Period beginning date is required",
      })
      .min(1, { message: "Period beginning date is required" }),
    periodEnd: z
      .string({
        message: "Period through date is required",
      })
      .min(1, { message: "Period through date is required" }),
    grossReceipts: z
      .string()
      .min(1, { message: "Gross receipts is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Gross receipts must be a number 0 or greater",
      }),
    grossRentalIncome: z
      .string()
      .min(1, { message: "Gross rental income is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Gross rental income must be a number 0 or greater",
      }),
    interestIncome: z
      .string()
      .min(1, { message: "Interest income is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Interest income must be a number 0 or greater",
      }),
    dividends: z
      .string()
      .min(1, { message: "Dividends is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Dividends must be a number 0 or greater",
      }),
    otherIncome: z
      .string()
      .min(1, { message: "Other business income is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Other business income must be a number 0 or greater",
      }),
    materialsPurchased: z
      .string()
      .min(1, { message: "Materials purchased is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Materials purchased must be a number 0 or greater",
      }),
    inventoryPurchased: z
      .string()
      .min(1, { message: "Inventory purchased is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Inventory purchased must be a number 0 or greater",
      }),
    grossWagesSalaries: z
      .string()
      .min(1, { message: "Gross wages is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Gross wages must be a number 0 or greater",
      }),
    rent: z
      .string()
      .min(1, { message: "Business rent is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Business rent must be a number 0 or greater",
      }),
    supplies: z
      .string()
      .min(1, { message: "Business supplies is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Business supplies must be a number 0 or greater",
      }),
    utilitiesTelephones: z
      .string()
      .min(1, { message: "Utilities/telephones is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Utilities/telephones must be a number 0 or greater",
      }),
    vehicleCosts: z
      .string()
      .min(1, { message: "Vehicle costs is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Vehicle costs must be a number 0 or greater",
      }),
    businessInsurance: z
      .string()
      .min(1, { message: "Business insurance is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Business insurance must be a number 0 or greater",
      }),
    currentBusinessTaxes: z
      .string()
      .min(1, { message: "Current business taxes is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Current business taxes must be a number 0 or greater",
      }),
    securedDebts: z
      .string()
      .min(1, { message: "Secured debts is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Secured debts must be a number 0 or greater",
      }),
    otherBusinessExpenses: z
      .string()
      .min(1, { message: "Other business expenses is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Other business expenses must be a number 0 or greater",
      }),
  })
  .refine(
    (data) => {
      // Cross-field validation: period through should be after period beginning
      if (data.isSelfEmployed && data.periodStart && data.periodEnd) {
        const beginDate = new Date(data.periodStart);
        const throughDate = new Date(data.periodEnd);
        return throughDate > beginDate;
      }
      return true;
    },
    {
      message: "Period through date must be after the beginning date",
      path: ["periodEnd"],
    }
  );

// Household Income Schema
export const householdIncomeSchema = z.object({
  // Primary taxpayer income fields (Box 30)
  primaryGrossWages: z
    .number()
    .min(0, "Primary gross wages must be 0 or greater")
    .optional()
    .or(z.literal("")),
  primarySocialSecurity: z
    .number()
    .min(0, "Primary social security must be 0 or greater")
    .optional()
    .or(z.literal("")),
  primaryPensions: z
    .number()
    .min(0, "Primary pensions must be 0 or greater")
    .optional()
    .or(z.literal("")),
  primaryOtherIncome: z
    .number()
    .min(0, "Primary other income must be 0 or greater")
    .optional()
    .or(z.literal("")),

  // Spouse income fields (Box 31) - conditional
  spouseGrossWages: z
    .number()
    .min(0, "Spouse gross wages must be 0 or greater")
    .optional()
    .or(z.literal("")),
  spouseSocialSecurity: z
    .number()
    .min(0, "Spouse social security must be 0 or greater")
    .optional()
    .or(z.literal("")),
  spousePensions: z
    .number()
    .min(0, "Spouse pensions must be 0 or greater")
    .optional()
    .or(z.literal("")),
  spouseOtherIncome: z
    .number()
    .min(0, "Spouse other income must be 0 or greater")
    .optional()
    .or(z.literal("")),

  // Additional income sources (Boxes 32-38)
  additionalSources: z
    .number()
    .min(0, "Additional sources must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 32
  interestDividendsRoyalties: z
    .number()
    .min(0, "Interest/dividends/royalties must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 33
  distributions: z
    .number()
    .min(0, "Distributions must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 34
  netRentalIncome: z
    .number()
    .min(0, "Net rental income must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 35
  netBusinessIncomeFromBoxC: z
    .number()
    .min(0, "Net business income must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 36
  childSupportReceived: z
    .number()
    .min(0, "Child support received must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 37
  alimonyReceived: z
    .number()
    .min(0, "Alimony received must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 38

  // Required expense fields (Boxes 39, 40, 49)
  foodClothingMisc: z
    .number()
    .min(0, "Food, clothing, and miscellaneous must be 0 or greater"), // Box 39 - Required
  housingUtilities: z
    .number()
    .min(0, "Housing and utilities must be 0 or greater"), // Box 40 - Required
  currentMonthlyTaxes: z
    .number()
    .min(0, "Current monthly taxes must be 0 or greater"), // Box 49 - Required

  // Optional expense fields (Boxes 41-48, 50-51)
  vehicleLoanLease: z
    .number()
    .min(0, "Vehicle loan/lease must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 41
  vehicleOperatingCosts: z
    .number()
    .min(0, "Vehicle operating costs must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 42
  publicTransportation: z
    .number()
    .min(0, "Public transportation must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 43
  healthInsurancePremiums: z
    .number()
    .min(0, "Health insurance premiums must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 44
  outOfPocketHealthcare: z
    .number()
    .min(0, "Out-of-pocket healthcare must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 45
  courtOrderedPayments: z
    .number()
    .min(0, "Court-ordered payments must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 46
  childDependentCare: z
    .number()
    .min(0, "Child/dependent care must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 47
  lifeInsurancePremiums: z
    .number()
    .min(0, "Life insurance premiums must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 48
  lifeInsuranceAmount: z
    .number()
    .min(0, "Life insurance policy amount must be 0 or greater")
    .optional()
    .or(z.literal("")),
  securedDebtsOther: z
    .number()
    .min(0, "Secured debts/other must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 50
  monthlyDelinquentTaxPayments: z
    .number()
    .min(0, "Monthly delinquent tax payments must be 0 or greater")
    .optional()
    .or(z.literal("")), // Box 51

  // Text fields
  listDebtsExpenses: z.string().optional(),
  totalTaxOwed: z
    .number()
    .min(0, "Total tax owed must be 0 or greater")
    .optional()
    .or(z.literal("")),
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
    maritalStatus: z.enum(["unmarried", "married"]),
    taxpayerSignatureImage: z
      .string()
      .min(1, { message: "Taxpayer signature image is required" }),
    taxpayerSignatureDate: z
      .string()
      .min(1, { message: "Taxpayer signature date is required" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }),
    spouseSignatureImage: z.string().optional(),
    spouseSignatureDate: z.string().optional(),
    attachment1: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment2: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment3: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment4: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment5: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment6: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment7: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment8: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment9: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment10: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment11: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment12: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment13: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
    attachment14: z.literal(true, {
      message: "This attachment must be confirmed",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.maritalStatus === "married") {
      if (!data.spouseSignatureImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Spouse signature image is required if married",
          path: ["spouseSignatureImage"],
        });
      }
      if (!data.spouseSignatureDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Spouse signature date is required if married",
          path: ["spouseSignatureDate"],
        });
      }
    }
  });

// Combined schema for all sections
export const formSchemas = {
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
  dob: dateSchema,
  ssnOrItin: z
    .string()
    .regex(ssnRegex, "Please enter a valid SSN (XXX-XX-XXXX)"),
  maritalStatus: z.enum(["unmarried", "married"]),
  dateOfMarriage: z.string().optional(),
  homeAddress: z.string().min(1, "Home address is required"),
  housingStatus: z.enum(["own", "rent", "other"]),
  housingOtherDetails: z.string().optional(),
  livedInCommunityPropertyStateInLast10Years: z.boolean(),
  countyOfResidence: z.string().min(1, "County is required"),
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
  spouseDOB: z.string().optional(),
  spouseSSN: z
    .string()
    .regex(ssnRegex, "Please enter a valid SSN (XXX-XX-XXXX)"),
  spouseEmployerName: z.string().optional(),
  spousePayPeriod: z
    .enum(["weekly", "bi-weekly", "monthly", "other"])
    .optional(),
  spouseEmployerAddress: z.string().optional(),
  spouseHasOwnershipInterest: z.boolean().optional(),
  spouseJobTitle: z.string().optional(),
  spouseYearsWithEmployer: z.coerce.number().optional(),
  spouseMonthsWithEmployer: z.coerce.number().optional(),

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
  hasOwnershipInterest: z.boolean(),
  jobTitle: z.string().min(1, "Occupation is required"),
  yearsWithEmployer: z.coerce.number().min(0, "Years must be 0 or greater"),
  monthsWithEmployer: z.coerce
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
        location: z.string().min(1, { message: "Location is required" }),
        custodianBroker: z.string().optional(),
        address: z.string().optional(),
        value: z.coerce.number().optional(),
      })
    )
    .optional(),
  businessOtherAssets: z
    .array(
      z.object({
        description: z.string().optional(),
        currentcurrentMarketValue: z.coerce.number().optional(),
        quickSaleValue: z.coerce.number().optional(),
        loanBalance: z.coerce.number().optional(),
        totalValue: z.coerce.number().optional(),
      })
    )
    .optional(),
  businessIrsDeduction: z.coerce.number().optional(),
  hasBusinessNotesReceivable: z.boolean().optional(),
  hasBusinessAccountsReceivable: z.boolean().optional(),
});

export const validateSection = (sectionNumber: number, data: any): boolean => {
  try {
    switch (sectionNumber) {
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

export const preventAlphabetInput = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  e.target.value = e.target.value.replace(/[a-zA-Z]/g, "");
};
export const preventNonNumericInput = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  e.target.value = e.target.value.replace(/[^0-9.]/g, "");
};
