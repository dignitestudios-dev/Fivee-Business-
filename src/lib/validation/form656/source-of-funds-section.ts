import * as z from "zod";

export const sourceOfFundsSchema = z.object({
  sourceOfFunds: z.string().min(1, "Source of funds required"),
  allRequiredReturnsFiled: z.boolean().refine((val) => val === true, "Must confirm filing"),
  yearsNotRequiredToFile: z.string().optional(),
  madeEstimatedTaxPayments: z.boolean(),
  notRequiredEstimatedTaxPayments: z.boolean(),
  madeFederalTaxDeposits: z.boolean(),
  notRequiredFederalTaxDeposits: z.boolean(),
}).refine((data) => data.madeEstimatedTaxPayments || data.notRequiredEstimatedTaxPayments, {
  message: "Must select one for estimated tax payments",
  path: ["madeEstimatedTaxPayments"],
}).refine((data) => data.madeFederalTaxDeposits || data.notRequiredFederalTaxDeposits, {
  message: "Must select one for federal tax deposits",
  path: ["madeFederalTaxDeposits"],
});

export type SourceOfFundsFormSchema = z.infer<typeof sourceOfFundsSchema>;

export const sourceOfFundsInitialValues: SourceOfFundsFormSchema = {
  sourceOfFunds: "",
  allRequiredReturnsFiled: false,
  yearsNotRequiredToFile: "",
  madeEstimatedTaxPayments: false,
  notRequiredEstimatedTaxPayments: false,
  madeFederalTaxDeposits: false,
  notRequiredFederalTaxDeposits: false,
};