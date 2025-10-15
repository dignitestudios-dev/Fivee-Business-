"use client";

import { FormNavigation } from "./form-navigation";
import { FormField, FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import useOtherInfo from "@/hooks/433a-form-hooks/useOtherInfo";
import {
  otherInfoInitialValues,
  otherInfoSchema,
} from "@/lib/validation/form433a/other-info-section";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";

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
  const { otherInfo } = useAppSelector((state) => state.form433a);
  const { loading, loadingFormData, handleSaveOtherInfo, handleGetOtherInfo } =
    useOtherInfo();

  // Initialize form with zodResolver
  const methods = useForm<OtherInfoFormSchema>({
    resolver: zodResolver(otherInfoSchema),
    defaultValues: otherInfoInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    reset,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = methods;

  // Field arrays
  const {
    fields: assetTransfers,
    append: addAssetTransfer,
    remove: removeAssetTransfer,
  } = useFieldArray({
    control,
    name: "assetTransfers.transfers",
  });

  const {
    fields: trustBeneficiaries,
    append: addTrustBeneficiary,
    remove: removeTrustBeneficiary,
  } = useFieldArray({
    control,
    name: "trustBeneficiary.beneficiaries",
  });

  const {
    fields: safeDepositBoxes,
    append: addSafeDepositBox,
    remove: removeSafeDepositBox,
  } = useFieldArray({
    control,
    name: "safeDepositBox.boxes",
  });

  const {
    fields: foreignAssets,
    append: addForeignAsset,
    remove: removeForeignAsset,
  } = useFieldArray({
    control,
    name: "foreignAssets.assets",
  });

  const {
    fields: thirdPartyTrustFunds,
    append: addThirdPartyTrustFund,
    remove: removeThirdPartyTrustFund,
  } = useFieldArray({
    control,
    name: "thirdPartyTrusts.funds",
  });

  // Watch form values
  const litigationInvolved = watch("litigation.isInvolvedInLitigation");
  const bankruptcyFiled = watch("bankruptcy.filedBankruptcyInPast7Years");
  const livedOutsideUS = watch("foreignResidence.livedOutsideUS");
  const irsLitigation = watch("irsLitigation.involvedWithIRSLitigation");
  const transferredAssets = watch("assetTransfers.transferredAssets");
  const hasForeignAssets = watch("foreignAssets.hasForeignAssets");
  const hasThirdPartyTrustFunds = watch(
    "thirdPartyTrusts.hasThirdPartyTrustFunds"
  );
  const trustBeneficiary = watch("trustBeneficiary.isBeneficiary");
  const isTrustee = watch("trustFiduciary.isTrusteeOrFiduciary");
  const hasSafeDepositBox = watch("safeDepositBox.hasSafeDepositBox");

  // Handle form submission
  const onSubmit = async (data: OtherInfoFormSchema) => {
    try {
      console.log("Other info:", data);
      await handleSaveOtherInfo(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving other info:", error);
      toast.error(error.message || "Failed to save other information");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (!otherInfo) handleGetOtherInfo(caseId, FORM_433A_SECTIONS[8]);
  }, [caseId]);

  // Reset form with API data
  useEffect(() => {
    if (otherInfo) {
      const normalizedData = {
        ...otherInfoInitialValues,
        ...otherInfo,
        litigation: {
          ...otherInfoInitialValues.litigation,
          ...otherInfo.litigation,
          amountOfDispute: otherInfo.litigation?.amountOfDispute ?? 0,
        },
        bankruptcy: {
          ...otherInfoInitialValues.bankruptcy,
          ...otherInfo.bankruptcy,
        },
        foreignResidence: {
          ...otherInfoInitialValues.foreignResidence,
          ...otherInfo.foreignResidence,
        },
        irsLitigation: {
          ...otherInfoInitialValues.irsLitigation,
          ...otherInfo.irsLitigation,
        },
        trustBeneficiary: {
          ...otherInfoInitialValues.trustBeneficiary,
          ...otherInfo.trustBeneficiary,
          anticipatedAmount: otherInfo.trustBeneficiary?.anticipatedAmount ?? 0,
        },
        trustFiduciary: {
          ...otherInfoInitialValues.trustFiduciary,
          ...otherInfo.trustFiduciary,
        },
        safeDepositBox: {
          ...otherInfoInitialValues.safeDepositBox,
          ...otherInfo.safeDepositBox,
          boxes:
            otherInfo.safeDepositBox?.boxes?.map((box: any) => ({
              ...box,
              value: box.value ?? 0,
            })) || [],
        },
        assetTransfers: {
          ...otherInfoInitialValues.assetTransfers,
          ...otherInfo.assetTransfers,
          transfers:
            otherInfo.assetTransfers?.transfers?.map((transfer: any) => ({
              ...transfer,
              valueAtTransfer: transfer.valueAtTransfer ?? 0,
            })) || [],
        },
        foreignAssets: {
          ...otherInfoInitialValues.foreignAssets,
          ...otherInfo.foreignAssets,
          assets:
            otherInfo.foreignAssets?.assets?.map((asset: any) => ({
              ...asset,
              value: asset.value ?? 0,
            })) || [],
        },
        thirdPartyTrusts: {
          ...otherInfoInitialValues.thirdPartyTrusts,
          ...otherInfo.thirdPartyTrusts,
          funds:
            otherInfo.thirdPartyTrusts?.funds?.map((fund: any) => ({
              ...fund,
              amount: fund.amount ?? 0,
            })) || [],
        },
      };
      reset(normalizedData);
      trigger(); // Validate after reset to catch any issues
    }
  }, [otherInfo, reset, trigger]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 9: Other Information
          </h2>
          <p className="text-gray-600">
            Additional Information IRS needs to consider settlement of your tax
            debt. If you or your business are currently in a bankruptcy
            proceeding, you are not eligible to apply for an offer.
          </p>
        </div>

        {/* Litigation */}
        <Card>
          <CardHeader>
            <CardTitle>Litigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you a party to or involved in litigation (if yes, answer the following)"
              id="litigation.isInvolvedInLitigation"
              error={errors.litigation?.isInvolvedInLitigation?.message}
            >
              <RadioGroup
                value={litigationInvolved ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "litigation.isInvolvedInLitigation",
                    value === "yes",
                    {
                      shouldValidate: true,
                    }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="litigation-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="litigation-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="litigation-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="litigation-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {litigationInvolved && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Plaintiff</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Location of filing"
                      id="litigation.locationOfFiling"
                      {...register("litigation.locationOfFiling")}
                      error={errors.litigation?.locationOfFiling?.message}
                    />
                    <FormInput
                      label="Represented by"
                      id="litigation.representedBy"
                      {...register("litigation.representedBy")}
                      error={errors.litigation?.representedBy?.message}
                    />
                    <FormInput
                      label="Docket/Case number"
                      id="litigation.docketCaseNumber"
                      {...register("litigation.docketCaseNumber")}
                      error={errors.litigation?.docketCaseNumber?.message}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Defendant</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Possible completion date (mm/dd/yyyy)"
                      id="litigation.possibleCompletionDate"
                      type="date"
                      {...register("litigation.possibleCompletionDate")}
                      error={errors.litigation?.possibleCompletionDate?.message}
                    />
                    <FormInput
                      label="Subject of litigation"
                      id="litigation.subjectOfLitigation"
                      {...register("litigation.subjectOfLitigation")}
                      error={errors.litigation?.subjectOfLitigation?.message}
                    />
                  </div>
                </div>

                <FormInput
                  label="Amount of dispute"
                  id="litigation.amountOfDispute"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("litigation.amountOfDispute", {
                    valueAsNumber: true,
                  })}
                  error={errors.litigation?.amountOfDispute?.message}
                  className="max-w-md"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bankruptcy */}
        <Card>
          <CardHeader>
            <CardTitle>Bankruptcy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Have you filed bankruptcy in the past 7 years (if yes, answer the following)"
              id="bankruptcy.filedBankruptcyInPast7Years"
              error={errors.bankruptcy?.filedBankruptcyInPast7Years?.message}
            >
              <RadioGroup
                value={bankruptcyFiled ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "bankruptcy.filedBankruptcyInPast7Years",
                    value === "yes",
                    { shouldValidate: true }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="bankruptcy-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="bankruptcy-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="bankruptcy-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="bankruptcy-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {bankruptcyFiled && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormInput
                  label="Date filed (mm/dd/yyyy)"
                  id="bankruptcy.dateFiled"
                  type="date"
                  {...register("bankruptcy.dateFiled")}
                  error={errors.bankruptcy?.dateFiled?.message}
                />
                <FormInput
                  label="Date dismissed (mm/dd/yyyy)"
                  id="bankruptcy.dateDismissed"
                  type="date"
                  {...register("bankruptcy.dateDismissed")}
                  error={errors.bankruptcy?.dateDismissed?.message}
                />
                <FormInput
                  label="Date discharged (mm/dd/yyyy)"
                  id="bankruptcy.dateDischarged"
                  type="date"
                  {...register("bankruptcy.dateDischarged")}
                  error={errors.bankruptcy?.dateDischarged?.message}
                />
                <FormInput
                  label="Petition no."
                  id="bankruptcy.petitionNumber"
                  {...register("bankruptcy.petitionNumber")}
                  error={errors.bankruptcy?.petitionNumber?.message}
                />
                <FormInput
                  label="Location filed"
                  id="bankruptcy.locationFiled"
                  {...register("bankruptcy.locationFiled")}
                  error={errors.bankruptcy?.locationFiled?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lived Outside US */}
        <Card>
          <CardHeader>
            <CardTitle>Lived Outside of the U.S.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="In the past 10 years, have you lived outside of the U.S. for 6 months or longer (if yes, answer the following)"
              id="foreignResidence.livedOutsideUS"
              error={errors.foreignResidence?.livedOutsideUS?.message}
            >
              <RadioGroup
                value={livedOutsideUS ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("foreignResidence.livedOutsideUS", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="lived-outside-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="lived-outside-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="lived-outside-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="lived-outside-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {livedOutsideUS && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="From (mm/dd/yyyy)"
                  id="foreignResidence.dateFrom"
                  type="date"
                  {...register("foreignResidence.dateFrom")}
                  error={errors.foreignResidence?.dateFrom?.message}
                />
                <FormInput
                  label="To (mm/dd/yyyy)"
                  id="foreignResidence.dateTo"
                  type="date"
                  {...register("foreignResidence.dateTo")}
                  error={errors.foreignResidence?.dateTo?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* IRS Litigation */}
        <Card>
          <CardHeader>
            <CardTitle>Litigation Involving the IRS/United States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you or have you ever been party to a litigation involving the IRS/United States (including any tax litigation)"
              id="irsLitigation.involvedWithIRSLitigation"
              error={errors.irsLitigation?.involvedWithIRSLitigation?.message}
            >
              <RadioGroup
                value={irsLitigation ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "irsLitigation.involvedWithIRSLitigation",
                    value === "yes",
                    {
                      shouldValidate: true,
                    }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="irs-litigation-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="irs-litigation-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="irs-litigation-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="irs-litigation-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {irsLitigation && (
              <div className="space-y-4">
                <Textarea
                  id="irsLitigation.taxDebtDetails"
                  placeholder="Provide the types of tax and periods involved"
                  {...register("irsLitigation.taxDebtDetails")}
                  className={`h-32 ${
                    errors.irsLitigation?.taxDebtDetails?.message &&
                    "border-red-600"
                  }`}
                />
                {errors.irsLitigation?.taxDebtDetails?.message && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.irsLitigation?.taxDebtDetails?.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transferred Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Transferred Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="In the past 10 years, have you transferred any asset with a fair market value of more than $10,000 including real property, for less than their full value (if yes, answer the following)"
              id="assetTransfers.transferredAssets"
              error={errors.assetTransfers?.transferredAssets?.message}
            >
              <RadioGroup
                value={transferredAssets ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "assetTransfers.transferredAssets",
                    value === "yes",
                    {
                      shouldValidate: true,
                    }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="transferred-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="transferred-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="transferred-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="transferred-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {transferredAssets && (
              <div className="space-y-4">
                {assetTransfers.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">
                        Transferred Asset {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAssetTransfer(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="List asset(s)"
                      id={`assetTransfers.transfers.${index}.assetDescription`}
                      {...register(
                        `assetTransfers.transfers.${index}.assetDescription`
                      )}
                      error={
                        errors.assetTransfers?.transfers?.[index]
                          ?.assetDescription?.message
                      }
                    />
                    <FormInput
                      label="Value at time of transfer"
                      id={`assetTransfers.transfers.${index}.valueAtTransfer`}
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(
                        `assetTransfers.transfers.${index}.valueAtTransfer`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                      error={
                        errors.assetTransfers?.transfers?.[index]
                          ?.valueAtTransfer?.message
                      }
                    />
                    <FormInput
                      label="Date transferred (mm/dd/yyyy)"
                      id={`assetTransfers.transfers.${index}.dateTransferred`}
                      type="date"
                      {...register(
                        `assetTransfers.transfers.${index}.dateTransferred`
                      )}
                      error={
                        errors.assetTransfers?.transfers?.[index]
                          ?.dateTransferred?.message
                      }
                    />
                    <FormInput
                      label="To whom or where it was transferred"
                      id={`assetTransfers.transfers.${index}.transferredTo`}
                      {...register(
                        `assetTransfers.transfers.${index}.transferredTo`
                      )}
                      error={
                        errors.assetTransfers?.transfers?.[index]?.transferredTo
                          ?.message
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addAssetTransfer({
                      assetDescription: "",
                      valueAtTransfer: 0,
                      dateTransferred: "",
                      transferredTo: "",
                    })
                  }
                  className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transferred Asset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Foreign Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Assets or Real Property Outside the U.S.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do you have any assets or own any real property outside the U.S. If yes, provide description, location, and value"
              id="foreignAssets.hasForeignAssets"
              error={errors.foreignAssets?.hasForeignAssets?.message}
            >
              <RadioGroup
                value={hasForeignAssets ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("foreignAssets.hasForeignAssets", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="assets-outside-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="assets-outside-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="assets-outside-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="assets-outside-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasForeignAssets && (
              <div className="space-y-4">
                {foreignAssets.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">
                        Foreign Asset {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeForeignAsset(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Description"
                      id={`foreignAssets.assets.${index}.description`}
                      {...register(`foreignAssets.assets.${index}.description`)}
                      error={
                        errors.foreignAssets?.assets?.[index]?.description
                          ?.message
                      }
                    />
                    <FormInput
                      label="Location"
                      id={`foreignAssets.assets.${index}.location`}
                      {...register(`foreignAssets.assets.${index}.location`)}
                      error={
                        errors.foreignAssets?.assets?.[index]?.location?.message
                      }
                    />
                    <FormInput
                      label="Value ($)"
                      id={`foreignAssets.assets.${index}.value`}
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(`foreignAssets.assets.${index}.value`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.foreignAssets?.assets?.[index]?.value?.message
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addForeignAsset({
                      description: "",
                      location: "",
                      value: 0,
                    })
                  }
                  className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Foreign Asset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Third Party Trust Funds */}
        <Card>
          <CardHeader>
            <CardTitle>Funds Being Held in Trust by a Third Party</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do you have any funds being held in trust by a third party If yes, how much $ Where"
              id="thirdPartyTrusts.hasThirdPartyTrustFunds"
              error={errors.thirdPartyTrusts?.hasThirdPartyTrustFunds?.message}
            >
              <RadioGroup
                value={hasThirdPartyTrustFunds ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "thirdPartyTrusts.hasThirdPartyTrustFunds",
                    value === "yes",
                    { shouldValidate: true }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="funds-trust-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="funds-trust-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="funds-trust-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="funds-trust-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasThirdPartyTrustFunds && (
              <div className="space-y-4">
                {thirdPartyTrustFunds.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">
                        Trust Fund {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeThirdPartyTrustFund(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Location"
                      id={`thirdPartyTrusts.funds.${index}.location`}
                      {...register(`thirdPartyTrusts.funds.${index}.location`)}
                      error={
                        errors.thirdPartyTrusts?.funds?.[index]?.location
                          ?.message
                      }
                    />
                    <FormInput
                      label="Amount ($)"
                      id={`thirdPartyTrusts.funds.${index}.amount`}
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(`thirdPartyTrusts.funds.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.thirdPartyTrusts?.funds?.[index]?.amount?.message
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addThirdPartyTrustFund({
                      location: "",
                      amount: 0,
                    })
                  }
                  className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trust Fund
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Beneficiary */}
        <Card>
          <CardHeader>
            <CardTitle>
              The Beneficiary of a Trust, Estate, or Life Insurance Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you the beneficiary of a trust, estate, or life insurance policy, including those located in foreign countries or jurisdictions (if yes, answer the following)"
              id="trustBeneficiary.isBeneficiary"
              error={errors.trustBeneficiary?.isBeneficiary?.message}
            >
              <RadioGroup
                value={trustBeneficiary ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("trustBeneficiary.isBeneficiary", value === "yes", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="beneficiary-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="beneficiary-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="beneficiary-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="beneficiary-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {trustBeneficiary && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Place where recorded"
                    id="trustBeneficiary.placeRecorded"
                    {...register("trustBeneficiary.placeRecorded")}
                    error={errors.trustBeneficiary?.placeRecorded?.message}
                  />
                  <FormInput
                    label="Name of the trust, estate, or policy"
                    id="trustBeneficiary.nameOfTrust"
                    {...register("trustBeneficiary.nameOfTrust")}
                    error={errors.trustBeneficiary?.nameOfTrust?.message}
                  />
                  <FormInput
                    label="EIN"
                    id="trustBeneficiary.ein"
                    {...register("trustBeneficiary.ein")}
                    error={errors.trustBeneficiary?.ein?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Anticipated amount to be received ($)"
                    id="trustBeneficiary.anticipatedAmount"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("trustBeneficiary.anticipatedAmount", {
                      valueAsNumber: true,
                    })}
                    error={errors.trustBeneficiary?.anticipatedAmount?.message}
                  />
                  <FormInput
                    label="When will the amount be received"
                    id="trustBeneficiary.whenAmountReceived"
                    {...register("trustBeneficiary.whenAmountReceived")}
                    error={errors.trustBeneficiary?.whenAmountReceived?.message}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trustee */}
        <Card>
          <CardHeader>
            <CardTitle>Trustee, Fiduciary, or Contributor of a Trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Are you a trustee, fiduciary, or contributor of a trust"
              id="trustFiduciary.isTrusteeOrFiduciary"
              error={errors.trustFiduciary?.isTrusteeOrFiduciary?.message}
            >
              <RadioGroup
                value={isTrustee ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "trustFiduciary.isTrusteeOrFiduciary",
                    value === "yes",
                    {
                      shouldValidate: true,
                    }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="trustee-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="trustee-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="trustee-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="trustee-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {isTrustee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name of the trust"
                  id="trustFiduciary.nameOfTrust"
                  {...register("trustFiduciary.nameOfTrust")}
                  error={errors.trustFiduciary?.nameOfTrust?.message}
                />
                <FormInput
                  label="EIN"
                  id="trustFiduciary.ein"
                  {...register("trustFiduciary.ein")}
                  error={errors.trustFiduciary?.ein?.message}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safe Deposit Box */}
        <Card>
          <CardHeader>
            <CardTitle>
              Safe Deposit Box (Business or Personal) Including Those Located in
              Foreign Countries or Jurisdictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Do you have a safe deposit box (business or personal) including those located in foreign countries or jurisdictions (if yes, answer the following)"
              id="safeDepositBox.hasSafeDepositBox"
              error={errors.safeDepositBox?.hasSafeDepositBox?.message}
            >
              <RadioGroup
                value={hasSafeDepositBox ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue(
                    "safeDepositBox.hasSafeDepositBox",
                    value === "yes",
                    {
                      shouldValidate: true,
                    }
                  )
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="safe-box-yes"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="safe-box-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="safe-box-no"
                    className="text-[#22b573]"
                  />
                  <Label htmlFor="safe-box-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>

            {hasSafeDepositBox && (
              <div className="space-y-4">
                {safeDepositBoxes.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">
                        Safe Deposit Box {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSafeDepositBox(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Location (name, address and box number(s))"
                      id={`safeDepositBox.boxes.${index}.location`}
                      {...register(`safeDepositBox.boxes.${index}.location`)}
                      error={
                        errors.safeDepositBox?.boxes?.[index]?.location?.message
                      }
                    />
                    <FormInput
                      label="Contents"
                      id={`safeDepositBox.boxes.${index}.contents`}
                      {...register(`safeDepositBox.boxes.${index}.contents`)}
                      error={
                        errors.safeDepositBox?.boxes?.[index]?.contents?.message
                      }
                    />
                    <FormInput
                      label="Value ($)"
                      id={`safeDepositBox.boxes.${index}.value`}
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(`safeDepositBox.boxes.${index}.value`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.safeDepositBox?.boxes?.[index]?.value?.message
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addSafeDepositBox({
                      location: "",
                      contents: "",
                      value: 0,
                    })
                  }
                  className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Safe Deposit Box
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Form Error */}
        {Object.keys(errors).length > 0 && (
          <p className="text-red-600 text-sm mt-2">
            Please correct the form errors before submitting.
          </p>
        )}

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
