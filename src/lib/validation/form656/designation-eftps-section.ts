import * as z from "zod";

export const eftpsPaymentSchema = z.object({
  offerApplicationFee: z
    .number({ message: "Must be a number" })
    .nonnegative("Cannot be negative"),

  offerApplicationFeeDate: z.string().min(1, "Date required"),

  offerApplicationFeeElectronicFundsTransferNumber: z
    .string()
    .regex(/^\d+$/, "Transfer number must contain only numbers"),

  offerPayment: z
    .number({ message: "Must be a number" })
    .nonnegative("Cannot be negative"),

  offerPaymentDate: z.string().min(1, "Date required"),

  offerPaymentElectronicFundsTransferNumber: z
    .string()
    .regex(/^\d+$/, "Transfer number must contain only numbers"),
});

export const designationEftpsSchema = z.object({
  taxPeriodQuarter: z.string().optional(),
  eftpsPayments: eftpsPaymentSchema, // ⬅️ Now a SINGLE object
});

export const designationEftpsInitialValues: DesignationEftpsFormSchema = {
  taxPeriodQuarter: "",
  eftpsPayments: {
    offerApplicationFee: null,
    offerApplicationFeeDate: "",
    offerApplicationFeeElectronicFundsTransferNumber: "",
    offerPayment: null,
    offerPaymentDate: "",
    offerPaymentElectronicFundsTransferNumber: "",
  },
};
