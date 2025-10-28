import * as z from "zod";

export const reasonForOfferSchema = z.object({
  reasonType: z.enum(
    [
      "Doubt as to Collectibility",
      "Economic Hardship",
      "Public Policy or Equity",
    ] as const,
    { error: "Please select a reason for the offer" }
  ),
});

export const reasonForOfferInitialValues: ReasonForOfferFormSchema = {
  reasonType: "Doubt as to Collectibility",
};
