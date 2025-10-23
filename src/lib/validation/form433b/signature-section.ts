import z from "zod";

export const signatureInitialValues = {
  taxpayerSignature: {
    signatureId: "",
    title: "",
    date: "",
  },
  attachmentChecklist: {
    profitAndLossStatement: false,
    bankStatements: false,
    collateralLoanStatements: false,
    accountsNotesReceivableStatements: false,
    digitalAssetsDocumentation: false,
    loanMortgageStatements: false,
    specialCircumstancesDocumentation: false,
    form2848PowerOfAttorney: false,
    form656Completed: false,
  },
};

export const signatureSchemaFormB = z.object({
  taxpayerSignature: z.object({
    signatureId: z.string().min(1, "Signature is required"),
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1, "Date is required"),
  }),
  attachmentChecklist: z.object({
    profitAndLossStatement: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    bankStatements: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    collateralLoanStatements: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    accountsNotesReceivableStatements: z
      .boolean()
      .refine((val) => val === true, {
        message: "This attachment is required",
      }),
    digitalAssetsDocumentation: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    loanMortgageStatements: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    specialCircumstancesDocumentation: z
      .boolean()
      .refine((val) => val === true, {
        message: "This attachment is required",
      }),
    form2848PowerOfAttorney: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
    form656Completed: z.boolean().refine((val) => val === true, {
      message: "This attachment is required",
    }),
  }),
});
