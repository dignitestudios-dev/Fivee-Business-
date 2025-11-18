import z from "zod";

export const householdIncomeInitialValues: HouseholdIncomeFormSchema = {
  income: {
    primaryTaxpayer: {
      grossWages: "",
      socialSecurity: "",
      pension: "",
      otherIncome: "",
    },
    spouse: {
      grossWages: "",
      socialSecurity: "",
      pension: "",
      otherIncome: "",
    },
    interestDividendsRoyalties: "",
    distributions: "",
    netRentalIncome: "",
    childSupportReceived: "",
    alimonyReceived: "",
    additionalSourcesIncome: "",
    additionalSourcesIncomeList: "",
    netBusinessIncomeFromBoxC: "",
  },
  expenses: {
    foodClothingMiscellaneous: "",
    monthlyRentalPayment: "",
    housingUtilities: "",
    vehicleLoanLeasePayments: "",
    vehicleOperatingCosts: "",
    publicTransportationCosts: "",
    healthInsurancePremiums: "",
    outOfPocketHealthCare: "",
    courtOrderedPayments: "",
    childDependentCare: "",
    lifeInsuranceAmount: "",
    lifeInsurancePremiums: "",
    currentMonthlyTaxes: "",
    securedDebts: "",
    securedDebtsList: "",
    monthlyTaxPayments: "",
    totalTaxOwed: "",
  },
  boxD: "",
  boxE: "",
  boxF: "",
};

export const householdIncomeSchema = z
  .object({
    income: z.object({
      primaryTaxpayer: z.object({
        grossWages: z.coerce
          .number()
          .refine((v) => !Number.isNaN(v), { message: "Gross wages is required" })
          .min(0, { message: "Gross wages must be 0 or greater" })
          .max(1000000000, { message: "Gross wages is too large" }),
        socialSecurity: z.coerce
          .number()
          .refine((v) => !Number.isNaN(v), { message: "Social Security is required" })
          .min(0, { message: "Social Security must be 0 or greater" })
          .max(1000000000, { message: "Social Security is too large" }),
        pension: z.coerce
          .number()
          .refine((v) => !Number.isNaN(v), { message: "Pension(s) is required" })
          .min(0, { message: "Pension(s) must be 0 or greater" })
          .max(1000000000, { message: "Pension(s) is too large" }),
        otherIncome: z.coerce
          .number()
          .refine((v) => !Number.isNaN(v), { message: "Other income is required" })
          .min(0, { message: "Other income must be 0 or greater" })
          .max(1000000000, { message: "Other income is too large" }),
      }),
      spouse: z.object({
        grossWages: z.coerce
          .number()
          .min(0, { message: "Spouse gross wages must be 0 or greater" })
          .max(1000000000, { message: "Spouse gross wages is too large" })
          .optional(),
        socialSecurity: z.coerce
          .number()
          .min(0, { message: "Spouse Social Security must be 0 or greater" })
          .max(1000000000, { message: "Spouse Social Security is too large" })
          .optional(),
        pension: z.coerce
          .number()
          .min(0, { message: "Spouse pension(s) must be 0 or greater" })
          .max(1000000000, { message: "Spouse pension(s) is too large" })
          .optional(),
        otherIncome: z.coerce
          .number()
          .min(0, { message: "Spouse other income must be 0 or greater" })
          .max(1000000000, { message: "Spouse other income is too large" })
          .optional(),
      }),
      additionalSourcesIncomeList: z.string().optional(),
      additionalSourcesIncome: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Additional sources income is required" })
        .min(0, { message: "Additional sources must be 0 or greater" })
        .max(1000000000, { message: "Additional sources income is too large" }),
      interestDividendsRoyalties: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Interest, dividends, and royalties is required" })
        .min(0, { message: "Interest, dividends, and royalties must be 0 or greater" })
        .max(1000000000, { message: "Interest, dividends, and royalties is too large" }),
      distributions: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Distributions is required" })
        .min(0, { message: "Distributions must be 0 or greater" })
        .max(1000000000, { message: "Distributions is too large" }),
      netRentalIncome: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Net rental income is required" })
        .min(0, { message: "Net rental income must be 0 or greater" })
        .max(1000000000, { message: "Net rental income is too large" }),
      netBusinessIncomeFromBoxC: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Net business income from Box C is required" })
        .min(0, { message: "Net business income from Box C must be 0 or greater" })
        .max(1000000000, { message: "Net business income from Box C is too large" }),
      childSupportReceived: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Child support received is required" })
        .min(0, { message: "Child support received must be 0 or greater" })
        .max(1000000000, { message: "Child support received is too large" }),
      alimonyReceived: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Alimony received is required" })
        .min(0, { message: "Alimony received must be 0 or greater" })
        .max(1000000000, { message: "Alimony received is too large" }),
    }),
    expenses: z.object({
      foodClothingMiscellaneous: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Food, clothing, and miscellaneous is required" })
        .min(0, { message: "Food, clothing, and miscellaneous must be 0 or greater" })
        .max(1000000000, { message: "Food, clothing, and miscellaneous is too large" }),
      monthlyRentalPayment: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Monthly rent payment is required" })
        .min(0, { message: "Monthly rent payment must be 0 or greater" })
        .max(1000000000, { message: "Monthly rent payment is too large" }),
      housingUtilities: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Housing and utilities is required" })
        .min(0, { message: "Housing and utilities must be 0 or greater" })
        .max(1000000000, { message: "Housing and utilities is too large" }),
      vehicleLoanLeasePayments: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Vehicle loan/lease is required" })
        .min(0, { message: "Vehicle loan/lease must be 0 or greater" })
        .max(1000000000, { message: "Vehicle loan/lease is too large" }),
      vehicleOperatingCosts: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Vehicle operating costs is required" })
        .min(0, { message: "Vehicle operating costs must be 0 or greater" })
        .max(1000000000, { message: "Vehicle operating costs is too large" }),
      publicTransportationCosts: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Public transportation is required" })
        .min(0, { message: "Public transportation must be 0 or greater" })
        .max(1000000000, { message: "Public transportation is too large" }),
      healthInsurancePremiums: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Health insurance premiums is required" })
        .min(0, { message: "Health insurance premiums must be 0 or greater" })
        .max(1000000000, { message: "Health insurance premiums is too large" }),
      outOfPocketHealthCare: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Out-of-pocket healthcare is required" })
        .min(0, { message: "Out-of-pocket healthcare must be 0 or greater" })
        .max(1000000000, { message: "Out-of-pocket healthcare is too large" }),
      courtOrderedPayments: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Court-ordered payments is required" })
        .min(0, { message: "Court-ordered payments must be 0 or greater" })
        .max(1000000000, { message: "Court-ordered payments is too large" }),
      childDependentCare: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Child/dependent care is required" })
        .min(0, { message: "Child/dependent care must be 0 or greater" })
        .max(1000000000, { message: "Child/dependent care is too large" }),
      lifeInsurancePremiums: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Life insurance premiums is required" })
        .min(0, { message: "Life insurance premiums must be 0 or greater" })
        .max(1000000000, { message: "Life insurance premiums is too large" }),
      lifeInsuranceAmount: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Life insurance amount is required" })
        .min(0, { message: "Life insurance amount must be 0 or greater" })
        .max(1000000000, { message: "Life insurance amount is too large" }),
      currentMonthlyTaxes: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Current monthly taxes is required" })
        .min(0, { message: "Current monthly taxes must be 0 or greater" })
        .max(1000000000, { message: "Current monthly taxes is too large" }),
      securedDebts: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Secured debts/other is required" })
        .min(0, { message: "Secured debts/other must be 0 or greater" })
        .max(1000000000, { message: "Secured debts/other is too large" }),
      securedDebtsList: z.string().optional(),
      monthlyTaxPayments: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Monthly tax payments is required" })
        .min(0, { message: "Monthly tax payments must be 0 or greater" })
        .max(1000000000, { message: "Monthly tax payments is too large" }),
      totalTaxOwed: z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: "Total tax owed is required" })
        .min(0, { message: "Total tax owed must be 0 or greater" })
        .max(1000000000, { message: "Total tax owed is too large" }),
    }),
    boxD: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Box D is required" })
      .min(0, { message: "Box D must be 0 or greater" }),
    boxE: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Box E is required" })
      .min(0, { message: "Box E must be 0 or greater" }),
    boxF: z.coerce
      .number()
      .refine((v) => !Number.isNaN(v), { message: "Box F is required" })
      .min(0, { message: "Box F must be 0 or greater" })
  })
  .refine(
    (data) => {
      if (
        data.income.additionalSourcesIncome > 0 &&
        !data.income.additionalSourcesIncomeList
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Additional sources list is required if additional sources amount is provided",
      path: ["income.additionalSourcesIncomeList"],
    }
  )
  .refine(
    (data) => {
      if (data.expenses.securedDebts > 0 && !data.expenses.securedDebtsList) {
        return false;
      }
      return true;
    },
    {
      message:
        "Secured debts list is required if secured debts amount is provided",
      path: ["expenses.securedDebtsList"],
    }
  );
