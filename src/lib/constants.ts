// App global Configuration
export const APP_CONFIG = {
  name: "Fivee Business",
  logo: "/images/logo.png",
};

// Password Configuration
export const SECURITY_CONFIG = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  otpLength: 6,
  otpExpiry: 10 * 60 * 1000, // 10 minutes
};

export const constants = {
  APP_CONFIG,
  SECURITY_CONFIG,
};

export const DUMMY_USER: User = {
  id: "123",
  firstName: "Siweh",
  lastName: "Harris",
  email: "siwehharris@example.com",
  employmentType: "",
};
