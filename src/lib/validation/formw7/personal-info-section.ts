import * as z from "zod";
import {
  COUNTRY_RE,
  EARLIEST_BIRTH_DATE,
  MESSAGES,
  NAME_RE,
  W7_LIMITS,
  isoDate,
  requireText,
  textField,
  validateDate,
  validateText,
} from "./rules";

const nameSchema = z.object({
  firstName: textField("First name", {
    required: true,
    max: W7_LIMITS.firstName,
    pattern: NAME_RE,
    patternMessage: `First name ${MESSAGES.name}`,
  }),
  middleName: textField("Middle name", {
    max: W7_LIMITS.middleName,
    pattern: NAME_RE,
    patternMessage: `Middle name ${MESSAGES.name}`,
  }),
  lastName: textField("Last name", {
    required: true,
    max: W7_LIMITS.lastName,
    pattern: NAME_RE,
    patternMessage: `Last name ${MESSAGES.name}`,
  }),
});

const addressSchema = z.object({
  street: textField("Street address", { max: W7_LIMITS.addressLine }),
  cityStateProvinceCountryPostal: textField(
    "City, state/province, country, and postal code",
    {
      required: true,
      max: W7_LIMITS.addressLine,
      requiredMessage:
        "City, state/province, country, and postal code are required",
    }
  ),
});

// Line 3 on the form says not to use a P.O. box for the foreign address
const PO_BOX_RE = /\bP\.?\s*O\.?\s*Box\b/i;

export const personalInfoSchema = z
  .object({
    legalName: nameSchema,
    hasDifferentBirthName: z.boolean(),
    birthName: z.object({
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
    }),
    mailingAddress: addressSchema,
    foreignAddress: addressSchema,
    dateOfBirth: z.string(),
    countryOfBirth: textField("Country of birth", {
      required: true,
      max: W7_LIMITS.countryOfBirth,
      pattern: COUNTRY_RE,
      patternMessage: `Country of birth ${MESSAGES.country}`,
    }),
    cityStateProvinceOfBirth: textField("City and state or province", {
      max: W7_LIMITS.cityStateProvinceOfBirth,
    }),
    gender: z.enum(["male", "female"], { error: "Select a gender" }),
  })
  .superRefine((value, ctx) => {
    if (!value.dateOfBirth) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Date of birth is required",
      });
    } else {
      validateDate(ctx, ["dateOfBirth"], value.dateOfBirth, "date of birth", {
        min: EARLIEST_BIRTH_DATE,
        max: isoDate(),
        minMessage: "Enter a date of birth on or after 1900",
        maxMessage: "Date of birth cannot be in the future",
      });
    }

    if (PO_BOX_RE.test(value.foreignAddress.street)) {
      ctx.addIssue({
        code: "custom",
        path: ["foreignAddress", "street"],
        message: "A P.O. box cannot be used for the foreign address",
      });
    }

    // Line 1b is only filled in when the name at birth differs from the legal name
    if (value.hasDifferentBirthName) {
      const birth = value.birthName;
      requireText(
        ctx,
        ["birthName", "firstName"],
        birth.firstName,
        "First name at birth",
        {
          max: W7_LIMITS.firstName,
          pattern: NAME_RE,
          patternMessage: `First name at birth ${MESSAGES.name}`,
        },
        "First name at birth is required"
      );
      validateText(
        ctx,
        ["birthName", "middleName"],
        birth.middleName,
        "Middle name at birth",
        {
          max: W7_LIMITS.middleName,
          pattern: NAME_RE,
          patternMessage: `Middle name at birth ${MESSAGES.name}`,
        }
      );
      requireText(
        ctx,
        ["birthName", "lastName"],
        birth.lastName,
        "Last name at birth",
        {
          max: W7_LIMITS.lastName,
          pattern: NAME_RE,
          patternMessage: `Last name at birth ${MESSAGES.name}`,
        },
        "Last name at birth is required"
      );
    }
  });

export type W7PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export const personalInfoInitialValues: W7PersonalInfoForm = {
  legalName: { firstName: "", middleName: "", lastName: "" },
  hasDifferentBirthName: false,
  birthName: { firstName: "", middleName: "", lastName: "" },
  mailingAddress: { street: "", cityStateProvinceCountryPostal: "" },
  foreignAddress: { street: "", cityStateProvinceCountryPostal: "" },
  dateOfBirth: "",
  countryOfBirth: "",
  cityStateProvinceOfBirth: "",
  gender: "male",
};
