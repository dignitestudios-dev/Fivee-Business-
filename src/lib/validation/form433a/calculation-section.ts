import z from "zod";

export const calculationInitialValues: CalculationFormSchema = {
  paymentTimeline: "",
  boxF5Month: 0,
  boxF24Month: 0,
  boxG: 0,
  boxH: 0,
  boxA: 0,
  boxB: 0,
  futureIncome: 0,
  minimumOfferAmount: 0,
};

export const calculationSchema = z.object({
  paymentTimeline: z.enum(["5_months_or_less", "6_to_24_months"], {
    message: "Payment timeline is required",
  }),
  boxF5Month: z.coerce
    .number()
    .min(0, { message: "Box F (5 month) must be 0 or greater" }),
  boxF24Month: z.coerce
    .number()
    .min(0, { message: "Box F (24 month) must be 0 or greater" }),
  boxG: z.coerce.number().min(0),
  boxH: z.coerce.number().min(0),
  boxA: z.coerce.number().min(0, { message: "Box A must be 0 or greater" }),
  boxB: z.coerce.number().min(0, { message: "Box B must be 0 or greater" }),
  futureIncome: z.coerce.number().min(0),
  minimumOfferAmount: z.coerce.number().min(0),
});
