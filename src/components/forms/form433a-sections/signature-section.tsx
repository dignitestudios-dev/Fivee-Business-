"use client";

import { FormNavigation } from "./form-navigation";
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
  signatureSchema,
  SignatureFormSchema,
} from "@/lib/validation/form433a/signature-section";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { FORM_433A_SECTIONS } from "@/lib/constants";
import usePersonalInfo from "@/hooks/433a-form-hooks/usePersonalInfo";
import useSignatures from "@/hooks/signatures/useSignatures";
import useSignatureAndAttachments from "@/hooks/433a-form-hooks/useSignatureAndAttachments";
import DropdownPopup from "@/components/ui/DropdownPopup";
import Required from "@/components/ui/Required";

interface SignatureSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const attachmentData = [
  {
    id: 1,
    name: "payStubs",
    text: "Copies of the most recent pay stub, earnings statement, etc., from each employer.",
  },
  {
    id: 2,
    name: "investmentStatements",
    text: "Copies of the most recent statement for each investment and retirement account.",
  },
  {
    id: 3,
    name: "digitalAssetsDocs",
    text: "Copies of all documents and records showing currently held digital assets.",
  },
  {
    id: 4,
    name: "otherIncomeStatements",
    text: "Copies of the most recent statement from all other sources of income such as pensions, Social Security, rental income, interest and dividends, court order for child support, alimony, royalties, agricultural subsidies, gambling income, oil credits, rent subsidies, sharing economy income from providing on-demand work, services or goods (e.g., Uber, Lyft, DoorDash, AirBnb, VRBO), income through digital platforms like an app or website, etc., and recurring capital gains from the sale of securities or other property such as digital assets.",
  },
  {
    id: 5,
    name: "bankStatements",
    text: "Copies of individual complete bank statements for the three most recent months. If you operate a business, copies of the six most recent complete statements for each business bank account.",
  },
  {
    id: 6,
    name: "form433B",
    text: "Completed Form 433-B (Collection Information Statement for Businesses) if you or your spouse have an interest in a business entity other than a sole-proprietorship.",
  },
  {
    id: 7,
    name: "loanStatements",
    text: "Copies of the most recent statement from lender(s) on loans such as mortgages, second mortgages, vehicles, etc., showing monthly payments, loan payoffs, and balances.",
  },
  {
    id: 8,
    name: "accountsReceivable",
    text: "List of Accounts Receivable or Notes Receivable, if applicable.",
  },
  {
    id: 9,
    name: "taxLiabilityVerification",
    text: "Verification of delinquent State/Local Tax Liability showing total delinquent state/local taxes and amount of monthly payments, if applicable.",
  },
  {
    id: 10,
    name: "courtOrders",
    text: "Copies of court orders for child support/alimony payments claimed in monthly expense section.",
  },
  {
    id: 11,
    name: "trustDocuments",
    text: "Copies of Trust documents if applicable per Section 9.",
  },
  {
    id: 12,
    name: "specialCircumstancesDocs",
    text: 'Documentation to support any special circumstances described in the "Explanation of Circumstances" on Form 656, if applicable.',
  },
  {
    id: 13,
    name: "form2848",
    text: "Attach a Form 2848, Power of Attorney and Declaration of Representative, if you would like your attorney, CPA, or enrolled agent to represent you and you do not have a current form on file with the IRS. Ensure all years and forms involved in your offer are listed on Form 2848 and include the current tax year.",
  },
  {
    id: 14,
    name: "form656",
    text: "Completed and signed current Form 656.",
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
  const { personalInfo, signatureInfo } = useAppSelector(
    (state) => state.form433a
  );
  const signatures = useAppSelector(
    (state) => state.signatures?.images
  ) as Signature[];

  const { loadingFormData: loadingPersonal, handleGetPersonalInfo } =
    usePersonalInfo();
  const {
    loading,
    loadingFormData,
    handleSaveSignatureInfo,
    handleGetSignatureInfo,
  } = useSignatureAndAttachments();
  const { handleGetSignatures, getting: loadingSignatures } = useSignatures();

  const maritalStatus = useMemo(
    () => personalInfo?.maritalStatus || "unmarried",
    [personalInfo]
  );

  const schema = useMemo(
    () => signatureSchema(maritalStatus as "married" | "unmarried"),
    [maritalStatus]
  );

  const methods = useForm<SignatureFormSchema>({
    resolver: zodResolver(schema) as any,
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

  const [taxpayerSignaturePreview, setTaxpayerSignaturePreview] = useState<
    string | null
  >(null);
  const [spouseSignaturePreview, setSpouseSignaturePreview] = useState<
    string | null
  >(null);

  const handleFormSubmit = async (data: SignatureFormSchema) => {
    try {
      // delete data.taxpayerSignature.signatureId;
      // delete data.spouseSignature.signatureId;

      await handleSaveSignatureInfo(data, caseId);
      router.push(`/dashboard/433a-oic/payment?caseId=${caseId}`);
    } catch (error: any) {
      console.error("Error saving signature info:", error);
      toast.error(error.message || "Failed to save signature info");
    }
  };

  useEffect(() => {
    if (!personalInfo) handleGetPersonalInfo(caseId!, FORM_433A_SECTIONS[0]);
    if (!signatureInfo) handleGetSignatureInfo(caseId!, FORM_433A_SECTIONS[9]);
  }, [caseId]);

  useEffect(() => {
    handleGetSignatures();
  }, []);

  useEffect(() => {
    if (signatureInfo) {
      reset(signatureInfo);
    }
  }, [signatureInfo, reset]);

  // useEffect(() => {
  //   if (
  //     signatureInfo?.taxpayerSignature?.signatureId &&
  //     signatures?.length > 0
  //   ) {
  //     const sig = signatures?.find(
  //       (s) => s._id === signatureInfo.taxpayerSignature.signatureId
  //     );
  //     if (sig) {
  //       setTaxpayerSignaturePreview(sig.url);
  //     }
  //   }
  //   if (signatureInfo?.spouseSignature?.signatureId && signatures?.length > 0) {
  //     const sig = signatures?.find(
  //       (s) => s._id === signatureInfo.spouseSignature.signatureId
  //     );
  //     if (sig) {
  //       setSpouseSignaturePreview(sig.url);
  //     }
  //   }

  //   if (signatureInfo?.taxpayerSignature?.signature) {
  //     setTaxpayerSignaturePreview(signatureInfo.taxpayerSignature.signature);
  //   }
  //   if (signatureInfo?.spouseSignature?.signature) {
  //     setSpouseSignaturePreview(signatureInfo.spouseSignature.signature);
  //   }
  // }, [signatureInfo, signatures]);

  // const handleSelectTaxpayerSignature = async (id: string, url: string) => {
  //   setTaxpayerSignaturePreview(url);
  //   console.log("tax payer id: ", id);
  //   setValue("taxpayerSignature.signatureId", id, { shouldValidate: true });
  //   await trigger("taxpayerSignature.signatureId");
  // };

  // const handleSelectSpouseSignature = async (id: string, url: string) => {
  //   setSpouseSignaturePreview(url);
  //   setValue("spouseSignature.signatureId", id, { shouldValidate: true });
  //   await trigger("spouseSignature.signatureId");
  // };

  // const removeTaxpayerSignature = async () => {
  //   setTaxpayerSignaturePreview(null);
  //   setValue("taxpayerSignature.signatureId", "", { shouldValidate: true });
  //   await trigger("taxpayerSignature.signatureId");
  // };

  // const removeSpouseSignature = async () => {
  //   setSpouseSignaturePreview(null);
  //   setValue("spouseSignature.signatureId", "", { shouldValidate: true });
  //   await trigger("spouseSignature.signatureId");
  // };

  const handleReloadSignatures = () => {
    handleGetSignatures();
  };

  if (loadingFormData || loadingPersonal) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Section 10: Signatures
          </h2>
          <p className="text-gray-600">
            Under penalties of perjury, I declare that I have examined this
            offer, including accompanying documents, and to the best of my
            knowledge it is true, correct, and complete.
          </p>
        </div>

        {/* Signatures */}
        <Card>
          {/* <CardHeader>
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
          </CardHeader> */}
          <CardContent className="space-y-6">
            {/* Taxpayer Signature */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxpayerSignature.date">
                    Tax Payer Signature Date (mm/dd/yyyy) <Required />
                  </Label>
                  <FormInput
                    label=""
                    required
                    id="taxpayerSignature.date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("taxpayerSignature.date")}
                    error={errors.taxpayerSignature?.date?.message}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>
            </div>

            {/* Spouse Signature */}
            {maritalStatus === "married" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="spouseSignature.date">
                      Tax Payer Spouse Signature Date (mm/dd/yyyy) <Required />
                    </Label>
                    <FormInput
                      label=""
                      required
                      id="spouseSignature.date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("spouseSignature.date")}
                      error={errors.spouseSignature?.date?.message}
                      className="focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>
                </div>
              </div>
            )}
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
                  attachment.name as keyof SignatureFormSchema["attachments"];
                const isChecked =
                  watch(`attachments.${attachment.name}` as any) || false;
                const error = errors.attachments?.[attachmentKey];

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
                            `attachments.${attachment.name}` as any,
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
                request this information is section § 7801 of the Internal
                Revenue Code.
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
                sign Section 9 on Form 656, and provide identifying information.
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

// <div>
//   <Label className="mb-2">Signature of Taxpayer <Required /></Label>
//   {/* Hidden input to register the field with react-hook-form */}
//   <input
//     type="hidden"
//     {...register("taxpayerSignature.signatureId")}
//   />
//   <div className="space-y-3 w-full">
//     {!taxpayerSignaturePreview ? (
//       <DropdownPopup
//         trigger={
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full justify-between"
//             disabled={loadingSignatures}
//           >
//             Select Signature
//             <Upload className="w-4 h-4 ml-2" />
//           </Button>
//         }
//         options={
//           signatures?.map((sig) => ({
//             key: sig._id,
//             label: `${sig.title}${
//               sig.description ? ` - ${sig.description}` : ""
//             }`,
//             icon: (
//               <img
//                 src={sig.url}
//                 alt={sig.title}
//                 className="w-20 h-10 object-contain"
//               />
//             ),
//             onClick: () =>
//               handleSelectTaxpayerSignature(sig._id, sig.url),
//           })) || []
//         }
//         dropdownClassName="w-80"
//         placement="bottom-left"
//       />
//     ) : (
//       <div className="border border-gray-300 rounded-lg p-4">
//         <img
//           src={taxpayerSignaturePreview}
//           alt="Taxpayer Signature"
//           className="max-h-24 mx-auto mb-3"
//         />
//         <div className="flex justify-center gap-2">
//           <DropdownPopup
//             trigger={
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
//               >
//                 <Edit className="w-4 h-4 mr-1" />
//                 Change
//               </Button>
//             }
//             options={
//               signatures?.map((sig) => ({
//                 key: sig._id,
//                 label: `${sig.title}${
//                   sig.description ? ` - ${sig.description}` : ""
//                 }`,
//                 icon: (
//                   <img
//                     src={sig.url}
//                     alt={sig.title}
//                     className="w-20 h-10 object-contain"
//                   />
//                 ),
//                 onClick: () =>
//                   handleSelectTaxpayerSignature(
//                     sig._id,
//                     sig.url
//                   ),
//               })) || []
//             }
//             dropdownClassName="w-80"
//             placement="bottom-left"
//           />
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={removeTaxpayerSignature}
//             className="text-red-600 border-red-600 hover:bg-red-50"
//           >
//             <Trash2 className="w-4 h-4 mr-1" />
//             Remove
//           </Button>
//         </div>
//       </div>
//     )}
//     {errors.taxpayerSignature?.signatureId && (
//       <p className="text-red-600 text-sm">
//         {errors.taxpayerSignature.signatureId.message}
//       </p>
//     )}
//   </div>
// </div>

//                 <div>
//   <Label className="mb-2">Signature of Spouse *</Label>
//   {/* Hidden input to register the field with react-hook-form */}
//   <input
//     type="hidden"
//     {...register("spouseSignature.signatureId")}
//   />
//   <div className="space-y-3">
//     {!spouseSignaturePreview ? (
//       <DropdownPopup
//         trigger={
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full justify-between"
//             disabled={loadingSignatures}
//           >
//             Select Signature
//             <Upload className="w-4 h-4 ml-2" />
//           </Button>
//         }
//         options={
//           signatures?.map((sig) => ({
//             key: sig._id,
//             label: `${sig.title}${
//               sig.description ? ` - ${sig.description}` : ""
//             }`,
//             icon: (
//               <img
//                 src={sig.url}
//                 alt={sig.title}
//                 className="w-20 h-10 object-contain"
//               />
//             ),
//             onClick: () =>
//               handleSelectSpouseSignature(sig._id, sig.url),
//           })) || []
//         }
//         dropdownClassName="w-80"
//         placement="bottom-left"
//       />
//     ) : (
//       <div className="border border-gray-300 rounded-lg p-4">
//         <img
//           src={spouseSignaturePreview}
//           alt="Spouse Signature"
//           className="max-h-24 mx-auto mb-3"
//         />
//         <div className="flex justify-center gap-2">
//           <DropdownPopup
//             trigger={
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
//               >
//                 <Edit className="w-4 h-4 mr-1" />
//                 Change
//               </Button>
//             }
//             options={
//               signatures?.map((sig) => ({
//                 key: sig._id,
//                 label: `${sig.title}${
//                   sig.description
//                     ? ` - ${sig.description}`
//                     : ""
//                 }`,
//                 icon: (
//                   <img
//                     src={sig.url}
//                     alt={sig.title}
//                     className="w-20 h-10 object-contain"
//                   />
//                 ),
//                 onClick: () =>
//                   handleSelectSpouseSignature(
//                     sig._id,
//                     sig.url
//                   ),
//               })) || []
//             }
//             dropdownClassName="w-80"
//             placement="bottom-left"
//           />
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={removeSpouseSignature}
//             className="text-red-600 border-red-600 hover:bg-red-50"
//           >
//             <Trash2 className="w-4 h-4 mr-1" />
//             Remove
//           </Button>
//         </div>
//       </div>
//     )}
//     {errors.spouseSignature?.signatureId && (
//       <p className="text-red-600 text-sm">
//         {errors.spouseSignature.signatureId.message}
//       </p>
//     )}
//   </div>
// </div>
