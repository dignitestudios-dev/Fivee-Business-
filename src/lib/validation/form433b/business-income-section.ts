import z from "zod";

export const businessIncomeFormBInitialValues = {
  periodBeginning: "",
  periodThrough: "",
  grossReceipts: 0,
  grossRentalIncome: 0,
  interestIncome: 0,
  dividends: 0,
  otherIncome: 0,
};

export const businessIncomeSchemaFormB = z.object({
  periodBeginning: z.string().min(1, "Period beginning is required"),
  periodThrough: z.string().min(1, "Period through is required"),
  grossReceipts: z.number().min(0, "Gross receipts must be non-negative"),
  grossRentalIncome: z
    .number()
    .min(0, "Gross rental income must be non-negative"),
  interestIncome: z.number().min(0, "Interest income must be non-negative"),
  dividends: z.number().min(0, "Dividends must be non-negative"),
  otherIncome: z.number().min(0, "Other income must be non-negative"),
});
