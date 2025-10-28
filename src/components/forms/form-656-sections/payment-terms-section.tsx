"use client";
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import usePaymentTerms from "@/hooks/656-form-hooks/usePaymentTerms";
import toast from "react-hot-toast";
import {
  paymentTermsSchema,
  paymentTermsInitialValues,
} from "@/lib/validation/form656/payment-terms-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";
interface PaymentTermsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}
export function PaymentTermsSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PaymentTermsSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { paymentTerms } = useAppSelector((state) => state.form656);
  const individualInfo = useAppSelector(
    (state) => state.form656.individualInfo
  );
  const {
    loading,
    loadingFormData,
    handleSavePaymentTerms,
    handleGetPaymentTerms,
  } = usePaymentTerms();
  const methods = useForm<PaymentTermsFormSchema>({
    resolver: zodResolver(paymentTermsSchema),
    defaultValues: paymentTermsInitialValues,
    mode: "onSubmit",
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = methods;
  console.log("payment terms form error: ", errors);
  const paymentOption = useWatch({ control, name: "paymentOption" });
  const qualifiesForLowIncome =
    individualInfo?.lowIncomeCertification?.qualifiesForLowIncome || false;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lumpSum.additionalPayments",
  });
  // TODO: Implement actual API fetch for minimum offer amount (RCP) from Form 433-A or 433-B
  // For now, assuming it's fetched and set as initial value. Replace 0 with fetched value.
  const minOfferAmount = 500; // await api.getMinimumOffer(caseId); // e.g., Reasonable Collection Potential

  useEffect(() => {
    setValue("lumpSum.totalOfferAmount", minOfferAmount);
    setValue("periodic.totalOfferAmount", minOfferAmount);
  }, [minOfferAmount, setValue]);

  // Reactive calculation for lump sum initial payment
  useEffect(() => {
    const lumpOfferAmount = watch("lumpSum.totalOfferAmount") || 0;
    const lumpInitialPayment = qualifiesForLowIncome
      ? 0
      : Math.floor(lumpOfferAmount * 0.2);
    setValue("lumpSum.initialPayment", lumpInitialPayment);
  }, [
    watch("lumpSum.totalOfferAmount"),
    qualifiesForLowIncome,
    setValue,
    watch,
  ]);

  // Reactive calculation for periodic final payment
  const periodicOfferAmount = watch("periodic.totalOfferAmount") || 0;
  const periodicFirstPayment = watch("periodic.firstMonthlyPayment") || 0;
  const periodicSubsequent = watch("periodic.subsequentMonthlyPayment") || 0;
  const periodicMonths = watch("periodic.monthsToPay") || 0;
  useEffect(() => {
    setValue("periodic.finalPaymentMonth", periodicMonths);
    if (periodicMonths >= 6 && periodicMonths <= 24) {
      // Enforce 6-24 months for periodic
      const numSubPayments = periodicMonths - 2;
      const totalPaidBeforeFinal =
        periodicFirstPayment +
        (numSubPayments >= 0 ? numSubPayments : 0) * periodicSubsequent;
      const finalAmount = periodicOfferAmount - totalPaidBeforeFinal;
      setValue(
        "periodic.finalPaymentAmount",
        finalAmount > 0 ? finalAmount : 0
      );
    } else {
      setValue("periodic.finalPaymentAmount", 0);
    }
  }, [
    periodicOfferAmount,
    periodicFirstPayment,
    periodicSubsequent,
    periodicMonths,
    setValue,
  ]);

  const onSubmit = async (data: PaymentTermsFormSchema) => {
    try {
      if (paymentOption === "lump-sum") {
        data.periodic = undefined;
      } else {
        data.lumpSum = undefined;
      }
      // Ensure offer amount >= minOfferAmount
      const offerAmount =
        paymentOption === "lump-sum"
          ? data.lumpSum.totalOfferAmount
          : data.periodic.totalOfferAmount;
      if (offerAmount < minOfferAmount) {
        toast.error(`Offer amount must be at least $${minOfferAmount}.`);
        return;
      }
      await handleSavePaymentTerms(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving payment terms:", error);
      toast.error(error.message || "Failed to save payment terms");
    }
  };
  useEffect(() => {
    if (!paymentTerms) handleGetPaymentTerms(caseId, FORM_656_SECTIONS[3]);
  }, [caseId]);
  useEffect(() => {
    if (paymentTerms) {
      reset(paymentTerms);
    }
  }, [paymentTerms, reset]);
  const addAdditionalPayment = () => {
    if (fields.length < 5) {
      // Max 5 additional for lump sum
      append({
        amount: 0,
        payableWithinMonths: 0,
      });
    } else {
      toast.error("Maximum of 5 additional payments for lump sum.");
    }
  };
  if (loadingFormData) {
    return <FormLoader />;
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 4: Offer Terms
          </h2>
          <p className="text-gray-600">
            I request that the offer be accepted and the total liability be
            compromised for the reason checked in Section 3.
          </p>
          <p className="text-gray-600 mt-2">Check only one of the following:</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Option</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={paymentOption}
              onValueChange={(value) =>
                setValue("paymentOption", value as "lump-sum" | "periodic")
              }
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="lump-sum"
                  id="lump-sum"
                  className="text-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="lump-sum" className="font-medium">
                    Lump Sum Cash
                  </Label>
                  <p className="text-sm text-gray-600">
                    Submit your nonrefundable 20% payment (unless low-income
                    certified) with this offer. The remaining balance must be
                    paid in 5 or fewer payments within 5 or fewer months of
                    acceptance.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="periodic"
                  id="periodic"
                  className="text-[#22b573] mt-1"
                />
                <div>
                  <Label htmlFor="periodic" className="font-medium">
                    Periodic Payment
                  </Label>
                  <p className="text-sm text-gray-600">
                    Submit your first monthly payment (unless low-income
                    certified) with this offer and continue monthly payments for
                    6 to 24 months while your offer is being considered.
                  </p>
                </div>
              </div>
            </RadioGroup>
            {errors.paymentOption && (
              <p className="text-red-600 text-sm">
                {errors.paymentOption.message}
              </p>
            )}
          </CardContent>
        </Card>
        {paymentOption === "lump-sum" && (
          <Card>
            <CardHeader>
              <CardTitle>Lump Sum Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInput
                label="Offer Amount (must be >= calculated minimum)"
                id="lumpSum.totalOfferAmount"
                type="number"
                required
                min={minOfferAmount}
                {...register("lumpSum.totalOfferAmount", {
                  valueAsNumber: true,
                })}
                error={errors.lumpSum?.totalOfferAmount?.message}
              />
              <FormInput
                label="Initial Payment (20% unless low-income)"
                id="lumpSum.initialPayment"
                type="number"
                required={!qualifiesForLowIncome}
                readOnly // Make read-only since it's calculated
                {...register("lumpSum.initialPayment", { valueAsNumber: true })}
                error={errors.lumpSum?.initialPayment?.message}
              />
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormInput
                      label={`Additional Payment ${index + 1} Amount`}
                      id={`lumpSum.additionalPayments.${index}.amount`}
                      type="number"
                      required
                      {...register(
                        `lumpSum.additionalPayments.${index}.amount`,
                        { valueAsNumber: true }
                      )}
                      error={
                        errors.lumpSum?.additionalPayments?.[index]?.amount
                          ?.message
                      }
                    />
                    <FormInput
                      label="Payable Within (1-5 months)"
                      id={`lumpSum.additionalPayments.${index}.payableWithinMonths`}
                      type="number"
                      min={1}
                      max={5}
                      required
                      {...register(
                        `lumpSum.additionalPayments.${index}.payableWithinMonths`,
                        { valueAsNumber: true }
                      )}
                      error={
                        errors.lumpSum?.additionalPayments?.[index]
                          ?.payableWithinMonths?.message
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addAdditionalPayment}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Additional Payment (up
                  to 5)
                </Button>
                {errors.lumpSum?.additionalPayments?._errors && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.lumpSum.additionalPayments._errors[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {paymentOption === "periodic" && (
          <Card>
            <CardHeader>
              <CardTitle>Periodic Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInput
                label="Offer Amount (must be >= calculated minimum)"
                id="periodic.totalOfferAmount"
                type="number"
                required
                min={minOfferAmount}
                {...register("periodic.totalOfferAmount", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.totalOfferAmount?.message}
              />
              <FormInput
                label="First Monthly Payment"
                id="periodic.firstMonthlyPayment"
                type="number"
                required={!qualifiesForLowIncome}
                {...register("periodic.firstMonthlyPayment", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.firstMonthlyPayment?.message}
              />
              <FormInput
                label="Subsequent Monthly Payment"
                id="periodic.subsequentMonthlyPayment"
                type="number"
                required
                {...register("periodic.subsequentMonthlyPayment", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.subsequentMonthlyPayment?.message}
              />
              <FormInput
                label="Payment Day of Month (1-28)"
                id="periodic.paymentDayOfMonth"
                type="number"
                min={1}
                max={28}
                required
                {...register("periodic.paymentDayOfMonth", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.paymentDayOfMonth?.message}
              />
              <FormInput
                label="Number of Months to Pay (6-24)"
                id="periodic.monthsToPay"
                type="number"
                min={6}
                max={24}
                required
                {...register("periodic.monthsToPay", { valueAsNumber: true })}
                error={errors.periodic?.monthsToPay?.message}
              />
              <FormInput
                label="Final Payment Amount (calculated)"
                id="periodic.finalPaymentAmount"
                type="number"
                readOnly
                {...register("periodic.finalPaymentAmount", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.finalPaymentAmount?.message}
              />
              {errors.periodic?.finalPaymentAmount && (
                <p className="text-red-600 text-sm">
                  {errors.periodic.finalPaymentAmount.message}
                </p>
              )}
              <FormInput
                label="Final Payment Day (1-28)"
                id="periodic.finalPaymentDay"
                type="number"
                min={1}
                max={28}
                required
                {...register("periodic.finalPaymentDay", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.finalPaymentDay?.message}
              />
              <FormInput
                label="Final Payment Month (6-24)"
                id="periodic.finalPaymentMonth"
                type="number"
                min={6}
                max={24}
                readOnly
                {...register("periodic.finalPaymentMonth", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.finalPaymentMonth?.message}
              />
            </CardContent>
          </Card>
        )}
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
