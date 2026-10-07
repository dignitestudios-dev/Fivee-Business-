import * as z from "zod";

// Every field in the acceptance-agent section is optional; the whole section can
// also be skipped. Formats are validated only when a value is supplied.
export const acceptanceAgentSchema = z.object({
  nameAndTitle: z.string(),
  companyName: z.string(),
  ein: z
    .string()
    .refine((value) => !value || /^\d{2}-?\d{7}$/.test(value.trim()), {
      message: "Enter a 9-digit EIN, for example 12-3456789",
    }),
  ptin: z
    .string()
    .refine((value) => !value || /^P\d{8}$/i.test(value.trim()), {
      message: "Enter a PTIN in the format P12345678",
    }),
  officeCode: z.string(),
  phone: z.string(),
  fax: z.string(),
});

export type W7AcceptanceAgentForm = z.infer<typeof acceptanceAgentSchema>;

export const acceptanceAgentInitialValues: W7AcceptanceAgentForm = {
  nameAndTitle: "",
  companyName: "",
  ein: "",
  ptin: "",
  officeCode: "",
  phone: "",
  fax: "",
};
