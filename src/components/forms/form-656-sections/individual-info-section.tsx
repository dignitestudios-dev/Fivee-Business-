"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation"; // Reuse
import { FormInput } from "@/components/ui/form-field"; // Adjust if needed; assume it handles label, id, register, error
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useIndividualInfo from "@/hooks/656-form-hooks/useIndividualInfo"; // We'll create this
import toast from "react-hot-toast";
import {
  individualInfoSchema,
  individualInfoInitialValues,
} from "@/lib/validation/form656/individual-info-section"; // We'll create this
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants"; // Adjust or create; e.g. const FORM_656_SECTIONS = ["individualInfo", ...]
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface IndividualInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function IndividualInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: IndividualInfoSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { individualInfo } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveIndividualInfo,
    handleGetIndividualInfo,
  } = useIndividualInfo();

  const methods = useForm<IndividualInfoFormSchema>({
    resolver: zodResolver(individualInfoSchema),
    defaultValues: individualInfoInitialValues,
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

  console.log("Errors in form: ", errors);

  const isJointOffer = useWatch({ control, name: "isJointOffer" });
  // If the user unchecks "isJointOffer", clear spouseTaxpayer so the
  // resolver (zod) does not validate spouse fields that are present but
  // empty. This avoids the issue where default/leftover spouse values cause
  // validation errors when the form is not a joint offer.
  useEffect(() => {
    if (!isJointOffer) {
      setValue("spouseTaxpayer", undefined);
    }
  }, [isJointOffer, setValue]);
  const qualifiesForLowIncome = useWatch({
    control,
    name: "lowIncomeCertification.qualifiesForLowIncome",
  });
  const qualificationBasis = useWatch({
    control,
    name: "lowIncomeCertification.qualificationBasis",
  });
  const familySize = useWatch({
    control,
    name: "lowIncomeCertification.familySize",
  });
  const residenceState = useWatch({
    control,
    name: "lowIncomeCertification.residenceState",
  });
  const adjustedGrossIncome = useWatch({
    control,
    name: "lowIncomeCertification.adjustedGrossIncome",
  });
  const householdMonthlyIncome = useWatch({
    control,
    name: "lowIncomeCertification.householdMonthlyIncome",
  });

  useEffect(() => {
    if (!qualifiesForLowIncome) {
      setValue("lowIncomeCertification.qualificationBasis", undefined);
      setValue("lowIncomeCertification.familySize", undefined);
      setValue("lowIncomeCertification.residenceState", undefined);
      setValue("lowIncomeCertification.adjustedGrossIncome", undefined);
      setValue("lowIncomeCertification.householdMonthlyIncome", undefined);
    }
  }, [qualifiesForLowIncome, setValue]);

  // Format functions
  const formatSSNOrITIN = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, "");
    const numbersOnly = cleaned.replace(/-/g, "");
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 5)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
      3,
      5
    )}-${numbersOnly.slice(5, 9)}`;
  };

  const formatEIN = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, "");
    const numbersOnly = cleaned.replace(/-/g, "");
    if (numbersOnly.length <= 2) return numbersOnly;
    return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 9)}`;
  };

  // Income limits table (hardcoded from form)
  const incomeLimits = {
    contiguous_states: {
      1: 37650,
      2: 51100,
      3: 64550,
      4: 78000,
      5: 91450,
      6: 104900,
      7: 118350,
      8: 131800,
      additional: 13450,
    },
    alaska: {
      1: 47025,
      2: 63850,
      3: 80675,
      4: 97500,
      5: 114325,
      6: 131150,
      7: 147975,
      8: 164800,
      additional: 16825,
    },
    hawaii: {
      1: 43275,
      2: 58750,
      3: 74225,
      4: 89700,
      5: 105175,
      6: 120650,
      7: 136125,
      8: 151600,
      additional: 15475,
    },
  };

  // Calculate income limit
  const getIncomeLimit = (
    state: string | undefined,
    size: number | undefined
  ) => {
    if (!state || !size) return 0;
    const limits = incomeLimits[state as keyof typeof incomeLimits];
    if (!limits) return 0;
    if (size <= 8) {
      return limits[size as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8];
    }
    return limits[8] + (size - 8) * limits.additional;
  };

  const incomeLimit = getIncomeLimit(residenceState, familySize);

  // Calculate if qualifies (for display/warning)
  const doesQualify = () => {
    if (!qualificationBasis) return false;
    if (qualificationBasis === "adjusted_gross_income") {
      return (adjustedGrossIncome ?? 0) <= incomeLimit;
    } else {
      return (householdMonthlyIncome ?? 0) * 12 <= incomeLimit;
    }
  };

  const onSubmit = async (data: IndividualInfoFormSchema) => {
    try {
      // Optional: Clean optional fields
      if (!data.isJointOffer) {
        data.spouseTaxpayer = undefined;
      }
      if (!qualifiesForLowIncome) {
        data.lowIncomeCertification.qualificationBasis = undefined;
        data.lowIncomeCertification.familySize = undefined;
        data.lowIncomeCertification.residenceState = undefined;
        data.lowIncomeCertification.adjustedGrossIncome = undefined;
        data.lowIncomeCertification.householdMonthlyIncome = undefined;
      } else if (qualificationBasis === "adjusted_gross_income") {
        data.lowIncomeCertification.householdMonthlyIncome = undefined;
      } else if (qualificationBasis === "household_monthly_income") {
        data.lowIncomeCertification.adjustedGrossIncome = undefined;
      }

      console.log("Calling handleSaveIndividualInfo...");
      await handleSaveIndividualInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving individual info:", error);
      toast.error(error.message || "Failed to save individual info");
    }
  };

  useEffect(() => {
    if (!individualInfo) handleGetIndividualInfo(caseId, FORM_656_SECTIONS[0]);
  }, []);

  useEffect(() => {
    if (individualInfo) {
      // If the loaded data is not a joint offer, ensure spouseTaxpayer is
      // undefined before resetting the form so the resolver doesn't
      // validate spouse fields unnecessarily.
      const sanitized = { ...individualInfo } as any;
      if (!sanitized.isJointOffer) sanitized.spouseTaxpayer = undefined;
      reset(sanitized);
    }
  }, [individualInfo]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Offer in Compromise Agreement
          </h2>
          <p className="text-gray-600">
            To: Commissioner of Internal Revenue Service
          </p>
          <p className="text-gray-600 mt-2">
            In the following agreement, the pronoun &quot;we&quot; may be
            assumed in place of &quot;I&quot; when there are joint liabilities
            and both parties are signing this agreement.
          </p>
          <p className="text-gray-600 mt-2">
            I submit this offer to compromise the tax liabilities plus any
            interest, penalties, additions to tax, and additional amounts
            required by law for the tax type and period(s) marked in Section 1
            or Section 2 below.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 1: Individual Information (Form 1040 Filers)
        </h2>

        {/* Section 1: Individual Information */}
        <Card>
          <CardContent className="space-y-6">
            {/* Primary Taxpayer */}
            <div className="space-y-4">
              <h4 className="font-medium">Primary Taxpayer</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="First Name"
                  id="primaryTaxpayer.firstName"
                  required
                  {...register("primaryTaxpayer.firstName")}
                  error={errors.primaryTaxpayer?.firstName?.message}
                />
                <FormInput
                  label="Middle Initial"
                  id="primaryTaxpayer.middleInitial"
                  {...register("primaryTaxpayer.middleInitial")}
                  error={errors.primaryTaxpayer?.middleInitial?.message}
                />
                <FormInput
                  label="Last Name"
                  id="primaryTaxpayer.lastName"
                  required
                  {...register("primaryTaxpayer.lastName")}
                  error={errors.primaryTaxpayer?.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Social Security Number (SSN)"
                  id="primaryTaxpayer.socialSecurityNumber"
                  placeholder="XXX-XX-XXXX"
                  {...register("primaryTaxpayer.socialSecurityNumber", {
                    onChange: (e) =>
                      setValue(
                        "primaryTaxpayer.socialSecurityNumber",
                        formatSSNOrITIN(e.target.value)
                      ),
                  })}
                  error={errors.primaryTaxpayer?.socialSecurityNumber?.message}
                />
                <FormInput
                  label="Individual Taxpayer Identification Number (ITIN)"
                  id="primaryTaxpayer.individualTaxpayerIdentificationNumber"
                  placeholder="XXX-XX-XXXX"
                  {...register(
                    "primaryTaxpayer.individualTaxpayerIdentificationNumber",
                    {
                      onChange: (e) =>
                        setValue(
                          "primaryTaxpayer.individualTaxpayerIdentificationNumber",
                          formatSSNOrITIN(e.target.value)
                        ),
                    }
                  )}
                  error={
                    errors.primaryTaxpayer
                      ?.individualTaxpayerIdentificationNumber?.message
                  }
                />
              </div>
            </div>

            {/* Joint Offer Checkbox */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isJointOffer"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isJointOffer"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="isJointOffer">
                This is a joint offer (include spouse information)
              </Label>
            </div>

            {/* Spouse Taxpayer (conditional) */}
            {isJointOffer && (
              <div className="space-y-4 mt-4">
                <h4 className="font-medium">Spouse Taxpayer</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="First Name"
                    id="spouseTaxpayer.firstName"
                    required
                    {...register("spouseTaxpayer.firstName")}
                    error={errors.spouseTaxpayer?.firstName?.message}
                  />
                  <FormInput
                    label="Middle Initial"
                    id="spouseTaxpayer.middleInitial"
                    {...register("spouseTaxpayer.middleInitial")}
                    error={errors.spouseTaxpayer?.middleInitial?.message}
                  />
                  <FormInput
                    label="Last Name"
                    id="spouseTaxpayer.lastName"
                    required
                    {...register("spouseTaxpayer.lastName")}
                    error={errors.spouseTaxpayer?.lastName?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Social Security Number (SSN)"
                    id="spouseTaxpayer.socialSecurityNumber"
                    placeholder="XXX-XX-XXXX"
                    {...register("spouseTaxpayer.socialSecurityNumber", {
                      onChange: (e) =>
                        setValue(
                          "spouseTaxpayer.socialSecurityNumber",
                          formatSSNOrITIN(e.target.value)
                        ),
                    })}
                    error={errors.spouseTaxpayer?.socialSecurityNumber?.message}
                  />
                  <FormInput
                    label="Individual Taxpayer Identification Number (ITIN)"
                    id="spouseTaxpayer.individualTaxpayerIdentificationNumber"
                    placeholder="XXX-XX-XXXX"
                    {...register(
                      "spouseTaxpayer.individualTaxpayerIdentificationNumber",
                      {
                        onChange: (e) =>
                          setValue(
                            "spouseTaxpayer.individualTaxpayerIdentificationNumber",
                            formatSSNOrITIN(e.target.value)
                          ),
                      }
                    )}
                    error={
                      errors.spouseTaxpayer
                        ?.individualTaxpayerIdentificationNumber?.message
                    }
                  />
                </div>
              </div>
            )}

            {/* Address Information */}
            <div className="space-y-4 mt-6">
              <h4 className="font-medium">Home Physical Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Street"
                  id="addressInformation.physicalAddress.street"
                  required
                  {...register("addressInformation.physicalAddress.street")}
                  error={
                    errors.addressInformation?.physicalAddress?.street?.message
                  }
                />
                <FormInput
                  label="City"
                  id="addressInformation.physicalAddress.city"
                  required
                  {...register("addressInformation.physicalAddress.city")}
                  error={
                    errors.addressInformation?.physicalAddress?.city?.message
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="State"
                  id="addressInformation.physicalAddress.state"
                  required
                  {...register("addressInformation.physicalAddress.state")}
                  error={
                    errors.addressInformation?.physicalAddress?.state?.message
                  }
                />
                <FormInput
                  label="ZIP Code"
                  id="addressInformation.physicalAddress.zipCode"
                  required
                  {...register("addressInformation.physicalAddress.zipCode")}
                  error={
                    errors.addressInformation?.physicalAddress?.zipCode?.message
                  }
                />
                <FormInput
                  label="County"
                  id="addressInformation.physicalAddress.county"
                  required
                  {...register("addressInformation.physicalAddress.county")}
                  error={
                    errors.addressInformation?.physicalAddress?.county?.message
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">
                Home Mailing Address (if a P.O. box or different from physical
                address)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Street"
                  id="addressInformation.mailingAddress.street"
                  {...register("addressInformation.mailingAddress.street")}
                  error={
                    errors.addressInformation?.mailingAddress?.street?.message
                  }
                />
                <FormInput
                  label="City"
                  id="addressInformation.mailingAddress.city"
                  {...register("addressInformation.mailingAddress.city")}
                  error={
                    errors.addressInformation?.mailingAddress?.city?.message
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="State"
                  id="addressInformation.mailingAddress.state"
                  {...register("addressInformation.mailingAddress.state")}
                  error={
                    errors.addressInformation?.mailingAddress?.state?.message
                  }
                />
                <FormInput
                  label="ZIP Code"
                  id="addressInformation.mailingAddress.zipCode"
                  {...register("addressInformation.mailingAddress.zipCode")}
                  error={
                    errors.addressInformation?.mailingAddress?.zipCode?.message
                  }
                />
                <FormInput
                  label="County"
                  id="addressInformation.mailingAddress.county"
                  {...register("addressInformation.mailingAddress.county")}
                  error={
                    errors.addressInformation?.mailingAddress?.county?.message
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="isNewAddressSinceLastReturn"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isNewAddressSinceLastReturn"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                    />
                  )}
                />
                <Label htmlFor="isNewAddressSinceLastReturn">
                  Is this a new address since your last filed tax return?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="updateRecordsToThisAddress"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="updateRecordsToThisAddress"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                    />
                  )}
                />
                <Label htmlFor="updateRecordsToThisAddress">
                  Would you like us to update our records to this address?
                </Label>
              </div>
            </div>

            <FormInput
              label="Employer Identification Number (EIN) (if applicable)"
              id="employerIdentificationNumber"
              placeholder="XX-XXXXXXX"
              {...register("employerIdentificationNumber", {
                onChange: (e) =>
                  setValue(
                    "employerIdentificationNumber",
                    formatEIN(e.target.value)
                  ),
              })}
              error={errors.employerIdentificationNumber?.message}
            />
          </CardContent>
        </Card>

        {/* Individual Tax Periods */}
        <Card>
          <CardHeader>
            <CardTitle>
              Individual Tax Periods (For Individual or Sole-Proprietor Tax Debt
              Only)
            </CardTitle>
            <p className="text-sm text-gray-600">
              List all years/periods owed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="taxPeriods.isIndividualIncomeTax"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="taxPeriods.isIndividualIncomeTax"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="taxPeriods.isIndividualIncomeTax">
                Form 1040 U.S. Individual Income Tax Return (e.g.,
              </Label>
              <FormInput
                label=""
                id="taxPeriods.individualTaxDescription"
                placeholder="12-31-2021"
                className="w-32 inline-block"
                {...register("taxPeriods.individualTaxDescription")}
                error={errors.taxPeriods?.individualTaxDescription?.message}
              />
              <Label htmlFor="taxPeriods.isIndividualIncomeTax">)</Label>
            </div>
            {errors.taxPeriods?.isIndividualIncomeTax && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.isIndividualIncomeTax.message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="taxPeriods.isTrustFundRecoveryPenalty"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="taxPeriods.isTrustFundRecoveryPenalty"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="taxPeriods.isTrustFundRecoveryPenalty">
                Trust Fund Recovery Penalty as a responsible person of
              </Label>
              <FormInput
                label=""
                id="taxPeriods.trustFundBusinessName"
                placeholder="business name"
                className="w-48 inline-block"
                {...register("taxPeriods.trustFundBusinessName")}
                error={errors.taxPeriods?.trustFundBusinessName?.message}
              />
              <Label htmlFor="taxPeriods.isTrustFundRecoveryPenalty">
                for failure to pay withholding and Federal Insurance
                Contributions Act taxes (Social Security taxes), for period(s)
                ending
              </Label>
              <FormInput
                label=""
                id="taxPeriods.trustFundPeriodEnding"
                placeholder="03-31-2021"
                className="w-32 inline-block"
                {...register("taxPeriods.trustFundPeriodEnding")}
                error={errors.taxPeriods?.trustFundPeriodEnding?.message}
              />
            </div>
            {errors.taxPeriods?.isTrustFundRecoveryPenalty && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.isTrustFundRecoveryPenalty.message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="taxPeriods.isEmployerQuarterlyTax"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="taxPeriods.isEmployerQuarterlyTax"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="taxPeriods.isEmployerQuarterlyTax">
                Form 941 Employer’s Quarterly Federal Tax Return – Quarterly
                period(s)
              </Label>
              <FormInput
                label=""
                id="taxPeriods.quarterlyPeriods"
                placeholder="Enter quarterly periods"
                className="w-64 inline-block"
                {...register("taxPeriods.quarterlyPeriods")}
                error={errors.taxPeriods?.quarterlyPeriods?.message}
              />
            </div>
            {errors.taxPeriods?.isEmployerQuarterlyTax && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.isEmployerQuarterlyTax.message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="taxPeriods.isEmployerAnnualFUTATax"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="taxPeriods.isEmployerAnnualFUTATax"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="taxPeriods.isEmployerAnnualFUTATax">
                Form 940 Employer’s Annual Federal Unemployment (FUTA) Tax
                Return – Year(s)
              </Label>
              <FormInput
                label=""
                id="taxPeriods.annualYears"
                placeholder="12-31-2021"
                className="w-32 inline-block"
                {...register("taxPeriods.annualYears")}
                error={errors.taxPeriods?.annualYears?.message}
              />
            </div>
            {errors.taxPeriods?.isEmployerAnnualFUTATax && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.isEmployerAnnualFUTATax.message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="taxPeriods.isOtherFederalTax"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="taxPeriods.isOtherFederalTax"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="taxPeriods.isOtherFederalTax">
                Other Federal Tax(es) [specify type(s) and period(s)]
              </Label>
              <FormInput
                label=""
                id="taxPeriods.otherTaxDescription"
                placeholder="Specify type(s) and period(s)"
                className="w-64 inline-block"
                {...register("taxPeriods.otherTaxDescription")}
                error={errors.taxPeriods?.otherTaxDescription?.message}
              />
            </div>
            {errors.taxPeriods?.isOtherFederalTax && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.isOtherFederalTax.message}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Label>
                Note: If you need more space, use attachment and title it
                &quot;Attachment to Form 656 dated&quot;
              </Label>
              <FormInput
                label=""
                id="taxPeriods.attachmentToForm656Dated"
                placeholder=""
                className="w-32 inline-block"
                {...register("taxPeriods.attachmentToForm656Dated")}
                error={errors.taxPeriods?.attachmentToForm656Dated?.message}
              />
              <Label>. Make sure to sign and date the attachment.</Label>
            </div>

            {errors.taxPeriods?.message && (
              <p className="text-red-600 text-sm">
                {errors.taxPeriods.message}
              </p>
            )}

            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
              <p>
                <strong>Warning:</strong> The IRS will not compromise any
                amounts of restitution assessed by the IRS or any tax periods
                for which the IRS has referred to the DOJ. Any liability arising
                from restitution is excluded from this offer. Also, the IRS will
                not compromise any liability for which an election under IRC §
                965(i) is made; such liabilities are excluded from this offer.
                Any offer containing a liability for which payment is being
                deferred under IRC § 965(h)(1) can only be processed if no
                portion of the liability to be compromised resulted from
                entering into a transfer agreement under section 965(h)(3).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Low-Income Certification */}
        <Card>
          <CardHeader>
            <CardTitle>
              Low-Income Certification (Individuals and Sole Proprietors Only)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Do you qualify for Low-Income Certification? You qualify if your
              adjusted gross income, as determined by your most recently filed
              Individual Income Tax Return (Form 1040) or your household&apos;s
              gross monthly income from Form 433-A(OIC) x 12, is equal to or
              less than the amount shown in the chart below based on your family
              size and where you live.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              If you qualify, you are not required to submit any payments or the
              application fee upon submission or during the consideration of
              your offer. The IRS will verify whether you qualify.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Controller
                name="lowIncomeCertification.qualifiesForLowIncome"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="lowIncomeCertification.qualifiesForLowIncome"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                )}
              />
              <Label htmlFor="lowIncomeCertification.qualifiesForLowIncome">
                I qualify for the Low-Income Certification
              </Label>
            </div>

            {qualifiesForLowIncome && (
              <div className="space-y-4">
                <div>
                  <Label>Qualification Basis</Label>
                  <RadioGroup
                    value={qualificationBasis ?? ""}
                    onValueChange={(value) =>
                      setValue(
                        "lowIncomeCertification.qualificationBasis",
                        value as
                          | "adjusted_gross_income"
                          | "household_monthly_income"
                      )
                    }
                    className="space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="adjusted_gross_income"
                        id="basis-agi"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="basis-agi">
                        I qualify for the Low-Income Certification because my
                        adjusted gross income for my household&apos;s size is
                        equal to or less than the amount shown in the table
                        below.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="household_monthly_income"
                        id="basis-monthly"
                        className="text-[#22b573]"
                      />
                      <Label htmlFor="basis-monthly">
                        I qualify for the Low-Income Certification because my
                        household size and gross monthly income x 12 is equal to
                        or less than the income shown in the table below.
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.lowIncomeCertification?.qualificationBasis && (
                    <p className="text-red-600 text-sm">
                      {errors.lowIncomeCertification.qualificationBasis.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lowIncomeCertification.familySize">
                      Family Unit Size
                    </Label>
                    <FormInput
                      label=""
                      id="lowIncomeCertification.familySize"
                      type="number"
                      min={1}
                      {...register("lowIncomeCertification.familySize", {
                        valueAsNumber: true,
                      })}
                      error={errors.lowIncomeCertification?.familySize?.message}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lowIncomeCertification.residenceState">
                      Residence Location
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          "lowIncomeCertification.residenceState",
                          value as "contiguous_states" | "alaska" | "hawaii"
                        )
                      }
                      defaultValue={residenceState}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contiguous_states">
                          48 Contiguous States, D.C., and U.S. Territories
                        </SelectItem>
                        <SelectItem value="alaska">Alaska</SelectItem>
                        <SelectItem value="hawaii">Hawaii</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.lowIncomeCertification?.residenceState && (
                      <p className="text-red-600 text-sm">
                        {errors.lowIncomeCertification.residenceState.message}
                      </p>
                    )}
                  </div>
                </div>

                {qualificationBasis === "adjusted_gross_income" && (
                  <FormInput
                    label="Adjusted Gross Income"
                    id="lowIncomeCertification.adjustedGrossIncome"
                    type="number"
                    {...register("lowIncomeCertification.adjustedGrossIncome", {
                      valueAsNumber: true,
                    })}
                    error={
                      errors.lowIncomeCertification?.adjustedGrossIncome
                        ?.message
                    }
                  />
                )}

                {qualificationBasis === "household_monthly_income" && (
                  <FormInput
                    label="Household Gross Monthly Income"
                    id="lowIncomeCertification.householdMonthlyIncome"
                    type="number"
                    {...register(
                      "lowIncomeCertification.householdMonthlyIncome",
                      { valueAsNumber: true }
                    )}
                    error={
                      errors.lowIncomeCertification?.householdMonthlyIncome
                        ?.message
                    }
                  />
                )}

                {qualificationBasis && familySize && residenceState ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      Income limit for your household: $
                      {incomeLimit.toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-1">
                      Your{" "}
                      {qualificationBasis === "adjusted_gross_income"
                        ? "AGI"
                        : "annualized monthly income"}
                      : $
                      {qualificationBasis === "adjusted_gross_income"
                        ? (adjustedGrossIncome || 0).toLocaleString()
                        : ((householdMonthlyIncome || 0) * 12).toLocaleString()}
                    </p>
                    <p
                      className={`mt-2 font-medium ${
                        doesQualify() ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {doesQualify()
                        ? "You appear to qualify based on your inputs."
                        : "You may not qualify based on your inputs. IRS will verify."}
                    </p>
                  </div>
                ) : (
                  ""
                )}
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
