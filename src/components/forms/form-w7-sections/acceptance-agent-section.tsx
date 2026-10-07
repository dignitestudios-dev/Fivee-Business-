"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-field";
import FormLoader from "@/components/global/FormLoader";
import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { useW7AcceptanceAgent } from "@/hooks/w7-form-hooks/useW7Section";
import { maskedRegister } from "./masked-register";
import {
  acceptanceAgentInitialValues,
  acceptanceAgentSchema,
} from "@/lib/validation/formw7/acceptance-agent-section";
import { formatEIN } from "@/utils/helper";
import {
  FORMATTED_INPUT_MAXLENGTH,
  W7_LIMITS,
  formatPhoneInput,
  formatPtinInput,
} from "@/lib/validation/formw7/rules";

interface SectionProps {
  onNext: () => void;
  onPrevious: () => void;
  // This is the last step, so saving it submits the whole form
  onSubmitted?: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export function AcceptanceAgentSection({
  onNext,
  onPrevious,
  onSubmitted,
  currentStep,
  totalSteps,
  disabled = false,
}: SectionProps) {
  const { showError } = useGlobalPopup();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { acceptanceAgentInfo } = useAppSelector((state) => state.formW7);
  const { loading, loadingFormData, handleSave, handleGet } =
    useW7AcceptanceAgent();

  const methods = useForm<W7AcceptanceAgentFormSchema>({
    resolver: zodResolver(acceptanceAgentSchema),
    defaultValues: acceptanceAgentInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!acceptanceAgentInfo) handleGet(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (acceptanceAgentInfo) reset(acceptanceAgentInfo);
  }, [acceptanceAgentInfo, reset]);

  const onSubmit = async (data: W7AcceptanceAgentFormSchema) => {
    if (disabled) return onNext();
    try {
      await handleSave(data, caseId);
      if (onSubmitted) onSubmitted();
      else onNext();
    } catch (error: any) {
      showError(
        error?.message || "Failed to save the acceptance agent information",
        "Acceptance Agent Error"
      );
    }
  };

  if (loadingFormData) return <FormLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 5: Acceptance Agent Use Only
          </h2>
          <p className="text-gray-600">
            Complete this section only if an IRS-authorized acceptance agent is
            assisting with the application. Otherwise use the Skip button above.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Name and Title (type or print)"
                id="nameAndTitle"
                placeholder="Alex Agent, Acceptance Agent"
                disabled={disabled}
                maxLength={W7_LIMITS.agentNameTitle}
                {...register("nameAndTitle")}
                error={errors.nameAndTitle?.message}
              />
              <FormInput
                label="Name of Company"
                id="companyName"
                disabled={disabled}
                maxLength={W7_LIMITS.agentCompany}
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="EIN"
                id="ein"
                placeholder="12-3456789"
                maxLength={FORMATTED_INPUT_MAXLENGTH}
                disabled={disabled}
                {...maskedRegister(register, setValue, "ein", formatEIN)}
                error={errors.ein?.message}
              />
              <FormInput
                label="PTIN"
                id="ptin"
                placeholder="P12345678"
                maxLength={FORMATTED_INPUT_MAXLENGTH}
                disabled={disabled}
                {...maskedRegister(register, setValue, "ptin", formatPtinInput)}
                error={errors.ptin?.message}
              />
              <FormInput
                label="Office Code"
                id="officeCode"
                disabled={disabled}
                maxLength={W7_LIMITS.agentOfficeCode}
                {...register("officeCode")}
                error={errors.officeCode?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Phone"
                id="phone"
                disabled={disabled}
                maxLength={W7_LIMITS.phone}
                inputMode="tel"
                {...maskedRegister(register, setValue, "phone", formatPhoneInput)}
                error={errors.phone?.message}
              />
              <FormInput
                label="Fax"
                id="fax"
                disabled={disabled}
                maxLength={W7_LIMITS.phone}
                inputMode="tel"
                {...maskedRegister(register, setValue, "fax", formatPhoneInput)}
                error={errors.fax?.message}
              />
            </div>

            <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
              The agent&apos;s signature and date are left blank on the generated
              form and must be added by hand.
            </p>
          </CardContent>
        </Card>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit(onSubmit)}
          onSubmit={handleSubmit(onSubmit)}
          paymentStatus={disabled}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
