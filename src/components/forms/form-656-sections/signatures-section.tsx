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
  signaturesSchema656,
  signaturesInitialValues,
} from "@/lib/validation/form656/signatures-section";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";
import useSignatures from "@/hooks/signatures/useSignatures";
import useSignatures656 from "@/hooks/656-form-hooks/useSignatures656";
import DropdownPopup from "@/components/ui/DropdownPopup";

interface SignaturesSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function SignaturesSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: SignaturesSectionProps) {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { signaturesInfo } = useAppSelector((state) => state.form656);
  const signatures = useAppSelector(
    (state) => state.signatures?.images
  ) as Signature[];

  const {
    loading,
    loadingFormData,
    handleSaveSignatures,
    handleGetSignatures656,
  } = useSignatures656();
  const { handleGetSignatures, getting: loadingSignatures } = useSignatures();

  const methods = useForm<SignaturesFormSchema>({
    resolver: zodResolver(signaturesSchema656),
    defaultValues: signaturesInitialValues,
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
console.log("errors: ", errors)
  const [taxpayerSignaturePreview, setTaxpayerSignaturePreview] = useState<
    string | null
  >(null);
  const [spouseSignaturePreview, setSpouseSignaturePreview] = useState<
    string | null
  >(null);

  const onSubmit = async (data: SignaturesFormSchema) => {
    try {
      await handleSaveSignatures(data, caseId);
      onNext();
    } catch (error: any) {
      console.error("Error saving signatures:", error);
      toast.error(error.message || "Failed to save signatures");
    }
  };

  useEffect(() => {
    if (!signaturesInfo) handleGetSignatures656(caseId, FORM_656_SECTIONS[7]);
  }, []);

  useEffect(() => {
    handleGetSignatures();
  }, []);

  useEffect(() => {
    if (signaturesInfo) {
      reset(signaturesInfo);
    }
  }, [signaturesInfo]);

  useEffect(() => {
    if (
      signaturesInfo?.taxpayerSignature?.signatureId &&
      signatures?.length > 0
    ) {
      const sig = signatures?.find(
        (s) => s._id === signaturesInfo.taxpayerSignature.signatureId
      );
      if (sig) {
        setTaxpayerSignaturePreview(sig.url);
      }
    }
    if (
      signaturesInfo?.spouseOrOfficerSignature?.signatureId &&
      signatures?.length > 0
    ) {
      const sig = signatures?.find(
        (s) => s._id === signaturesInfo.spouseOrOfficerSignature.signatureId
      );
      if (sig) {
        setSpouseSignaturePreview(sig.url);
      }
    }
  }, [signaturesInfo, signatures]);

  const handleSelectTaxpayerSignature = async (id: string, url: string) => {
    setTaxpayerSignaturePreview(url);
    setValue("taxpayerSignature.signatureId", id, {
      shouldValidate: true,
    });
    await trigger("taxpayerSignature.signatureId");
  };

  const removeTaxpayerSignature = async () => {
    setTaxpayerSignaturePreview(null);
    setValue("taxpayerSignature.signatureId", "", {
      shouldValidate: true,
    });
    await trigger("taxpayerSignature.signatureId");
  };

  const handleSelectSpouseSignature = async (id: string, url: string) => {
    setSpouseSignaturePreview(url);
    setValue("spouseOrOfficerSignature.signatureId", id, {
      shouldValidate: true,
    });
    await trigger("spouseOrOfficerSignature.signatureId");
  };

  const removeSpouseSignature = async () => {
    setSpouseSignaturePreview(null);
    setValue("spouseOrOfficerSignature.signatureId", "", {
      shouldValidate: true,
    });
    await trigger("spouseOrOfficerSignature.signatureId");
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
            Section 8: Signatures
          </h2>
          <p className="text-gray-600">
            Under penalties of perjury, I declare that I have examined this
            offer, including accompanying schedules and statements, and to the
            best of my knowledge and belief, it is true, correct and complete.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReloadSignatures}
                disabled={loadingSignatures}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    loadingSignatures ? "animate-spin" : ""
                  }`}
                />
                Reload Signatures
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Taxpayer Signature */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-2">
                    Signature of Taxpayer/Corporation Name *
                  </Label>
                  <input
                    type="hidden"
                    {...register("taxpayerSignature.signatureId")}
                  />
                  <div className="space-y-3 w-full">
                    {!taxpayerSignaturePreview ? (
                      <DropdownPopup
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            disabled={loadingSignatures}
                          >
                            Select Signature
                            <Upload className="w-4 h-4 ml-2" />
                          </Button>
                        }
                        options={
                          signatures?.map((sig) => ({
                            key: sig._id,
                            label: `${sig.title}${
                              sig.description ? ` - ${sig.description}` : ""
                            }`,
                            icon: (
                              <img
                                src={sig.url}
                                alt={sig.title}
                                className="w-20 h-10 object-contain"
                              />
                            ),
                            onClick: () =>
                              handleSelectTaxpayerSignature(sig._id, sig.url),
                          })) || []
                        }
                        dropdownClassName="w-80"
                        placement="bottom-left"
                      />
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <img
                          src={taxpayerSignaturePreview}
                          alt="Taxpayer Signature"
                          className="max-h-24 mx-auto mb-3"
                        />
                        <div className="flex justify-center gap-2">
                          <DropdownPopup
                            trigger={
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Change
                              </Button>
                            }
                            options={
                              signatures?.map((sig) => ({
                                key: sig._id,
                                label: `${sig.title}${
                                  sig.description ? ` - ${sig.description}` : ""
                                }`,
                                icon: (
                                  <img
                                    src={sig.url}
                                    alt={sig.title}
                                    className="w-20 h-10 object-contain"
                                  />
                                ),
                                onClick: () =>
                                  handleSelectTaxpayerSignature(
                                    sig._id,
                                    sig.url
                                  ),
                              })) || []
                            }
                            dropdownClassName="w-80"
                            placement="bottom-left"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeTaxpayerSignature}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    {errors.taxpayerSignature?.signatureId && (
                      <p className="text-red-600 text-sm">
                        {errors.taxpayerSignature.signatureId.message}
                      </p>
                    )}
                  </div>
                </div>
                <FormInput
                  type="date"
                  label="Today's date (mm/dd/yyyy) *"
                  id="taxpayerSignatureDate"
                  {...register("taxpayerSignatureDate")}
                  error={errors.taxpayerSignatureDate?.message}
                />
                <FormInput
                  label="Phone number"
                  id="taxpayerPhoneNumber"
                  {...register("taxpayerPhoneNumber")}
                  error={errors.taxpayerPhoneNumber?.message}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="taxpayerPhoneAuthorization"
                  {...register("taxpayerPhoneAuthorization")}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                />
                <Label htmlFor="taxpayerPhoneAuthorization">
                  By checking this box you are authorizing the IRS to contact
                  you at the telephone number listed above and leave detailed
                  messages concerning this offer on your voice mail or answering
                  machine.
                </Label>
              </div>
              {errors.taxpayerPhoneAuthorization && (
                <p className="text-red-600 text-sm">
                  {errors.taxpayerPhoneAuthorization.message}
                </p>
              )}
            </div>

            {/* Spouse or Officer Signature */}
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-2">
                    Signature of Spouse/Authorized Corporate Officer
                  </Label>
                  <input
                    type="hidden"
                    {...register("spouseOrOfficerSignature.signatureId")}
                  />
                  <div className="space-y-3 w-full">
                    {!spouseSignaturePreview ? (
                      <DropdownPopup
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            disabled={loadingSignatures}
                          >
                            Select Signature
                            <Upload className="w-4 h-4 ml-2" />
                          </Button>
                        }
                        options={
                          signatures?.map((sig) => ({
                            key: sig._id,
                            label: `${sig.title}${
                              sig.description ? ` - ${sig.description}` : ""
                            }`,
                            icon: (
                              <img
                                src={sig.url}
                                alt={sig.title}
                                className="w-20 h-10 object-contain"
                              />
                            ),
                            onClick: () =>
                              handleSelectSpouseSignature(sig._id, sig.url),
                          })) || []
                        }
                        dropdownClassName="w-80"
                        placement="bottom-left"
                      />
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <img
                          src={spouseSignaturePreview}
                          alt="Spouse Signature"
                          className="max-h-24 mx-auto mb-3"
                        />
                        <div className="flex justify-center gap-2">
                          <DropdownPopup
                            trigger={
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Change
                              </Button>
                            }
                            options={
                              signatures?.map((sig) => ({
                                key: sig._id,
                                label: `${sig.title}${
                                  sig.description ? ` - ${sig.description}` : ""
                                }`,
                                icon: (
                                  <img
                                    src={sig.url}
                                    alt={sig.title}
                                    className="w-20 h-10 object-contain"
                                  />
                                ),
                                onClick: () =>
                                  handleSelectSpouseSignature(sig._id, sig.url),
                              })) || []
                            }
                            dropdownClassName="w-80"
                            placement="bottom-left"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeSpouseSignature}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    {errors.spouseOrOfficerSignature?.signatureId && (
                      <p className="text-red-600 text-sm">
                        {errors.spouseOrOfficerSignature.signatureId.message}
                      </p>
                    )}
                  </div>
                </div>
                <FormInput
                  type="date"
                  label="Today's date (mm/dd/yyyy)"
                  id="spouseOrOfficerSignatureDate"
                  {...register("spouseOrOfficerSignatureDate")}
                  error={errors.spouseOrOfficerSignatureDate?.message}
                />
                <FormInput
                  label="Phone number"
                  id="spouseOrOfficerPhoneNumber"
                  {...register("spouseOrOfficerPhoneNumber")}
                  error={errors.spouseOrOfficerPhoneNumber?.message}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="spouseOrOfficerPhoneAuthorization"
                  {...register("spouseOrOfficerPhoneAuthorization")}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                />
                <Label htmlFor="spouseOrOfficerPhoneAuthorization">
                  By checking this box you are authorizing the IRS to contact
                  you at the telephone number listed above and leave detailed
                  messages concerning this offer on your voice mail or answering
                  machine.
                </Label>
              </div>
              {errors.spouseOrOfficerPhoneAuthorization && (
                <p className="text-red-600 text-sm">
                  {errors.spouseOrOfficerPhoneAuthorization.message}
                </p>
              )}
            </div>
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
