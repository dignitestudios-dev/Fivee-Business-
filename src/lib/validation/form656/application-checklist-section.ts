import * as z from "zod";

export const applicationChecklistSchema = z.object({
  completedAllFieldsAndSigned: z
    .boolean()
    .refine((val) => val === true, "Required"),
  offerAmountMatchesCalculation: z
    .boolean()
    .refine((val) => val === true, "Required"),
  filedAllRequiredReturns: z
    .boolean()
    .refine((val) => val === true, "Required"),
  includedRecentTaxReturnCopy: z
    .boolean()
    .refine((val) => val === true, "Required"),
  selectedPaymentOption: z.boolean().refine((val) => val === true, "Required"),
  signedForm433A: z.boolean().refine((val) => val === true, "Required"),
  signedForm433B: z.boolean().refine((val) => val === true, "Required"),
  signedForm656: z.boolean().refine((val) => val === true, "Required"),
  separatePackageForBusinessAndIndividual: z
    .boolean()
    .refine((val) => val === true, "Required"),
  includedSupportingDocumentation: z
    .boolean()
    .refine((val) => val === true, "Required"),
  includedForm2848Or8821: z.boolean().refine((val) => val === true, "Required"),
  providedAuthorizationDocumentation: z
    .boolean()
    .refine((val) => val === true, "Required"),
  includedInitialPayment: z.boolean().refine((val) => val === true, "Required"),
  includedApplicationFee: z.boolean().refine((val) => val === true, "Required"),
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
