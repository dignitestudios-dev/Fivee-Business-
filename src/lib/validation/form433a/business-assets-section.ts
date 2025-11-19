import z from "zod";
import {
  accountNumberSchema,
  moneySchema,
  descriptionSchema,
  shortTextSchema,
  nameSchema,
  phoneSchemaOptional,
} from "@/lib/validation-schemas";

export const businessAssetsInitialValues: BusinessAssetsFormSchema = {
  bankAccountsInfo: {
    bankAccounts: [],
  },
  digitalAssetsInfo: {
    digitalAssets: [],
  },
  assetItems: {
    assets: [],
    irsAllowedDeduction: "",
  },
  hasNotesReceivable: false,
  hasAccountsReceivable: false,
  boxB: "",
};

export const businessAssetsSchema = z.object({
  bankAccountsInfo: z.object({
    bankAccounts: z
      .array(
        z.object({
          bankName: nameSchema,
          countryLocation: shortTextSchema,
          accountType: z.string().min(1, "Account type is required"),
          // accountNumber is required for bank accounts
          accountNumber: accountNumberSchema,
          value: moneySchema,
        })
      )
      .optional(),
  }),
  digitalAssetsInfo: z.object({
    digitalAssets: z
      .array(
        z
          .object({
            description: descriptionSchema,
            numberOfUnits: z.coerce.number({ message: "Must be a number" }).min(0, "Number of units cannot be negative").optional(),
            location: shortTextSchema,
            accountNumber: accountNumberSchema.optional(),
            digitalAssetAddress: z.string().optional(),
            usdEquivalent: moneySchema,
          })
          .refine((data) => data.accountNumber || data.digitalAssetAddress, {
            message:
              "Either account number or digital asset address is required",
            path: ["accountNumber"],
          })
      )
      .optional(),
  }),
  assetItems: z.object({
    assets: z
      .array(
        z.object({
          description: descriptionSchema,
          currentMarketValue: moneySchema,
          loanBalance: moneySchema.optional(),
          isLeased: z.boolean(),
          usedInProductionOfIncome: z.boolean(),
          quickSaleValue: moneySchema.optional(),
          totalValue: moneySchema.optional(),
        })
      )
      .optional(),
    irsAllowedDeduction: moneySchema,
  }),
  hasNotesReceivable: z.boolean(),
  hasAccountsReceivable: z.boolean(),
});
