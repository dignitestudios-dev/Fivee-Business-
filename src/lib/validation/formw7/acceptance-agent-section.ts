import * as z from "zod";
import {
  OFFICE_CODE_RE,
  W7_LIMITS,
  isValidEin,
  isValidPhone,
  isValidPtin,
  textField,
} from "./rules";
import { PHONE_MESSAGE } from "./signature-delegate-section";

// Every field in the acceptance-agent section is optional; the whole section can
// also be skipped. Formats and limits are checked only when a value is supplied.
const optionalPhone = (label: string) =>
  z.string().superRefine((value, ctx) => {
    const phone = value.trim();
    if (!phone) return;
    if (phone.length > W7_LIMITS.phone) {
      ctx.addIssue({
        code: "custom",
        message: `${label} cannot exceed ${W7_LIMITS.phone} characters`,
      });
    } else if (!isValidPhone(phone)) {
      ctx.addIssue({ code: "custom", message: PHONE_MESSAGE });
    }
  });

export const acceptanceAgentSchema = z.object({
  nameAndTitle: textField("Name and title", {
    max: W7_LIMITS.agentNameTitle,
    min: 2,
  }),
  companyName: textField("Company name", {
    max: W7_LIMITS.agentCompany,
    min: 2,
  }),
  ein: z.string().superRefine((value, ctx) => {
    const ein = value.trim();
    if (ein && !isValidEin(ein)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid 9-digit EIN, for example 12-3456789",
      });
    }
  }),
  ptin: z.string().superRefine((value, ctx) => {
    const ptin = value.trim();
    if (ptin && !isValidPtin(ptin)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a PTIN in the format P12345678",
      });
    }
  }),
  officeCode: textField("Office code", {
    max: W7_LIMITS.agentOfficeCode,
    pattern: OFFICE_CODE_RE,
    patternMessage:
      "Office code can only contain letters, numbers, spaces, and hyphens",
  }),
  phone: optionalPhone("Phone"),
  fax: optionalPhone("Fax"),
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
