"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FormLoader from "@/components/global/FormLoader";
import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { useW7SignatureDelegate } from "@/hooks/w7-form-hooks/useW7Section";
import {
  signatureDelegateInitialValues,
  signatureDelegateSchema,
  W7_DELEGATE_RELATIONSHIPS,
  W7_DELEGATE_RELATIONSHIP_LABELS,
} from "@/lib/validation/formw7/signature-delegate-section";
import { formatPhone } from "@/utils/helper";

const PERJURY_DECLARATION =
  "Under penalties of perjury, I (applicant/delegate/acceptance agent) declare that I have examined this application, including accompanying documentation and statements, and to the best of my knowledge and belief, it is true, correct, and complete. I authorize the IRS to share information with my acceptance agent in order to perfect this Form W-7, Application for IRS Individual Taxpayer Identification Number.";

interface SectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onCompleted?: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export function SignatureDelegateSection({
  onNext,
  onPrevious,
  onCompleted,
  currentStep,
  totalSteps,
  disabled = false,
}: SectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { signatureDelegateInfo } = useAppSelector((state) => state.formW7);
  const { loading, loadingFormData, handleSave, handleGet } =
    useW7SignatureDelegate();

  const methods = useForm<W7SignatureDelegateFormSchema>({
    resolver: zodResolver(signatureDelegateSchema),
    defaultValues: signatureDelegateInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const signedByDelegate = watch("signedByDelegate");
  const delegateRelationship = watch("delegateRelationship");

  useEffect(() => {
    if (!signatureDelegateInfo) handleGet(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (signatureDelegateInfo) reset(signatureDelegateInfo);
  }, [signatureDelegateInfo, reset]);

  // Delegate details may only be sent when a delegate signs
  useEffect(() => {
    if (!signedByDelegate) {
      setValue("delegateName", "");
      setValue("delegateRelationship", "");
    }
  }, [signedByDelegate, setValue]);

  const onSubmit = async (data: W7SignatureDelegateFormSchema) => {
    if (disabled) return;
    try {
      await handleSave(data, caseId);
      // Saving this section marks the case complete on the backend
      onCompleted?.();
      onNext();
    } catch (error: any) {
      showError(
        error?.message || "Failed to save the signature information",
        "Signature Error"
      );
    }
  };

  if (loadingFormData) return <FormLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 4: Signatures
          </h2>
          <p className="text-gray-600">{PERJURY_DECLARATION}</p>
          <p className="text-gray-600 mt-2 font-medium">
            Keep a copy for your records.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:w-1/2">
              <FormInput
                label="Phone Number"
                id="phoneNumber"
                required
                placeholder="(212) 555-0199"
                disabled={disabled}
                {...register("phoneNumber", {
                  onChange: (event) => {
                    event.target.value = formatPhone(event.target.value);
                  },
                })}
                error={errors.phoneNumber?.message}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delegate (if applicable)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="signedByDelegate"
                {...register("signedByDelegate")}
                disabled={disabled}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label htmlFor="signedByDelegate" className="font-medium">
                  A delegate will sign this application
                </Label>
                <p className="text-sm text-gray-600">
                  Leave unchecked if the applicant will sign personally.
                </p>
              </div>
            </div>

            {signedByDelegate && (
              <div className="space-y-6 border-t border-gray-200 pt-5">
                <div className="md:w-1/2">
                  <FormInput
                    label="Name of Delegate (type or print)"
                    id="delegateName"
                    required
                    disabled={disabled}
                    {...register("delegateName")}
                    error={errors.delegateName?.message}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Delegate&apos;s relationship to applicant
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    value={delegateRelationship}
                    onValueChange={(value) =>
                      setValue(
                        "delegateRelationship",
                        value as W7SignatureDelegateFormSchema["delegateRelationship"]
                      )
                    }
                    className="space-y-3"
                    disabled={disabled}
                  >
                    {W7_DELEGATE_RELATIONSHIPS.map((relationship) => (
                      <div
                        key={relationship}
                        className="flex items-start space-x-2"
                      >
                        <RadioGroupItem
                          value={relationship}
                          id={`w7-delegate-${relationship}`}
                          className="text-[#22b573] mt-0.5"
                        />
                        <Label
                          htmlFor={`w7-delegate-${relationship}`}
                          className="items-start"
                        >
                          {W7_DELEGATE_RELATIONSHIP_LABELS[relationship]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.delegateRelationship && (
                    <p className="text-red-600 text-sm">
                      {errors.delegateRelationship.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Original Signature Acknowledgement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acknowledgesOriginalSignatureRequired"
                {...register("acknowledgesOriginalSignatureRequired")}
                disabled={disabled}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="acknowledgesOriginalSignatureRequired"
                  className="font-medium"
                >
                  I understand the printed form must carry an original signature
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  The signature and date areas are left blank on the generated
                  form. The applicant or delegate must print it, sign it by
                  hand, and mail it to the IRS with the required supporting
                  documents.
                </p>
                {errors.acknowledgesOriginalSignatureRequired && (
                  <p className="text-red-600 text-sm">
                    {errors.acknowledgesOriginalSignatureRequired.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit(onSubmit)}
          onSubmit={handleSubmit(onSubmit)}
          // A paid form is read-only, so the save action is hidden
          paymentStatus={disabled}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
