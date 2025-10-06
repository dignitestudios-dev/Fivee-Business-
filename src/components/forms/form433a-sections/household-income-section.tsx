"use client";

import { FormNavigation } from "./form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import Link from "next/link";
import { useEffect } from "react";

interface HouseholdIncomeSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function HouseholdIncomeSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: HouseholdIncomeSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData433A>();

  const maritalStatus = watch("maritalStatus");

  // Calculate totals for income
  const primaryGrossWages = watch("primaryGrossWages") || 0;
  const primarySocialSecurity = watch("primarySocialSecurity") || 0;
  const primaryPensions = watch("primaryPensions") || 0;
  const primaryOtherIncome = watch("primaryOtherIncome") || 0;

  const spouseGrossWages = watch("spouseGrossWages") || 0;
  const spouseSocialSecurity = watch("spouseSocialSecurity") || 0;
  const spousePensions = watch("spousePensions") || 0;
  const spouseOtherIncome = watch("spouseOtherIncome") || 0;

  const additionalSources = watch("additionalSources") || 0;
  const interestDividendsRoyalties = watch("interestDividendsRoyalties") || 0;
  const distributions = watch("distributions") || 0;
  const netRentalIncome = watch("netRentalIncome") || 0;
  const netBusinessIncomeFromBoxC = watch("netBusinessIncomeFromBoxC") || 0;
  const childSupportReceived = watch("childSupportReceived") || 0;
  const alimonyReceived = watch("alimonyReceived") || 0;

  const totalPrimaryIncome =
    Number(primaryGrossWages) +
    Number(primarySocialSecurity) +
    Number(primaryPensions) +
    Number(primaryOtherIncome);

  const totalSpouseIncome =
    Number(spouseGrossWages) +
    Number(spouseSocialSecurity) +
    Number(spousePensions) +
    Number(spouseOtherIncome);

  const totalHouseholdIncome =
    totalPrimaryIncome +
    totalSpouseIncome +
    Number(additionalSources) +
    Number(interestDividendsRoyalties) +
    Number(distributions) +
    Number(netRentalIncome) +
    Number(netBusinessIncomeFromBoxC) +
    Number(childSupportReceived) +
    Number(alimonyReceived);

  // Calculate totals for expenses
  const foodClothingMisc = watch("foodClothingMisc") || 0;
  const housingUtilities = watch("housingUtilities") || 0;
  const monthlyRentPayment = watch("monthlyRentPayment") || 0;
  const vehicleLoanLease = watch("vehicleLoanLease") || 0;
  const vehicleOperatingCosts = watch("vehicleOperatingCosts") || 0;
  const publicTransportation = watch("publicTransportation") || 0;
  const healthInsurancePremiums = watch("healthInsurancePremiums") || 0;
  const outOfPocketHealthcare = watch("outOfPocketHealthcare") || 0;
  const courtOrderedPayments = watch("courtOrderedPayments") || 0;
  const childDependentCare = watch("childDependentCare") || 0;
  const lifeInsurancePremiums = watch("lifeInsurancePremiums") || 0;
  const currentMonthlyTaxes = watch("currentMonthlyTaxes") || 0;
  const securedDebtsOther = watch("securedDebtsOther") || 0;
  const monthlyDelinquentTaxPayments =
    watch("monthlyDelinquentTaxPayments") || 0;

  const totalHouseholdExpenses =
    Number(foodClothingMisc) +
    Number(housingUtilities) +
    Number(monthlyRentPayment) +
    Number(vehicleLoanLease) +
    Number(vehicleOperatingCosts) +
    Number(publicTransportation) +
    Number(healthInsurancePremiums) +
    Number(outOfPocketHealthcare) +
    Number(courtOrderedPayments) +
    Number(childDependentCare) +
    Number(lifeInsurancePremiums) +
    Number(currentMonthlyTaxes) +
    Number(securedDebtsOther) +
    Number(monthlyDelinquentTaxPayments);

  const remainingMonthlyIncome = totalHouseholdIncome - totalHouseholdExpenses;

  useEffect(() => {
    setValue("boxD", totalHouseholdIncome);
    setValue("boxE", totalHouseholdExpenses);
    setValue("boxF", remainingMonthlyIncome);
  }, [
    totalHouseholdIncome,
    totalHouseholdExpenses,
    remainingMonthlyIncome,
    setValue,
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 7: Monthly Household Income and Expense Information
        </h2>
        <p className="text-gray-600 mb-4">
          Enter your household's average gross monthly income. Gross monthly
          income includes wages, social security, pension, unemployment, and
          other income. Examples of other income include but are not limited to:
          agricultural subsidies, gambling income, oil credits, rent subsidies,
          sharing economy income from providing on-demand work, services or
          goods (e.g., Uber, Lyft, DoorDash, AirBnb, VRBO), income through
          digital platforms like an app or website, etc., and recurring capital
          gains from the sale of securities or other property such as digital
          assets. Include the below information for yourself, your spouse, and
          anyone else who contributes to your household's income. This is
          necessary for the IRS to accurately evaluate your offer.
        </p>
      </div>

      {/* Monthly Household Income */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Household Income</CardTitle>
          <p className="text-sm text-gray-600">
            Note: Entire household income should also include income that is
            considered not taxable and may not be included on your tax return.
            Round to the nearest whole dollar.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary taxpayer */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Primary taxpayer</h4>
            <div className="grid grid-cols-4 gap-4 items-end">
              <div>
                <Label className="text-sm">Gross wages</Label>
                <div className="flex items-center mt-1">
                  <span className="mr-2">$</span>
                  <FormInput
                    label=""
                    id="primaryGrossWages"
                    type="number"
                    placeholder="0"
                    {...register("primaryGrossWages")}
                    error={errors.primaryGrossWages?.message}
                    className="text-center"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Social Security</Label>
                <div className="flex items-center mt-1">
                  <span className="mr-2">+ $</span>
                  <FormInput
                    label=""
                    id="primarySocialSecurity"
                    type="number"
                    placeholder="0"
                    {...register("primarySocialSecurity")}
                    error={errors.primarySocialSecurity?.message}
                    className="text-center"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Pension(s)</Label>
                <div className="flex items-center mt-1">
                  <span className="mr-2">+ $</span>
                  <FormInput
                    label=""
                    id="primaryPensions"
                    type="number"
                    placeholder="0"
                    {...register("primaryPensions")}
                    error={errors.primaryPensions?.message}
                    className="text-center"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">
                  Other income (e.g. unemployment)
                </Label>
                <div className="flex items-center mt-1">
                  <span className="mr-2">+ $</span>
                  <FormInput
                    label=""
                    id="primaryOtherIncome"
                    type="number"
                    placeholder="0"
                    {...register("primaryOtherIncome")}
                    error={errors.primaryOtherIncome?.message}
                    className="text-center"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Total primary taxpayer income ={" "}
                </span>
                <span className="font-bold">
                  (30) ${totalPrimaryIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Spouse */}
          {maritalStatus === "married" && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Spouse</h4>
              <div className="grid grid-cols-4 gap-4 items-end">
                <div>
                  <Label className="text-sm">Gross wages</Label>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">$</span>
                    <FormInput
                      label=""
                      id="spouseGrossWages"
                      type="number"
                      placeholder="0"
                      {...register("spouseGrossWages")}
                      error={errors.spouseGrossWages?.message}
                      className="text-center"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Social Security</Label>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">+ $</span>
                    <FormInput
                      label=""
                      id="spouseSocialSecurity"
                      type="number"
                      placeholder="0"
                      {...register("spouseSocialSecurity")}
                      error={errors.spouseSocialSecurity?.message}
                      className="text-center"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Pension(s)</Label>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">+ $</span>
                    <FormInput
                      label=""
                      id="spousePensions"
                      type="number"
                      placeholder="0"
                      {...register("spousePensions")}
                      error={errors.spousePensions?.message}
                      className="text-center"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">
                    Other Income (e.g. unemployment)
                  </Label>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">+ $</span>
                    <FormInput
                      label=""
                      id="spouseOtherIncome"
                      type="number"
                      placeholder="0"
                      {...register("spouseOtherIncome")}
                      error={errors.spouseOtherIncome?.message}
                      className="text-center"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-gray-600">
                    Total spouse income ={" "}
                  </span>
                  <span className="font-bold">
                    (31) ${totalSpouseIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional income sources */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <Label>
                Additional sources of income used to support the household,
                e.g., non-liable spouse, or anyone else who may contribute to
                the household income, etc. List source(s)
              </Label>
              <div className="flex items-center">
                <span className="mr-2">(32) $</span>
                <FormInput
                  label=""
                  id="additionalSources"
                  type="number"
                  placeholder="0"
                  {...register("additionalSources")}
                  error={errors.additionalSources?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <Label>Interest, dividends, and royalties</Label>
              <div className="flex items-center">
                <span className="mr-2">(33) $</span>
                <FormInput
                  label=""
                  id="interestDividendsRoyalties"
                  type="number"
                  placeholder="0"
                  {...register("interestDividendsRoyalties")}
                  error={errors.interestDividendsRoyalties?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <Label>
                Distributions (e.g., income from partnerships, sub-S
                Corporations, etc.)
              </Label>
              <div className="flex items-center">
                <span className="mr-2">(34) $</span>
                <FormInput
                  label=""
                  id="distributions"
                  type="number"
                  placeholder="0"
                  {...register("distributions")}
                  error={errors.distributions?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <Label>Net rental income</Label>
              <div className="flex items-center">
                <span className="mr-2">(35) $</span>
                <FormInput
                  label=""
                  id="netRentalIncome"
                  type="number"
                  placeholder="0"
                  {...register("netRentalIncome")}
                  error={errors.netRentalIncome?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>
                  Net business income from Box C (Deductions for non-cash
                  expenses on Schedule C (e.g., depreciation, depletion, etc.)
                  are not permitted as an expense for offer purposes and must be
                  added back in to the net income figure)
                </Label>
                <div className="flex items-center">
                  <span className="mr-2">(36) $</span>
                  <FormInput
                    label=""
                    id="netBusinessIncomeFromBoxC"
                    type="number"
                    placeholder="0"
                    {...register("netBusinessIncomeFromBoxC")}
                    error={errors.netBusinessIncomeFromBoxC?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <Label>Child support received</Label>
              <div className="flex items-center">
                <span className="mr-2">(37) $</span>
                <FormInput
                  label=""
                  id="childSupportReceived"
                  type="number"
                  placeholder="0"
                  {...register("childSupportReceived")}
                  error={errors.childSupportReceived?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <Label>Alimony received</Label>
              <div className="flex items-center">
                <span className="mr-2">(38) $</span>
                <FormInput
                  label=""
                  id="alimonyReceived"
                  type="number"
                  placeholder="0"
                  {...register("alimonyReceived")}
                  error={errors.alimonyReceived?.message}
                  className="w-32 text-center"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Round to the nearest whole dollar
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Do not enter a negative number. If any line item is a negative,
                enter "0" on that line.
              </p>
              <p className="font-bold text-lg">
                Add lines (30) through (38) and enter the amount in Box D = $
                {totalHouseholdIncome.toLocaleString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Box D - Total Household Income
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Household Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Household Expenses</CardTitle>
          <p className="text-sm text-gray-600">
            Enter your average monthly expenses.
          </p>
          <p className="text-sm text-gray-600 font-medium">
            Note: For expenses claimed in boxes (39) and (45) only, you should
            list the full amount of the allowable standard even if the actual
            amount you pay is less. For the other boxes input your actual
            expenses. You may find the allowable standards at{" "}
            <a
              href={
                "https://IRS.gov/Businesses/Small-Businesses-Self-Employed/Collection-Financial-Standards"
              }
              target="_blank"
              className="text-blue-600"
            >
              IRS.gov/Businesses/Small-Businesses-Self-Employed/Collection-Financial-Standards.
            </a>
          </p>
          <p className="text-sm text-gray-600">
            Round to the nearest whole dollar.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Food, clothing, and miscellaneous (e.g., housekeeping
                    supplies, personal care products, minimum payment on credit
                    card)
                  </Label>
                  <p className="text-xs text-gray-500">
                    A reasonable estimate of these expenses may be used
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(39) $</span>
                  <FormInput
                    label=""
                    id="foodClothingMisc"
                    type="number"
                    placeholder="0"
                    required
                    {...register("foodClothingMisc")}
                    error={errors.foodClothingMisc?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Housing and utilities (e.g., rent or mortgage payment and
                    average monthly cost of property taxes, home insurance,
                    maintenance, repairs, dues, fees and utilities including
                    electricity, gas, other fuels, trash collection, water,
                    cable television and internet, telephone, and cell phone)
                    __________ monthly rent payment
                  </Label>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(40) $</span>
                  <FormInput
                    label=""
                    id="housingUtilities"
                    type="number"
                    placeholder="0"
                    required
                    {...register("housingUtilities")}
                    error={errors.housingUtilities?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>Vehicle loan and/or lease payment(s)</Label>
                <div className="flex items-center">
                  <span className="mr-2">(41) $</span>
                  <FormInput
                    label=""
                    id="vehicleLoanLease"
                    type="number"
                    placeholder="0"
                    {...register("vehicleLoanLease")}
                    error={errors.vehicleLoanLease?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Vehicle operating costs (e.g., average monthly cost of
                    maintenance, repairs, insurance, fuel, registrations,
                    licenses, inspections, parking, tolls, etc.) A reasonable
                    estimate of these expenses may be used
                  </Label>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(42) $</span>
                  <FormInput
                    label=""
                    id="vehicleOperatingCosts"
                    type="number"
                    placeholder="0"
                    {...register("vehicleOperatingCosts")}
                    error={errors.vehicleOperatingCosts?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Public transportation costs (e.g., average monthly cost of
                    fares for mass transit such as bus, train, ferry, etc.) A
                    reasonable estimate of these expenses may be used
                  </Label>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(43) $</span>
                  <FormInput
                    label=""
                    id="publicTransportation"
                    type="number"
                    placeholder="0"
                    {...register("publicTransportation")}
                    error={errors.publicTransportation?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>Health insurance premiums</Label>
                <div className="flex items-center">
                  <span className="mr-2">(44) $</span>
                  <FormInput
                    label=""
                    id="healthInsurancePremiums"
                    type="number"
                    placeholder="0"
                    {...register("healthInsurancePremiums")}
                    error={errors.healthInsurancePremiums?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Out-of-pocket health care costs (e.g. average monthly cost
                    of prescription drugs, medical services, and medical
                    supplies like eyeglasses, hearing aids, etc.)
                  </Label>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(45) $</span>
                  <FormInput
                    label=""
                    id="outOfPocketHealthcare"
                    type="number"
                    placeholder="0"
                    {...register("outOfPocketHealthcare")}
                    error={errors.outOfPocketHealthcare?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>
                  Court-ordered payments (e.g., monthly cost of any alimony,
                  child support, etc.)
                </Label>
                <div className="flex items-center">
                  <span className="mr-2">(46) $</span>
                  <FormInput
                    label=""
                    id="courtOrderedPayments"
                    type="number"
                    placeholder="0"
                    {...register("courtOrderedPayments")}
                    error={errors.courtOrderedPayments?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>
                  Child/dependent care payments (e.g., daycare, etc.)
                </Label>
                <div className="flex items-center">
                  <span className="mr-2">(47) $</span>
                  <FormInput
                    label=""
                    id="childDependentCare"
                    type="number"
                    placeholder="0"
                    {...register("childDependentCare")}
                    error={errors.childDependentCare?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Life insurance premiums __________ Life insurance policy
                    amount
                  </Label>
                  <div className="mt-2">
                    <FormInput
                      label=""
                      id="lifeInsurancePolicyAmount"
                      type="number"
                      placeholder="Policy amount"
                      {...register("lifeInsurancePolicyAmount")}
                      error={errors.lifeInsurancePolicyAmount?.message}
                      className="w-48"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(48) $</span>
                  <FormInput
                    label=""
                    id="lifeInsurancePremiums"
                    type="number"
                    placeholder="0"
                    {...register("lifeInsurancePremiums")}
                    error={errors.lifeInsurancePremiums?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>
                  Current monthly taxes (e.g., monthly cost of federal, state,
                  and local tax, personal property tax, etc.)
                </Label>
                <div className="flex items-center">
                  <span className="mr-2">(49) $</span>
                  <FormInput
                    label=""
                    id="currentMonthlyTaxes"
                    type="number"
                    placeholder="0"
                    required
                    {...register("currentMonthlyTaxes")}
                    error={errors.currentMonthlyTaxes?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label>
                    Secured debts/Other (e.g., any loan where you pledged an
                    asset as collateral not previously listed, government
                    guaranteed student loan, employer required retirement or
                    dues) __________ List debt(s)/expense(s)
                  </Label>
                  <div className="mt-2 me-2">
                    <Textarea
                      id="listDebtsExpenses"
                      placeholder="List debts/expenses"
                      {...register("listDebtsExpenses")}
                      className="focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">(50) $</span>
                  <FormInput
                    label=""
                    id="securedDebtsOther"
                    type="number"
                    placeholder="0"
                    {...register("securedDebtsOther")}
                    error={errors.securedDebtsOther?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <Label>
                  Enter the amount of your monthly delinquent state and/or local
                  tax payment(s). Total tax owed __________
                </Label>
                <div className="flex items-center">
                  <span className="mr-2">(51) $</span>
                  <FormInput
                    label=""
                    id="monthlyDelinquentTaxPayments"
                    type="number"
                    placeholder="0"
                    {...register("monthlyDelinquentTaxPayments")}
                    error={errors.monthlyDelinquentTaxPayments?.message}
                    className="w-32 text-center"
                  />
                </div>
              </div>
              <div className="mt-2">
                <FormInput
                  label="Total tax owed"
                  id="totalTaxOwed"
                  type="number"
                  placeholder="0"
                  {...register("totalTaxOwed")}
                  error={errors.totalTaxOwed?.message}
                  className="w-48"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Round to the nearest whole dollar
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Do not enter a negative number. If any line item is a negative,
                enter "0" on that line.
              </p>
              <p className="font-bold text-lg">
                Add lines (39) through (51) and enter the amount in Box E = $
                {totalHouseholdExpenses.toLocaleString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Box E - Total Household Expenses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Monthly Income */}
      <Card>
        <CardHeader>
          <CardTitle>Remaining Monthly Income Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Round to the nearest whole dollar
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Do not enter a negative number. If any line item is a negative,
                enter "0" on that line.
              </p>
              <p className="font-bold text-lg">
                Subtract Box E from Box D and enter the amount in Box F = $
                {remainingMonthlyIncome.toLocaleString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Box F - Remaining Monthly Income
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
