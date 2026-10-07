import * as z from "zod";
import {
  COUNTRY_RE,
  MESSAGES,
  NAME_RE,
  TREATY_ARTICLE_RE,
  W7_LIMITS,
  isValidSsnOrItin,
  requireText,
} from "./rules";

// Reason codes a-g are mutually exclusive on the IRS form; h may be added on top.
export const W7_PRIMARY_REASONS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
] as const;

// Fields below that depend on the chosen reason are plain strings here and are
// checked inside superRefine only while they are shown, so a stale value left
// behind after changing reason never blocks submitting.
export const applicationInfoSchema = z
  .object({
    applicationType: z.enum(["new", "renewal"], {
      error: "Select whether this is a new ITIN or a renewal",
    }),
    primaryReason: z.enum(W7_PRIMARY_REASONS).or(z.literal("")),
    includeOtherReason: z.boolean(),
    claimingException: z.boolean(),
    otherReason: z.string(),
    treatyCountry: z.string(),
    treatyArticleNumber: z.string(),
    relationshipToCitizenResident: z.string(),
    citizenResidentName: z.string(),
    citizenResidentTin: z.string(),
  })
  .superRefine((value, ctx) => {
    const reason = value.primaryReason;

    if (!reason && !value.includeOtherReason) {
      ctx.addIssue({
        code: "custom",
        path: ["primaryReason"],
        message: "Select the reason you are submitting Form W-7",
      });
    }

    // claimingException is only meaningful for reason f
    if (value.claimingException && reason !== "f") {
      ctx.addIssue({
        code: "custom",
        path: ["claimingException"],
        message:
          "An exception may only be claimed with reason f (student, professor, or researcher)",
      });
    }

    // Reason a always travels with h; so does f when an exception is claimed
    const requiresOtherReason =
      reason === "a" || (reason === "f" && value.claimingException);

    if (requiresOtherReason && !value.includeOtherReason) {
      ctx.addIssue({
        code: "custom",
        path: ["includeOtherReason"],
        message:
          reason === "a"
            ? "Reason a must also include reason h with an explanation"
            : "Claiming an exception under reason f also requires reason h",
      });
    }

    if (value.includeOtherReason) {
      requireText(
        ctx,
        ["otherReason"],
        value.otherReason,
        "The explanation",
        { max: W7_LIMITS.otherReason },
        "Enter the explanation or IRS exception for reason h"
      );
    }

    if (requiresOtherReason) {
      requireText(
        ctx,
        ["treatyCountry"],
        value.treatyCountry,
        "Treaty country",
        {
          max: W7_LIMITS.treatyCountry,
          pattern: COUNTRY_RE,
          patternMessage: `Treaty country ${MESSAGES.country}`,
        },
        "Enter the treaty country"
      );
      requireText(
        ctx,
        ["treatyArticleNumber"],
        value.treatyArticleNumber,
        "Treaty article number",
        {
          max: W7_LIMITS.treatyArticle,
          pattern: TREATY_ARTICLE_RE,
          patternMessage:
            "Treaty article number can only contain letters, numbers, spaces, and ( ) . , / -",
        },
        "Enter the treaty article number"
      );
    }

    if (reason === "d") {
      requireText(
        ctx,
        ["relationshipToCitizenResident"],
        value.relationshipToCitizenResident,
        "The relationship",
        {
          max: W7_LIMITS.relationship,
          pattern: NAME_RE,
          patternMessage: `The relationship ${MESSAGES.name}`,
        },
        "Enter the relationship to the U.S. citizen/resident alien (for example, child)"
      );
    }

    if (reason === "d" || reason === "e") {
      requireText(
        ctx,
        ["citizenResidentName"],
        value.citizenResidentName,
        "The name",
        {
          max: W7_LIMITS.citizenResidentName,
          pattern: NAME_RE,
          patternMessage: `The name ${MESSAGES.name}`,
        },
        "Enter the name of the U.S. citizen/resident alien"
      );

      const tin = value.citizenResidentTin.trim();
      if (!tin) {
        ctx.addIssue({
          code: "custom",
          path: ["citizenResidentTin"],
          message: "Enter the SSN or ITIN of the U.S. citizen/resident alien",
        });
      } else if (!isValidSsnOrItin(tin)) {
        ctx.addIssue({
          code: "custom",
          path: ["citizenResidentTin"],
          message:
            "Enter a valid 9-digit SSN or ITIN, for example 123-45-6789",
        });
      }
    }
  });

export type W7ApplicationInfoForm = z.infer<typeof applicationInfoSchema>;

export const applicationInfoInitialValues: W7ApplicationInfoForm = {
  applicationType: "new",
  primaryReason: "",
  includeOtherReason: false,
  claimingException: false,
  otherReason: "",
  treatyCountry: "",
  treatyArticleNumber: "",
  relationshipToCitizenResident: "",
  citizenResidentName: "",
  citizenResidentTin: "",
};
