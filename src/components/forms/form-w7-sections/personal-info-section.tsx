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
import { EARLIEST_BIRTH_DATE, W7_LIMITS } from "@/lib/validation/formw7/rules";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { useW7PersonalInfo } from "@/hooks/w7-form-hooks/useW7Section";
import {
  personalInfoInitialValues,
  personalInfoSchema,
} from "@/lib/validation/formw7/personal-info-section";
import { todayForDateInput } from "@/utils/formw7";

interface SectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export function PersonalInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  disabled = false,
}: SectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { personalInfo } = useAppSelector((state) => state.formW7);
  const { loading, loadingFormData, handleSave, handleGet } =
    useW7PersonalInfo();

  const methods = useForm<W7PersonalInfoFormSchema>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfoInitialValues,
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

  const gender = watch("gender");
  const hasDifferentBirthName = watch("hasDifferentBirthName");

  useEffect(() => {
    if (!personalInfo) handleGet(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (personalInfo) reset(personalInfo);
  }, [personalInfo, reset]);

  const onSubmit = async (data: W7PersonalInfoFormSchema) => {
    if (disabled) return onNext();
    try {
      await handleSave(data, caseId);
      onNext();
    } catch (error: any) {
      showError(
        error?.message || "Failed to save the personal information",
        "Personal Info Error"
      );
    }
  };

  if (loadingFormData) return <FormLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 2: Name, Address, and Birth Information
          </h2>
          <p className="text-gray-600">
            Enter the name, addresses, and birth details as they appear on the
            identification documents being submitted.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Name</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="First Name"
                id="legalName.firstName"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.firstName}
                {...register("legalName.firstName")}
                error={errors.legalName?.firstName?.message}
              />
              <FormInput
                label="Middle Name"
                id="legalName.middleName"
                disabled={disabled}
                maxLength={W7_LIMITS.middleName}
                {...register("legalName.middleName")}
                error={errors.legalName?.middleName?.message}
              />
              <FormInput
                label="Last Name"
                id="legalName.lastName"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.lastName}
                {...register("legalName.lastName")}
                error={errors.legalName?.lastName?.message}
              />
            </div>

            <div className="flex items-start space-x-2 border-t border-gray-200 pt-5">
              <Checkbox
                id="hasDifferentBirthName"
                {...register("hasDifferentBirthName")}
                disabled={disabled}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="hasDifferentBirthName"
                  className="font-medium"
                >
                  Name at birth if different
                </Label>
              </div>
            </div>

            {hasDifferentBirthName && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="First Name at Birth"
                  id="birthName.firstName"
                  required
                  disabled={disabled}
                  maxLength={W7_LIMITS.firstName}
                {...register("birthName.firstName")}
                  error={errors.birthName?.firstName?.message}
                />
                <FormInput
                  label="Middle Name at Birth"
                  id="birthName.middleName"
                  disabled={disabled}
                  maxLength={W7_LIMITS.middleName}
                {...register("birthName.middleName")}
                  error={errors.birthName?.middleName?.message}
                />
                <FormInput
                  label="Last Name at Birth"
                  id="birthName.lastName"
                  required
                  disabled={disabled}
                  maxLength={W7_LIMITS.lastName}
                {...register("birthName.lastName")}
                  error={errors.birthName?.lastName?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applicant&apos;s Mailing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              label="Street address, apartment number, or rural route number"
              id="mailingAddress.street"
              disabled={disabled}
              maxLength={W7_LIMITS.addressLine}
                {...register("mailingAddress.street")}
              error={errors.mailingAddress?.street?.message}
            />
            <FormInput
              label="City or town, state or province, and country. Include ZIP code or postal code where appropriate."
              id="mailingAddress.cityStateProvinceCountryPostal"
              required
              disabled={disabled}
              maxLength={W7_LIMITS.addressLine}
                {...register("mailingAddress.cityStateProvinceCountryPostal")}
              error={
                errors.mailingAddress?.cityStateProvinceCountryPostal?.message
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foreign (non-U.S.) Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              label="Street address, apartment number, or rural route number. Don't use a P.O. box number."
              id="foreignAddress.street"
              disabled={disabled}
              maxLength={W7_LIMITS.addressLine}
                {...register("foreignAddress.street")}
              error={errors.foreignAddress?.street?.message}
            />
            <FormInput
              label="City or town, state or province, and country. Include postal code where appropriate."
              id="foreignAddress.cityStateProvinceCountryPostal"
              required
              disabled={disabled}
              maxLength={W7_LIMITS.addressLine}
                {...register("foreignAddress.cityStateProvinceCountryPostal")}
              error={
                errors.foreignAddress?.cityStateProvinceCountryPostal?.message
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Birth Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Labels here wrap to different heights, so they are given a
                shared minimum height to keep the inputs on one line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:[&_label]:min-h-10 md:[&_label]:items-start">
              <FormInput
                label="Date of Birth (month / day / year)"
                id="dateOfBirth"
                type="date"
                required
                max={todayForDateInput()}
                disabled={disabled}
                min={EARLIEST_BIRTH_DATE}
                {...register("dateOfBirth")}
                error={errors.dateOfBirth?.message}
              />
              <FormInput
                label="Country of Birth"
                id="countryOfBirth"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.countryOfBirth}
                {...register("countryOfBirth")}
                error={errors.countryOfBirth?.message}
              />
              <FormInput
                label="City and State or Province (optional)"
                id="cityStateProvinceOfBirth"
                disabled={disabled}
                maxLength={W7_LIMITS.cityStateProvinceOfBirth}
                {...register("cityStateProvinceOfBirth")}
                error={errors.cityStateProvinceOfBirth?.message}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Gender
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female")
                }
                className="flex items-center gap-8"
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="w7-gender-male"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="w7-gender-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="w7-gender-female"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="w7-gender-female">Female</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-red-600 text-sm">{errors.gender.message}</p>
              )}
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
