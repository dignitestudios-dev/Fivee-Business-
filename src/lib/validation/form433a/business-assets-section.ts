import z from "zod";

export const businessAssetsInitialValues: BusinessAssetsFormSchema = {
  bankAccountsInfo: {
    bankAccounts: [],
  },
  digitalAssetsInfo: {
    digitalAssets: [],
  },
  assetItems: {
    assets: [],
    irsAllowedDeduction: 0,
  },
  totalBusinessAssetsAttachment: 0,
  hasNotesReceivable: false,
  hasAccountsReceivable: false,
  boxB: 0,
};

export const businessAssetsSchema = z.object({
  bankAccountsInfo: z.object({
    bankAccounts: z
      .array(
        z.object({
          bankName: z.string().min(1, "Bank name is required"),
          countryLocation: z.string().min(1, "Country location is required"),
          accountType: z.string().min(1, "Account type is required"),
          accountNumber: z.string().optional(),
          value: z.coerce.number().min(0, "Value cannot be negative"),
        })
      )
      .optional(),
  }),
  digitalAssetsInfo: z.object({
    digitalAssets: z
      .array(
        z
          .object({
            description: z.string().min(1, "Description is required"),
            numberOfUnits: z.coerce.number().min(0).optional(),
            location: z.string().min(1, "Location is required"),
            accountNumber: z.string().optional(),
            digitalAssetAddress: z.string().optional(),
            usdEquivalent: z.coerce
              .number()
              .min(0, "USD equivalent cannot be negative"),
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
          description: z.string().min(1, "Description is required"),
          currentMarketValue: z.coerce
            .number()
            .min(0, "Current market value cannot be negative"),
          loanBalance: z.coerce
            .number()
            .min(0, "Loan balance cannot be negative")
            .optional(),
          isLeased: z.boolean(),
          usedInProductionOfIncome: z.boolean(),
          quickSaleValue: z.coerce.number().optional(),
          totalValue: z.coerce.number().optional(),
        })
      )
      .optional(),
    irsAllowedDeduction: z.coerce
      .number()
      .min(0, "IRS allowed deduction cannot be negative"),
  }),

  totalBusinessAssetsAttachment: z.coerce
    .number()
    .min(0, "Total business assets attachment cannot be negative"),

  hasNotesReceivable: z.boolean(),
  hasAccountsReceivable: z.boolean(),
});
