import z from "zod";

export const calculationInitialValues: CalculationFormSchema = {
  paymentTimeline: "",
  boxF5Month: "",
  boxF24Month: "",
  boxG: "",
  boxH: "",
  boxA: "",
  boxB: "",
  futureIncome: "",
  minimumOfferAmount: "",
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
