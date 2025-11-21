import z from "zod";

export const signatureInitialValues = {
  taxpayerSignature: {
    // signatureId: "",
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
    // signatureId: z.string().min(1, "Signature is required"),
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1, "Date is required"),
  }),
  attachmentChecklist: z.object({
    profitAndLossStatement: z.boolean().optional(),
    bankStatements: z.boolean().optional(),
    collateralLoanStatements: z.boolean().optional(),
    accountsNotesReceivableStatements: z.boolean().optional(),
    digitalAssetsDocumentation: z.boolean().optional(),
    loanMortgageStatements: z.boolean().optional(),
    specialCircumstancesDocumentation: z.boolean().optional(),
    form2848PowerOfAttorney: z.boolean().optional(),
    form656Completed: z.boolean().optional(),
  }),
});
