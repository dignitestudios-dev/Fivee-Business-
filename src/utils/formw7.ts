import { formatDateForInput } from "@/utils/helper";
import {
  applicationInfoInitialValues,
  W7_PRIMARY_REASONS,
} from "@/lib/validation/formw7/application-info-section";
import { personalInfoInitialValues } from "@/lib/validation/formw7/personal-info-section";
import { otherInformationInitialValues } from "@/lib/validation/formw7/other-information-section";
import { signatureDelegateInitialValues } from "@/lib/validation/formw7/signature-delegate-section";
import { acceptanceAgentInitialValues } from "@/lib/validation/formw7/acceptance-agent-section";

/**
 * The W-7 API validates with whitelist + forbidNonWhitelisted, so a request
 * containing a field the DTO does not declare is rejected outright. These
 * mappers convert between the react-hook-form shapes (which carry UI-only
 * discriminators such as hasUsVisa) and the exact DTO payloads.
 */

const trimmed = (value?: string | null) => (value ?? "").trim();

// Drops keys whose value is an empty string, empty object, undefined, or null
const compact = <T extends Record<string, any>>(value: T): Partial<T> => {
  const result: Record<string, any> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined || item === null) continue;
    if (typeof item === "string" && item.trim() === "") continue;
    if (
      typeof item === "object" &&
      !Array.isArray(item) &&
      Object.keys(item).length === 0
    )
      continue;
    result[key] = typeof item === "string" ? item.trim() : item;
  }
  return result as Partial<T>;
};

const nameToPayload = (name: {
  firstName: string;
  middleName: string;
  lastName: string;
}) =>
  compact({
    firstName: name.firstName,
    middleName: name.middleName,
    lastName: name.lastName,
  });

const nameFromResponse = (name: any) => ({
  firstName: name?.firstName ?? "",
  middleName: name?.middleName ?? "",
  lastName: name?.lastName ?? "",
});

const addressToPayload = (address: {
  street: string;
  cityStateProvinceCountryPostal: string;
}) =>
  compact({
    street: address.street,
    cityStateProvinceCountryPostal: address.cityStateProvinceCountryPostal,
  });

const addressFromResponse = (address: any) => ({
  street: address?.street ?? "",
  cityStateProvinceCountryPostal: address?.cityStateProvinceCountryPostal ?? "",
});

// ---------------------------------------------------------------- application

export const toApplicationInfoPayload = (form: W7ApplicationInfoFormSchema) => {
  const reasonCodes: string[] = [];
  if (form.primaryReason) reasonCodes.push(form.primaryReason);
  if (form.includeOtherReason) reasonCodes.push("h");

  const claimsException = form.primaryReason === "f" && form.claimingException;
  const requiresTreaty = form.primaryReason === "a" || claimsException;
  const isDependentOrSpouse =
    form.primaryReason === "d" || form.primaryReason === "e";

  return {
    applicationType: form.applicationType,
    reasonCodes,
    claimingException: claimsException,
    ...compact({
      otherReason: form.includeOtherReason ? form.otherReason : "",
      treatyCountry: requiresTreaty ? form.treatyCountry : "",
      treatyArticleNumber: requiresTreaty ? form.treatyArticleNumber : "",
      relationshipToCitizenResident:
        form.primaryReason === "d" ? form.relationshipToCitizenResident : "",
      citizenResidentName: isDependentOrSpouse ? form.citizenResidentName : "",
      citizenResidentTin: isDependentOrSpouse ? form.citizenResidentTin : "",
    }),
  };
};

export const fromApplicationInfoResponse = (
  data: any
): W7ApplicationInfoFormSchema => {
  if (!data) return applicationInfoInitialValues;
  const reasonCodes: string[] = Array.isArray(data.reasonCodes)
    ? data.reasonCodes
    : [];
  const primaryReason =
    (W7_PRIMARY_REASONS as readonly string[]).find((code) =>
      reasonCodes.includes(code)
    ) ?? "";

  return {
    applicationType: data.applicationType ?? "new",
    primaryReason:
      primaryReason as W7ApplicationInfoFormSchema["primaryReason"],
    includeOtherReason: reasonCodes.includes("h"),
    claimingException: Boolean(data.claimingException),
    otherReason: data.otherReason ?? "",
    treatyCountry: data.treatyCountry ?? "",
    treatyArticleNumber: data.treatyArticleNumber ?? "",
    relationshipToCitizenResident: data.relationshipToCitizenResident ?? "",
    citizenResidentName: data.citizenResidentName ?? "",
    citizenResidentTin: data.citizenResidentTin ?? "",
  };
};

// ------------------------------------------------------------------- personal

export const toPersonalInfoPayload = (form: W7PersonalInfoFormSchema) => ({
  legalName: nameToPayload(form.legalName),
  ...(form.hasDifferentBirthName
    ? { birthName: nameToPayload(form.birthName) }
    : {}),
  mailingAddress: addressToPayload(form.mailingAddress),
  foreignAddress: addressToPayload(form.foreignAddress),
  dateOfBirth: form.dateOfBirth,
  countryOfBirth: trimmed(form.countryOfBirth),
  ...compact({ cityStateProvinceOfBirth: form.cityStateProvinceOfBirth }),
  gender: form.gender,
});

export const fromPersonalInfoResponse = (
  data: any
): W7PersonalInfoFormSchema => {
  if (!data) return personalInfoInitialValues;
  const hasBirthName = Boolean(
    data.birthName?.firstName || data.birthName?.lastName
  );

  return {
    legalName: nameFromResponse(data.legalName),
    hasDifferentBirthName: hasBirthName,
    birthName: nameFromResponse(data.birthName),
    mailingAddress: addressFromResponse(data.mailingAddress),
    foreignAddress: addressFromResponse(data.foreignAddress),
    dateOfBirth: formatDateForInput(data.dateOfBirth),
    countryOfBirth: data.countryOfBirth ?? "",
    cityStateProvinceOfBirth: data.cityStateProvinceOfBirth ?? "",
    gender: data.gender === "female" ? "female" : "male",
  };
};

// ---------------------------------------------------------------------- other

export const toOtherInformationPayload = (
  form: W7OtherInformationFormSchema
) => {
  const identification = form.identificationDocument;
  const neverEntered = identification.entryStatus === "never";

  const payload: Record<string, any> = {
    citizenshipCountries: form.citizenshipCountries
      .map((country) => country.trim())
      .filter(Boolean),
    identificationDocument: {
      type: identification.type,
      ...(identification.type === "other"
        ? { otherType: trimmed(identification.otherType) }
        : {}),
      issuedBy: trimmed(identification.issuedBy),
      number: trimmed(identification.number),
      ...compact({ expirationDate: identification.expirationDate }),
      // The API rejects dateOfEntry and neverEnteredUnitedStates together
      ...(neverEntered
        ? { neverEnteredUnitedStates: true }
        : {
            neverEnteredUnitedStates: false,
            ...compact({ dateOfEntry: identification.dateOfEntry }),
          }),
    },
    previouslyReceivedTaxpayerNumber: form.previouslyReceivedTaxpayerNumber,
    supportingDocumentIds: form.supportingDocumentIds,
    additionalDocumentDescriptions: form.additionalDocumentDescriptions
      .map((description) => description.trim())
      .filter(Boolean),
    ...compact({ foreignTaxId: form.foreignTaxId }),
  };

  if (form.hasUsVisa) {
    payload.usVisa = {
      type: trimmed(form.usVisa.type),
      number: trimmed(form.usVisa.number),
      expirationDate: form.usVisa.expirationDate,
    };
  }

  // The ITIN/IRSN block is only shown (and only valid) when the answer is Yes.
  // Sending a leftover value from before the answer was changed to No would
  // print an ITIN next to a ticked "No" box.
  if (form.previouslyReceivedTaxpayerNumber === "yes") {
    Object.assign(payload, compact({ itin: form.itin, irsn: form.irsn }));
    payload.issuedName = nameToPayload(form.issuedName);
  }

  if (trimmed(form.institutionOrCompany.name)) {
    payload.institutionOrCompany = {
      name: trimmed(form.institutionOrCompany.name),
      cityAndState: trimmed(form.institutionOrCompany.cityAndState),
      lengthOfStay: trimmed(form.institutionOrCompany.lengthOfStay),
    };
  }

  return payload;
};

export const fromOtherInformationResponse = (
  data: any
): W7OtherInformationFormSchema => {
  if (!data) return otherInformationInitialValues;
  const identification = data.identificationDocument ?? {};
  const citizenshipCountries: string[] = Array.isArray(data.citizenshipCountries)
    ? data.citizenshipCountries
    : [];

  return {
    citizenshipCountries: citizenshipCountries.length
      ? citizenshipCountries
      : [""],
    foreignTaxId: data.foreignTaxId ?? "",
    hasUsVisa: Boolean(data.usVisa),
    usVisa: {
      type: data.usVisa?.type ?? "",
      number: data.usVisa?.number ?? "",
      expirationDate: formatDateForInput(data.usVisa?.expirationDate),
    },
    identificationDocument: {
      type: identification.type ?? "passport",
      otherType: identification.otherType ?? "",
      issuedBy: identification.issuedBy ?? "",
      number: identification.number ?? "",
      expirationDate: formatDateForInput(identification.expirationDate),
      entryStatus: identification.neverEnteredUnitedStates
        ? "never"
        : "entered",
      dateOfEntry: formatDateForInput(identification.dateOfEntry),
    },
    previouslyReceivedTaxpayerNumber:
      data.previouslyReceivedTaxpayerNumber === "yes" ? "yes" : "no-or-unknown",
    itin: data.itin ?? "",
    irsn: data.irsn ?? "",
    issuedName: nameFromResponse(data.issuedName),
    institutionOrCompany: {
      name: data.institutionOrCompany?.name ?? "",
      cityAndState: data.institutionOrCompany?.cityAndState ?? "",
      lengthOfStay: data.institutionOrCompany?.lengthOfStay ?? "",
    },
    supportingDocumentIds: (data.supportingDocumentIds ?? []).map((id: any) =>
      String(id)
    ),
    additionalDocumentDescriptions: data.additionalDocumentDescriptions ?? [],
  };
};

// ------------------------------------------------------------------ signature

export const toSignatureDelegatePayload = (
  form: W7SignatureDelegateFormSchema
) => ({
  phoneNumber: trimmed(form.phoneNumber),
  signedByDelegate: form.signedByDelegate,
  // Delegate details may only be sent when a delegate signs
  ...(form.signedByDelegate
    ? {
        delegateName: trimmed(form.delegateName),
        delegateRelationship: form.delegateRelationship,
      }
    : {}),
  acknowledgesOriginalSignatureRequired: true as const,
});

export const fromSignatureDelegateResponse = (
  data: any
): W7SignatureDelegateFormSchema => {
  if (!data) return signatureDelegateInitialValues;
  return {
    phoneNumber: data.phoneNumber ?? "",
    signedByDelegate: Boolean(data.signedByDelegate),
    delegateName: data.delegateName ?? "",
    delegateRelationship: data.delegateRelationship ?? "",
    acknowledgesOriginalSignatureRequired: true,
  };
};

// ----------------------------------------------------------- acceptance agent

export const toAcceptanceAgentPayload = (form: W7AcceptanceAgentFormSchema) =>
  compact({
    nameAndTitle: form.nameAndTitle,
    companyName: form.companyName,
    ein: form.ein,
    ptin: form.ptin,
    officeCode: form.officeCode,
    phone: form.phone,
    fax: form.fax,
  });

export const fromAcceptanceAgentResponse = (
  data: any
): W7AcceptanceAgentFormSchema => {
  if (!data) return acceptanceAgentInitialValues;
  return {
    nameAndTitle: data.nameAndTitle ?? "",
    companyName: data.companyName ?? "",
    ein: data.ein ?? "",
    ptin: data.ptin ?? "",
    officeCode: data.officeCode ?? "",
    phone: data.phone ?? "",
    fax: data.fax ?? "",
  };
};

/** Today in the yyyy-mm-dd form a date input expects, in the local time zone. */
export const todayForDateInput = (): string => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
};

/**
 * With NODE_ENV=dev the API returns an absolute path on the server disk instead
 * of an S3 URL, which the browser cannot open.
 */
export const isDownloadableUrl = (value?: string | null): boolean =>
  typeof value === "string" && /^https?:\/\//i.test(value.trim());
