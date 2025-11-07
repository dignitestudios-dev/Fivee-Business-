"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessIncomeInitialValues,
  businessIncomeSchema,
} from "@/lib/validation/form433a/business-income-section";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import useSelfEmployed from "@/hooks/433a-form-hooks/useSelfEmployed";
import useBusinessIncome from "@/hooks/433a-form-hooks/useBusinessIncome";
import useHouseholdIncome from "@/hooks/433a-form-hooks/useHouseHoldIncome";
import { storage } from "@/utils/helper";

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
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessIncomeInfo, selfEmployedInfo, householdIncomeInfo } =
    useAppSelector((state) => state.form433a);
  const isSelfEmployed = selfEmployedInfo?.isSelfEmployed ?? false;

  useEffect(() => {
    if (selfEmployedInfo && !isSelfEmployed) {
      onNext();
    }
  }, [selfEmployedInfo]);

  const {
    loading,
    loadingFormData,
    handleSaveBusinessIncomeInfo,
    handleGetBusinessIncomeInfo,
  } = useBusinessIncome();

  const { loadingFormData: loadingSelfEmpFormData, handleGetSelfEmployedInfo } =
    useSelfEmployed();

  // const { handleSaveHouseholdIncomeInfo, handleGetHouseholdIncomeInfo } =
  //   useHouseholdIncome();

  const methods = useForm<BusinessIncomeFormSchema>({
    resolver: zodResolver(businessIncomeSchema),
    defaultValues: businessIncomeInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: BusinessIncomeFormSchema) => {
    try {
      console.log("business income data: ", data);
      await handleSaveBusinessIncomeInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving business income info:", error);
      toast.error(error.message || "Failed to save business income info");
    }
  };

  useEffect(() => {
    if (!selfEmployedInfo)
      handleGetSelfEmployedInfo(caseId, FORM_433A_SECTIONS[3]);
    if (isSelfEmployed && !businessIncomeInfo) {
      handleGetBusinessIncomeInfo(caseId, FORM_433A_SECTIONS[5]);
    }
    // const form433aProgress: any = storage.get("433a_progress");
    // if (!householdIncomeInfo && form433aProgress?.completedSteps?.includes(8))
    //   handleGetHouseholdIncomeInfo(caseId, FORM_433A_SECTIONS[6]);
  }, [isSelfEmployed, businessIncomeInfo, caseId]);

  useEffect(() => {
    if (businessIncomeInfo) {
      reset(businessIncomeInfo);
    }
  }, [businessIncomeInfo, reset]);

  // Compute totals with useMemo
  const grossReceipts = useWatch({ control, name: "grossReceipts" }) || 0;
  const grossRentalIncome =
    useWatch({ control, name: "grossRentalIncome" }) || 0;
  const interestIncome = useWatch({ control, name: "interestIncome" }) || 0;
  const dividends = useWatch({ control, name: "dividends" }) || 0;
  const otherIncome = useWatch({ control, name: "otherIncome" }) || 0;

  const totalBusinessIncome = useMemo(
    () =>
      grossReceipts +
      grossRentalIncome +
      interestIncome +
      dividends +
      otherIncome,
    [grossReceipts, grossRentalIncome, interestIncome, dividends, otherIncome]
  );

  const materialsPurchased =
    useWatch({ control, name: "materialsPurchased" }) || 0;
  const inventoryPurchased =
    useWatch({ control, name: "inventoryPurchased" }) || 0;
  const grossWagesSalaries =
    useWatch({ control, name: "grossWagesSalaries" }) || 0;
  const rent = useWatch({ control, name: "rent" }) || 0;
  const supplies = useWatch({ control, name: "supplies" }) || 0;
  const utilitiesTelephones =
    useWatch({ control, name: "utilitiesTelephones" }) || 0;
  const vehicleCosts = useWatch({ control, name: "vehicleCosts" }) || 0;
  const businessInsurance =
    useWatch({ control, name: "businessInsurance" }) || 0;
  const currentBusinessTaxes =
    useWatch({ control, name: "currentBusinessTaxes" }) || 0;
  const securedDebts = useWatch({ control, name: "securedDebts" }) || 0;
  const otherBusinessExpenses =
    useWatch({ control, name: "otherBusinessExpenses" }) || 0;

  const totalBusinessExpenses = useMemo(
    () =>
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
      otherBusinessExpenses,
    [
      materialsPurchased,
      inventoryPurchased,
      grossWagesSalaries,
      rent,
      supplies,
      utilitiesTelephones,
      vehicleCosts,
      businessInsurance,
      currentBusinessTaxes,
      securedDebts,
      otherBusinessExpenses,
    ]
  );

  const netBusinessIncome = useMemo(
    () => Math.max(0, totalBusinessIncome - totalBusinessExpenses),
    [totalBusinessIncome, totalBusinessExpenses]
  );

  // Update boxC
  useEffect(() => {
    setValue("boxC", netBusinessIncome);
  }, [netBusinessIncome, setValue]);

  if (loadingFormData || loadingSelfEmpFormData) {
    return <FormLoader />;
  }

  if (!isSelfEmployed) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            onNext={handleSubmit(onSubmit)}
            loading={loading}
          />
        </form>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 6: Business Income and Expense Information (for
            Self-Employed)
          </h2>
          <p className="text-gray-600">
            If you provide a current profit and loss (P&L) statement for the
            information below, enter the total gross monthly income on line 17
            and your monthly expenses on line 29 below.
          </p>
          <p className="text-gray-800 font-semibold">
            Round to the nearest whole dollar. Do not enter a negative number.
            If any line item is a negative number, enter "0".
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
                required
                {...register("periodStart")}
                error={errors.periodStart?.message}
              />
              <FormInput
                label="Through *"
                id="periodEnd"
                type="date"
                required
                {...register("periodEnd")}
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
              You may average 6-12 months income/receipts to determine your
              gross monthly income/receipts
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Gross Receipts ($) *"
                id="grossReceipts"
                type="number"
                min="0"
                required
                {...register("grossReceipts", { valueAsNumber: true })}
                error={errors.grossReceipts?.message}
              />
              <FormInput
                label="Gross Rental Income ($) *"
                id="grossRentalIncome"
                type="number"
                min="0"
                required
                {...register("grossRentalIncome", { valueAsNumber: true })}
                error={errors.grossRentalIncome?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Interest Income ($) *"
                id="interestIncome"
                type="number"
                min="0"
                required
                {...register("interestIncome", { valueAsNumber: true })}
                error={errors.interestIncome?.message}
              />
              <FormInput
                label="Dividends ($) *"
                id="dividends"
                type="number"
                min="0"
                required
                {...register("dividends", { valueAsNumber: true })}
                error={errors.dividends?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Other Income ($) *"
                id="otherIncome"
                type="number"
                min="0"
                required
                {...register("otherIncome", { valueAsNumber: true })}
                error={errors.otherIncome?.message}
              />
              <div className="bg-[#22b573]/5 p-4 rounded-lg">
                <div className="font-medium">Total Business Income ($)</div>
                <div className="text-2xl font-bold text-[#22b573] mt-1">
                  ${totalBusinessIncome.toFixed(0)}
                </div>
                <p className="text-xs text-gray-500">
                  Calculated automatically
                </p>
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
                  min="0"
                  required
                  {...register("materialsPurchased", { valueAsNumber: true })}
                  error={errors.materialsPurchased?.message}
                />
                <p className="text-xs text-gray-500">
                  Items directly related to the production of a product or
                  service
                </p>
              </div>
              <div className="space-y-2">
                <FormInput
                  label="Inventory Purchased ($) *"
                  id="inventoryPurchased"
                  type="number"
                  min="0"
                  required
                  {...register("inventoryPurchased", { valueAsNumber: true })}
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
                min="0"
                required
                {...register("grossWagesSalaries", { valueAsNumber: true })}
                error={errors.grossWagesSalaries?.message}
              />
              <FormInput
                label="Rent ($) *"
                id="rent"
                type="number"
                min="0"
                required
                {...register("rent", { valueAsNumber: true })}
                error={errors.rent?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label="Supplies ($) *"
                  id="supplies"
                  type="number"
                  min="0"
                  required
                  {...register("supplies", { valueAsNumber: true })}
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
                min="0"
                required
                {...register("utilitiesTelephones", { valueAsNumber: true })}
                error={errors.utilitiesTelephones?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label="Vehicle Costs ($) *"
                  id="vehicleCosts"
                  type="number"
                  min="0"
                  required
                  {...register("vehicleCosts", { valueAsNumber: true })}
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
                min="0"
                required
                {...register("businessInsurance", { valueAsNumber: true })}
                error={errors.businessInsurance?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label="Current Business Taxes ($) *"
                  id="currentBusinessTaxes"
                  type="number"
                  min="0"
                  required
                  {...register("currentBusinessTaxes", { valueAsNumber: true })}
                  error={errors.currentBusinessTaxes?.message}
                />
                <p className="text-xs text-gray-500">
                  Real estate, excise, franchise, occupational, personal
                  property, sales and employer's portion of employment taxes
                </p>
              </div>
              <FormInput
                label="Secured Debts (not credit cards) ($) *"
                id="securedDebts"
                type="number"
                min="0"
                required
                {...register("securedDebts", { valueAsNumber: true })}
                error={errors.securedDebts?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label="Other Business Expenses ($) *"
                  id="otherBusinessExpenses"
                  type="number"
                  min="0"
                  required
                  {...register("otherBusinessExpenses", {
                    valueAsNumber: true,
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
                <p className="text-xs text-gray-500">
                  Calculated automatically
                </p>
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
                  Net Business Income (Box C) = ${netBusinessIncome.toFixed(0)}
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
          onNext={handleSubmit(onSubmit)}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
