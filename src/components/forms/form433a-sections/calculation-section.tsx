"use client";

import { FormNavigation } from "./form-navigation";
import { FormField, FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo } from "react";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculationInitialValues,
  calculationSchema,
} from "@/lib/validation/form433a/calculation-section";
import useCalculation from "@/hooks/433a-form-hooks/useCalculation";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import useBusinessAssets from "@/hooks/433a-form-hooks/useBusinessAssets";
import useHouseholdIncome from "@/hooks/433a-form-hooks/useHouseHoldIncome";
import usePersonalAssets from "@/hooks/433a-form-hooks/usePersonalAssets";

interface CalculationSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  paymentStatus: boolean;
}

export function CalculationSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  paymentStatus,
}: CalculationSectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const {
    calculationInfo,
    assetsInfo,
    businessAssetsInfo,
    householdIncomeInfo,
  } = useAppSelector((state) => state.form433a);
  const boxA = assetsInfo?.boxA ?? 0;
  const boxB = businessAssetsInfo?.boxB ?? 0;
  const boxF = householdIncomeInfo?.boxF ?? 0;

  const {
    loading,
    loadingFormData,
    handleSaveCalculationInfo,
    handleGetCalculationInfo,
  } = useCalculation();

  const {
    loadingFormData: loadingBusinessAssetsFormData,
    handleGetBusinessAssetsInfo,
  } = useBusinessAssets();

  const {
    loadingFormData: loadingHouseholdFormData,
    handleGetHouseholdIncomeInfo,
  } = useHouseholdIncome();

  const {
    loadingFormData: loadingPersonalAssetsFormData,
    handleGetAssetsInfo,
  } = usePersonalAssets();

  const methods = useForm<CalculationFormSchema>({
    resolver: zodResolver(calculationSchema),
    defaultValues: calculationInitialValues,
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

  const onSubmit = async (data: CalculationFormSchema) => {
    try {
      console.log("calculation data: ", data);
      await handleSaveCalculationInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving calculation info:", error);
      showError(
        error.message || "Failed to save calculation info",
        "Calculation Error"
      );
    }
  };

  useEffect(() => {
    if (!calculationInfo)
      handleGetCalculationInfo(caseId, FORM_433A_SECTIONS[7]);
    if (!assetsInfo) handleGetAssetsInfo(caseId, FORM_433A_SECTIONS[2]);
    if (!businessAssetsInfo)
      handleGetBusinessAssetsInfo(caseId, FORM_433A_SECTIONS[4]);
    if (!householdIncomeInfo)
      handleGetHouseholdIncomeInfo(caseId, FORM_433A_SECTIONS[6]);
  }, [calculationInfo, caseId]);

  useEffect(() => {
    if (calculationInfo) {
      console.log("calculationInfo: ", calculationInfo);
      const parsedData = {
        ...calculationInitialValues,
        ...calculationInfo,
        futureIncome: calculationInfo.boxGAndH || 0,
      };
      reset(parsedData);
    }
  }, [calculationInfo, reset]);

  useEffect(() => {
    setValue("boxA", boxA);
    setValue("boxB", boxB);
    setValue("boxF5Month", boxF);
    setValue("boxF24Month", boxF);
  }, [
    boxA,
    boxB,
    boxF,
    setValue,
    calculationInfo,
    assetsInfo,
    businessAssetsInfo,
    householdIncomeInfo,
  ]);

  const paymentTimeline = useWatch({ control, name: "paymentTimeline" });
  const boxF5Month = useWatch({ control, name: "boxF5Month" }) || 0;
  const boxF24Month = useWatch({ control, name: "boxF24Month" }) || 0;

  const boxG = useMemo(() => Number(boxF5Month) * 12, [boxF5Month]);
  const boxH = useMemo(() => Number(boxF24Month) * 24, [boxF24Month]);

  useEffect(() => {
    setValue("boxG", boxG);
    setValue("boxH", boxH);
  }, [boxG, boxH, setValue]);

  useEffect(() => {
    if (paymentTimeline === "5_months_or_less") {
      setValue("futureIncome", boxG);
    } else if (paymentTimeline === "6_to_24_months") {
      setValue("futureIncome", boxH);
    } else {
      setValue("futureIncome", 0);
    }
  }, [paymentTimeline, boxG, boxH, setValue]);

  const futureIncome = useWatch({ control, name: "futureIncome" }) || 0;
  const currentBoxA = useWatch({ control, name: "boxA" }) || 0;
  const currentBoxB = useWatch({ control, name: "boxB" }) || 0;

  const minimumOfferAmount = useMemo(
    () => Number(currentBoxA) + Number(currentBoxB) + Number(futureIncome),
    [currentBoxA, currentBoxB, futureIncome]
  );

  useEffect(() => {
    setValue("minimumOfferAmount", minimumOfferAmount);
  }, [minimumOfferAmount, setValue]);

  if (
    loadingFormData ||
    loadingBusinessAssetsFormData ||
    loadingHouseholdFormData ||
    loadingPersonalAssetsFormData
  ) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 8: Calculate Your Minimum Offer Amount
          </h2>
          <p className="text-gray-600">
            The amount of time you take to pay your offer in full will affect
            your minimum offer amount. Paying over a shorter period of time will
            result in a smaller minimum offer amount.
          </p>
        </div>

        {/* Payment Timeline Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Timeline</CardTitle>
            <p className="text-sm text-gray-600">
              Choose how you plan to pay your offer amount
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Payment Timeline"
              id="paymentTimeline"
              required
              error={errors.paymentTimeline?.message}
            >
              <Controller
                name="paymentTimeline"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="mt-2 space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <RadioGroupItem
                        value="5_months_or_less"
                        id="5_months_or_less"
                        className="text-[#22b573] mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="5_months_or_less"
                          className="font-medium"
                        >
                          5 or fewer payments within 5 months or less
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Results in lower minimum offer amount
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <RadioGroupItem
                        value="6_to_24_months"
                        id="6_to_24_months"
                        className="text-[#22b573] mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="6_to_24_months" className="font-medium">
                          6 to 24 months
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Results in higher minimum offer amount
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* 5 Month Calculation - COMMENTED OUT FOR FINAL SUMMARY POPUP */}
        {/* {(paymentTimeline === "5_months_or_less") && (
          <Card>
            <CardHeader>
              <CardTitle>5 Month Payment Calculation</CardTitle>
              <p className="text-sm text-gray-600">
                If you will pay your offer in 5 or fewer payments within 5
                months or less
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <FormInput
                  label="Enter the total from Box F ($)"
                  id="boxF5Month"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  readOnly
                  {...register("boxF5Month", { valueAsNumber: true })}
                  error={errors.boxF5Month?.message}
                />
                <div className="text-2xl font-bold text-gray-600 self-center text-center">
                  ×
                </div>
                <FormInput
                  label="Multiplier"
                  value="12"
                  readOnly
                  className="bg-gray-50 text-center font-bold"
                />
                <div className="text-2xl font-bold text-gray-600 self-center text-center">
                  =
                </div>
                <FormInput
                  label="Future Remaining Income (Box G) ($)"
                  type="number"
                  value={boxG.toFixed(0)}
                  readOnly
                  className="bg-[#22b573]/5 font-bold text-[#22b573]"
                />
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* 24 Month Calculation - COMMENTED OUT FOR FINAL SUMMARY POPUP */}
        {/* {(paymentTimeline === "6_to_24_months") && (
          <Card>
            <CardHeader>
              <CardTitle>24 Month Payment Calculation</CardTitle>
              <p className="text-sm text-gray-600">
                If you will pay your offer in 6 to 24 months
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <FormInput
                  label="Enter the total from Box F ($)"
                  id="boxF24Month"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  readOnly
                  {...register("boxF24Month", { valueAsNumber: true })}
                  error={errors.boxF24Month?.message}
                />
                <div className="text-2xl font-bold text-gray-600 self-center text-center">
                  ×
                </div>
                <FormInput
                  label="Multiplier"
                  value="24"
                  readOnly
                  className="bg-gray-50 text-center font-bold"
                />
                <div className="text-2xl font-bold text-gray-600 self-center text-center">
                  =
                </div>
                <FormInput
                  label="Future Remaining Income (Box H) ($)"
                  type="number"
                  value={boxH.toFixed(0)}
                  readOnly
                  className="bg-[#22b573]/5 font-bold text-[#22b573]"
                />
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Final Offer Calculation - COMMENTED OUT FOR FINAL SUMMARY POPUP */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Minimum Offer Amount Calculation</CardTitle>
            <p className="text-sm text-gray-600">
              Determine your minimum offer amount by adding the total available
              assets to the future remaining income
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Box A (Individual Assets) ($)"
                id="boxA"
                type="number"
                min="0"
                required
                readOnly
                {...register("boxA", { valueAsNumber: true })}
                error={errors.boxA?.message}
              />
              <FormInput
                label="Box B (Business Assets) ($)"
                id="boxB"
                type="number"
                min="0"
                required
                readOnly
                {...register("boxB", { valueAsNumber: true })}
                error={errors.boxB?.message}
              />
              <FormInput
                label="Future Income (Box G or H) ($)"
                id="futureIncome"
                type="number"
                min="0"
                required
                readOnly
                {...register("futureIncome", { valueAsNumber: true })}
                error={errors.futureIncome?.message}
              />
            </div>

            <div className="bg-[#22b573]/10 p-6 rounded-lg border-2 border-[#22b573]/20">
              <div className="text-center">
                <Label className="text-lg font-semibold text-gray-900">
                  Your Minimum Offer Amount
                </Label>
                <div className="text-4xl font-bold text-[#22b573] mt-2">
                  ${minimumOfferAmount.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Important Note</h4>
              <p className="text-sm text-blue-800">
                Place the offer amount shown above on the Form 656, Section 4,
                Payment Terms, unless you cannot pay that amount due to special
                circumstances. If you cannot pay that amount due to special
                circumstances, place the amount you can pay on the Form 656,
                Section 4, Payment Terms, and explain your special circumstances
                on the Form 656, Section 3, Reason for Offer.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">
                Additional Information
              </h4>
              <p className="text-sm text-yellow-800">
                The multipliers (12 and 24) and the calculated offer amount do
                not apply if the IRS determines you have the ability to pay your
                tax debt in full within the legal period to collect.
              </p>
            </div>
          </CardContent>
        </Card> */}

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit(onSubmit)}
          paymentStatus={paymentStatus}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
