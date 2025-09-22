import { FormNavigation } from "./form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { toTitleCase } from "@/utils/helper";

interface PersonalAssetsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function PersonalAssetsSection({
  onNext,
  onPrevious,
  onSubmit,
  currentStep,
  totalSteps,
  validateStep,
}: PersonalAssetsSectionProps) {
  const {
    register,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormData433A>();

  // --- BANK ACCOUNTS ---
  const {
    fields: bankAccounts,
    append: addBankAccount,
    remove: removeBankAccount,
  } = useFieldArray({
    control,
    name: "bankAccounts",
  });

  // --- INVESTMENTS ---
  const {
    fields: investments,
    append: addInvestment,
    remove: removeInvestment,
  } = useFieldArray({
    control,
    name: "investments",
  });

  // --- DIGITAL ASSETS ---
  const {
    fields: digitalAssets,
    append: addDigitalAsset,
    remove: removeDigitalAsset,
  } = useFieldArray({
    control,
    name: "digitalAssets",
  });

  // --- RETIREMENT ACCOUNTS ---
  const {
    fields: retirementAccounts,
    append: addRetirementAccount,
    remove: removeRetirementAccount,
  } = useFieldArray({
    control,
    name: "retirementAccounts",
  });

  // --- LIFE INSURANCE ---
  const {
    fields: lifeInsurance,
    append: addLifeInsurance,
    remove: removeLifeInsurance,
  } = useFieldArray({
    control,
    name: "lifeInsurance",
  });

  // --- REAL PROPERTY ---
  const {
    fields: realProperty,
    append: addRealProperty,
    remove: removeRealProperty,
  } = useFieldArray({ control, name: "realProperty" });

  // --- VEHICLES ---
  const {
    fields: vehicles,
    append: addVehicle,
    remove: removeVehicle,
  } = useFieldArray({ control, name: "vehicles" });

  // --- OTHER VALUABLE ITEMS ---
  const {
    fields: valuables,
    append: addValuable,
    remove: removeValuable,
  } = useFieldArray({ control, name: "valuables" });

  // --- FURNITURE ---
  const {
    fields: furniture,
    append: addFurniture,
    remove: removeFurniture,
  } = useFieldArray({ control, name: "furniture" });

  // Watch property sale status
  const propertySaleStatus = watch("propertySaleStatus");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 3: Personal Asset Information (Domestic and Foreign)
        </h2>
        <p className="text-gray-600">
          Use the most current statement for each type of account. Asset value
          is subject to adjustment by IRS based on individual circumstances.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Round to the nearest dollar. Do not enter a negative number. If any
          line item is a negative number, enter "0".
        </p>
      </div>

      {/* Cash and Investments (Domestic and Foreign) */}
      <Card>
        <CardHeader>
          <CardTitle>Cash and Investments (Domestic and Foreign)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bank Accounts */}
          {bankAccounts.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Bank Account {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBankAccount(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Account Type Radio Buttons */}
              <FormField
                label="Account Type"
                id={`bankAccounts.${index}.accountType`}
                required
                error={errors.bankAccounts?.[index]?.accountType?.message}
              >
                <RadioGroup
                  value={watch(`bankAccounts.${index}.accountType`)}
                  onValueChange={(value) =>
                    setValue(`bankAccounts.${index}.accountType`, value)
                  }
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {[
                    "Cash",
                    "Checking",
                    "Savings",
                    "Money Market Account/CD",
                    "Online Account",
                    "Stored Value Card",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={type}
                        id={`bank-${index}-${type
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="text-[#22b573]"
                      />
                      <Label
                        htmlFor={`bank-${index}-${type
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="text-sm"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormField>

              {/* Account Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Bank Name & Country Location"
                  id={`bankAccounts.${index}.bankName`}
                  required
                  {...register(`bankAccounts.${index}.bankName`)}
                  error={errors.bankAccounts?.[index]?.bankName?.message}
                />

                <FormInput
                  label="Account Number"
                  id={`bankAccounts.${index}.accountNumber`}
                  required
                  {...register(`bankAccounts.${index}.accountNumber`)}
                  error={errors.bankAccounts?.[index]?.accountNumber?.message}
                />

                <FormInput
                  label="Balance ($)"
                  id={`bankAccounts.${index}.balance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`bankAccounts.${index}.balance`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Balance cannot be negative" },
                  })}
                  error={errors.bankAccounts?.[index]?.balance?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addBankAccount({
                accountType: "",
                bankName: "",
                accountNumber: "",
                balance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        </CardContent>
      </Card>

      {/* Investment Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Accounts (Domestic and Foreign)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investments.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Investment Account {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeInvestment(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Investment Type Radio Buttons */}
              <FormField
                label="Investment Type"
                id={`investments.${index}.type`}
                required
                error={errors.investments?.[index]?.type?.message}
              >
                <RadioGroup
                  value={watch(`investments.${index}.type`)}
                  onValueChange={(value) =>
                    setValue(`investments.${index}.type`, value)
                  }
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {["Investment Account", "Stocks", "Bonds", "Other"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={type}
                          id={`investment-${index}-${type
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="text-[#22b573]"
                        />
                        <Label
                          htmlFor={`investment-${index}-${type
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="text-sm"
                        >
                          {type}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Name of Financial Institution & Country Location"
                  id={`investments.${index}.institutionName`}
                  required
                  {...register(`investments.${index}.institutionName`)}
                  error={errors.investments?.[index]?.institutionName?.message}
                />

                <FormInput
                  label="Account Number"
                  id={`investments.${index}.accountNumber`}
                  required
                  {...register(`investments.${index}.accountNumber`)}
                  error={errors.investments?.[index]?.accountNumber?.message}
                />

                <FormInput
                  label="Current Market Value ($)"
                  id={`investments.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`investments.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={errors.investments?.[index]?.marketValue?.message}
                />
              </div>

              <FormInput
                label="Minus Loan Balance ($)"
                id={`investments.${index}.loanBalance`}
                type="number"
                min="0"
                placeholder="0"
                {...register(`investments.${index}.loanBalance`, {
                  valueAsNumber: true,
                  min: { value: 0, message: "Loan balance cannot be negative" },
                })}
                error={errors.investments?.[index]?.loanBalance?.message}
                className="max-w-md"
              />

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Net Value: $
                  {Math.max(
                    0,
                    (watch(`investments.${index}.marketValue`) || 0) -
                      (watch(`investments.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addInvestment({
                type: "",
                institutionName: "",
                accountNumber: "",
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Investment Account
          </Button>
        </CardContent>
      </Card>

      {/* Digital Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {digitalAssets.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Digital Asset {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDigitalAsset(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Description of Digital Asset"
                  id={`digitalAssets.${index}.description`}
                  required
                  {...register(`digitalAssets.${index}.description`)}
                  error={errors.digitalAssets?.[index]?.description?.message}
                />

                <FormInput
                  label="Number of Units"
                  id={`digitalAssets.${index}.units`}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  required
                  {...register(`digitalAssets.${index}.units`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Units cannot be negative" },
                  })}
                  error={errors.digitalAssets?.[index]?.units?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Location of Digital Asset (exchange account, self-hosted wallet)"
                  id={`digitalAssets.${index}.location`}
                  required
                  {...register(`digitalAssets.${index}.location`)}
                  error={errors.digitalAssets?.[index]?.location?.message}
                />

                <FormInput
                  label="Account Number (for custodial assets) or Digital Asset Address (for self-hosted)"
                  id={`digitalAssets.${index}.accountOrAddress`}
                  required
                  {...register(`digitalAssets.${index}.accountOrAddress`)}
                  error={
                    errors.digitalAssets?.[index]?.accountOrAddress?.message
                  }
                />
              </div>

              <FormInput
                label="US Dollar Equivalent as of Today ($)"
                id={`digitalAssets.${index}.dollarValue`}
                type="number"
                min="0"
                placeholder="0"
                required
                {...register(`digitalAssets.${index}.dollarValue`, {
                  valueAsNumber: true,
                  min: { value: 0, message: "Value cannot be negative" },
                })}
                error={errors.digitalAssets?.[index]?.dollarValue?.message}
                className="max-w-md"
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addDigitalAsset({
                description: "",
                units: 0,
                location: "",
                accountOrAddress: "",
                dollarValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Digital Asset
          </Button>
        </CardContent>
      </Card>

      {/* Retirement Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Retirement Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {retirementAccounts.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Retirement Account {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRetirementAccount(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Retirement Account Type Radio Buttons */}
              <FormField
                label="Retirement Account Type"
                id={`retirementAccounts.${index}.type`}
                required
                error={errors.retirementAccounts?.[index]?.type?.message}
              >
                <RadioGroup
                  value={watch(`retirementAccounts.${index}.type`)}
                  onValueChange={(value) =>
                    setValue(`retirementAccounts.${index}.type`, value)
                  }
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {["401K", "IRA", "Other"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={type}
                        id={`retirement-${index}-${type
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="text-[#22b573]"
                      />
                      <Label
                        htmlFor={`retirement-${index}-${type
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="text-sm"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name of Financial Institution & Country Location"
                  id={`retirementAccounts.${index}.institutionName`}
                  required
                  {...register(`retirementAccounts.${index}.institutionName`)}
                  error={
                    errors.retirementAccounts?.[index]?.institutionName?.message
                  }
                />

                <FormInput
                  label="Account Number"
                  id={`retirementAccounts.${index}.accountNumber`}
                  required
                  {...register(`retirementAccounts.${index}.accountNumber`)}
                  error={
                    errors.retirementAccounts?.[index]?.accountNumber?.message
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Current Market Value ($)"
                  id={`retirementAccounts.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`retirementAccounts.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={
                    errors.retirementAccounts?.[index]?.marketValue?.message
                  }
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Market Value × 0.8: $
                    {(
                      (watch(`retirementAccounts.${index}.marketValue`) || 0) *
                      0.8
                    ).toLocaleString()}
                  </Label>
                </div>

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`retirementAccounts.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`retirementAccounts.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={
                    errors.retirementAccounts?.[index]?.loanBalance?.message
                  }
                />
              </div>

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Net Value: $
                  {Math.max(
                    0,
                    (watch(`retirementAccounts.${index}.marketValue`) || 0) *
                      0.8 -
                      (watch(`retirementAccounts.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addRetirementAccount({
                type: "",
                institutionName: "",
                accountNumber: "",
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Retirement Account
          </Button>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <strong>Note:</strong> Your reduction from current market value may
            be greater than 20% due to potential tax consequences/withdrawal
            penalties.
          </div>
        </CardContent>
      </Card>

      {/* Cash Value of Life Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Value of Life Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lifeInsurance.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Life Insurance Policy {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeLifeInsurance(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name of Insurance Company"
                  id={`lifeInsurance.${index}.companyName`}
                  required
                  {...register(`lifeInsurance.${index}.companyName`)}
                  error={errors.lifeInsurance?.[index]?.companyName?.message}
                />

                <FormInput
                  label="Policy Number"
                  id={`lifeInsurance.${index}.policyNumber`}
                  required
                  {...register(`lifeInsurance.${index}.policyNumber`)}
                  error={errors.lifeInsurance?.[index]?.policyNumber?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Current Cash Value ($)"
                  id={`lifeInsurance.${index}.cashValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`lifeInsurance.${index}.cashValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Cash value cannot be negative" },
                  })}
                  error={errors.lifeInsurance?.[index]?.cashValue?.message}
                />

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`lifeInsurance.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`lifeInsurance.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={errors.lifeInsurance?.[index]?.loanBalance?.message}
                />
              </div>

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Net Value: $
                  {Math.max(
                    0,
                    (watch(`lifeInsurance.${index}.cashValue`) || 0) -
                      (watch(`lifeInsurance.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addLifeInsurance({
                companyName: "",
                policyNumber: "",
                cashValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Life Insurance Policy
          </Button>
        </CardContent>
      </Card>

      {/* Real Property */}
      <Card>
        <CardHeader>
          <CardTitle>Real Property</CardTitle>
          <p className="text-sm text-gray-600">
            Enter information about any house, condo, co-op, time share, etc.
            that you own (or have interest in through a life estate), or that
            your spouse owns if you live in a community property state.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {realProperty.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Property {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRealProperty(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Property Sale Status Question */}
              <FormField
                label="Is this real property currently for sale or do you anticipate selling this real property to fund the offer amount?"
                id={`realProperty.${index}.saleStatus`}
                error={errors.realProperty?.[index]?.saleStatus?.message}
              >
                <RadioGroup
                  value={watch(`realProperty.${index}.saleStatus`)}
                  onValueChange={(value: "yes" | "no") =>
                    setValue(`realProperty.${index}.saleStatus`, value)
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id={`property-sale-yes-${index}`}
                      className="text-[#22b573]"
                    />
                    <Label htmlFor={`property-sale-yes-${index}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id={`property-sale-no-${index}`}
                      className="text-[#22b573]"
                    />
                    <Label htmlFor={`property-sale-no-${index}`}>No</Label>
                  </div>
                </RadioGroup>

                {watch(`realProperty.${index}.saleStatus`) === "yes" && (
                  <div className="mt-3">
                    <FormInput
                      label="Listing Price ($)"
                      id={`realProperty.${index}.listingPrice`}
                      type="number"
                      min="0"
                      placeholder="0"
                      required
                      {...register(`realProperty.${index}.listingPrice`, {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Listing price cannot be negative",
                        },
                      })}
                      error={
                        errors.realProperty?.[index]?.listingPrice?.message
                      }
                      className="max-w-md"
                    />
                  </div>
                )}
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Property Description (indicate if personal residence, rental property, vacant, etc.)"
                  id={`realProperty.${index}.description`}
                  required
                  {...register(`realProperty.${index}.description`)}
                  error={errors.realProperty?.[index]?.description?.message}
                />

                <FormInput
                  label="Purchase Date (mm/dd/yyyy)"
                  id={`realProperty.${index}.purchaseDate`}
                  type="date"
                  required
                  {...register(`realProperty.${index}.purchaseDate`)}
                  error={errors.realProperty?.[index]?.purchaseDate?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Amount of Mortgage Payment ($)"
                  id={`realProperty.${index}.mortgagePayment`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`realProperty.${index}.mortgagePayment`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Payment cannot be negative" },
                  })}
                  error={errors.realProperty?.[index]?.mortgagePayment?.message}
                />

                <FormInput
                  label="Date of Final Payment (mm/dd/yyyy)"
                  id={`realProperty.${index}.finalPaymentDate`}
                  type="date"
                  {...register(`realProperty.${index}.finalPaymentDate`)}
                  error={
                    errors.realProperty?.[index]?.finalPaymentDate?.message
                  }
                />

                <FormInput
                  label="How Title is Held (joint tenancy, etc.)"
                  id={`realProperty.${index}.titleHeld`}
                  required
                  {...register(`realProperty.${index}.titleHeld`)}
                  error={errors.realProperty?.[index]?.titleHeld?.message}
                />
              </div>

              <FormInput
                label="Location (street, city, state, ZIP code, county, and country)"
                id={`realProperty.${index}.location`}
                required
                {...register(`realProperty.${index}.location`)}
                error={errors.realProperty?.[index]?.location?.message}
              />

              <FormInput
                label="Lender/Contract Holder Name, Address & Phone"
                id={`realProperty.${index}.lenderInfo`}
                {...register(`realProperty.${index}.lenderInfo`)}
                error={errors.realProperty?.[index]?.lenderInfo?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Current Market Value ($)"
                  id={`realProperty.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`realProperty.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={errors.realProperty?.[index]?.marketValue?.message}
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Market Value × 0.8: $
                    {(
                      (watch(`realProperty.${index}.marketValue`) || 0) * 0.8
                    ).toLocaleString()}
                  </Label>
                </div>

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`realProperty.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`realProperty.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={errors.realProperty?.[index]?.loanBalance?.message}
                />
              </div>

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Total Value of Real Estate: $
                  {Math.max(
                    0,
                    (watch(`realProperty.${index}.marketValue`) || 0) * 0.8 -
                      (watch(`realProperty.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addRealProperty({
                saleStatus: "",
                listingPrice: 0,
                description: "",
                purchaseDate: "",
                mortgagePayment: 0,
                finalPaymentDate: "",
                titleHeld: "",
                location: "",
                lenderInfo: "",
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Real Property
          </Button>
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <p className="text-sm text-gray-600">
            Enter information about any cars, boats, motorcycles, etc. that you
            own or lease. Include those located in foreign countries or
            jurisdictions.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehicles.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Vehicle {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeVehicle(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Vehicle Make & Model"
                  id={`vehicles.${index}.makeModel`}
                  required
                  {...register(`vehicles.${index}.makeModel`)}
                  error={errors.vehicles?.[index]?.makeModel?.message}
                />

                <FormInput
                  label="Year"
                  id={`vehicles.${index}.year`}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                  {...register(`vehicles.${index}.year`, {
                    valueAsNumber: true,
                    min: { value: 1900, message: "Invalid year" },
                    max: {
                      value: new Date().getFullYear() + 1,
                      message: "Invalid year",
                    },
                  })}
                  error={errors.vehicles?.[index]?.year?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Date Purchased (mm/dd/yyyy)"
                  id={`vehicles.${index}.datePurchased`}
                  type="date"
                  required
                  {...register(`vehicles.${index}.datePurchased`)}
                  error={errors.vehicles?.[index]?.datePurchased?.message}
                />

                <FormInput
                  label="Mileage"
                  id={`vehicles.${index}.mileage`}
                  type="number"
                  min="0"
                  required
                  {...register(`vehicles.${index}.mileage`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Mileage cannot be negative" },
                  })}
                  error={errors.vehicles?.[index]?.mileage?.message}
                />

                <FormInput
                  label="License/Tag Number"
                  id={`vehicles.${index}.licenseNumber`}
                  required
                  {...register(`vehicles.${index}.licenseNumber`)}
                  error={errors.vehicles?.[index]?.licenseNumber?.message}
                />
              </div>

              {/* Lease or Own Radio Buttons */}
              <FormField
                label="Vehicle Status"
                id={`vehicles.${index}.status`}
                required
                error={errors.vehicles?.[index]?.status?.message}
              >
                <RadioGroup
                  value={watch(`vehicles.${index}.status`)}
                  onValueChange={(value) =>
                    setValue(`vehicles.${index}.status`, value)
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="lease"
                      id={`vehicle-${index}-lease`}
                      className="text-[#22b573]"
                    />
                    <Label htmlFor={`vehicle-${index}-lease`}>Lease</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="own"
                      id={`vehicle-${index}-own`}
                      className="text-[#22b573]"
                    />
                    <Label htmlFor={`vehicle-${index}-own`}>Own</Label>
                  </div>
                </RadioGroup>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Name of Creditor"
                  id={`vehicles.${index}.creditorName`}
                  {...register(`vehicles.${index}.creditorName`)}
                  error={errors.vehicles?.[index]?.creditorName?.message}
                />

                <FormInput
                  label="Date of Final Payment (mm/dd/yyyy)"
                  id={`vehicles.${index}.finalPaymentDate`}
                  type="date"
                  {...register(`vehicles.${index}.finalPaymentDate`)}
                  error={errors.vehicles?.[index]?.finalPaymentDate?.message}
                />

                <FormInput
                  label="Monthly Lease/Loan Amount ($)"
                  id={`vehicles.${index}.monthlyPayment`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`vehicles.${index}.monthlyPayment`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Payment cannot be negative" },
                  })}
                  error={errors.vehicles?.[index]?.monthlyPayment?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Current Market Value ($)"
                  id={`vehicles.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`vehicles.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={errors.vehicles?.[index]?.marketValue?.message}
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Market Value × 0.8: $
                    {(
                      (watch(`vehicles.${index}.marketValue`) || 0) * 0.8
                    ).toLocaleString()}
                  </Label>
                </div>

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`vehicles.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`vehicles.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={errors.vehicles?.[index]?.loanBalance?.message}
                />
              </div>

              {/* Auto-calculated values */}
              <div className="space-y-2 bg-gray-50 p-3 rounded">
                <div>
                  <Label className="text-sm font-medium">
                    Total Value of Vehicle: $
                    {watch(`vehicles.${index}.status`) === "lease"
                      ? "0"
                      : Math.max(
                          0,
                          (watch(`vehicles.${index}.marketValue`) || 0) * 0.8 -
                            (watch(`vehicles.${index}.loanBalance`) || 0)
                        ).toLocaleString()}
                  </Label>
                  {watch(`vehicles.${index}.status`) === "lease" && (
                    <p className="text-xs text-gray-600">
                      If leased, enter 0 as total value
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {index === 0 ? "Subtract $3,450" : "Net Vehicle Value"}: $
                    {(() => {
                      const totalValue =
                        watch(`vehicles.${index}.status`) === "lease"
                          ? 0
                          : Math.max(
                              0,
                              (watch(`vehicles.${index}.marketValue`) || 0) *
                                0.8 -
                                (watch(`vehicles.${index}.loanBalance`) || 0)
                            );
                      return index === 0
                        ? Math.max(0, totalValue - 3450).toLocaleString()
                        : totalValue.toLocaleString();
                    })()}
                  </Label>
                  {index === 0 && (
                    <p className="text-xs text-gray-600">
                      First vehicle gets $3,450 deduction
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addVehicle({
                makeModel: "",
                year: new Date().getFullYear(),
                datePurchased: "",
                mileage: 0,
                licenseNumber: "",
                status: "",
                creditorName: "",
                finalPaymentDate: "",
                monthlyPayment: 0,
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </CardContent>
      </Card>

      {/* Other Valuable Items */}
      <Card>
        <CardHeader>
          <CardTitle>Other Valuable Items</CardTitle>
          <p className="text-sm text-gray-600">
            Artwork, collections, jewelry, items of value in safe deposit boxes,
            interest in a company or business that is not publicly traded, etc.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {valuables.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Valuable Item {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeValuable(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <FormInput
                label="Description of Asset(s)"
                id={`valuables.${index}.description`}
                required
                {...register(`valuables.${index}.description`)}
                error={errors.valuables?.[index]?.description?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Current Market Value ($)"
                  id={`valuables.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`valuables.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={errors.valuables?.[index]?.marketValue?.message}
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Market Value × 0.8: $
                    {(
                      (watch(`valuables.${index}.marketValue`) || 0) * 0.8
                    ).toLocaleString()}
                  </Label>
                </div>

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`valuables.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`valuables.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={errors.valuables?.[index]?.loanBalance?.message}
                />
              </div>

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Net Value: $
                  {Math.max(
                    0,
                    (watch(`valuables.${index}.marketValue`) || 0) * 0.8 -
                      (watch(`valuables.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addValuable({
                description: "",
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Valuable Item
          </Button>
        </CardContent>
      </Card>

      {/* Value of Remaining Furniture and Personal Effects */}
      <Card>
        <CardHeader>
          <CardTitle>
            Value of Remaining Furniture and Personal Effects
          </CardTitle>
          <p className="text-sm text-gray-600">Items not listed above</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {furniture.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Furniture/Personal Effect {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFurniture(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <FormInput
                label="Description of Asset"
                id={`furniture.${index}.description`}
                required
                {...register(`furniture.${index}.description`)}
                error={errors.furniture?.[index]?.description?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Current Market Value ($)"
                  id={`furniture.${index}.marketValue`}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  {...register(`furniture.${index}.marketValue`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={errors.furniture?.[index]?.marketValue?.message}
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Market Value × 0.8: $
                    {(
                      (watch(`furniture.${index}.marketValue`) || 0) * 0.8
                    ).toLocaleString()}
                  </Label>
                </div>

                <FormInput
                  label="Minus Loan Balance ($)"
                  id={`furniture.${index}.loanBalance`}
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`furniture.${index}.loanBalance`, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Loan balance cannot be negative",
                    },
                  })}
                  error={errors.furniture?.[index]?.loanBalance?.message}
                />
              </div>

              {/* Auto-calculated net value */}
              <div className="bg-gray-50 p-3 rounded">
                <Label className="text-sm font-medium">
                  Net Value: $
                  {Math.max(
                    0,
                    (watch(`furniture.${index}.marketValue`) || 0) * 0.8 -
                      (watch(`furniture.${index}.loanBalance`) || 0)
                  ).toLocaleString()}
                </Label>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addFurniture({
                description: "",
                marketValue: 0,
                loanBalance: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Furniture/Personal Effect
          </Button>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-900">
                Total Valuable Items + Furniture Value: $
                {(() => {
                  const valuablesTotal = (watch("valuables") || []).reduce(
                    (sum: number, item: any) =>
                      sum +
                      Math.max(
                        0,
                        (item.marketValue || 0) * 0.8 - (item.loanBalance || 0)
                      ),
                    0
                  );
                  const furnitureTotal = (watch("furniture") || []).reduce(
                    (sum: number, item: any) =>
                      sum +
                      Math.max(
                        0,
                        (item.marketValue || 0) * 0.8 - (item.loanBalance || 0)
                      ),
                    0
                  );
                  return (valuablesTotal + furnitureTotal).toLocaleString();
                })()}
              </Label>
              <Label className="text-sm font-medium text-blue-900">
                Minus IRS Deduction of $11,710: $
                {Math.max(
                  0,
                  (() => {
                    const valuablesTotal = (watch("valuables") || []).reduce(
                      (sum: number, item: any) =>
                        sum +
                        Math.max(
                          0,
                          (item.marketValue || 0) * 0.8 -
                            (item.loanBalance || 0)
                        ),
                      0
                    );
                    const furnitureTotal = (watch("furniture") || []).reduce(
                      (sum: number, item: any) =>
                        sum +
                        Math.max(
                          0,
                          (item.marketValue || 0) * 0.8 -
                            (item.loanBalance || 0)
                        ),
                      0
                    );
                    return valuablesTotal + furnitureTotal - 11710;
                  })()
                ).toLocaleString()}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Available Individual Equity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Available Individual Equity in Assets Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">
                  Bank Accounts (minus $1,000):{" "}
                </span>
                $
                {Math.max(
                  0,
                  (watch("bankAccounts") || []).reduce(
                    (sum: number, account: any) => sum + (account.balance || 0),
                    0
                  ) - 1000
                ).toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Investments: </span>$
                {(watch("investments") || [])
                  .reduce(
                    (sum: number, inv: any) =>
                      sum +
                      Math.max(
                        0,
                        (inv.marketValue || 0) - (inv.loanBalance || 0)
                      ),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Digital Assets: </span>$
                {(watch("digitalAssets") || [])
                  .reduce(
                    (sum: number, asset: any) => sum + (asset.dollarValue || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Retirement Accounts: </span>$
                {(watch("retirementAccounts") || [])
                  .reduce(
                    (sum: number, ret: any) =>
                      sum +
                      Math.max(
                        0,
                        (ret.marketValue || 0) * 0.8 - (ret.loanBalance || 0)
                      ),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Life Insurance: </span>$
                {(watch("lifeInsurance") || [])
                  .reduce(
                    (sum: number, ins: any) =>
                      sum +
                      Math.max(
                        0,
                        (ins.cashValue || 0) - (ins.loanBalance || 0)
                      ),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Real Property: </span>$
                {(watch("realProperty") || [])
                  .reduce(
                    (sum: number, prop: any) =>
                      sum +
                      Math.max(
                        0,
                        (prop.marketValue || 0) * 0.8 - (prop.loanBalance || 0)
                      ),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Vehicles: </span>$
                {(() => {
                  const vehicles = watch("vehicles") || [];
                  let total = 0;
                  vehicles.forEach((vehicle: any, index: number) => {
                    if (vehicle.status !== "lease") {
                      const vehicleValue = Math.max(
                        0,
                        (vehicle.marketValue || 0) * 0.8 -
                          (vehicle.loanBalance || 0)
                      );
                      if (index === 0) {
                        total += Math.max(0, vehicleValue - 3450);
                      } else {
                        total += vehicleValue;
                      }
                    }
                  });
                  return total.toLocaleString();
                })()}
              </div>
              <div className="text-sm">
                <span className="font-medium">
                  Other Items (minus $11,710):{" "}
                </span>
                $
                {Math.max(
                  0,
                  (() => {
                    const valuablesTotal = (watch("valuables") || []).reduce(
                      (sum: number, item: any) =>
                        sum +
                        Math.max(
                          0,
                          (item.marketValue || 0) * 0.8 -
                            (item.loanBalance || 0)
                        ),
                      0
                    );
                    const furnitureTotal = (watch("furniture") || []).reduce(
                      (sum: number, item: any) =>
                        sum +
                        Math.max(
                          0,
                          (item.marketValue || 0) * 0.8 -
                            (item.loanBalance || 0)
                        ),
                      0
                    );
                    return valuablesTotal + furnitureTotal - 11710;
                  })()
                ).toLocaleString()}
              </div>
              <hr className="my-3" />
              <div className="text-lg font-bold text-green-800">
                <span>Total Available Individual Equity: </span>$
                {(() => {
                  const bankTotal = Math.max(
                    0,
                    (watch("bankAccounts") || []).reduce(
                      (sum: number, account: any) =>
                        sum + (account.balance || 0),
                      0
                    ) - 1000
                  );
                  const investmentTotal = (watch("investments") || []).reduce(
                    (sum: number, inv: any) =>
                      sum +
                      Math.max(
                        0,
                        (inv.marketValue || 0) - (inv.loanBalance || 0)
                      ),
                    0
                  );
                  const digitalTotal = (watch("digitalAssets") || []).reduce(
                    (sum: number, asset: any) => sum + (asset.dollarValue || 0),
                    0
                  );
                  const retirementTotal = (
                    watch("retirementAccounts") || []
                  ).reduce(
                    (sum: number, ret: any) =>
                      sum +
                      Math.max(
                        0,
                        (ret.marketValue || 0) * 0.8 - (ret.loanBalance || 0)
                      ),
                    0
                  );
                  const insuranceTotal = (watch("lifeInsurance") || []).reduce(
                    (sum: number, ins: any) =>
                      sum +
                      Math.max(
                        0,
                        (ins.cashValue || 0) - (ins.loanBalance || 0)
                      ),
                    0
                  );
                  const propertyTotal = (watch("realProperty") || []).reduce(
                    (sum: number, prop: any) =>
                      sum +
                      Math.max(
                        0,
                        (prop.marketValue || 0) * 0.8 - (prop.loanBalance || 0)
                      ),
                    0
                  );

                  const vehicles = watch("vehicles") || [];
                  let vehicleTotal = 0;
                  vehicles.forEach((vehicle: any, index: number) => {
                    if (vehicle.status !== "lease") {
                      const vehicleValue = Math.max(
                        0,
                        (vehicle.marketValue || 0) * 0.8 -
                          (vehicle.loanBalance || 0)
                      );
                      if (index === 0) {
                        vehicleTotal += Math.max(0, vehicleValue - 3450);
                      } else {
                        vehicleTotal += vehicleValue;
                      }
                    }
                  });

                  const valuablesTotal = (watch("valuables") || []).reduce(
                    (sum: number, item: any) =>
                      sum +
                      Math.max(
                        0,
                        (item.marketValue || 0) * 0.8 - (item.loanBalance || 0)
                      ),
                    0
                  );
                  const furnitureTotal = (watch("furniture") || []).reduce(
                    (sum: number, item: any) =>
                      sum +
                      Math.max(
                        0,
                        (item.marketValue || 0) * 0.8 - (item.loanBalance || 0)
                      ),
                    0
                  );
                  const otherTotal = Math.max(
                    0,
                    valuablesTotal + furnitureTotal - 11710
                  );

                  return Math.max(
                    0,
                    bankTotal +
                      investmentTotal +
                      digitalTotal +
                      retirementTotal +
                      insuranceTotal +
                      propertyTotal +
                      vehicleTotal +
                      otherTotal
                  ).toLocaleString();
                })()}
              </div>
            </div>
          </div>
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
