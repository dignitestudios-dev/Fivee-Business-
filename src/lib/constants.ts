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

// Figma Link: https://www.figma.com/proto/vB5GejkG3ufyjQoprPUNMd/Fivee-Business---Siweh-Harris?page-id=376%3A160&node-id=376-760&viewport=-1002%2C-1727%2C0.18&t=Wz5Umzb9k5qM0H9E-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=376%3A760
// Form A: https://www.irs.gov/pub/irs-pdf/f433aoi.pdf
// Form B: https://www.irs.gov/pub/irs-pdf/f433b.pdf
// Form C: https://www.irs.gov/pub/irs-pdf/f656b.pdf
