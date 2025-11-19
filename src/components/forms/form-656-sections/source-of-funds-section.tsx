"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import useSourceOfFunds from "@/hooks/656-form-hooks/useSourceOfFunds";
import toast from "react-hot-toast";
import {
  sourceOfFundsSchema,
  sourceOfFundsInitialValues,
} from "@/lib/validation/form656/source-of-funds-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";

interface SourceOfFundsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function SourceOfFundsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: SourceOfFundsSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { sourceOfFunds } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveSourceOfFunds,
    handleGetSourceOfFunds,
  } = useSourceOfFunds();

  const methods = useForm<SourceOfFundsFormSchema>({
    resolver: zodResolver(sourceOfFundsSchema),
    defaultValues: sourceOfFundsInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  console.log("sourceOfFunds errors:", errors);

  const onSubmit = async (data: SourceOfFundsFormSchema) => {
    try {
      delete data.yearsNotRequiredToFileCheckbox;
      data.yearsNotRequiredToFile = data?.yearsNotRequiredToFile
        ? data?.yearsNotRequiredToFile?.toString()
        : "";
      await handleSaveSourceOfFunds(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving source of funds from comp:", error);
      toast.error(error.message || "Failed to save source of funds");
    }
  };

  useEffect(() => {
    if (!sourceOfFunds) handleGetSourceOfFunds(caseId, FORM_656_SECTIONS[5]);
  }, []);

  useEffect(() => {
    if (sourceOfFunds) {
      reset(sourceOfFunds);
    }
  }, [sourceOfFunds]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 6: Source of Funds, Filing Requirements, and Stay Out of
            Trouble
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Source of Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              I will get the money to fund this offer from the following
              sources. If the money is coming from a loan, I understand that the
              IRS will not subordinate its interest in my assets to a lender. If
              the funds are coming from a third party, I understand that I may
              need to disclose additional information:
            </p>
            <FormInput
              label="Source of Funds"
              id="sourceOfFunds"
              required
              {...register("sourceOfFunds")}
              error={errors.sourceOfFunds?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filing Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="allRequiredReturnsFiled"
                {...register("allRequiredReturnsFiled")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-0.5"
              />
              <Label htmlFor="allRequiredReturnsFiled">
                I have filed all required tax returns and have included a
                complete copy of any tax return filed within 10 weeks of this
                offer submission
              </Label>
            </div>
            {errors.allRequiredReturnsFiled && (
              <p className="text-red-600 text-sm">
                {errors.allRequiredReturnsFiled.message}
              </p>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="yearsNotRequiredToFileCheckbox"
                {...register("yearsNotRequiredToFileCheckbox")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-0.5"
              />
              <Label htmlFor="yearsNotRequiredToFileCheckbox">
                I was not required to file a tax return for the following years
              </Label>
              <FormInput
                id="yearsNotRequiredToFile"
                type="text"
                inputMode="decimal"
                pattern="[0-9.]*"
                maxLength={3}
                className="-mt-2"
                {...register("yearsNotRequiredToFile", {
                  valueAsNumber: true,
                  onChange: (e: any) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9.]/g,
                      ""
                    );
                  },
                  min: { value: 0, message: "Value cannot be negative" },
                })}
                error={errors.yearsNotRequiredToFile?.message}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Tax Payment Requirements (check all that apply)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="madeEstimatedTaxPayments"
                {...register("madeEstimatedTaxPayments")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="madeEstimatedTaxPayments">
                I have made all required estimated tax payments for the current
                tax year.
              </Label>
            </div>
            {errors.madeEstimatedTaxPayments && (
              <p className="text-red-600 text-sm">
                {errors.madeEstimatedTaxPayments.message}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notRequiredEstimatedTaxPayments"
                {...register("notRequiredEstimatedTaxPayments")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="notRequiredEstimatedTaxPayments">
                I am not required to make any estimated tax payments for the
                current tax year.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="madeFederalTaxDeposits"
                {...register("madeFederalTaxDeposits")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="madeFederalTaxDeposits">
                I have made all required federal tax deposits for the current
                quarter and the two preceding quarters.
              </Label>
            </div>
            {errors.madeFederalTaxDeposits && (
              <p className="text-red-600 text-sm">
                {errors.madeFederalTaxDeposits.message}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notRequiredFederalTaxDeposits"
                {...register("notRequiredFederalTaxDeposits")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="notRequiredFederalTaxDeposits">
                I am not required to make federal tax deposits.
              </Label>
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
