import * as z from "zod";

const eftpsPaymentSchema = z.object({
  paymentType: z.string().min(1, "Payment type required"),
  date: z.string().min(1, "Date required"),
  electronicFundsTransferNumber: z.string().min(1, "Transfer number required"),
});

export const designationEftpsSchema = z.object({
  taxPeriodQuarter: z.string().optional(),
  eftpsPayments: z.array(eftpsPaymentSchema),
});

export const designationEftpsInitialValues: DesignationEftpsFormSchema = {
  taxPeriodQuarter: "",
  eftpsPayments: [],
};