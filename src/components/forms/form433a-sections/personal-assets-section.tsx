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

  // Retirement Accounts
  const {
    fields: retirementAccounts,
    append: addRetirementAccount,
    remove: removeRetirementAccount,
  } = useFieldArray({
    control,
    name: "retirementAccounts",
  });

  // Life Insurance
  const {
    fields: lifeInsurance,
    append: addLifeInsurance,
    remove: removeLifeInsurance,
  } = useFieldArray({
    control,
    name: "lifeInsurance",
  });

  const {
    fields: property,
    append: addProperty,
    remove: removeProperty,
  } = useFieldArray({ control, name: "property" });

  const {
    fields: vehicles,
    append: addVehicle,
    remove: removeVehicle,
  } = useFieldArray({ control, name: "vehicles" });

  const {
    fields: valuables,
    append: addValuable,
    remove: removeValuable,
  } = useFieldArray({ control, name: "valuables" });

  const {
    fields: furniture,
    append: addFurniture,
    remove: removeFurniture,
  } = useFieldArray({ control, name: "furniture" });

  // Watch values for calculations and conditional rendering
  const investmentMarketValue = watch("investmentMarketValue");
  const investmentLoanBalance = watch("investmentLoanBalance");
  const retirementMarketValue = watch("retirementMarketValue");
  const retirementLoanBalance = watch("retirementLoanBalance");
  const cashValue = watch("cashValue");
  const insuranceLoanBalance = watch("insuranceLoanBalance");
  const propertyMarketValue = watch("propertyMarketValue");
  const propertyLoanBalance = watch("propertyLoanBalance");
  const vehicleMarketValue = watch("vehicleMarketValue");
  const vehicleLoanBalance = watch("vehicleLoanBalance");
  const valuableMarketValue = watch("valuableMarketValue");
  const valuableLoanBalance = watch("valuableLoanBalance");
  const furnitureMarketValue = watch("furnitureMarketValue");
  const furnitureLoanBalance = watch("furnitureLoanBalance");
  const propertySaleStatus = watch("propertySaleStatus");

  // Calculate net values
  const investmentNetValue =
    (investmentMarketValue || 0) - (investmentLoanBalance || 0);
  const retirementNetValue =
    (retirementMarketValue || 0) * 0.8 - (retirementLoanBalance || 0);
  const insuranceNetValue = (cashValue || 0) - (insuranceLoanBalance || 0);
  const propertyNetValue =
    (propertyMarketValue || 0) * 0.8 - (propertyLoanBalance || 0);
  const vehicleNetValue =
    (vehicleMarketValue || 0) * 0.8 - (vehicleLoanBalance || 0);
  const valuableNetValue =
    (valuableMarketValue || 0) * 0.8 - (valuableLoanBalance || 0);
  const furnitureNetValue =
    (furnitureMarketValue || 0) * 0.8 - (furnitureLoanBalance || 0);

  // Calculate total available equity
  const totalEquity = Math.max(
    0,
    investmentNetValue +
      retirementNetValue +
      insuranceNetValue +
      propertyNetValue +
      vehicleNetValue +
      valuableNetValue +
      furnitureNetValue
  );

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

      {/* Cash / Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Cash / Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

              {/* Account Type Checkboxes */}
              <div className="flex flex-wrap gap-4">
                {[
                  "Cash",
                  "Checking",
                  "Savings",
                  "Money Market/CD",
                  "Online Account",
                  "Stored Value Card",
                ].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={type}
                      {...register(`bankAccounts.${index}.accountTypes`)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Bank Name & Country"
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
                  label="Balance ($)"
                  id={`bankAccounts.${index}.balance`}
                  type="number"
                  placeholder="0"
                  {...register(`bankAccounts.${index}.balance`, {
                    valueAsNumber: true,
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
                accountTypes: [],
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

      {/* Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Investments (Domestic and Foreign)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investments.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Investment {index + 1}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Type of Investment"
                  id={`investments.${index}.type`}
                  {...register(`investments.${index}.type`)}
                  error={errors.investments?.[index]?.type?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`investments.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`investments.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.investments?.[index]?.marketValue?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addInvestment({
                type: "",
                marketValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
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
                  label="Type of Digital Asset"
                  id={`digitalAssets.${index}.type`}
                  {...register(`digitalAssets.${index}.type`)}
                  error={errors.digitalAssets?.[index]?.type?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`digitalAssets.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`digitalAssets.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.digitalAssets?.[index]?.marketValue?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addDigitalAsset({
                type: "",
                marketValue: 0,
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Type of Retirement Account"
                  id={`retirementAccounts.${index}.type`}
                  {...register(`retirementAccounts.${index}.type`)}
                  error={errors.retirementAccounts?.[index]?.type?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`retirementAccounts.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`retirementAccounts.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={
                    errors.retirementAccounts?.[index]?.marketValue?.message
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addRetirementAccount({
                type: "",
                marketValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Retirement Account
          </Button>
        </CardContent>
      </Card>

      {/* Life Insurance */}
      <Card>
        <CardHeader>
          <CardTitle>Life Insurance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lifeInsurance.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Life Insurance {index + 1}
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
                  label="Insurance Company"
                  id={`lifeInsurance.${index}.company`}
                  {...register(`lifeInsurance.${index}.company`)}
                  error={errors.lifeInsurance?.[index]?.company?.message}
                />
                <FormInput
                  label="Cash Value ($)"
                  id={`lifeInsurance.${index}.cashValue`}
                  type="number"
                  placeholder="0"
                  {...register(`lifeInsurance.${index}.cashValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.lifeInsurance?.[index]?.cashValue?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addLifeInsurance({
                company: "",
                cashValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Life Insurance
          </Button>
        </CardContent>
      </Card>

      {/* Property */}
      <Card>
        <CardHeader>
          <CardTitle>Real Estate / Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {property.map((field, index) => (
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
                  onClick={() => removeProperty(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Description"
                  id={`property.${index}.description`}
                  {...register(`property.${index}.description`)}
                  error={errors.property?.[index]?.description?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`property.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`property.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.property?.[index]?.marketValue?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addProperty({
                description: "",
                marketValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
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
                  label="Make/Model"
                  id={`vehicles.${index}.make`}
                  {...register(`vehicles.${index}.make`)}
                  error={errors.vehicles?.[index]?.make?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`vehicles.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`vehicles.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.vehicles?.[index]?.marketValue?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addVehicle({
                make: "",
                marketValue: 0,
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </CardContent>
      </Card>

      {/* Valuables */}
      <Card>
        <CardHeader>
          <CardTitle>Valuables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {valuables.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Valuable {index + 1}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Description"
                  id={`valuables.${index}.description`}
                  {...register(`valuables.${index}.description`)}
                  error={errors.valuables?.[index]?.description?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`valuables.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`valuables.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.valuables?.[index]?.marketValue?.message}
                />
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
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Valuable
          </Button>
        </CardContent>
      </Card>

      {/* Furniture */}
      <Card>
        <CardHeader>
          <CardTitle>Furniture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {furniture.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Furniture {index + 1}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Description"
                  id={`furniture.${index}.description`}
                  {...register(`furniture.${index}.description`)}
                  error={errors.furniture?.[index]?.description?.message}
                />
                <FormInput
                  label="Market Value ($)"
                  id={`furniture.${index}.marketValue`}
                  type="number"
                  placeholder="0"
                  {...register(`furniture.${index}.marketValue`, {
                    valueAsNumber: true,
                  })}
                  error={errors.furniture?.[index]?.marketValue?.message}
                />
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
              })
            }
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Furniture
          </Button>
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={3}
        totalSteps={10}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
