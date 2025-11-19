"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import useEmployment from "@/hooks/433a-form-hooks/useEmployment";
import {
  employmentInitialValues,
  employmentSchema,
} from "@/lib/validation/form433a/employment-section";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useMemo } from "react";
import usePersonalInfo from "@/hooks/433a-form-hooks/usePersonalInfo";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import Required from "@/components/ui/Required";

interface EmploymentSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function EmploymentSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: EmploymentSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { personalInfo, employmentInfo } = useAppSelector(
    (state) => state.form433a
  );
  const { loadingFormData, handleGetPersonalInfo } = usePersonalInfo();
  const {
    loading,
    loadingFormData: loadingEmpFormData,
    handleSaveEmployment,
    handleGetEmploymentInfo,
  } = useEmployment();

  const maritalStatus = useMemo(
    () => personalInfo?.maritalStatus || "unmarried",
    [personalInfo]
  );

  // Initialize form with zodResolver
  const methods = useForm<EmploymentFromSchema>({
    resolver: zodResolver(employmentSchema(maritalStatus)),
    defaultValues: employmentInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: EmploymentFromSchema) => {
    try {
      delete data.maritalStatus;
      console.log("emp info:", data);

      // Data is already validated by Zod through zodResolver
      await handleSaveEmployment(data, caseId);

      // Only proceed to next step if successful
      onNext();
    } catch (error: any) {
      console.error("Error saving employment info:", error);
      toast.error(error.message || "Failed to save employment info");
    }
  };

  useEffect(() => {
    if (!personalInfo) handleGetPersonalInfo(caseId, FORM_433A_SECTIONS[0]);
    if (!employmentInfo) handleGetEmploymentInfo(caseId, FORM_433A_SECTIONS[1]);
  }, []);

  const normalizeEmploymentData = (data: any) => {
    return {
      ...data,
      spouseYearsWithEmployer:
        data.spouseYearsWithEmployer !== undefined &&
        data.spouseYearsWithEmployer !== null &&
        data.spouseYearsWithEmployer !== ""
          ? Number(data.spouseYearsWithEmployer)
          : 0,
      spouseMonthsWithEmployer:
        data.spouseMonthsWithEmployer !== undefined &&
        data.spouseMonthsWithEmployer !== null &&
        data.spouseMonthsWithEmployer !== ""
          ? Number(data.spouseMonthsWithEmployer)
          : 0,
    };
  };

  useEffect(() => {
    if (employmentInfo) {
      const normalizedData = normalizeEmploymentData(employmentInfo);
      reset(normalizedData);
    }
  }, [employmentInfo]);

  if (loadingFormData || loadingEmpFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 2: Employment Information for Wage Earners
          </h2>
          <p className="text-gray-600">
            Complete this section if you or your spouse are wage earners and
            receive a Form W-2. If you or your spouse have self-employment
            income (that is you file a Schedule C, E, F, etc.) instead of, or in
            addition to wage income, you must also complete Business Information
            in Sections 4, 5, and 6.
          </p>
        </div>

        {/* Your Employment */}
        <Card>
          <CardHeader>
            <CardTitle>Your Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Your Employer's Name"
                id="employerName"
                placeholder="Enter employer name"
                required
                {...register("employerName")}
                error={errors.employerName?.message}
              />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Pay Period <Required />
                </Label>
                <RadioGroup
                  value={watch("payPeriod") || "weekly"}
                  onValueChange={(
                    value: "weekly" | "bi-weekly" | "monthly" | "other"
                  ) => setValue("payPeriod", value, { shouldValidate: true })}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="weekly"
                      id="weekly"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="bi-weekly"
                      id="bi-weekly"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="bi-weekly">Bi-weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="monthly"
                      id="monthly"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="other"
                      id="other"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {errors.payPeriod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.payPeriod.message}
                  </p>
                )}
              </div>
            </div>

            <FormInput
              id="employerAddress"
              label="Employer's Address (street, city, state, ZIP code)"
              placeholder="Enter full employer address"
              required
              {...register("employerAddress")}
              error={errors.employerAddress?.message}
            />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Do you have an ownership interest in this business? <Required />
              </Label>
              <RadioGroup
                value={watch("hasOwnershipInterest") ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasOwnershipInterest", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="ownership-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="ownership-yes">
                    Yes (also complete and submit Form 433-B)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="ownership-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="ownership-no">No</Label>
                </div>
              </RadioGroup>
              {errors.hasOwnershipInterest && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hasOwnershipInterest.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="jobTitle"
                label="Your Occupation"
                placeholder="Enter your jobTitle"
                required
                {...register("jobTitle")}
                error={errors.jobTitle?.message}
              />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  How long with this employer <Required />
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormInput
                      label=""
                      placeholder="Years"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={2}
                      required
                      {...register("yearsWithEmployer", {
                        setValueAs: (v: any) =>
                          String(v).replace(/[^0-9]/g, ""),
                        onChange: (e: any) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        },
                      })}
                      onInput={(e: any) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      error={errors.yearsWithEmployer?.message}
                    />
                    <Label className="text-xs text-gray-500 mt-1">Years</Label>
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label=""
                      placeholder="Months"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={2}
                      required
                      {...register("monthsWithEmployer", {
                        setValueAs: (v: any) =>
                          String(v).replace(/[^0-9]/g, ""),
                        onChange: (e: any) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        },
                      })}
                      onInput={(e: any) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      error={errors.monthsWithEmployer?.message}
                    />
                    <Label className="text-xs text-gray-500 mt-1">Months</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spouse Employment */}
        {maritalStatus === "married" && (
          <Card>
            <CardHeader>
              <CardTitle>Spouse's Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Spouse's Employer's Name"
                  id="spouseEmployerName"
                  placeholder="Enter spouse's employer name"
                  required
                  {...register("spouseEmployerName")}
                  error={errors.spouseEmployerName?.message}
                />
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Pay Period <Required />
                  </Label>
                  <RadioGroup
                    value={watch("spousePayPeriod") || "weekly"}
                    onValueChange={(
                      value: "weekly" | "bi-weekly" | "monthly" | "other"
                    ) =>
                      setValue("spousePayPeriod", value, {
                        shouldValidate: true,
                      })
                    }
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="weekly"
                        id="spouse-weekly"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="spouse-weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="bi-weekly"
                        id="spouse-bi-weekly"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="spouse-bi-weekly">Bi-weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="monthly"
                        id="spouse-monthly"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="spouse-monthly">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="other"
                        id="spouse-other"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="spouse-other">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.spousePayPeriod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.spousePayPeriod.message}
                    </p>
                  )}
                </div>
              </div>

              <FormInput
                id="spouseEmployerAddress"
                label="Employer's Address (street, city, state, ZIP code)"
                placeholder="Enter spouse's employer address"
                required
                {...register("spouseEmployerAddress")}
                error={errors.spouseEmployerAddress?.message}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Does your spouse have an ownership interest in this business?
                  *
                </Label>
                <RadioGroup
                  value={watch("spouseHasOwnershipInterest") ? "yes" : "no"}
                  onValueChange={(value) =>
                    setValue("spouseHasOwnershipInterest", value === "yes", {
                      shouldValidate: true,
                    })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="spouse-ownership-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="spouse-ownership-yes">
                      Yes (also complete and submit Form 433-B)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="spouse-ownership-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="spouse-ownership-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.spouseHasOwnershipInterest && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.spouseHasOwnershipInterest.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="spouseJobTitle"
                  label="Spouse's Occupation"
                  placeholder="Enter spouse's jobTitle"
                  required
                  {...register("spouseJobTitle")}
                  error={errors.spouseJobTitle?.message}
                />
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    How long with this employer <Required />
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        placeholder="Years"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        required
                        {...register("spouseYearsWithEmployer", {
                          setValueAs: (v: any) =>
                            String(v).replace(/[^0-9]/g, ""),
                          onChange: (e: any) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9]/g, "");
                          },
                        })}
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        error={errors.spouseYearsWithEmployer?.message}
                      />
                      <Label className="text-xs text-gray-500 mt-1">
                        Years
                      </Label>
                    </div>
                    <div className="flex-1">
                      <FormInput
                        label=""
                        placeholder="Months"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        required
                        {...register("spouseMonthsWithEmployer", {
                          setValueAs: (v: any) =>
                            String(v).replace(/[^0-9]/g, ""),
                          onChange: (e: any) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9]/g, "");
                          },
                        })}
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        error={errors.spouseMonthsWithEmployer?.message}
                      />
                      <Label className="text-xs text-gray-500 mt-1">
                        Months
                      </Label>
                    </div>
                  </div>
                </div>
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
