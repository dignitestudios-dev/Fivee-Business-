import * as z from "zod";
import {
  COUNTRY_RE,
  FOREIGN_TAX_ID_RE,
  ID_NUMBER_RE,
  MAX_YEARS_UNTIL_EXPIRY,
  MESSAGES,
  NAME_RE,
  TEXT_RE,
  VISA_NUMBER_RE,
  VISA_TYPE_RE,
  W7_LIMITS,
  isValidIrsn,
  isValidItin,
  isoDate,
  requireText,
  validateDate,
  validateText,
} from "./rules";

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

// Exported so the form type can be inferred from the plain object shape;
// superRefine does not change the inferred type but does defeat inference here.
//
// Everything is a plain string/array here and is checked in superRefine, so the
// fields that are only shown in some situations (visa, ITIN, institution, ...)
// are only validated while visible and a hidden leftover value cannot block
// submitting.
export const otherInformationBaseSchema = z.object({
  citizenshipCountries: z.array(z.string()),
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
    issuedBy: z.string(),
    number: z.string(),
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
    const today = isoDate();
    const farthestExpiry = isoDate(MAX_YEARS_UNTIL_EXPIRY);

    // ---- 6a: countries of citizenship ---------------------------------------
    const countries = value.citizenshipCountries;
    countries.forEach((country, index) => {
      requireText(
        ctx,
        ["citizenshipCountries", index],
        country,
        "Country of citizenship",
        {
          max: W7_LIMITS.country,
          pattern: COUNTRY_RE,
          patternMessage: `Country of citizenship ${MESSAGES.country}`,
        },
        "Enter a country of citizenship"
      );
    });

    const entered = countries.map((c) => c.trim()).filter(Boolean);
    if (entered.length === 0 && countries.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["citizenshipCountries"],
        message: "At least one country of citizenship is required",
      });
    }
    if (countries.length > W7_LIMITS.citizenshipMaxCount) {
      ctx.addIssue({
        code: "custom",
        path: ["citizenshipCountries"],
        message: `List at most ${W7_LIMITS.citizenshipMaxCount} countries of citizenship`,
      });
    }
    if (new Set(entered.map((c) => c.toLowerCase())).size !== entered.length) {
      ctx.addIssue({
        code: "custom",
        path: ["citizenshipCountries"],
        message: "Each country can only be listed once",
      });
    }
    // The countries print in one narrow field, separated by ", "
    const joinedLength = entered.join(", ").length;
    if (joinedLength > W7_LIMITS.citizenshipTotal) {
      ctx.addIssue({
        code: "custom",
        path: ["citizenshipCountries"],
        message: `The countries are too long to print together (${joinedLength} of ${W7_LIMITS.citizenshipTotal} characters). Shorten or remove one`,
      });
    }

    // ---- 6b: foreign tax I.D. -----------------------------------------------
    validateText(ctx, ["foreignTaxId"], value.foreignTaxId, "Foreign tax I.D.", {
      max: W7_LIMITS.foreignTaxId,
      min: 3,
      pattern: FOREIGN_TAX_ID_RE,
      patternMessage:
        "Foreign tax I.D. can only contain letters, numbers, spaces, and . / -",
    });

    // ---- 6c: U.S. visa ------------------------------------------------------
    if (value.hasUsVisa) {
      requireText(
        ctx,
        ["usVisa", "type"],
        value.usVisa.type,
        "Visa type",
        {
          max: W7_LIMITS.visaType,
          pattern: VISA_TYPE_RE,
          patternMessage:
            "Visa type can only contain letters, numbers, and - / (for example F-1)",
        },
        "Enter the visa type"
      );
      requireText(
        ctx,
        ["usVisa", "number"],
        value.usVisa.number,
        "Visa number",
        {
          max: W7_LIMITS.visaNumber,
          min: 4,
          pattern: VISA_NUMBER_RE,
          patternMessage: "Visa number can only contain letters and numbers",
        },
        "Enter the visa number"
      );
      if (!value.usVisa.expirationDate) {
        ctx.addIssue({
          code: "custom",
          path: ["usVisa", "expirationDate"],
          message: "Enter the visa expiration date",
        });
      } else {
        validateDate(
          ctx,
          ["usVisa", "expirationDate"],
          value.usVisa.expirationDate,
          "visa expiration date",
          {
            min: today,
            max: farthestExpiry,
            minMessage: "The visa expiration date must be today or later",
            maxMessage: `The visa expiration date cannot be more than ${MAX_YEARS_UNTIL_EXPIRY} years away`,
          }
        );
      }
    }

    // ---- 6d: identification document ----------------------------------------
    if (identification.type === "other") {
      requireText(
        ctx,
        ["identificationDocument", "otherType"],
        identification.otherType,
        "The document type",
        { max: W7_LIMITS.idOtherType, min: 2 },
        "Describe the document type"
      );
    }
    requireText(
      ctx,
      ["identificationDocument", "issuedBy"],
      identification.issuedBy,
      "The issuing authority",
      { max: W7_LIMITS.idIssuedBy, min: 2 },
      "Enter the issuing authority"
    );
    requireText(
      ctx,
      ["identificationDocument", "number"],
      identification.number,
      "The document number",
      {
        max: W7_LIMITS.idNumber,
        min: 3,
        pattern: ID_NUMBER_RE,
        patternMessage:
          "The document number can only contain letters, numbers, spaces, and hyphens",
      },
      "Enter the document number"
    );

    validateDate(
      ctx,
      ["identificationDocument", "expirationDate"],
      identification.expirationDate,
      "expiration date",
      {
        min: today,
        max: farthestExpiry,
        minMessage:
          "The identification document is expired. The expiration date must be today or later",
        maxMessage: `The expiration date cannot be more than ${MAX_YEARS_UNTIL_EXPIRY} years away`,
      }
    );

    if (!neverEntered) {
      if (!identification.dateOfEntry) {
        ctx.addIssue({
          code: "custom",
          path: ["identificationDocument", "dateOfEntry"],
          message:
            "Enter the date of entry into the United States, or select that the applicant has never entered",
        });
      } else {
        const valid = validateDate(
          ctx,
          ["identificationDocument", "dateOfEntry"],
          identification.dateOfEntry,
          "date of entry",
          {
            min: "1900-01-01",
            max: today,
            minMessage: "Enter a date of entry on or after 1900",
            maxMessage: "The date of entry cannot be in the future",
          }
        );
        if (
          valid &&
          context.dateOfBirth &&
          identification.dateOfEntry < context.dateOfBirth
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["identificationDocument", "dateOfEntry"],
            message: "The date of entry cannot be before the date of birth",
          });
        }
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
    if (value.supportingDocumentIds.length > W7_LIMITS.maxSupportingDocuments) {
      ctx.addIssue({
        code: "custom",
        path: ["supportingDocumentIds"],
        message: `Attach at most ${W7_LIMITS.maxSupportingDocuments} supporting documents`,
      });
    }

    // ---- 6e / 6f: previously issued ITIN or IRSN ----------------------------
    const previouslyReceived =
      value.previouslyReceivedTaxpayerNumber === "yes";

    // A renewal can only exist if an ITIN was issued before
    if (context.applicationType === "renewal" && !previouslyReceived) {
      ctx.addIssue({
        code: "custom",
        path: ["previouslyReceivedTaxpayerNumber"],
        message:
          "A renewal means an ITIN was already issued. Select Yes and enter it",
      });
    }

    if (previouslyReceived) {
      const itin = value.itin.trim();
      const irsn = value.irsn.trim();

      if (!itin && !irsn) {
        ctx.addIssue({
          code: "custom",
          path: ["itin"],
          message: "Enter the previous ITIN or IRSN",
        });
      }
      if (itin && !isValidItin(itin)) {
        ctx.addIssue({
          code: "custom",
          path: ["itin"],
          message:
            "Enter a valid ITIN: nine digits starting with 9, for example 912-70-1234",
        });
      }
      if (irsn && !isValidIrsn(irsn)) {
        ctx.addIssue({
          code: "custom",
          path: ["irsn"],
          message: "Enter a valid IRSN: nine digits, for example 123-45-6789",
        });
      }

      requireText(
        ctx,
        ["issuedName", "firstName"],
        value.issuedName.firstName,
        "First name",
        {
          max: W7_LIMITS.issuedFirstName,
          pattern: NAME_RE,
          patternMessage: `First name ${MESSAGES.name}`,
        },
        "Enter the first name the number was issued under"
      );
      validateText(
        ctx,
        ["issuedName", "middleName"],
        value.issuedName.middleName,
        "Middle name",
        {
          max: W7_LIMITS.issuedMiddleName,
          pattern: NAME_RE,
          patternMessage: `Middle name ${MESSAGES.name}`,
        }
      );
      requireText(
        ctx,
        ["issuedName", "lastName"],
        value.issuedName.lastName,
        "Last name",
        {
          max: W7_LIMITS.issuedLastName,
          pattern: NAME_RE,
          patternMessage: `Last name ${MESSAGES.name}`,
        },
        "Enter the last name the number was issued under"
      );
    }

    if (context.applicationType === "renewal" && !value.itin.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["itin"],
        message: "The previously assigned ITIN is required to renew",
      });
    }

    // ---- 6g: college / university / company (reason f only) -----------------
    if (reasons.includes("f")) {
      requireText(
        ctx,
        ["institutionOrCompany", "name"],
        value.institutionOrCompany.name,
        "The name",
        { max: W7_LIMITS.institutionName, min: 2 },
        "Enter the college, university, or company name"
      );
      requireText(
        ctx,
        ["institutionOrCompany", "cityAndState"],
        value.institutionOrCompany.cityAndState,
        "City and state",
        { max: W7_LIMITS.institutionCityState, min: 2 },
        "Enter the city and state"
      );
      requireText(
        ctx,
        ["institutionOrCompany", "lengthOfStay"],
        value.institutionOrCompany.lengthOfStay,
        "Length of stay",
        { max: W7_LIMITS.lengthOfStay },
        "Enter the length of stay"
      );
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

    // ---- additional documents mailed with the form --------------------------
    const descriptions = value.additionalDocumentDescriptions;
    if (descriptions.length > W7_LIMITS.maxDocumentDescriptions) {
      ctx.addIssue({
        code: "custom",
        path: ["additionalDocumentDescriptions"],
        message: `List at most ${W7_LIMITS.maxDocumentDescriptions} additional documents`,
      });
    }
    descriptions.forEach((description, index) => {
      validateText(
        ctx,
        ["additionalDocumentDescriptions", index],
        description,
        "The description",
        { max: W7_LIMITS.documentDescription, pattern: TEXT_RE }
      );
    });
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
