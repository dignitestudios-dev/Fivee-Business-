import { z } from "zod";

// Helper function to check if a date is not in the past
const isNotPastDate = (dateString: string): boolean => {
  if (!dateString) return true;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

// Helper function to validate date format and not in past
const validateNotPastDate = (dateString: string | undefined): boolean => {
  if (!dateString) return true;
  return isNotPastDate(dateString);
};

// Helper function to check if "to date" is greater than "from date"
const isToDateAfterFromDate = (fromDate: string, toDate: string): boolean => {
  if (!fromDate || !toDate) return true;
  return new Date(toDate) > new Date(fromDate);
};

// Helper function to check if there's at least 6 months gap between dates
const hasSixMonthsGap = (fromDate: string, toDate: string): boolean => {
  if (!fromDate || !toDate) return true;

  const from = new Date(fromDate);
  const to = new Date(toDate);

  // Calculate month difference
  const monthsDifference =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  return monthsDifference >= 6;
};

// Helper function to check if a date is not in the future (can be past or present)
const isNotFutureDate = (dateString: string): boolean => {
  if (!dateString) return true;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today to allow today's date
  return selectedDate <= today;
};

// Helper function to validate date is not in future
const validateNotFutureDate = (dateString: string | undefined): boolean => {
  if (!dateString) return true;
  return isNotFutureDate(dateString);
};

export const otherInfoInitialValues: OtherInfoFormSchema = {
  litigation: {
    isInvolvedInLitigation: false,
    locationOfFiling: "",
    representedBy: "",
    docketCaseNumber: "",
    amountOfDispute: "",
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
    anticipatedAmount: "",
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
      locationOfFiling: z.string().optional(),
      representedBy: z.string().optional(),
      docketCaseNumber: z.string().optional(),
      amountOfDispute: z.coerce
        .number({ message: "Must be a number" })
        .min(0, "Amount must be 0 or greater")
        .optional(),
      possibleCompletionDate: z
        .string()
        .optional()
        .refine((val) => !val || validateNotPastDate(val), {
          message: "Possible completion date cannot be in the past",
        }),
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
        .number({ message: "Must be a number" })
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
            value: z.coerce.number({ message: "Must be a number" }).min(0, "Value must be 0 or greater"),
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
              .number({ message: "Must be a number" })
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
            value: z.coerce.number({ message: "Must be a number" }).min(0, "Value must be 0 or greater"),
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
            amount: z.coerce.number({ message: "Must be a number" }).min(0, "Amount must be 0 or greater"),
          })
        )
        .optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for litigation
    if (data.litigation.isInvolvedInLitigation) {
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
      } else if (!isNotPastDate(data.litigation.possibleCompletionDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litigation", "possibleCompletionDate"],
          message: "Possible completion date cannot be in the past",
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

      // Validate that "to date" is after "from date"
      if (data.foreignResidence.dateFrom && data.foreignResidence.dateTo) {
        if (
          !isToDateAfterFromDate(
            data.foreignResidence.dateFrom,
            data.foreignResidence.dateTo
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["foreignResidence", "dateTo"],
            message: "End date must be after start date",
          });
        }

        // Validate 6 months gap
        if (
          !hasSixMonthsGap(
            data.foreignResidence.dateFrom,
            data.foreignResidence.dateTo
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["foreignResidence", "dateTo"],
            message:
              "Must have at least 6 months gap between start and end dates",
          });
        }
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

    // Additional validation for asset transfer dates
    if (
      data.assetTransfers.transferredAssets &&
      data.assetTransfers.transfers
    ) {
      data.assetTransfers.transfers.forEach((transfer, index) => {
        if (
          transfer.dateTransferred &&
          !validateNotFutureDate(transfer.dateTransferred)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["assetTransfers", "transfers", index, "dateTransferred"],
            message: "Date transferred cannot be in the future",
          });
        }
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
