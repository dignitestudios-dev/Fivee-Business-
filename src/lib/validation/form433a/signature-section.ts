import z from "zod";

type MaritalStatus = "married" | "unmarried";

export interface SignatureFormSchema {
  taxpayerSignature: {
    signatureId: string;
    date: string;
  };
  spouseSignature: {
    signatureId: string;
    date: string;
  };
  attachments: {
    payStubs: boolean;
    investmentStatements: boolean;
    digitalAssetsDocs: boolean;
    otherIncomeStatements: boolean;
    bankStatements: boolean;
    form433B: boolean;
    loanStatements: boolean;
    accountsReceivable: boolean;
    taxLiabilityVerification: boolean;
    courtOrders: boolean;
    trustDocuments: boolean;
    specialCircumstancesDocs: boolean;
    form2848: boolean;
    form656: boolean;
  };
}

export const signatureInitialValues: SignatureFormSchema = {
  taxpayerSignature: {
    signatureId: "",
    date: "",
  },
  spouseSignature: {
    signatureId: "",
    date: "",
  },
  attachments: {
    payStubs: false,
    investmentStatements: false,
    digitalAssetsDocs: false,
    otherIncomeStatements: false,
    bankStatements: false,
    form433B: false,
    loanStatements: false,
    accountsReceivable: false,
    taxLiabilityVerification: false,
    courtOrders: false,
    trustDocuments: false,
    specialCircumstancesDocs: false,
    form2848: false,
    form656: false,
  },
};

export const signatureSchema = (maritalStatus: MaritalStatus) =>
  z
    .object({
      taxpayerSignature: z.object({
        signatureId: z.string().min(1, "Taxpayer signature is required"),
        date: z.string().min(1, "Taxpayer date is required"),
      }),
      spouseSignature: z.object({
        signatureId: z.string().optional().default(""),
        date: z.string().optional().default(""),
      }),
      attachments: z.object({
        payStubs: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        investmentStatements: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        digitalAssetsDocs: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        otherIncomeStatements: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        bankStatements: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        form433B: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        loanStatements: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        accountsReceivable: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        taxLiabilityVerification: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        courtOrders: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        trustDocuments: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        specialCircumstancesDocs: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        form2848: z.literal(true, {
          message: "You must confirm this attachment",
        }),
        form656: z.literal(true, {
          message: "You must confirm this attachment",
        }),
      }),
    })
    .superRefine((data, ctx) => {
      if (maritalStatus === "married") {
        if (
          !data.spouseSignature.signatureId ||
          data.spouseSignature.signatureId.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Spouse signature is required",
            path: ["spouseSignature", "signatureId"],
          });
        }
        if (
          !data.spouseSignature.date ||
          data.spouseSignature.date.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Spouse signature date is required",
            path: ["spouseSignature", "date"],
          });
        }
      }
    });
