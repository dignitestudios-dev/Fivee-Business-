import z from "zod";

export const businessIncomeInitialValues: BusinessIncomeFormSchema = {
  periodStart: "",
  periodEnd: "",
  grossReceipts: 0,
  grossRentalIncome: 0,
  interestIncome: 0,
  dividends: 0,
  otherIncome: 0,
  materialsPurchased: 0,
  inventoryPurchased: 0,
  grossWagesSalaries: 0,
  rent: 0,
  supplies: 0,
  utilitiesTelephones: 0,
  vehicleCosts: 0,
  businessInsurance: 0,
  currentBusinessTaxes: 0,
  securedDebts: 0,
  otherBusinessExpenses: 0,
  boxC: 0,
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
      .min(0, { message: "Gross receipts must be 0 or greater" }),
    grossRentalIncome: z.coerce
      .number()
      .min(0, { message: "Gross rental income must be 0 or greater" }),
    interestIncome: z.coerce
      .number()
      .min(0, { message: "Interest income must be 0 or greater" }),
    dividends: z.coerce
      .number()
      .min(0, { message: "Dividends must be 0 or greater" }),
    otherIncome: z.coerce
      .number()
      .min(0, { message: "Other business income must be 0 or greater" }),
    materialsPurchased: z.coerce
      .number()
      .min(0, { message: "Materials purchased must be 0 or greater" }),
    inventoryPurchased: z.coerce
      .number()
      .min(0, { message: "Inventory purchased must be 0 or greater" }),
    grossWagesSalaries: z.coerce
      .number()
      .min(0, { message: "Gross wages must be 0 or greater" }),
    rent: z.coerce
      .number()
      .min(0, { message: "Business rent must be 0 or greater" }),
    supplies: z.coerce
      .number()
      .min(0, { message: "Business supplies must be 0 or greater" }),
    utilitiesTelephones: z.coerce
      .number()
      .min(0, { message: "Utilities/telephones must be 0 or greater" }),
    vehicleCosts: z.coerce
      .number()
      .min(0, { message: "Vehicle costs must be 0 or greater" }),
    businessInsurance: z.coerce
      .number()
      .min(0, { message: "Business insurance must be 0 or greater" }),
    currentBusinessTaxes: z.coerce
      .number()
      .min(0, { message: "Current business taxes must be 0 or greater" }),
    securedDebts: z.coerce
      .number()
      .min(0, { message: "Secured debts must be 0 or greater" }),
    otherBusinessExpenses: z.coerce
      .number()
      .min(0, { message: "Other business expenses must be 0 or greater" }),
    boxC: z.coerce.number().min(0),
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
