"use client";

import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  applicationChecklistSchema,
  applicationChecklistInitialValues,
} from "@/lib/validation/form656/application-checklist-section";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { FORM_656_SECTIONS } from "@/lib/constants";
import useApplicationChecklist from "@/hooks/656-form-hooks/useApplicationChecklist";

interface ApplicationChecklistSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function ApplicationChecklistSection({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: ApplicationChecklistSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);
  const { applicationChecklist } = useAppSelector((state) => state.form656);
  const {
    loading,
    loadingFormData,
    handleSaveApplicationChecklist,
    handleGetApplicationChecklist,
  } = useApplicationChecklist();

  const methods = useForm<ApplicationChecklistFormSchema>({
    resolver: zodResolver(applicationChecklistSchema),
    defaultValues: applicationChecklistInitialValues,
    mode: "onSubmit",
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ApplicationChecklistFormSchema) => {
    try {
      await handleSaveApplicationChecklist(data, caseId);
      toast.success(
        "Form 656 completed successfully, Now you can download it from dashboard."
      );
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error saving application checklist:", error);
      toast.error(error.message || "Failed to save application checklist");
    }
  };

  console.log("applicationChecklist: ", applicationChecklist);

  useEffect(() => {
    if (!applicationChecklist)
      handleGetApplicationChecklist(caseId, FORM_656_SECTIONS[8]);
  }, []);

  useEffect(() => {
    if (applicationChecklist) {
      reset(applicationChecklist);
    }
  }, [applicationChecklist]);

  if (loadingFormData) {
    return <FormLoader />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Checklist
          </h2>
          <p className="text-gray-600">
            Review the entire application using the Application Checklist below.
            Include this checklist with your application.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forms 433-A (OIC), 433-B (OIC), and 656</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="completedAllFieldsAndSigned"
                {...register("completedAllFieldsAndSigned")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="completedAllFieldsAndSigned"
                  className="text-sm font-medium"
                >
                  Did you complete all fields and sign all forms
                </Label>
                {errors.completedAllFieldsAndSigned && (
                  <p className="text-red-600 text-sm">
                    {errors.completedAllFieldsAndSigned.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="offerAmountMatchesCalculation"
                {...register("offerAmountMatchesCalculation")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="offerAmountMatchesCalculation"
                  className="text-sm font-medium"
                >
                  Did you make an offer amount that is equal to the offer amount
                  calculated on the Form 433-A (OIC) or Form 433-B (OIC)? If
                  not, did you describe the special circumstances that are
                  leading you to offer less than the minimum in Section 3,
                  Reason for Offer, of Form 656, and did you provide supporting
                  documentation of the special circumstances
                </Label>
                {errors.offerAmountMatchesCalculation && (
                  <p className="text-red-600 text-sm">
                    {errors.offerAmountMatchesCalculation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="filedAllRequiredReturns"
                {...register("filedAllRequiredReturns")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="filedAllRequiredReturns"
                  className="text-sm font-medium"
                >
                  Have you filed all required tax returns and received a bill or
                  notice of balance due
                </Label>
                {errors.filedAllRequiredReturns && (
                  <p className="text-red-600 text-sm">
                    {errors.filedAllRequiredReturns.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="includedRecentTaxReturnCopy"
                {...register("includedRecentTaxReturnCopy")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="includedRecentTaxReturnCopy"
                  className="text-sm font-medium"
                >
                  Did you include a complete copy of any tax return filed within
                  10 weeks of this offer submission
                </Label>
                {errors.includedRecentTaxReturnCopy && (
                  <p className="text-red-600 text-sm">
                    {errors.includedRecentTaxReturnCopy.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="selectedPaymentOption"
                {...register("selectedPaymentOption")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="selectedPaymentOption"
                  className="text-sm font-medium"
                >
                  Did you select a payment option on Form 656
                </Label>
                {errors.selectedPaymentOption && (
                  <p className="text-red-600 text-sm">
                    {errors.selectedPaymentOption.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="signedForm433A"
                {...register("signedForm433A")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label htmlFor="signedForm433A" className="text-sm font-medium">
                  Did you sign and attach the Form 433-A (OIC), if applicable
                </Label>
                {errors.signedForm433A && (
                  <p className="text-red-600 text-sm">
                    {errors.signedForm433A.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="signedForm433B"
                {...register("signedForm433B")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label htmlFor="signedForm433B" className="text-sm font-medium">
                  Did you sign and attach the Form 433-B (OIC), if applicable
                </Label>
                {errors.signedForm433B && (
                  <p className="text-red-600 text-sm">
                    {errors.signedForm433B.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="signedForm656"
                {...register("signedForm656")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label htmlFor="signedForm656" className="text-sm font-medium">
                  Did you sign and attach the Form 656
                </Label>
                {errors.signedForm656 && (
                  <p className="text-red-600 text-sm">
                    {errors.signedForm656.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="separatePackageForBusinessAndIndividual"
                {...register("separatePackageForBusinessAndIndividual")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="separatePackageForBusinessAndIndividual"
                  className="text-sm font-medium"
                >
                  If you are making an offer that includes business and
                  individual tax debts, did you prepare a separate Form 656
                  package (including separate financial statements, supporting
                  documentation, application fee, and initial payment)
                </Label>
                {errors.separatePackageForBusinessAndIndividual && (
                  <p className="text-red-600 text-sm">
                    {errors.separatePackageForBusinessAndIndividual.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting documentation and additional forms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="includedSupportingDocumentation"
                {...register("includedSupportingDocumentation")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="includedSupportingDocumentation"
                  className="text-sm font-medium"
                >
                  Did you include photocopies of all required supporting
                  documentation
                </Label>
                {errors.includedSupportingDocumentation && (
                  <p className="text-red-600 text-sm">
                    {errors.includedSupportingDocumentation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="includedForm2848Or8821"
                {...register("includedForm2848Or8821")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="includedForm2848Or8821"
                  className="text-sm font-medium"
                >
                  If you want a third party to represent you and receive
                  confidential information during the offer process, did you
                  include a Form 2848? If you want a third party to only receive
                  confidential information on your behalf, did you include a
                  valid Form 8821?
                </Label>
                {errors.includedForm2848Or8821 && (
                  <p className="text-red-600 text-sm">
                    {errors.includedForm2848Or8821.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="providedAuthorizationDocumentation"
                {...register("providedAuthorizationDocumentation")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="providedAuthorizationDocumentation"
                  className="text-sm font-medium"
                >
                  Does the authorization include the current tax year. Did you
                  provide a letter of testamentary or other verification of
                  person(s) authorized to act on behalf of the estate or
                  deceased individual
                </Label>
                {errors.providedAuthorizationDocumentation && (
                  <p className="text-red-600 text-sm">
                    {errors.providedAuthorizationDocumentation.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="includedInitialPayment"
                {...register("includedInitialPayment")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="includedInitialPayment"
                  className="text-sm font-medium"
                >
                  Did you include a check or money order made payable to the
                  “United States Treasury” for the initial payment? (Waived if
                  you meet Low-Income Certification guidelines—see Form 656)
                </Label>
                {errors.includedInitialPayment && (
                  <p className="text-red-600 text-sm">
                    {errors.includedInitialPayment.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="includedApplicationFee"
                {...register("includedApplicationFee")}
                className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
              />
              <div>
                <Label
                  htmlFor="includedApplicationFee"
                  className="text-sm font-medium"
                >
                  Did you include a separate check or money order made payable
                  to the “United States Treasury” for the application fee?
                  (Waived if you meet Low- Income Certification guidelines—see
                  Form 656)
                </Label>
                {errors.includedApplicationFee && (
                  <p className="text-red-600 text-sm">
                    {errors.includedApplicationFee.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Send your application package to the appropriate IRS facility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>
              Mail the Form 656, 433-A (OIC) and/or 433-B (OIC), and related
              financial document(s) to the appropriate IRS processing office for
              your state. Alternatively, individual taxpayers may file offers in
              compromise electronically and make initial payments via Individual
              Online Account (IOLA).
            </p>
            <p>If you reside in: Mail your application to:</p>
            <p>
              AZ, CA, CO, GA, HI, ID, KY, LA, MS, NM, NV, OK, OR, TN, TX, UT, WA
              Memphis IRS Center COIC Unit P.O. Box 30803, AMC Memphis, TN
              38130-0803 844-398-5025
            </p>
            <p>
              AK, AL, AR, CT, DC, DE, FL, IA, IL, IN, KS, MA, MD, ME, MI, MN,
              MO, MT, NC, ND, NE, NH, NJ, NY, OH, PA, PR, RI, SC, SD, VA, VT,
              WI, WV, WY, or a foreign address Brookhaven IRS Center COIC Unit
              P.O. Box 9007 Holtsville, NY 11742-9007 844-805-4980
            </p>
          </CardContent>
        </Card>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit(onSubmit)}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
