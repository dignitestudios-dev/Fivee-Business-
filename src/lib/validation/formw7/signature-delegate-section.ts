import * as z from "zod";
import {
  MESSAGES,
  NAME_RE,
  W7_LIMITS,
  W7_BOX,
  isValidPhone,
  requireText,
} from "./rules";

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

export const PHONE_MESSAGE =
  "Enter a valid 10-digit phone number, for example (212) 555-0199, or start with + for international numbers";

export const signatureDelegateSchema = z
  .object({
    phoneNumber: z.string(),
    signedByDelegate: z.boolean(),
    delegateName: z.string(),
    delegateRelationship: z
      .enum(W7_DELEGATE_RELATIONSHIPS)
      .or(z.literal("")),
    // Starts unticked. A boolean (not z.literal(true)) so the form can hold the
    // unticked state; the refine below is what insists it is ticked to continue.
    acknowledgesOriginalSignatureRequired: z.boolean().refine((value) => value === true, {
      message:
        "You must acknowledge that the printed form requires an original signature",
    }),
  })
  .superRefine((value, ctx) => {
    const phone = value.phoneNumber.trim();
    if (!phone) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: "Phone number is required",
      });
    } else if (phone.length > W7_LIMITS.phone) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: `Phone number cannot exceed ${W7_LIMITS.phone} characters`,
      });
    } else if (!isValidPhone(phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: PHONE_MESSAGE,
      });
    }

    if (!value.signedByDelegate) return;

    requireText(
      ctx,
      ["delegateName"],
      value.delegateName,
      "The delegate's name",
      {
        max: W7_LIMITS.delegateName, box: W7_BOX.delegateName,
        min: 2,
        pattern: NAME_RE,
        patternMessage: `The delegate's name ${MESSAGES.name}`,
      },
      "Enter the name of the delegate who will sign"
    );
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
  acknowledgesOriginalSignatureRequired: false,
};
