import z from "zod";

export const businessAssetInitialValues = {
  bankAccounts: [],
  investmentAccounts: [],
  digitalAssets: [],
  hasNotesReceivable: false,
  notesReceivable: [],
  hasAccountsReceivable: false,
  accountsReceivable: [],
  realEstate: [],
  vehicles: [],
  businessEquipment: [],
};

const dateStringToDate = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const parsed = new Date(val);
      if (isNaN(parsed.getTime())) return val; // let z.date() handle the error
      return parsed.toISOString().split("T")[0]; // 👈 return "YYYY-MM-DD"
    }

    if (val instanceof Date) {
      return val.toISOString().split("T")[0]; // handle actual Date objects too
    }

    return val;
  },
  z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Please enter a valid date in YYYY-MM-DD format",
  })
);

const bankAccountSchema = z.object({
  type: z.string().min(1, "Account type is required"),
  bankName: z.string().min(1, "Bank name and country is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  balance: z.number({ message: "Must be a number" }).min(0, "Balance must be non-negative"),
});

const investmentAccountSchema = z.object({
  institutionName: z
    .string()
    .min(1, "Institution name and country is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  currentMarketValue: z.number({ message: "Must be a number" }).min(0),
  loanBalance: z.number({ message: "Must be a number" }).min(0),
  type: z.string().min(1, "Account type is required"),
  investmentTypeText: z.string().optional(),
});

const digitalAssetSchema = z.object({
  description: z.string().min(1, "Description is required"),
  numberOfUnits: z.number({ message: "Must be a number" }).min(0),
  location: z.string().min(1, "Location is required"),
  accountNumber: z.string().optional(),
  address: z.string().optional(),
  usdValue: z.number({ message: "Must be a number" }).min(0),
});

const noteReceivableSchema = z.object({
  noteHolder: z.string().min(1, "Note holder name is required"),
  amount: z.number({ message: "Must be a number" }).min(0),
  age: z.string().min(1, "Age is required"),
});

const accountReceivableSchema = z.object({
  company: z.string().min(1, "Company/name is required"),
  amount: z.number({ message: "Must be a number" }).min(0),
  age: z.string().min(1, "Age is required"),
});

const realEstateSchema = z.object({
  propertyAddress: z.string().min(1, "Property address is required"),
  description: z.string().min(1, "Description is required"),
  datePurchased: dateStringToDate,
  monthlyPayment: z.number({ message: "Must be a number" }).min(0),
  finalPaymentDate: dateStringToDate.optional(),
  lenderName: z.string().min(1, "Lender name is required"),
  currentMarketValue: z.number({ message: "Must be a number" }).min(0),
  loanBalance: z.number({ message: "Must be a number" }).min(0),
  isForSaleOrAnticipateSelling: z.boolean(),
  listingPrice: z.number({ message: "Must be a number" }).min(0).optional(),
});

const vehicleSchema = z.object({
  vehicleMakeModel: z.string().min(1, "Make & model is required"),
  year: z.string().min(1, "Year is required"),
  datePurchased: dateStringToDate,
  mileageOrHours: z.number({ message: "Must be a number" }).min(0),
  licenseTag: z.string().min(1, "License/tag is required"),
  leaseOrOwn: z.enum(["Lease", "Own"]),
  monthlyLeaseAmount: z.number({ message: "Must be a number" }).min(0),
  creditor: z.string().optional(),
  finalPaymentDate: dateStringToDate.optional(),
  currentMarketValue: z.number({ message: "Must be a number" }).min(0),
  loanBalance: z.number({ message: "Must be a number" }).min(0),
});

const businessEquipmentSchema = z.object({
  type: z.string().min(1, "Type is required"),
  currentMarketValue: z.number({ message: "Must be a number" }).min(0),
  loanBalance: z.number({ message: "Must be a number" }).min(0),
  isLeased: z.boolean(),
  usedInProductionOfIncome: z.boolean(),
});

export const businessAssetSchema = z
  .object({
    bankAccounts: z.array(bankAccountSchema),
    investmentAccounts: z.array(investmentAccountSchema),
    digitalAssets: z.array(digitalAssetSchema),
    hasNotesReceivable: z.boolean(),
    notesReceivable: z.array(noteReceivableSchema),
    hasAccountsReceivable: z.boolean(),
    accountsReceivable: z.array(accountReceivableSchema),
    realEstate: z.array(realEstateSchema),
    vehicles: z.array(vehicleSchema),
    businessEquipment: z.array(businessEquipmentSchema),
  })
  .superRefine((data, ctx) => {
    // If hasNotes, require at least one note
    if (data.hasNotesReceivable && data.notesReceivable.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one note receivable is required",
        path: ["notesReceivable"],
      });
    }
    // Same for accounts
    if (data.hasAccountsReceivable && data.accountsReceivable.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one account receivable is required",
        path: ["accountsReceivable"],
      });
    }
    // For investments, if type Other, require text
    data.investmentAccounts.forEach((inv, i) => {
      if (
        inv.type === "other" &&
        (!inv.investmentTypeText || inv.investmentTypeText.trim() === "")
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Specify other investment type",
          path: ["investmentAccounts", i, "investmentTypeText"],
        });
      }
    });
    // For real, if isForSale, require listingPrice >0
    data.realEstate.forEach((real, i) => {
      if (real.isForSaleOrAnticipateSelling && (real.listingPrice ?? 0) <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Listing price is required if for sale",
          path: ["realEstate", i, "listingPrice"],
        });
      }
    });
  });
