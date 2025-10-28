"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useReasonForOffer from "@/hooks/656-form-hooks/useReasonForOffer";
import toast from "react-hot-toast";
import {
  reasonForOfferSchema,
  reasonForOfferInitialValues,
} from "@/lib/validation/form656/reason-for-offer-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";

interface ReasonForOfferSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function ReasonForOfferSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: ReasonForOfferSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { reasonForOffer } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveReasonForOffer,
    handleGetReasonForOffer,
  } = useReasonForOffer();

  const methods = useForm<ReasonForOfferFormSchema>({
    resolver: zodResolver(reasonForOfferSchema),
    defaultValues: reasonForOfferInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const reasonType = watch("reasonType");

  const onSubmit = async (data: ReasonForOfferFormSchema) => {
    try {
      await handleSaveReasonForOffer(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving reason for offer:", error);
      toast.error(error.message || "Failed to save reason for offer");
    }
  };

  useEffect(() => {
    if (!reasonForOffer) handleGetReasonForOffer(caseId, FORM_656_SECTIONS[2]);
  }, []);

  useEffect(() => {
    console.log("reasonForOffer: ", reasonForOffer);
    if (reasonForOffer) {
      reset({ reasonType: reasonForOffer });
    }
  }, [reasonForOffer]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 3: Reason for Offer
          </h2>
          <p className="text-gray-600">
            Select only ONE of the three check boxes below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Reason</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              onValueChange={(value) => setValue("reasonType", value)}
              value={reasonType}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="Doubt as to Collectibility"
                  id="doubt-collect"
                  className="text-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="doubt-collect" className="font-medium">
                    Doubt as to Collectibility
                  </Label>
                  <p className="text-sm text-gray-600">
                    I do not have enough in assets and income to pay my full tax
                    liability. I have offered the minimum offer amount
                    calculated on Form 433-A(OIC) and/or Form 433-B(OIC).
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Note: If you have special circumstances which would prevent
                    you from paying the minimum offer amount calculated on Form
                    433-A (OIC) due to economic hardship attach a detailed
                    explanation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="Economic Hardship"
                  id="eta-hardship"
                  className="text-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="eta-hardship" className="font-medium">
                    Effective Tax Administration - Economic Hardship
                  </Label>
                  <p className="text-sm text-gray-600">
                    I have enough in assets and income to pay my full tax
                    liability but due to my special circumstances, requiring
                    full payment would cause an economic hardship. I owe this
                    tax liability. (Only individuals qualify for this
                    consideration). Attach a detailed explanation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="Public Policy or Equity"
                  id="eta-policy"
                  className="text-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="eta-policy" className="font-medium">
                    Effective Tax Administration - Public Policy or Equity
                  </Label>
                  <p className="text-sm text-gray-600">
                    I have enough in assets and income to pay my full tax
                    liability but collection of the full liability could be
                    viewed as inequitable. I owe this tax liability. The amount
                    I am offering is based on my exceptional circumstances, not
                    economic hardship. Example: A payroll service provider
                    misappropriated taxes withheld from my employees. Attach a
                    detailed explanation.
                  </p>
                </div>
              </div>
            </RadioGroup>
            {errors.reasonType && (
              <p className="text-red-600 text-sm">
                {errors.reasonType.message}
              </p>
            )}
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
