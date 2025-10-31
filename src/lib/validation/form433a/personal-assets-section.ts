import { makeStore } from "@/lib/store";
import z from "zod";

export const personalAssetsInitialValues: PersonalAssetsFormSchema = {
  bankAccounts: [],
  investmentAccounts: [],
  digitalAssets: [],
  retirementAccounts: [],
  lifeInsurancePolicies: [],
  isForSale: false,
  anticipateSelling: false,
  listingPrice: null,
  realProperties: [],
  vehicles: [],
  valuableItems: [],
  furniturePersonalEffects: [],
};

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
  isForSale: z.boolean().optional(),
  anticipateSelling: z.boolean().optional(),
  listingPrice: z.coerce
    .number()
    .min(0, "Listing price cannot be negative")
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
        isJointOffer: z.boolean().optional(),
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
