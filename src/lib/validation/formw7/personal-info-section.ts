import * as z from "zod";

const nameSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string(),
  lastName: z.string().trim().min(1, "Last name is required"),
});

const addressSchema = z.object({
  street: z.string(),
  cityStateProvinceCountryPostal: z
    .string()
    .trim()
    .min(1, "City, state/province, country, and postal code are required"),
});

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
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    countryOfBirth: z.string().trim().min(1, "Country of birth is required"),
    cityStateProvinceOfBirth: z.string(),
    gender: z.enum(["male", "female"], { error: "Select a gender" }),
  })
  .superRefine((value, ctx) => {
    if (value.dateOfBirth) {
      const dob = new Date(value.dateOfBirth);
      if (Number.isNaN(dob.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["dateOfBirth"],
          message: "Enter a valid date",
        });
      } else {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (dob > today) {
          ctx.addIssue({
            code: "custom",
            path: ["dateOfBirth"],
            message: "Date of birth cannot be in the future",
          });
        } else if (dob < new Date("1900-01-01")) {
          ctx.addIssue({
            code: "custom",
            path: ["dateOfBirth"],
            message: "Enter a date of birth on or after 1900",
          });
        }
      }
    }

    // Line 1b is only filled in when the name at birth differs from the legal name
    if (value.hasDifferentBirthName) {
      if (!value.birthName.firstName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["birthName", "firstName"],
          message: "First name at birth is required",
        });
      }
      if (!value.birthName.lastName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["birthName", "lastName"],
          message: "Last name at birth is required",
        });
      }
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
