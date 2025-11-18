"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessAssetsInitialValues,
  businessAssetsSchema,
} from "@/lib/validation/form433a/business-assets-section";
import useBusinessAssets from "@/hooks/433a-form-hooks/useBusinessAssets";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import useSelfEmployed from "@/hooks/433a-form-hooks/useSelfEmployed";
import { storage } from "@/utils/helper";
import useCalculation from "@/hooks/433a-form-hooks/useCalculation";

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
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { businessAssetsInfo, selfEmployedInfo, calculationInfo } =
    useAppSelector((state) => state.form433a);
  const isSelfEmployed = selfEmployedInfo?.isSelfEmployed ?? false;

  useEffect(() => {
    console.log("selfEmployedInfo: ", selfEmployedInfo);
    console.log("isSelfEmployed: ", isSelfEmployed);
    if (selfEmployedInfo && !isSelfEmployed) {
      onNext();
    }
  }, [selfEmployedInfo]);

  // const { handleSaveCalculationInfo, handleGetCalculationInfo } =
  //   useCalculation();

  const {
    loading,
    loadingFormData,
    handleSaveBusinessAssetsInfo,
    handleGetBusinessAssetsInfo,
  } = useBusinessAssets();

  const { loadingFormData: loadingSelfEmpFormData, handleGetSelfEmployedInfo } =
    useSelfEmployed();

  const methods = useForm<BusinessAssetsFormSchema>({
    resolver: zodResolver(businessAssetsSchema),
    defaultValues: businessAssetsInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: BusinessAssetsFormSchema) => {
    try {
      await handleSaveBusinessAssetsInfo(data, caseId);

      onNext();
    } catch (error: any) {
      console.error("Error saving business assets info:", error);
      toast.error(error.message || "Failed to save business assets info");
    }
  };

  useEffect(() => {
    if (!selfEmployedInfo)
      handleGetSelfEmployedInfo(caseId, FORM_433A_SECTIONS[3]);
    if (isSelfEmployed && !businessAssetsInfo) {
      handleGetBusinessAssetsInfo(caseId, FORM_433A_SECTIONS[4]);
    }
    // const form433aProgress: any = storage.get("433a_progress");
    // if (!calculationInfo && form433aProgress?.completedSteps?.includes(8))
    //   handleGetCalculationInfo(caseId, FORM_433A_SECTIONS[7]);
  }, [isSelfEmployed, businessAssetsInfo, caseId]);

  useEffect(() => {
    if (businessAssetsInfo) {
      reset(businessAssetsInfo);
    }
  }, [businessAssetsInfo, reset]);

  const {
    fields: bankFields,
    append: appendBank,
    remove: removeBank,
  } = useFieldArray({
    control,
    name: "bankAccountsInfo.bankAccounts",
  });

  const {
    fields: digitalFields,
    append: appendDigital,
    remove: removeDigital,
  } = useFieldArray({
    control,
    name: "digitalAssetsInfo.digitalAssets",
  });

  const {
    fields: assetItemsFields,
    append: appendAssetItem,
    remove: removeAssetItem,
  } = useFieldArray({
    control,
    name: "assetItems.assets",
  });

  const addBankAccount = () => {
    appendBank({
      bankName: "",
      countryLocation: "",
      accountType: "",
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

  const addBusinessAssetItem = () => {
    appendAssetItem({
      description: "",
      currentMarketValue: "",
      loanBalance: "",
      isLeased: false,
      usedInProductionOfIncome: false,
    });
  };

  // Compute totals with useMemo
  const bankAccountsValue =
    useWatch({
      control,
      name: "bankAccountsInfo.bankAccounts",
    }) || [];
  const bankSum = useMemo(
    () =>
      Math.max(
        0,
        (bankAccountsValue || []).reduce(
          (sum: number, acc: any) => sum + (acc.value || 0),
          0
        )
      ),
    [bankAccountsValue]
  );

  const digitalAssetsValue =
    useWatch({
      control,
      name: "digitalAssetsInfo.digitalAssets",
    }) || [];
  const digitalSum = useMemo(
    () =>
      Math.max(
        0,
        (digitalAssetsValue || []).reduce(
          (sum: number, asset: any) => sum + (asset.usdEquivalent || 0),
          0
        )
      ),
    [digitalAssetsValue]
  );
  const total8 = bankSum + digitalSum;

  const assetsValue = useWatch({ control, name: "assetItems.assets" }) || [];
  const assetSum = useMemo(
    () =>
      (assetsValue || []).reduce((sum: number, asset: any) => {
        const quickSaleValue = (asset.currentMarketValue || 0) * 0.8;
        const loanBalance = asset.loanBalance || 0;
        const totalValue =
          asset.isLeased || asset.usedInProductionOfIncome
            ? 0
            : Math.max(0, quickSaleValue - loanBalance);
        return sum + totalValue;
      }, 0),
    [assetsValue]
  );
  const total9 = assetSum;
  const deduction = watch("assetItems.irsAllowedDeduction") || 0;
  const value11 = Math.max(0, total9 - deduction);
  const boxB = total8 + value11;

  const bankAccountTypes = [
    { title: "Cash", label: "cash" },
    { title: "Checking", label: "checking" },
    { title: "Savings", label: "savings" },
    { title: "Money Market Account/CD", label: "money-market" },
    { title: "Online Account", label: "online-account" },
    { title: "Stored Value Card", label: "stored-value-card" },
  ];

  // Update boxB
  useEffect(() => {
    setValue("boxB", boxB);
  }, [boxB, setValue]);

  if (loadingFormData || loadingSelfEmpFormData) {
    return <FormLoader />;
  }

  if (!isSelfEmployed) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            onNext={handleSubmit(onSubmit)}
            loading={loading}
          />
        </form>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 5: Business Asset Information (for Self-Employed) (Domestic
            and Foreign)
          </h2>
          <p className="text-gray-600">
            List business assets including bank accounts, digital assets (such
            as cryptocurrency), tools, books, machinery, equipment, business
            vehicles and real property that is owned/leased/rented. If
            additional space is needed, attach a list of items. Do not include
            personal assets listed in Section 3.
          </p>
          <p className="text-gray-800 font-semibold">
            Round to the nearest whole dollar. Do not enter a negative number.
            If any line item is a negative number, enter "0".
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
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4 mt-2"
                      >
                        {bankAccountTypes.map((type) => (
                          <div
                            key={type.label}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={type.label}
                              id={`bank-${index}-${type.label}`}
                              className="text-[#22b573]"
                            />
                            <Label
                              htmlFor={`bank-${index}-${type.label}`}
                              className="text-sm"
                            >
                              {type.title}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </FormField>

                <FormInput
                  label="Bank name"
                  required
                  id={`bankAccountsInfo.bankAccounts.${index}.bankName`}
                  {...register(
                    `bankAccountsInfo.bankAccounts.${index}.bankName`
                  )}
                  error={
                    errors.bankAccountsInfo?.bankAccounts?.[index]?.bankName
                      ?.message
                  }
                />

                <FormInput
                  label="Country location"
                  required
                  id={`bankAccountsInfo.bankAccounts.${index}.countryLocation`}
                  {...register(
                    `bankAccountsInfo.bankAccounts.${index}.countryLocation`
                  )}
                  error={
                    errors.bankAccountsInfo?.bankAccounts?.[index]
                      ?.countryLocation?.message
                  }
                />

                <FormInput
                  label="Account number"
                  required
                  id={`bankAccountsInfo.bankAccounts.${index}.accountNumber`}
                  {...register(
                    `bankAccountsInfo.bankAccounts.${index}.accountNumber`
                  )}
                  error={
                    errors.bankAccountsInfo?.bankAccounts?.[index]
                      ?.accountNumber?.message
                  }
                />

                <FormInput
                  label="Value ($)"
                  required
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  min="0"
                  placeholder="0"
                  id={`bankAccountsInfo.bankAccounts.${index}.value`}
                  {...register(`bankAccountsInfo.bankAccounts.${index}.value`, {
                    valueAsNumber: true,
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  error={
                    errors.bankAccountsInfo?.bankAccounts?.[index]?.value
                      ?.message
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
                  required
                  id={`digitalAssetsInfo.digitalAssets.${index}.description`}
                  {...register(
                    `digitalAssetsInfo.digitalAssets.${index}.description`
                  )}
                  error={
                    errors.digitalAssetsInfo?.digitalAssets?.[index]
                      ?.description?.message
                  }
                />

                <FormInput
                  label="Number of units (optional)"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  placeholder="0"
                  id={`digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`}
                  {...register(
                    `digitalAssetsInfo.digitalAssets.${index}.numberOfUnits`,
                    {
                      valueAsNumber: true,
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                      },
                      min: {
                        value: 0,
                        message: "Number of units cannot be negative",
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
                  required
                  id={`digitalAssetsInfo.digitalAssets.${index}.location`}
                  {...register(
                    `digitalAssetsInfo.digitalAssets.${index}.location`
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
                    `digitalAssetsInfo.digitalAssets.${index}.accountNumber`
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
                    `digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress`
                  )}
                  error={
                    errors.digitalAssetsInfo?.digitalAssets?.[index]
                      ?.digitalAssetAddress?.message
                  }
                />

                <FormInput
                  label="US dollar ($) equivalent of the digital asset as of today"
                  required
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  min="0"
                  placeholder="0"
                  id={`digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`}
                  {...register(
                    `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`,
                    {
                      valueAsNumber: true,
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                      min: {
                        value: 0,
                        message: "USD equivalent cannot be negative",
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
                  <h4 className="font-medium text-gray-900">
                    Asset {index + 1}
                  </h4>
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
                  required
                  id={`assetItems.assets.${index}.description`}
                  {...register(`assetItems.assets.${index}.description`)}
                  error={
                    errors.assetItems?.assets?.[index]?.description?.message
                  }
                />

                <FormInput
                  label="Current market value ($)"
                  required
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  min="0"
                  placeholder="0"
                  id={`assetItems.assets.${index}.currentMarketValue`}
                  {...register(
                    `assetItems.assets.${index}.currentMarketValue`,
                    {
                      valueAsNumber: true,
                      onChange: (e: any) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                      },
                    }
                  )}
                  error={
                    errors.assetItems?.assets?.[index]?.currentMarketValue
                      ?.message
                  }
                />

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    X .8 = $
                    {(
                      (watch(`assetItems.assets.${index}.currentMarketValue`) ||
                        0) * 0.8
                    ).toFixed(0)}
                  </Label>
                </div>

                <FormInput
                  label="Minus loan balance ($)"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  min="0"
                  placeholder="0"
                  id={`assetItems.assets.${index}.loanBalance`}
                  {...register(`assetItems.assets.${index}.loanBalance`, {
                    valueAsNumber: true,
                    onChange: (e: any) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                    },
                  })}
                  error={
                    errors.assetItems?.assets?.[index]?.loanBalance?.message
                  }
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
                          onCheckedChange={field.onChange}
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
                          onCheckedChange={field.onChange}
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

                <div className="bg-gray-50 p-3 rounded">
                  <Label className="text-sm font-medium">
                    Total value (if leased or used in the production of income,
                    enter 0 as the total value) = $
                    {(() => {
                      const currentMarketValue =
                        watch(
                          `assetItems.assets.${index}.currentMarketValue`
                        ) || 0;
                      const quickSaleValue = currentMarketValue * 0.8;
                      const loanBalance =
                        watch(`assetItems.assets.${index}.loanBalance`) || 0;
                      const isLeased =
                        watch(`assetItems.assets.${index}.isLeased`) || false;
                      const usedInProductionOfIncome =
                        watch(
                          `assetItems.assets.${index}.usedInProductionOfIncome`
                        ) || false;
                      return (
                        isLeased || usedInProductionOfIncome
                          ? 0
                          : Math.max(0, quickSaleValue - loanBalance)
                      ).toFixed(0);
                    })()}
                  </Label>
                </div>
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

            <div className="flex justify-between font-medium">
              <span>Add lines (9a) through (9c) = (9)</span>
              <span>${total9.toFixed(0)}</span>
            </div>

            <FormInput
              label="IRS allowed deduction for professional books and tools of trade for individuals and sole-proprietors - (10) ($)"
              type="text"
              inputMode="decimal"
              pattern="[0-9.]*"
              min="0"
              placeholder="0"
              id="assetItems.irsAllowedDeduction"
              {...register("assetItems.irsAllowedDeduction", {
                valueAsNumber: true,
                onChange: (e: any) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
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
                    value={field.value ? "yes" : "no"}
                    onValueChange={(value: "yes" | "no") =>
                      field.onChange(value === "yes")
                    }
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
                    value={field.value ? "yes" : "no"}
                    onValueChange={(value: "yes" | "no") =>
                      field.onChange(value === "yes")
                    }
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
              Box B: Available Business Equity in Assets
            </p>
          </div>
        </div>

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
