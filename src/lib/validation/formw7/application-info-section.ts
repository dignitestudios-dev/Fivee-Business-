import * as z from "zod";

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

    if (value.includeOtherReason && !value.otherReason.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["otherReason"],
        message: "Enter the explanation or IRS exception for reason h",
      });
    }

    if (requiresOtherReason) {
      if (!value.treatyCountry.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["treatyCountry"],
          message: "Enter the treaty country",
        });
      }
      if (!value.treatyArticleNumber.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["treatyArticleNumber"],
          message: "Enter the treaty article number",
        });
      }
    }

    if (reason === "d" && !value.relationshipToCitizenResident.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["relationshipToCitizenResident"],
        message:
          "Enter the relationship to the U.S. citizen/resident alien (for example, child)",
      });
    }

    if (reason === "d" || reason === "e") {
      if (!value.citizenResidentName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["citizenResidentName"],
          message: "Enter the name of the U.S. citizen/resident alien",
        });
      }
      if (!value.citizenResidentTin.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["citizenResidentTin"],
          message: "Enter the SSN or ITIN of the U.S. citizen/resident alien",
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
