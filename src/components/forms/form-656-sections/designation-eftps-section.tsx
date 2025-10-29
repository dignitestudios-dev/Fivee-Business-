"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import useDesignationEftps from "@/hooks/656-form-hooks/useDesignationEftps";
import toast from "react-hot-toast";
import {
  designationEftpsSchema,
  designationEftpsInitialValues,
} from "@/lib/validation/form656/designation-eftps-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";

interface DesignationEftpsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function DesignationEftpsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: DesignationEftpsSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { designationEftps } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveDesignationEftps,
    handleGetDesignationEftps,
  } = useDesignationEftps();

  const methods = useForm<DesignationEftpsFormSchema>({
    resolver: zodResolver(designationEftpsSchema),
    defaultValues: designationEftpsInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "eftpsPayments",
  });

  const onSubmit = async (data: DesignationEftpsFormSchema) => {
    try {
      await handleSaveDesignationEftps(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving designation eftps:", error);
      toast.error(error.message || "Failed to save designation eftps");
    }
  };

  useEffect(() => {
    if (!designationEftps)
      handleGetDesignationEftps(caseId, FORM_656_SECTIONS[4]);
  }, []);

  useEffect(() => {
    if (designationEftps) {
      reset(designationEftps);
    }
  }, [designationEftps]);

  const addEftpsPayment = () => {
    append({
      paymentType: "Offer application fee",
      date: new Date().toISOString().split('T')[0],
      electronicFundsTransferNumber: "",
    });
  };

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 5: Designation for Application of Payment
          </h2>
          <p className="text-gray-600">
            If you wish your payment be applied to a specific tax year/tax period and/or a specific IRS tax form, list in the space below. If you do not designate a preference, we will apply any money you send to the government's best interest.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tax Period or Tax Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              label="Tax Period/Quarter"
              id="taxPeriodQuarter"
              {...register("taxPeriodQuarter")}
              error={errors.taxPeriodQuarter?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EFTPS Payments</CardTitle>
            <p className="text-sm text-gray-600">
              If you paid your application fee and/or your offer payment(s) through the Electronic Federal Tax Payment System (EFTPS), complete this section.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Payment {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`eftpsPayments.${index}.paymentType`}>Payment Type</Label>
                  <select
                    id={`eftpsPayments.${index}.paymentType`}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...register(`eftpsPayments.${index}.paymentType`)}
                  >
                    <option value="">Select payment type</option>
                    <option value="Offer application fee">Offer application fee</option>
                    <option value="Offer payment">Offer payment</option>
                  </select>
                  {errors.eftpsPayments?.[index]?.paymentType?.message && (
                    <p className="text-sm text-red-600">{errors.eftpsPayments[index].paymentType.message}</p>
                  )}
                </div>
                <FormInput
                  label="Date"
                  id={`eftpsPayments.${index}.date`}
                  type="date"
                  required
                  {...register(`eftpsPayments.${index}.date`)}
                  error={errors.eftpsPayments?.[index]?.date?.message}
                />
                <FormInput
                  label="Electronic Funds Transfer Number (numbers only)"
                  id={`eftpsPayments.${index}.electronicFundsTransferNumber`}
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  // sanitize input in real-time to only digits
                  onInput={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const digits = input.value.replace(/\D/g, "");
                    if (input.value !== digits) input.value = digits;
                  }}
                  {...register(`eftpsPayments.${index}.electronicFundsTransferNumber`)}
                  error={errors.eftpsPayments?.[index]?.electronicFundsTransferNumber?.message}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEftpsPayment}
              className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add EFTPS Payment
            </Button>
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