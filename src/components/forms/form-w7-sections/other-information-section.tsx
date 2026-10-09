"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormInput } from "@/components/ui/form-field";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import FormLoader from "@/components/global/FormLoader";
import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import {
  useW7ApplicationInfo,
  useW7OtherInformation,
  useW7PersonalInfo,
} from "@/hooks/w7-form-hooks/useW7Section";
import {
  makeOtherInformationSchema,
  otherInformationInitialValues,
  W7_ID_DOCUMENT_LABELS,
  W7_ID_DOCUMENT_TYPES,
} from "@/lib/validation/formw7/other-information-section";
import { SupportingDocuments } from "./supporting-documents";
import { maskedRegister } from "./masked-register";
import {
  FORMATTED_INPUT_MAXLENGTH,
  MAX_YEARS_UNTIL_EXPIRY,
  W7_LIMITS,
  formatTinInput,
  isoDate,
} from "@/lib/validation/formw7/rules";
import { todayForDateInput } from "@/utils/formw7";

interface SectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export function OtherInformationSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  disabled = false,
}: SectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { otherInformation, applicationInfo, personalInfo } = useAppSelector(
    (state) => state.formW7
  );
  const { loading, loadingFormData, handleSave, handleGet } =
    useW7OtherInformation();
  const { handleGet: loadApplicationInfo } = useW7ApplicationInfo();
  const { handleGet: loadPersonalInfo } = useW7PersonalInfo();

  // Several rules in this section depend on the saved application-info answers
  const validationContext = useMemo(() => {
    if (!applicationInfo) return {};
    const reasonCodes: string[] = [];
    if (applicationInfo.primaryReason)
      reasonCodes.push(applicationInfo.primaryReason);
    if (applicationInfo.includeOtherReason) reasonCodes.push("h");
    return {
      applicationType: applicationInfo.applicationType,
      reasonCodes,
      dateOfBirth: personalInfo?.dateOfBirth,
    };
  }, [applicationInfo, personalInfo]);

  const schema = useMemo(
    () => makeOtherInformationSchema(validationContext),
    [validationContext]
  );

  const methods = useForm<W7OtherInformationFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: otherInformationInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const citizenshipCountries = watch("citizenshipCountries");
  const hasUsVisa = watch("hasUsVisa");
  const documentType = watch("identificationDocument.type");
  const entryStatus = watch("identificationDocument.entryStatus");
  const previouslyReceived = watch("previouslyReceivedTaxpayerNumber");
  const supportingDocumentIds = watch("supportingDocumentIds");
  const additionalDocumentDescriptions = watch(
    "additionalDocumentDescriptions"
  );

  const isRenewal = validationContext.applicationType === "renewal";
  const reasonCodes = validationContext.reasonCodes ?? [];
  const requiresInstitution = reasonCodes.includes("f");
  const requiresVisa = reasonCodes.includes("g");

  useEffect(() => {
    if (!otherInformation) handleGet(caseId);
    if (!applicationInfo) loadApplicationInfo(caseId);
    if (!personalInfo) loadPersonalInfo(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otherInformation) reset(otherInformation);
  }, [otherInformation, reset]);

  useEffect(() => {
    if (entryStatus === "never") {
      setValue("identificationDocument.dateOfEntry", "");
    }
  }, [entryStatus, setValue]);

  // Reason g always requires visa details and a U.S. entry date
  useEffect(() => {
    if (requiresVisa && !hasUsVisa) setValue("hasUsVisa", true);
  }, [requiresVisa, hasUsVisa, setValue]);

  // A renewal only exists if an ITIN was issued before, so the answer is Yes
  useEffect(() => {
    if (isRenewal && previouslyReceived !== "yes") {
      setValue("previouslyReceivedTaxpayerNumber", "yes");
    }
  }, [isRenewal, previouslyReceived, setValue]);

  // The college/company block is only shown for reason f. Clear it otherwise so
  // a value typed before the reason changed is never saved or printed.
  useEffect(() => {
    if (!requiresInstitution) {
      setValue("institutionOrCompany", {
        name: "",
        cityAndState: "",
        lengthOfStay: "",
      });
    }
  }, [requiresInstitution, setValue]);

  const onSubmit = async (data: W7OtherInformationFormSchema) => {
    if (disabled) return onNext();
    try {
      await handleSave(data, caseId);
      onNext();
    } catch (error: any) {
      showError(
        error?.message || "Failed to save the other information",
        "Other Information Error"
      );
    }
  };

  if (loadingFormData) return <FormLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 3: Other Information
          </h2>
          <p className="text-gray-600">
            Citizenship, visa, and the identification documents submitted with
            the application.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Citizenship and Foreign Tax I.D.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Country(ies) of Citizenship"
              id="citizenshipCountries"
              required
              error={
                errors.citizenshipCountries?.message ||
                errors.citizenshipCountries?.root?.message
              }
            >
              <div className="space-y-2">
                {citizenshipCountries.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Enter a country of citizenship"
                      disabled={disabled}
                      maxLength={W7_LIMITS.country}
                      {...register(`citizenshipCountries.${index}`)}
                      className="border-gray-300 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                    {!disabled && citizenshipCountries.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValue(
                            "citizenshipCountries",
                            citizenshipCountries.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {citizenshipCountries.map((_, index) =>
                  errors.citizenshipCountries?.[index]?.message ? (
                    <p key={`error-${index}`} className="text-sm text-red-600">
                      {errors.citizenshipCountries[index]?.message}
                    </p>
                  ) : null
                )}

                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setValue("citizenshipCountries", [
                        ...citizenshipCountries,
                        "",
                      ])
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add country
                  </Button>
                )}
              </div>
            </FormField>

            <FormInput
              label="Foreign Tax I.D. Number (if any)"
              id="foreignTaxId"
              disabled={disabled}
              maxLength={W7_LIMITS.foreignTaxId}
                {...register("foreignTaxId")}
              error={errors.foreignTaxId?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>U.S. Visa (if any)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="hasUsVisa"
                {...register("hasUsVisa")}
                disabled={disabled || requiresVisa}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label htmlFor="hasUsVisa" className="font-medium">
                  The applicant holds a U.S. visa
                </Label>
                <p className="text-sm text-gray-600">
                  {requiresVisa
                    ? "Visa information is required for box g."
                    : "Leave unchecked if no U.S. visa has been issued."}
                </p>
                {errors.hasUsVisa && (
                  <p className="text-red-600 text-sm">
                    {errors.hasUsVisa.message}
                  </p>
                )}
              </div>
            </div>

            {hasUsVisa && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:[&_label]:min-h-10 md:[&_label]:items-start">
                <FormInput
                  label="Type of U.S. Visa"
                  id="usVisa.type"
                  required
                  placeholder="For example: F-1"
                  disabled={disabled}
                  maxLength={W7_LIMITS.visaType}
                {...register("usVisa.type")}
                  error={errors.usVisa?.type?.message}
                />
                <FormInput
                  label="Number"
                  id="usVisa.number"
                  required
                  disabled={disabled}
                  maxLength={W7_LIMITS.visaNumber}
                {...register("usVisa.number")}
                  error={errors.usVisa?.number?.message}
                />
                <FormInput
                  label="Expiration Date"
                  id="usVisa.expirationDate"
                  type="date"
                  required
                  min={todayForDateInput()}
                  disabled={disabled}
                  max={isoDate(MAX_YEARS_UNTIL_EXPIRY)}
                  {...register("usVisa.expirationDate")}
                  error={errors.usVisa?.expirationDate?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="block">
              Identification Document(s) Submitted
              <span className="text-red-500 ml-1">*</span>
              <span className="block text-sm font-normal text-gray-500 mt-2">
                Enter the details of the first document submitted. Add any
                other documents under Supporting documents below.
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {/* The card title already carries this caption */}
              <RadioGroup
                aria-label="Identification document(s) submitted"
                value={documentType}
                onValueChange={(value) =>
                  setValue(
                    "identificationDocument.type",
                    value as (typeof W7_ID_DOCUMENT_TYPES)[number]
                  )
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                disabled={disabled}
              >
                {W7_ID_DOCUMENT_TYPES.map((type) => (
                  <div key={type} className="flex items-start space-x-2">
                    <RadioGroupItem
                      value={type}
                      id={`w7-doc-${type}`}
                      className="text-[#22b573] mt-0.5"
                    />
                    <Label htmlFor={`w7-doc-${type}`} className="items-start">
                      {W7_ID_DOCUMENT_LABELS[type]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.identificationDocument?.type && (
                <p className="text-red-600 text-sm">
                  {errors.identificationDocument.type.message}
                </p>
              )}
              {documentType !== "passport" && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  A passport is the only document that can be submitted on its
                  own. At least one supporting document is required below.
                </p>
              )}
            </div>

            {documentType === "other" && (
              <FormInput
                label="Describe the Document Type"
                id="identificationDocument.otherType"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.idOtherType}
                {...register("identificationDocument.otherType")}
                error={errors.identificationDocument?.otherType?.message}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:[&_label]:min-h-10 md:[&_label]:items-start">
              <FormInput
                label="Issued By"
                id="identificationDocument.issuedBy"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.idIssuedBy}
                {...register("identificationDocument.issuedBy")}
                error={errors.identificationDocument?.issuedBy?.message}
              />
              <FormInput
                label="Number"
                id="identificationDocument.number"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.idNumber}
                {...register("identificationDocument.number")}
                error={errors.identificationDocument?.number?.message}
              />
              <FormInput
                label="Exp. Date"
                id="identificationDocument.expirationDate"
                type="date"
                min={todayForDateInput()}
                disabled={disabled}
                max={isoDate(MAX_YEARS_UNTIL_EXPIRY)}
                {...register("identificationDocument.expirationDate")}
                error={errors.identificationDocument?.expirationDate?.message}
              />
            </div>

            {/* The form prints one field here. The API models it as either a
                date or a neverEnteredUnitedStates flag and rejects both, so the
                checkbox replaces the date rather than sitting beside it. */}
            <div className="space-y-3 border-t border-gray-200 pt-5">
              {entryStatus === "entered" ? (
                <div className="md:w-1/2">
                  <FormInput
                    label="Date of Entry Into the United States (MM/DD/YYYY)"
                    id="identificationDocument.dateOfEntry"
                    type="date"
                    required
                    max={todayForDateInput()}
                    disabled={disabled}
                    min="1900-01-01"
                    {...register("identificationDocument.dateOfEntry")}
                    error={errors.identificationDocument?.dateOfEntry?.message}
                  />
                </div>
              ) : (
                <Label className="text-sm font-medium">
                  Date of Entry Into the United States
                </Label>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="neverEnteredUnitedStates"
                  checked={entryStatus === "never"}
                  disabled={disabled || requiresVisa}
                  onCheckedChange={(checked) =>
                    setValue(
                      "identificationDocument.entryStatus",
                      checked === true ? "never" : "entered"
                    )
                  }
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-0.5"
                />
                <Label
                  htmlFor="neverEnteredUnitedStates"
                  className="items-start"
                >
                  The applicant has never entered the United States
                </Label>
              </div>
              {errors.identificationDocument?.entryStatus && (
                <p className="text-red-600 text-sm">
                  {errors.identificationDocument.entryStatus.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous ITIN or IRSN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium items-start">
                Have you previously received an ITIN or an Internal Revenue
                Service Number (IRSN)?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={previouslyReceived}
                onValueChange={(value) =>
                  setValue(
                    "previouslyReceivedTaxpayerNumber",
                    value as "no-or-unknown" | "yes"
                  )
                }
                className="space-y-3"
                disabled={disabled}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="no-or-unknown"
                    id="w7-prior-no"
                    className="text-[#22b573] mt-0.5"
                    disabled={isRenewal}
                  />
                  <Label htmlFor="w7-prior-no" className="items-start">
                    No, or I don&apos;t know
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="w7-prior-yes"
                    className="text-[#22b573] mt-0.5"
                  />
                  <Label htmlFor="w7-prior-yes" className="items-start">
                    Yes
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {(previouslyReceived === "yes" || isRenewal) && (
              <div className="space-y-6 border-t border-gray-200 pt-5">
                <p className="text-sm text-gray-600">
                  Enter the ITIN and/or IRSN, and the name it was issued under.
                  If there is more than one, list the others on a separate sheet
                  and attach it to the printed form.
                </p>
                {isRenewal && previouslyReceived !== "yes" && (
                  <p className="text-sm text-gray-600">
                    A renewal application requires the previously assigned ITIN.
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="ITIN"
                    id="itin"
                    required={isRenewal}
                    placeholder="912345678"
                    disabled={disabled}
                    maxLength={FORMATTED_INPUT_MAXLENGTH}
                    inputMode="numeric"
                    {...maskedRegister(register, setValue, "itin", formatTinInput)}
                    error={errors.itin?.message}
                  />
                  <FormInput
                    label="IRSN"
                    id="irsn"
                    disabled={disabled}
                    maxLength={FORMATTED_INPUT_MAXLENGTH}
                    inputMode="numeric"
                    {...maskedRegister(register, setValue, "irsn", formatTinInput)}
                    error={errors.irsn?.message}
                  />
                </div>

                {previouslyReceived === "yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="First Name"
                      id="issuedName.firstName"
                      required
                      disabled={disabled}
                      maxLength={W7_LIMITS.issuedFirstName}
                {...register("issuedName.firstName")}
                      error={errors.issuedName?.firstName?.message}
                    />
                    <FormInput
                      label="Middle Name"
                      id="issuedName.middleName"
                      disabled={disabled}
                      maxLength={W7_LIMITS.issuedMiddleName}
                {...register("issuedName.middleName")}
                      error={errors.issuedName?.middleName?.message}
                    />
                    <FormInput
                      label="Last Name"
                      id="issuedName.lastName"
                      required
                      disabled={disabled}
                      maxLength={W7_LIMITS.issuedLastName}
                {...register("issuedName.lastName")}
                      error={errors.issuedName?.lastName?.message}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {requiresInstitution && (
          <Card>
            <CardHeader>
              <CardTitle className="block">
                College/University or Company
                <span className="block text-sm font-normal text-gray-500 mt-2">
                  Required when reason f is selected.
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 md:[&_label]:min-h-10 md:[&_label]:items-start">
              <FormInput
                label="Name of College/University or Company"
                id="institutionOrCompany.name"
                required
                disabled={disabled}
                maxLength={W7_LIMITS.institutionName}
                {...register("institutionOrCompany.name")}
                error={errors.institutionOrCompany?.name?.message}
              />
              <FormInput
                label="City and State"
                id="institutionOrCompany.cityAndState"
                required
                placeholder="For example: Boston, MA"
                disabled={disabled}
                maxLength={W7_LIMITS.institutionCityState}
                {...register("institutionOrCompany.cityAndState")}
                error={errors.institutionOrCompany?.cityAndState?.message}
              />
              <FormInput
                label="Length of Stay"
                id="institutionOrCompany.lengthOfStay"
                required
                placeholder="For example: 4 years"
                disabled={disabled}
                maxLength={W7_LIMITS.lengthOfStay}
                {...register("institutionOrCompany.lengthOfStay")}
                error={errors.institutionOrCompany?.lengthOfStay?.message}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              Supporting documents
              {documentType !== "passport" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupportingDocuments
              caseId={caseId}
              documentIds={supportingDocumentIds}
              onDocumentIdsChange={(ids) =>
                setValue("supportingDocumentIds", ids, {
                  shouldValidate: true,
                })
              }
              descriptions={additionalDocumentDescriptions}
              onDescriptionsChange={(descriptions) =>
                setValue("additionalDocumentDescriptions", descriptions)
              }
              error={
                errors.supportingDocumentIds?.message ||
                errors.supportingDocumentIds?.root?.message
              }
              disabled={disabled}
            />
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
