import { calculationSchema } from "@/lib/validation/form433a/calculation-section";
import { completeFormSchema } from "@/lib/validation-schemas";
import { businessAssetsSchema } from "@/lib/validation/form433a/business-assets-section";
import { businessIncomeSchema } from "@/lib/validation/form433a/business-income-section";
import { employmentSchema } from "@/lib/validation/form433a/employment-section";
import { householdIncomeSchema } from "@/lib/validation/form433a/household-income-section";
import { personalAssetsSchema } from "@/lib/validation/form433a/personal-assets-section";
import { personalInfoSchema } from "@/lib/validation/form433a/personal-info-section";
import { selfEmployedSchema } from "@/lib/validation/form433a/self-employed-section";
import { otherInfoSchema } from "@/lib/validation/form433a/other-info-section";
import { signatureSchema } from "@/lib/validation/form433a/signature-section";
import { businessInfoSchema } from "@/lib/validation/form433b/business-info-section";
import { businessAssetSchema } from "@/lib/validation/form433b/business-asset-section";
import { businessIncomeSchemaFormB } from "@/lib/validation/form433b/business-income-section";
import { businessExpenseSchema } from "@/lib/validation/form433b/business-expense-section";
import { calculationSchemaFormB } from "@/lib/validation/form433b/calculation-section";
import { otherInfoSchemaFormB } from "@/lib/validation/form433b/other-info-section";
import { signatureSchemaFormB } from "@/lib/validation/form433b/signature-section";
import { individualInfoSchema } from "@/lib/validation/form656/individual-info-section";
import { reasonForOfferSchema } from "@/lib/validation/form656/reason-for-offer-section";
import { paymentTermsSchema } from "@/lib/validation/form656/payment-terms-section";
import { businessInfoSchema656 } from "@/lib/validation/form656/business-info-section";
import { designationEftpsSchema } from "@/lib/validation/form656/designation-eftps-section";
import { sourceOfFundsSchema } from "@/lib/validation/form656/source-of-funds-section";
import { signaturesSchema656 } from "@/lib/validation/form656/signatures-section";
import { paidPreparerSchema } from "@/lib/validation/form656/paid-preparer-section";
import { applicationChecklistSchema } from "@/lib/validation/form656/application-checklist-section";

export {}; // makes this a module

declare global {
  interface LoginFormValues {
    email: string;
    password: string;
  }

  interface SignupFormValues {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

  interface ForgotPasswordFormValues {
    email: string;
  }

  interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
  }

  type EmploymentType = "self-employed" | "business-owner";

  interface Message {
    id: number;
    text: string;
    sender: "user" | "support";
    timestamp: Date;
  }

  interface Signature {
    _id: string;
    title: string;
    description: string;
    url: string;
  }

  type CardBrand =
    | "amex"
    | "diners"
    | "discover"
    | "eftpos_au"
    | "jcb"
    | "mastercard"
    | "unionpay"
    | "visa"
    | "interac"
    | "unknown";

  interface Card {
    id: string;
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
    name: string | null;
  }

  interface FormCase {
    _id: string;
    title: string;
    isCompleted: "incompleted" | "completed";
    createdAt: string;
    updatedAt: string;
  }

  type Form433aSection =
    | "personalInfo"
    | "employmentInfo"
    | "assetsInfo"
    | "selfEmployedInfo"
    | "businessInfo"
    | "businessIncomeExpenseInfo"
    | "householdIncomeExpenseInfo"
    | "offerCalculationInfo"
    | "otherInfo"
    | "signaturesAndAttachmentsInfo"
    | "sectionStatus";

  type Form433bSection =
    | "businessInfo"
    | "businessAssetInfo"
    | "businessIncomeInfo"
    | "businessExpenseInfo"
    | "offerCalculationInfo"
    | "otherInfo"
    | "signaturesAndAttachmentsInfo"
    | "sectionStatus";

  type Form656Section =
    | "individualInfo"
    | "businessInfo"
    | "reasonForOfferInfo"
    | "paymentTermsInfo"
    | "designationAndEftpsInfo"
    | "sourceOfFundsAndRequirementsInfo"
    | "signaturesInfo"
    | "applicationChecklistInfo"
    | "paidPreparerUseOnlyInfo"
    | "sectionStatus";

  type FormData433A = z.infer<typeof completeFormSchema>;

  // Form 433a: React Hook Form Data Types

  type MaritalStatus = "unmarried" | "married";

  type PersonalInfo = {
    firstName: string;
    lastName: string;
    dob: string;
    ssnOrItin: string;
    maritalStatus: "unmarried" | "married";
    dateOfMarriage: string;
    homeAddress: string;
    mailingAddress: string;
    countyOfResidence: string;
    primaryPhone: string;
    secondaryPhone: string;
    faxNumber: string;
    housingStatus: "own" | "rent" | "other";
    livedInCommunityPropertyStateInLast10Years: boolean;
    housingOtherDetails: string;
    spouseFirstName: string;
    spouseLastName: string;
    spouseDOB: string;
    spouseSSN: string;
    householdMembers: [
      {
        name: string;
        age: number;
        relationship: string;
        claimedAsDependent: boolean;
        contributesToIncome: boolean;
      }
    ];
  };

  type PersonalInfoFromSchema = z.infer<typeof personalInfoSchema>;

  type Employment = {
    maritalStatus: "unmarried" | "married";
    employerName: string;
    payPeriod: "weekly" | "bi-weekly" | "monthly" | "other";
    employerAddress: string;
    hasOwnershipInterest: boolean;
    jobTitle: string;
    yearsWithEmployer: number;
    monthsWithEmployer: number;
    spouseEmployerName: string;
    spousePayPeriod: "weekly" | "bi-weekly" | "monthly" | "other";
    spouseEmployerAddress: string;
    spouseHasOwnershipInterest: boolean;
    spouseJobTitle: string;
    spouseYearsWithEmployer: number;
    spouseMonthsWithEmployer: number;
  };

  type EmploymentFromSchema = z.infer<typeof employmentSchema>;

  type PersonalAssetsFormSchema = z.infer<typeof personalAssetsSchema>;

  type SelfEmployedFormSchema = z.infer<typeof selfEmployedSchema>;

  type BusinessAssetsFormSchema = z.infer<typeof businessAssetsSchema>;

  type BusinessIncomeFormSchema = z.infer<typeof businessIncomeSchema>;

  type HouseholdIncomeFormSchema = z.infer<typeof householdIncomeSchema>;

  type CalculationFormSchema = z.infer<typeof calculationSchema>;

  type OtherInfoFormSchema = z.infer<typeof otherInfoSchema>;

  type SignatureFormSchema = z.infer<typeof signatureSchema>;

  interface FormData433AState {
    personalInfo: PersonalInfoFromSchema | null;
    employmentInfo: EmploymentFromSchema | null;
    personalAssetsInfo: PersonalAssetsFormSchema | null;
    selfEmployedSchema: SelfEmployedFormSchema | null;
    businessAssetsSchema: BusinessAssetsFormSchema | null;
    businessIncomeSchema: BusinessIncomeFormSchema | null;
    householdIncomeSchema: HouseholdIncomeFormSchema | null;
    calculationSchema: CalculationFormSchema | null;
    otherInfoSchema: OtherInfoFormSchema | null;
    signatureSchema: SignatureFormSchema | null;
  }

  type BusinessInfoFormSchema = z.infer<typeof businessInfoSchema>;
  type BusinessAssetsFormSchema2 = z.infer<typeof businessAssetSchema>;
  type BusinessIncomeFormBSchema = z.infer<typeof businessIncomeSchemaFormB>;
  type BusinessExpenseFormSchema = z.infer<typeof businessExpenseSchema>;
  type CalculationInfo = z.infer<typeof calculationSchemaFormB>;
  type OtherInfoFormBSchema = z.infer<typeof otherInfoSchemaFormB>;
  type SignatureInfoFormB = z.infer<typeof signatureSchemaFormB>;

  interface FormData433BState {
    caseId: string | null;
    businessInformation: BusinessInfoFormSchema | null;
    businessAssetsInfo: BusinessAssetsFormSchema2 | null;
    businessIncomeInfo: BusinessAssetsFormSchemaFormB | null;
    businessExpenseInfo: BusinessExpenseFormSchema | null;
    calculationInfo: CalculationInfo | null;
    otherInfo: OtherInfoFormBSchema | null;
    signatureInfo: SignatureInfoFormB | null;
  }

  // Form 656 types
  type IndividualInfoFormSchema = z.infer<typeof individualInfoSchema>;
  type BusinessInfoFormSchema = z.infer<typeof businessInfoSchema656>;
  type ReasonForOfferFormSchema = z.infer<typeof reasonForOfferSchema>;
  type PaymentTermsFormSchema = z.infer<typeof paymentTermsSchema>;
  type DesignationEftpsFormSchema = z.infer<typeof designationEftpsSchema>;
  type SourceOfFundsFormSchema = z.infer<typeof sourceOfFundsSchema>;
  type SignaturesFormSchema = z.infer<typeof signaturesSchema656>;
  type PaidPreparerFormSchema = z.infer<typeof paidPreparerSchema>;
  type ApplicationChecklistFormSchema = z.infer<
    typeof applicationChecklistSchema
  >;

  interface FormData656State {
    caseId: string | null;
    individualInfo: IndividualInfoFormSchema | null;
    businessInfo: BusinessInfoFormSchema | null;
    reasonForOffer: string | null;
    paymentTerms: PaymentTermsFormSchema | null;
    designationEftps: DesignationEftpsFormSchema | null;
    sourceOfFunds: SourceOfFundsFormSchema | null;
    signaturesInfo: SignaturesFormSchema | null;
    paidPreparer: PaidPreparerFormSchema | null;
    applicationChecklist: ApplicationChecklistFormSchema | null;
  }

  // API Payload Types

  interface LoginPayload {
    email: string;
    password: string;
  }

  interface AddCardPayload {
    paymentMethodId: string;
  }
}
