"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";

interface SelfEmployedSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function SelfEmployedSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  validateStep,
}: SelfEmployedSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<FormData433A>();

  const { fields, append, remove } = useFieldArray({
    name: "otherBusinesses",
  });

  const isSoleProprietorship = watch("isSoleProprietorship");
  const hasOtherBusinessInterests = watch("hasOtherBusinessInterests");

  const addOtherBusiness = () => {
    append({
      percentageOwnership: "",
      title: "",
      businessAddress: "",
      businessName: "",
      businessTelephone: "",
      ein: "",
      businessType: "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 4: Self-Employed Information
        </h2>
        <p className="text-gray-600">
          If you or your spouse are self-employed (e.g., files Schedule(s) C, E,
          F, etc.), complete this section.
        </p>
      </div>

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
              id="businessTelephone"
              {...register("businessTelephone")}
              error={errors.businessTelephone?.message}
            />
            <FormInput
              label="Employer Identification Number"
              id="ein"
              placeholder="XX-XXXXXXX"
              {...register("ein")}
              error={errors.ein?.message}
            />
            <FormInput
              label="Business Website Address"
              id="businessWebsite"
              placeholder="https://"
              {...register("businessWebsite")}
              error={errors.businessWebsite?.message}
            />
            <FormInput
              label="Trade Name or DBA"
              id="tradeName"
              {...register("tradeName")}
              error={errors.tradeName?.message}
            />
          </div>

          <FormInput
            label="Description of Business"
            id="businessDescription"
            {...register("businessDescription")}
            error={errors.businessDescription?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Total Number of Employees"
              id="totalEmployees"
              type="number"
              placeholder="0"
              {...register("totalEmployees")}
              error={errors.totalEmployees?.message}
            />
            <FormInput
              label="Frequency of Tax Deposits"
              id="taxDepositFrequency"
              placeholder="Monthly, Quarterly, etc."
              {...register("taxDepositFrequency")}
              error={errors.taxDepositFrequency?.message}
            />
            <FormInput
              label="Average Gross Monthly Payroll ($)"
              id="avgGrossMonthlyPayroll"
              type="number"
              placeholder="0"
              {...register("avgGrossMonthlyPayroll")}
              error={errors.avgGrossMonthlyPayroll?.message}
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
                      id={`otherBusinesses.${index}.percentageOwnership`}
                      type="number"
                      {...register(
                        `otherBusinesses.${index}.percentageOwnership`
                      )}
                      error={
                        errors.otherBusinesses?.[index]?.percentageOwnership
                          ?.message
                      }
                    />
                    <FormInput
                      label="Title"
                      id={`otherBusinesses.${index}.title`}
                      {...register(`otherBusinesses.${index}.title`)}
                      error={errors.otherBusinesses?.[index]?.title?.message}
                    />
                  </div>

                  <FormInput
                    label="Business Address (street, city, state, ZIP code)"
                    id={`otherBusinesses.${index}.businessAddress`}
                    {...register(`otherBusinesses.${index}.businessAddress`)}
                    error={
                      errors.otherBusinesses?.[index]?.businessAddress?.message
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="Business Name"
                      id={`otherBusinesses.${index}.businessName`}
                      {...register(`otherBusinesses.${index}.businessName`)}
                      error={
                        errors.otherBusinesses?.[index]?.businessName?.message
                      }
                    />
                    <FormInput
                      label="Business Telephone Number"
                      id={`otherBusinesses.${index}.businessTelephone`}
                      {...register(
                        `otherBusinesses.${index}.businessTelephone`
                      )}
                      error={
                        errors.otherBusinesses?.[index]?.businessTelephone
                          ?.message
                      }
                    />
                    <FormInput
                      label="Employer Identification Number"
                      id={`otherBusinesses.${index}.ein`}
                      placeholder="XX-XXXXXXX"
                      {...register(`otherBusinesses.${index}.ein`)}
                      error={errors.otherBusinesses?.[index]?.ein?.message}
                    />
                  </div>

                  <FormField
                    label="Type of Business"
                    id={`otherBusinesses.${index}.businessType`}
                    error={
                      errors.otherBusinesses?.[index]?.businessType?.message
                    }
                  >
                    <RadioGroup
                      value={watch(`otherBusinesses.${index}.businessType`)}
                      onValueChange={(value) =>
                        setValue(`otherBusinesses.${index}.businessType`, value)
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
                        <Label htmlFor={`business-llc-${index}`}>LLC</Label>
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
                        <Label htmlFor={`business-other-${index}`}>Other</Label>
                      </div>
                    </RadioGroup>
                  </FormField>
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

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
        validateStep={validateStep}
      />
    </div>
  );
}
