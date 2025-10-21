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
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useBusinessAssetInfo from "@/hooks/433b-form-hooks/useBusinessAssetInfo";
import toast from "react-hot-toast";
import {
  businessAssetInitialValues,
  businessAssetSchema,
} from "@/lib/validation/form433b/business-asset-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";

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
  const { businessAssetsInfo } = useAppSelector((state) => state.form433b);
  const {
    loading,
    loadingFormData,
    handleSaveBusinessAssetsInfo,
    handleGetBusinessAssetsInfo,
  } = useBusinessAssetInfo();

  const methods = useForm<BusinessAssetsFormSchema>({
    resolver: zodResolver(businessAssetSchema),
    defaultValues: businessAssetInitialValues,
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
    getValues,
  } = methods;

  // Field arrays
  const {
    fields: bankFields,
    append: appendBank,
    remove: removeBank,
  } = useFieldArray({
    control,
    name: "bankAccounts",
  });

  const {
    fields: investFields,
    append: appendInvest,
    remove: removeInvest,
  } = useFieldArray({
    control,
    name: "investmentAccounts",
  });

  const {
    fields: digitalFields,
    append: appendDigital,
    remove: removeDigital,
  } = useFieldArray({
    control,
    name: "digitalAssets",
  });

  const {
    fields: notesFields,
    append: appendNotes,
    remove: removeNotes,
  } = useFieldArray({
    control,
    name: "notesReceivable",
  });

  const {
    fields: accountsFields,
    append: appendAccounts,
    remove: removeAccounts,
  } = useFieldArray({
    control,
    name: "accountsReceivable",
  });

  const {
    fields: realFields,
    append: appendReal,
    remove: removeReal,
  } = useFieldArray({
    control,
    name: "realEstate",
  });

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  const {
    fields: equipFields,
    append: appendEquip,
    remove: removeEquip,
  } = useFieldArray({
    control,
    name: "businessEquipment",
  });

  // Watch for conditionals
  const hasNotes = watch("hasNotesReceivable");
  const hasAccounts = watch("hasAccountsReceivable");

  // Real-time calculations
  const calculateAssets = () => {
    const data = getValues();

    const banksSum = data.bankAccounts.reduce(
      (sum: number, acc: any) => sum + (acc.balance || 0),
      0
    );

    const investsSum = data.investmentAccounts.reduce(
      (sum: number, inv: any) => {
        const equity = (inv.currentMarketValue || 0) - (inv.loanBalance || 0);
        return sum + Math.max(0, equity);
      },
      0
    );
    const digitalSum = data.digitalAssets.reduce(
      (sum: number, dig: any) => sum + (dig.usdValue || 0),
      0
    );
    const investTotal = investsSum + digitalSum;

    const realSum = data.realEstate.reduce((sum: number, real: any) => {
      const equity =
        (real.currentMarketValue || 0) * 0.8 - (real.loanBalance || 0);
      return sum + Math.max(0, equity);
    }, 0);

    const vehSum = data.vehicles.reduce((sum: number, veh: any) => {
      if (veh.leaseOrOwn === "Lease") return sum;
      const equity =
        (veh.currentMarketValue || 0) * 0.8 - (veh.loanBalance || 0);
      return sum + Math.max(0, equity);
    }, 0);

    const equipSum = data.businessEquipment.reduce(
      (sum: number, equip: any) => {
        if (equip.isLeased || equip.usedInProductionOfIncome) return sum;
        const equity =
          (equip.currentMarketValue || 0) * 0.8 - (equip.loanBalance || 0);
        return sum + Math.max(0, equity);
      },
      0
    );

    const boxA = Math.round(
      banksSum + investTotal + realSum + vehSum + equipSum
    );

    return {
      box1: Math.round(banksSum),
      box2: Math.round(investTotal),
      box3: Math.round(realSum),
      box4: Math.round(vehSum),
      box5: Math.round(equipSum),
      boxA,
    };
  };

  const assets = calculateAssets();

  const onSubmit = async (data: BusinessAssetsFormSchema) => {
    try {
      // Clear arrays if no
      if (!data.hasNotesReceivable) data.notesReceivable = [];
      if (!data.hasAccountsReceivable) data.accountsReceivable = [];

      // Remove calculated, only send payload fields
      const payload = { ...data };
      delete payload.hasNotesReceivable;
      delete payload.hasAccountsReceivable;

      await handleSaveBusinessAssetsInfo(payload, caseId);

      onNext();
    } catch (error: any) {
      console.error("Error saving business asset info:", error);
      toast.error(error.message || "Failed to save business asset info");
    }
  };

  useEffect(() => {
    if (!businessAssetsInfo)
      handleGetBusinessAssetsInfo(caseId, FORM_433B_SECTIONS[1]);
  }, []);

  useEffect(() => {
    if (businessAssetsInfo) {
      // Set hasXX based on arrays
      const hasNotes = businessAssetsInfo.notesReceivable?.length > 0;
      const hasAccounts = businessAssetsInfo.accountsReceivable?.length > 0;
      reset({
        ...businessAssetsInfo,
        hasNotesReceivable: hasNotes,
        hasAccountsReceivable: hasAccounts,
      });
    }
  }, [businessAssetsInfo]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  const bankAccountTypes = [
    { title: "Cash", label: "Cash" },
    { title: "Checking", label: "Checking" },
    { title: "Savings", label: "Savings" },
    { title: "Money Market/CD", label: "Money Market/CD" },
    { title: "Online Account", label: "Online Account" },
    { title: "Stored Value Card", label: "Stored Value Card" },
  ];

  const investmentTypes = [
    { title: "Stocks", label: "Stocks" },
    { title: "Bonds", label: "Bonds" },
    { title: "Other", label: "Other" },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 2: Business Asset Information
          </h2>
          <p className="text-gray-600">
            Provide information about business assets (domestic and foreign).
          </p>
        </div>

        {/* Cash and Investments (Banks) */}
        <Card>
          <CardHeader>
            <CardTitle>Cash and Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Bank Account {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBank(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormField
                  label="Account Type"
                  id={`bankAccounts.${index}.type`}
                  error={errors.bankAccounts?.[index]?.type?.message}
                >
                  <Controller
                    name={`bankAccounts.${index}.type`}
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
                  label="Bank Name and Country Location"
                  id={`bankAccounts.${index}.bankName`}
                  {...register(`bankAccounts.${index}.bankName`)}
                  error={errors.bankAccounts?.[index]?.bankName?.message}
                />
                <FormInput
                  label="Account Number"
                  id={`bankAccounts.${index}.accountNumber`}
                  {...register(`bankAccounts.${index}.accountNumber`)}
                  error={errors.bankAccounts?.[index]?.accountNumber?.message}
                />
                <FormInput
                  type="number"
                  label="Balance ($)"
                  id={`bankAccounts.${index}.balance`}
                  {...register(`bankAccounts.${index}.balance`, {
                    valueAsNumber: true,
                  })}
                  error={errors.bankAccounts?.[index]?.balance?.message}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendBank({
                  type: "",
                  bankName: "",
                  accountNumber: "",
                  balance: 0,
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Bank Account
            </Button>
          </CardContent>
        </Card>

        {/* Investment Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {investFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Investment {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeInvest(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormField
                  label="Investment Type"
                  id={`investmentAccounts.${index}.type`}
                  error={errors.investmentAccounts?.[index]?.type?.message}
                >
                  <Controller
                    name={`investmentAccounts.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4 mt-2"
                      >
                        {investmentTypes.map((type) => (
                          <div
                            key={type.label}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={type.label}
                              id={`invest-${index}-${type.label}`}
                              className="text-[#22b573]"
                            />
                            <Label
                              htmlFor={`invest-${index}-${type.label}`}
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
                {watch(`investmentAccounts.${index}.type`) === "Other" && (
                  <FormInput
                    label="Other Investment Type"
                    id={`investmentAccounts.${index}.investmentTypeText`}
                    {...register(
                      `investmentAccounts.${index}.investmentTypeText`
                    )}
                    error={
                      errors.investmentAccounts?.[index]?.investmentTypeText
                        ?.message
                    }
                  />
                )}
                <FormInput
                  label="Institution Name and Country Location"
                  id={`investmentAccounts.${index}.institutionName`}
                  {...register(`investmentAccounts.${index}.institutionName`)}
                  error={
                    errors.investmentAccounts?.[index]?.institutionName?.message
                  }
                />
                <FormInput
                  label="Account Number"
                  id={`investmentAccounts.${index}.accountNumber`}
                  {...register(`investmentAccounts.${index}.accountNumber`)}
                  error={
                    errors.investmentAccounts?.[index]?.accountNumber?.message
                  }
                />
                <FormInput
                  type="number"
                  label="Current Market Value ($)"
                  id={`investmentAccounts.${index}.currentMarketValue`}
                  {...register(
                    `investmentAccounts.${index}.currentMarketValue`,
                    { valueAsNumber: true }
                  )}
                  error={
                    errors.investmentAccounts?.[index]?.currentMarketValue
                      ?.message
                  }
                />
                <FormInput
                  type="number"
                  label="Loan Balance ($)"
                  id={`investmentAccounts.${index}.loanBalance`}
                  {...register(`investmentAccounts.${index}.loanBalance`, {
                    valueAsNumber: true,
                  })}
                  error={
                    errors.investmentAccounts?.[index]?.loanBalance?.message
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendInvest({
                  institutionName: "",
                  accountNumber: "",
                  currentMarketValue: 0,
                  loanBalance: 0,
                  type: "",
                  investmentTypeText: "",
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Investment Account
            </Button>
          </CardContent>
        </Card>

        {/* Digital Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {digitalFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Digital Asset {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDigital(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormInput
                  label="Description"
                  id={`digitalAssets.${index}.description`}
                  {...register(`digitalAssets.${index}.description`)}
                  error={errors.digitalAssets?.[index]?.description?.message}
                />
                <FormInput
                  type="number"
                  label="Number of Units"
                  id={`digitalAssets.${index}.numberOfUnits`}
                  {...register(`digitalAssets.${index}.numberOfUnits`, {
                    valueAsNumber: true,
                  })}
                  error={errors.digitalAssets?.[index]?.numberOfUnits?.message}
                />
                <FormInput
                  label="Location (exchange account, self-hosted wallet)"
                  id={`digitalAssets.${index}.location`}
                  {...register(`digitalAssets.${index}.location`)}
                  error={errors.digitalAssets?.[index]?.location?.message}
                />
                <FormInput
                  label="Account Number (for custodian)"
                  id={`digitalAssets.${index}.accountNumber`}
                  {...register(`digitalAssets.${index}.accountNumber`)}
                  error={errors.digitalAssets?.[index]?.accountNumber?.message}
                />
                <FormInput
                  label="Digital Asset Address (for self-hosted)"
                  id={`digitalAssets.${index}.address`}
                  {...register(`digitalAssets.${index}.address`)}
                  error={errors.digitalAssets?.[index]?.address?.message}
                />
                <FormInput
                  type="number"
                  label="US Dollar Equivalent ($)"
                  id={`digitalAssets.${index}.usdValue`}
                  {...register(`digitalAssets.${index}.usdValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.digitalAssets?.[index]?.usdValue?.message}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendDigital({
                  description: "",
                  numberOfUnits: 0,
                  location: "",
                  accountNumber: "",
                  address: "",
                  usdValue: 0,
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Digital Asset
            </Button>
          </CardContent>
        </Card>

        {/* Notes Receivable */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Receivable</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              label="Do you have notes receivable?"
              id="hasNotesReceivable"
              error={errors.hasNotesReceivable?.message}
            >
              <RadioGroup
                value={hasNotes ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasNotesReceivable", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="notes-yes" />
                  <Label htmlFor="notes-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="notes-no" />
                  <Label htmlFor="notes-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>
            {hasNotes && (
              <div className="space-y-4 mt-4">
                {notesFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">Note {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeNotes(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Note Holder (Name)"
                      id={`notesReceivable.${index}.noteHolder`}
                      {...register(`notesReceivable.${index}.noteHolder`)}
                      error={
                        errors.notesReceivable?.[index]?.noteHolder?.message
                      }
                    />
                    <FormInput
                      type="number"
                      label="Amount ($)"
                      id={`notesReceivable.${index}.amount`}
                      {...register(`notesReceivable.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                      error={errors.notesReceivable?.[index]?.amount?.message}
                    />
                    <FormInput
                      label="Age"
                      id={`notesReceivable.${index}.age`}
                      {...register(`notesReceivable.${index}.age`)}
                      error={errors.notesReceivable?.[index]?.age?.message}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendNotes({ noteHolder: "", amount: 0, age: "" })
                  }
                  className="w-full border-dashed text-[#22b573]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Note Receivable
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accounts Receivable */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts Receivable</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              label="Do you have accounts receivable?"
              id="hasAccountsReceivable"
              error={errors.hasAccountsReceivable?.message}
            >
              <RadioGroup
                value={hasAccounts ? "yes" : "no"}
                onValueChange={(value) =>
                  setValue("hasAccountsReceivable", value === "yes")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="accounts-yes" />
                  <Label htmlFor="accounts-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="accounts-no" />
                  <Label htmlFor="accounts-no">No</Label>
                </div>
              </RadioGroup>
            </FormField>
            {hasAccounts && (
              <div className="space-y-4 mt-4">
                {accountsFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">Account {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAccounts(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Company/Name"
                      id={`accountsReceivable.${index}.company`}
                      {...register(`accountsReceivable.${index}.company`)}
                      error={
                        errors.accountsReceivable?.[index]?.company?.message
                      }
                    />
                    <FormInput
                      type="number"
                      label="Amount ($)"
                      id={`accountsReceivable.${index}.amount`}
                      {...register(`accountsReceivable.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.accountsReceivable?.[index]?.amount?.message
                      }
                    />
                    <FormInput
                      label="Age"
                      id={`accountsReceivable.${index}.age`}
                      {...register(`accountsReceivable.${index}.age`)}
                      error={errors.accountsReceivable?.[index]?.age?.message}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendAccounts({ company: "", amount: 0, age: "" })
                  }
                  className="w-full border-dashed text-[#22b573]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Account Receivable
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real Estate */}
        <Card>
          <CardHeader>
            <CardTitle>Real Estate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {realFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Property {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeReal(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormInput
                  label="Property Address (street, city, state, ZIP, county, country)"
                  id={`realEstate.${index}.propertyAddress`}
                  {...register(`realEstate.${index}.propertyAddress`)}
                  error={errors.realEstate?.[index]?.propertyAddress?.message}
                />
                <FormInput
                  label="Description (rental, vacant, etc.)"
                  id={`realEstate.${index}.description`}
                  {...register(`realEstate.${index}.description`)}
                  error={errors.realEstate?.[index]?.description?.message}
                />
                <FormInput
                  type="date"
                  label="Date Purchased"
                  id={`realEstate.${index}.datePurchased`}
                  {...register(`realEstate.${index}.datePurchased`)}
                  error={errors.realEstate?.[index]?.datePurchased?.message}
                />
                <FormInput
                  type="number"
                  label="Monthly Mortgage Payment ($)"
                  id={`realEstate.${index}.monthlyPayment`}
                  {...register(`realEstate.${index}.monthlyPayment`, {
                    valueAsNumber: true,
                  })}
                  error={errors.realEstate?.[index]?.monthlyPayment?.message}
                />
                <FormInput
                  type="date"
                  label="Date of Final Payment"
                  id={`realEstate.${index}.finalPaymentDate`}
                  {...register(`realEstate.${index}.finalPaymentDate`)}
                  error={errors.realEstate?.[index]?.finalPaymentDate?.message}
                />
                <FormInput
                  label="Lender/Contract Holder Name"
                  id={`realEstate.${index}.lenderName`}
                  {...register(`realEstate.${index}.lenderName`)}
                  error={errors.realEstate?.[index]?.lenderName?.message}
                />
                <FormInput
                  type="number"
                  label="Current Market Value ($)"
                  id={`realEstate.${index}.currentMarketValue`}
                  {...register(`realEstate.${index}.currentMarketValue`, {
                    valueAsNumber: true,
                  })}
                  error={
                    errors.realEstate?.[index]?.currentMarketValue?.message
                  }
                />
                <FormInput
                  type="number"
                  label="Loan Balance ($)"
                  id={`realEstate.${index}.loanBalance`}
                  {...register(`realEstate.${index}.loanBalance`, {
                    valueAsNumber: true,
                  })}
                  error={errors.realEstate?.[index]?.loanBalance?.message}
                />
                <FormField
                  label="Is property for sale or anticipate selling?"
                  id={`realEstate.${index}.isForSaleOrAnticipateSelling`}
                  error={
                    errors.realEstate?.[index]?.isForSaleOrAnticipateSelling
                      ?.message
                  }
                >
                  <RadioGroup
                    value={
                      watch(`realEstate.${index}.isForSaleOrAnticipateSelling`)
                        ? "yes"
                        : "no"
                    }
                    onValueChange={(value) =>
                      setValue(
                        `realEstate.${index}.isForSaleOrAnticipateSelling`,
                        value === "yes"
                      )
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`real-sale-yes-${index}`}
                      />
                      <Label htmlFor={`real-sale-yes-${index}`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`real-sale-no-${index}`} />
                      <Label htmlFor={`real-sale-no-${index}`}>No</Label>
                    </div>
                  </RadioGroup>
                </FormField>
                {watch(`realEstate.${index}.isForSaleOrAnticipateSelling`) && (
                  <FormInput
                    type="number"
                    label="Listing Price ($)"
                    id={`realEstate.${index}.listingPrice`}
                    {...register(`realEstate.${index}.listingPrice`, {
                      valueAsNumber: true,
                    })}
                    error={errors.realEstate?.[index]?.listingPrice?.message}
                  />
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendReal({
                  propertyAddress: "",
                  description: "",
                  datePurchased: "",
                  monthlyPayment: 0,
                  finalPaymentDate: "",
                  lenderName: "",
                  currentMarketValue: 0,
                  loanBalance: 0,
                  isForSaleOrAnticipateSelling: false,
                  listingPrice: 0,
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Real Estate Property
            </Button>
          </CardContent>
        </Card>

        {/* Business Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Business Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicleFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Vehicle {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVehicle(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormInput
                  label="Make & Model"
                  id={`vehicles.${index}.vehicleMakeModel`}
                  {...register(`vehicles.${index}.vehicleMakeModel`)}
                  error={errors.vehicles?.[index]?.vehicleMakeModel?.message}
                />
                <FormInput
                  label="Year"
                  id={`vehicles.${index}.year`}
                  {...register(`vehicles.${index}.year`)}
                  error={errors.vehicles?.[index]?.year?.message}
                />
                <FormInput
                  type="date"
                  label="Date Purchased"
                  id={`vehicles.${index}.datePurchased`}
                  {...register(`vehicles.${index}.datePurchased`)}
                  error={errors.vehicles?.[index]?.datePurchased?.message}
                />
                <FormInput
                  type="number"
                  label="Mileage or Use Hours"
                  id={`vehicles.${index}.mileageOrHours`}
                  {...register(`vehicles.${index}.mileageOrHours`, {
                    valueAsNumber: true,
                  })}
                  error={errors.vehicles?.[index]?.mileageOrHours?.message}
                />
                <FormInput
                  label="License/Tag Number"
                  id={`vehicles.${index}.licenseTag`}
                  {...register(`vehicles.${index}.licenseTag`)}
                  error={errors.vehicles?.[index]?.licenseTag?.message}
                />
                <FormField
                  label="Lease or Own"
                  id={`vehicles.${index}.leaseOrOwn`}
                  error={errors.vehicles?.[index]?.leaseOrOwn?.message}
                >
                  <RadioGroup
                    value={watch(`vehicles.${index}.leaseOrOwn`)}
                    onValueChange={(value) =>
                      setValue(`vehicles.${index}.leaseOrOwn`, value)
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Lease" id={`veh-lease-${index}`} />
                      <Label htmlFor={`veh-lease-${index}`}>Lease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Own" id={`veh-own-${index}`} />
                      <Label htmlFor={`veh-own-${index}`}>Own</Label>
                    </div>
                  </RadioGroup>
                </FormField>
                <FormInput
                  label="Creditor Name"
                  id={`vehicles.${index}.creditor`}
                  {...register(`vehicles.${index}.creditor`)}
                  error={errors.vehicles?.[index]?.creditor?.message}
                />
                <FormInput
                  type="date"
                  label="Date of Final Payment"
                  id={`vehicles.${index}.finalPaymentDate`}
                  {...register(`vehicles.${index}.finalPaymentDate`)}
                  error={errors.vehicles?.[index]?.finalPaymentDate?.message}
                />
                <FormInput
                  type="number"
                  label="Monthly Lease/Loan Amount ($)"
                  id={`vehicles.${index}.monthlyLeaseAmount`}
                  {...register(`vehicles.${index}.monthlyLeaseAmount`, {
                    valueAsNumber: true,
                  })}
                  error={errors.vehicles?.[index]?.monthlyLeaseAmount?.message}
                />
                <FormInput
                  type="number"
                  label="Current Market Value ($)"
                  id={`vehicles.${index}.currentMarketValue`}
                  {...register(`vehicles.${index}.currentMarketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.vehicles?.[index]?.currentMarketValue?.message}
                />
                <FormInput
                  type="number"
                  label="Loan Balance ($)"
                  id={`vehicles.${index}.loanBalance`}
                  {...register(`vehicles.${index}.loanBalance`, {
                    valueAsNumber: true,
                  })}
                  error={errors.vehicles?.[index]?.loanBalance?.message}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendVehicle({
                  vehicleMakeModel: "",
                  year: "",
                  datePurchased: "",
                  mileageOrHours: 0,
                  licenseTag: "",
                  leaseOrOwn: "Own",
                  monthlyLeaseAmount: 0,
                  creditor: "",
                  finalPaymentDate: "",
                  currentMarketValue: 0,
                  loanBalance: 0,
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Vehicle
            </Button>
          </CardContent>
        </Card>

        {/* Business Equipment */}
        <Card>
          <CardHeader>
            <CardTitle>Other Business Equipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Equipment {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEquip(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <FormInput
                  label="Type of Equipment"
                  id={`businessEquipment.${index}.type`}
                  {...register(`businessEquipment.${index}.type`)}
                  error={errors.businessEquipment?.[index]?.type?.message}
                />
                <FormInput
                  type="number"
                  label="Current Market Value ($)"
                  id={`businessEquipment.${index}.currentMarketValue`}
                  {...register(
                    `businessEquipment.${index}.currentMarketValue`,
                    { valueAsNumber: true }
                  )}
                  error={
                    errors.businessEquipment?.[index]?.currentMarketValue
                      ?.message
                  }
                />
                <FormInput
                  type="number"
                  label="Loan Balance ($)"
                  id={`businessEquipment.${index}.loanBalance`}
                  {...register(`businessEquipment.${index}.loanBalance`, {
                    valueAsNumber: true,
                  })}
                  error={
                    errors.businessEquipment?.[index]?.loanBalance?.message
                  }
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`businessEquipment.${index}.isLeased`}
                    {...register(`businessEquipment.${index}.isLeased`)}
                  />
                  <Label htmlFor={`businessEquipment.${index}.isLeased`}>
                    Is Leased
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`businessEquipment.${index}.usedInProductionOfIncome`}
                    {...register(
                      `businessEquipment.${index}.usedInProductionOfIncome`
                    )}
                  />
                  <Label
                    htmlFor={`businessEquipment.${index}.usedInProductionOfIncome`}
                  >
                    Used in Production of Income
                  </Label>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendEquip({
                  type: "",
                  currentMarketValue: 0,
                  loanBalance: 0,
                  isLeased: false,
                  usedInProductionOfIncome: false,
                })
              }
              className="w-full border-dashed text-[#22b573]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Equipment
            </Button>
          </CardContent>
        </Card>

        {/* Asset Subtotals */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Subtotals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>(1) Cash and Investments: ${assets.box1.toLocaleString()}</div>
            <div>
              (2) Investment Accounts and Digital Assets: $
              {assets.box2.toLocaleString()}
            </div>
            <div>(3) Real Estate: ${assets.box3.toLocaleString()}</div>
            <div>(4) Business Vehicles: ${assets.box4.toLocaleString()}</div>
            <div>(5) Business Equipment: ${assets.box5.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Box A Display */}
        <Card>
          <CardHeader>
            <CardTitle>Available Equity in Assets (Box A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${assets.boxA.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Calculated in real-time based on entered assets.
            </p>
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
