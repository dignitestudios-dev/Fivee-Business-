"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useBusinessInfo656 from "@/hooks/656-form-hooks/useBusinessInfo656"; 
import toast from "react-hot-toast";
import {
  businessInfoSchema656,
  businessInfoInitialValues,
} from "@/lib/validation/form656/business-info-section"; 
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";

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
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessInfo } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveBusinessInfo,
    handleGetBusinessInfo,
  } = useBusinessInfo656();

  const methods = useForm<BusinessInfoFormSchema>({
    resolver: zodResolver(businessInfoSchema656),
    defaultValues: businessInfoInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "businessTaxPeriods",
  });

  const formatEIN = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, "");
    const numbersOnly = cleaned.replace(/-/g, "");
    if (numbersOnly.length <= 2) return numbersOnly;
    return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 9)}`;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const onSubmit = async (data: BusinessInfoFormSchema) => {
    try {
      await handleSaveBusinessInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving business info:", error);
      toast.error(error.message || "Failed to save business info");
    }
  };

  useEffect(() => {
    if (!businessInfo)
      handleGetBusinessInfo(caseId, FORM_656_SECTIONS[1]);
  }, []);

  useEffect(() => {
    if (businessInfo) {
      reset(businessInfo);
    }
  }, [businessInfo]);

  const addTaxPeriod = () => {
    append({
      taxType: "",
      periodEnding: "",
      businessName: "",
    });
  };

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 2: Business Information
          </h2>
          <p className="text-gray-600">
            If your business is a Corporation, Partnership, LLC, or LLP and you want to compromise those tax debts, complete this section.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              label="Business Name"
              id="businessName"
              required
              {...register("businessName")}
              error={errors.businessName?.message}
            />

            <FormInput
              label="Business Physical Address (street, city, state, ZIP code)"
              id="businessPhysicalAddress"
              required
              {...register("businessPhysicalAddress")}
              error={errors.businessPhysicalAddress?.message}
            />

            <FormInput
              label="Business Mailing Address (street, city, state, ZIP code)"
              id="businessMailingAddress"
              {...register("businessMailingAddress")}
              error={errors.businessMailingAddress?.message}
            />

            <div>
              <Label>Is this a new address since your last filed tax return?</Label>
              <RadioGroup
                value={methods.watch("isNewAddressSinceLastFiled") ? "yes" : "no"}
                onValueChange={(value) => setValue("isNewAddressSinceLastFiled", value === "yes")}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="new-yes" className="text-[#22b573]" />
                  <Label htmlFor="new-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="new-no" className="text-[#22b573]" />
                  <Label htmlFor="new-no">No</Label>
                </div>
              </RadioGroup>
              {errors.isNewAddressSinceLastFiled && <p className="text-red-600 text-sm">{errors.isNewAddressSinceLastFiled.message}</p>}
            </div>

            <div>
              <Label>If yes, would you like us to update our records to this address?</Label>
              <RadioGroup
                value={methods.watch("updateRecordsToThisAddress") ? "yes" : "no"}
                onValueChange={(value) => setValue("updateRecordsToThisAddress", value === "yes")}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="update-yes" className="text-[#22b573]" />
                  <Label htmlFor="update-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="update-no" className="text-[#22b573]" />
                  <Label htmlFor="update-no">No</Label>
                </div>
              </RadioGroup>
              {errors.updateRecordsToThisAddress && <p className="text-red-600 text-sm">{errors.updateRecordsToThisAddress.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Employer Identification Number (EIN)"
                id="employerIdentificationNumber"
                placeholder="XX-XXXXXXX"
                required
                {...register("employerIdentificationNumber", {
                  onChange: (e) => setValue("employerIdentificationNumber", formatEIN(e.target.value)),
                })}
                error={errors.employerIdentificationNumber?.message}
              />
              <FormInput
                label="Name and Title of Primary Contact"
                id="primaryContactNameAndTitle"
                required
                {...register("primaryContactNameAndTitle")}
                error={errors.primaryContactNameAndTitle?.message}
              />
              <FormInput
                label="Telephone Number"
                id="telephoneNumber"
                placeholder="(XXX) XXX-XXXX"
                required
                {...register("telephoneNumber", {
                  onChange: (e) => setValue("telephoneNumber", formatPhone(e.target.value)),
                })}
                error={errors.telephoneNumber?.message}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Tax Periods (If Your Offer is for Business Tax Debt Only)</CardTitle>
            <p className="text-sm text-gray-600">List all years/periods owed.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Tax Period {index + 1}</h4>
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

                <FormInput
                  label="Tax Type (e.g., Form 1120, Form 941, Form 940, Other)"
                  id={`businessTaxPeriods.${index}.taxType`}
                  required
                  {...register(`businessTaxPeriods.${index}.taxType`)}
                  error={errors.businessTaxPeriods?.[index]?.taxType?.message}
                />
                <FormInput
                  label="Period Ending (YYYY-MM-DD)"
                  id={`businessTaxPeriods.${index}.periodEnding`}
                  type="date"
                  required
                  {...register(`businessTaxPeriods.${index}.periodEnding`)}
                  error={errors.businessTaxPeriods?.[index]?.periodEnding?.message}
                />
                <FormInput
                  label="Business Name (if applicable)"
                  id={`businessTaxPeriods.${index}.businessName`}
                  {...register(`businessTaxPeriods.${index}.businessName`)}
                  error={errors.businessTaxPeriods?.[index]?.businessName?.message}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTaxPeriod}
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tax Period
            </Button>
            {errors.businessTaxPeriods && <p className="text-red-600 text-sm">{errors.businessTaxPeriods.message}</p>}
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




