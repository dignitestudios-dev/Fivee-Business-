import { makeStore } from "@/lib/store";
import z from "zod";
import {
  nameSchema,
  accountNumberSchema,
  moneySchema,
  descriptionSchema,
  shortTextSchema,
  addressSchema,
  phoneSchemaOptional,
  dateSchema,
} from "../../validation-schemas";

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
        bankName: nameSchema,
        countryLocation: shortTextSchema,
        accountNumber: accountNumberSchema,
        balance: moneySchema,
      })
    )
    .optional(),
  investmentAccounts: z
    .array(
      z.object({
        investmentType: z.string().min(1, "Investment type is required"),
        investmentTypeText: z.string().optional(),
        institutionName: nameSchema,
        countryLocation: shortTextSchema,
        accountNumber: accountNumberSchema,
        currentMarketValue: moneySchema,
        loanBalance: moneySchema.optional(),
      })
    )
    .optional(),
  digitalAssets: z
    .array(
      z
        .object({
          description: descriptionSchema,
          numberOfUnits: z.coerce
            .number()
            .min(0, "Number of units cannot be negative"),
          location: shortTextSchema,
          accountNumber: accountNumberSchema.optional(),
          digitalAssetAddress: z.string().optional(),
          usdEquivalent: moneySchema,
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
          institutionName: nameSchema,
          countryLocation: shortTextSchema,
          accountNumber: accountNumberSchema,
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
        companyName: nameSchema,
        policyNumber: z.string().min(1, "Policy number is required"),
        currentCashValue: moneySchema,
        loanBalance: moneySchema.optional(),
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
        description: descriptionSchema,
        purchaseDate: dateSchema,
        mortgagePayment: moneySchema.optional(),
        finalPaymentDate: z.string().optional(),
        titleHeld: shortTextSchema,
        location: shortTextSchema,
        lenderName: nameSchema.optional(),
        lenderAddress: addressSchema.optional(),
        lenderPhone: phoneSchemaOptional,
        currentMarketValue: moneySchema,
        loanBalance: moneySchema.optional(),
      })
    )
    .optional(),
  vehicles: z
    .array(
      z.object({
        makeModel: shortTextSchema,
        year: z.coerce
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1, "Invalid year"),
        purchaseDate: dateSchema,
        mileage: moneySchema,
        licenseTagNumber: shortTextSchema,
        ownershipType: z.string().min(1, "Vehicle ownership type is required"),
  creditorName: nameSchema.optional(),
        finalPaymentDate: z.string().optional(),
        monthlyLeaseLoanAmount: moneySchema.optional(),
        currentMarketValue: moneySchema,
        loanBalance: moneySchema.optional(),
        isJointOffer: z.boolean().optional(),
      })
    )
    .optional(),
  valuableItems: z
    .array(
      z.object({
        description: descriptionSchema,
        currentMarketValue: moneySchema,
        loanBalance: moneySchema.optional(),
      })
    )
    .optional(),
  furniturePersonalEffects: z
    .array(
      z.object({
        description: descriptionSchema,
        currentMarketValue: moneySchema,
        loanBalance: moneySchema.optional(),
      })
    )
    .optional(),
});
