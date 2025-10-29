import * as z from "zod";

const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const signaturesSchema656 = z.object({
  // taxpayerSignature will be the selected signature _id (string)
  taxpayerSignature: z.string().min(1, "Taxpayer signature required"),
  taxpayerSignatureDate: z.string().min(1, "Date required"),
  taxpayerPhoneNumber: z
    .string()
    .regex(phoneLooseRegex, "Invalid phone number")
    .optional(),
  // If you want the phone authorization to be required, change to z.boolean().refine(v => v === true, ...)
  taxpayerPhoneAuthorization: z.boolean().optional(),
  // spouseOrOfficerSignature is optional but when present should be a string id
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
