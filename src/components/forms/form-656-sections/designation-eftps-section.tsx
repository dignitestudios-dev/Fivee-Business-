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
      date: new Date().toISOString().split("T")[0],
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
            If you wish your payment be applied to a specific tax year/tax
            period and/or a specific IRS tax form, list in the space below. If
            you do not designate a preference, we will apply any money you send
            to the government's best interest.
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
              List offer payments made through Electronic Federal Tax Payment
              System (EFTPS) or Individual Online Account (IOLA) below.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Offer Application Fee Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Offer application fee
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Amount */}
                <FormInput
                  label="Amount"
                  id="eftpsPayments.offerApplicationFee"
                  type="number"
                  step="0.01"
                  {...register("eftpsPayments.offerApplicationFee", {
                    valueAsNumber: true,
                  })}
                  error={errors.eftpsPayments?.offerApplicationFee?.message}
                />

                {/* Date */}
                <FormInput
                  label="Date"
                  id="eftpsPayments.offerApplicationFeeDate"
                  type="date"
                  {...register("eftpsPayments.offerApplicationFeeDate")}
                  error={errors.eftpsPayments?.offerApplicationFeeDate?.message}
                />

                {/* Transfer Number */}
                <FormInput
                  label="Electronic funds transfer number (15 digits)"
                  id="eftpsPayments.offerApplicationFeeElectronicFundsTransferNumber"
                  type="text"
                  maxLength={15}
                  inputMode="numeric"
                  pattern="\d*"
                  onInput={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const digits = input.value.replace(/\D/g, "");
                    if (input.value !== digits) input.value = digits;
                  }}
                  {...register(
                    "eftpsPayments.offerApplicationFeeElectronicFundsTransferNumber"
                  )}
                  error={
                    errors.eftpsPayments
                      ?.offerApplicationFeeElectronicFundsTransferNumber
                      ?.message
                  }
                />
              </div>
            </div>

            {/* Offer Payment Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Offer payment</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Amount */}
                <FormInput
                  label="Amount"
                  id="eftpsPayments.offerPayment"
                  type="number"
                  step="0.01"
                  {...register("eftpsPayments.offerPayment", {
                    valueAsNumber: true,
                  })}
                  error={errors.eftpsPayments?.offerPayment?.message}
                />

                {/* Date */}
                <FormInput
                  label="Date"
                  id="eftpsPayments.offerPaymentDate"
                  type="date"
                  {...register("eftpsPayments.offerPaymentDate")}
                  error={errors.eftpsPayments?.offerPaymentDate?.message}
                />

                {/* Transfer Number */}
                <FormInput
                  label="Electronic funds transfer number (15 digits)"
                  id="eftpsPayments.offerPaymentElectronicFundsTransferNumber"
                  type="text"
                  maxLength={15}
                  inputMode="numeric"
                  pattern="\d*"
                  onInput={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const digits = input.value.replace(/\D/g, "");
                    if (input.value !== digits) input.value = digits;
                  }}
                  {...register(
                    "eftpsPayments.offerPaymentElectronicFundsTransferNumber"
                  )}
                  error={
                    errors.eftpsPayments
                      ?.offerPaymentElectronicFundsTransferNumber?.message
                  }
                />
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              <strong>Note:</strong> Any Offer Application Fee or initial
              payment made electronically must be made the same date your offer
              is mailed or filed through Individual Online Account.
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
