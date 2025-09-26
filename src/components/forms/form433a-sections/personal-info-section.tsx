"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";

interface PersonalInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function PersonalInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  validateStep,
}: PersonalInfoSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<FormData433A>();

  const { fields, append, remove } = useFieldArray({
    name: "householdMembers",
  });

  const maritalStatus = watch("maritalStatus");
  const homeOwnership = watch("homeOwnership");

  const addHouseholdMember = () => {
    append({
      name: "",
      age: "",
      relationship: "",
      claimedAsDependent: false,
      contributesToIncome: false,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 1: Personal and Household Information
        </h2>
        <p className="text-gray-600">
          Provide your basic personal information and details about your
          household.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Last Name"
              id="lastName"
              required
              {...register("lastName")}
              error={errors.lastName?.message}
            />
            <FormInput
              label="First Name"
              id="firstName"
              required
              {...register("firstName")}
              error={errors.firstName?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Date of Birth (mm/dd/yyyy)"
              id="dateOfBirth"
              type="date"
              required
              {...register("dateOfBirth")}
              error={errors.dateOfBirth?.message}
            />
            <FormInput
              label="Social Security Number or ITIN"
              id="ssn"
              placeholder="XXX-XX-XXXX"
              required
              {...register("ssn")}
              error={errors.ssn?.message}
            />
          </div>

          <FormField
            label="Marital Status"
            id="maritalStatus"
            required
            error={errors.maritalStatus?.message}
          >
            <RadioGroup
              value={maritalStatus}
              onValueChange={(value: "unmarried" | "married") =>
                setValue("maritalStatus", value)
              }
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="unmarried"
                  id="unmarried"
                  className="text-[#22b573]"
                />
                <Label htmlFor="unmarried">Unmarried</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="married"
                  id="married"
                  className="text-[#22b573]"
                />
                <Label htmlFor="married">Married</Label>
              </div>
            </RadioGroup>
          </FormField>

          {maritalStatus === "married" && (
            <FormInput
              label="Date of Marriage (mm/dd/yyyy)"
              id="marriageDate"
              type="date"
              required
              {...register("marriageDate")}
              error={errors.marriageDate?.message}
              className="max-w-md"
            />
          )}

          <FormInput
            label="Home Physical Address (street, city, state, ZIP code)"
            id="homeAddress"
            required
            {...register("homeAddress")}
            error={errors.homeAddress?.message}
          />

          <FormField
            label="Do you"
            id="homeOwnership"
            required
            error={errors.homeOwnership?.message}
          >
            <RadioGroup
              value={homeOwnership}
              onValueChange={(value: "own" | "rent" | "other") =>
                setValue("homeOwnership", value)
              }
              className="flex flex-wrap gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="own"
                  id="own"
                  className="text-[#22b573]"
                />
                <Label htmlFor="own">Own your home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="rent"
                  id="rent"
                  className="text-[#22b573]"
                />
                <Label htmlFor="rent">Rent</Label>
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

            {homeOwnership === "other" && (
              <div className="mt-3">
                <FormInput
                  label=""
                  id="homeOwnershipOther"
                  placeholder="Specify (e.g., share rent, live with relative, etc.)"
                  required
                  {...register("homeOwnershipOther")}
                  error={errors.homeOwnershipOther?.message}
                  className="max-w-md"
                />
              </div>
            )}
          </FormField>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="communityProperty"
              {...register("communityPropertyState")}
              className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
            />
            <Label htmlFor="communityProperty" className="text-sm">
              If you were married and lived in AZ, CA, ID, LA, NM, NV, TX, WA or
              WI within the last ten years check here
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="County of Residence"
              id="county"
              required
              {...register("county")}
              error={errors.county?.message}
            />
            <FormInput
              label="Primary Phone"
              id="primaryPhone"
              placeholder="(123) 456-7890"
              required
              {...register("primaryPhone")}
              error={errors.primaryPhone?.message}
            />
            <FormInput
              label="Secondary Phone"
              id="secondaryPhone"
              placeholder="(123) 456-7890"
              {...register("secondaryPhone")}
              error={errors.secondaryPhone?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="FAX Number"
              id="faxNumber"
              placeholder="(123) 456-7890"
              {...register("faxNumber")}
              error={errors.faxNumber?.message}
            />
            <FormInput
              label="Home Mailing Address (if different from above or post office box number)"
              id="mailingAddress"
              {...register("mailingAddress")}
              error={errors.mailingAddress?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Spouse Information */}
      {maritalStatus === "married" && (
        <Card>
          <CardHeader>
            <CardTitle>Provide information about your spouse.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Spouse's Last Name"
                id="spouseLastName"
                required
                {...register("spouseLastName")}
                error={errors.spouseLastName?.message}
              />
              <FormInput
                label="Spouse's First Name"
                id="spouseFirstName"
                required
                {...register("spouseFirstName")}
                error={errors.spouseFirstName?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Date of Birth (mm/dd/yyyy)"
                id="spouseDateOfBirth"
                type="date"
                required
                {...register("spouseDateOfBirth")}
                error={errors.spouseDateOfBirth?.message}
              />
              <FormInput
                label="Social Security Number"
                id="spouseSSN"
                placeholder="XXX-XX-XXXX"
                required
                {...register("spouseSSN")}
                error={errors.spouseSSN?.message}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Household Members */}
      <Card>
        <CardHeader>
          <CardTitle>Household Members and Dependents</CardTitle>
          <p className="text-sm text-gray-600">
            Provide information for all other persons in the household or
            claimed as a dependent.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Household Member {index + 1}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Name"
                  id={`householdMembers.${index}.name`}
                  required
                  {...register(`householdMembers.${index}.name`)}
                  error={errors.householdMembers?.[index]?.name?.message}
                />
                <FormInput
                  label="Age"
                  id={`householdMembers.${index}.age`}
                  required
                  {...register(`householdMembers.${index}.age`)}
                  error={errors.householdMembers?.[index]?.age?.message}
                />
                <FormInput
                  label="Relationship"
                  id={`householdMembers.${index}.relationship`}
                  required
                  {...register(`householdMembers.${index}.relationship`)}
                  error={
                    errors.householdMembers?.[index]?.relationship?.message
                  }
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-dependent-${index}`}
                    {...register(
                      `householdMembers.${index}.claimedAsDependent`
                    )}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                  <Label
                    htmlFor={`member-dependent-${index}`}
                    className="text-sm"
                  >
                    Claimed as a dependent on your Form 1040
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-income-${index}`}
                    {...register(
                      `householdMembers.${index}.contributesToIncome`
                    )}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                  <Label htmlFor={`member-income-${index}`} className="text-sm">
                    Contributes to household income
                  </Label>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addHouseholdMember}
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Household Member
          </Button>
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
