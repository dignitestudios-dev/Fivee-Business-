"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import usePersonalInfo from "@/hooks/433a-form-hooks/usePersonalInfo";
import toast from "react-hot-toast";
import {
  personalInfoInitialValues,
  personalInfoSchema,
} from "@/lib/validation/form433a/personal-info-section";
import { useEffect, useMemo } from "react";
import { formatPhone, setCaseId } from "@/utils/helper";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433A_SECTIONS } from "@/lib/constants";

interface PersonalInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PersonalInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PersonalInfoSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { personalInfo } = useAppSelector((state) => state.form433a);
  const {
    loading,
    loadingFormData,
    handleSavePersonalInfo,
    handleGetPersonalInfo,
  } = usePersonalInfo();

  // Initialize form with zodResolver
  const methods = useForm<PersonalInfoFromSchema>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfoInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "householdMembers",
  });

  const maritalStatus = watch("maritalStatus");
  const housingStatus = watch("housingStatus");

  const addHouseholdMember = () => {
    append({
      name: "",
      age: "",
      relationship: "",
      claimedAsDependent: false,
      contributesToIncome: false,
    });
  };

  const formatSSN = (value: string) => {
    // Remove all non-numeric characters except hyphens
    const cleaned = value.replace(/[^0-9-]/g, "");

    // Remove existing hyphens
    const numbersOnly = cleaned.replace(/-/g, "");

    // Format as XXX-XX-XXXX
    if (numbersOnly.length <= 3) {
      return numbersOnly;
    } else if (numbersOnly.length <= 5) {
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        5
      )}-${numbersOnly.slice(5, 9)}`;
    }
  };

  const handleSSNInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const formatted = formatSSN(e.target.value);
    setValue(fieldName, formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: PersonalInfoFromSchema) => {
    try {
      if (data.maritalStatus === "unmarried") {
        delete data.dateOfMarriage;
        delete data.spouseFirstName;
        delete data.spouseLastName;
        delete data.spouseDOB;
        delete data.spouseSSN;
      }

      // Data is already validated by Zod through zodResolver
      await handleSavePersonalInfo(data, caseId);

      // Only proceed to next step if successful
      onNext();
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      toast.error(error.message || "Failed to save personal info");
    }
  };

  useEffect(() => {
    if (!personalInfo) handleGetPersonalInfo(caseId, FORM_433A_SECTIONS[0]);
  }, []);

  useEffect(() => {
    if (personalInfo) {
      reset(personalInfo);
    }
  }, [personalInfo]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                maxLength={20}
                {...register("lastName", {
                  onChange: (e) => {
                    // Remove numbers and unwanted special characters in real-time
                    e.target.value = e.target.value.replace(
                      /[^A-Za-z\s'-]/g,
                      ""
                    );
                  },
                })}
                error={errors.lastName?.message}
              />
              <FormInput
                label="First Name"
                id="firstName"
                required
                maxLength={20}
                {...register("firstName", {
                  onChange: (e) => {
                    // Remove numbers and unwanted special characters in real-time
                    e.target.value = e.target.value.replace(
                      /[^A-Za-z\s'-]/g,
                      ""
                    );
                  },
                })}
                error={errors.firstName?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Date of Birth (mm/dd/yyyy)"
                id="dob"
                type="date"
                required
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                {...register("dob")}
                error={errors.dob?.message}
              />
              <FormInput
                label="Social Security Number or ITIN"
                id="ssnOrItin"
                placeholder="XXX-XX-XXXX"
                required
                {...register("ssnOrItin", {
                  onChange: (e) => handleSSNInput(e, "ssnOrItin"),
                })}
                error={errors.ssnOrItin?.message}
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
                  setValue("maritalStatus", value, { shouldValidate: true })
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
                id="dateOfMarriage"
                type="date"
                required
                {...register("dateOfMarriage")}
                error={errors.dateOfMarriage?.message}
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
              id="housingStatus"
              required
              error={errors.housingStatus?.message}
            >
              <RadioGroup
                value={housingStatus}
                onValueChange={(value: "own" | "rent" | "other") =>
                  setValue("housingStatus", value, { shouldValidate: true })
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

              {housingStatus === "other" && (
                <div className="mt-3">
                  <FormInput
                    label=""
                    id="housingOtherDetails"
                    placeholder="Specify (e.g., share rent, live with relative, etc.)"
                    required
                    {...register("housingOtherDetails")}
                    error={errors.housingOtherDetails?.message}
                    className="max-w-md"
                  />
                </div>
              )}
            </FormField>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="livedInCommunityPropertyStateInLast10Years"
                {...register("livedInCommunityPropertyStateInLast10Years")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label
                htmlFor="livedInCommunityPropertyStateInLast10Years"
                className="text-sm"
              >
                If you were married and lived in AZ, CA, ID, LA, NM, NV, TX, WA
                or WI within the last ten years check here
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="County of Residence"
                id="countyOfResidence"
                required
                {...register("countyOfResidence")}
                error={errors.countyOfResidence?.message}
              />
              <FormInput
                label="Primary Phone"
                id="primaryPhone"
                placeholder="(123) 456-7890"
                required
                {...register("primaryPhone", {
                  onChange: (e) =>
                    setValue("primaryPhone", formatPhone(e.target.value)),
                })}
                error={errors.primaryPhone?.message}
              />
              <FormInput
                label="Secondary Phone"
                id="secondaryPhone"
                placeholder="(123) 456-7890"
                {...register("secondaryPhone", {
                  onChange: (e) =>
                    setValue("secondaryPhone", formatPhone(e.target.value)),
                })}
                error={errors.secondaryPhone?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="FAX Number"
                id="faxNumber"
                placeholder="(123) 456-7890"
                {...register("faxNumber", {
                  onChange: (e) =>
                    setValue("faxNumber", formatPhone(e.target.value)),
                })}
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
                  maxLength={20}
                  {...register("spouseLastName", {
                    onChange: (e) => {
                      // Remove numbers and unwanted special characters in real-time
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z\s'-]/g,
                        ""
                      );
                    },
                  })}
                  error={errors.spouseLastName?.message}
                />
                <FormInput
                  label="Spouse's First Name"
                  id="spouseFirstName"
                  required
                  maxLength={20}
                  {...register("spouseFirstName", {
                    onChange: (e) => {
                      // Remove numbers and unwanted special characters in real-time
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z\s'-]/g,
                        ""
                      );
                    },
                  })}
                  error={errors.spouseFirstName?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Date of Birth (mm/dd/yyyy)"
                  id="spouseDOB"
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  type="date"
                  required
                  {...register("spouseDOB")}
                  error={errors.spouseDOB?.message}
                />
                <FormInput
                  label="Social Security Number"
                  id="spouseSSN"
                  placeholder="XXX-XX-XXXX"
                  required
                  {...register("spouseSSN", {
                    onChange: (e) => handleSSNInput(e, "spouseSSN"),
                  })}
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
              claimed as a dependent.{" "}
              <strong>Maximum of 4 members allowed.</strong>
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Age"
                    required
                    {...register(`householdMembers.${index}.age`, {
                      setValueAs: (v: any) =>
                        v === "" ? 0 : Number(String(v).replace(/[^0-9]/g, "")),
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      },
                    })}
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
                      id={`householdMembers.${index}.claimedAsDependent`}
                      {...register(
                        `householdMembers.${index}.claimedAsDependent`
                      )}
                      className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                    />
                    <Label
                      htmlFor={`householdMembers.${index}.claimedAsDependent`}
                      className="text-sm"
                    >
                      Claimed as a dependent on your Form 1040
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`householdMembers.${index}.contributesToIncome`}
                      {...register(
                        `householdMembers.${index}.contributesToIncome`
                      )}
                      className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                    />
                    <Label
                      htmlFor={`householdMembers.${index}.contributesToIncome`}
                      className="text-sm"
                    >
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
              disabled={fields.length >= 4}
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              {fields.length >= 4
                ? "Maximum 4 members reached"
                : "Add Household Member"}
            </Button>

            {/* Show count indicator */}
            {fields.length > 0 && (
              <div className="text-sm text-gray-500 text-center">
                {fields.length} of 4 members added
              </div>
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
