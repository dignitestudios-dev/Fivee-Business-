"use client";

import { useFormContext } from "react-hook-form";
import { FormNavigation } from "./form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmploymentSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function EmploymentSection({
  onNext,
  onPrevious,
  onSubmit,
  currentStep,
  totalSteps,
  validateStep,
}: EmploymentSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<FormData433A>();

  const maritalStatus = watch("maritalStatus");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 2: Employment Information for Wage Earners
        </h2>
        <p className="text-gray-600">
          Complete this section if you or your spouse are wage earners and
          receive a Form W-2.
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
                Pay Period *
              </Label>
              <RadioGroup
                value={watch("payPeriod") || "weekly"}
                onValueChange={(
                  value: "weekly" | "bi-weekly" | "monthly" | "other"
                ) => setValue("payPeriod", value)}
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
              Do you have an ownership interest in this business? *
            </Label>
            <RadioGroup
              value={watch("ownershipInterest") ? "yes" : "no"}
              onValueChange={(value) =>
                setValue("ownershipInterest", value === "yes")
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="occupation"
              label="Your Occupation"
              placeholder="Enter your occupation"
              required
              {...register("occupation")}
              error={errors.occupation?.message}
            />
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                How long with this employer *
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormInput
                    label=""
                    name="employmentYears"
                    placeholder="Years"
                    type="number"
                    min="0"
                    required
                  />
                  <Label className="text-xs text-gray-500 mt-1">Years</Label>
                </div>
                <div className="flex-1">
                  <FormInput
                    label=""
                    name="employmentMonths"
                    placeholder="Months"
                    type="number"
                    min="0"
                    max="11"
                    required
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
                name="spouseEmployerName"
                label="Spouse's Employer's Name"
                placeholder="Enter spouse's employer name"
                required
              />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Pay Period *
                </Label>
                <RadioGroup
                  value={watch("spousePayPeriod") || "weekly"}
                  onValueChange={(
                    value: "weekly" | "bi-weekly" | "monthly" | "other"
                  ) => setValue("spousePayPeriod", value)}
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
              </div>
            </div>

            <FormInput
              name="spouseEmployerAddress"
              label="Employer's Address (street, city, state, ZIP code)"
              placeholder="Enter spouse's employer address"
              required
            />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Does your spouse have an ownership interest in this business? *
              </Label>
              <RadioGroup
                value={watch("spouseOwnershipInterest") ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("spouseOwnershipInterest", value === "yes")
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="spouseOccupation"
                label="Spouse's Occupation"
                placeholder="Enter spouse's occupation"
                required
              />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  How long with this employer *
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormInput
                      label=""
                      name="spouseEmploymentYears"
                      placeholder="Years"
                      type="number"
                      min="0"
                      required
                    />
                    <Label className="text-xs text-gray-500 mt-1">Years</Label>
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label=""
                      name="spouseEmploymentMonths"
                      placeholder="Months"
                      type="number"
                      min="0"
                      max="11"
                      required
                    />
                    <Label className="text-xs text-gray-500 mt-1">Months</Label>
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
        onNext={onNext}
        validateStep={validateStep}
      />
    </div>
  );
}
