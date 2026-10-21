/**
 * Shared Form W-7 validation rules: character limits, allowed characters,
 * identifier formats, date ranges, and the input formatters that go with them.
 *
 * Why the limits are what they are
 * --------------------------------
 * The printed form has fixed-width fields filled at 8 pt Helvetica, and the PDF
 * clips whatever does not fit its box (no wrapping, no shrinking), so any text
 * past the box edge is lost. Two guards keep every entry fully printed:
 *  - the character limits below, which are the typical capacity of each box
 *    (box width less padding, divided by ~4.5 pt per character), and
 *  - W7_BOX, the real box width, checked against the actual Helvetica width of
 *    the text, because "WWWW" is far wider than "iiii".
 * The widths come from the official fillable PDF (Rev. December 2024) and are
 * listed in the Form W-7 field validation document.
 *
 * Why the character sets are what they are
 * ----------------------------------------
 * The PDF is written with a built-in (WinAnsi) font. A character that font
 * cannot draw makes PDF generation fail outright, so free text is limited to
 * printable ASCII plus the Latin-1 letters (accented letters such as é, ñ, ü).
 */

import * as z from "zod";

// --------------------------------------------------------------------- limits

export const W7_LIMITS = {
  // Case title (start page). The API allows up to 120.
  title: 120,

  // Section 1 - application type and reason
  otherReason: 93,
  treatyCountry: 26,
  treatyArticle: 20,
  relationship: 22,
  citizenResidentName: 40,
  tin: 11, // 9 digits + 2 hyphens, e.g. 123-45-6789

  // Section 2 - name, address, birth
  firstName: 35,
  middleName: 30,
  lastName: 34,
  addressLine: 100,
  countryOfBirth: 25,
  cityStateProvinceOfBirth: 29,

  // Section 3 - other information
  country: 30, // each country of citizenship
  citizenshipTotal: 27, // typical cap; the exact check is the joined width (see W7_BOX)
  citizenshipMaxCount: 3,
  foreignTaxId: 25,
  visaType: 10,
  visaNumber: 20,
  idOtherType: 23,
  idIssuedBy: 50,
  idNumber: 25,
  issuedFirstName: 19, // line 6f name fields are narrower than line 1a
  issuedMiddleName: 18,
  issuedLastName: 24,
  institutionName: 52,
  institutionCityState: 40,
  lengthOfStay: 30,
  documentDescription: 100,
  maxDocumentDescriptions: 10,
  maxSupportingDocuments: 10,

  // Section 4 - signatures
  phone: 20,
  delegateName: 46,

  // Section 5 - acceptance agent
  agentNameTitle: 40,
  agentCompany: 22,
  agentOfficeCode: 20,
  ein: 10, // NN-NNNNNNN
  ptin: 9, // P + 8 digits
} as const;

/**
 * Inputs that reformat what is typed (SSN/ITIN, EIN, PTIN) must not use their
 * own value limit as the HTML maxLength. The browser applies maxLength to the
 * raw text before the formatter runs, so pasting "123 - 45 - 6789" (15
 * characters) into a field capped at 11 would silently lose the last digits.
 * The formatter caps the digits and the schema checks the formatted result, so
 * these inputs just allow slack for pasted spacing and punctuation.
 */
export const FORMATTED_INPUT_MAXLENGTH = 20;

// ----------------------------------------------------------- printed box widths

/** Usable width, in points, of each printed text box (field width less padding). */
const BOX_PADDING = 4;
const box = (fieldWidth: number) => fieldWidth - BOX_PADDING;

export const W7_BOX = {
  // Section 1
  relationship: box(106.8),
  citizenResidentName: box(352.8),
  otherReason: box(424.8),
  treatyCountry: box(121.8),
  treatyArticle: box(127.2),
  // Section 2 (the same widths serve the birth-name row)
  firstName: box(163.9),
  middleName: box(142.2),
  lastName: box(157.4),
  addressLine: box(467.0),
  countryOfBirth: box(120.6),
  cityStateProvinceOfBirth: box(135.1),
  // Section 3
  citizenshipTotal: box(127.9),
  foreignTaxId: box(129.6),
  visa: box(207.8), // "type, number, MM/DD/YYYY" share one box
  idOtherType: box(108.0),
  idIssuedBy: box(262.4),
  idNumber: box(145.0),
  issuedFirstName: box(93.6),
  issuedMiddleName: box(86.4),
  issuedLastName: box(115.2),
  institutionName: box(240.4),
  institutionCityState: box(184.6),
  lengthOfStay: box(139.4),
  // Section 4
  delegateName: box(212.2),
  // Section 5
  agentNameTitle: box(184.2),
  agentCompany: box(106.2),
  agentOfficeCode: box(123.8),
} as const;

const PDF_FONT_SIZE = 8;

// Helvetica advance widths (1/1000 em) for U+0020..U+00FF
const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333,
  400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611,
  667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
  722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
  556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500,
];
const QUOTE_WIDTHS: Record<string, number> = {
  "‘": 222,
  "’": 222,
  "“": 333,
  "”": 333,
};

/** Width in points the text takes when printed at the form's font size. */
export const textWidthPt = (text: string) => {
  let total = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    total +=
      QUOTE_WIDTHS[char] ??
      (code >= 32 && code <= 255 ? HELVETICA_WIDTHS[code - 32] : 556);
  }
  return (total / 1000) * PDF_FONT_SIZE;
};

/** True when the text fits its printed box without being clipped. */
export const fitsBox = (text: string, boxWidth: number) =>
  textWidthPt(text.trim()) <= boxWidth;

export const BOX_OVERFLOW_MESSAGE =
  "is too wide to print fully in its box on the form. Shorten it";

// --------------------------------------------------------- allowed characters

const LATIN_LETTERS = "A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF";
// Typographic quotes (U+2018/2019/201C/201D) are part of WinAnsi, and phones and
// Macs insert them automatically, so they are accepted.
const QUOTES = "\\u2018\\u2019\\u201C\\u201D";

/** Names: letters (Latin, incl. accented), spaces, . ' - ; must start with a letter. */
export const NAME_RE = new RegExp(
  `^[${LATIN_LETTERS}][${LATIN_LETTERS} .'\\u2019-]*$`
);

/** Countries: like names, plus parentheses. Commas are excluded on purpose. */
export const COUNTRY_RE = new RegExp(
  `^[${LATIN_LETTERS}][${LATIN_LETTERS} .'\\u2019()-]*$`
);

/** General free text: printable ASCII, Latin-1 letters, typographic quotes. */
export const TEXT_RE = new RegExp(
  `^[\\x20-\\x7E\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF${QUOTES}]+$`
);

export const FOREIGN_TAX_ID_RE = /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/;
export const TREATY_ARTICLE_RE = /^[A-Za-z0-9][A-Za-z0-9 ().,/-]*$/;
export const VISA_TYPE_RE = /^[A-Za-z0-9][A-Za-z0-9/-]*$/;
export const VISA_NUMBER_RE = /^[A-Za-z0-9]+$/;
export const ID_NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9 -]*$/;
export const OFFICE_CODE_RE = /^[A-Za-z0-9][A-Za-z0-9 -]*$/;

export const MESSAGES = {
  text: "contains characters that cannot be printed on the form. Use letters, numbers, and common punctuation only",
  name: "can only contain letters, spaces, apostrophes, periods, and hyphens",
  country:
    "can only contain letters, spaces, apostrophes, periods, hyphens, and parentheses",
};

// ----------------------------------------------------------- text validation

interface TextRule {
  max: number;
  /** Width of the printed box; the text must fit it at 8 pt Helvetica. */
  box?: number;
  min?: number;
  pattern?: RegExp;
  patternMessage?: string;
}

/**
 * Validates one text value and reports problems on `path`. Used both by
 * textField() and directly inside superRefine for fields that are only
 * relevant in some situations (so a hidden, stale value never blocks submit).
 * Returns true when the value is non-empty and valid.
 */
export const validateText = (
  ctx: z.RefinementCtx,
  path: (string | number)[],
  value: string,
  label: string,
  rule: TextRule
): boolean => {
  const { max, min = 1, pattern = TEXT_RE, patternMessage, box } = rule;
  const text = value.trim();

  if (!text) return false;

  if (text.length > max) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `${label} cannot exceed ${max} characters`,
    });
    return false;
  }
  if (text.length < min) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `${label} must be at least ${min} characters`,
    });
    return false;
  }
  if (!pattern.test(text)) {
    ctx.addIssue({
      code: "custom",
      path,
      message: patternMessage ?? `${label} ${MESSAGES.text}`,
    });
    return false;
  }
  if (box !== undefined && !fitsBox(text, box)) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `${label} ${BOX_OVERFLOW_MESSAGE}`,
    });
    return false;
  }
  return true;
};

/** validateText plus a required check, with the message the form should show. */
export const requireText = (
  ctx: z.RefinementCtx,
  path: (string | number)[],
  value: string,
  label: string,
  rule: TextRule,
  requiredMessage: string
): boolean => {
  if (!value.trim()) {
    ctx.addIssue({ code: "custom", path, message: requiredMessage });
    return false;
  }
  return validateText(ctx, path, value, label, rule);
};

/** A text field that is always visible: required or optional, always checked. */
export const textField = (
  label: string,
  rule: TextRule & { required?: boolean; requiredMessage?: string }
) =>
  z.string().superRefine((value, ctx) => {
    if (!value.trim()) {
      if (rule.required) {
        ctx.addIssue({
          code: "custom",
          message: rule.requiredMessage ?? `${label} is required`,
        });
      }
      return;
    }
    validateText(ctx, [], value, label, rule);
  });

// --------------------------------------------------------------- identifiers

const digitsOnly = (value: string) => value.replace(/\D/g, "");

// ITIN: nine digits starting with 9 (9XX-XX-XXXX)
const ITIN_RE = /^9\d{8}$/;

export const isValidItin = (value: string) => /^[9\d\s-]+$/.test(value.trim()) && ITIN_RE.test(digitsOnly(value));

/** SSN: 9 digits; area not 000, 666 or 9xx; group not 00; serial not 0000. */
export const isValidSsn = (value: string) => {
  const d = digitsOnly(value);
  if (d.length !== 9) return false;
  const area = d.slice(0, 3);
  if (area === "000" || area === "666" || area.startsWith("9")) return false;
  return d.slice(3, 5) !== "00" && d.slice(5) !== "0000";
};

export const isValidSsnOrItin = (value: string) =>
  isValidSsn(value) || isValidItin(value);

/** IRSN: nine digits (the IRS publishes no further structure). */
export const isValidIrsn = (value: string) => {
  const d = digitsOnly(value);
  return d.length === 9 && !/^0+$/.test(d);
};

// EIN: NN-NNNNNNN where NN is an IRS-assigned prefix
const EIN_RE = /^(0[1-6]|1[0-6]|2[0-7]|[345]\d|6[0-8]|7[1-7]|8[0-8]|9[0-5]|9[89])-\d{7}$/;

export const isValidEin = (value: string) => EIN_RE.test(value.trim());

export const isValidPtin = (value: string) => /^P\d{8}$/.test(value.trim());

// ------------------------------------------------------------------- phone

// North American numbers: area code and exchange both start with 2-9
const isValidNanp = (d: string) => d.length === 10 || (d.length === 11 && d.startsWith("1"));

/**
 * US/Canada numbers are 10 digits, with an optional +1. A number written with
 * another country code (+ then 8-15 digits in total) is accepted as-is, since
 * an applicant living abroad can only give a local phone number.
 */
export const isValidPhone = (value: string) => {
  const v = value.trim();
  if (!/^[+\d\s().-]+$/.test(v)) return false;
  const d = digitsOnly(v);

  if (v.startsWith("+")) {
    if (d.startsWith("1")) return d.length === 11;
    return d.length >= 7 && d.length <= 15;
  }
  return isValidNanp(d);
};

// ----------------------------------------------------------------- formatters

/** 123456789 -> 123-45-6789 as the user types. */
export const formatTinInput = (value: string) => {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};

const formatNanp = (d: string) => {
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/** (817) 713-6056 for US numbers; +1 prefix kept; other +CC numbers kept as digits. */
export const formatPhoneInput = (value: string) => {
  const v = value.trimStart();
  if (v.startsWith("+")) {
    const d = digitsOnly(v).slice(0, 15);
    if (d.startsWith("1")) {
      const national = formatNanp(d.slice(1, 11));
      return national ? `+1 ${national}` : "+1";
    }
    return `+${d}`;
  }
  const d = digitsOnly(v);
  if (d.startsWith("1") && d.length > 10) {
    const national = formatNanp(d.slice(1, 11));
    return national ? `+1 ${national}` : "+1";
  }
  return formatNanp(d.slice(0, 10));
};

export const formatPtinInput = (value: string) =>
  value.toUpperCase().replace(/[^P0-9]/g, "").slice(0, W7_LIMITS.ptin);

// -------------------------------------------------------------------- dates

/** yyyy-mm-dd for the local calendar day, offset by whole years. */
export const isoDate = (offsetYears = 0) => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  local.setUTCFullYear(local.getUTCFullYear() + offsetYears);
  return local.toISOString().split("T")[0];
};

/** True for a real calendar date written yyyy-mm-dd (rejects 2026-02-30). */
export const isRealIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const EARLIEST_BIRTH_DATE = "1900-01-01";
// Passports and visas are valid for ten years or less; this catches typos
export const MAX_YEARS_UNTIL_EXPIRY = 20;

/** Format and range check for a yyyy-mm-dd value. Empty values are skipped. */
export const validateDate = (
  ctx: z.RefinementCtx,
  path: (string | number)[],
  value: string,
  label: string,
  range: { min?: string; max?: string; minMessage?: string; maxMessage?: string }
): boolean => {
  if (!value) return false;
  if (!isRealIsoDate(value)) {
    ctx.addIssue({ code: "custom", path, message: `Enter a valid ${label}` });
    return false;
  }
  if (range.min && value < range.min) {
    ctx.addIssue({
      code: "custom",
      path,
      message: range.minMessage ?? `The ${label} is too early`,
    });
    return false;
  }
  if (range.max && value > range.max) {
    ctx.addIssue({
      code: "custom",
      path,
      message: range.maxMessage ?? `The ${label} is too late`,
    });
    return false;
  }
  return true;
};
