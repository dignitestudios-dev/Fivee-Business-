import * as z from "zod";

const additionalPaymentSchema = z.object({
  amount: z.number().min(0, "Amount must be non-negative"),
  payableWithinMonths: z
    .number()
    .min(1, "Months must be at least 1")
    .max(5, "Max 5 months for lump sum"),
});

const lumpSumSchema = z
  .object({
    totalOfferAmount: z.number().min(0, "Offer amount required"),
    initialPayment: z.number().min(0, "Initial payment required"),
    additionalPayments: z
      .array(additionalPaymentSchema)
      .max(5, "Up to 5 additional payments"),
  })
  .refine(
    (data) => {
      const totalAdditional = data.additionalPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      return data.initialPayment + totalAdditional === data.totalOfferAmount;
    },
    {
      message: "Payments must sum to total offer",
      path: ["additionalPayments"],
    }
  );

const periodicSchema = z
  .object({
    totalOfferAmount: z.number().min(0, "Offer amount required"),
    firstMonthlyPayment: z.number().min(0, "First payment required"),
    subsequentMonthlyPayment: z.number().min(0, "Subsequent payment required"),
    paymentDayOfMonth: z.number().min(1).max(28),
    monthsToPay: z.number().min(6).max(24),
    finalPaymentAmount: z.number().min(0),
    finalPaymentDay: z.number().min(1).max(28),
    finalPaymentMonth: z.number().min(6).max(24),
  })
  .refine(
    (data) => {
      const numSubPayments = data.monthsToPay - 2;
      const total =
        data.firstMonthlyPayment +
        (numSubPayments >= 0 ? numSubPayments : 0) *
          data.subsequentMonthlyPayment +
        data.finalPaymentAmount;
      return total === data.totalOfferAmount;
    },
    {
      message: "Payments must sum to total offer",
      path: ["finalPaymentAmount"],
    }
  );

export const paymentTermsSchema = z.object({
  paymentOption: z.enum(["lump-sum", "periodic"]),
  lumpSum: lumpSumSchema.optional(),
  periodic: periodicSchema.optional(),
});

export const paymentTermsInitialValues: PaymentTermsFormSchema = {
  paymentOption: "lump-sum",
  lumpSum: {
    totalOfferAmount: 0,
    initialPayment: 0,
    additionalPayments: [],
  },
  periodic: {
    totalOfferAmount: 0,
    firstMonthlyPayment: 0,
    subsequentMonthlyPayment: 0,
    paymentDayOfMonth: 1,
    monthsToPay: 6,
    finalPaymentAmount: 0,
    finalPaymentDay: 1,
    finalPaymentMonth: 6,
  },
};
