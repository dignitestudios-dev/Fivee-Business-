"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Upload, Trash2, Edit, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  signatureInitialValues,
  signatureSchemaFormB,
} from "@/lib/validation/form433b/signature-section";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { FORM_433B_SECTIONS } from "@/lib/constants";
import useBusinessInfo from "@/hooks/433b-form-hooks/useBusinessInfo";
import useSignatures from "@/hooks/signatures/useSignatures";
import useSignaturesAndAttachments from "@/hooks/433b-form-hooks/useSignaturesAndAttachments";
import DropdownPopup from "@/components/ui/DropdownPopup";

interface SignatureSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const attachmentData = [
  {
    id: 1,
    name: "profitAndLossStatement",
    text: "A current Profit and Loss statement covering at least the most recent 6–12 month period, if appropriate.",
  },
  {
    id: 2,
    name: "bankStatements",
    text: "Copies of the six most recent complete bank statements for each business account and copies of the three most recent statements for each investment account.",
  },
  {
    id: 3,
    name: "collateralLoanStatements",
    text: "If an asset is used as collateral on a loan, include copies of the most recent statement from lender(s) on loans, monthly payments, loan payoffs, and balances.",
  },
  {
    id: 4,
    name: "accountsNotesReceivableStatements",
    text: "Copies of the most recent statement of outstanding accounts and notes receivable.",
  },
  {
    id: 5,
    name: "digitalAssetsDocumentation",
    text: "Copies of all documents and records showing currently held digital assets.",
  },
  {
    id: 6,
    name: "loanMortgageStatements",
    text: "Copies of the most recent statements from lenders on loans, mortgages (including second mortgages), monthly payments, loan payoffs, and balances.",
  },
  {
    id: 7,
    name: "specialCircumstancesDocumentation",
    text: "Copies of relevant supporting documentation of special circumstances described in the Section 3 on Form 656, if applicable.",
  },
  {
    id: 8,
    name: "form2848PowerOfAttorney",
    text: "Attach a Form 2848, Power of Attorney and Declaration of Representative, if you would like your attorney, CPA, or enrolled agent to represent you and you do not have a current form on file with the IRS. Ensure all years and forms involved in your offer are listed on Form 2848 and include the current tax year",
  },
  {
    id: 9,
    name: "form656Completed",
    text: "Completed and current signed Form 656.",
  },
];

export function SignatureSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: SignatureSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { signatureInfo } = useAppSelector((state) => state.form433b);
  const signatures = useAppSelector(
    (state) => state.signatures?.images
  ) as Signature[];

  const { loadingFormData: loadingBusiness, handleGetBusinessInfo } =
    useBusinessInfo();
  const {
    loading,
    loadingFormData,
    handleSaveSignatureInfo,
    handleGetSignatureInfo,
  } = useSignaturesAndAttachments();
  const { handleGetSignatures, getting: loadingSignatures } = useSignatures();

  const methods = useForm<SignatureFormSchema>({
    resolver: zodResolver(signatureSchemaFormB),
    defaultValues: signatureInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = methods;

  const [representativeSignaturePreview, setRepresentativeSignaturePreview] =
    useState<string | null>(null);

  const handleFormSubmit = async (data: SignatureFormSchema) => {
    try {
      await handleSaveSignatureInfo(data, caseId);
      router.push(`/dashboard/433b-oic/payment?caseId=${caseId}`);
    } catch (error: any) {
      console.error("Error saving signature info:", error);
      toast.error(error.message || "Failed to save signature info");
    }
  };

  useEffect(() => {
    if (!signatureInfo) handleGetSignatureInfo(caseId!, FORM_433B_SECTIONS[6]);
  }, [caseId]);

  useEffect(() => {
    handleGetSignatures();
  }, []);

  useEffect(() => {
    if (signatureInfo) {
      reset(signatureInfo);
    }
  }, [signatureInfo, reset]);

  useEffect(() => {
    if (
      signatureInfo?.taxpayerSignature?.signatureId &&
      signatures?.length > 0
    ) {
      const sig = signatures?.find(
        (s) => s._id === signatureInfo.taxpayerSignature.signatureId
      );
      if (sig) {
        setRepresentativeSignaturePreview(sig.url);
      }
    }
  }, [signatureInfo, signatures]);

  const handleSelectRepresentativeSignature = async (
    id: string,
    url: string
  ) => {
    setRepresentativeSignaturePreview(url);
    setValue("taxpayerSignature.signatureId", id, {
      shouldValidate: true,
    });
    await trigger("taxpayerSignature.signatureId");
  };

  const removeRepresentativeSignature = async () => {
    setRepresentativeSignaturePreview(null);
    setValue("taxpayerSignature.signatureId", "", {
      shouldValidate: true,
    });
    await trigger("taxpayerSignature.signatureId");
  };

  const handleReloadSignatures = () => {
    handleGetSignatures();
  };

  if (loadingFormData || loadingBusiness) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 7: Signatures
          </h2>
          <p className="text-gray-600">
            Under penalties of perjury, I declare that I have examined this
            offer, including accompanying documents, and to the best of my
            knowledge it is true, correct, and complete.
          </p>
        </div>

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Required Signatures</CardTitle>
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
            {/* Representative Signature */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-2">
                    Signature of Authorized Representative *
                  </Label>
                  {/* Hidden input to register the field with react-hook-form */}
                  <input
                    type="hidden"
                    {...register("taxpayerSignature.signatureId")}
                  />
                  <div className="space-y-3 w-full">
                    {!representativeSignaturePreview ? (
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
                              handleSelectRepresentativeSignature(
                                sig._id,
                                sig.url
                              ),
                          })) || []
                        }
                        dropdownClassName="w-80"
                        placement="bottom-left"
                      />
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <img
                          src={representativeSignaturePreview}
                          alt="Representative Signature"
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
                                  handleSelectRepresentativeSignature(
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
                            onClick={removeRepresentativeSignature}
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
                  label="Title"
                  required
                  id="taxpayerSignature.title"
                  {...register("taxpayerSignature.title")}
                  error={errors.taxpayerSignature?.title?.message}
                />
                <FormInput
                  type="date"
                  label="Date (mm/dd/yyyy)"
                  required
                  id="taxpayerSignature.date"
                  {...register("taxpayerSignature.date")}
                  error={errors.taxpayerSignature?.date?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Required Attachments</CardTitle>
            <p className="text-sm text-gray-600">
              Please confirm that you have included all applicable attachments
              listed below by checking each box.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {attachmentData.map((attachment) => {
                const attachmentKey =
                  attachment.name as keyof SignatureFormSchema["attachmentChecklist"];
                const isChecked =
                  watch(`attachmentChecklist.${attachment.name}` as any) ||
                  false;
                const error = errors.attachmentChecklist?.[attachmentKey];

                return (
                  <div
                    key={attachment.id}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex flex-col">
                      <Checkbox
                        id={`attachment-${attachment.name}`}
                        checked={Boolean(isChecked)}
                        onCheckedChange={(checked) =>
                          setValue(
                            `attachmentChecklist.${attachment.name}` as any,
                            checked as boolean,
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                        className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                      />
                    </div>
                    <div className="flex-grow">
                      <Label
                        htmlFor={`attachment-${attachment.name}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {attachment.text} *
                      </Label>
                      {error && (
                        <p className="text-red-600 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Act Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Act Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                We ask for the information on this form to carry out the
                internal revenue laws of the United States. Our authority to
                request this information is section 7801 of the Internal Revenue
                Code.
              </p>
              <p>
                Our purpose for requesting the information is to determine if it
                is in the best interests of the IRS to accept an offer. You are
                not required to make an offer; however, if you choose to do so,
                you must provide all of the taxpayer information requested.
                Failure to provide all of the information may prevent us from
                processing your request.
              </p>
              <p>
                If you are a paid preparer and you prepared the Form 656 for the
                taxpayer submitting an offer, we request that you complete and
                sign Section 7 on Form 656, and provide identifying information.
                Providing this information is voluntary. This information will
                be used to administer and enforce the internal revenue laws of
                the United States and may be used to regulate practice before
                the Internal Revenue Service for those persons subject to
                Treasury Department Circular No. 230, Regulations Governing the
                Practice of Attorneys, Certified Public Accountants, Enrolled
                Agents, Enrolled Actuaries, and Appraisers before the Internal
                Revenue Service.
              </p>
              <p>
                Information on this form may be disclosed to the Department of
                Justice for civil and criminal litigation. We may also disclose
                this information to cities, states and the District of Columbia
                for use in administering their tax laws and to combat terrorism.
                Providing false or fraudulent information on this form may
                subject you to criminal prosecution and penalties.
              </p>
            </div>
          </CardContent>
        </Card>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={onNext}
          onSubmit={handleSubmit(handleFormSubmit)}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
