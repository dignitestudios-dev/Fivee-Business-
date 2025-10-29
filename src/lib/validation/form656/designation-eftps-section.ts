import * as z from "zod";

const eftpsPaymentSchema = z.object({
  paymentType: z.enum(["Offer application fee", "Offer payment"] as const, {
    message: "Must be either 'Offer application fee' or 'Offer payment'",
  }),
  date: z.string().min(1, "Date required"),
  electronicFundsTransferNumber: z
    .string()
    .regex(/^\d+$/, "Transfer number must contain only numbers"),
});

export const designationEftpsSchema = z.object({
  taxPeriodQuarter: z.string().optional(),
  eftpsPayments: z.array(eftpsPaymentSchema),
});

export const designationEftpsInitialValues: DesignationEftpsFormSchema = {
  taxPeriodQuarter: "",
  eftpsPayments: [],
};
