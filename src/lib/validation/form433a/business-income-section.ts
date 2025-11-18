import z from "zod";

export const businessIncomeInitialValues: BusinessIncomeFormSchema = {
  periodStart: "",
  periodEnd: "",
  grossReceipts: "",
  grossRentalIncome: "",
  interestIncome: "",
  dividends: "",
  otherIncome: "",
  materialsPurchased: "",
  inventoryPurchased: "",
  grossWagesSalaries: "",
  rent: "",
  supplies: "",
  utilitiesTelephones: "",
  vehicleCosts: "",
  businessInsurance: "",
  currentBusinessTaxes: "",
  securedDebts: "",
  otherBusinessExpenses: "",
  boxC: "",
};

export const businessIncomeSchema = z
  .object({
    periodStart: z
      .string()
      .min(1, { message: "Period beginning date is required" }),
    periodEnd: z
      .string()
      .min(1, { message: "Period through date is required" }),
    grossReceipts: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Gross receipts is required" })
      .min(0, { message: "Gross receipts must be 0 or greater" })
      .max(1000000000, { message: "Gross receipts is too large" }),
    grossRentalIncome: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Gross rental income is required" })
      .min(0, { message: "Gross rental income must be 0 or greater" })
      .max(1000000000, { message: "Gross rental income is too large" }),
    interestIncome: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Interest income is required" })
      .min(0, { message: "Interest income must be 0 or greater" })
      .max(1000000000, { message: "Interest income is too large" }),
    dividends: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Dividends is required" })
      .min(0, { message: "Dividends must be 0 or greater" })
      .max(1000000000, { message: "Dividends is too large" }),
    otherIncome: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Other business income is required" })
      .min(0, { message: "Other business income must be 0 or greater" })
      .max(1000000000, { message: "Other business income is too large" }),
    materialsPurchased: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Materials purchased is required" })
      .min(0, { message: "Materials purchased must be 0 or greater" })
      .max(1000000000, { message: "Materials purchased is too large" }),
    inventoryPurchased: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Inventory purchased is required" })
      .min(0, { message: "Inventory purchased must be 0 or greater" })
      .max(1000000000, { message: "Inventory purchased is too large" }),
    grossWagesSalaries: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Gross wages is required" })
      .min(0, { message: "Gross wages must be 0 or greater" })
      .max(1000000000, { message: "Gross wages is too large" }),
    rent: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Business rent is required" })
      .min(0, { message: "Business rent must be 0 or greater" })
      .max(1000000000, { message: "Business rent is too large" }),
    supplies: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Business supplies is required" })
      .min(0, { message: "Business supplies must be 0 or greater" })
      .max(1000000000, { message: "Business supplies is too large" }),
    utilitiesTelephones: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Utilities/telephones is required" })
      .min(0, { message: "Utilities/telephones must be 0 or greater" })
      .max(1000000000, { message: "Utilities/telephones is too large" }),
    vehicleCosts: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Vehicle costs is required" })
      .min(0, { message: "Vehicle costs must be 0 or greater" })
      .max(1000000000, { message: "Vehicle costs is too large" }),
    businessInsurance: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Business insurance is required" })
      .min(0, { message: "Business insurance must be 0 or greater" })
      .max(1000000000, { message: "Business insurance is too large" }),
    currentBusinessTaxes: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Current business taxes is required" })
      .min(0, { message: "Current business taxes must be 0 or greater" })
      .max(1000000000, { message: "Current business taxes is too large" }),
    securedDebts: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Secured debts is required" })
      .min(0, { message: "Secured debts must be 0 or greater" })
      .max(1000000000, { message: "Secured debts is too large" }),
    otherBusinessExpenses: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Other business expenses is required" })
      .min(0, { message: "Other business expenses must be 0 or greater" })
      .max(1000000000, { message: "Other business expenses is too large" }),
    boxC: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Net business income is required" })
      .min(0, { message: "Net business income must be 0 or greater" })
      .max(1000000000, { message: "Net business income is too large" }),
  })
  .refine(
    (data) => {
      // Cross-field validation: period through should be after period beginning
      if (data.periodStart && data.periodEnd) {
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
