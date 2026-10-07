import * as z from "zod";

export const W7_ID_DOCUMENT_TYPES = [
  "passport",
  "drivers-license-state-id",
  "uscis",
  "other",
] as const;

export const W7_ID_DOCUMENT_LABELS: Record<
  (typeof W7_ID_DOCUMENT_TYPES)[number],
  string
> = {
  passport: "Passport",
  "drivers-license-state-id": "Driver's license/State I.D.",
  uscis: "USCIS documentation",
  other: "Other",
};

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const parseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** True when the value is a valid date strictly before today. */
const isPastDate = (value: string) => {
  const date = parseDate(value);
  return date !== null && date < startOfToday();
};

/** True when the value is a valid date after today. */
const isFutureDate = (value: string) => {
  const date = parseDate(value);
  return date !== null && date > startOfToday();
};

// Exported so the form type can be inferred from the plain object shape;
// superRefine does not change the inferred type but does defeat inference here.
export const otherInformationBaseSchema = z.object({
  citizenshipCountries: z
    .array(z.string().trim().min(1, "Enter a country of citizenship"))
    .min(1, "At least one country of citizenship is required"),
  foreignTaxId: z.string(),
  hasUsVisa: z.boolean(),
  usVisa: z.object({
    type: z.string(),
    number: z.string(),
    expirationDate: z.string(),
  }),
  identificationDocument: z.object({
    type: z.enum(W7_ID_DOCUMENT_TYPES, {
      error: "Select the identification document submitted",
    }),
    otherType: z.string(),
    issuedBy: z.string().trim().min(1, "Enter the issuing authority"),
    number: z.string().trim().min(1, "Enter the document number"),
    expirationDate: z.string(),
    // UI-only discriminator for IRS line 6d "Date of entry into the United States"
    entryStatus: z.enum(["entered", "never"]),
    dateOfEntry: z.string(),
  }),
  previouslyReceivedTaxpayerNumber: z.enum(["no-or-unknown", "yes"]),
  itin: z.string(),
  irsn: z.string(),
  issuedName: z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
  }),
  institutionOrCompany: z.object({
    name: z.string(),
    cityAndState: z.string(),
    lengthOfStay: z.string(),
  }),
  supportingDocumentIds: z.array(z.string()),
  additionalDocumentDescriptions: z.array(z.string()),
});

export interface OtherInformationContext {
  applicationType?: "new" | "renewal";
  reasonCodes?: string[];
  /** From the personal-info section; used to sanity-check the entry date. */
  dateOfBirth?: string;
}

/**
 * Several of the backend's rules for this section depend on the answers saved in
 * the application-info section, so the resolver is built per case.
 */
export const makeOtherInformationSchema = (
  context: OtherInformationContext = {}
) =>
  otherInformationBaseSchema.superRefine((value, ctx) => {
    const reasons = context.reasonCodes ?? [];
    const identification = value.identificationDocument;
    const neverEntered = identification.entryStatus === "never";

    if (identification.type === "other" && !identification.otherType.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["identificationDocument", "otherType"],
        message: "Describe the document type",
      });
    }

    if (
      identification.expirationDate &&
      isPastDate(identification.expirationDate)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["identificationDocument", "expirationDate"],
        message:
          "The identification document is expired. The expiration date must be today or later",
      });
    }

    if (!neverEntered) {
      if (!identification.dateOfEntry) {
        ctx.addIssue({
          code: "custom",
          path: ["identificationDocument", "dateOfEntry"],
          message:
            "Enter the date of entry into the United States, or select that the applicant has never entered",
        });
      } else if (isFutureDate(identification.dateOfEntry)) {
        ctx.addIssue({
          code: "custom",
          path: ["identificationDocument", "dateOfEntry"],
          message: "The date of entry cannot be in the future",
        });
      } else if (
        context.dateOfBirth &&
        parseDate(identification.dateOfEntry) &&
        parseDate(context.dateOfBirth) &&
        (parseDate(identification.dateOfEntry) as Date) <
          (parseDate(context.dateOfBirth) as Date)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["identificationDocument", "dateOfEntry"],
          message: "The date of entry cannot be before the date of birth",
        });
      }
    }

    // A passport is the only stand-alone document the IRS accepts
    if (
      identification.type !== "passport" &&
      value.supportingDocumentIds.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["supportingDocumentIds"],
        message:
          "Upload at least one supporting document when a passport is not submitted",
      });
    }

    if (value.hasUsVisa) {
      if (!value.usVisa.type.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["usVisa", "type"],
          message: "Enter the visa type",
        });
      }
      if (!value.usVisa.number.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["usVisa", "number"],
          message: "Enter the visa number",
        });
      }
      if (!value.usVisa.expirationDate) {
        ctx.addIssue({
          code: "custom",
          path: ["usVisa", "expirationDate"],
          message: "Enter the visa expiration date",
        });
      } else if (isPastDate(value.usVisa.expirationDate)) {
        ctx.addIssue({
          code: "custom",
          path: ["usVisa", "expirationDate"],
          message: "The visa expiration date must be today or later",
        });
      }
    }

    if (value.previouslyReceivedTaxpayerNumber === "yes") {
      if (!value.itin.trim() && !value.irsn.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["itin"],
          message: "Enter the previous ITIN or IRSN",
        });
      }
      if (!value.issuedName.firstName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["issuedName", "firstName"],
          message: "Enter the first name the number was issued under",
        });
      }
      if (!value.issuedName.lastName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["issuedName", "lastName"],
          message: "Enter the last name the number was issued under",
        });
      }
    }

    if (context.applicationType === "renewal" && !value.itin.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["itin"],
        message: "The previously assigned ITIN is required to renew",
      });
    }

    if (reasons.includes("f")) {
      if (!value.institutionOrCompany.name.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["institutionOrCompany", "name"],
          message: "Enter the college, university, or company name",
        });
      }
      if (!value.institutionOrCompany.cityAndState.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["institutionOrCompany", "cityAndState"],
          message: "Enter the city and state",
        });
      }
      if (!value.institutionOrCompany.lengthOfStay.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["institutionOrCompany", "lengthOfStay"],
          message: "Enter the length of stay",
        });
      }
    }

    if (reasons.includes("g")) {
      if (!value.hasUsVisa) {
        ctx.addIssue({
          code: "custom",
          path: ["hasUsVisa"],
          message: "Reason g requires U.S. visa information",
        });
      }
      if (neverEntered) {
        ctx.addIssue({
          code: "custom",
          path: ["identificationDocument", "entryStatus"],
          message: "Reason g requires a date of entry into the United States",
        });
      }
    }
  });

export const otherInformationSchema = makeOtherInformationSchema();

export type W7OtherInformationForm = z.infer<
  typeof otherInformationBaseSchema
>;

export const otherInformationInitialValues: W7OtherInformationForm = {
  citizenshipCountries: [""],
  foreignTaxId: "",
  hasUsVisa: false,
  usVisa: { type: "", number: "", expirationDate: "" },
  identificationDocument: {
    type: "passport",
    otherType: "",
    issuedBy: "",
    number: "",
    expirationDate: "",
    entryStatus: "entered",
    dateOfEntry: "",
  },
  previouslyReceivedTaxpayerNumber: "no-or-unknown",
  itin: "",
  irsn: "",
  issuedName: { firstName: "", middleName: "", lastName: "" },
  institutionOrCompany: { name: "", cityAndState: "", lengthOfStay: "" },
  supportingDocumentIds: [],
  additionalDocumentDescriptions: [],
};
