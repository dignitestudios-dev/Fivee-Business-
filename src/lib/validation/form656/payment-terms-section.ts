import * as z from "zod";

const additionalPaymentSchema = z.object({
  amount: z.number({ message: "Must be a number" }).min(0, "Amount must be non-negative"),
  payableWithinMonths: z
    .number({ message: "Must be a number" })
    .min(1, "Months must be at least 1")
    .max(5, "Months must be at most 5"),
});

const lumpSumSchema = z
  .object({
    totalOfferAmount: z.number({ message: "Must be a number" }).min(0, "Offer amount required"),
    initialPayment: z.number({ message: "Must be a number" }).min(0, "Initial payment required"),
    additionalPayments: z
      .array(additionalPaymentSchema)
      .max(5, "Maximum 5 additional payments"),
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
    totalOfferAmount: z.number({ message: "Must be a number" }).min(0, "Offer amount required"),
    firstMonthlyPayment: z.number({ message: "Must be a number" }).min(0, "First payment required"),
    subsequentMonthlyPayment: z.number({ message: "Must be a number" }).min(0, "Subsequent payment required"),
    paymentDayOfMonth: z.number({ message: "Must be a number" }).min(1).max(28),
    subsequentMonths: z.number({ message: "Must be a number" }).min(4).max(22),
    finalPaymentAmount: z.number({ message: "Must be a number" }).min(0),
    finalPaymentDay: z.number({ message: "Must be a number" }).min(1).max(28),
    finalPaymentMonth: z.number({ message: "Must be a number" }).min(6).max(24),
    monthsToPay: z.number({ message: "Must be a number" }).min(6).max(24),
  })
  .refine(
    (data) => {
      const numSubPayments = data.subsequentMonths;
      const total =
        data.firstMonthlyPayment +
        numSubPayments * data.subsequentMonthlyPayment +
        data.finalPaymentAmount;
      // Allow for small floating point differences
      return Math.abs(total - data.totalOfferAmount) < 0.01;
    },
    {
      message: "Payments must sum to total offer amount",
      path: ["finalPaymentAmount"],
    }
  )
  .refine((data) => data.monthsToPay === data.subsequentMonths + 2, {
    message: "Total months must be subsequent months + 2",
    path: ["monthsToPay"],
  })
  .refine((data) => data.finalPaymentMonth === data.monthsToPay, {
    message: "Final payment month must equal total months",
    path: ["finalPaymentMonth"],
  });

export const paymentTermsSchema = z
  .object({
    paymentOption: z.enum(["lump-sum", "periodic"]),
    lumpSum: z
      .union([
        lumpSumSchema,
        z.object({
          totalOfferAmount: z.number({ message: "Must be a number" }).optional(),
          initialPayment: z.number({ message: "Must be a number" }).optional(),
          additionalPayments: z.array(additionalPaymentSchema).optional(),
        }),
      ])
      .optional(),
    periodic: z
      .union([
        periodicSchema,
        z.object({
          totalOfferAmount: z.number({ message: "Must be a number" }).optional(),
          firstMonthlyPayment: z.number({ message: "Must be a number" }).optional(),
          subsequentMonthlyPayment: z.number({ message: "Must be a number" }).optional(),
          paymentDayOfMonth: z.number({ message: "Must be a number" }).optional(),
          subsequentMonths: z.number({ message: "Must be a number" }).optional(),
          finalPaymentAmount: z.number({ message: "Must be a number" }).optional(),
          finalPaymentDay: z.number({ message: "Must be a number" }).optional(),
          finalPaymentMonth: z.number({ message: "Must be a number" }).optional(),
          monthsToPay: z.number({ message: "Must be a number" }).optional(),
        }),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentOption === "lump-sum" && !data.lumpSum?.totalOfferAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total offer amount is required for lump sum payment",
        path: ["lumpSum", "totalOfferAmount"],
      });
    }
    if (data.paymentOption === "periodic" && !data.periodic?.totalOfferAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total offer amount is required for periodic payment",
        path: ["periodic", "totalOfferAmount"],
      });
    }
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
    subsequentMonths: 4,
    finalPaymentAmount: 0,
    finalPaymentDay: 1,
    finalPaymentMonth: 6,
    monthsToPay: 6,
  },
};
