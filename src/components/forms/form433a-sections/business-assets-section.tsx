"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

interface BusinessAssetsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function BusinessAssetsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  validateStep,
}: BusinessAssetsSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
    trigger,
    control,
  } = useFormContext<FormData433A>();

  const isSelfEmployed = watch("isSelfEmployed");

  const {
    fields: bankFields,
    append: appendBank,
    remove: removeBank,
  } = useFieldArray({
    name: "businessBankAccounts",
  });

  const {
    fields: digitalFields,
    append: appendDigital,
    remove: removeDigital,
  } = useFieldArray({
    name: "businessDigitalAssets",
  });

  const {
    fields: assetItemsFields,
    append: appendAssetItem,
    remove: removeAssetItem,
  } = useFieldArray({
    name: "assetItems",
  });

  const hasBusinessNotesReceivable = watch("hasBusinessNotesReceivable");
  const hasBusinessAccountsReceivable = watch("hasBusinessAccountsReceivable");

  useEffect(() => {
    if (hasBusinessNotesReceivable === undefined) {
      setValue("hasBusinessNotesReceivable", false);
      clearErrors("hasBusinessNotesReceivable");
      trigger("hasBusinessNotesReceivable");
    }
    if (hasBusinessAccountsReceivable === undefined) {
      setValue("hasBusinessAccountsReceivable", false);
      clearErrors("hasBusinessAccountsReceivable");
      trigger("hasBusinessAccountsReceivable");
    }
  }, [
    hasBusinessNotesReceivable,
    hasBusinessAccountsReceivable,
    setValue,
    clearErrors,
    trigger,
  ]);

  const addBankAccount = () => {
    appendBank({
      bankName: "",
      countryLocation: "",
      accountType: undefined,
      accountNumber: "",
      value: "",
    });
  };

  const addDigitalAsset = () => {
    appendDigital({
      description: "",
      numberOfUnits: "",
      location: "",
      accountNumber: "",
      digitalAssetAddress: "",
      usdEquivalent: "",
    });
  };

  const updateAssetTotal = (index: number) => {
    const currentMarketValue = parseFloat(watch(`assetItems.${index}.currentMarketValue`)) || 0;
    const quickSaleValue = currentMarketValue * 0.8;
    setValue(`assetItems.${index}.quickSaleValue`, quickSaleValue.toString());
    const loanBalance = parseFloat(watch(`assetItems.${index}.loanBalance`)) || 0;
    const isLeased = watch(`assetItems.${index}.isLeased`) || false;
    const usedInProductionOfIncome = watch(`assetItems.${index}.usedInProductionOfIncome`) || false;
    const totalValue = (isLeased || usedInProductionOfIncome) ? 0 : quickSaleValue - loanBalance;
    setValue(`assetItems.${index}.totalValue`, totalValue.toString());
  };

  const addBusinessAssetItem = () => {
    appendAssetItem({
      description: "",
      currentMarketValue: "",
      quickSaleValue: "",
      loanBalance: "",
      totalValue: "",
      isLeased: false,
      usedInProductionOfIncome: false,
    });
  };

  // Calculate totals for display
  const bankSum = bankFields.reduce(
    (sum, _, index) =>
      sum + (parseFloat(watch(`businessBankAccounts.${index}.value`)) || 0),
    0
  );
  const digitalSum = digitalFields.reduce(
    (sum, _, index) =>
      sum + (parseFloat(watch(`businessDigitalAssets.${index}.usdEquivalent`)) || 0),
    0
  );
  const attachmentBank = parseFloat(watch("totalBusinessBankAttachment")) || 0;
  const total8 = bankSum + digitalSum + attachmentBank;

  const assetSum = assetItemsFields.reduce(
    (sum, _, index) =>
      sum + (parseFloat(watch(`assetItems.${index}.totalValue`)) || 0),
    0
  );
  const attachmentAssets =
    parseFloat(watch("totalBusinessAssetsAttachment")) || 0;
  const total9 = assetSum + attachmentAssets;
  const deduction = parseFloat(watch("businessIrsDeduction")) || 0;
  const value11 = Math.max(0, total9 - deduction);
  const boxB = total8 + value11;

  useEffect(() => {
    setValue("boxB", boxB);
  }, [boxB, setValue]);

  if (!isSelfEmployed) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 5: Business Asset Information
          </h2>
          <p className="text-gray-600">
            This section is not applicable as you are not self-employed.
          </p>
        </div>
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 5: Business Asset Information (for Self-Employed) (Domestic
          and Foreign)
        </h2>
        <p className="text-gray-600">
          List business assets including bank accounts, digital assets (such as
          cryptocurrency), tools, books, machinery, equipment, business vehicles
          and real property that is owned/leased/rented. If additional space is
          needed, attach a list of items. Do not include personal assets listed
          in Section 3.
        </p>
        <p className="text-gray-800 font-semibold">
          Round to the nearest whole dollar. Do not enter a negative number. If
          any line item is a negative number, enter "0".
        </p>
      </div>

      {/* Bank Accounts and Digital Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts and Digital Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {bankFields.map((field, index) => (
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
                  onClick={() => removeBank(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Account Type Radio Buttons */}
              <FormField
                label="Account Type"
                id={`businessBankAccounts.${index}.accountType`}
                required
                error={
                  errors.businessBankAccounts?.[index]?.accountType?.message
                }
              >
                <Controller
                  name={`businessBankAccounts.${index}.accountType`}
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value.trim() !== "") {
                          clearErrors(field.name);
                          trigger(field.name);
                        }
                      }}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      {[
                        "Cash",
                        "Checking",
                        "Savings",
                        "Money Market/CD",
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
                  )}
                />
              </FormField>

              <FormInput
                label="Bank name"
                id={`businessBankAccounts.${index}.bankName`}
                {...register(`businessBankAccounts.${index}.bankName`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(
                        `businessBankAccounts.${index}.bankName`
                      );
                      trigger(`businessBankAccounts.${index}.bankName`);
                    }
                  },
                })}
                error={
                  errors.businessBankAccounts?.[index]?.bankName?.message
                }
              />

              <FormInput
                label="Country location"
                id={`businessBankAccounts.${index}.countryLocation`}
                {...register(`businessBankAccounts.${index}.countryLocation`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(
                        `businessBankAccounts.${index}.countryLocation`
                      );
                      trigger(`businessBankAccounts.${index}.countryLocation`);
                    }
                  },
                })}
                error={
                  errors.businessBankAccounts?.[index]?.countryLocation?.message
                }
              />

              <FormInput
                label="Account number"
                id={`businessBankAccounts.${index}.accountNumber`}
                {...register(`businessBankAccounts.${index}.accountNumber`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(
                        `businessBankAccounts.${index}.accountNumber`
                      );
                      trigger(`businessBankAccounts.${index}.accountNumber`);
                    }
                  },
                })}
                error={
                  errors.businessBankAccounts?.[index]?.accountNumber?.message
                }
              />

              <FormInput
                label="Value ($)"
                id={`businessBankAccounts.${index}.value`}
                type="number"
                {...register(`businessBankAccounts.${index}.value`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(`businessBankAccounts.${index}.value`);
                      trigger(`businessBankAccounts.${index}.value`);
                    }
                  },
                })}
                error={errors.businessBankAccounts?.[index]?.value?.message}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addBankAccount}
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>

          {digitalFields.map((field, index) => (
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
                  onClick={() => removeDigital(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <FormInput
                label="Description of digital asset"
                id={`businessDigitalAssets.${index}.description`}
                {...register(`businessDigitalAssets.${index}.description`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`businessDigitalAssets.${index}.description`);
                      trigger(`businessDigitalAssets.${index}.description`);
                    }
                  },
                })}
                error={
                  errors.businessDigitalAssets?.[index]?.description?.message
                }
              />

              <FormInput
                label="Number of units"
                id={`businessDigitalAssets.${index}.numberOfUnits`}
                type="number"
                {...register(`businessDigitalAssets.${index}.numberOfUnits`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(`businessDigitalAssets.${index}.numberOfUnits`);
                      trigger(`businessDigitalAssets.${index}.numberOfUnits`);
                    }
                  },
                })}
                error={errors.businessDigitalAssets?.[index]?.numberOfUnits?.message}
              />

              <FormInput
                label="Location of digital asset (exchange account, self-hosted wallet)"
                id={`businessDigitalAssets.${index}.location`}
                {...register(`businessDigitalAssets.${index}.location`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`businessDigitalAssets.${index}.location`);
                      trigger(`businessDigitalAssets.${index}.location`);
                    }
                  },
                })}
                error={errors.businessDigitalAssets?.[index]?.location?.message}
              />

              <FormInput
                label="Account number for assets held by a custodian or broker"
                id={`businessDigitalAssets.${index}.accountNumber`}
                {...register(`businessDigitalAssets.${index}.accountNumber`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`businessDigitalAssets.${index}.accountNumber`);
                      trigger(`businessDigitalAssets.${index}.accountNumber`);
                    }
                  },
                })}
                error={
                  errors.businessDigitalAssets?.[index]?.accountNumber?.message
                }
              />

              <FormInput
                label="Digital asset address for self-hosted digital assets"
                id={`businessDigitalAssets.${index}.digitalAssetAddress`}
                {...register(`businessDigitalAssets.${index}.digitalAssetAddress`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`businessDigitalAssets.${index}.digitalAssetAddress`);
                      trigger(`businessDigitalAssets.${index}.digitalAssetAddress`);
                    }
                  },
                })}
                error={
                  errors.businessDigitalAssets?.[index]?.digitalAssetAddress?.message
                }
              />

              <FormInput
                label="US dollar ($) equivalent of the digital asset as of today"
                id={`businessDigitalAssets.${index}.usdEquivalent`}
                type="number"
                {...register(`businessDigitalAssets.${index}.usdEquivalent`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(`businessDigitalAssets.${index}.usdEquivalent`);
                      trigger(`businessDigitalAssets.${index}.usdEquivalent`);
                    }
                  },
                })}
                error={errors.businessDigitalAssets?.[index]?.usdEquivalent?.message}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addDigitalAsset}
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Digital Asset
          </Button>

          <FormInput
            label="Total bank accounts from attachment (8d) ($)"
            id="totalBusinessBankAttachment"
            type="number"
            {...register("totalBusinessBankAttachment", {
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  clearErrors("totalBusinessBankAttachment");
                  trigger("totalBusinessBankAttachment");
                }
              },
            })}
            error={errors.totalBusinessBankAttachment?.message}
          />

          <div className="flex justify-between font-medium">
            <span>Add lines (8a) through (8d) = (8)</span>
            <span>${total8.toFixed(0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Other Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Other Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {assetItemsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Asset {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAssetItem(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <FormInput
                label="Description of asset"
                id={`assetItems.${index}.description`}
                {...register(`assetItems.${index}.description`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`assetItems.${index}.description`);
                      trigger(`assetItems.${index}.description`);
                    }
                  },
                })}
                error={
                  errors.assetItems?.[index]?.description?.message
                }
              />

              <FormInput
                label="Current market value ($)"
                id={`assetItems.${index}.currentMarketValue`}
                type="number"
                {...register(
                  `assetItems.${index}.currentMarketValue`,
                  {
                    onChange: (e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        clearErrors(
                          `assetItems.${index}.currentMarketValue`
                        );
                        trigger(
                          `assetItems.${index}.currentMarketValue`
                        );
                      }
                      updateAssetTotal(index);
                    },
                  }
                )}
                error={
                  errors.assetItems?.[index]?.currentMarketValue
                    ?.message
                }
              />

              <FormInput
                label="X .8 = ($)"
                id={`assetItems.${index}.quickSaleValue`}
                type="number"
                {...register(`assetItems.${index}.quickSaleValue`, {
                  onChange: (e) => {
                    const quick = parseFloat(e.target.value);
                    if (!isNaN(quick) && quick >= 0) {
                      clearErrors(
                        `assetItems.${index}.quickSaleValue`
                      );
                      trigger(`assetItems.${index}.quickSaleValue`);
                    }
                    updateAssetTotal(index);
                  },
                })}
                error={
                  errors.assetItems?.[index]?.quickSaleValue?.message
                }
              />

              <FormInput
                label="Minus loan balance ($)"
                id={`assetItems.${index}.loanBalance`}
                type="number"
                {...register(`assetItems.${index}.loanBalance`, {
                  onChange: (e) => {
                    const loan = parseFloat(e.target.value);
                    if (!isNaN(loan) && loan >= 0) {
                      clearErrors(`assetItems.${index}.loanBalance`);
                      trigger(`assetItems.${index}.loanBalance`);
                    }
                    updateAssetTotal(index);
                  },
                })}
                error={
                  errors.assetItems?.[index]?.loanBalance?.message
                }
              />

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name={`assetItems.${index}.isLeased`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`assetItems.${index}.isLeased`}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateAssetTotal(index);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`assetItems.${index}.isLeased`}>
                    Is leased?
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name={`assetItems.${index}.usedInProductionOfIncome`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`assetItems.${index}.usedInProductionOfIncome`}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateAssetTotal(index);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`assetItems.${index}.usedInProductionOfIncome`}>
                    Used in production of income?
                  </Label>
                </div>
              </div>

              <FormInput
                label="Total value (if leased or used in the production of income, enter 0 as the total value) ($)"
                id={`assetItems.${index}.totalValue`}
                type="number"
                {...register(`assetItems.${index}.totalValue`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(`assetItems.${index}.totalValue`);
                      trigger(`assetItems.${index}.totalValue`);
                    }
                  },
                })}
                error={errors.assetItems?.[index]?.totalValue?.message}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addBusinessAssetItem}
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>

          <FormInput
            label="Total value of assets listed from attachment [current market value X .8 minus any loan balance(s)] (9c) ($)"
            id="totalBusinessAssetsAttachment"
            type="number"
            {...register("totalBusinessAssetsAttachment", {
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  clearErrors("totalBusinessAssetsAttachment");
                  trigger("totalBusinessAssetsAttachment");
                }
              },
            })}
            error={errors.totalBusinessAssetsAttachment?.message}
          />

          <div className="flex justify-between font-medium">
            <span>Add lines (9a) through (9c) = (9)</span>
            <span>${total9.toFixed(0)}</span>
          </div>

          <FormInput
            label="IRS allowed deduction for professional books and tools of trade for individuals and sole-proprietors - (10) ($)"
            id="businessIrsDeduction"
            type="number"
            {...register("businessIrsDeduction", {
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  clearErrors("businessIrsDeduction");
                  trigger("businessIrsDeduction");
                }
              },
            })}
            error={errors.businessIrsDeduction?.message}
          />

          <div className="flex justify-between font-medium">
            <span>
              Enter the value of line (9) minus line (10). If less than zero
              enter zero. = (11)
            </span>
            <span>${value11.toFixed(0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Notes Receivable */}
      <Card>
        <CardHeader>
          <CardTitle>Notes Receivable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="Do you have notes receivable?"
            id="hasBusinessNotesReceivable"
            error={errors.hasBusinessNotesReceivable?.message}
          >
            <Controller
              name="hasBusinessNotesReceivable"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value ? "yes" : "no"}
                  onValueChange={(value: "yes" | "no") => {
                    field.onChange(value === "yes");
                    clearErrors(field.name);
                    trigger(field.name);
                    if (value === "no") {
                      clearErrors("businessNotesListing");
                    }
                  }}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="business-notes-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="business-notes-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="business-notes-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="business-notes-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </FormField>

          {hasBusinessNotesReceivable && (
            <div>
              <Label htmlFor="businessNotesListing">
                If yes, attach current listing that includes name(s) and amount
                of note(s) receivable
              </Label>
              <Textarea
                id="businessNotesListing"
                {...register("businessNotesListing", {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors("businessNotesListing");
                      trigger("businessNotesListing");
                    }
                  },
                })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              {errors.businessNotesListing && (
                <p className="text-red-500 text-sm">
                  {errors.businessNotesListing.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accounts Receivable */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts Receivable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="Do you have accounts receivable, including e-payment, factoring companies, and any bartering or online auction accounts?"
            id="hasBusinessAccountsReceivable"
            error={errors.hasBusinessAccountsReceivable?.message}
          >
            <Controller
              name="hasBusinessAccountsReceivable"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value ? "yes" : "no"}
                  onValueChange={(value: "yes" | "no") => {
                    field.onChange(value === "yes");
                    clearErrors(field.name);
                    trigger(field.name);
                    if (value === "no") {
                      clearErrors("businessAccountsListing");
                    }
                  }}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="business-accounts-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="business-accounts-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="business-accounts-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="business-accounts-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </FormField>

          {hasBusinessAccountsReceivable && (
            <div>
              <Label htmlFor="businessAccountsListing">
                If yes, provide a list of your current accounts receivable
                (include the age and amount)
              </Label>
              <Textarea
                id="businessAccountsListing"
                {...register("businessAccountsListing", {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors("businessAccountsListing");
                      trigger("businessAccountsListing");
                    }
                  },
                })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              {errors.businessAccountsListing && (
                <p className="text-red-500 text-sm">
                  {errors.businessAccountsListing.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Box B */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-center">
          <p className="font-bold text-lg">
            Add lines (8) and (11) and enter the amount in Box B = $
            {boxB.toFixed(0)}
          </p>
          <p className="text-sm font-medium mt-1">
            Box B: Available Business Equity in Assets{" "}
          </p>
        </div>
      </div>

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