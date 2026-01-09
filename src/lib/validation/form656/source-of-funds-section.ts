import * as z from "zod";

export const sourceOfFundsSchema = z
  .object({
    sourceOfFunds: z.string().min(1, "Source of funds required"),
    allRequiredReturnsFiled: z
      .boolean()
      .refine((val) => val === true, "Must confirm filing"),
    yearsNotRequiredToFileCheckbox: z.boolean().optional(),
    yearsNotRequiredToFile: z
      .number({ message: "Must be a number" })
      .optional(),
    madeEstimatedTaxPayments: z.boolean().optional().default(false),
    notRequiredEstimatedTaxPayments: z.boolean().optional().default(false),
    madeFederalTaxDeposits: z.boolean().optional().default(false),
    notRequiredFederalTaxDeposits: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.madeEstimatedTaxPayments && !data.notRequiredEstimatedTaxPayments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please select either 'I have made estimated tax payments' or 'I am not required to make estimated tax payments'.",
        path: ["madeEstimatedTaxPayments"],
      });
    }

    if (!data.madeFederalTaxDeposits && !data.notRequiredFederalTaxDeposits) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please select either 'I have made federal tax deposits' or 'I am not required to make federal tax deposits'.",
        path: ["madeFederalTaxDeposits"],
      });
    }
  });

export type SourceOfFundsFormSchema = z.infer<typeof sourceOfFundsSchema>;

export const sourceOfFundsInitialValues: SourceOfFundsFormSchema = {
  sourceOfFunds: "",
  allRequiredReturnsFiled: false,
  yearsNotRequiredToFileCheckbox: false,
  yearsNotRequiredToFile: 0,
  madeEstimatedTaxPayments: false,
  notRequiredEstimatedTaxPayments: false,
  madeFederalTaxDeposits: false,
  notRequiredFederalTaxDeposits: false,
};
