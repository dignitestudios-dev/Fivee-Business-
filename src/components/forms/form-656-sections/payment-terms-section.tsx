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
    mode: "onChange",
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
  const periodicOfferAmount = watch("periodic.totalOfferAmount");
  const periodicFirstPayment = watch("periodic.firstMonthlyPayment");
  const periodicSubsequent = watch("periodic.subsequentMonthlyPayment");
  const subsequentMonths = watch("periodic.subsequentMonths");

  // Clear periodic fields when switching to lump sum
  useEffect(() => {
    if (paymentOption === "lump-sum") {
      setValue("periodic", undefined);
    } else if (paymentOption === "periodic") {
      setValue("lumpSum", undefined);
    }
  }, [paymentOption, setValue]);
  useEffect(() => {
    const totalMonths = (subsequentMonths || 0) + 2;
    setValue("periodic.monthsToPay", totalMonths);
    setValue("periodic.finalPaymentMonth", totalMonths);
    if (totalMonths >= 6 && totalMonths <= 24) {
      // Enforce 6-24 months for periodic
      const numSubPayments = subsequentMonths || 0;
      const totalPaidBeforeFinal =
        periodicFirstPayment + numSubPayments * periodicSubsequent;
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
    subsequentMonths,
    setValue,
  ]);

  const onSubmit = async (data: PaymentTermsFormSchema) => {
    try {
      if (paymentOption === "lump-sum") {
        const lumpSumData = data.lumpSum;
        const totalAdditional = lumpSumData.additionalPayments.reduce(
          (sum: number, p: { amount: number }) => sum + p.amount,
          0
        );
        if (
          lumpSumData.initialPayment + totalAdditional !==
          lumpSumData.totalOfferAmount
        ) {
          toast.error("Payments must sum to total offer amount.");
          return;
        }
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
      console.log("paymentTerms: ", paymentTerms);
      reset(paymentTerms);
    }
  }, [paymentTerms, reset]);
  const addAdditionalPayment = () => {
    if (fields.length < 5) {
      append({
        amount: 0,
        payableWithinMonths: 1,
      });
    } else {
      toast.error("Maximum of 5 additional payments allowed.");
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
            Section 4: Payment Terms
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
                type="text"
                inputMode="decimal"
                pattern="[0-9.]*"
                required
                min={minOfferAmount}
                {...register("lumpSum.totalOfferAmount", {
                  valueAsNumber: true,
                  onChange: (e: any) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9.]/g,
                      ""
                    );
                  },
                  min: { value: 0, message: "Value cannot be negative" },
                })}
                error={errors.lumpSum?.totalOfferAmount?.message}
              />
              <FormInput
                label="Initial Payment (20% unless low-income)"
                id="lumpSum.initialPayment"
                type="text"
                inputMode="decimal"
                pattern="[0-9.]*"
                required={!qualifiesForLowIncome}
                readOnly // Make read-only since it's calculated
                {...register("lumpSum.initialPayment", {
                  valueAsNumber: true,
                  onChange: (e: any) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9.]/g,
                      ""
                    );
                  },
                  min: { value: 0, message: "Value cannot be negative" },
                })}
                error={errors.lumpSum?.initialPayment?.message}
              />
              <div className="space-y-1">
                <Label>Remaining Balance</Label>
                <FormInput
                  label=""
                  value={
                    (watch("lumpSum.totalOfferAmount") || 0) -
                    (watch("lumpSum.initialPayment") || 0)
                  }
                  readOnly
                />
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormInput
                      label={`Additional Payment ${index + 1} Amount`}
                      id={`lumpSum.additionalPayments.${index}.amount`}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.]*"
                      required
                      {...register(
                        `lumpSum.additionalPayments.${index}.amount`,
                        {
                          valueAsNumber: true,
                          onChange: (e: any) => {
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
                        errors.lumpSum?.additionalPayments?.[index]?.amount
                          ?.message
                      }
                    />
                    <FormInput
                      label="Payable Within (1-5 months)"
                      id={`lumpSum.additionalPayments.${index}.payableWithinMonths`}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.]*"
                      min={1}
                      max={5}
                      required
                      {...register(
                        `lumpSum.additionalPayments.${index}.payableWithinMonths`,
                        {
                          valueAsNumber: true,
                          onChange: (e: any) => {
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
                  disabled={fields.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Additional Payment
                </Button>
                <p className="text-sm text-gray-600">
                  Current Additional Payments Sum: $
                  {fields.reduce(
                    (sum, _, index) =>
                      sum +
                      (watch(`lumpSum.additionalPayments.${index}.amount`) ||
                        0),
                    0
                  )}
                </p>
                {fields.reduce(
                  (sum, _, index) =>
                    sum +
                    (watch(`lumpSum.additionalPayments.${index}.amount`) || 0),
                  0
                ) !==
                  (watch("lumpSum.totalOfferAmount") || 0) -
                    (watch("lumpSum.initialPayment") || 0) && (
                  <p className="text-red-600 text-sm">
                    The additional payments sum must equal the remaining balance
                    ($
                    {(watch("lumpSum.totalOfferAmount") || 0) -
                      (watch("lumpSum.initialPayment") || 0)}
                    ).
                  </p>
                )}
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
              <p className="text-gray-600 font-semibold">
                Note: The total months may not exceed a total of 24. For
                example, if you are requesting your payments extend for 24
                months then your first payment is considered to be month 1 and
                your last payment is considered month 24. There will be 22
                payments between the first and last month.
              </p>
              <p className="text-gray-600">
                Enclose a check for the first month's payment (waived if you met
                the requirements for Low-Income Certification).
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInput
                label="Enter the amount of your offer"
                id="periodic.totalOfferAmount"
                type="number"
                required
                min={minOfferAmount}
                {...register("periodic.totalOfferAmount", {
                  valueAsNumber: true,
                })}
                error={errors.periodic?.totalOfferAmount?.message}
              />
              <div className="flex flex-wrap items-center gap-1 text-gray-800">
                <span>The first monthly payment of $</span>
                <FormInput
                  label=""
                  id="periodic.firstMonthlyPayment"
                  type="number"
                  required={!qualifiesForLowIncome}
                  className="mx-1"
                  {...register("periodic.firstMonthlyPayment", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.firstMonthlyPayment?.message}
                />
                <span>is included with this offer then $</span>
                <FormInput
                  label=""
                  id="periodic.subsequentMonthlyPayment"
                  type="number"
                  required
                  className="mx-1"
                  {...register("periodic.subsequentMonthlyPayment", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.subsequentMonthlyPayment?.message}
                />
                <span>will be paid on the (pick number 1-28)</span>
                <FormInput
                  label=""
                  id="periodic.paymentDayOfMonth"
                  type="number"
                  min={1}
                  max={28}
                  required
                  className="mx-1"
                  {...register("periodic.paymentDayOfMonth", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.paymentDayOfMonth?.message}
                />
                <span>day of each month thereafter for</span>
                <FormInput
                  label=""
                  id="periodic.subsequentMonths"
                  type="number"
                  min={4}
                  max={22}
                  required
                  className="mx-1"
                  {...register("periodic.subsequentMonths", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.subsequentMonths?.message}
                />
                <span>months with a final payment of $</span>
                <FormInput
                  label=""
                  id="periodic.finalPaymentAmount"
                  type="number"
                  readOnly
                  className="mx-1"
                  {...register("periodic.finalPaymentAmount", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.finalPaymentAmount?.message}
                />
                <span>to be paid on the</span>
                <FormInput
                  label=""
                  id="periodic.finalPaymentDay"
                  type="number"
                  min={1}
                  max={28}
                  required
                  className="mx-1"
                  {...register("periodic.finalPaymentDay", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.finalPaymentDay?.message}
                />
                <span>day of the</span>
                <FormInput
                  label=""
                  id="periodic.finalPaymentMonth"
                  type="number"
                  readOnly
                  className="mx-1"
                  {...register("periodic.finalPaymentMonth", {
                    valueAsNumber: true,
                  })}
                  error={errors.periodic?.finalPaymentMonth?.message}
                />
                <span>month.</span>
              </div>
              {errors.periodic?.finalPaymentAmount && (
                <p className="text-red-600 text-sm">
                  {errors.periodic.finalPaymentAmount.message}
                </p>
              )}
              <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p>
                  You must continue to make these monthly payments while the IRS
                  is considering the offer (waived if you met the requirements
                  for LowIncome Certification). Failure to make regular monthly
                  payments until you have received a final decision letter will
                  cause your offer to be returned with no appeal rights. If you
                  qualified under the Low-Income Certification and are not
                  required to submit payments while the offer is under
                  consideration, your first payment will be due 30 calendar days
                  after acceptance of the offer, unless another date is agreed
                  to in an amended offer.
                </p>
              </div>
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
