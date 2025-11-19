import * as z from "zod";

export const applicationChecklistSchema = z.object({
  completedAllFieldsAndSigned: z.boolean().optional().default(false),
  offerAmountMatchesCalculation: z.boolean().optional().default(false),
  filedAllRequiredReturns: z.boolean().optional().default(false),
  includedRecentTaxReturnCopy: z.boolean().optional().default(false),
  selectedPaymentOption: z.boolean().optional().default(false),
  signedForm433A: z.boolean().optional().default(false),
  signedForm433B: z.boolean().optional().default(false),
  signedForm656: z.boolean().optional().default(false),
  separatePackageForBusinessAndIndividual: z
    .boolean()
    .optional()
    .default(false),
  includedSupportingDocumentation: z.boolean().optional().default(false),
  includedForm2848Or8821: z.boolean().optional().default(false),
  providedAuthorizationDocumentation: z.boolean().optional().default(false),
  includedInitialPayment: z.boolean().optional().default(false),
  includedApplicationFee: z.boolean().optional().default(false),
});

export const applicationChecklistInitialValues: ApplicationChecklistFormSchema =
  {
    completedAllFieldsAndSigned: false,
    offerAmountMatchesCalculation: false,
    filedAllRequiredReturns: false,
    includedRecentTaxReturnCopy: false,
    selectedPaymentOption: false,
    signedForm433A: false,
    signedForm433B: false,
    signedForm656: false,
    separatePackageForBusinessAndIndividual: false,
    includedSupportingDocumentation: false,
    includedForm2848Or8821: false,
    providedAuthorizationDocumentation: false,
    includedInitialPayment: false,
    includedApplicationFee: false,
  };
