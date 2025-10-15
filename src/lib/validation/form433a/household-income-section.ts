import z from "zod";

export const householdIncomeInitialValues: HouseholdIncomeFormSchema = {
  income: {
    primaryTaxpayer: {
      grossWages: 0,
      socialSecurity: 0,
      pension: 0,
      otherIncome: 0,
    },
    spouse: {
      grossWages: 0,
      socialSecurity: 0,
      pension: 0,
      otherIncome: 0,
    },
    interestDividendsRoyalties: 0,
    distributions: 0,
    netRentalIncome: 0,
    childSupportReceived: 0,
    alimonyReceived: 0,
    additionalSourcesIncome: 0,
    additionalSourcesIncomeList: "",
    netBusinessIncomeFromBoxC: 0,
  },
  expenses: {
    foodClothingMiscellaneous: 0,
    monthlyRentalPayment: 0,
    housingUtilities: 0,
    vehicleLoanLeasePayments: 0,
    vehicleOperatingCosts: 0,
    publicTransportationCosts: 0,
    healthInsurancePremiums: 0,
    outOfPocketHealthCare: 0,
    courtOrderedPayments: 0,
    childDependentCare: 0,
    lifeInsuranceAmount: 0,
    lifeInsurancePremiums: 0,
    currentMonthlyTaxes: 0,
    securedDebts: 0,
    securedDebtsList: "",
    monthlyTaxPayments: 0,
    totalTaxOwed: 0,
  },
  boxD: 0,
  boxE: 0,
  boxF: 0,
};

export const householdIncomeSchema = z
  .object({
    income: z.object({
      primaryTaxpayer: z.object({
        grossWages: z.coerce
          .number()
          .min(0, { message: "Gross wages must be 0 or greater" }),
        socialSecurity: z.coerce
          .number()
          .min(0, { message: "Social Security must be 0 or greater" }),
        pension: z.coerce
          .number()
          .min(0, { message: "Pension(s) must be 0 or greater" }),
        otherIncome: z.coerce
          .number()
          .min(0, { message: "Other income must be 0 or greater" }),
      }),
      spouse: z.object({
        grossWages: z.coerce
          .number()
          .min(0, { message: "Spouse gross wages must be 0 or greater" })
          .optional(),
        socialSecurity: z.coerce
          .number()
          .min(0, { message: "Spouse Social Security must be 0 or greater" })
          .optional(),
        pension: z.coerce
          .number()
          .min(0, { message: "Spouse pension(s) must be 0 or greater" })
          .optional(),
        otherIncome: z.coerce
          .number()
          .min(0, { message: "Spouse other income must be 0 or greater" })
          .optional(),
      }),
      additionalSourcesIncomeList: z.string().optional(),
      additionalSourcesIncome: z.coerce
        .number()
        .min(0, { message: "Additional sources must be 0 or greater" }),
      interestDividendsRoyalties: z.coerce.number().min(0, {
        message: "Interest, dividends, and royalties must be 0 or greater",
      }),
      distributions: z.coerce
        .number()
        .min(0, { message: "Distributions must be 0 or greater" }),
      netRentalIncome: z.coerce
        .number()
        .min(0, { message: "Net rental income must be 0 or greater" }),
      netBusinessIncomeFromBoxC: z.coerce.number().min(0, {
        message: "Net business income from Box C must be 0 or greater",
      }),
      childSupportReceived: z.coerce
        .number()
        .min(0, { message: "Child support received must be 0 or greater" }),
      alimonyReceived: z.coerce
        .number()
        .min(0, { message: "Alimony received must be 0 or greater" }),
    }),
    expenses: z.object({
      foodClothingMiscellaneous: z.coerce.number().min(0, {
        message: "Food, clothing, and miscellaneous must be 0 or greater",
      }),
      monthlyRentalPayment: z.coerce
        .number()
        .min(0, { message: "Monthly rent payment must be 0 or greater" }),
      housingUtilities: z.coerce
        .number()
        .min(0, { message: "Housing and utilities must be 0 or greater" }),
      vehicleLoanLeasePayments: z.coerce
        .number()
        .min(0, { message: "Vehicle loan/lease must be 0 or greater" }),
      vehicleOperatingCosts: z.coerce
        .number()
        .min(0, { message: "Vehicle operating costs must be 0 or greater" }),
      publicTransportationCosts: z.coerce
        .number()
        .min(0, { message: "Public transportation must be 0 or greater" }),
      healthInsurancePremiums: z.coerce
        .number()
        .min(0, { message: "Health insurance premiums must be 0 or greater" }),
      outOfPocketHealthCare: z.coerce
        .number()
        .min(0, { message: "Out-of-pocket healthcare must be 0 or greater" }),
      courtOrderedPayments: z.coerce
        .number()
        .min(0, { message: "Court-ordered payments must be 0 or greater" }),
      childDependentCare: z.coerce
        .number()
        .min(0, { message: "Child/dependent care must be 0 or greater" }),
      lifeInsurancePremiums: z.coerce
        .number()
        .min(0, { message: "Life insurance premiums must be 0 or greater" }),
      lifeInsuranceAmount: z.coerce
        .number()
        .min(0, { message: "Life insurance amount must be 0 or greater" }),
      currentMonthlyTaxes: z.coerce
        .number()
        .min(0, { message: "Current monthly taxes must be 0 or greater" }),
      securedDebts: z.coerce
        .number()
        .min(0, { message: "Secured debts/other must be 0 or greater" }),
      securedDebtsList: z.string().optional(),
      monthlyTaxPayments: z.coerce
        .number()
        .min(0, { message: "Monthly tax payments must be 0 or greater" }),
      totalTaxOwed: z.coerce
        .number()
        .min(0, { message: "Total tax owed must be 0 or greater" }),
    }),
    boxD: z.coerce.number().min(0),
    boxE: z.coerce.number().min(0),
    boxF: z.coerce.number().min(0),
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
