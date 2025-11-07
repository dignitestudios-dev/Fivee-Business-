"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useOtherInfo from "@/hooks/433b-form-hooks/useOtherInfo";
import toast from "react-hot-toast";
import {
  otherInfoInitialValues,
  otherInfoSchemaFormB,
} from "@/lib/validation/form433b/other-info-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";

interface OtherInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function OtherInfoSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: OtherInfoSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { otherInfo } = useAppSelector((state) => state.form433b);
  const { loading, loadingFormData, handleSaveOtherInfo, handleGetOtherInfo } =
    useOtherInfo();

  const methods = useForm<OtherInfoFormSchema>({
    resolver: zodResolver(otherInfoSchemaFormB),
    defaultValues: otherInfoInitialValues,
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

  // Field arrays
  const {
    fields: affiliationFields,
    append: appendAffiliation,
    remove: removeAffiliation,
  } = useFieldArray({
    control,
    name: "businessAffiliations",
  });

  const {
    fields: litigationFields,
    append: appendLitigation,
    remove: removeLitigation,
  } = useFieldArray({
    control,
    name: "litigationHistory",
  });

  const {
    fields: assetTransferFields,
    append: appendAssetTransfer,
    remove: removeAssetTransfer,
  } = useFieldArray({
    control,
    name: "assetTransfersOver10k",
  });

  const {
    fields: realTransferFields,
    append: appendRealTransfer,
    remove: removeRealTransfer,
  } = useFieldArray({
    control,
    name: "realPropertyTransfers",
  });

  const {
    fields: foreignAssetFields,
    append: appendForeignAsset,
    remove: removeForeignAsset,
  } = useFieldArray({
    control,
    name: "foreignAssets",
  });

  const {
    fields: relatedPartyFields,
    append: appendRelatedParty,
    remove: removeRelatedParty,
  } = useFieldArray({
    control,
    name: "relatedPartyDebts",
  });

  // Watch conditionals
  const isCurrentlyInBankruptcy = watch("isCurrentlyInBankruptcy");
  const hasFiledBankruptcyInPast10Years = watch(
    "hasFiledBankruptcyInPast10Years"
  );
  const hasOtherBusinessAffiliations = watch("hasOtherBusinessAffiliations");
  const doRelatedPartiesOweMoney = watch("doRelatedPartiesOweMoney");
  const isCurrentlyOrPastPartyToLitigation = watch(
    "isCurrentlyOrPastPartyToLitigation"
  );
  const hasBeenPartyToLitigationWithIRS = watch(
    "hasBeenPartyToLitigationWithIRS"
  );
  const hasTransferredAssetsOver10kInPast10Years = watch(
    "hasTransferredAssetsOver10kInPast10Years"
  );
  const hasTransferredRealPropertyInPast3Years = watch(
    "hasTransferredRealPropertyInPast3Years"
  );
  const hasBeenLocatedOutsideUS = watch("hasBeenLocatedOutsideUS");
  const hasAssetsOutsideUS = watch("hasAssetsOutsideUS");
  const hasFundsHeldInTrust = watch("hasFundsHeldInTrust");
  const hasLinesOfCredit = watch("hasLinesOfCredit");

  // Limit arrays to at most one item
  useEffect(() => {
    if (affiliationFields.length > 1) {
      for (let i = affiliationFields.length - 1; i > 0; i--) {
        removeAffiliation(i);
      }
    }
    if (litigationFields.length > 1) {
      for (let i = litigationFields.length - 1; i > 0; i--) {
        removeLitigation(i);
      }
    }
    if (assetTransferFields.length > 1) {
      for (let i = assetTransferFields.length - 1; i > 0; i--) {
        removeAssetTransfer(i);
      }
    }
    if (realTransferFields.length > 1) {
      for (let i = realTransferFields.length - 1; i > 0; i--) {
        removeRealTransfer(i);
      }
    }
    if (foreignAssetFields.length > 1) {
      for (let i = foreignAssetFields.length - 1; i > 0; i--) {
        removeForeignAsset(i);
      }
    }
    if (relatedPartyFields.length > 1) {
      for (let i = relatedPartyFields.length - 1; i > 0; i--) {
        removeRelatedParty(i);
      }
    }
  }, [
    affiliationFields.length,
    litigationFields.length,
    assetTransferFields.length,
    realTransferFields.length,
    foreignAssetFields.length,
    relatedPartyFields.length,
    removeAffiliation,
    removeLitigation,
    removeAssetTransfer,
    removeRealTransfer,
    removeForeignAsset,
    removeRelatedParty,
  ]);

  // Manage businessAffiliations array based on yes/no
  useEffect(() => {
    if (hasOtherBusinessAffiliations && affiliationFields.length === 0) {
      appendAffiliation({
        name: "",
        employerIdentificationNumber: "",
      });
    } else if (!hasOtherBusinessAffiliations && affiliationFields.length > 0) {
      for (let i = affiliationFields.length - 1; i >= 0; i--) {
        removeAffiliation(i);
      }
    }
  }, [
    hasOtherBusinessAffiliations,
    affiliationFields.length,
    appendAffiliation,
    removeAffiliation,
  ]);

  // Manage litigationHistory array based on yes/no
  useEffect(() => {
    if (isCurrentlyOrPastPartyToLitigation && litigationFields.length === 0) {
      appendLitigation({
        role: "Plaintiff",
        locationOfFiling: "",
        representedBy: "",
        docketCaseNumber: "",
        amountInDispute: 0,
        possibleCompletionDate: "",
        subjectOfLitigation: "",
      });
    } else if (
      !isCurrentlyOrPastPartyToLitigation &&
      litigationFields.length > 0
    ) {
      for (let i = litigationFields.length - 1; i >= 0; i--) {
        removeLitigation(i);
      }
    }
  }, [
    isCurrentlyOrPastPartyToLitigation,
    litigationFields.length,
    appendLitigation,
    removeLitigation,
  ]);

  // Manage assetTransfersOver10k array based on yes/no
  useEffect(() => {
    if (
      hasTransferredAssetsOver10kInPast10Years &&
      assetTransferFields.length === 0
    ) {
      appendAssetTransfer({
        date: "",
        value: 0,
        typeOfAsset: "",
        description: "",
      });
    } else if (
      !hasTransferredAssetsOver10kInPast10Years &&
      assetTransferFields.length > 0
    ) {
      for (let i = assetTransferFields.length - 1; i >= 0; i--) {
        removeAssetTransfer(i);
      }
    }
  }, [
    hasTransferredAssetsOver10kInPast10Years,
    assetTransferFields.length,
    appendAssetTransfer,
    removeAssetTransfer,
  ]);

  // Manage realPropertyTransfers array based on yes/no
  useEffect(() => {
    if (
      hasTransferredRealPropertyInPast3Years &&
      realTransferFields.length === 0
    ) {
      appendRealTransfer({
        date: "",
        value: 0,
        typeOfAsset: "",
        description: "",
      });
    } else if (
      !hasTransferredRealPropertyInPast3Years &&
      realTransferFields.length > 0
    ) {
      for (let i = realTransferFields.length - 1; i >= 0; i--) {
        removeRealTransfer(i);
      }
    }
  }, [
    hasTransferredRealPropertyInPast3Years,
    realTransferFields.length,
    appendRealTransfer,
    removeRealTransfer,
  ]);

  // Manage foreignAssets array based on yes/no
  useEffect(() => {
    if (hasAssetsOutsideUS && foreignAssetFields.length === 0) {
      appendForeignAsset({
        description: "",
        location: "",
        value: 0,
      });
    } else if (!hasAssetsOutsideUS && foreignAssetFields.length > 0) {
      for (let i = foreignAssetFields.length - 1; i >= 0; i--) {
        removeForeignAsset(i);
      }
    }
  }, [
    hasAssetsOutsideUS,
    foreignAssetFields.length,
    appendForeignAsset,
    removeForeignAsset,
  ]);

  // Manage relatedPartyDebts array based on yes/no
  useEffect(() => {
    if (doRelatedPartiesOweMoney && relatedPartyFields.length === 0) {
      appendRelatedParty({
        nameAndAddress: "",
        dateOfLoan: "",
        currentBalance: 0,
        paymentAmount: 0,
      });
    } else if (!doRelatedPartiesOweMoney && relatedPartyFields.length > 0) {
      for (let i = relatedPartyFields.length - 1; i >= 0; i--) {
        removeRelatedParty(i);
      }
    }
  }, [
    doRelatedPartiesOweMoney,
    relatedPartyFields.length,
    appendRelatedParty,
    removeRelatedParty,
  ]);

  // Clear conditional fields when switching to no
  useEffect(() => {
    if (!hasFiledBankruptcyInPast10Years) {
      setValue("bankruptcyHistory", {
        dateFiled: "",
        dateDismissedOrDischarged: "",
        petitionNumber: "",
        locationFiled: "",
      });
    }
  }, [hasFiledBankruptcyInPast10Years, setValue]);

  useEffect(() => {
    if (!hasOtherBusinessAffiliations) {
      setValue("businessAffiliations", []);
    }
  }, [hasOtherBusinessAffiliations, setValue]);

  useEffect(() => {
    if (!isCurrentlyOrPastPartyToLitigation) {
      setValue("litigationHistory", []);
    }
  }, [isCurrentlyOrPastPartyToLitigation, setValue]);

  useEffect(() => {
    if (!hasBeenPartyToLitigationWithIRS) {
      setValue("irsLitigationTaxDetails", "");
    }
  }, [hasBeenPartyToLitigationWithIRS, setValue]);

  useEffect(() => {
    if (!hasTransferredAssetsOver10kInPast10Years) {
      setValue("assetTransfersOver10k", []);
    }
  }, [hasTransferredAssetsOver10kInPast10Years, setValue]);

  useEffect(() => {
    if (!hasTransferredRealPropertyInPast3Years) {
      setValue("realPropertyTransfers", []);
    }
  }, [hasTransferredRealPropertyInPast3Years, setValue]);

  useEffect(() => {
    if (!hasAssetsOutsideUS) {
      setValue("foreignAssets", []);
    }
  }, [hasAssetsOutsideUS, setValue]);

  useEffect(() => {
    if (!hasFundsHeldInTrust) {
      setValue("fundsHeldInTrustAmount", 0);
      setValue("fundsHeldInTrustLocation", "");
    }
  }, [hasFundsHeldInTrust, setValue]);

  useEffect(() => {
    if (!hasLinesOfCredit) {
      setValue("lineOfCredit", {
        creditLimit: 0,
        amountOwed: 0,
        propertySecuring: "",
      });
    }
  }, [hasLinesOfCredit, setValue]);

  useEffect(() => {
    if (!doRelatedPartiesOweMoney) {
      setValue("relatedPartyDebts", []);
    }
  }, [doRelatedPartiesOweMoney, setValue]);

  const onSubmit = async (data: OtherInfoFormSchema) => {
    try {
      if (!data.hasFiledBankruptcyInPast10Years) {
        data.bankruptcyHistory = {
          dateFiled: "",
          dateDismissedOrDischarged: "",
          petitionNumber: "",
          locationFiled: "",
        };
      }
      if (!data.hasOtherBusinessAffiliations) data.businessAffiliations = [];
      if (!data.isCurrentlyOrPastPartyToLitigation) data.litigationHistory = [];
      if (!data.hasBeenPartyToLitigationWithIRS)
        data.irsLitigationTaxDetails = "";
      if (!data.hasTransferredAssetsOver10kInPast10Years)
        data.assetTransfersOver10k = [];
      if (!data.hasTransferredRealPropertyInPast3Years)
        data.realPropertyTransfers = [];
      if (!data.hasAssetsOutsideUS) data.foreignAssets = [];
      if (!data.hasFundsHeldInTrust) {
        data.fundsHeldInTrustAmount = 0;
        data.fundsHeldInTrustLocation = "";
      }
      if (!data.hasLinesOfCredit) {
        data.lineOfCredit = {
          creditLimit: 0,
          amountOwed: 0,
          propertySecuring: "",
        };
      }
      if (!data.doRelatedPartiesOweMoney) data.relatedPartyDebts = [];

      await handleSaveOtherInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving other info:", error);
      toast.error(error.message || "Failed to save other info");
    }
  };

  useEffect(() => {
    if (!otherInfo) handleGetOtherInfo(caseId, FORM_433B_SECTIONS[5]);
  }, []);

  useEffect(() => {
    if (otherInfo) {
      reset(otherInfo);
    }
  }, [otherInfo]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 6: Other Information
          </h2>
          <p className="text-gray-600">
            Additional information IRS needs to consider settlement of your tax
            debt. If this business is currently in a bankruptcy proceeding, the
            business is not eligible to apply for an offer.{" "}
          </p>
        </div>

        {/* Bankruptcy */}
        <Card>
          <CardHeader>
            <CardTitle>Bankruptcy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you currently in bankruptcy?"
              id="isCurrentlyInBankruptcy"
              error={errors.isCurrentlyInBankruptcy?.message}
            >
              <RadioGroup
                value={isCurrentlyInBankruptcy ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("isCurrentlyInBankruptcy", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="current-bank-yes" />
                  <Label htmlFor="current-bank-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="current-bank-no" />
                  <Label htmlFor="current-bank-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            <FormField
              label="Have you filed bankruptcy in the past 10 years?"
              id="hasFiledBankruptcyInPast10Years"
              error={errors.hasFiledBankruptcyInPast10Years?.message}
            >
              <RadioGroup
                value={hasFiledBankruptcyInPast10Years ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasFiledBankruptcyInPast10Years", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="past-bank-yes" />
                  <Label htmlFor="past-bank-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="past-bank-no" />
                  <Label htmlFor="past-bank-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasFiledBankruptcyInPast10Years && (
              <div className="space-y-4">
                <FormInput
                  type="date"
                  label="Date Filed"
                  id="bankruptcyHistory.dateFiled"
                  {...register("bankruptcyHistory.dateFiled")}
                  error={errors.bankruptcyHistory?.dateFiled?.message}
                />
                <FormInput
                  type="date"
                  label="Date Dismissed or Discharged"
                  id="bankruptcyHistory.dateDismissedOrDischarged"
                  {...register("bankruptcyHistory.dateDismissedOrDischarged")}
                  error={
                    errors.bankruptcyHistory?.dateDismissedOrDischarged?.message
                  }
                />
                <FormInput
                  label="Petition Number"
                  id="bankruptcyHistory.petitionNumber"
                  {...register("bankruptcyHistory.petitionNumber")}
                  error={errors.bankruptcyHistory?.petitionNumber?.message}
                />
                <FormInput
                  label="Location Filed"
                  id="bankruptcyHistory.locationFiled"
                  {...register("bankruptcyHistory.locationFiled")}
                  error={errors.bankruptcyHistory?.locationFiled?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other Business Affiliations */}
        <Card>
          <CardHeader>
            <CardTitle>Other Business Affiliations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Does this business have other business affiliations? (e.g., subsidiary or parent companies)"
              id="hasOtherBusinessAffiliations"
              error={errors.hasOtherBusinessAffiliations?.message}
            >
              <RadioGroup
                value={hasOtherBusinessAffiliations ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasOtherBusinessAffiliations", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="aff-yes" />
                  <Label htmlFor="aff-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="aff-no" />
                  <Label htmlFor="aff-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            <p className="text-red-600">
              {errors.businessAffiliations?.message}
            </p>

            {hasOtherBusinessAffiliations && affiliationFields.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <h4 className="font-medium">Affiliation</h4>
                  <FormInput
                    label="Name"
                    id={`businessAffiliations.0.name`}
                    {...register(`businessAffiliations.0.name`)}
                    error={errors.businessAffiliations?.[0]?.name?.message}
                  />
                  <FormInput
                    label="Employer Identification Number"
                    id={`businessAffiliations.0.employerIdentificationNumber`}
                    {...register(
                      `businessAffiliations.0.employerIdentificationNumber`
                    )}
                    error={
                      errors.businessAffiliations?.[0]
                        ?.employerIdentificationNumber?.message
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Parties Owe Money */}
        <Card>
          <CardHeader>
            <CardTitle>Related Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do any related parties (e.g., officers, partners, employees) owe the business money?"
              id="doRelatedPartiesOweMoney"
              error={errors.doRelatedPartiesOweMoney?.message}
            >
              <RadioGroup
                value={doRelatedPartiesOweMoney ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("doRelatedPartiesOweMoney", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="related-yes" />
                  <Label htmlFor="related-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="related-no" />
                  <Label htmlFor="related-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {doRelatedPartiesOweMoney && relatedPartyFields.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <h4 className="font-medium">Related Party Debt</h4>
                  <FormInput
                    label="Name and Address (Street, City, State, ZIP code)"
                    id={`relatedPartyDebts.0.nameAndAddress`}
                    {...register(`relatedPartyDebts.0.nameAndAddress`)}
                    error={
                      errors.relatedPartyDebts?.[0]?.nameAndAddress?.message
                    }
                  />
                  <FormInput
                    type="date"
                    label="Date of Loan (mmddyyyy)"
                    id={`relatedPartyDebts.0.dateOfLoan`}
                    {...register(`relatedPartyDebts.0.dateOfLoan`)}
                    error={errors.relatedPartyDebts?.[0]?.dateOfLoan?.message}
                  />
                  <FormInput
                    type="number"
                    label="Current Balance ($)"
                    id={`relatedPartyDebts.0.currentBalance`}
                    {...register(`relatedPartyDebts.0.currentBalance`, {
                      valueAsNumber: true,
                    })}
                    error={
                      errors.relatedPartyDebts?.[0]?.currentBalance?.message
                    }
                  />
                  <FormInput
                    type="number"
                    label="Payment Amount ($)"
                    id={`relatedPartyDebts.0.paymentAmount`}
                    {...register(`relatedPartyDebts.0.paymentAmount`, {
                      valueAsNumber: true,
                    })}
                    error={
                      errors.relatedPartyDebts?.[0]?.paymentAmount?.message
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Litigation */}
        <Card>
          <CardHeader>
            <CardTitle>Litigation Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you currently or have you been a party in a lawsuit?"
              id="isCurrentlyOrPastPartyToLitigation"
              error={errors.isCurrentlyOrPastPartyToLitigation?.message}
            >
              <RadioGroup
                value={isCurrentlyOrPastPartyToLitigation ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "isCurrentlyOrPastPartyToLitigation",
                    value === "yes"
                  )
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="lit-yes" />
                  <Label htmlFor="lit-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="lit-no" />
                  <Label htmlFor="lit-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {isCurrentlyOrPastPartyToLitigation &&
              litigationFields.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <h4 className="font-medium">Litigation</h4>
                    <FormField
                      label="Role"
                      id={`litigationHistory.0.role`}
                      error={errors.litigationHistory?.[0]?.role?.message}
                    >
                      <RadioGroup
                        value={watch(`litigationHistory.0.role`)}
                        onValueChange={(value) =>
                          setValue(`litigationHistory.0.role`, value)
                        }
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Plaintiff"
                            id={`role-plaintiff-0`}
                          />
                          <Label htmlFor={`role-plaintiff-0`}>Plaintiff</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Defendant"
                            id={`role-defendant-0`}
                          />
                          <Label htmlFor={`role-defendant-0`}>Defendant</Label>
                        </div>
                      </RadioGroup>
                    </FormField>
                    <FormInput
                      label="Location of Filing"
                      id={`litigationHistory.0.locationOfFiling`}
                      {...register(`litigationHistory.0.locationOfFiling`)}
                      error={
                        errors.litigationHistory?.[0]?.locationOfFiling?.message
                      }
                    />
                    <FormInput
                      label="Represented By"
                      id={`litigationHistory.0.representedBy`}
                      {...register(`litigationHistory.0.representedBy`)}
                      error={
                        errors.litigationHistory?.[0]?.representedBy?.message
                      }
                    />
                    <FormInput
                      label="Docket/Case Number"
                      id={`litigationHistory.0.docketCaseNumber`}
                      {...register(`litigationHistory.0.docketCaseNumber`)}
                      error={
                        errors.litigationHistory?.[0]?.docketCaseNumber?.message
                      }
                    />
                    <FormInput
                      type="number"
                      label="Amount in Dispute ($)"
                      id={`litigationHistory.0.amountInDispute`}
                      {...register(`litigationHistory.0.amountInDispute`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.litigationHistory?.[0]?.amountInDispute?.message
                      }
                    />
                    <FormInput
                      type="date"
                      label="Possible Completion Date"
                      id={`litigationHistory.0.possibleCompletionDate`}
                      {...register(
                        `litigationHistory.0.possibleCompletionDate`
                      )}
                      error={
                        errors.litigationHistory?.[0]?.possibleCompletionDate
                          ?.message
                      }
                    />
                    <FormInput
                      label="Subject of Litigation"
                      id={`litigationHistory.0.subjectOfLitigation`}
                      {...register(`litigationHistory.0.subjectOfLitigation`)}
                      error={
                        errors.litigationHistory?.[0]?.subjectOfLitigation
                          ?.message
                      }
                    />
                  </div>
                </div>
              )}

            <FormField
              label="Have you been party to litigation with IRS?"
              id="hasBeenPartyToLitigationWithIRS"
              error={errors.hasBeenPartyToLitigationWithIRS?.message}
            >
              <RadioGroup
                value={hasBeenPartyToLitigationWithIRS ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasBeenPartyToLitigationWithIRS", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="irs-lit-yes" />
                  <Label htmlFor="irs-lit-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="irs-lit-no" />
                  <Label htmlFor="irs-lit-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasBeenPartyToLitigationWithIRS && (
              <FormInput
                label="IRS Litigation Tax Details"
                id="irsLitigationTaxDetails"
                {...register("irsLitigationTaxDetails")}
                error={errors.irsLitigationTaxDetails?.message}
              />
            )}
          </CardContent>
        </Card>

        {/* Asset Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Have you transferred any assets over $10k in past 10 years?"
              id="hasTransferredAssetsOver10kInPast10Years"
              error={errors.hasTransferredAssetsOver10kInPast10Years?.message}
            >
              <RadioGroup
                value={hasTransferredAssetsOver10kInPast10Years ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "hasTransferredAssetsOver10kInPast10Years",
                    value === "yes"
                  )
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="asset-trans-yes" />
                  <Label htmlFor="asset-trans-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="asset-trans-no" />
                  <Label htmlFor="asset-trans-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasTransferredAssetsOver10kInPast10Years &&
              assetTransferFields.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <h4 className="font-medium">Transfer</h4>
                    <FormInput
                      type="date"
                      label="Date"
                      id={`assetTransfersOver10k.0.date`}
                      {...register(`assetTransfersOver10k.0.date`)}
                      error={errors.assetTransfersOver10k?.[0]?.date?.message}
                    />
                    <FormInput
                      type="number"
                      label="Value ($)"
                      id={`assetTransfersOver10k.0.value`}
                      {...register(`assetTransfersOver10k.0.value`, {
                        valueAsNumber: true,
                      })}
                      error={errors.assetTransfersOver10k?.[0]?.value?.message}
                    />
                    <FormInput
                      label="Type of Asset"
                      id={`assetTransfersOver10k.0.typeOfAsset`}
                      {...register(`assetTransfersOver10k.0.typeOfAsset`)}
                      error={
                        errors.assetTransfersOver10k?.[0]?.typeOfAsset?.message
                      }
                    />
                    <FormInput
                      label="Description"
                      id={`assetTransfersOver10k.0.description`}
                      {...register(`assetTransfersOver10k.0.description`)}
                      error={
                        errors.assetTransfersOver10k?.[0]?.description?.message
                      }
                    />
                  </div>
                </div>
              )}

            <FormField
              label="Have you transferred real property in past 3 years?"
              id="hasTransferredRealPropertyInPast3Years"
              error={errors.hasTransferredRealPropertyInPast3Years?.message}
            >
              <RadioGroup
                value={hasTransferredRealPropertyInPast3Years ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "hasTransferredRealPropertyInPast3Years",
                    value === "yes"
                  )
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="real-trans-yes" />
                  <Label htmlFor="real-trans-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="real-trans-no" />
                  <Label htmlFor="real-trans-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasTransferredRealPropertyInPast3Years &&
              realTransferFields.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200  rounded-lg space-y-4">
                    <h4 className="font-medium">Real Property Transfer</h4>
                    <FormInput
                      type="date"
                      label="Date"
                      id={`realPropertyTransfers.0.date`}
                      {...register(`realPropertyTransfers.0.date`)}
                      error={errors.realPropertyTransfers?.[0]?.date?.message}
                    />
                    <FormInput
                      type="number"
                      label="Value ($)"
                      id={`realPropertyTransfers.0.value`}
                      {...register(`realPropertyTransfers.0.value`, {
                        valueAsNumber: true,
                      })}
                      error={errors.realPropertyTransfers?.[0]?.value?.message}
                    />
                    <FormInput
                      label="Type of Asset"
                      id={`realPropertyTransfers.0.typeOfAsset`}
                      {...register(`realPropertyTransfers.0.typeOfAsset`)}
                      error={
                        errors.realPropertyTransfers?.[0]?.typeOfAsset?.message
                      }
                    />
                    <FormInput
                      label="Description"
                      id={`realPropertyTransfers.0.description`}
                      {...register(`realPropertyTransfers.0.description`)}
                      error={
                        errors.realPropertyTransfers?.[0]?.description?.message
                      }
                    />
                  </div>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Location and Assets Outside US */}
        <Card>
          <CardHeader>
            <CardTitle>Location and Foreign Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Have you been located outside the US?"
              id="hasBeenLocatedOutsideUS"
              error={errors.hasBeenLocatedOutsideUS?.message}
            >
              <RadioGroup
                value={hasBeenLocatedOutsideUS ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasBeenLocatedOutsideUS", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="loc-us-yes" />
                  <Label htmlFor="loc-us-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="loc-us-no" />
                  <Label htmlFor="loc-us-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            <FormField
              label="Do you have assets outside the US?"
              id="hasAssetsOutsideUS"
              error={errors.hasAssetsOutsideUS?.message}
            >
              <RadioGroup
                value={hasAssetsOutsideUS ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasAssetsOutsideUS", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="asset-us-yes" />
                  <Label htmlFor="asset-us-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="asset-us-no" />
                  <Label htmlFor="asset-us-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasAssetsOutsideUS && foreignAssetFields.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200  rounded-lg space-y-4">
                  <h4 className="font-medium">Foreign Asset</h4>
                  <FormInput
                    label="Description"
                    id={`foreignAssets.0.description`}
                    {...register(`foreignAssets.0.description`)}
                    error={errors.foreignAssets?.[0]?.description?.message}
                  />
                  <FormInput
                    label="Location"
                    id={`foreignAssets.0.location`}
                    {...register(`foreignAssets.0.location`)}
                    error={errors.foreignAssets?.[0]?.location?.message}
                  />
                  <FormInput
                    type="number"
                    label="Value ($)"
                    id={`foreignAssets.0.value`}
                    {...register(`foreignAssets.0.value`, {
                      valueAsNumber: true,
                    })}
                    error={errors.foreignAssets?.[0]?.value?.message}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Funds Held in Trust */}
        <Card>
          <CardHeader>
            <CardTitle>Funds Held in Trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do you have funds held in trust?"
              id="hasFundsHeldInTrust"
              error={errors.hasFundsHeldInTrust?.message}
            >
              <RadioGroup
                value={hasFundsHeldInTrust ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasFundsHeldInTrust", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="trust-yes" />
                  <Label htmlFor="trust-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="trust-no" />
                  <Label htmlFor="trust-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasFundsHeldInTrust && (
              <div className="space-y-4">
                <FormInput
                  type="number"
                  label="Amount ($)"
                  id="fundsHeldInTrustAmount"
                  {...register("fundsHeldInTrustAmount", {
                    valueAsNumber: true,
                  })}
                  error={errors.fundsHeldInTrustAmount?.message}
                />
                <FormInput
                  label="Location"
                  id="fundsHeldInTrustLocation"
                  {...register("fundsHeldInTrustLocation")}
                  error={errors.fundsHeldInTrustLocation?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lines of Credit */}
        <Card>
          <CardHeader>
            <CardTitle>Lines of Credit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do you have lines of credit?"
              id="hasLinesOfCredit"
              error={errors.hasLinesOfCredit?.message}
            >
              <RadioGroup
                value={hasLinesOfCredit ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasLinesOfCredit", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="credit-yes" />
                  <Label htmlFor="credit-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="credit-no" />
                  <Label htmlFor="credit-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasLinesOfCredit && (
              <div className="space-y-4">
                <FormInput
                  type="number"
                  label="Credit Limit ($)"
                  id="lineOfCredit.creditLimit"
                  {...register("lineOfCredit.creditLimit", {
                    valueAsNumber: true,
                  })}
                  error={errors.lineOfCredit?.creditLimit?.message}
                />
                <FormInput
                  type="number"
                  label="Amount Owed ($)"
                  id="lineOfCredit.amountOwed"
                  {...register("lineOfCredit.amountOwed", {
                    valueAsNumber: true,
                  })}
                  error={errors.lineOfCredit?.amountOwed?.message}
                />
                <FormInput
                  label="Property Securing"
                  id="lineOfCredit.propertySecuring"
                  {...register("lineOfCredit.propertySecuring")}
                  error={errors.lineOfCredit?.propertySecuring?.message}
                />
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
