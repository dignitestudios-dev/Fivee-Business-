"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FormLoader from "@/components/global/FormLoader";
import { useAppSelector } from "@/lib/hooks";
import { maskedRegister } from "./masked-register";
import {
  FORMATTED_INPUT_MAXLENGTH,
  W7_LIMITS,
  formatTinInput,
} from "@/lib/validation/formw7/rules";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { useW7ApplicationInfo } from "@/hooks/w7-form-hooks/useW7Section";
import {
  applicationInfoInitialValues,
  applicationInfoSchema,
} from "@/lib/validation/formw7/application-info-section";

interface SectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

// Reason wording reproduced from Form W-7 (Rev. December 2024)
const REASONS: Array<{
  code: "a" | "b" | "c" | "d" | "e" | "f" | "g";
  label: string;
}> = [
  {
    code: "a",
    label:
      "Nonresident alien required to get an ITIN to claim tax treaty benefit",
  },
  { code: "b", label: "Nonresident alien filing a U.S. federal tax return" },
  {
    code: "c",
    label:
      "U.S. resident alien (based on days present in the United States) filing a U.S. federal tax return",
  },
  { code: "d", label: "Dependent of U.S. citizen/resident alien" },
  { code: "e", label: "Spouse of U.S. citizen/resident alien" },
  {
    code: "f",
    label:
      "Nonresident alien student, professor, or researcher filing a U.S. federal tax return or claiming an exception",
  },
  { code: "g", label: "Dependent/spouse of a nonresident alien holding a U.S. visa" },
];

const REASON_CAUTION =
  "Caution: if you select b, c, d, e, f, or g, you must file a U.S. federal tax return along with Form W-7, unless you meet one of the IRS exceptions.";

export function ApplicationInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  disabled = false,
}: SectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { applicationInfo } = useAppSelector((state) => state.formW7);
  const { loading, loadingFormData, handleSave, handleGet } =
    useW7ApplicationInfo();

  const methods = useForm<W7ApplicationInfoFormSchema>({
    resolver: zodResolver(applicationInfoSchema),
    defaultValues: applicationInfoInitialValues,
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

  const applicationType = watch("applicationType");
  const primaryReason = watch("primaryReason");
  const includeOtherReason = watch("includeOtherReason");
  const claimingException = watch("claimingException");

  const claimsException = primaryReason === "f" && claimingException;
  const requiresTreaty = primaryReason === "a" || claimsException;
  const isDependentOrSpouse = primaryReason === "d" || primaryReason === "e";

  useEffect(() => {
    if (!applicationInfo) handleGet(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (applicationInfo) reset(applicationInfo);
  }, [applicationInfo, reset]);

  // Reason a, and reason f with an exception, must also carry reason h
  useEffect(() => {
    if (requiresTreaty && !includeOtherReason) {
      setValue("includeOtherReason", true);
    }
  }, [requiresTreaty, includeOtherReason, setValue]);

  // An exception can only be claimed under reason f
  useEffect(() => {
    if (primaryReason !== "f" && claimingException) {
      setValue("claimingException", false);
    }
  }, [primaryReason, claimingException, setValue]);

  const onSubmit = async (data: W7ApplicationInfoFormSchema) => {
    if (disabled) return onNext();
    try {
      await handleSave(data, caseId);
      onNext();
    } catch (error: any) {
      showError(
        error?.message || "Failed to save the application information",
        "Application Info Error"
      );
    }
  };

  if (loadingFormData) return <FormLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 1: Application Type and Reason
          </h2>
          <p className="text-gray-600">
            Tell us whether this is a new ITIN or a renewal, then select the
            reason you&apos;re submitting Form W-7.
          </p>
          <p className="text-sm text-gray-600 mt-3">
            An IRS individual taxpayer identification number (ITIN) is for U.S.
            federal tax purposes only. Don&apos;t submit this form if you have,
            or are eligible to get, a U.S. social security number (SSN).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={applicationType}
              onValueChange={(value) =>
                setValue("applicationType", value as "new" | "renewal")
              }
              className="space-y-3"
              disabled={disabled}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="new"
                  id="w7-type-new"
                  className="text-[#22b573] mt-1"
                />
                <Label htmlFor="w7-type-new" className="font-medium">
                  Apply for a new ITIN
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="renewal"
                  id="w7-type-renewal"
                  className="text-[#22b573] mt-1"
                />
                <Label htmlFor="w7-type-renewal" className="font-medium">
                  Renew an existing ITIN
                </Label>
              </div>
            </RadioGroup>
            {errors.applicationType && (
              <p className="text-red-600 text-sm">
                {errors.applicationType.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="block">
              Reason You&apos;re Submitting Form W-7
              <span className="block text-sm font-normal text-gray-500 mt-2">
                {REASON_CAUTION}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={primaryReason}
              onValueChange={(value) =>
                setValue(
                  "primaryReason",
                  value as W7ApplicationInfoFormSchema["primaryReason"]
                )
              }
              className="space-y-4"
              disabled={disabled}
            >
              {REASONS.map((reason) => (
                <div key={reason.code} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={reason.code}
                    id={`w7-reason-${reason.code}`}
                    className="text-[#22b573] mt-1"
                  />
                  {/* Label is a flex row, so items-start keeps the box letter
                      on the first line of a wrapped reason */}
                  <Label
                    htmlFor={`w7-reason-${reason.code}`}
                    className="font-medium items-start leading-relaxed"
                  >
                    <span className="uppercase w-4 shrink-0">
                      {reason.code}.
                    </span>
                    <span>{reason.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.primaryReason && (
              <p className="text-red-600 text-sm">
                {errors.primaryReason.message}
              </p>
            )}

            {primaryReason === "f" && (
              <div className="flex items-start space-x-2 rounded-lg bg-gray-50 border border-gray-200 p-4">
                <Checkbox
                  id="claimingException"
                  {...register("claimingException")}
                  disabled={disabled}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="claimingException" className="font-medium">
                    I am claiming an exception
                  </Label>
                  <p className="text-sm text-gray-600">
                    Claiming an exception also requires an explanation and the
                    treaty details below.
                  </p>
                  {errors.claimingException && (
                    <p className="text-red-600 text-sm">
                      {errors.claimingException.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2 border-t border-gray-200 pt-5">
              <Checkbox
                id="includeOtherReason"
                {...register("includeOtherReason")}
                disabled={disabled || requiresTreaty}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="includeOtherReason"
                  className="font-medium items-start leading-relaxed"
                >
                  <span className="uppercase w-4 shrink-0">h.</span>
                  <span>Other</span>
                </Label>
                {requiresTreaty && (
                  <p className="text-sm text-gray-600">
                    Required for the reason you selected, so it has been
                    selected for you.
                  </p>
                )}
                {errors.includeOtherReason && (
                  <p className="text-red-600 text-sm">
                    {errors.includeOtherReason.message}
                  </p>
                )}
              </div>
            </div>

            {includeOtherReason && (
              <FormTextarea
                label="Explanation"
                id="otherReason"
                required
                rows={3}
                placeholder="For example: Exception 1d - Pension income"
                disabled={disabled}
                maxLength={W7_LIMITS.otherReason}
                {...register("otherReason")}
                error={errors.otherReason?.message}
              />
            )}
          </CardContent>
        </Card>

        {requiresTreaty && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Treaty Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Treaty Country"
                id="treatyCountry"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.treatyCountry}
                {...register("treatyCountry")}
                error={errors.treatyCountry?.message}
              />
              <FormInput
                label="Treaty Article Number"
                id="treatyArticleNumber"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.treatyArticle}
                {...register("treatyArticleNumber")}
                error={errors.treatyArticleNumber?.message}
              />
            </CardContent>
          </Card>
        )}

        {isDependentOrSpouse && (
          <Card>
            <CardHeader>
              <CardTitle>U.S. Citizen/Resident Alien Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {primaryReason === "d" && (
                <FormInput
                  label="Relationship to U.S. Citizen/Resident Alien"
                  id="relationshipToCitizenResident"
                  required
                  placeholder="For example: Child"
                  disabled={disabled}
                  maxLength={W7_LIMITS.relationship}
                {...register("relationshipToCitizenResident")}
                  error={errors.relationshipToCitizenResident?.message}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Name of U.S. Citizen/Resident Alien"
                  id="citizenResidentName"
                  required
                  disabled={disabled}
                  maxLength={W7_LIMITS.citizenResidentName}
                {...register("citizenResidentName")}
                  error={errors.citizenResidentName?.message}
                />
                <FormInput
                  label="SSN/ITIN of U.S. Citizen/Resident Alien"
                  id="citizenResidentTin"
                  required
                  placeholder="123-45-6789"
                  disabled={disabled}
                  maxLength={FORMATTED_INPUT_MAXLENGTH}
                  inputMode="numeric"
                  {...maskedRegister(register, setValue, "citizenResidentTin", formatTinInput)}
                  error={errors.citizenResidentTin?.message}
                />
              </div>
            </CardContent>
          </Card>
        )}

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
