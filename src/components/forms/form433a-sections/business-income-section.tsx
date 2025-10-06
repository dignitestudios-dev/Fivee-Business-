"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

interface BusinessIncomeSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function BusinessIncomeSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: BusinessIncomeSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
    clearErrors,
    trigger,
    setValue,
  } = useFormContext<FormData433A>();

  const isSelfEmployed = watch("isSelfEmployed");

  // Calculate totals for display
  const grossReceipts = parseFloat(watch("grossReceipts")) || 0;
  const grossRentalIncome = parseFloat(watch("grossRentalIncome")) || 0;
  const interestIncome = parseFloat(watch("interestIncome")) || 0;
  const dividends = parseFloat(watch("dividends")) || 0;
  const otherIncome = parseFloat(watch("otherIncome")) || 0;
  const totalBusinessIncome =
    grossReceipts +
    grossRentalIncome +
    interestIncome +
    dividends +
    otherIncome;

  const materialsPurchased = parseFloat(watch("materialsPurchased")) || 0;
  const inventoryPurchased = parseFloat(watch("inventoryPurchased")) || 0;
  const grossWagesSalaries = parseFloat(watch("grossWagesSalaries")) || 0;
  const rent = parseFloat(watch("rent")) || 0;
  const supplies = parseFloat(watch("supplies")) || 0;
  const utilitiesTelephones = parseFloat(watch("utilitiesTelephones")) || 0;
  const vehicleCosts = parseFloat(watch("vehicleCosts")) || 0;
  const businessInsurance = parseFloat(watch("businessInsurance")) || 0;
  const currentBusinessTaxes = parseFloat(watch("currentBusinessTaxes")) || 0;
  const securedDebts = parseFloat(watch("securedDebts")) || 0;
  const otherBusinessExpenses = parseFloat(watch("otherBusinessExpenses")) || 0;

  const totalBusinessExpenses =
    materialsPurchased +
    inventoryPurchased +
    grossWagesSalaries +
    rent +
    supplies +
    utilitiesTelephones +
    vehicleCosts +
    businessInsurance +
    currentBusinessTaxes +
    securedDebts +
    otherBusinessExpenses;

  const netBusinessIncome = Math.max(
    0,
    totalBusinessIncome - totalBusinessExpenses
  );

  useEffect(() => {
    setValue("boxC", netBusinessIncome);
  }, [netBusinessIncome, setValue]);

  if (!isSelfEmployed) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 6: Business Income and Expense Information (for
            Self-Employed)
          </h2>
          <p className="text-gray-600">
            This section is not applicable as you are not self-employed.
          </p>
        </div>
        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 6: Business Income and Expense Information (for Self-Employed)
        </h2>
        <p className="text-gray-600">
          If you provide a current profit and loss (P&L) statement for the
          information below, enter the total gross monthly income on line 17 and
          your monthly expenses on line 29 below.
        </p>
        <p className="text-gray-800 font-semibold">
          Round to the nearest whole dollar. Do not enter a negative number. If
          any line item is a negative number, enter "0".
        </p>
        <p className="text-sm text-red-600 font-medium">
          * All fields are required
        </p>
      </div>
      {/* Period Information */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Period Provided Beginning *"
              id="periodStart"
              type="date"
              required={true}
              {...register("periodStart", {
                required: "Period beginning date is required",
                onChange: (e) => {
                  if (e.target.value.trim() !== "") {
                    clearErrors("periodStart");
                    trigger("periodStart");
                  }
                },
              })}
              error={errors.periodStart?.message}
            />
            <FormInput
              label="Through *"
              id="periodEnd"
              type="date"
              required={true}
              {...register("periodEnd", {
                required: "Period through date is required",
                validate: (value) => {
                  const beginDate = watch("periodStart");
                  if (
                    beginDate &&
                    value &&
                    new Date(value) <= new Date(beginDate)
                  ) {
                    return "Through date must be after beginning date";
                  }
                  return true;
                },
                onChange: (e) => {
                  if (e.target.value.trim() !== "") {
                    clearErrors("periodEnd");
                    trigger("periodEnd");
                  }
                },
              })}
              error={errors.periodEnd?.message}
            />
          </div>
        </CardContent>
      </Card>
      {/* Business Income */}
      <Card>
        <CardHeader>
          <CardTitle>Business Income</CardTitle>
          <p className="text-sm text-gray-600">
            You may average 6-12 months income/receipts to determine your gross
            monthly income/receipts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Gross Receipts ($) *"
              id="grossReceipts"
              type="number"
              required={true}
              {...register("grossReceipts", {
                required: "Gross receipts is required",
                validate: (value) => {
                  if (!value || value.trim() === "")
                    return "Gross receipts is required";
                  const num = Number(value);
                  if (isNaN(num)) return "Must be a number";
                  if (num < 0) return "Must be 0 or greater";
                  return true;
                },
                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("grossReceipts");
                    trigger("grossReceipts");
                  }
                },
              })}
              error={errors.grossReceipts?.message}
            />
            <FormInput
              label="Gross Rental Income ($) *"
              id="grossRentalIncome"
              type="number"
              required={true}
              {...register("grossRentalIncome", {
                required: "Gross rental income is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("grossRentalIncome");
                    trigger("grossRentalIncome");
                  }
                },
              })}
              error={errors.grossRentalIncome?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Interest Income ($) *"
              id="interestIncome"
              type="number"
              required={true}
              {...register("interestIncome", {
                required: "Interest income is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("interestIncome");
                    trigger("interestIncome");
                  }
                },
              })}
              error={errors.interestIncome?.message}
            />
            <FormInput
              label="Dividends ($) *"
              id="dividends"
              type="number"
              required={true}
              {...register("dividends", {
                required: "Dividends is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("dividends");
                    trigger("dividends");
                  }
                },
              })}
              error={errors.dividends?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Other Income ($) *"
              id="otherIncome"
              type="number"
              required={true}
              {...register("otherIncome", {
                required: "Other business income is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("otherIncome");
                    trigger("otherIncome");
                  }
                },
              })}
              error={errors.otherIncome?.message}
            />
            <div className="bg-[#22b573]/5 p-4 rounded-lg">
              <div className="font-medium">Total Business Income ($)</div>
              <div className="text-2xl font-bold text-[#22b573] mt-1">
                ${totalBusinessIncome.toFixed(0)}
              </div>
              <p className="text-xs text-gray-500">Calculated automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Business Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Business Expenses</CardTitle>
          <p className="text-sm text-gray-600">
            You may average 6-12 months expenses to determine your average
            expenses
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormInput
                label="Materials Purchased ($) *"
                id="materialsPurchased"
                type="number"
                required={true}
                {...register("materialsPurchased", {
                  required: "Materials purchased is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("materialsPurchased");
                      trigger("materialsPurchased");
                    }
                  },
                })}
                error={errors.materialsPurchased?.message}
              />
              <p className="text-xs text-gray-500">
                Items directly related to the production of a product or service
              </p>
            </div>
            <div className="space-y-2">
              <FormInput
                label="Inventory Purchased ($) *"
                id="inventoryPurchased"
                type="number"
                required={true}
                {...register("inventoryPurchased", {
                  required: "Inventory purchased is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("inventoryPurchased");
                      trigger("inventoryPurchased");
                    }
                  },
                })}
                error={errors.inventoryPurchased?.message}
              />
              <p className="text-xs text-gray-500">Goods bought for resale</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Gross Wages and Salaries ($) *"
              id="grossWagesSalaries"
              type="number"
              required={true}
              {...register("grossWagesSalaries", {
                required: "Gross wages is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("grossWagesSalaries");
                    trigger("grossWagesSalaries");
                  }
                },
              })}
              error={errors.grossWagesSalaries?.message}
            />
            <FormInput
              label="Rent ($) *"
              id="rent"
              type="number"
              required={true}
              {...register("rent", {
                required: "Business rent is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("rent");
                    trigger("rent");
                  }
                },
              })}
              error={errors.rent?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormInput
                label="Supplies ($) *"
                id="supplies"
                type="number"
                required={true}
                {...register("supplies", {
                  required: "Business supplies is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("supplies");
                      trigger("supplies");
                    }
                  },
                })}
                error={errors.supplies?.message}
              />
              <p className="text-xs text-gray-500">
                Items used to conduct business and used up within one year
              </p>
            </div>
            <FormInput
              label="Utilities/Telephones ($) *"
              id="utilitiesTelephones"
              type="number"
              required={true}
              {...register("utilitiesTelephones", {
                required: "Utilities/telephones is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("utilitiesTelephones");
                    trigger("utilitiesTelephones");
                  }
                },
              })}
              error={errors.utilitiesTelephones?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormInput
                label="Vehicle Costs ($) *"
                id="vehicleCosts"
                type="number"
                required={true}
                {...register("vehicleCosts", {
                  required: "Vehicle costs is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("vehicleCosts");
                      trigger("vehicleCosts");
                    }
                  },
                })}
                error={errors.vehicleCosts?.message}
              />
              <p className="text-xs text-gray-500">
                Gas, oil, repairs, maintenance
              </p>
            </div>
            <FormInput
              label="Business Insurance ($) *"
              id="businessInsurance"
              type="number"
              required={true}
              {...register("businessInsurance", {
                required: "Business insurance is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("businessInsurance");
                    trigger("businessInsurance");
                  }
                },
              })}
              error={errors.businessInsurance?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormInput
                label="Current Business Taxes ($) *"
                id="currentBusinessTaxes"
                type="number"
                required={true}
                {...register("currentBusinessTaxes", {
                  required: "Current business taxes is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("currentBusinessTaxes");
                      trigger("currentBusinessTaxes");
                    }
                  },
                })}
                error={errors.currentBusinessTaxes?.message}
              />
              <p className="text-xs text-gray-500">
                Real estate, excise, franchise, occupational, personal property,
                sales and employer's portion of employment taxes
              </p>
            </div>
            <FormInput
              label="Secured Debts (not credit cards) ($) *"
              id="securedDebts"
              type="number"
              required={true}
              {...register("securedDebts", {
                required: "Secured debts is required",
                min: { value: 0, message: "Must be 0 or greater" },

                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    clearErrors("securedDebts");
                    trigger("securedDebts");
                  }
                },
              })}
              error={errors.securedDebts?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormInput
                label="Other Business Expenses ($) *"
                id="otherBusinessExpenses"
                type="number"
                required={true}
                {...register("otherBusinessExpenses", {
                  required: "Other business expenses is required",
                  min: { value: 0, message: "Must be 0 or greater" },

                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors("otherBusinessExpenses");
                      trigger("otherBusinessExpenses");
                    }
                  },
                })}
                error={errors.otherBusinessExpenses?.message}
              />
              <p className="text-xs text-gray-500">Include a list</p>
            </div>
            <div className="bg-[#22b573]/5 p-4 rounded-lg">
              <div className="font-medium">Total Business Expenses ($)</div>
              <div className="text-2xl font-bold text-[#22b573] mt-1">
                ${totalBusinessExpenses.toFixed(0)}
              </div>
              <p className="text-xs text-gray-500">Calculated automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Business Income */}
      <Card>
        <CardHeader>
          <CardTitle>Net Business Income Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Round to the nearest whole dollar
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Total Income minus Total Expenses
              </p>
              <p className="font-bold text-lg">
                Net Business Income (Box C) = $
                {netBusinessIncome.toLocaleString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Box C - Net Business Income
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
