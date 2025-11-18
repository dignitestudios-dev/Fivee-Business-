type EmploymentType = "self-employed" | "business-owner";

interface SignupFormValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
  employmentType: EmploymentType;
}

interface SignupPayload {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  employmentType: EmploymentType;
  socialLogin: boolean;
  provider: SignInProvider;
  role: "user" | "admin";
}

type SignInProvider = "google" | "apple" | null;

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  employmentType: EmploymentType;
  role: "user" | "admin";
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
