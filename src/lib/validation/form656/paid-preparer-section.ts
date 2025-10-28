
import * as z from "zod";

const phoneLooseRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const paidPreparerSchema = z.object({
  preparerSignature: z.string().min(1, "Preparer signature required"),
  preparerPhoneNumber: z.string().regex(phoneLooseRegex, "Invalid phone number"),
  preparerSignatureDate: z.string().min(1, "Date required"),
  preparerPhoneAuthorization: z.boolean().optional(),
  preparerName: z.string().min(1, "Preparer name required"),
  preparerCafNumberOrPtin: z.string().min(1, "CAF No. or PTIN required"),
  firmName: z.string().optional(),
  firmAddress: z.string().optional(),
  firmZipCode: z.string().optional(),
  attachForm2848: z.boolean().optional(),
  attachForm8821: z.boolean().optional(),
  irsOfficialSignature: z.string().optional(),
  irsOfficialTitle: z.string().optional(),
  irsOfficialDate: z.string().optional(),
});

export type PaidPreparerFormSchema = z.infer<typeof paidPreparerSchema>;

export const paidPreparerInitialValues: PaidPreparerFormSchema = {
  preparerSignature: "",
  preparerPhoneNumber: "",
  preparerSignatureDate: "",
  preparerPhoneAuthorization: false,
  preparerName: "",
  preparerCafNumberOrPtin: "",
  firmName: "",
  firmAddress: "",
  firmZipCode: "",
  attachForm2848: false,
  attachForm8821: false,
  irsOfficialSignature: "",
  irsOfficialTitle: "",
  irsOfficialDate: "",
};