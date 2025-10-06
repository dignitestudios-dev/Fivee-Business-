import { completeFormSchema } from "@/lib/validation-schemas";
import { employmentSchema } from "@/lib/validation/form433a/employment-section";
import { personalInfoSchema } from "@/lib/validation/form433a/personal-info-section";

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

  interface User {
    firstName: string;
    lastName: string;
    email: string;
    employmentType: EmploymentType | "";
  }

  interface User {
    id: string;
    email: string;
    name?: string;
  }

  interface Message {
    id: number;
    text: string;
    sender: "user" | "support";
    timestamp: Date;
  }

  type FormData433A = z.infer<typeof completeFormSchema>;

  // Form 433a: React Hook Form Data Types

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

  interface FormData433AState {
    personalInfo: PersonalInfoFromSchema;
    employment: EmploymentFromSchema;
  }
}
