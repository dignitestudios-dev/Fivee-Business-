type EmploymentType = "self-employed" | "business-owner";

interface SignupFormValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  employmentType: EmploymentType;
}

interface SignupPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  employmentType: EmploymentType;
  socialLogin: boolean;
  provider: "google" | "apple" | null;
  role: "user" | "admin";
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employmentType: EmploymentType;
  role: "user" | "admin";
}