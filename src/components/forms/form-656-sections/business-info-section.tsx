"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider, useWatch } from "react-hook-form";
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
import { formatEIN, formatPhone } from "@/utils/helper";

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
    if (!businessInfo) handleGetBusinessInfo(caseId, FORM_656_SECTIONS[1]);
  }, []);

  useEffect(() => {
    if (businessInfo) {
      reset(businessInfo);
    }
  }, [businessInfo]);

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
            If your business is a Corporation, Partnership, LLC, or LLP and you
            want to compromise those tax debts, complete this section.
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNewAddressSinceLastFiled"
                {...register("isNewAddressSinceLastFiled")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="isNewAddressSinceLastFiled">
                Is this a new address since your last filed tax return?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateRecordsToThisAddress"
                {...register("updateRecordsToThisAddress")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="updateRecordsToThisAddress">
                If yes, would you like us to update our records to this address?
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Employer Identification Number (EIN)"
                id="employerIdentificationNumber"
                placeholder="XX-XXXXXXX"
                required
                {...register("employerIdentificationNumber", {
                  onChange: (e) =>
                    setValue(
                      "employerIdentificationNumber",
                      formatEIN(e.target.value)
                    ),
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
                  onChange: (e) =>
                    setValue("telephoneNumber", formatPhone(e.target.value)),
                })}
                error={errors.telephoneNumber?.message}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Business Tax Periods (If Your Offer is for Business Tax Debt Only)
            </CardTitle>
            <p className="text-sm text-gray-600">
              List all years/periods owed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Checkbox
                id="businessTaxPeriods.isIndividualIncomeTax"
                {...register("businessTaxPeriods.isIndividualIncomeTax")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="businessTaxPeriods.isIndividualIncomeTax">
                Form 1120 U.S. Corporate Income Tax Return - (e.g., 12-31-2021)
              </Label>
              <FormInput
                label=""
                id="businessTaxPeriods.individualTaxDescription"
                placeholder="12-31-2021"
                className="w-32 inline-block"
                {...register("businessTaxPeriods.individualTaxDescription")}
                error={
                  errors.businessTaxPeriods?.individualTaxDescription?.message
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Checkbox
                id="businessTaxPeriods.isEmployerQuarterlyTax"
                {...register("businessTaxPeriods.isEmployerQuarterlyTax")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="businessTaxPeriods.isEmployerQuarterlyTax">
                Form 941 Employer's Quarterly Federal Tax Return - (e.g.,
                03-31-2021)
              </Label>
              <FormInput
                label=""
                id="businessTaxPeriods.quarterlyPeriods"
                placeholder="03-31-2021"
                className="w-64 inline-block"
                {...register("businessTaxPeriods.quarterlyPeriods")}
                error={errors.businessTaxPeriods?.quarterlyPeriods?.message}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Checkbox
                id="businessTaxPeriods.isEmployerAnnualFUTATax"
                {...register("businessTaxPeriods.isEmployerAnnualFUTATax")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="businessTaxPeriods.isEmployerAnnualFUTATax">
                Form 940 Employer's Annual Federal Unemployment (FUTA) Tax
                Return - (e.g., 12-31-2021)
              </Label>
              <FormInput
                label=""
                id="businessTaxPeriods.annualYears"
                placeholder="12-31-2021"
                className="w-32 inline-block"
                {...register("businessTaxPeriods.annualYears")}
                error={errors.businessTaxPeriods?.annualYears?.message}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Checkbox
                id="businessTaxPeriods.isOtherFederalTax"
                {...register("businessTaxPeriods.isOtherFederalTax")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="businessTaxPeriods.isOtherFederalTax">
                Other Federal Tax(es) [specify type(s) and period(s)]
              </Label>
              <FormInput
                label=""
                id="businessTaxPeriods.otherTaxDescription"
                placeholder="Specify type(s) and period(s)"
                className="w-64 inline-block"
                {...register("businessTaxPeriods.otherTaxDescription")}
                error={errors.businessTaxPeriods?.otherTaxDescription?.message}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label>
                Note: If you need more space, use attachment and title it
                &quot;Attachment to Form 656 dated&quot;
              </Label>
              <FormInput
                label=""
                id="businessTaxPeriods.attachmentToForm656Dated"
                placeholder=""
                className="w-32 inline-block"
                {...register("businessTaxPeriods.attachmentToForm656Dated")}
                error={
                  errors.businessTaxPeriods?.attachmentToForm656Dated?.message
                }
              />
              <Label>. Make sure to sign and date the attachment.</Label>
            </div>

            {errors.businessTaxPeriods && (
              <p className="text-red-600 text-sm">
                {errors.businessTaxPeriods.message}
              </p>
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
