"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCalculationInfo from "@/hooks/433b-form-hooks/useCalculationInfo";
import toast from "react-hot-toast";
import {
  calculationInitialValues,
  calculationSchemaFormB,
} from "@/lib/validation/form433b/calculation-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";
import useBusinessAssetInfo from "@/hooks/433b-form-hooks/useBusinessAssetInfo";
import useBusinessExpenseInfo from "@/hooks/433b-form-hooks/useBusinessExpenseInfo";

interface CalculationSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function CalculationSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: CalculationSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessExpenseInfo, businessAssetsInfo, calculationInfo } =
    useAppSelector((state) => state.form433b);
  const {
    loading,
    loadingFormData,
    handleSaveCalculationInfo,
    handleGetCalculationInfo,
  } = useCalculationInfo();

  const { loadingFormData: loadingAssetsData, handleGetBusinessAssetsInfo } =
    useBusinessAssetInfo();
  const { loadingFormData: loadingExpenseData, handleGetBusinessExpenseInfo } =
    useBusinessExpenseInfo();

  const methods = useForm<CalculationFormSchema>({
    resolver: zodResolver(calculationSchemaFormB),
    defaultValues: calculationInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const paymentTimeline = watch("paymentTimeline");

  useEffect(() => {
    if (!calculationInfo)
      handleGetCalculationInfo(caseId, FORM_433B_SECTIONS[4]);
    if (!businessAssetsInfo)
      handleGetBusinessAssetsInfo(caseId, FORM_433B_SECTIONS[1]);
    if (!businessExpenseInfo)
      handleGetBusinessExpenseInfo(caseId, FORM_433B_SECTIONS[3]);
  }, []);

  useEffect(() => {
    if (calculationInfo) {
      reset(calculationInfo);
    }
  }, [calculationInfo]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  const boxD = Math.round(businessExpenseInfo?.BoxD) || 0;
  console.log(businessExpenseInfo);
  console.log("boxD: ", boxD);

  // Box A: Available Equity in Assets (calculate from businessAssetInfo)
  const boxA = Math.round(businessAssetsInfo?.BoxA) || 0; // Reuse the function from asset section, assume it's exported or duplicated
  console.log("boxA: ", boxA);
  // Calculate Box E or F
  const multiplier = paymentTimeline === "5_months_or_less" ? 12 : 24;
  const futureIncome = Math.round(boxD * multiplier);

  // Minimum Offer
  const minimumOffer = Math.round(boxA + futureIncome);

  const onSubmit = async (data: CalculationFormSchema) => {
    try {
      await handleSaveCalculationInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving calculation info:", error);
      toast.error(error.message || "Failed to save calculation info");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 5: Calculate Your Minimum Offer Amount
          </h2>
          <p className="text-gray-600">
            Calculate the minimum offer based on your payment timeline.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Remaining Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">${boxD.toLocaleString()}</div>
            <p className="text-sm text-gray-600">
              Calculated from income and expenses.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              label="Choose your payment timeline"
              id="paymentTimeline"
              error={errors.paymentTimeline?.message}
            >
              <RadioGroup
                value={paymentTimeline}
                onValueChange={(value: "5_months_or_less" | "6_to_24_months") =>
                  setValue("paymentTimeline", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5_months_or_less" id="short" />
                  <Label htmlFor="short">
                    5 or fewer payments within 5 months or less
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6_to_24_months" id="long" />
                  <Label htmlFor="long">6 to 24 months</Label>
                </div>
              </RadioGroup>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Remaining Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">${futureIncome.toLocaleString()}</div>
            <p className="text-sm text-gray-600">
              Remaining Monthly Income x {multiplier}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Assets (Box A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">${boxA.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minimum Offer Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${minimumOffer.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Future Remaining Income + Available Assets
            </p>
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
