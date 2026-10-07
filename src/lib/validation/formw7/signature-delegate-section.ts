import * as z from "zod";

export const W7_DELEGATE_RELATIONSHIPS = [
  "parent",
  "power-of-attorney",
  "court-appointed-guardian",
] as const;

export const W7_DELEGATE_RELATIONSHIP_LABELS: Record<
  (typeof W7_DELEGATE_RELATIONSHIPS)[number],
  string
> = {
  parent: "Parent",
  "power-of-attorney": "Power of attorney",
  "court-appointed-guardian": "Court-appointed guardian",
};

export const signatureDelegateSchema = z
  .object({
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    signedByDelegate: z.boolean(),
    delegateName: z.string(),
    delegateRelationship: z
      .enum(W7_DELEGATE_RELATIONSHIPS)
      .or(z.literal("")),
    acknowledgesOriginalSignatureRequired: z.literal(true, {
      error:
        "You must acknowledge that the printed form requires an original signature",
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.signedByDelegate) return;

    if (!value.delegateName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["delegateName"],
        message: "Enter the name of the delegate who will sign",
      });
    }
    if (!value.delegateRelationship) {
      ctx.addIssue({
        code: "custom",
        path: ["delegateRelationship"],
        message: "Select the delegate's relationship to the applicant",
      });
    }
  });

export type W7SignatureDelegateForm = z.infer<typeof signatureDelegateSchema>;

export const signatureDelegateInitialValues: W7SignatureDelegateForm = {
  phoneNumber: "",
  signedByDelegate: false,
  delegateName: "",
  delegateRelationship: "",
  acknowledgesOriginalSignatureRequired: true,
};
