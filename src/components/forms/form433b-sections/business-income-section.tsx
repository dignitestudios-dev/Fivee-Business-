"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useBusinessIncomeInfo from "@/hooks/433b-form-hooks/useBusinessIncomeInfo";
import toast from "react-hot-toast";
import {
  businessIncomeFormBInitialValues,
  businessIncomeSchemaFormB,
} from "@/lib/validation/form433b/business-income-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";

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
  const { businessIncomeInfo } = useAppSelector((state) => state.form433b);
  const {
    loading,
    loadingFormData,
    handleSaveBusinessIncomeInfo,
    handleGetBusinessIncomeInfo,
  } = useBusinessIncomeInfo();

  const methods = useForm<BusinessIncomeFormBSchema>({
    resolver: zodResolver(businessIncomeSchemaFormB),
    defaultValues: businessIncomeFormBInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: BusinessIncomeFormBSchema) => {
    try {
      const payload = { ...data, BoxB: totalIncome };
      await handleSaveBusinessIncomeInfo(payload, caseId);
      onNext();
    } catch (error: any) {
      console.log("Error saving business income info:", error);
      console.log("Error save: ", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to save business income info"
      );
    }
  };

  useEffect(() => {
    if (!businessIncomeInfo)
      handleGetBusinessIncomeInfo(caseId, FORM_433B_SECTIONS[2]);
  }, []);

  useEffect(() => {
    if (businessIncomeInfo) {
      reset(businessIncomeInfo);
    }
  }, [businessIncomeInfo]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  const grossReceipts = watch("grossReceipts") || 0;
  const grossRentalIncome = watch("grossRentalIncome") || 0;
  const interestIncome = watch("interestIncome") || 0;
  const dividends = watch("dividends") || 0;
  const otherIncome = watch("otherIncome") || 0;
  const totalIncome =
    grossReceipts +
    grossRentalIncome +
    interestIncome +
    dividends +
    otherIncome;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 3: Business Income Information
          </h2>
          <p className="text-gray-600">
            Enter the average gross monthly income of your business. To
            determine your gross monthly income use the most recent 6-12 months
            documentation of commissions, invoices, gross receipts from
            sales/services, etc.; most recent 6-12 months earnings statements,
            etc., from every other source of income (such as rental income,
            interest and dividends, or subsidies); or you may use the most
            recent 6-12 months Profit and Loss (P&L) to provide the information
            of income and expenses.{" "}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Income Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              type="date"
              label="Period Beginning"
              id="periodBeginning"
              {...register("periodBeginning")}
              error={errors.periodBeginning?.message}
            />
            <FormInput
              type="date"
              label="Period Through"
              id="periodThrough"
              min={watch("periodBeginning")}
              {...register("periodThrough")}
              error={errors.periodThrough?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              type="text"
              inputMode="decimal"
              label="Gross Receipts ($)"
              id="grossReceipts"
              {...register("grossReceipts", {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return 0;
                  const cleaned = String(v).replace(/[^0-9.]/g, "");
                  const parsed = parseFloat(cleaned);
                  return isNaN(parsed) ? 0 : parsed;
                },
                onChange: (e: any) => {
                  let value = e.target.value;
                  // Remove all non-numeric characters except decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                },
              })}
              error={errors.grossReceipts?.message}
              onWheel={(e: any) => e.target.blur()}
            />
            <FormInput
              type="text"
              inputMode="decimal"
              label="Gross Rental Income ($)"
              id="grossRentalIncome"
              {...register("grossRentalIncome", {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return 0;
                  const cleaned = String(v).replace(/[^0-9.]/g, "");
                  const parsed = parseFloat(cleaned);
                  return isNaN(parsed) ? 0 : parsed;
                },
                onChange: (e: any) => {
                  let value = e.target.value;
                  // Remove all non-numeric characters except decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                },
              })}
              error={errors.grossRentalIncome?.message}
              onWheel={(e: any) => e.target.blur()}
            />
            <FormInput
              type="text"
              inputMode="decimal"
              label="Interest Income ($)"
              id="interestIncome"
              {...register("interestIncome", {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return 0;
                  const cleaned = String(v).replace(/[^0-9.]/g, "");
                  const parsed = parseFloat(cleaned);
                  return isNaN(parsed) ? 0 : parsed;
                },
                onChange: (e: any) => {
                  let value = e.target.value;
                  // Remove all non-numeric characters except decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                },
              })}
              error={errors.interestIncome?.message}
              onWheel={(e: any) => e.target.blur()}
            />
            <FormInput
              type="text"
              inputMode="decimal"
              label="Dividends ($)"
              id="dividends"
              {...register("dividends", {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return 0;
                  const cleaned = String(v).replace(/[^0-9.]/g, "");
                  const parsed = parseFloat(cleaned);
                  return isNaN(parsed) ? 0 : parsed;
                },
                onChange: (e: any) => {
                  let value = e.target.value;
                  // Remove all non-numeric characters except decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                },
              })}
              error={errors.dividends?.message}
              onWheel={(e: any) => e.target.blur()}
            />
            <FormInput
              type="text"
              inputMode="decimal"
              label="Other Income ($)"
              id="otherIncome"
              {...register("otherIncome", {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return 0;
                  const cleaned = String(v).replace(/[^0-9.]/g, "");
                  const parsed = parseFloat(cleaned);
                  return isNaN(parsed) ? 0 : parsed;
                },
                onChange: (e: any) => {
                  let value = e.target.value;
                  // Remove all non-numeric characters except decimal point
                  value = value.replace(/[^0-9.]/g, "");
                  // Ensure only one decimal point
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                },
              })}
              error={errors.otherIncome?.message}
              onWheel={(e: any) => e.target.blur()}
            />
            <div className="text-lg font-bold">
              Total Business Income: $
              {totalIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
