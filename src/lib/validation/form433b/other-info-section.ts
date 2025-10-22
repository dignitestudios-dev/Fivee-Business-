import z from "zod";

export const otherInfoInitialValues = {
  isCurrentlyInBankruptcy: false,
  hasFiledBankruptcyInPast10Years: false,
  bankruptcyHistory: {
    dateFiled: "",
    dateDismissedOrDischarged: "",
    petitionNumber: "",
    locationFiled: "",
  },
  hasOtherBusinessAffiliations: false,
  businessAffiliations: [],
  doRelatedPartiesOweMoney: false,
  isCurrentlyOrPastPartyToLitigation: false,
  litigationHistory: [],
  hasBeenPartyToLitigationWithIRS: false,
  irsLitigationTaxDetails: "",
  hasTransferredAssetsOver10kInPast10Years: false,
  assetTransfersOver10k: [],
  hasTransferredRealPropertyInPast3Years: false,
  realPropertyTransfers: [],
  hasBeenLocatedOutsideUS: false,
  hasAssetsOutsideUS: false,
  foreignAssets: [],
  hasFundsHeldInTrust: false,
  fundsHeldInTrustAmount: 0,
  fundsHeldInTrustLocation: "",
  hasLinesOfCredit: false,
  lineOfCredit: {
    creditLimit: 0,
    amountOwed: 0,
    propertySecuring: "",
  },
};

const bankruptcyHistorySchema = z.object({
  dateFiled: z.string(),
  dateDismissedOrDischarged: z.string(),
  petitionNumber: z.string(),
  locationFiled: z.string(),
});

const businessAffiliationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employerIdentificationNumber: z.string().min(1, "EIN is required"),
});

const litigationHistorySchema = z.object({
  role: z.enum(["Plaintiff", "Defendant"]),
  locationOfFiling: z.string().min(1, "Location is required"),
  representedBy: z.string().min(1, "Represented by is required"),
  docketCaseNumber: z.string().min(1, "Docket/case number is required"),
  amountInDispute: z.number().min(0),
  possibleCompletionDate: z.string(),
  subjectOfLitigation: z.string().min(1, "Subject is required"),
});

const assetTransferSchema = z.object({
  date: z.string(),
  value: z.number().min(0),
  typeOfAsset: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
});

const foreignAssetSchema = z.object({
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  value: z.number().min(0),
});

const lineOfCreditSchema = z.object({
  creditLimit: z.number().min(0),
  amountOwed: z.number().min(0),
  propertySecuring: z.string(),
});

export const otherInfoSchemaFormB = z
  .object({
    isCurrentlyInBankruptcy: z.boolean(),
    hasFiledBankruptcyInPast10Years: z.boolean(),
    bankruptcyHistory: bankruptcyHistorySchema.optional(),
    hasOtherBusinessAffiliations: z.boolean(),
    businessAffiliations: z.array(businessAffiliationSchema),
    doRelatedPartiesOweMoney: z.boolean(),
    isCurrentlyOrPastPartyToLitigation: z.boolean(),
    litigationHistory: z.array(litigationHistorySchema),
    hasBeenPartyToLitigationWithIRS: z.boolean(),
    irsLitigationTaxDetails: z.string().optional(),
    hasTransferredAssetsOver10kInPast10Years: z.boolean(),
    assetTransfersOver10k: z.array(assetTransferSchema),
    hasTransferredRealPropertyInPast3Years: z.boolean(),
    realPropertyTransfers: z.array(assetTransferSchema),
    hasBeenLocatedOutsideUS: z.boolean(),
    hasAssetsOutsideUS: z.boolean(),
    foreignAssets: z.array(foreignAssetSchema),
    hasFundsHeldInTrust: z.boolean(),
    fundsHeldInTrustAmount: z.number().min(0).optional(),
    fundsHeldInTrustLocation: z.string().optional(),
    hasLinesOfCredit: z.boolean(),
    lineOfCredit: lineOfCreditSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasFiledBankruptcyInPast10Years) {
      if (!data.bankruptcyHistory?.dateFiled) {
        ctx.addIssue({
          code: "custom",
          message: "Date filed is required",
          path: ["bankruptcyHistory.dateFiled"],
        });
      }
      if (!data.bankruptcyHistory?.dateDismissedOrDischarged) {
        ctx.addIssue({
          code: "custom",
          message: "Date dismissed or discharged is required",
          path: ["bankruptcyHistory.dateDismissedOrDischarged"],
        });
      }
      if (!data.bankruptcyHistory?.petitionNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Petition number is required",
          path: ["bankruptcyHistory.petitionNumber"],
        });
      }
      if (!data.bankruptcyHistory?.locationFiled) {
        ctx.addIssue({
          code: "custom",
          message: "Location filed is required",
          path: ["bankruptcyHistory.locationFiled"],
        });
      }
    }
    if (data.hasOtherBusinessAffiliations) {
      if (data.businessAffiliations.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one business affiliation is required",
          path: ["businessAffiliations"],
        });
      }
      data.businessAffiliations.forEach((aff, i) => {
        if (!aff.name) {
          ctx.addIssue({
            code: "custom",
            message: "Name is required",
            path: ["businessAffiliations", i, "name"],
          });
        }
        if (!aff.employerIdentificationNumber) {
          ctx.addIssue({
            code: "custom",
            message: "EIN is required",
            path: ["businessAffiliations", i, "employerIdentificationNumber"],
          });
        }
      });
    }
    if (data.isCurrentlyOrPastPartyToLitigation) {
      if (data.litigationHistory.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one litigation history entry is required",
          path: ["litigationHistory"],
        });
      }
      data.litigationHistory.forEach((lit, i) => {
        if (!lit.role) {
          ctx.addIssue({
            code: "custom",
            message: "Role is required",
            path: ["litigationHistory", i, "role"],
          });
        }
        if (!lit.locationOfFiling) {
          ctx.addIssue({
            code: "custom",
            message: "Location of filing is required",
            path: ["litigationHistory", i, "locationOfFiling"],
          });
        }
        if (!lit.representedBy) {
          ctx.addIssue({
            code: "custom",
            message: "Represented by is required",
            path: ["litigationHistory", i, "representedBy"],
          });
        }
        if (!lit.docketCaseNumber) {
          ctx.addIssue({
            code: "custom",
            message: "Docket/case number is required",
            path: ["litigationHistory", i, "docketCaseNumber"],
          });
        }
        if (lit.amountInDispute < 0) {
          ctx.addIssue({
            code: "custom",
            message: "Amount in dispute must be non-negative",
            path: ["litigationHistory", i, "amountInDispute"],
          });
        }
        if (!lit.possibleCompletionDate) {
          ctx.addIssue({
            code: "custom",
            message: "Possible completion date is required",
            path: ["litigationHistory", i, "possibleCompletionDate"],
          });
        }
        if (!lit.subjectOfLitigation) {
          ctx.addIssue({
            code: "custom",
            message: "Subject of litigation is required",
            path: ["litigationHistory", i, "subjectOfLitigation"],
          });
        }
      });
    }
    if (data.hasBeenPartyToLitigationWithIRS) {
      if (
        !data.irsLitigationTaxDetails ||
        data.irsLitigationTaxDetails.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "IRS litigation tax details are required",
          path: ["irsLitigationTaxDetails"],
        });
      }
    }
    if (data.hasTransferredAssetsOver10kInPast10Years) {
      if (data.assetTransfersOver10k.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one asset transfer is required",
          path: ["assetTransfersOver10k"],
        });
      }
      data.assetTransfersOver10k.forEach((trans, i) => {
        if (!trans.date) {
          ctx.addIssue({
            code: "custom",
            message: "Date is required",
            path: ["assetTransfersOver10k", i, "date"],
          });
        }
        if (trans.value < 0) {
          ctx.addIssue({
            code: "custom",
            message: "Value must be non-negative",
            path: ["assetTransfersOver10k", i, "value"],
          });
        }
        if (!trans.typeOfAsset) {
          ctx.addIssue({
            code: "custom",
            message: "Type of asset is required",
            path: ["assetTransfersOver10k", i, "typeOfAsset"],
          });
        }
        if (!trans.description) {
          ctx.addIssue({
            code: "custom",
            message: "Description is required",
            path: ["assetTransfersOver10k", i, "description"],
          });
        }
      });
    }
    if (data.hasTransferredRealPropertyInPast3Years) {
      if (data.realPropertyTransfers.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one real property transfer is required",
          path: ["realPropertyTransfers"],
        });
      }
      data.realPropertyTransfers.forEach((trans, i) => {
        if (!trans.date) {
          ctx.addIssue({
            code: "custom",
            message: "Date is required",
            path: ["realPropertyTransfers", i, "date"],
          });
        }
        if (trans.value < 0) {
          ctx.addIssue({
            code: "custom",
            message: "Value must be non-negative",
            path: ["realPropertyTransfers", i, "value"],
          });
        }
        if (!trans.typeOfAsset) {
          ctx.addIssue({
            code: "custom",
            message: "Type of asset is required",
            path: ["realPropertyTransfers", i, "typeOfAsset"],
          });
        }
        if (!trans.description) {
          ctx.addIssue({
            code: "custom",
            message: "Description is required",
            path: ["realPropertyTransfers", i, "description"],
          });
        }
      });
    }
    if (data.hasAssetsOutsideUS) {
      if (data.foreignAssets.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one foreign asset is required",
          path: ["foreignAssets"],
        });
      }
      data.foreignAssets.forEach((asset, i) => {
        if (!asset.description) {
          ctx.addIssue({
            code: "custom",
            message: "Description is required",
            path: ["foreignAssets", i, "description"],
          });
        }
        if (!asset.location) {
          ctx.addIssue({
            code: "custom",
            message: "Location is required",
            path: ["foreignAssets", i, "location"],
          });
        }
        if (asset.value < 0) {
          ctx.addIssue({
            code: "custom",
            message: "Value must be non-negative",
            path: ["foreignAssets", i, "value"],
          });
        }
      });
    }
    if (data.hasFundsHeldInTrust) {
      if (
        data.fundsHeldInTrustAmount === undefined ||
        data.fundsHeldInTrustAmount < 0
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Funds held in trust amount is required and must be non-negative",
          path: ["fundsHeldInTrustAmount"],
        });
      }
      if (
        !data.fundsHeldInTrustLocation ||
        data.fundsHeldInTrustLocation.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Funds held in trust location is required",
          path: ["fundsHeldInTrustLocation"],
        });
      }
    }
    if (data.hasLinesOfCredit) {
      if (
        data.lineOfCredit?.creditLimit === undefined ||
        data.lineOfCredit.creditLimit < 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Credit limit is required and must be non-negative",
          path: ["lineOfCredit.creditLimit"],
        });
      }
      if (
        data.lineOfCredit?.amountOwed === undefined ||
        data.lineOfCredit.amountOwed < 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Amount owed is required and must be non-negative",
          path: ["lineOfCredit.amountOwed"],
        });
      }
      if (
        !data.lineOfCredit?.propertySecuring ||
        data.lineOfCredit.propertySecuring.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Property securing is required",
          path: ["lineOfCredit.propertySecuring"],
        });
      }
    }
  });
