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
}
