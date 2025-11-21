import z from "zod";

type MaritalStatus = "married" | "unmarried";

export interface SignatureFormSchema {
  taxpayerSignature: {
    // signatureId: string;
    date: string;
  };
  spouseSignature: {
    // signatureId: string;
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
    // signatureId: "",
    date: "",
  },
  spouseSignature: {
    // signatureId: "",
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
        // signatureId: z.string().min(1, "Taxpayer signature is required"),
        date: z.string().min(1, "Taxpayer date is required"),
      }),
      spouseSignature: z
        .object({
          // signatureId: z.string().optional().default(""),
          date: z.string().optional().default(""),
        })
        .optional(),
      attachments: z.object({
        payStubs: z.boolean().optional().default(false),
        investmentStatements: z.boolean().optional().default(false),
        digitalAssetsDocs: z.boolean().optional().default(false),
        otherIncomeStatements: z.boolean().optional().default(false),
        bankStatements: z.boolean().optional().default(false),
        form433B: z.boolean().optional().default(false),
        loanStatements: z.boolean().optional().default(false),
        accountsReceivable: z.boolean().optional().default(false),
        taxLiabilityVerification: z.boolean().optional().default(false),
        courtOrders: z.boolean().optional().default(false),
        trustDocuments: z.boolean().optional().default(false),
        specialCircumstancesDocs: z.boolean().optional().default(false),
        form2848: z.boolean().optional().default(false),
        form656: z.boolean().optional().default(false),
      }),
    })
    .superRefine((data, ctx) => {
      if (maritalStatus === "married") {
        // if (
        //   !data.spouseSignature.signatureId ||
        //   data.spouseSignature.signatureId.trim() === ""
        // ) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Spouse signature is required",
        //     path: ["spouseSignature", "signatureId"],
        //   });
        // }
        if (
          !data.spouseSignature?.date ||
          data.spouseSignature?.date.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Spouse signature date is required",
            path: ["spouseSignature", "date"],
          });
        }
      }
    });
