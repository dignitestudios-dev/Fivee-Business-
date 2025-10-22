import z from "zod";

export const calculationInitialValues = {
  paymentTimeline: "5_months_or_less",
};

export const calculationSchemaFormB = z.object({
  paymentTimeline: z.enum(["5_months_or_less", "6_to_24_months"]),
});