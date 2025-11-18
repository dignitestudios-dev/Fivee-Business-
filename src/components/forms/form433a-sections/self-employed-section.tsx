"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import {
  selfEmployedInitialValues,
  selfEmployedSchema,
} from "@/lib/validation/form433a/self-employed-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import useSelfEmployed from "@/hooks/433a-form-hooks/useSelfEmployed";
import { formatPhone, formatEIN } from "@/utils/helper";

interface SelfEmployedSectionProps {
  onNext: (employmentStatus?: string) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function SelfEmployedSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: SelfEmployedSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { selfEmployedInfo } = useAppSelector((state) => state.form433a);
  const {
    loading,
    loadingFormData,
    handleSaveSelfEmployedInfo,
    handleGetSelfEmployedInfo,
  } = useSelfEmployed();

  const methods = useForm<SelfEmployedFormSchema>({
    resolver: zodResolver(selfEmployedSchema),
    defaultValues: selfEmployedInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: SelfEmployedFormSchema) => {
    try {
      await handleSaveSelfEmployedInfo(data, caseId);
      if (data.isSelfEmployed) {
        onNext();
      } else {
        onNext("self");
      }
    } catch (error: any) {
      console.error("Error saving self-employed info:", error);
      toast.error(error.message || "Failed to save self-employed info");
    }
  };

  const isSelfEmployed = watch("isSelfEmployed");
  const isSoleProprietorship = watch("isSoleProprietorship");
  const hasOtherBusinessInterests = watch("hasOtherBusinessInterests");

  useEffect(() => {
    if (isSelfEmployed === undefined) {
      setValue("isSelfEmployed", false);
    }
    if (isSoleProprietorship === undefined) {
      setValue("isSoleProprietorship", false);
    }
    if (hasOtherBusinessInterests === undefined) {
      setValue("hasOtherBusinessInterests", false);
    }
  }, [isSelfEmployed, isSoleProprietorship, hasOtherBusinessInterests]);

  useEffect(() => {
    if (!selfEmployedInfo)
      handleGetSelfEmployedInfo(caseId, FORM_433A_SECTIONS[3]);
  }, []);

  useEffect(() => {
    if (selfEmployedInfo) {
      reset(selfEmployedInfo);
    }
  }, [selfEmployedInfo, reset]);

  // For field array, add control:
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherBusinessInterests",
  });

  // Remove the useEffect for setting defaults

  // Change addOtherBusiness to include otherBusinessTypeDescription:
  const addOtherBusiness = () => {
    append({
      ownershipPercentage: 0,
      title: "",
      businessAddress: "",
      businessName: "",
      businessTelephone: "",
      employerIdentificationNumber: "",
      businessType: "",
      otherBusinessTypeDescription: "",
    });
  };

  // Add before return:
  if (loadingFormData) {
    return <FormLoader />;
  }

  // Wrap the return content with:
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 4: Self-Employed Information
          </h2>
          <p className="text-gray-600">
            If you or your spouse are self-employed (e.g., files Schedule(s) C,
            E, F, etc.), complete this section.
          </p>
        </div>

        <FormField
          label="Are you or your spouse self-employed?"
          id="isSelfEmployed"
          error={errors.isSelfEmployed?.message}
        >
          <RadioGroup
            value={isSelfEmployed ? "yes" : "no"}
            onValueChange={(value: "yes" | "no") =>
              setValue("isSelfEmployed", value === "yes")
            }
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="self-employed-yes"
                className="text-[#22b573]"
              />
              <Label htmlFor="self-employed-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="self-employed-no"
                className="text-[#22b573]"
              />
              <Label htmlFor="self-employed-no">No</Label>
            </div>
          </RadioGroup>
        </FormField>

        {isSelfEmployed && (
          <>
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  label="Is your business a sole proprietorship?"
                  id="isSoleProprietorship"
                  error={errors.isSoleProprietorship?.message}
                >
                  <RadioGroup
                    value={isSoleProprietorship ? "yes" : "no"}
                    onValueChange={(value: "yes" | "no") =>
                      setValue("isSoleProprietorship", value === "yes")
                    }
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id="sole-prop-yes"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="sole-prop-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no"
                        id="sole-prop-no"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="sole-prop-no">No</Label>
                    </div>
                  </RadioGroup>
                </FormField>

                <FormInput
                  label="Name of Business"
                  required
                  id="businessName"
                  {...register("businessName")}
                  error={errors.businessName?.message}
                />

                <FormInput
                  label="Address of Business (if other than personal residence)"
                  id="businessAddress"
                  {...register("businessAddress")}
                  error={errors.businessAddress?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormInput
                    label="Business Telephone Number"
                    required
                    id="businessTelephone"
                    {...register("businessTelephone", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("businessTelephone", formatPhone(e.target.value)),
                    })}
                    error={errors.businessTelephone?.message}
                  />
                  <FormInput
                    label="Employer Identification Number"
                    required
                    id="employerIdentificationNumber"
                    placeholder="XX-XXXXXXX"
                    {...register("employerIdentificationNumber", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue(
                          "employerIdentificationNumber",
                          formatEIN(e.target.value)
                        ),
                    })}
                    error={errors.employerIdentificationNumber?.message}
                  />
                  <FormInput
                    label="Business Website Address"
                    id="businessWebsite"
                    placeholder="https://"
                    {...register("businessWebsite", {
                      pattern: {
                        value: /^(https?:\/\/).+/i,
                        message: "Enter a valid URL beginning with http:// or https://",
                      },
                    })}
                    error={errors.businessWebsite?.message}
                  />
                  <FormInput
                    label="Trade Name or DBA"
                    id="tradeName"
                    required
                    {...register("tradeName")}
                    error={errors.tradeName?.message}
                  />
                </div>

                <FormInput
                  label="Description of Business"
                  required
                  id="businessDescription"
                  {...register("businessDescription")}
                  error={errors.businessDescription?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Total Number of Employees"
                    required
                    id="totalEmployees"
                    type="text"
                    inputMode="numeric"
                    pattern="^[0-9]*$"
                    placeholder="0"
                    {...register("totalEmployees", {
                      valueAsNumber: true,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                      },
                    })}
                    error={errors.totalEmployees?.message}
                  />
                  <FormInput
                    label="Frequency of Tax Deposits"
                    required
                    id="taxDepositFrequency"
                    placeholder="Monthly, Quarterly, etc."
                    {...register("taxDepositFrequency")}
                    error={errors.taxDepositFrequency?.message}
                  />
                  <FormInput
                    label="Average Gross Monthly Payroll ($)"
                    required
                    id="averageGrossMonthlyPayroll"
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    placeholder="0"
                    {...register("averageGrossMonthlyPayroll", {
                      setValueAs: (v) =>
                        v === "" ? 0 : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        // allow only numbers and decimal point
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                      min: { value: 0, message: "Gross cannot be negative" },
                    })}
                    error={errors.averageGrossMonthlyPayroll?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other Business Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Other Business Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  label="Do you or your spouse have any other business interests? Include any interest in an LLC, LLP, corporation, partnership, etc."
                  id="hasOtherBusinessInterests"
                  error={errors.hasOtherBusinessInterests?.message}
                >
                  <RadioGroup
                    value={hasOtherBusinessInterests ? "yes" : "no"}
                    onValueChange={(value: "yes" | "no") =>
                      setValue("hasOtherBusinessInterests", value === "yes")
                    }
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id="other-business-yes"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="other-business-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no"
                        id="other-business-no"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="other-business-no">No</Label>
                    </div>
                  </RadioGroup>
                </FormField>

                {hasOtherBusinessInterests && (
                  <>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border border-gray-200 rounded-lg space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900">
                            Other Business Interest {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Percentage of Ownership (%)"
                            required
                            id={`otherBusinessInterests.${index}.ownershipPercentage`}
                            type="text"
                            inputMode="numeric"
                            pattern="^[0-9]*$"
                            max={100}
                            min={0}
                            {...register(
                              `otherBusinessInterests.${index}.ownershipPercentage`,
                              {
                                required: "Ownership percentage is required",
                                min: {
                                  value: 0,
                                  message: "Percentage cannot be less than 0",
                                },
                                max: {
                                  value: 100,
                                  message: "Percentage cannot exceed 100",
                                },
                                valueAsNumber: true, // makes sure value is treated as a number
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                                },
                              }
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]
                                ?.ownershipPercentage?.message
                            }
                          />

                          <FormInput
                            label="Title"
                            required
                            id={`otherBusinessInterests.${index}.title`}
                            {...register(
                              `otherBusinessInterests.${index}.title`
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]?.title
                                ?.message
                            }
                          />
                        </div>

                        <FormInput
                          label="Business Address (street, city, state, ZIP code)"
                          required
                          id={`otherBusinessInterests.${index}.businessAddress`}
                          {...register(
                            `otherBusinessInterests.${index}.businessAddress`
                          )}
                          error={
                            errors.otherBusinessInterests?.[index]
                              ?.businessAddress?.message
                          }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormInput
                            label="Business Name"
                            required
                            id={`otherBusinessInterests.${index}.businessName`}
                            {...register(
                              `otherBusinessInterests.${index}.businessName`
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]
                                ?.businessName?.message
                            }
                          />
                          <FormInput
                            label="Business Telephone Number"
                            required
                            id={`otherBusinessInterests.${index}.businessTelephone`}
                            {...register(
                              `otherBusinessInterests.${index}.businessTelephone`,
                              {
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                  setValue(
                                    `otherBusinessInterests.${index}.businessTelephone`,
                                    formatPhone(e.target.value)
                                  ),
                              }
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]
                                ?.businessTelephone?.message
                            }
                          />
                          <FormInput
                            label="Employer Identification Number"
                            required
                            id={`otherBusinessInterests.${index}.employerIdentificationNumber`}
                            placeholder="XX-XXXXXXX"
                            {...register(
                              `otherBusinessInterests.${index}.employerIdentificationNumber`,
                              {
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                  setValue(
                                    `otherBusinessInterests.${index}.employerIdentificationNumber`,
                                    formatEIN(e.target.value)
                                  ),
                              }
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]
                                ?.employerIdentificationNumber?.message
                            }
                          />
                        </div>

                        <FormField
                          label="Type of Business"
                          id={`otherBusinessInterests.${index}.businessType`}
                          error={
                            errors.otherBusinessInterests?.[index]?.businessType
                              ?.message
                          }
                        >
                          <RadioGroup
                            value={watch(
                              `otherBusinessInterests.${index}.businessType`
                            )}
                            onValueChange={(value) =>
                              setValue(
                                `otherBusinessInterests.${index}.businessType`,
                                value
                              )
                            }
                            className="flex flex-wrap gap-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="partnership"
                                id={`business-partnership-${index}`}
                                className="text-[#22b573]"
                              />
                              <Label htmlFor={`business-partnership-${index}`}>
                                Partnership
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="llc"
                                id={`business-llc-${index}`}
                                className="text-[#22b573]"
                              />
                              <Label htmlFor={`business-llc-${index}`}>
                                LLC
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="corporation"
                                id={`business-corporation-${index}`}
                                className="text-[#22b573]"
                              />
                              <Label htmlFor={`business-corporation-${index}`}>
                                Corporation
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="other"
                                id={`business-other-${index}`}
                                className="text-[#22b573]"
                              />
                              <Label htmlFor={`business-other-${index}`}>
                                Other
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormField>

                        {watch(
                          `otherBusinessInterests.${index}.businessType`
                        ) === "other" && (
                          <FormInput
                            label="Other Business Type Description"
                            required
                            id={`otherBusinessInterests.${index}.otherBusinessTypeDescription`}
                            {...register(
                              `otherBusinessInterests.${index}.otherBusinessTypeDescription`
                            )}
                            error={
                              errors.otherBusinessInterests?.[index]
                                ?.otherBusinessTypeDescription?.message
                            }
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOtherBusiness}
                      className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Other Business Interest
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </>
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
