"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useBusinessExpenseInfo from "@/hooks/433b-form-hooks/useBusinessExpenseInfo";
import toast from "react-hot-toast";
import {
  businessExpenseInitialValues,
  businessExpenseSchema,
} from "@/lib/validation/form433b/business-expense-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";
import useBusinessIncomeInfo from "@/hooks/433b-form-hooks/useBusinessIncomeInfo";

interface BusinessExpenseSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function BusinessExpenseSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: BusinessExpenseSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessExpenseInfo, businessIncomeInfo } = useAppSelector(
    (state) => state.form433b
  );
  const {
    loading,
    loadingFormData,
    handleSaveBusinessExpenseInfo,
    handleGetBusinessExpenseInfo,
  } = useBusinessExpenseInfo();

  const { loadingFormData: loadingIncomeData, handleGetBusinessIncomeInfo } =
    useBusinessIncomeInfo();

  const methods = useForm<BusinessExpenseFormSchema>({
    resolver: zodResolver(businessExpenseSchema),
    defaultValues: businessExpenseInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: BusinessExpenseFormSchema) => {
    try {
      await handleSaveBusinessExpenseInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving business expense info:", error);
      toast.error(error.message || "Failed to save business expense info");
    }
  };

  useEffect(() => {
    if (!businessExpenseInfo)
      handleGetBusinessExpenseInfo(caseId, FORM_433B_SECTIONS[3]);
    if (!businessIncomeInfo)
      handleGetBusinessIncomeInfo(caseId, FORM_433B_SECTIONS[2]);
  }, []);

  useEffect(() => {
    if (businessExpenseInfo) {
      reset(businessExpenseInfo);
    }
  }, [businessExpenseInfo]);

  if (loadingFormData || loadingIncomeData) {
    return <FormLoader />;
  }

  const materialsPurchased = watch("materialsPurchased") || 0;
  const inventoryPurchased = watch("inventoryPurchased") || 0;
  const grossWages = watch("grossWages") || 0;
  const rent = watch("rent") || 0;
  const supplies = watch("supplies") || 0;
  const utilities = watch("utilities") || 0;
  const vehicleCosts = watch("vehicleCosts") || 0;
  const repairsMaintenance = watch("repairsMaintenance") || 0;
  const insurance = watch("insurance") || 0;
  const currentTaxes = watch("currentTaxes") || 0;
  const otherExpenses = watch("otherExpenses") || 0;
  const totalExpenses =
    materialsPurchased +
    inventoryPurchased +
    grossWages +
    rent +
    supplies +
    utilities +
    vehicleCosts +
    repairsMaintenance +
    insurance +
    currentTaxes +
    otherExpenses;

  const boxB = businessIncomeInfo?.BoxB || 0;
  const remainingMonthlyIncome = Math.max(0, boxB - totalExpenses);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 4: Business Expense Information
          </h2>
          <p className="text-gray-600">
            Enter the average monthly expenses of your business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Period</CardTitle>
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
              {...register("periodThrough")}
              error={errors.periodThrough?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              type="number"
              label="Materials Purchased ($)"
              id="materialsPurchased"
              {...register("materialsPurchased", { valueAsNumber: true })}
              error={errors.materialsPurchased?.message}
            />
            <FormInput
              type="number"
              label="Inventory Purchased ($)"
              id="inventoryPurchased"
              {...register("inventoryPurchased", { valueAsNumber: true })}
              error={errors.inventoryPurchased?.message}
            />
            <FormInput
              type="number"
              label="Gross Wages & Salaries ($)"
              id="grossWages"
              {...register("grossWages", { valueAsNumber: true })}
              error={errors.grossWages?.message}
            />
            <FormInput
              type="number"
              label="Rent ($)"
              id="rent"
              {...register("rent", { valueAsNumber: true })}
              error={errors.rent?.message}
            />
            <FormInput
              type="number"
              label="Supplies ($)"
              id="supplies"
              {...register("supplies", { valueAsNumber: true })}
              error={errors.supplies?.message}
            />
            <FormInput
              type="number"
              label="Utilities/Telephone ($)"
              id="utilities"
              {...register("utilities", { valueAsNumber: true })}
              error={errors.utilities?.message}
            />
            <FormInput
              type="number"
              label="Vehicle Gasoline/Oil ($)"
              id="vehicleCosts"
              {...register("vehicleCosts", { valueAsNumber: true })}
              error={errors.vehicleCosts?.message}
            />
            <FormInput
              type="number"
              label="Insurance ($)"
              id="insurance"
              {...register("insurance", { valueAsNumber: true })}
              error={errors.insurance?.message}
            />
            <FormInput
              type="number"
              label="Current Taxes ($)"
              id="currentTaxes"
              {...register("currentTaxes", { valueAsNumber: true })}
              error={errors.currentTaxes?.message}
            />
            <FormInput
              type="number"
              label="Other Expenses ($)"
              id="otherExpenses"
              {...register("otherExpenses", { valueAsNumber: true })}
              error={errors.otherExpenses?.message}
            />
            <div className="text-lg font-bold">
              Total Expenses: ${totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-lg font-bold">
              Remaining Monthly Income : $
              {remainingMonthlyIncome.toLocaleString()}
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
