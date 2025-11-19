"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, Edit, RefreshCw } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useState, useMemo, useEffect } from "react";
import {
  paidPreparerSchema,
  paidPreparerInitialValues,
} from "@/lib/validation/form656/paid-preparer-section";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";
import useSignatures from "@/hooks/signatures/useSignatures";
import usePaidPreparer from "@/hooks/656-form-hooks/usePaidPreparer";
import DropdownPopup from "@/components/ui/DropdownPopup";
import { formatPhone } from "@/utils/helper";

interface PaidPreparerSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PaidPreparerSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PaidPreparerSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { paidPreparer } = useAppSelector((state) => state.form656);
  const signatures = useAppSelector(
    (state) => state.signatures?.images
  ) as Signature[];

  const {
    loading,
    loadingFormData,
    handleSavePaidPreparer,
    handleGetPaidPreparer,
  } = usePaidPreparer();
  const { handleGetSignatures, getting: loadingSignatures } = useSignatures();

  const methods = useForm<PaidPreparerFormSchema>({
    resolver: zodResolver(paidPreparerSchema),
    defaultValues: paidPreparerInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = methods;

  const [preparerSignaturePreview, setPreparerSignaturePreview] = useState<
    string | null
  >(null);

  const onSubmit = async (data: PaidPreparerFormSchema) => {
    try {
      delete data.irsOfficialDate;
      await handleSavePaidPreparer(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving paid preparer info:", error);
      toast.error(error.message || "Failed to save paid preparer info");
    }
  };

  useEffect(() => {
    if (!paidPreparer) handleGetPaidPreparer(caseId, FORM_656_SECTIONS[7]);
  }, []);

  useEffect(() => {
    handleGetSignatures();
  }, []);

  useEffect(() => {
    if (paidPreparer) {
      reset(paidPreparer);
    }
  }, [paidPreparer]);

  useEffect(() => {
    if (paidPreparer?.preparerSignature && signatures?.length > 0) {
      const sig = signatures?.find(
        (s) => s._id === paidPreparer.preparerSignature
      );
      if (sig) {
        setPreparerSignaturePreview(sig.url);
      }
    }
  }, [paidPreparer, signatures]);

  const handleSelectPreparerSignature = async (id: string, url: string) => {
    setPreparerSignaturePreview(url);
    setValue("preparerSignature", id, {
      shouldValidate: true,
    });
    await trigger("preparerSignature");
  };

  const removePreparerSignature = async () => {
    setPreparerSignaturePreview(null);
    setValue("preparerSignature", "", {
      shouldValidate: true,
    });
    await trigger("preparerSignature");
  };

  const handleReloadSignatures = () => {
    handleGetSignatures();
  };

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 9: Paid Preparer Use Only
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preparer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  type="date"
                  label="Today's date (mm/dd/yyyy)"
                  min={new Date().toISOString().split("T")[0]}
                  id="preparerSignatureDate"
                  {...register("preparerSignatureDate")}
                  error={errors.preparerSignatureDate?.message}
                />
                <FormInput
                  label="Phone number"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="preparerPhoneNumber"
                  {...register("preparerPhoneNumber", {
                    setValueAs: (v: any) => String(v).replace(/[^0-9]/g, ""),
                    onChange: (e) =>
                      setValue(
                        "preparerPhoneNumber",
                        formatPhone(e.target.value)
                      ),
                  })}
                  error={errors.preparerPhoneNumber?.message}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="preparerPhoneAuthorization"
                  {...register("preparerPhoneAuthorization")}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                />
                <Label htmlFor="preparerPhoneAuthorization">
                  By checking this box you are authorizing the IRS to contact
                  you at the telephone number listed above and leave detailed
                  messages concerning this offer on your voice mail or answering
                  machine.
                </Label>
              </div>
              {errors.preparerPhoneAuthorization && (
                <p className="text-red-600 text-sm">
                  {errors.preparerPhoneAuthorization.message}
                </p>
              )}
            </div>

            <FormInput
              label="Print Name"
              id="preparerName"
              {...register("preparerName")}
              error={errors.preparerName?.message}
            />
            <FormInput
              label="CAF No. or PTIN"
              id="preparerCafNumberOrPtin"
              {...register("preparerCafNumberOrPtin")}
              error={errors.preparerCafNumberOrPtin?.message}
            />
            <FormInput
              label="Firm's Name (if applicable)"
              id="firmName"
              {...register("firmName")}
              error={errors.firmName?.message}
            />
            <FormInput
              label="Firm's Address"
              id="firmAddress"
              {...register("firmAddress")}
              error={errors.firmAddress?.message}
            />
            <FormInput
              label="Firm's ZIP Code"
              id="firmZipCode"
              {...register("firmZipCode")}
              error={errors.firmZipCode?.message}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachForm2848"
                {...register("attachForm2848")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="attachForm2848">
                Check if attaching Form 2848
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachForm8821"
                {...register("attachForm8821")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
              />
              <Label htmlFor="attachForm8821">
                Check if attaching Form 8821
              </Label>
            </div>
            {/* <FormInput
              label="IRS Official Signature"
              id="irsOfficialSignature"
              {...register("irsOfficialSignature")}
              error={errors.irsOfficialSignature?.message}
            />
            <FormInput
              label="IRS Official Title"
              id="irsOfficialTitle"
              {...register("irsOfficialTitle")}
              error={errors.irsOfficialTitle?.message}
            />
            <FormInput
              type="date"
              label="IRS Official Date"
              id="irsOfficialDate"
              {...register("irsOfficialDate")}
              error={errors.irsOfficialDate?.message}
            /> */}
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
