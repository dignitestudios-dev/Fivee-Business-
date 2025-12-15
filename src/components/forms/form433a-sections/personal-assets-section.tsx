import { FormNavigation } from "./form-navigation";
import { FormInput, FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useFieldArray,
  Controller,
  useForm,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { preventAlphabetInput } from "@/lib/validation-schemas";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import usePersonalAssets from "@/hooks/433a-form-hooks/usePersonalAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalAssetsInitialValues,
  personalAssetsSchema,
} from "@/lib/validation/form433a/personal-assets-section";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import useCalculation from "@/hooks/433a-form-hooks/useCalculation";
import { storage, formatPhone } from "@/utils/helper";
import { saveCalculationInfo } from "@/lib/features/form433aSlice";

interface PersonalAssetsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  paymentStatus: boolean;
}

export function PersonalAssetsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
  paymentStatus,
}: PersonalAssetsSectionProps) {
  const { showError } = useGlobalPopup();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { assetsInfo, calculationInfo } = useAppSelector(
    (state) => state.form433a
  );
  const {
    loading,
    loadingFormData,
    handleSaveAssetsInfo,
    handleGetAssetsInfo,
  } = usePersonalAssets();

  // const { handleSaveCalculationInfo, handleGetCalculationInfo } =
  //   useCalculation();

  // Initialize form with zodResolver
  const methods = useForm<PersonalAssetsFormSchema>({
    resolver: zodResolver(personalAssetsSchema),
    defaultValues: personalAssetsInitialValues,
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
    getValues,
  } = methods;

  const onSubmit = async (data: PersonalAssetsFormSchema) => {
    try {
      // Data is already validated by Zod through zodResolver
      const payload = { ...data, boxA: totalEquity };
      await handleSaveAssetsInfo(payload, caseId);
      // const form433aProgress: any = storage.get("433a_progress");
      // if (form433aProgress) {
      //   if (
      //     form433aProgress?.completedSteps?.includes(8) &&
      //     calculationInfo &&
      //     calculationInfo.paymentTimeline
      //   ) {
      //     handleSaveCalculationInfo(
      //       { paymentTimeline: calculationInfo.paymentTimeline },
      //       caseId
      //     );
      //   }
      // }

      // Only proceed to next step if successful
      onNext();
    } catch (error: any) {
      console.error("Error saving assets info:", error);
      showError(
        error.message || "Failed to save assets info",
        "Personal Assets Error"
      );
    }
  };

  const isSelling = watch("isForSale") || watch("anticipateSelling");

  useEffect(() => {
    if (!assetsInfo) handleGetAssetsInfo(caseId, FORM_433A_SECTIONS[2]);
    // const form433aProgress: any = storage.get("433a_progress");
    // if (!calculationInfo && form433aProgress?.completedSteps?.includes(8))
    //   handleGetCalculationInfo(caseId, FORM_433A_SECTIONS[7]);
  }, []);

  useEffect(() => {
    if (assetsInfo) {
      reset(assetsInfo);
    }
  }, [assetsInfo, reset]);

  // --- BANK ACCOUNTS ---
  const {
    fields: bankAccounts,
    append: addBankAccount,
    remove: removeBankAccount,
  } = useFieldArray({
    control,
    name: "bankAccounts",
  });

  // --- INVESTMENT ACCOUNTS ---
  const {
    fields: investmentAccounts,
    append: addInvestmentAccount,
    remove: removeInvestmentAccount,
  } = useFieldArray({
    control,
    name: "investmentAccounts",
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

  // --- LIFE INSURANCE POLICIES ---
  const {
    fields: lifeInsurancePolicies,
    append: addLifeInsurancePolicy,
    remove: removeLifeInsurancePolicy,
  } = useFieldArray({
    control,
    name: "lifeInsurancePolicies",
  });

  // --- REAL PROPERTIES ---
  const {
    fields: realProperties,
    append: addRealProperty,
    remove: removeRealProperty,
  } = useFieldArray({ control, name: "realProperties" });

  // --- VEHICLES ---
  const {
    fields: vehicles,
    append: addVehicle,
    remove: removeVehicle,
  } = useFieldArray({ control, name: "vehicles" });

  // --- VALUABLE ITEMS ---
  const {
    fields: valuableItems,
    append: addValuableItem,
    remove: removeValuableItem,
  } = useFieldArray({ control, name: "valuableItems" });

  // --- FURNITURE PERSONAL EFFECTS ---
  const {
    fields: furniturePersonalEffects,
    append: addFurniturePersonalEffect,
    remove: removeFurniturePersonalEffect,
  } = useFieldArray({ control, name: "furniturePersonalEffects" });

  const bankAccountTypes = [
    { title: "Cash", label: "cash" },
    { title: "Checking", label: "checking" },
    { title: "Savings", label: "savings" },
    { title: "Money Market Account/CD", label: "money-market" },
    { title: "Online Account", label: "online-account" },
    { title: "Stored Value Card", label: "stored-value-card" },
  ];

  const investmentAccountTypes = [
    { title: "Stocks", label: "stocks" },
    { title: "Bonds", label: "bonds" },
    { title: "Other", label: "other" },
  ];

  // Compute all subtotals with useMemo for optimization
  // useWatch subscribes to array fields and is more optimized than many individual watch() calls
  const bankAccountsValue = useWatch({ control, name: "bankAccounts" }) || [];
  const bankTotal = useMemo(
    () =>
      Math.max(
        0,
        (bankAccountsValue || []).reduce(
          (sum: any, acc: any) => sum + (acc.balance || 0),
          0
        )
      ),
    [bankAccountsValue]
  );
  const bankTotalMinus1000 = useMemo(
    () => Math.max(0, bankTotal - 1000),
    [bankTotal]
  );

  const investmentAccountsValue =
    useWatch({ control, name: "investmentAccounts" }) || [];
  const investmentTotal = useMemo(
    () =>
      (investmentAccountsValue || []).reduce(
        (sum: any, inv: any) =>
          sum +
          Math.max(0, (inv.currentMarketValue || 0) - (inv.loanBalance || 0)),
        0
      ),
    [investmentAccountsValue]
  );

  const digitalAssetsValue = useWatch({ control, name: "digitalAssets" }) || [];
  const digitalTotal = useMemo(
    () =>
      (digitalAssetsValue || []).reduce(
        (sum: any, asset: any) => sum + (asset.usdEquivalent || 0),
        0
      ),
    [digitalAssetsValue]
  );

  const retirementAccountsValue =
    useWatch({ control, name: "retirementAccounts" }) || [];
  const retirementTotal = useMemo(
    () =>
      (retirementAccountsValue || []).reduce(
        (sum: any, ret: any) =>
          sum +
          Math.max(
            0,
            (ret.currentMarketValue || 0) * 0.8 - (ret.loanBalance || 0)
          ),
        0
      ),
    [retirementAccountsValue]
  );

  const lifeInsurancePoliciesValue =
    useWatch({ control, name: "lifeInsurancePolicies" }) || [];
  const insuranceTotal = useMemo(
    () =>
      (lifeInsurancePoliciesValue || []).reduce(
        (sum: any, ins: any) =>
          sum +
          Math.max(0, (ins.currentCashValue || 0) - (ins.loanBalance || 0)),
        0
      ),
    [lifeInsurancePoliciesValue]
  );

  const realPropertiesValue =
    useWatch({ control, name: "realProperties" }) || [];
  const propertyTotal = useMemo(
    () =>
      (realPropertiesValue || []).reduce(
        (sum: any, prop: any) =>
          sum +
          Math.max(
            0,
            (prop?.currentMarketValue || 0) * 0.8 - (prop?.loanBalance || 0)
          ),
        0
      ),
    [realPropertiesValue]
  );

  const vehiclesValue = useWatch({ control, name: "vehicles" }) || [];
  const vehicleTotal = useMemo(() => {
    let total = 0;
    (vehiclesValue || []).forEach((vehicle: any, index: any) => {
      if (vehicle.ownershipType !== "lease") {
        const vehicleValue = Math.max(
          0,
          (vehicle.currentMarketValue || 0) * 0.8 - (vehicle.loanBalance || 0)
        );
        if (index === 0) {
          total += Math.max(0, vehicleValue - 3450);
        } else {
          if (vehicle.isJointOffer) {
            total += Math.max(0, vehicleValue - 3450);
          } else {
            total += vehicleValue;
          }
        }
      }
    });
    return total;
  }, [vehiclesValue]);

  const valuableItemsValue = useWatch({ control, name: "valuableItems" }) || [];
  const valuablesTotal = useMemo(
    () =>
      (valuableItemsValue || []).reduce(
        (sum: any, item: any) =>
          sum +
          Math.max(
            0,
            (item.currentMarketValue || 0) * 0.8 - (item.loanBalance || 0)
          ),
        0
      ),
    [valuableItemsValue]
  );

  const furniturePersonalEffectsValue =
    useWatch({ control, name: "furniturePersonalEffects" }) || [];
  const furnitureTotal = useMemo(
    () =>
      (furniturePersonalEffectsValue || []).reduce(
        (sum: any, item: any) =>
          sum +
          Math.max(
            0,
            (item.currentMarketValue || 0) * 0.8 - (item.loanBalance || 0)
          ),
        0
      ),
    [furniturePersonalEffectsValue]
  );
  const otherTotal = useMemo(
    () => Math.max(0, valuablesTotal + furnitureTotal - 11710),
    [valuablesTotal, furnitureTotal]
  );

  const totalEquity = useMemo(
    () =>
      bankTotalMinus1000 +
      investmentTotal +
      digitalTotal +
      retirementTotal +
      insuranceTotal +
      propertyTotal +
      vehicleTotal +
      otherTotal,
    [
      bankTotalMinus1000,
      investmentTotal,
      digitalTotal,
      retirementTotal,
      insuranceTotal,
      propertyTotal,
      vehicleTotal,
      otherTotal,
    ]
  );

  // Save boxA in form state (debounced to avoid excessive setValue calls & re-renders)
  const boxADebounceRef = useRef<number | null>(null);
  useEffect(() => {
    // clear existing timeout
    if (boxADebounceRef.current) {
      clearTimeout(boxADebounceRef.current);
    }
    // set a short debounce to batch rapid updates
    boxADebounceRef.current = window.setTimeout(() => {
      setValue("boxA", totalEquity);
    }, 120);

    return () => {
      if (boxADebounceRef.current) clearTimeout(boxADebounceRef.current);
    };
  }, [totalEquity, setValue]);

  // Ensure first vehicle's isJointOffer is always false (do not allow joint offer for first vehicle)
  useEffect(() => {
    const first = (vehiclesValue || [])[0];
    // Only update if the first vehicle exists and isJointOffer is truthy.
    // Avoid setting the same value repeatedly which causes update loops.
    if (first && first.isJointOffer) {
      setValue("vehicles.0.isJointOffer", false);
    }
  }, [vehiclesValue, setValue]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

        {/* Bank Accounts (Domestic and Foreign) */}
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
                  <Controller
                    name={`bankAccounts.${index}.accountType`}
                    control={control}
                    rules={{ required: "Account type is required" }}
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

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Bank Name"
                    id={`bankAccounts.${index}.bankName`}
                    required
                    {...register(`bankAccounts.${index}.bankName`)}
                    error={errors.bankAccounts?.[index]?.bankName?.message}
                  />

                  <FormInput
                    label="Bank Country Location"
                    id={`bankAccounts.${index}.countryLocation`}
                    required
                    {...register(`bankAccounts.${index}.countryLocation`)}
                    error={
                      errors.bankAccounts?.[index]?.countryLocation?.message
                    }
                  />

                  <FormInput
                    label="Account Number"
                    id={`bankAccounts.${index}.accountNumber`}
                    required
                    {...register(`bankAccounts.${index}.accountNumber`)}
                    onChange={(e) => preventAlphabetInput(e)}
                    error={errors.bankAccounts?.[index]?.accountNumber?.message}
                  />

                  <FormInput
                    label="Balance ($)"
                    id={`bankAccounts.${index}.balance`}
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    min="0"
                    placeholder=""
                    required
                    {...register(`bankAccounts.${index}.balance`, {
                      setValueAs: (v) =>
                        v === ""
                          ? 0
                          : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        // allow only numbers and decimal point
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      },
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
                  countryLocation: "",
                  accountNumber: "",
                  balance: "",
                })
              }
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>

            {/* Auto-calculated bank accounts total value */}
            {/* <div className="bg-gray-50 p-3 rounded">
              <Label className="text-sm font-medium">
                Total of bank accounts from attachment: $
                {bankTotal.toLocaleString()}
              </Label>
            </div> */}
          </CardContent>
        </Card>

        {/* Investment Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Accounts (Domestic and Foreign)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {investmentAccounts.map((field, index) => {
              const inv = investmentAccountsValue[index] || {};
              const investmentAccountType = inv.investmentType || "";

              return (
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
                      onClick={() => removeInvestmentAccount(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Investment Type Radio Buttons */}
                  <FormField
                    label="Investment Account"
                    id={`investmentAccounts.${index}.investmentType`}
                    required
                    error={
                      errors.investmentAccounts?.[index]?.investmentType
                        ?.message
                    }
                  >
                    <Controller
                      name={`investmentAccounts.${index}.investmentType`}
                      control={control}
                      rules={{ required: "Investment type is required" }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4 mt-2"
                        >
                          {investmentAccountTypes.map((type) => (
                            <div
                              key={type.label}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={type.label}
                                id={`investment-${index}-${type.label}`}
                                className="text-[#22b573]"
                              />
                              <Label
                                htmlFor={`investment-${index}-${type.label}`}
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

                  {investmentAccountType === "other" && (
                    <FormInput
                      label="Other"
                      id={`investmentAccounts.${index}.investmentTypeText`}
                      required
                      {...register(
                        `investmentAccounts.${index}.investmentTypeText`
                      )}
                      error={
                        errors.investmentAccounts?.[index]?.investmentTypeText
                          ?.message
                      }
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Name of Financial Institution"
                      id={`investmentAccounts.${index}.institutionName`}
                      required
                      {...register(
                        `investmentAccounts.${index}.institutionName`
                      )}
                      error={
                        errors.investmentAccounts?.[index]?.institutionName
                          ?.message
                      }
                    />

                    <FormInput
                      label="Financial Institution Country Location"
                      id={`investmentAccounts.${index}.countryLocation`}
                      required
                      {...register(
                        `investmentAccounts.${index}.countryLocation`
                      )}
                      error={
                        errors.investmentAccounts?.[index]?.countryLocation
                          ?.message
                      }
                    />

                    <FormInput
                      label="Account Number"
                      id={`investmentAccounts.${index}.accountNumber`}
                      required
                      {...register(`investmentAccounts.${index}.accountNumber`)}
                      onChange={(e) => preventAlphabetInput(e)}
                      error={
                        errors.investmentAccounts?.[index]?.accountNumber
                          ?.message
                      }
                    />

                    <FormInput
                      label="Current Market Value ($)"
                      id={`investmentAccounts.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(
                        `investmentAccounts.${index}.currentMarketValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.investmentAccounts?.[index]?.currentMarketValue
                          ?.message
                      }
                    />
                  </div>

                  <FormInput
                    label="Minus Loan Balance ($)"
                    id={`investmentAccounts.${index}.loanBalance`}
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    min="0"
                    placeholder=""
                    {...register(`investmentAccounts.${index}.loanBalance`, {
                      setValueAs: (v) =>
                        v === ""
                          ? 0
                          : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      },
                      min: {
                        value: 0,
                        message: "Loan balance cannot be negative",
                      },
                    })}
                    error={
                      errors.investmentAccounts?.[index]?.loanBalance?.message
                    }
                    className="max-w-md"
                  />

                  {/* Auto-calculated net value */}
                  <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-sm font-medium">
                      Net Value: $
                      {Math.max(
                        0,
                        (inv.currentMarketValue || 0) - (inv.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addInvestmentAccount({
                  investmentType: "",
                  institutionName: "",
                  countryLocation: "",
                  accountNumber: "",
                  currentMarketValue: "",
                  loanBalance: "",
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
                    id={`digitalAssets.${index}.numberOfUnits`}
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    min="0"
                    step="any"
                    placeholder=""
                    required
                    {...register(`digitalAssets.${index}.numberOfUnits`, {
                      setValueAs: (v) =>
                        v === ""
                          ? 0
                          : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      },
                      min: { value: 0, message: "Units cannot be negative" },
                    })}
                    error={
                      errors.digitalAssets?.[index]?.numberOfUnits?.message
                    }
                  />
                </div>

                <FormInput
                  label="Location of Digital Asset (exchange account, self-hosted wallet)"
                  id={`digitalAssets.${index}.location`}
                  required
                  {...register(`digitalAssets.${index}.location`)}
                  error={errors.digitalAssets?.[index]?.location?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Account Number (for custodial assets held by a broker)"
                    id={`digitalAssets.${index}.accountNumber`}
                    placeholder="Leave blank if self-hosted"
                    {...register(`digitalAssets.${index}.accountNumber`)}
                    error={
                      errors.digitalAssets?.[index]?.accountNumber?.message
                    }
                  />

                  <FormInput
                    label="Digital Asset Address (for self-hosted assets)"
                    id={`digitalAssets.${index}.digitalAssetAddress`}
                    placeholder="Leave blank if custodial"
                    {...register(`digitalAssets.${index}.digitalAssetAddress`)}
                    error={
                      errors.digitalAssets?.[index]?.digitalAssetAddress
                        ?.message
                    }
                  />

                  <FormInput
                    label="US Dollar Equivalent as of Today ($)"
                    id={`digitalAssets.${index}.usdEquivalent`}
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    min="0"
                    placeholder=""
                    required
                    {...register(`digitalAssets.${index}.usdEquivalent`, {
                      setValueAs: (v) =>
                        v === ""
                          ? 0
                          : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      },
                      min: { value: 0, message: "Value cannot be negative" },
                    })}
                    error={
                      errors.digitalAssets?.[index]?.usdEquivalent?.message
                    }
                    className="col-span-1"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addDigitalAsset({
                  description: "",
                  numberOfUnits: "",
                  location: "",
                  accountNumber: "",
                  digitalAssetAddress: "",
                  usdEquivalent: "",
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
            {retirementAccounts.map((field, index) => {
              const ret = retirementAccountsValue[index] || {};
              const retirementAccountType = ret.retirementType || "";

              return (
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
                    id={`retirementAccounts.${index}.retirementType`}
                    required
                    error={
                      errors.retirementAccounts?.[index]?.retirementType
                        ?.message
                    }
                  >
                    <Controller
                      name={`retirementAccounts.${index}.retirementType`}
                      control={control}
                      rules={{
                        required: "Retirement account type is required",
                      }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4 mt-2"
                        >
                          {[
                            { label: "401K", value: "401k" },
                            { label: "IRA", value: "ira" },
                            { label: "Other", value: "other" },
                          ].map((type) => (
                            <div
                              key={type.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={type.value}
                                id={`retirement-${index}-${type.value}`}
                                className="text-[#22b573]"
                              />
                              <Label
                                htmlFor={`retirement-${index}-${type.value}`}
                                className="text-sm"
                              >
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormField>

                  {/* Conditional Other Type Text Field */}
                  {ret.retirementType === "other" && (
                    <FormInput
                      label="Please specify retirement account type"
                      id={`retirementAccounts.${index}.retirementTypeText`}
                      required
                      placeholder="Enter retirement account type"
                      {...register(
                        `retirementAccounts.${index}.retirementTypeText`,
                        {
                          required:
                            ret.retirementType === "other"
                              ? "Please specify the retirement account type"
                              : false,
                        }
                      )}
                      error={
                        errors.retirementAccounts?.[index]?.retirementTypeText
                          ?.message
                      }
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Name of Financial Institution"
                      id={`retirementAccounts.${index}.institutionName`}
                      required
                      {...register(
                        `retirementAccounts.${index}.institutionName`
                      )}
                      error={
                        errors.retirementAccounts?.[index]?.institutionName
                          ?.message
                      }
                    />

                    <FormInput
                      label="Country Location"
                      id={`retirementAccounts.${index}.countryLocation`}
                      required
                      {...register(
                        `retirementAccounts.${index}.countryLocation`
                      )}
                      error={
                        errors.retirementAccounts?.[index]?.countryLocation
                          ?.message
                      }
                    />
                  </div>

                  <FormInput
                    label="Account Number"
                    id={`retirementAccounts.${index}.accountNumber`}
                    {...register(`retirementAccounts.${index}.accountNumber`)}
                    onChange={(e) => preventAlphabetInput(e)}
                    error={
                      errors.retirementAccounts?.[index]?.accountNumber?.message
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Current Market Value ($)"
                      id={`retirementAccounts.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(
                        `retirementAccounts.${index}.currentMarketValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.retirementAccounts?.[index]?.currentMarketValue
                          ?.message
                      }
                    />

                    <div className="bg-gray-50 p-3 rounded">
                      <Label className="text-sm font-medium">
                        Market Value × 0.8: $
                        {((ret.currentMarketValue || 0) * 0.8).toLocaleString()}
                      </Label>
                    </div>

                    <FormInput
                      label="Minus Loan Balance ($)"
                      id={`retirementAccounts.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`retirementAccounts.${index}.loanBalance`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
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
                        (ret.currentMarketValue || 0) * 0.8 -
                          (ret.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addRetirementAccount({
                  retirementType: "",
                  institutionName: "",
                  countryLocation: "",
                  accountNumber: "",
                  currentMarketValue: "",
                  loanBalance: "",
                })
              }
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Retirement Account
            </Button>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <strong>Note:</strong> Your reduction from current market value
              may be greater than 20% due to potential tax
              consequences/withdrawal penalties.
            </div>
          </CardContent>
        </Card>

        {/* Cash Value of Life Insurance Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Value of Life Insurance Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lifeInsurancePolicies.map((field, index) => {
              const ins = lifeInsurancePoliciesValue[index] || {};
              return (
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
                      onClick={() => removeLifeInsurancePolicy(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Name of Insurance Company"
                      id={`lifeInsurancePolicies.${index}.companyName`}
                      required
                      {...register(
                        `lifeInsurancePolicies.${index}.companyName`
                      )}
                      error={
                        errors.lifeInsurancePolicies?.[index]?.companyName
                          ?.message
                      }
                    />

                    <FormInput
                      label="Policy Number"
                      id={`lifeInsurancePolicies.${index}.policyNumber`}
                      required
                      {...register(
                        `lifeInsurancePolicies.${index}.policyNumber`
                      )}
                      error={
                        errors.lifeInsurancePolicies?.[index]?.policyNumber
                          ?.message
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Current Cash Value ($)"
                      id={`lifeInsurancePolicies.${index}.currentCashValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(
                        `lifeInsurancePolicies.${index}.currentCashValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Cash value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.lifeInsurancePolicies?.[index]?.currentCashValue
                          ?.message
                      }
                    />

                    <FormInput
                      label="Minus Loan Balance ($)"
                      id={`lifeInsurancePolicies.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(
                        `lifeInsurancePolicies.${index}.loanBalance`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Loan balance cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.lifeInsurancePolicies?.[index]?.loanBalance
                          ?.message
                      }
                    />
                  </div>

                  {/* Auto-calculated net value */}
                  <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-sm font-medium">
                      Net Value: $
                      {Math.max(
                        0,
                        (ins.currentCashValue || 0) - (ins.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addLifeInsurancePolicy({
                  companyName: "",
                  policyNumber: "",
                  currentCashValue: "",
                  loanBalance: "",
                })
              }
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Life Insurance Policy
            </Button>
          </CardContent>
        </Card>

        {/* Real Properties */}
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
            {/* Property Sale Status Questions */}
            <FormField id="realProperties-sale-status">
              <div className="space-y-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name={"isForSale"}
                    control={control}
                    render={({ field }) => {
                      // If either field is true, show the combined checkbox as checked
                      const anticipate = watch("anticipateSelling");
                      const checked = !!field.value || !!anticipate;

                      return (
                        <Checkbox
                          id={`isForSaleCombined`}
                          checked={checked}
                          onCheckedChange={(v) => {
                            const bool = !!v;
                            // update both form fields so they remain in sync
                            field.onChange(bool);
                            setValue("anticipateSelling", bool, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      );
                    }}
                  />

                  <Label htmlFor={`isForSaleCombined`}>
                    Is this property currently for sale? Do you anticipate
                    selling this property to fund the offer amount?
                  </Label>
                </div>
              </div>

              {isSelling && (
                <div className="mt-3">
                  <FormInput
                    label="Listing Price ($)"
                    id={`listingPrice`}
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*\\.?[0-9]*$"
                    min="0"
                    required
                    placeholder=""
                    {...register(`listingPrice`, {
                      setValueAs: (v) =>
                        v === ""
                          ? 0
                          : Number(String(v).replace(/[^0-9.]/g, "")),
                      onChange: (e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      },
                      min: {
                        value: 0,
                        message: "Listing price cannot be negative",
                      },
                    })}
                    error={errors.listingPrice?.message}
                    className="max-w-md"
                  />
                </div>
              )}
            </FormField>

            {realProperties.map((field, index) => {
              const prop = realPropertiesValue[index] || {};

              return (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Property Description (indicate if personal residence, rental property, vacant, etc.)"
                      id={`realProperties.${index}.description`}
                      required
                      {...register(`realProperties.${index}.description`)}
                      error={
                        errors.realProperties?.[index]?.description?.message
                      }
                    />

                    <FormInput
                      label="Purchase Date (mm/dd/yyyy)"
                      id={`realProperties.${index}.purchaseDate`}
                      type="date"
                      required
                      {...register(`realProperties.${index}.purchaseDate`)}
                      error={
                        errors.realProperties?.[index]?.purchaseDate?.message
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Amount of Mortgage Payment ($)"
                      id={`realProperties.${index}.mortgagePayment`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`realProperties.${index}.mortgagePayment`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Payment cannot be negative",
                        },
                      })}
                      error={
                        errors.realProperties?.[index]?.mortgagePayment?.message
                      }
                    />

                    <FormInput
                      label="Date of Final Payment (mm/dd/yyyy)"
                      id={`realProperties.${index}.finalPaymentDate`}
                      type="date"
                      {...register(`realProperties.${index}.finalPaymentDate`)}
                      error={
                        errors.realProperties?.[index]?.finalPaymentDate
                          ?.message
                      }
                    />

                    <FormInput
                      label="How Title is Held (joint tenancy, etc.)"
                      id={`realProperties.${index}.titleHeld`}
                      required
                      {...register(`realProperties.${index}.titleHeld`)}
                      error={errors.realProperties?.[index]?.titleHeld?.message}
                    />
                  </div>

                  <FormInput
                    label="Location (street, city, state, ZIP code, county, and country)"
                    id={`realProperties.${index}.location`}
                    required
                    {...register(`realProperties.${index}.location`)}
                    error={errors.realProperties?.[index]?.location?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Lender Name"
                      id={`realProperties.${index}.lenderName`}
                      {...register(`realProperties.${index}.lenderName`)}
                      error={
                        errors.realProperties?.[index]?.lenderName?.message
                      }
                    />

                    <FormInput
                      label="Lender Address"
                      id={`realProperties.${index}.lenderAddress`}
                      {...register(`realProperties.${index}.lenderAddress`)}
                      error={
                        errors.realProperties?.[index]?.lenderAddress?.message
                      }
                    />

                    <FormInput
                      label="Lender Phone"
                      id={`realProperties.${index}.lenderPhone`}
                      {...register(`realProperties.${index}.lenderPhone`, {
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          setValue(
                            `realProperties.${index}.lenderPhone`,
                            formatPhone(e.target.value)
                          ),
                      })}
                      error={
                        errors.realProperties?.[index]?.lenderPhone?.message
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Current Market Value ($)"
                      id={`realProperties.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(
                        `realProperties.${index}.currentMarketValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.realProperties?.[index]?.currentMarketValue
                          ?.message
                      }
                    />

                    <div className="bg-gray-50 p-3 rounded">
                      <Label className="text-sm font-medium">
                        Market Value × 0.8: $
                        {(
                          (prop.currentMarketValue || 0) * 0.8
                        ).toLocaleString()}
                      </Label>
                    </div>

                    <FormInput
                      label="Minus Loan Balance (mortgages, etc.) ($)"
                      id={`realProperties.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`realProperties.${index}.loanBalance`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Loan balance cannot be negative",
                        },
                      })}
                      error={
                        errors.realProperties?.[index]?.loanBalance?.message
                      }
                    />
                  </div>

                  {/* Auto-calculated net value */}
                  {/* <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-sm font-medium">
                      Total Value of Real Estate: $
                      {Math.max(
                        0,
                        (prop.currentMarketValue || 0) * 0.8 -
                          (prop.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div> */}
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addRealProperty({
                  description: "",
                  purchaseDate: "",
                  mortgagePayment: "",
                  finalPaymentDate: "",
                  titleHeld: "",
                  location: "",
                  lenderName: "",
                  lenderAddress: "",
                  lenderPhone: "",
                  currentMarketValue: "",
                  loanBalance: "",
                  isForSale: false,
                  anticipateSelling: false,
                  listingPrice: undefined,
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
              Enter information about any cars, boats, motorcycles, etc. that
              you own or lease. Include those located in foreign countries or
              jurisdictions.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicles.map((field, index) => {
              const veh = vehiclesValue[index] || {};
              return (
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

                  {/* Joint offer checkbox (not shown for first vehicle) */}
                  {index !== 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Controller
                        name={`vehicles.${index}.isJointOffer`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <Checkbox
                              id={`vehicles.${index}.isJointOffer`}
                              checked={!!field.value}
                              onCheckedChange={(v) => field.onChange(!!v)}
                            />
                            <Label
                              htmlFor={`vehicles.${index}.isJointOffer`}
                              className="ml-2"
                            >
                              Filling a joint offer
                            </Label>
                          </>
                        )}
                      />
                    </div>
                  )}

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
                      type="text"
                      inputMode="numeric"
                      pattern="^[0-9]*$"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                      {...register(`vehicles.${index}.year`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9]/g, "")),
                        onChange: (e) => {
                          // integers only for year
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        },
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
                      id={`vehicles.${index}.purchaseDate`}
                      type="date"
                      required
                      {...register(`vehicles.${index}.purchaseDate`)}
                      error={errors.vehicles?.[index]?.purchaseDate?.message}
                    />

                    <FormInput
                      label="Mileage"
                      id={`vehicles.${index}.mileage`}
                      type="text"
                      inputMode="numeric"
                      pattern="^[0-9]*$"
                      min="0"
                      required
                      {...register(`vehicles.${index}.mileage`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Mileage cannot be negative",
                        },
                      })}
                      error={errors.vehicles?.[index]?.mileage?.message}
                    />

                    <FormInput
                      label="License/Tag Number"
                      id={`vehicles.${index}.licenseTagNumber`}
                      required
                      {...register(`vehicles.${index}.licenseTagNumber`)}
                      error={
                        errors.vehicles?.[index]?.licenseTagNumber?.message
                      }
                    />
                  </div>

                  {/* Ownership Type Radio Buttons */}
                  <FormField
                    label="Vehicle Ownership Type"
                    id={`vehicles.${index}.ownershipType`}
                    required
                    error={errors.vehicles?.[index]?.ownershipType?.message}
                  >
                    <Controller
                      name={`vehicles.${index}.ownershipType`}
                      control={control}
                      rules={{ required: "Vehicle ownership type is required" }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="lease"
                              id={`vehicle-${index}-lease`}
                              className="text-[#22b573]"
                            />
                            <Label htmlFor={`vehicle-${index}-lease`}>
                              Lease
                            </Label>
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
                      )}
                    />
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
                      error={
                        errors.vehicles?.[index]?.finalPaymentDate?.message
                      }
                    />

                    <FormInput
                      label="Monthly Lease/Loan Amount ($)"
                      id={`vehicles.${index}.monthlyLeaseLoanAmount`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`vehicles.${index}.monthlyLeaseLoanAmount`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Payment cannot be negative",
                        },
                      })}
                      error={
                        errors.vehicles?.[index]?.monthlyLeaseLoanAmount
                          ?.message
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Current Market Value ($)"
                      id={`vehicles.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(`vehicles.${index}.currentMarketValue`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: { value: 0, message: "Value cannot be negative" },
                      })}
                      error={
                        errors.vehicles?.[index]?.currentMarketValue?.message
                      }
                    />

                    <div className="bg-gray-50 p-3 rounded">
                      <Label className="text-sm font-medium">
                        Market Value × 0.8: $
                        {((veh.currentMarketValue || 0) * 0.8).toLocaleString()}
                      </Label>
                    </div>

                    <FormInput
                      label="Minus Loan Balance ($)"
                      id={`vehicles.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`vehicles.${index}.loanBalance`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Loan balance cannot be negative",
                        },
                      })}
                      error={errors.vehicles?.[index]?.loanBalance?.message}
                    />
                  </div>

                  {/* Auto-calculated values */}
                  {/* <div className="space-y-2 bg-gray-50 p-3 rounded">
                    <div>
                      <Label className="text-sm font-medium">
                        Total Value of Vehicle: $
                        {veh.ownershipType === "lease"
                          ? "0"
                          : Math.max(
                              0,
                              (veh.currentMarketValue || 0) * 0.8 -
                                (veh.loanBalance || 0)
                            ).toLocaleString()}
                      </Label>
                      {veh.ownershipType === "lease" && (
                        <p className="text-xs text-gray-600">
                          If leased, enter 0 as total value
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        {index === 0 ? "Subtract $3,450" : "Net Vehicle Value"}:
                        $
                        {(() => {
                          const totalValue =
                            veh.ownershipType === "lease"
                              ? 0
                              : veh.isJointOffer
                              ? Math.max(
                                  0,
                                  (veh.currentMarketValue || 0) * 0.8 -
                                    (veh.loanBalance || 0) -
                                    3450
                                )
                              : Math.max(
                                  0,
                                  (veh.currentMarketValue || 0) * 0.8 -
                                    (veh.loanBalance || 0)
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
                  </div> */}
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addVehicle({
                  makeModel: "",
                  year: new Date().getFullYear(),
                  purchaseDate: "",
                  mileage: "",
                  licenseTagNumber: "",
                  ownershipType: "",
                  creditorName: "",
                  finalPaymentDate: "",
                  monthlyLeaseLoanAmount: "",
                  currentMarketValue: "",
                  loanBalance: "",
                  isJointOffer: false,
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
              Artwork, collections, jewelry, items of value in safe deposit
              boxes, interest in a company or business that is not publicly
              traded, etc.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {valuableItems.map((field, index) => {
              const val = valuableItemsValue[index] || {};
              return (
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
                      onClick={() => removeValuableItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormInput
                    label="Description of Asset(s)"
                    id={`valuableItems.${index}.description`}
                    required
                    {...register(`valuableItems.${index}.description`)}
                    error={errors.valuableItems?.[index]?.description?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Current Market Value ($)"
                      id={`valuableItems.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(
                        `valuableItems.${index}.currentMarketValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.valuableItems?.[index]?.currentMarketValue
                          ?.message
                      }
                    />

                    <div className="bg-gray-50 p-3 rounded">
                      <Label className="text-sm font-medium">
                        Market Value × 0.8: $
                        {((val.currentMarketValue || 0) * 0.8).toLocaleString()}
                      </Label>
                    </div>

                    <FormInput
                      label="Minus Loan Balance ($)"
                      id={`valuableItems.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(`valuableItems.${index}.loanBalance`, {
                        setValueAs: (v) =>
                          v === ""
                            ? 0
                            : Number(String(v).replace(/[^0-9.]/g, "")),
                        onChange: (e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                        },
                        min: {
                          value: 0,
                          message: "Loan balance cannot be negative",
                        },
                      })}
                      error={
                        errors.valuableItems?.[index]?.loanBalance?.message
                      }
                    />
                  </div>

                  {/* Auto-calculated net value */}
                  <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-sm font-medium">
                      Net Value: $
                      {Math.max(
                        0,
                        (val.currentMarketValue || 0) * 0.8 -
                          (val.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addValuableItem({
                  description: "",
                  currentMarketValue: "",
                  loanBalance: "",
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
            {furniturePersonalEffects.map((field, index) => {
              const furn = furniturePersonalEffectsValue[index] || {};
              return (
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
                      onClick={() => removeFurniturePersonalEffect(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormInput
                    label="Description of Asset"
                    id={`furniturePersonalEffects.${index}.description`}
                    required
                    {...register(
                      `furniturePersonalEffects.${index}.description`
                    )}
                    error={
                      errors.furniturePersonalEffects?.[index]?.description
                        ?.message
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Current Market Value ($)"
                      id={`furniturePersonalEffects.${index}.currentMarketValue`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      required
                      {...register(
                        `furniturePersonalEffects.${index}.currentMarketValue`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Value cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.furniturePersonalEffects?.[index]
                          ?.currentMarketValue?.message
                      }
                    />

                    <div className="bg-gray-50 p-3 rounded">
                      <Label className="text-sm font-medium">
                        Market Value × 0.8: $
                        {(
                          (furn.currentMarketValue || 0) * 0.8
                        ).toLocaleString()}
                      </Label>
                    </div>

                    <FormInput
                      label="Minus Loan Balance ($)"
                      id={`furniturePersonalEffects.${index}.loanBalance`}
                      type="text"
                      inputMode="decimal"
                      pattern="^[0-9]*\\.?[0-9]*$"
                      min="0"
                      placeholder=""
                      {...register(
                        `furniturePersonalEffects.${index}.loanBalance`,
                        {
                          setValueAs: (v) =>
                            v === ""
                              ? 0
                              : Number(String(v).replace(/[^0-9.]/g, "")),
                          onChange: (e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                          },
                          min: {
                            value: 0,
                            message: "Loan balance cannot be negative",
                          },
                        }
                      )}
                      error={
                        errors.furniturePersonalEffects?.[index]?.loanBalance
                          ?.message
                      }
                    />
                  </div>

                  {/* Auto-calculated net value */}
                  <div className="bg-gray-50 p-3 rounded">
                    <Label className="text-sm font-medium">
                      Net Value: $
                      {Math.max(
                        0,
                        (furn.currentMarketValue || 0) * 0.8 -
                          (furn.loanBalance || 0)
                      ).toLocaleString()}
                    </Label>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addFurniturePersonalEffect({
                  description: "",
                  currentMarketValue: "",
                  loanBalance: "",
                })
              }
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Furniture/Personal Effect
            </Button>

            {/* <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-900">
                  Total Valuable Items + Furniture Value: $
                  {(valuablesTotal + furnitureTotal).toLocaleString()}
                </Label>
                <Label className="text-sm font-medium text-blue-900">
                  Minus IRS Deduction of $11,710: ${otherTotal.toLocaleString()}
                </Label>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Total Available Individual Equity Summary - COMMENTED OUT FOR FINAL SUMMARY POPUP */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Available Individual Equity in Assets Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Bank Accounts (minus $1,000):{" "}
                  </span>
                  ${bankTotalMinus1000.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Investments:{" "}
                  </span>
                  ${investmentTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Digital Assets:{" "}
                  </span>
                  ${digitalTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Retirement Accounts:{" "}
                  </span>
                  ${retirementTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Life Insurance:{" "}
                  </span>
                  ${insuranceTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Real Property:{" "}
                  </span>
                  ${propertyTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Vehicles: </span>$
                  {vehicleTotal.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    Other Items (minus $11,710):{" "}
                  </span>
                  ${otherTotal.toLocaleString()}
                </div>
                <hr className="my-3" />
                <div className="text-lg font-bold text-center">
                  <span>Total Available Individual Equity: </span>$
                  {totalEquity.toLocaleString()}
                </div>

                <p className="text-center text-sm font-medium mt-1">
                  Box A - Total Personal Assets
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit(onSubmit)}
          paymentStatus={paymentStatus}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
