"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
}

export function BusinessAssetsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
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
    name: "bankAccountsInfo.bankAccounts",
  });

  const {
    fields: digitalFields,
    append: appendDigital,
    remove: removeDigital,
  } = useFieldArray({
    name: "digitalAssetsInfo.digitalAssets",
  });

  const {
    fields: assetItemsFields,
    append: appendAssetItem,
    remove: removeAssetItem,
  } = useFieldArray({
    name: "assetItems.assets",
  });

  const hasNotesReceivable = watch("hasNotesReceivable");
  const hasAccountsReceivable = watch("hasAccountsReceivable");

  useEffect(() => {
    if (hasNotesReceivable === undefined) {
      setValue("hasNotesReceivable", false);
      clearErrors("hasNotesReceivable");
      trigger("hasNotesReceivable");
    }
    if (hasAccountsReceivable === undefined) {
      setValue("hasAccountsReceivable", false);
      clearErrors("hasAccountsReceivable");
      trigger("hasAccountsReceivable");
    }
  }, [
    hasNotesReceivable,
    hasAccountsReceivable,
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
    const currentMarketValue =
      parseFloat(watch(`assetItems.assets.${index}.currentMarketValue`)) || 0;
    const quickSaleValue = currentMarketValue * 0.8;
    const loanBalance =
      parseFloat(watch(`assetItems.assets.${index}.loanBalance`)) || 0;
    const isLeased = watch(`assetItems.assets.${index}.isLeased`) || false;
    const usedInProductionOfIncome =
      watch(`assetItems.assets.${index}.usedInProductionOfIncome`) || false;
    const totalValue =
      isLeased || usedInProductionOfIncome ? 0 : quickSaleValue - loanBalance;
    // Store for display only (not sent to backend)
    setValue(
      `assetItems.assets.${index}.quickSaleValue`,
      quickSaleValue.toString()
    );
    setValue(`assetItems.assets.${index}.totalValue`, totalValue.toString());
  };

  const addBusinessAssetItem = () => {
    appendAssetItem({
      description: "",
      currentMarketValue: "",
      loanBalance: "",
      isLeased: false,
      usedInProductionOfIncome: false,
      quickSaleValue: "",
      totalValue: "",
    });
  };

  // Calculate totals for display
  const bankSum = bankFields.reduce(
    (sum, _, index) =>
      sum +
      (parseFloat(watch(`bankAccountsInfo.bankAccounts.${index}.value`)) || 0),
    0
  );
  const digitalSum = digitalFields.reduce(
    (sum, _, index) =>
      sum +
      (parseFloat(
        watch(`digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`)
      ) || 0),
    0
  );
  const total8 = bankSum + digitalSum;

  const assetSum = assetItemsFields.reduce(
    (sum, _, index) =>
      sum + (parseFloat(watch(`assetItems.assets.${index}.totalValue`)) || 0),
    0
  );
  const attachmentAssets =
    parseFloat(watch("totalBusinessAssetsAttachment")) || 0;
  const total9 = assetSum + attachmentAssets;
  const deduction = parseFloat(watch("assetItems.irsAllowedDeduction")) || 0;
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
                id={`bankAccountsInfo.bankAccounts.${index}.accountType`}
                required
                error={
                  errors.bankAccountsInfo?.bankAccounts?.[index]?.accountType
                    ?.message
                }
              >
                <Controller
                  name={`bankAccountsInfo.bankAccounts.${index}.accountType`}
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
                id={`bankAccountsInfo.bankAccounts.${index}.bankName`}
                {...register(
                  `bankAccountsInfo.bankAccounts.${index}.bankName`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `bankAccountsInfo.bankAccounts.${index}.bankName`
                        );
                        trigger(
                          `bankAccountsInfo.bankAccounts.${index}.bankName`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.bankAccountsInfo?.bankAccounts?.[index]?.bankName
                    ?.message
                }
              />

              <FormInput
                label="Country location"
                id={`bankAccountsInfo.bankAccounts.${index}.countryLocation`}
                {...register(
                  `bankAccountsInfo.bankAccounts.${index}.countryLocation`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `bankAccountsInfo.bankAccounts.${index}.countryLocation`
                        );
                        trigger(
                          `bankAccountsInfo.bankAccounts.${index}.countryLocation`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.bankAccountsInfo?.bankAccounts?.[index]
                    ?.countryLocation?.message
                }
              />

              <FormInput
                label="Account number (optional)"
                id={`bankAccountsInfo.bankAccounts.${index}.accountNumber`}
                {...register(
                  `bankAccountsInfo.bankAccounts.${index}.accountNumber`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `bankAccountsInfo.bankAccounts.${index}.accountNumber`
                        );
                        trigger(
                          `bankAccountsInfo.bankAccounts.${index}.accountNumber`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.bankAccountsInfo?.bankAccounts?.[index]?.accountNumber
                    ?.message
                }
              />

              <FormInput
                label="Value ($)"
                id={`bankAccountsInfo.bankAccounts.${index}.value`}
                type="number"
                {...register(`bankAccountsInfo.bankAccounts.${index}.value`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(
                        `bankAccountsInfo.bankAccounts.${index}.value`
                      );
                      trigger(`bankAccountsInfo.bankAccounts.${index}.value`);
                    }
                  },
                })}
                error={
                  errors.bankAccountsInfo?.bankAccounts?.[index]?.value?.message
                }
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
                id={`digitalAssetsInfo.digitalAssets.${index}.description`}
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.description`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.description`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.description`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]?.description
                    ?.message
                }
              />

              <FormInput
                label="Number of units (optional)"
                id={`digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`}
                type="number"
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`,
                  {
                    onChange: (e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]
                    ?.numberOfUnits?.message
                }
              />

              <FormInput
                label="Location of digital asset (exchange account, self-hosted wallet)"
                id={`digitalAssetsInfo.digitalAssets.${index}.location`}
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.location`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.location`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.location`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]?.location
                    ?.message
                }
              />

              <FormInput
                label="Account number for assets held by a custodian or broker (optional)"
                id={`digitalAssetsInfo.digitalAssets.${index}.accountNumber`}
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.accountNumber`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.accountNumber`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.accountNumber`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]
                    ?.accountNumber?.message
                }
              />

              <FormInput
                label="Digital asset address for self-hosted digital assets (optional)"
                id={`digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress`}
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress`,
                  {
                    onChange: (e) => {
                      if (e.target.value.trim() !== "") {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]
                    ?.digitalAssetAddress?.message
                }
              />

              <FormInput
                label="US dollar ($) equivalent of the digital asset as of today"
                id={`digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`}
                type="number"
                {...register(
                  `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`,
                  {
                    onChange: (e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        clearErrors(
                          `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`
                        );
                        trigger(
                          `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`
                        );
                      }
                    },
                  }
                )}
                error={
                  errors.digitalAssetsInfo?.digitalAssets?.[index]
                    ?.usdEquivalent?.message
                }
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

          <div className="flex justify-between font-medium">
            <span>Total bank accounts from attachment</span>
            <span>${bankSum.toFixed(0)}</span>
          </div>

          <div className="flex justify-between font-medium">
            <span>Total of bank accounts and digital assets</span>
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
                id={`assetItems.assets.${index}.description`}
                {...register(`assetItems.assets.${index}.description`, {
                  onChange: (e) => {
                    if (e.target.value.trim() !== "") {
                      clearErrors(`assetItems.assets.${index}.description`);
                      trigger(`assetItems.assets.${index}.description`);
                    }
                  },
                })}
                error={errors.assetItems?.assets?.[index]?.description?.message}
              />

              <FormInput
                label="Current market value ($)"
                id={`assetItems.assets.${index}.currentMarketValue`}
                type="number"
                {...register(`assetItems.assets.${index}.currentMarketValue`, {
                  onChange: (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      clearErrors(
                        `assetItems.assets.${index}.currentMarketValue`
                      );
                      trigger(`assetItems.assets.${index}.currentMarketValue`);
                    }
                    updateAssetTotal(index);
                  },
                })}
                error={
                  errors.assetItems?.assets?.[index]?.currentMarketValue
                    ?.message
                }
              />

              <FormInput
                label="X .8 = ($)"
                id={`assetItems.assets.${index}.quickSaleValue`}
                type="number"
                {...register(`assetItems.assets.${index}.quickSaleValue`)}
                disabled
                error={
                  errors.assetItems?.assets?.[index]?.quickSaleValue?.message
                }
              />

              <FormInput
                label="Minus loan balance ($)"
                id={`assetItems.assets.${index}.loanBalance`}
                type="number"
                {...register(`assetItems.assets.${index}.loanBalance`, {
                  onChange: (e) => {
                    const loan = parseFloat(e.target.value);
                    if (!isNaN(loan) && loan >= 0) {
                      clearErrors(`assetItems.assets.${index}.loanBalance`);
                      trigger(`assetItems.assets.${index}.loanBalance`);
                    }
                    updateAssetTotal(index);
                  },
                })}
                error={errors.assetItems?.assets?.[index]?.loanBalance?.message}
              />

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name={`assetItems.assets.${index}.isLeased`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`assetItems.assets.${index}.isLeased`}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateAssetTotal(index);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`assetItems.assets.${index}.isLeased`}>
                    Is leased?
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name={`assetItems.assets.${index}.usedInProductionOfIncome`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`assetItems.assets.${index}.usedInProductionOfIncome`}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateAssetTotal(index);
                        }}
                      />
                    )}
                  />
                  <Label
                    htmlFor={`assetItems.assets.${index}.usedInProductionOfIncome`}
                  >
                    Used in production of income?
                  </Label>
                </div>
              </div>

              <FormInput
                label="Total value (if leased or used in the production of income, enter 0 as the total value) ($)"
                id={`assetItems.assets.${index}.totalValue`}
                type="number"
                {...register(`assetItems.assets.${index}.totalValue`)}
                disabled
                error={errors.assetItems?.assets?.[index]?.totalValue?.message}
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
            id="assetItems.irsAllowedDeduction"
            type="number"
            {...register("assetItems.irsAllowedDeduction", {
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  clearErrors("assetItems.irsAllowedDeduction");
                  trigger("assetItems.irsAllowedDeduction");
                }
              },
            })}
            error={errors.assetItems?.irsAllowedDeduction?.message}
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
            id="hasNotesReceivable"
            error={errors.hasNotesReceivable?.message}
          >
            <Controller
              name="hasNotesReceivable"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value ? "yes" : "no"}
                  onValueChange={(value: "yes" | "no") => {
                    field.onChange(value === "yes");
                    clearErrors(field.name);
                    trigger(field.name);
                  }}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="notes-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="notes-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="notes-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="notes-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </FormField>
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
            id="hasAccountsReceivable"
            error={errors.hasAccountsReceivable?.message}
          >
            <Controller
              name="hasAccountsReceivable"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value ? "yes" : "no"}
                  onValueChange={(value: "yes" | "no") => {
                    field.onChange(value === "yes");
                    clearErrors(field.name);
                    trigger(field.name);
                  }}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="accounts-yes"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="accounts-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="accounts-no"
                      className="text-[#22b573]"
                    />
                    <Label htmlFor="accounts-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </FormField>
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
      />
    </div>
  );
}
