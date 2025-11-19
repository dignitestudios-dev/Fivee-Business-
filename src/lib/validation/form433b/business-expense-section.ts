import z from "zod";

export const businessExpenseInitialValues = {
  periodBeginning: "",
  periodThrough: "",
  materialsPurchased: 0,
  inventoryPurchased: 0,
  grossWages: 0,
  rent: 0,
  supplies: 0,
  utilities: 0,
  vehicleCosts: 0,
  insurance: 0,
  currentTaxes: 0,
  otherExpenses: 0,
};

export const businessExpenseSchema = z
  .object({
    periodBeginning: z.string().min(1, "Period beginning is required"),
    periodThrough: z.string().min(1, "Period through is required"),
    materialsPurchased: z.number({ message: "Must be a number" }).min(0),
    inventoryPurchased: z.number({ message: "Must be a number" }).min(0),
    grossWages: z.number({ message: "Must be a number" }).min(0),
    rent: z.number({ message: "Must be a number" }).min(0),
    supplies: z.number({ message: "Must be a number" }).min(0),
    utilities: z.number({ message: "Must be a number" }).min(0),
    vehicleCosts: z.number({ message: "Must be a number" }).min(0),
    insurance: z.number({ message: "Must be a number" }).min(0),
    currentTaxes: z.number({ message: "Must be a number" }).min(0),
    otherExpenses: z.number({ message: "Must be a number" }).min(0),
  })
  .refine(
    (data) => {
      if (!data.periodBeginning || !data.periodThrough) return true;
      return new Date(data.periodThrough) >= new Date(data.periodBeginning);
    },
    {
      message: "Period Through cannot be earlier than Period Beginning",
      path: ["periodThrough"],
    }
  );
