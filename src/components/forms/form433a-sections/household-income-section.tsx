"use client";

import { FormNavigation } from "./form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  householdIncomeInitialValues,
  householdIncomeSchema,
} from "@/lib/validation/form433a/household-income-section";
import useHouseholdIncome from "@/hooks/433a-form-hooks/useHouseHoldIncome";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import Link from "next/link";
import usePersonalInfo from "@/hooks/433a-form-hooks/usePersonalInfo";
import useBusinessIncome from "@/hooks/433a-form-hooks/useBusinessIncome";

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
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { householdIncomeInfo, personalInfo, businessIncomeInfo } =
    useAppSelector((state) => state.form433a);

  const boxC = businessIncomeInfo?.boxC || 0;

  const {
    loadingFormData: loadingPersonalInfoFormData,
    handleGetPersonalInfo,
  } = usePersonalInfo();

  const {
    loading,
    loadingFormData,
    handleSaveHouseholdIncomeInfo,
    handleGetHouseholdIncomeInfo,
  } = useHouseholdIncome();

  const {
    loadingFormData: loadingBusinessIncomeFormData,
    handleGetBusinessIncomeInfo,
  } = useBusinessIncome();

  const methods = useForm<HouseholdIncomeFormSchema>({
    resolver: zodResolver(householdIncomeSchema),
    defaultValues: householdIncomeInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: HouseholdIncomeFormSchema) => {
    try {
      await handleSaveHouseholdIncomeInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving household income info:", error);
      toast.error(error.message || "Failed to save household income info");
    }
  };

  useEffect(() => {
    if (!personalInfo) handleGetPersonalInfo(caseId, FORM_433A_SECTIONS[0]);

    if (!householdIncomeInfo)
      handleGetHouseholdIncomeInfo(caseId, FORM_433A_SECTIONS[6]);

    if (!businessIncomeInfo)
      handleGetBusinessIncomeInfo(caseId, FORM_433A_SECTIONS[5]);
  }, [caseId]);

  useEffect(() => {
    if (householdIncomeInfo) {
      reset({ ...householdIncomeInitialValues, ...householdIncomeInfo });
    }
  }, [householdIncomeInfo, reset]);

  // Compute totals with useWatch
  const primaryTaxpayer =
    useWatch({ control, name: "income.primaryTaxpayer" }) || {};
  const spouse = useWatch({ control, name: "income.spouse" }) || {};
  const income = useWatch({ control, name: "income" }) || {};
  const expenses = useWatch({ control, name: "expenses" }) || {};

  const totalPrimaryIncome = useMemo(
    () =>
      Number(primaryTaxpayer.grossWages || 0) +
      Number(primaryTaxpayer.socialSecurity || 0) +
      Number(primaryTaxpayer.pension || 0) +
      Number(primaryTaxpayer.otherIncome || 0),
    [primaryTaxpayer]
  );

  const totalSpouseIncome = useMemo(
    () =>
      Number(spouse.grossWages || 0) +
      Number(spouse.socialSecurity || 0) +
      Number(spouse.pension || 0) +
      Number(spouse.otherIncome || 0),
    [spouse]
  );

  const totalHouseholdIncome = useMemo(
    () =>
      totalPrimaryIncome +
      totalSpouseIncome +
      Number(income.interestDividendsRoyalties || 0) +
      Number(income.distributions || 0) +
      Number(income.netRentalIncome || 0) +
      Number(income.childSupportReceived || 0) +
      Number(income.alimonyReceived || 0) +
      Number(income.additionalSourcesIncome || 0) +
      boxC,
    [totalPrimaryIncome, totalSpouseIncome, income, boxC]
  );

  const totalHouseholdExpenses = useMemo(
    () =>
      Number(expenses.foodClothingMiscellaneous || 0) +
      Number(expenses.housingUtilities || 0) +
      Number(expenses.vehicleLoanLeasePayments || 0) +
      Number(expenses.vehicleOperatingCosts || 0) +
      Number(expenses.publicTransportationCosts || 0) +
      Number(expenses.healthInsurancePremiums || 0) +
      Number(expenses.outOfPocketHealthCare || 0) +
      Number(expenses.courtOrderedPayments || 0) +
      Number(expenses.childDependentCare || 0) +
      Number(expenses.lifeInsurancePremiums || 0) +
      Number(expenses.currentMonthlyTaxes || 0) +
      Number(expenses.securedDebts || 0) +
      Number(expenses.monthlyTaxPayments || 0),
    [expenses]
  );

  const remainingMonthlyIncome = useMemo(
    () => Math.max(0, totalHouseholdIncome - totalHouseholdExpenses),
    [totalHouseholdIncome, totalHouseholdExpenses]
  );

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

  if (
    loadingFormData ||
    loadingPersonalInfoFormData ||
    loadingBusinessIncomeFormData
  ) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 7: Monthly Household Income and Expense Information
          </h2>
          <p className="text-gray-600 mb-4">
            Enter your household's average gross monthly income. Gross monthly
            income includes wages, social security, pension, unemployment, and
            other income. Examples of other income include but are not limited
            to: agricultural subsidies, gambling income, oil credits, rent
            subsidies, sharing economy income from providing on-demand work,
            services or goods (e.g., Uber, Lyft, DoorDash, AirBnb, VRBO), income
            through digital platforms like an app or website, etc., and
            recurring capital gains from the sale of securities or other
            property such as digital assets. Include the below information for
            yourself, your spouse, and anyone else who contributes to your
            household's income. This is necessary for the IRS to accurately
            evaluate your offer.
          </p>
          <p className="text-gray-800 font-semibold">
            Round to the nearest whole dollar. Do not enter a negative number.
            If any line item is a negative number, enter "0".
          </p>
          <p className="text-sm text-red-600 font-medium">
            * All fields are required (if not applicable, enter 0)
          </p>
        </div>

        {/* Monthly Household Income */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Household Income</CardTitle>
            <p className="text-sm text-gray-600">
              Note: Entire household income should also include income that is
              considered not taxable and may not be included on your tax return.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary taxpayer */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">
                Primary taxpayer
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <FormInput
                  label="Gross wages ($)"
                  id="income.primaryTaxpayer.grossWages"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.primaryTaxpayer.grossWages", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.primaryTaxpayer?.grossWages?.message}
                />
                <FormInput
                  label="Social Security ($)"
                  id="income.primaryTaxpayer.socialSecurity"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.primaryTaxpayer.socialSecurity", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={
                    errors.income?.primaryTaxpayer?.socialSecurity?.message
                  }
                />
                <FormInput
                  label="Pension(s) ($)"
                  id="income.primaryTaxpayer.pension"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.primaryTaxpayer.pension", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.primaryTaxpayer?.pension?.message}
                />
                <FormInput
                  label="Other income (e.g. unemployment) ($)"
                  id="income.primaryTaxpayer.otherIncome"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.primaryTaxpayer.otherIncome", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.primaryTaxpayer?.otherIncome?.message}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-gray-600">
                    Total primary taxpayer income ={" "}
                  </span>
                  <span className="font-bold">
                    (30) ${totalPrimaryIncome.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Spouse */}
            {personalInfo?.maritalStatus === "married" && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Spouse</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormInput
                    label="Gross wages ($)"
                    id="income.spouse.grossWages"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("income.spouse.grossWages", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.income?.spouse?.grossWages?.message}
                  />
                  <FormInput
                    label="Social Security ($)"
                    id="income.spouse.socialSecurity"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("income.spouse.socialSecurity", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.income?.spouse?.socialSecurity?.message}
                  />
                  <FormInput
                    label="Pension(s) ($)"
                    id="income.spouse.pension"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("income.spouse.pension", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.income?.spouse?.pension?.message}
                  />
                  <FormInput
                    label="Other Income (e.g. unemployment) ($)"
                    id="income.spouse.otherIncome"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("income.spouse.otherIncome", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.income?.spouse?.otherIncome?.message}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      Total spouse income ={" "}
                    </span>
                    <span className="font-bold">
                      (31) ${totalSpouseIncome.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional income sources */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <FormInput
                  label="Additional sources of income used to support the household (e.g., non-liable spouse, or anyone else who may contribute to the household income, etc.) List source(s)"
                  id="income.additionalSourcesIncomeList"
                  type="text"
                  placeholder="Additional sources list"
                  className="w-72 max-w-full"
                  {...register("income.additionalSourcesIncomeList")}
                  error={errors.income?.additionalSourcesIncomeList?.message}
                />
                <FormInput
                  label=""
                  id="income.additionalSourcesIncome"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.additionalSourcesIncome", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.additionalSourcesIncome?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>Interest, dividends, and royalties ($)</Label>
                <FormInput
                  label=""
                  id="income.interestDividendsRoyalties"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.interestDividendsRoyalties", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.interestDividendsRoyalties?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>
                  Distributions (e.g., income from partnerships, sub-S
                  Corporations, etc.) ($)
                </Label>
                <FormInput
                  label=""
                  id="income.distributions"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.distributions", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.distributions?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>Net rental income ($)</Label>
                <FormInput
                  label=""
                  id="income.netRentalIncome"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.netRentalIncome", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.netRentalIncome?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>
                  Net business income from Box C (Deductions for non-cash
                  expenses on Schedule C (e.g., depreciation, depletion, etc.)
                  are not permitted as an expense for offer purposes and must be
                  added back in to the net income figure) ($)
                </Label>
                <FormInput
                  label=""
                  id="income.netBusinessIncomeFromBoxC"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  disabled
                  required
                  value={boxC}
                  {...register("income.netBusinessIncomeFromBoxC", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                  })}
                  error={errors.income?.netBusinessIncomeFromBoxC?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>Child support received ($)</Label>
                <FormInput
                  label=""
                  id="income.childSupportReceived"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.childSupportReceived", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.childSupportReceived?.message}
                  className="w-32"
                />
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <Label>Alimony received ($)</Label>
                <FormInput
                  label=""
                  id="income.alimonyReceived"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                  placeholder=""
                  required
                  {...register("income.alimonyReceived", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={errors.income?.alimonyReceived?.message}
                  className="w-32"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Round to the nearest whole dollar
                  </p>
                  <p className="font-bold text-lg">
                    Add lines (30) through (38) and enter the amount in Box D =
                    ${totalHouseholdIncome.toFixed(0)}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Box D - Total Household Income
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Household Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Household Expenses</CardTitle>
            <p className="text-sm text-gray-600">
              Enter your average monthly expenses. For expenses claimed in boxes
              (39) and (45) only, you should list the full amount of the
              allowable standard even if the actual amount you pay is less. For
              the other boxes input your actual expenses. You may find the
              allowable standards at{" "}
              <Link
                href="https://IRS.gov/Businesses/Small-Businesses-Self-Employed/Collection-Financial-Standards"
                target="_blank"
                className="text-blue-600"
              >
                IRS.gov
              </Link>
              .
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>
                      Food, clothing, and miscellaneous (e.g., housekeeping
                      supplies, personal care products, minimum payment on
                      credit card) ($)
                    </Label>
                    <p className="text-xs text-gray-500">
                      A reasonable estimate of these expenses may be used
                    </p>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.foodClothingMiscellaneous"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.foodClothingMiscellaneous", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.foodClothingMiscellaneous?.message}
                    className="w-32"
                  />
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
                      ($)
                    </Label>
                    <div className="mt-2">
                      <FormInput
                        label="Monthly rent payment"
                        id="expenses.monthlyRentalPayment"
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*\.?[0-9]*$"
                        placeholder=""
                        required
                        {...register("expenses.monthlyRentalPayment", {
                          setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                          onChange: (e: any) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                        })}
                        error={errors.expenses?.monthlyRentalPayment?.message}
                        className="w-48"
                      />
                    </div>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.housingUtilities"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.housingUtilities", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.housingUtilities?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>Vehicle loan and/or lease payment(s) ($)</Label>
                  <FormInput
                    label=""
                    id="expenses.vehicleLoanLeasePayments"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.vehicleLoanLeasePayments", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.vehicleLoanLeasePayments?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>
                      Vehicle operating costs (e.g., average monthly cost of
                      maintenance, repairs, insurance, fuel, registrations,
                      licenses, inspections, parking, tolls, etc.) ($)
                    </Label>
                    <p className="text-xs text-gray-500">
                      A reasonable estimate of these expenses may be used
                    </p>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.vehicleOperatingCosts"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.vehicleOperatingCosts", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.vehicleOperatingCosts?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>
                      Public transportation costs (e.g., average monthly cost of
                      fares for mass transit such as bus, train, ferry, etc.)
                      ($)
                    </Label>
                    <p className="text-xs text-gray-500">
                      A reasonable estimate of these expenses may be used
                    </p>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.publicTransportationCosts"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.publicTransportationCosts", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.publicTransportationCosts?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>Health insurance premiums ($)</Label>
                  <FormInput
                    label=""
                    id="expenses.healthInsurancePremiums"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.healthInsurancePremiums", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.healthInsurancePremiums?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>
                      Out-of-pocket health care costs (e.g. average monthly cost
                      of prescription drugs, medical services, and medical
                      supplies like eyeglasses, hearing aids, etc.) ($)
                    </Label>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.outOfPocketHealthCare"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.outOfPocketHealthCare", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.outOfPocketHealthCare?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>
                    Court-ordered payments (e.g., monthly cost of alimony, child
                    support, etc.) ($)
                  </Label>
                  <FormInput
                    label=""
                    id="expenses.courtOrderedPayments"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.courtOrderedPayments", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.courtOrderedPayments?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>
                    Child/dependent care payments (e.g., daycare, etc.) ($)
                  </Label>
                  <FormInput
                    label=""
                    id="expenses.childDependentCare"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.childDependentCare", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expnenses?.childDependentCare?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Life insurance premiums ($)</Label>
                    <div className="mt-2">
                      <FormInput
                        label="Life insurance policy amount"
                        id="expenses.lifeInsuranceAmount"
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*\.?[0-9]*$"
                        placeholder=""
                        required
                        {...register("expenses.lifeInsuranceAmount", {
                          setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                          onChange: (e: any) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                        })}
                        error={errors.expenses?.lifeInsuranceAmount?.message}
                        className="w-48"
                      />
                    </div>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.lifeInsurancePremiums"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.lifeInsurancePremiums", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.lifeInsurancePremiums?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>
                    Current monthly taxes (e.g., monthly cost of federal, state,
                    and local tax, personal property tax, etc.) ($)
                  </Label>
                  <FormInput
                    label=""
                    id="expenses.currentMonthlyTaxes"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.currentMonthlyTaxes", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.currentMonthlyTaxes?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>
                      Secured debts/Other (e.g., any loan where you pledged an
                      asset as collateral not previously listed, government
                      guaranteed student loan, employer required retirement or
                      dues) ($)
                    </Label>
                    <div className="mt-2">
                      <Textarea
                        id="expenses.securedDebtsList"
                        placeholder="List debts/expenses"
                        {...register("expenses.securedDebtsList")}
                        className="focus:ring-[#22b573] focus:border-[#22b573]"
                      />
                    </div>
                  </div>
                  <FormInput
                    label=""
                    id="expenses.securedDebts"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.securedDebts", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.securedDebts?.message}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <Label>
                    Enter the amount of your monthly delinquent state and/or
                    local tax payment(s) ($)
                  </Label>
                  <FormInput
                    label=""
                    id="expenses.monthlyTaxPayments"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.monthlyTaxPayments", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.monthlyTaxPayments?.message}
                    className="w-32"
                  />
                </div>
                <div className="mt-2">
                  <FormInput
                    label="Total tax owed ($)"
                    id="expenses.totalTaxOwed"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\.?[0-9]*$"
                    placeholder=""
                    required
                    {...register("expenses.totalTaxOwed", {
                      setValueAs: (v: any) => String(v).replace(/[^0-9.]/g, ""),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    })}
                    error={errors.expenses?.totalTaxOwed?.message}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Round to the nearest whole dollar
                  </p>
                  <p className="font-bold text-lg">
                    Add lines (39) through (51) and enter the amount in Box E =
                    ${totalHouseholdExpenses.toFixed(0)}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Box E - Total Household Expenses
                  </p>
                </div>
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Round to the nearest whole dollar
                </p>
                <p className="font-bold text-lg">
                  Subtract Box E from Box D and enter the amount in Box F = $
                  {remainingMonthlyIncome.toFixed(0)}
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
          onNext={handleSubmit(onSubmit)}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}

// "use client";

// import { FormNavigation } from "./form-navigation";
// import { FormInput, FormField } from "@/components/ui/form-field";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { useEffect, useMemo } from "react";
// import { useForm, FormProvider, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   householdIncomeInitialValues,
//   householdIncomeSchema,
// } from "@/lib/validation/form433a/household-income-section";
// import useHouseholdIncome from "@/hooks/433a-form-hooks/useHouseHoldIncome";
// import { useSearchParams } from "next/navigation";
// import { useAppSelector } from "@/lib/hooks";
// import toast from "react-hot-toast";
// import FormLoader from "@/components/global/FormLoader";
// import { FORM_433A_SECTIONS } from "@/lib/constants";
// import Link from "next/link";
// import usePersonalInfo from "@/hooks/433a-form-hooks/usePersonalInfo";
// import useBusinessIncome from "@/hooks/433a-form-hooks/useBusinessIncome";
// import { storage } from "@/utils/helper";
// import useCalculation from "@/hooks/433a-form-hooks/useCalculation";

// interface HouseholdIncomeSectionProps {
//   onNext: () => void;
//   onPrevious: () => void;
//   currentStep: number;
//   totalSteps: number;
// }

// export function HouseholdIncomeSection({
//   onNext,
//   onPrevious,
//   currentStep,
//   totalSteps,
// }: HouseholdIncomeSectionProps) {
//   const searchParams = useSearchParams();
//   const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
//   const {
//     householdIncomeInfo,
//     personalInfo,
//     businessIncomeInfo,
//     calculationInfo,
//   } = useAppSelector((state) => state.form433a);

//   const boxC = businessIncomeInfo?.boxC || 0;
//   console.log("box c value in household income section: ", boxC);

//   const {
//     loadingFormData: loadingPersonalInfoFormData,
//     handleGetPersonalInfo,
//   } = usePersonalInfo();

//   const {
//     loading,
//     loadingFormData,
//     handleSaveHouseholdIncomeInfo,
//     handleGetHouseholdIncomeInfo,
//   } = useHouseholdIncome();

//   const {
//     loadingFormData: loadingBusinessIncomeFormData,
//     handleGetBusinessIncomeInfo,
//   } = useBusinessIncome();

//   // const { handleSaveCalculationInfo, handleGetCalculationInfo } =
//   //   useCalculation();

//   const methods = useForm<HouseholdIncomeFormSchema>({
//     resolver: zodResolver(householdIncomeSchema),
//     defaultValues: householdIncomeInitialValues,
//     mode: "onSubmit",
//   });

//   const {
//     register,
//     control,
//     reset,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = methods;

//   const onSubmit = async (data: HouseholdIncomeFormSchema) => {
//     try {
//       await handleSaveHouseholdIncomeInfo(data, caseId);
//       // await handleSaveHouseholdIncomeInfo(
//       //   data,
//       //   caseId,
//       //   totalHouseholdIncome,
//       //   totalHouseholdExpenses,
//       //   remainingMonthlyIncome
//       // );

//       // const form433aProgress: any = storage.get("433a_progress");
//       // if (form433aProgress) {
//       //   if (
//       //     form433aProgress?.completedSteps?.includes(8) &&
//       //     calculationInfo &&
//       //     calculationInfo.paymentTimeline
//       //   ) {
//       //     handleSaveCalculationInfo(
//       //       { paymentTimeline: calculationInfo.paymentTimeline },
//       //       caseId
//       //     );
//       //   }
//       // }

//       onNext();
//     } catch (error: any) {
//       console.error("Error saving household income info:", error);
//       toast.error(error.message || "Failed to save household income info");
//     }
//   };

//   useEffect(() => {
//     if (!personalInfo) handleGetPersonalInfo(caseId, FORM_433A_SECTIONS[0]);

//     if (!householdIncomeInfo)
//       handleGetHouseholdIncomeInfo(caseId, FORM_433A_SECTIONS[6]);

//     if (!businessIncomeInfo)
//       handleGetBusinessIncomeInfo(caseId, FORM_433A_SECTIONS[5]);

//     // const form433aProgress: any = storage.get("433a_progress");
//     // if (!calculationInfo && form433aProgress?.completedSteps?.includes(8))
//     //   handleGetCalculationInfo(caseId, FORM_433A_SECTIONS[7]);
//   }, [caseId]);

//   useEffect(() => {
//     if (householdIncomeInfo) {
//       reset({ ...householdIncomeInitialValues, ...householdIncomeInfo });
//     }
//   }, [householdIncomeInfo, reset]);

//   // Compute totals with useWatch
//   const primaryTaxpayer =
//     useWatch({ control, name: "income.primaryTaxpayer" }) || {};
//   const spouse = useWatch({ control, name: "income.spouse" }) || {};
//   const income = useWatch({ control, name: "income" }) || {};
//   const expenses = useWatch({ control, name: "expenses" }) || {};

//   const totalPrimaryIncome = useMemo(
//     () =>
//       Number(primaryTaxpayer.grossWages || 0) +
//       Number(primaryTaxpayer.socialSecurity || 0) +
//       Number(primaryTaxpayer.pension || 0) +
//       Number(primaryTaxpayer.otherIncome || 0),
//     [primaryTaxpayer]
//   );

//   const totalSpouseIncome = useMemo(
//     () =>
//       Number(spouse.grossWages || 0) +
//       Number(spouse.socialSecurity || 0) +
//       Number(spouse.pension || 0) +
//       Number(spouse.otherIncome || 0),
//     [spouse]
//   );

//   const totalHouseholdIncome = useMemo(
//     () =>
//       totalPrimaryIncome +
//       totalSpouseIncome +
//       Number(income.interestDividendsRoyalties || 0) +
//       Number(income.distributions || 0) +
//       Number(income.netRentalIncome || 0) +
//       Number(income.childSupportReceived || 0) +
//       Number(income.alimonyReceived || 0) +
//       Number(income.additionalSourcesIncome || 0) +
//       boxC,
//     [totalPrimaryIncome, totalSpouseIncome, income, boxC]
//   );

//   const totalHouseholdExpenses = useMemo(
//     () =>
//       Number(expenses.foodClothingMiscellaneous || 0) +
//       Number(expenses.housingUtilities || 0) +
//       Number(expenses.vehicleLoanLeasePayments || 0) +
//       Number(expenses.vehicleOperatingCosts || 0) +
//       Number(expenses.publicTransportationCosts || 0) +
//       Number(expenses.healthInsurancePremiums || 0) +
//       Number(expenses.outOfPocketHealthCare || 0) +
//       Number(expenses.courtOrderedPayments || 0) +
//       Number(expenses.childDependentCare || 0) +
//       Number(expenses.lifeInsurancePremiums || 0) +
//       Number(expenses.currentMonthlyTaxes || 0) +
//       Number(expenses.securedDebts || 0) +
//       Number(expenses.monthlyTaxPayments || 0),
//     [expenses]
//   );

//   const remainingMonthlyIncome = useMemo(
//     () => Math.max(0, totalHouseholdIncome - totalHouseholdExpenses),
//     [totalHouseholdIncome, totalHouseholdExpenses]
//   );

//   if (
//     loadingFormData ||
//     loadingPersonalInfoFormData ||
//     loadingBusinessIncomeFormData
//   ) {
//     return <FormLoader />;
//   }

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Section 7: Monthly Household Income and Expense Information
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Enter your household's average gross monthly income. Gross monthly
//             income includes wages, social security, pension, unemployment, and
//             other income. Examples of other income include but are not limited
//             to: agricultural subsidies, gambling income, oil credits, rent
//             subsidies, sharing economy income from providing on-demand work,
//             services or goods (e.g., Uber, Lyft, DoorDash, AirBnb, VRBO), income
//             through digital platforms like an app or website, etc., and
//             recurring capital gains from the sale of securities or other
//             property such as digital assets. Include the below information for
//             yourself, your spouse, and anyone else who contributes to your
//             household's income. This is necessary for the IRS to accurately
//             evaluate your offer.
//           </p>
//           <p className="text-gray-800 font-semibold">
//             Round to the nearest whole dollar. Do not enter a negative number.
//             If any line item is a negative number, enter "0".
//           </p>
//           <p className="text-sm text-red-600 font-medium">
//             * All fields are required (if not applicable, enter 0)
//           </p>
//         </div>

//         {/* Monthly Household Income */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Monthly Household Income</CardTitle>
//             <p className="text-sm text-gray-600">
//               Note: Entire household income should also include income that is
//               considered not taxable and may not be included on your tax return.
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Primary taxpayer */}
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h4 className="font-medium text-gray-900 mb-4">
//                 Primary taxpayer
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                 <FormInput
//                   label="Gross wages ($)"
//                   id="income.primaryTaxpayer.grossWages"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.primaryTaxpayer.grossWages", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.primaryTaxpayer?.grossWages?.message}
//                 />
//                 <FormInput
//                   label="Social Security ($)"
//                   id="income.primaryTaxpayer.socialSecurity"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.primaryTaxpayer.socialSecurity", {
//                     valueAsNumber: true,
//                   })}
//                   error={
//                     errors.income?.primaryTaxpayer?.socialSecurity?.message
//                   }
//                 />
//                 <FormInput
//                   label="Pension(s) ($)"
//                   id="income.primaryTaxpayer.pension"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.primaryTaxpayer.pension", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.primaryTaxpayer?.pension?.message}
//                 />
//                 <FormInput
//                   label="Other income (e.g. unemployment) ($)"
//                   id="income.primaryTaxpayer.otherIncome"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.primaryTaxpayer.otherIncome", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.primaryTaxpayer?.otherIncome?.message}
//                 />
//               </div>
//               <div className="mt-4 flex justify-end">
//                 <div className="text-right">
//                   <span className="text-sm text-gray-600">
//                     Total primary taxpayer income ={" "}
//                   </span>
//                   <span className="font-bold">
//                     (30) ${totalPrimaryIncome.toFixed(0)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Spouse */}
//             {personalInfo?.maritalStatus === "married" && (
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h4 className="font-medium text-gray-900 mb-4">Spouse</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                   <FormInput
//                     label="Gross wages ($)"
//                     id="income.spouse.grossWages"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("income.spouse.grossWages", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.income?.spouse?.grossWages?.message}
//                   />
//                   <FormInput
//                     label="Social Security ($)"
//                     id="income.spouse.socialSecurity"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("income.spouse.socialSecurity", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.income?.spouse?.socialSecurity?.message}
//                   />
//                   <FormInput
//                     label="Pension(s) ($)"
//                     id="income.spouse.pension"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("income.spouse.pension", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.income?.spouse?.pension?.message}
//                   />
//                   <FormInput
//                     label="Other Income (e.g. unemployment) ($)"
//                     id="income.spouse.otherIncome"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("income.spouse.otherIncome", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.income?.spouse?.otherIncome?.message}
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                   <div className="text-right">
//                     <span className="text-sm text-gray-600">
//                       Total spouse income ={" "}
//                     </span>
//                     <span className="font-bold">
//                       (31) ${totalSpouseIncome.toFixed(0)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Additional income sources */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center border-b pb-2">
//                 <FormInput
//                   label="Additional sources of income used to support the household (e.g., non-liable spouse, or anyone else who may contribute to the household income, etc.) List source(s)"
//                   id="income.additionalSourcesIncomeList"
//                   type="text"
//                   placeholder="Additional sources list"
//                   className="w-72 max-w-full"
//                   {...register("income.additionalSourcesIncomeList")}
//                   error={errors.income?.additionalSourcesIncomeList?.message}
//                 />
//                 <FormInput
//                   label=""
//                   id="income.additionalSourcesIncome"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.additionalSourcesIncome", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.additionalSourcesIncome?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>Interest, dividends, and royalties ($)</Label>
//                 <FormInput
//                   label=""
//                   id="income.interestDividendsRoyalties"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.interestDividendsRoyalties", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.interestDividendsRoyalties?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>
//                   Distributions (e.g., income from partnerships, sub-S
//                   Corporations, etc.) ($)
//                 </Label>
//                 <FormInput
//                   label=""
//                   id="income.distributions"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.distributions", { valueAsNumber: true })}
//                   error={errors.income?.distributions?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>Net rental income ($)</Label>
//                 <FormInput
//                   label=""
//                   id="income.netRentalIncome"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.netRentalIncome", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.netRentalIncome?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>
//                   Net business income from Box C (Deductions for non-cash
//                   expenses on Schedule C (e.g., depreciation, depletion, etc.)
//                   are not permitted as an expense for offer purposes and must be
//                   added back in to the net income figure) ($)
//                 </Label>
//                 <FormInput
//                   label=""
//                   id="income.netBusinessIncomeFromBoxC"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   disabled
//                   required
//                   value={boxC}
//                   {...register("income.netBusinessIncomeFromBoxC", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.netBusinessIncomeFromBoxC?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>Child support received ($)</Label>
//                 <FormInput
//                   label=""
//                   id="income.childSupportReceived"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.childSupportReceived", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.childSupportReceived?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="flex justify-between items-center border-b pb-2">
//                 <Label>Alimony received ($)</Label>
//                 <FormInput
//                   label=""
//                   id="income.alimonyReceived"
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   required
//                   {...register("income.alimonyReceived", {
//                     valueAsNumber: true,
//                   })}
//                   error={errors.income?.alimonyReceived?.message}
//                   className="w-32"
//                 />
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Round to the nearest whole dollar
//                   </p>
//                   <p className="font-bold text-lg">
//                     Add lines (30) through (38) and enter the amount in Box D =
//                     ${totalHouseholdIncome.toFixed(0)}
//                   </p>
//                   <p className="text-sm font-medium mt-1">
//                     Box D - Total Household Income
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Monthly Household Expenses */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Monthly Household Expenses</CardTitle>
//             <p className="text-sm text-gray-600">
//               Enter your average monthly expenses. For expenses claimed in boxes
//               (39) and (45) only, you should list the full amount of the
//               allowable standard even if the actual amount you pay is less. For
//               the other boxes input your actual expenses. You may find the
//               allowable standards at{" "}
//               <Link
//                 href="https://IRS.gov/Businesses/Small-Businesses-Self-Employed/Collection-Financial-Standards"
//                 target="_blank"
//                 className="text-blue-600"
//               >
//                 IRS.gov
//               </Link>
//               .
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-3">
//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Food, clothing, and miscellaneous (e.g., housekeeping
//                       supplies, personal care products, minimum payment on
//                       credit card) ($)
//                     </Label>
//                     <p className="text-xs text-gray-500">
//                       A reasonable estimate of these expenses may be used
//                     </p>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.foodClothingMiscellaneous"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.foodClothingMiscellaneous", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.foodClothingMiscellaneous?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Housing and utilities (e.g., rent or mortgage payment and
//                       average monthly cost of property taxes, home insurance,
//                       maintenance, repairs, dues, fees and utilities including
//                       electricity, gas, other fuels, trash collection, water,
//                       cable television and internet, telephone, and cell phone)
//                       ($)
//                     </Label>
//                     <div className="mt-2">
//                       <FormInput
//                         label="Monthly rent payment"
//                         id="expenses.monthlyRentalPayment"
//                         type="number"
//                         min="0"
//                         placeholder="0"
//                         required
//                         {...register("expenses.monthlyRentalPayment", {
//                           valueAsNumber: true,
//                         })}
//                         error={errors.expenses?.monthlyRentalPayment?.message}
//                         className="w-48"
//                       />
//                     </div>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.housingUtilities"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.housingUtilities", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.housingUtilities?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>Vehicle loan and/or lease payment(s) ($)</Label>
//                   <FormInput
//                     label=""
//                     id="expenses.vehicleLoanLeasePayments"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.vehicleLoanLeasePayments", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.vehicleLoanLeasePayments?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Vehicle operating costs (e.g., average monthly cost of
//                       maintenance, repairs, insurance, fuel, registrations,
//                       licenses, inspections, parking, tolls, etc.) ($)
//                     </Label>
//                     <p className="text-xs text-gray-500">
//                       A reasonable estimate of these expenses may be used
//                     </p>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.vehicleOperatingCosts"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.vehicleOperatingCosts", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.vehicleOperatingCosts?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Public transportation costs (e.g., average monthly cost of
//                       fares for mass transit such as bus, train, ferry, etc.)
//                       ($)
//                     </Label>
//                     <p className="text-xs text-gray-500">
//                       A reasonable estimate of these expenses may be used
//                     </p>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.publicTransportationCosts"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.publicTransportationCosts", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.publicTransportationCosts?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>Health insurance premiums ($)</Label>
//                   <FormInput
//                     label=""
//                     id="expenses.healthInsurancePremiums"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.healthInsurancePremiums", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.healthInsurancePremiums?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Out-of-pocket health care costs (e.g. average monthly cost
//                       of prescription drugs, medical services, and medical
//                       supplies like eyeglasses, hearing aids, etc.) ($)
//                     </Label>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.outOfPocketHealthCare"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.outOfPocketHealthCare", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.outOfPocketHealthCare?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>
//                     Court-ordered payments (e.g., monthly cost of alimony, child
//                     support, etc.) ($)
//                   </Label>
//                   <FormInput
//                     label=""
//                     id="expenses.courtOrderedPayments"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.courtOrderedPayments", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.courtOrderedPayments?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>
//                     Child/dependent care payments (e.g., daycare, etc.) ($)
//                   </Label>
//                   <FormInput
//                     label=""
//                     id="expenses.childDependentCare"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.childDependentCare", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expnenses?.childDependentCare?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>Life insurance premiums ($)</Label>
//                     <div className="mt-2">
//                       <FormInput
//                         label="Life insurance policy amount"
//                         id="expenses.lifeInsuranceAmount"
//                         type="number"
//                         min="0"
//                         placeholder="0"
//                         required
//                         {...register("expenses.lifeInsuranceAmount", {
//                           valueAsNumber: true,
//                         })}
//                         error={errors.expenses?.lifeInsuranceAmount?.message}
//                         className="w-48"
//                       />
//                     </div>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.lifeInsurancePremiums"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.lifeInsurancePremiums", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.lifeInsurancePremiums?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>
//                     Current monthly taxes (e.g., monthly cost of federal, state,
//                     and local tax, personal property tax, etc.) ($)
//                   </Label>
//                   <FormInput
//                     label=""
//                     id="expenses.currentMonthlyTaxes"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.currentMonthlyTaxes", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.currentMonthlyTaxes?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <Label>
//                       Secured debts/Other (e.g., any loan where you pledged an
//                       asset as collateral not previously listed, government
//                       guaranteed student loan, employer required retirement or
//                       dues) ($)
//                     </Label>
//                     <div className="mt-2">
//                       <Textarea
//                         id="expenses.securedDebtsList"
//                         placeholder="List debts/expenses"
//                         {...register("expenses.securedDebtsList")}
//                         className="focus:ring-[#22b573] focus:border-[#22b573]"
//                       />
//                     </div>
//                   </div>
//                   <FormInput
//                     label=""
//                     id="expenses.securedDebts"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.securedDebts", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.securedDebts?.message}
//                     className="w-32"
//                   />
//                 </div>
//               </div>

//               <div className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <Label>
//                     Enter the amount of your monthly delinquent state and/or
//                     local tax payment(s) ($)
//                   </Label>
//                   <FormInput
//                     label=""
//                     id="expenses.monthlyTaxPayments"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.monthlyTaxPayments", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.monthlyTaxPayments?.message}
//                     className="w-32"
//                   />
//                 </div>
//                 <div className="mt-2">
//                   <FormInput
//                     label="Total tax owed ($)"
//                     id="expenses.totalTaxOwed"
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     required
//                     {...register("expenses.totalTaxOwed", {
//                       valueAsNumber: true,
//                     })}
//                     error={errors.expenses?.totalTaxOwed?.message}
//                     className="w-48"
//                   />
//                 </div>
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Round to the nearest whole dollar
//                   </p>
//                   <p className="font-bold text-lg">
//                     Add lines (39) through (51) and enter the amount in Box E =
//                     ${totalHouseholdExpenses.toFixed(0)}
//                   </p>
//                   <p className="text-sm font-medium mt-1">
//                     Box E - Total Household Expenses
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Remaining Monthly Income */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Remaining Monthly Income Calculation</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Round to the nearest whole dollar
//                 </p>
//                 <p className="font-bold text-lg">
//                   Subtract Box E from Box D and enter the amount in Box F = $
//                   {remainingMonthlyIncome.toFixed(0)}
//                 </p>
//                 <p className="text-sm font-medium mt-1">
//                   Box F - Remaining Monthly Income
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <FormNavigation
//           currentStep={currentStep}
//           totalSteps={totalSteps}
//           onPrevious={onPrevious}
//           onNext={handleSubmit(onSubmit)}
//           loading={loading}
//         />
//       </form>
//     </FormProvider>
//   );
// }
