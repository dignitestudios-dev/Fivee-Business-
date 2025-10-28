import * as z from "zod";

const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const signaturesSchema656 = z.object({
  taxpayerSignature: z.string().min(1, "Taxpayer signature required"),
  taxpayerSignatureDate: z.string().min(1, "Date required"),
  taxpayerPhoneNumber: z
    .string()
    .regex(phoneLooseRegex, "Invalid phone number")
    .optional(),
  taxpayerPhoneAuthorization: z.boolean().optional(),
  spouseOrOfficerSignature: z.string().optional(),
  spouseOrOfficerSignatureDate: z.string().optional(),
  spouseOrOfficerPhoneNumber: z
    .string()
    .regex(phoneLooseRegex, "Invalid phone number")
    .optional(),
  spouseOrOfficerPhoneAuthorization: z.boolean().optional(),
});

export const signaturesInitialValues: SignaturesFormSchema = {
  taxpayerSignature: "",
  taxpayerSignatureDate: "",
  taxpayerPhoneNumber: "",
  taxpayerPhoneAuthorization: false,
  spouseOrOfficerSignature: "",
  spouseOrOfficerSignatureDate: "",
  spouseOrOfficerPhoneNumber: "",
  spouseOrOfficerPhoneAuthorization: false,
};
