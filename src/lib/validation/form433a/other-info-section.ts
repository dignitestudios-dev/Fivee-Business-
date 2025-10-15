import { z } from "zod";

export const otherInfoInitialValues: OtherInfoFormSchema = {
  litigation: {
    isInvolvedInLitigation: false,
    plaintiff: "",
    defendant: "",
    locationOfFiling: "",
    representedBy: "",
    docketCaseNumber: "",
    amountOfDispute: 0,
    possibleCompletionDate: "",
    subjectOfLitigation: "",
  },
  bankruptcy: {
    filedBankruptcyInPast7Years: false,
    dateFiled: "",
    dateDismissed: "",
    dateDischarged: "",
    petitionNumber: "",
    locationFiled: "",
  },
  foreignResidence: {
    livedOutsideUS: false,
    dateFrom: "",
    dateTo: "",
  },
  irsLitigation: {
    involvedWithIRSLitigation: false,
    taxDebtDetails: "",
  },
  trustBeneficiary: {
    isBeneficiary: false,
    placeRecorded: "",
    ein: "",
    nameOfTrust: "",
    anticipatedAmount: 0,
    whenAmountReceived: "",
  },
  trustFiduciary: {
    isTrusteeOrFiduciary: false,
    nameOfTrust: "",
    ein: "",
  },
  safeDepositBox: {
    hasSafeDepositBox: false,
    boxes: [],
  },
  assetTransfers: {
    transferredAssets: false,
    transfers: [],
  },
  foreignAssets: {
    hasForeignAssets: false,
    assets: [],
  },
  thirdPartyTrusts: {
    hasThirdPartyTrustFunds: false,
    funds: [],
  },
};

export const otherInfoSchema = z
  .object({
    litigation: z.object({
      isInvolvedInLitigation: z.boolean(),
      plaintiff: z.string().optional(),
      defendant: z.string().optional(),
      locationOfFiling: z.string().optional(),
      representedBy: z.string().optional(),
      docketCaseNumber: z.string().optional(),
      amountOfDispute: z.coerce
        .number()
        .min(0, "Amount must be 0 or greater")
        .optional(),
      possibleCompletionDate: z.string().optional(),
      subjectOfLitigation: z.string().optional(),
    }),
    bankruptcy: z.object({
      filedBankruptcyInPast7Years: z.boolean(),
      dateFiled: z.string().optional(),
      dateDismissed: z.string().optional(),
      dateDischarged: z.string().optional(),
      petitionNumber: z.string().optional(),
      locationFiled: z.string().optional(),
    }),
    foreignResidence: z.object({
      livedOutsideUS: z.boolean(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }),
    irsLitigation: z.object({
      involvedWithIRSLitigation: z.boolean(),
      taxDebtDetails: z.string().optional(),
    }),
    trustBeneficiary: z.object({
      isBeneficiary: z.boolean(),
      placeRecorded: z.string().optional(),
      ein: z.string().optional(),
      nameOfTrust: z.string().optional(),
      anticipatedAmount: z.coerce
        .number()
        .min(0, "Amount must be 0 or greater")
        .optional(),
      whenAmountReceived: z.string().optional(),
    }),
    trustFiduciary: z.object({
      isTrusteeOrFiduciary: z.boolean(),
      nameOfTrust: z.string().optional(),
      ein: z.string().optional(),
    }),
    safeDepositBox: z.object({
      hasSafeDepositBox: z.boolean(),
      boxes: z
        .array(
          z.object({
            location: z.string().min(1, "Location is required"),
            contents: z.string().min(1, "Contents are required"),
            value: z.coerce.number().min(0, "Value must be 0 or greater"),
          })
        )
        .optional(),
    }),
    assetTransfers: z.object({
      transferredAssets: z.boolean(),
      transfers: z
        .array(
          z.object({
            assetDescription: z
              .string()
              .min(1, "Asset description is required"),
            valueAtTransfer: z.coerce
              .number()
              .min(0, "Value must be 0 or greater"),
            dateTransferred: z.string().min(1, "Date is required"),
            transferredTo: z.string().min(1, "Recipient is required"),
          })
        )
        .optional(),
    }),
    foreignAssets: z.object({
      hasForeignAssets: z.boolean(),
      assets: z
        .array(
          z.object({
            description: z.string().min(1, "Description is required"),
            location: z.string().min(1, "Location is required"),
            value: z.coerce.number().min(0, "Value must be 0 or greater"),
          })
        )
        .optional(),
    }),
    thirdPartyTrusts: z.object({
      hasThirdPartyTrustFunds: z.boolean(),
      funds: z
        .array(
          z.object({
            location: z.string().min(1, "Location is required"),
            amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
          })
        )
        .optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for litigation
    if (data.litigation.isInvolvedInLitigation) {
      if (!data.litigation.plaintiff) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "plaintiff"],
          message: "Plaintiff is required when involved in litigation",
        });
      }
      if (!data.litigation.defendant) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "defendant"],
          message: "Defendant is required when involved in litigation",
        });
      }
      if (!data.litigation.locationOfFiling) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "locationOfFiling"],
          message: "Location of filing is required when involved in litigation",
        });
      }
      if (!data.litigation.representedBy) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "representedBy"],
          message: "Represented by is required when involved in litigation",
        });
      }
      if (!data.litigation.docketCaseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "docketCaseNumber"],
          message: "Docket/Case number is required when involved in litigation",
        });
      }
      if (data.litigation.amountOfDispute === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "amountOfDispute"],
          message: "Amount of dispute is required when involved in litigation",
        });
      }
      if (!data.litigation.possibleCompletionDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "possibleCompletionDate"],
          message:
            "Possible completion date is required when involved in litigation",
        });
      }
      if (!data.litigation.subjectOfLitigation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "subjectOfLitigation"],
          message:
            "Subject of litigation is required when involved in litigation",
        });
      }
    }

    // Conditional validation for bankruptcy
    if (data.bankruptcy.filedBankruptcyInPast7Years) {
      if (!data.bankruptcy.dateFiled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankruptcy", "dateFiled"],
          message: "Date filed is required when bankruptcy was filed",
        });
      }
      if (!data.bankruptcy.dateDismissed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankruptcy", "dateDismissed"],
          message: "Date dismissed is required when bankruptcy was filed",
        });
      }
      if (!data.bankruptcy.dateDischarged) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankruptcy", "dateDischarged"],
          message: "Date discharged is required when bankruptcy was filed",
        });
      }
      if (!data.bankruptcy.petitionNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankruptcy", "petitionNumber"],
          message: "Petition number is required when bankruptcy was filed",
        });
      }
      if (!data.bankruptcy.locationFiled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankruptcy", "locationFiled"],
          message: "Location filed is required when bankruptcy was filed",
        });
      }
    }

    // Conditional validation for foreign residence
    if (data.foreignResidence.livedOutsideUS) {
      if (!data.foreignResidence.dateFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foreignResidence", "dateFrom"],
          message: "Date from is required when lived outside US",
        });
      }
      if (!data.foreignResidence.dateTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foreignResidence", "dateTo"],
          message: "Date to is required when lived outside US",
        });
      }
    }

    // Conditional validation for IRS litigation
    if (data.irsLitigation.involvedWithIRSLitigation) {
      if (!data.irsLitigation.taxDebtDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["irsLitigation", "taxDebtDetails"],
          message:
            "Tax debt details are required when involved with IRS litigation",
        });
      }
    }

    // Conditional validation for trust beneficiary
    if (data.trustBeneficiary.isBeneficiary) {
      if (!data.trustBeneficiary.placeRecorded) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustBeneficiary", "placeRecorded"],
          message: "Place recorded is required when a trust beneficiary",
        });
      }
      if (!data.trustBeneficiary.ein) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustBeneficiary", "ein"],
          message: "EIN is required when a trust beneficiary",
        });
      }
      if (!data.trustBeneficiary.nameOfTrust) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustBeneficiary", "nameOfTrust"],
          message: "Name of trust is required when a trust beneficiary",
        });
      }
      if (data.trustBeneficiary.anticipatedAmount === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustBeneficiary", "anticipatedAmount"],
          message: "Anticipated amount is required when a trust beneficiary",
        });
      }
      if (!data.trustBeneficiary.whenAmountReceived) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustBeneficiary", "whenAmountReceived"],
          message: "When amount received is required when a trust beneficiary",
        });
      }
    }

    // Conditional validation for trust fiduciary
    if (data.trustFiduciary.isTrusteeOrFiduciary) {
      if (!data.trustFiduciary.nameOfTrust) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustFiduciary", "nameOfTrust"],
          message: "Name of trust is required when a trustee or fiduciary",
        });
      }
      if (!data.trustFiduciary.ein) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trustFiduciary", "ein"],
          message: "EIN is required when a trustee or fiduciary",
        });
      }
    }

    // Conditional validation for safe deposit box
    if (
      data.safeDepositBox.hasSafeDepositBox &&
      data.safeDepositBox?.boxes?.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["safeDepositBox", "boxes"],
        message:
          "At least one safe deposit box entry is required when hasSafeDepositBox is true",
      });
    }

    // Conditional validation for asset transfers
    if (
      data.assetTransfers.transferredAssets &&
      data?.assetTransfers?.transfers?.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assetTransfers", "transfers"],
        message:
          "At least one asset transfer entry is required when transferredAssets is true",
      });
    }

    // Conditional validation for foreign assets
    if (
      data.foreignAssets.hasForeignAssets &&
      data?.foreignAssets?.assets?.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["foreignAssets", "assets"],
        message:
          "At least one foreign asset entry is required when hasForeignAssets is true",
      });
    }

    // Conditional validation for third party trusts
    if (
      data.thirdPartyTrusts.hasThirdPartyTrustFunds &&
      data?.thirdPartyTrusts?.funds?.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["thirdPartyTrusts", "funds"],
        message:
          "At least one trust fund entry is required when hasThirdPartyTrustFunds is true",
      });
    }
  });
