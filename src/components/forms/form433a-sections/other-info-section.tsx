import { FormNavigation } from "./form-navigation";
import { FormField, FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface OtherInfoSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
}

export function OtherInfoSection({
  onNext,
  onPrevious,
  onSubmit,
  currentStep,
  totalSteps,
}: OtherInfoSectionProps) {
  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormData433A>();

  // Transferred assets field array
  const {
    fields: transferredAssets,
    append: addTransferredAsset,
    remove: removeTransferredAsset,
  } = useFieldArray({
    control,
    name: "transferredAssets",
  });

  // Trust beneficiaries field array
  const {
    fields: trustBeneficiaries,
    append: addTrustBeneficiary,
    remove: removeTrustBeneficiary,
  } = useFieldArray({
    control,
    name: "trustBeneficiaries",
  });

  const litigationInvolved = watch("litigationInvolved");
  const bankruptcyFiled = watch("bankruptcyFiled");
  const livedOutsideUS = watch("livedOutsideUS");
  const irsLitigation = watch("irsLitigation");
  const irsLitigationIncludedTax = watch("irsLitigationIncludedTax");
  const transferredAnyAsset = watch("transferredAnyAsset");
  const assetsOutsideUS = watch("assetsOutsideUS");
  const fundsInTrust = watch("fundsInTrust");
  const trustBeneficiary = watch("trustBeneficiary");
  const isTrustee = watch("isTrustee");
  const safeDepositBox = watch("safeDepositBox");

  return (
    <div className="space-y-8">
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
            id="litigationInvolved"
            error={errors.litigationInvolved?.message}
          >
            <RadioGroup
              value={litigationInvolved}
              onValueChange={(value) => setValue("litigationInvolved", value)}
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

          {litigationInvolved === "yes" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Plaintiff</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Location of filing"
                    id="litigationPlaintiffLocation"
                    {...register("litigationPlaintiffLocation")}
                    error={errors.litigationPlaintiffLocation?.message}
                  />
                  <FormInput
                    label="Represented by"
                    id="litigationPlaintiffRepresented"
                    {...register("litigationPlaintiffRepresented")}
                    error={errors.litigationPlaintiffRepresented?.message}
                  />
                  <FormInput
                    label="Docket/Case number"
                    id="litigationPlaintiffDocket"
                    {...register("litigationPlaintiffDocket")}
                    error={errors.litigationPlaintiffDocket?.message}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Defendant</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Possible completion date (mm/dd/yyyy)"
                    id="litigationDefendantCompletionDate"
                    type="date"
                    {...register("litigationDefendantCompletionDate")}
                    error={errors.litigationDefendantCompletionDate?.message}
                  />
                  <FormInput
                    label="Subject of litigation"
                    id="litigationDefendantSubject"
                    {...register("litigationDefendantSubject")}
                    error={errors.litigationDefendantSubject?.message}
                  />
                </div>
              </div>

              <FormInput
                label="Amount of dispute"
                id="litigationAmount"
                type="number"
                min="0"
                placeholder="0"
                {...register("litigationAmount", { valueAsNumber: true })}
                error={errors.litigationAmount?.message}
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
            id="bankruptcyFiled"
            error={errors.bankruptcyFiled?.message}
          >
            <RadioGroup
              value={bankruptcyFiled}
              onValueChange={(value) => setValue("bankruptcyFiled", value)}
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

          {bankruptcyFiled === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FormInput
                label="Date filed (mm/dd/yyyy)"
                id="bankruptcyDateFiled"
                type="date"
                {...register("bankruptcyDateFiled")}
                error={errors.bankruptcyDateFiled?.message}
              />
              <FormInput
                label="Date dismissed (mm/dd/yyyy)"
                id="bankruptcyDateDismissed"
                type="date"
                {...register("bankruptcyDateDismissed")}
                error={errors.bankruptcyDateDismissed?.message}
              />
              <FormInput
                label="Date discharged (mm/dd/yyyy)"
                id="bankruptcyDateDischarged"
                type="date"
                {...register("bankruptcyDateDischarged")}
                error={errors.bankruptcyDateDischarged?.message}
              />
              <FormInput
                label="Petition no."
                id="bankruptcyPetitionNo"
                {...register("bankruptcyPetitionNo")}
                error={errors.bankruptcyPetitionNo?.message}
              />
              <FormInput
                label="Location filed"
                id="bankruptcyLocation"
                {...register("bankruptcyLocation")}
                error={errors.bankruptcyLocation?.message}
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
            id="livedOutsideUS"
            error={errors.livedOutsideUS?.message}
          >
            <RadioGroup
              value={livedOutsideUS}
              onValueChange={(value) => setValue("livedOutsideUS", value)}
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

          {livedOutsideUS === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="From (mm/dd/yyyy)"
                id="livedOutsideFrom"
                type="date"
                {...register("livedOutsideFrom")}
                error={errors.livedOutsideFrom?.message}
              />
              <FormInput
                label="To (mm/dd/yyyy)"
                id="livedOutsideTo"
                type="date"
                {...register("livedOutsideTo")}
                error={errors.livedOutsideTo?.message}
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
            id="irsLitigation"
            error={errors.irsLitigation?.message}
          >
            <RadioGroup
              value={irsLitigation}
              onValueChange={(value) => setValue("irsLitigation", value)}
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

          {irsLitigation === "yes" && (
            <div className="space-y-4">
              <FormField
                label="Did the litigation include tax debt?"
                id="irsLitigationIncludedTax"
                error={errors.irsLitigationIncludedTax?.message}
              >
                <RadioGroup
                  value={irsLitigationIncludedTax}
                  onValueChange={(value) =>
                    setValue("irsLitigationIncludedTax", value)
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="irs-tax-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="irs-tax-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="irs-tax-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="irs-tax-no">No</Label>
                  </div>
                </RadioGroup>
              </FormField>

              {irsLitigationIncludedTax === "yes" && (
                <>
                  <Textarea
                    id="irsLitigationDescription"
                    placeholder="Provide the types of tax and periods involved"
                    {...register("irsLitigationDescription")}
                    className={`h-32 ${errors.irsLitigationDescription?.message && "border-red-600"}`}
                  />
                  {errors.irsLitigationDescription?.message && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.irsLitigationDescription?.message}
                    </p>
                  )}
                </>
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
            id="transferredAnyAsset"
            error={errors.transferredAnyAsset?.message}
          >
            <RadioGroup
              value={transferredAnyAsset}
              onValueChange={(value) => setValue("transferredAnyAsset", value)}
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

          {transferredAnyAsset === "yes" && (
            <div className="space-y-4">
              {transferredAssets.map((field, index) => (
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
                      onClick={() => removeTransferredAsset(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormInput
                    label="List asset(s)"
                    id={`transferredAssets.${index}.asset`}
                    {...register(`transferredAssets.${index}.asset`)}
                    error={errors.transferredAssets?.[index]?.asset?.message}
                  />
                  <FormInput
                    label="Value at time of transfer"
                    id={`transferredAssets.${index}.value`}
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register(`transferredAssets.${index}.value`, {
                      valueAsNumber: true,
                    })}
                    error={errors.transferredAssets?.[index]?.value?.message}
                  />
                  <FormInput
                    label="Date transferred (mm/dd/yyyy)"
                    id={`transferredAssets.${index}.date`}
                    type="date"
                    {...register(`transferredAssets.${index}.date`)}
                    error={errors.transferredAssets?.[index]?.date?.message}
                  />
                  <FormInput
                    label="To whom or where it was transferred"
                    id={`transferredAssets.${index}.toWhom`}
                    {...register(`transferredAssets.${index}.toWhom`)}
                    error={errors.transferredAssets?.[index]?.toWhom?.message}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addTransferredAsset({
                    asset: "",
                    value: 0,
                    date: "",
                    toWhom: "",
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

      {/* Assets Outside US */}
      <Card>
        <CardHeader>
          <CardTitle>Assets or Real Property Outside the U.S.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="Do you have any assets or own any real property outside the U.S. If yes, provide description, location, and value"
            id="assetsOutsideUS"
            error={errors.assetsOutsideUS?.message}
          >
            <RadioGroup
              value={assetsOutsideUS}
              onValueChange={(value) => setValue("assetsOutsideUS", value)}
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

          {assetsOutsideUS === "yes" && (
            <Textarea
              id="assetsOutsideUSDescription"
              placeholder="Provide description, location, and value"
              {...register("assetsOutsideUSDescription")}
              className="h-32"
            />
          )}
        </CardContent>
      </Card>

      {/* Funds in Trust */}
      <Card>
        <CardHeader>
          <CardTitle>Funds Being Held in Trust by a Third Party</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="Do you have any funds being held in trust by a third party If yes, how much $ Where"
            id="fundsInTrust"
            error={errors.fundsInTrust?.message}
          >
            <RadioGroup
              value={fundsInTrust}
              onValueChange={(value) => setValue("fundsInTrust", value)}
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

          {fundsInTrust === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="How much ($)"
                id="fundsInTrustAmount"
                type="number"
                min="0"
                placeholder="0"
                {...register("fundsInTrustAmount", { valueAsNumber: true })}
                error={errors.fundsInTrustAmount?.message}
              />
              <FormInput
                label="Where"
                id="fundsInTrustWhere"
                {...register("fundsInTrustWhere")}
                error={errors.fundsInTrustWhere?.message}
              />
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
            id="trustBeneficiary"
            error={errors.trustBeneficiary?.message}
          >
            <RadioGroup
              value={trustBeneficiary}
              onValueChange={(value) => setValue("trustBeneficiary", value)}
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

          {trustBeneficiary === "yes" && (
            <div className="space-y-4">
              {trustBeneficiaries.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">
                      Beneficiary {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTrustBeneficiary(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormInput
                    label="Place where recorded"
                    id={`trustBeneficiaries.${index}.place`}
                    {...register(`trustBeneficiaries.${index}.place`)}
                    error={errors.trustBeneficiaries?.[index]?.place?.message}
                  />
                  <FormInput
                    label="Name of the trust, estate, or policy"
                    id={`trustBeneficiaries.${index}.name`}
                    {...register(`trustBeneficiaries.${index}.name`)}
                    error={errors.trustBeneficiaries?.[index]?.name?.message}
                  />
                  <FormInput
                    label="Anticipated amount to be received ($)"
                    id={`trustBeneficiaries.${index}.amount`}
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register(`trustBeneficiaries.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    error={errors.trustBeneficiaries?.[index]?.amount?.message}
                  />
                  <FormInput
                    label="When will the amount be received"
                    id={`trustBeneficiaries.${index}.when`}
                    {...register(`trustBeneficiaries.${index}.when`)}
                    error={errors.trustBeneficiaries?.[index]?.when?.message}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addTrustBeneficiary({
                    place: "",
                    name: "",
                    amount: 0,
                    when: "",
                  })
                }
                className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Beneficiary
              </Button>
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
            id="isTrustee"
            error={errors.isTrustee?.message}
          >
            <RadioGroup
              value={isTrustee}
              onValueChange={(value) => setValue("isTrustee", value)}
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

          {isTrustee === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Name of the trust"
                id="trusteeName"
                {...register("trusteeName")}
                error={errors.trusteeName?.message}
              />
              <FormInput
                label="EIN"
                id="trusteeEIN"
                {...register("trusteeEIN")}
                error={errors.trusteeEIN?.message}
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
            id="safeDepositBox"
            error={errors.safeDepositBox?.message}
          >
            <RadioGroup
              value={safeDepositBox}
              onValueChange={(value) => setValue("safeDepositBox", value)}
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

          {safeDepositBox === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Location (name, address and box number(s))"
                id="safeDepositBoxLocation"
                {...register("safeDepositBoxLocation")}
                error={errors.safeDepositBoxLocation?.message}
              />
              <FormInput
                label="Contents"
                id="safeDepositBoxContents"
                {...register("safeDepositBoxContents")}
                error={errors.safeDepositBoxContents?.message}
              />
              <FormInput
                label="Value ($)"
                id="safeDepositBoxValue"
                type="number"
                min="0"
                placeholder="0"
                {...register("safeDepositBoxValue", { valueAsNumber: true })}
                error={errors.safeDepositBoxValue?.message}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
