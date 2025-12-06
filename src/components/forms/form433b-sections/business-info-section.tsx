"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation"; // Reuse
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useBusinessInfo from "@/hooks/433b-form-hooks/useBusinessInfo"; // We'll create this
import toast from "react-hot-toast";
import {
  businessInfoInitialValues,
  businessInfoSchema,
} from "@/lib/validation/form433b/business-info-section"; // We'll create this
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";
import { formatPhone } from "@/utils/helper";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";

interface BusinessInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function BusinessInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: BusinessInfoSectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessInformation } = useAppSelector((state) => state.form433b);
  const {
    loading,
    loadingFormData,
    handleSaveBusinessInfo,
    handleGetBusinessInfo,
  } = useBusinessInfo();

  // Initialize form with zodResolver
  const methods = useForm<BusinessInfoFormSchema>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: businessInfoInitialValues,
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
  console.log("errors: ", errors);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "partners",
  });

  const doesOutsourcePayroll = watch("doesOutsourcePayroll");

  const formatEIN = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, "");
    const numbersOnly = cleaned.replace(/-/g, "");
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else {
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 9)}`;
    }
  };

  const formatSSN = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, "");
    const numbersOnly = cleaned.replace(/-/g, "");
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

  const handleEINInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setValue("employerIdentificationNumber", formatted, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: BusinessInfoFormSchema) => {
    try {
      if (data.doesOutsourcePayroll === false) {
        delete data.payrollProviderName;
        delete data.payrollProviderAddress;
      }

      console.log("handleSaveBusinessInfo going to runs");

      await handleSaveBusinessInfo(data, caseId);

      onNext();
    } catch (error: any) {
      console.error("Error saving business info:", error);
      showError(error.message || "Failed to save business info", "Business Info Error");
    }
  };

  useEffect(() => {
    if (!businessInformation)
      handleGetBusinessInfo(caseId, FORM_433B_SECTIONS[0]);
  }, []);

  useEffect(() => {
    if (businessInformation) {
      reset(businessInformation);
    }
  }, [businessInformation]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  const addPartner = () => {
    append({
      lastName: "",
      firstName: "",
      title: "",
      percentOwnership: 0,
      annualSalary: 0,
      socialSecurityNumber: "",
      homeAddress: "",
      primaryPhone: "",
      secondaryPhone: "",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 1: Business Information
          </h2>
          <p className="text-gray-600">
            Provide basic business information (domestic and foreign).
          </p>
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Business Name"
                id="businessName"
                required
                {...register("businessName")}
                error={errors.businessName?.message}
              />
              <FormInput
                label="Employer Identification Number (EIN)"
                id="employerIdentificationNumber"
                placeholder="XX-XXXXXXX"
                required
                {...register("employerIdentificationNumber", {
                  onChange: handleEINInput,
                })}
                error={errors.employerIdentificationNumber?.message}
              />
            </div>

            <FormInput
              label="Business Physical Address (street, city, state, ZIP code)"
              id="businessPhysicalAddress"
              required
              {...register("businessPhysicalAddress")}
              error={errors.businessPhysicalAddress?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="County of Business Location"
                id="countyOfBusinessLocation"
                required
                {...register("countyOfBusinessLocation")}
                error={errors.countyOfBusinessLocation?.message}
              />
              <FormInput
                label="Description of Business"
                id="descriptionOfBusiness"
                required
                {...register("descriptionOfBusiness")}
                error={errors.descriptionOfBusiness?.message}
              />
            </div>

            <FormInput
              label="DBA or Trade Name"
              id="dbaTradeName"
              required
              {...register("dbaTradeName")}
              error={errors.dbaTradeName?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <FormInput
                label="Business Website Address"
                id="businessWebsiteAddress"
                {...register("businessWebsiteAddress")}
                error={errors.businessWebsiteAddress?.message}
              />
            </div>

            <FormInput
              label="Business Mailing Address (if different or P.O. box)"
              id="businessMailingAddress"
              {...register("businessMailingAddress")}
              error={errors.businessMailingAddress?.message}
            />

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

            <FormField
              label="Federal Contractor"
              id="federalContractor"
              required
              error={errors.federalContractor?.message}
            >
              <RadioGroup
                value={watch("federalContractor") ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("federalContractor", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="federal-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="federal-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="federal-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="federal-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Total Number of Employees"
                id="totalNumberOfEmployees"
                type="number"
                required
                {...register("totalNumberOfEmployees")}
                error={errors.totalNumberOfEmployees?.message}
              />
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isSoleEmployee"
                  {...register("isSoleEmployee")}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                />
                <Label htmlFor="isSoleEmployee" className="text-sm">
                  Check here if you are the only employee
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Frequency of Tax Deposits"
                id="frequencyOfTaxDeposits"
                type="number"
                required
                {...register("frequencyOfTaxDeposits")}
                error={errors.frequencyOfTaxDeposits?.message}
              />
              <FormInput
                label="Average Gross Monthly Payroll ($)"
                id="averageGrossMonthlyPayroll"
                type="number"
                required
                {...register("averageGrossMonthlyPayroll")}
                error={errors.averageGrossMonthlyPayroll?.message}
              />
            </div>

            <FormField
              label="Does the business outsource its payroll processing and tax return preparation for a fee?"
              id="doesOutsourcePayroll"
              required
              error={errors.doesOutsourcePayroll?.message}
            >
              <RadioGroup
                value={doesOutsourcePayroll ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("doesOutsourcePayroll", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="outsource-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="outsource-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="outsource-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="outsource-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {doesOutsourcePayroll && (
              <div className="space-y-4">
                <FormInput
                  label="Provider Name"
                  id="payrollProviderName"
                  required
                  {...register("payrollProviderName")}
                  error={errors.payrollProviderName?.message}
                />
                <FormInput
                  label="Provider Address (street, city, state, ZIP code)"
                  id="payrollProviderAddress"
                  required
                  {...register("payrollProviderAddress")}
                  error={errors.payrollProviderAddress?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partners (Partners, Officers, etc.) */}
        <Card>
          <CardHeader>
            <CardTitle>
              Partners, Officers, LLC Members, Major Shareholders
            </CardTitle>
            <p className="text-sm text-gray-600">
              Provide information about all partners, officers, LLC members,
              major shareholders (domestic and foreign), etc.
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
                    Partner {index + 1}
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
                    label="Last Name"
                    id={`partners.${index}.lastName`}
                    required
                    {...register(`partners.${index}.lastName`)}
                    error={errors.partners?.[index]?.lastName?.message}
                  />
                  <FormInput
                    label="First Name"
                    id={`partners.${index}.firstName`}
                    required
                    {...register(`partners.${index}.firstName`)}
                    error={errors.partners?.[index]?.firstName?.message}
                  />
                  <FormInput
                    label="Title"
                    id={`partners.${index}.title`}
                    required
                    {...register(`partners.${index}.title`)}
                    error={errors.partners?.[index]?.title?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Percent Ownership"
                    id={`partners.${index}.percentOwnership`}
                    type="number"
                    required
                    {...register(`partners.${index}.percentOwnership`)}
                    error={errors.partners?.[index]?.percentOwnership?.message}
                  />
                  <FormInput
                    label="Annual Salary"
                    id={`partners.${index}.annualSalary`}
                    type="number"
                    required
                    {...register(`partners.${index}.annualSalary`)}
                    error={errors.partners?.[index]?.annualSalary?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Social Security Number"
                    id={`partners.${index}.socialSecurityNumber`}
                    placeholder="XXX-XX-XXXX"
                    required
                    {...register(`partners.${index}.socialSecurityNumber`, {
                      onChange: (e) => {
                        const formatted = formatSSN(e.target.value);
                        setValue(
                          `partners.${index}.socialSecurityNumber`,
                          formatted,
                          {
                            shouldValidate: true,
                          }
                        );
                      },
                    })}
                    error={
                      errors.partners?.[index]?.socialSecurityNumber?.message
                    }
                  />
                </div>

                <FormInput
                  label="Home Address (street, city, state, ZIP code)"
                  id={`partners.${index}.homeAddress`}
                  required
                  {...register(`partners.${index}.homeAddress`)}
                  error={errors.partners?.[index]?.homeAddress?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Primary Phone"
                    id={`partners.${index}.primaryPhone`}
                    placeholder="(123) 456-7890"
                    required
                    {...register(`partners.${index}.primaryPhone`, {
                      onChange: (e) =>
                        setValue(
                          `partners.${index}.primaryPhone`,
                          formatPhone(e.target.value)
                        ),
                    })}
                    error={errors.partners?.[index]?.primaryPhone?.message}
                  />
                  <FormInput
                    label="Secondary Phone"
                    id={`partners.${index}.secondaryPhone`}
                    placeholder="(123) 456-7890"
                    {...register(`partners.${index}.secondaryPhone`, {
                      onChange: (e) =>
                        setValue(
                          `partners.${index}.secondaryPhone`,
                          formatPhone(e.target.value)
                        ),
                    })}
                    error={errors.partners?.[index]?.secondaryPhone?.message}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPartner}
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
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
