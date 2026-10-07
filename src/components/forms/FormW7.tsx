"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { MdOutlineFileDownload } from "react-icons/md";

import { FormStepper } from "@/components/forms/form433a-sections/form-stepper";
import { ApplicationInfoSection } from "@/components/forms/form-w7-sections/application-info-section";
import { PersonalInfoSection } from "@/components/forms/form-w7-sections/personal-info-section";
import { OtherInformationSection } from "@/components/forms/form-w7-sections/other-information-section";
import { AcceptanceAgentSection } from "@/components/forms/form-w7-sections/acceptance-agent-section";
import { SignatureDelegateSection } from "@/components/forms/form-w7-sections/signature-delegate-section";
import FormLoader from "@/components/global/FormLoader";
import { Button } from "@/components/ui/Button";
import FButton from "@/components/ui/FButton";
import api from "@/lib/services";
import { storage } from "@/utils/helper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCaseId, setSectionStatus } from "@/lib/features/formW7Slice";
import { FORM_W7_SECTIONS, w7Pricing } from "@/lib/constants";
import useSkipW7Section from "@/hooks/w7-form-hooks/useSkipW7Section";
import useDownloadW7Pdf from "@/hooks/w7-form-hooks/useDownloadW7Pdf";

const steps = [
  {
    id: 1,
    title: "Application Type and Reason",
    description: "New ITIN or renewal, and the reason for applying",
  },
  {
    id: 2,
    title: "Name, Address, and Birth Information",
    description: "Name, mailing and foreign addresses, and birth details",
  },
  {
    id: 3,
    title: "Other Information",
    description: "Citizenship, visa, identification, and supporting documents",
  },
  {
    id: 4,
    title: "Signatures",
    description: "Who signs the printed form",
  },
  {
    id: 5,
    title: "Acceptance Agent Use Only",
    description: "Agent information if applicable",
  },
];

const PROGRESS_KEY = "w7_progress";
// Seconds the "submitted" screen waits before sending the user to payment
const PAYMENT_REDIRECT_SECONDS = 5;
// The acceptance-agent section is the only one the API lets us skip
const SKIPPABLE_STEP = 5;

interface SavedProgress {
  caseId: string | null;
  currentStep: number;
  completedSteps: number[];
  skippedSteps: number[];
}

export default function FormW7() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [viewOnlyMessage, setViewOnlyMessage] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  // null = not submitted; a number = seconds left before redirecting to payment
  const [redirectIn, setRedirectIn] = useState<number | null>(null);

  const storedCaseId = useAppSelector((state) => state.formW7.caseId);
  const { downloadPdf, downloadingMap } = useDownloadW7Pdf();

  const saveProgress = (
    step: number,
    completed: Set<number>,
    skipped: Set<number>,
    caseIdToSave?: string | null
  ) => {
    try {
      storage.set(PROGRESS_KEY, {
        caseId: caseIdToSave || caseId || null,
        currentStep: step,
        completedSteps: Array.from(completed),
        skippedSteps: Array.from(skipped),
      });
    } catch (error) {
      console.error("Error saving W-7 progress:", error);
    }
  };

  // A paid form has nothing left to pay for, so it never redirects
  const beginPaymentRedirect = () => {
    if (!isPaid) setRedirectIn(PAYMENT_REDIRECT_SECONDS);
  };

  const { skipping, skipSection } = useSkipW7Section({
    caseId,
    onSkipSuccess: () => {
      const newSkippedSteps = new Set([...skippedSteps, SKIPPABLE_STEP]);
      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.delete(SKIPPABLE_STEP);
      setSkippedSteps(newSkippedSteps);
      setCompletedSteps(newCompletedSteps);

      // The skippable section is the last step, so stay put rather than
      // advancing past the end of the wizard.
      const nextStep = Math.min(SKIPPABLE_STEP + 1, steps.length);
      setCurrentStep(nextStep);
      saveProgress(nextStep, newCompletedSteps, newSkippedSteps, caseId);

      // Skipping the optional last section finishes the form
      beginPaymentRedirect();
    },
  });

  useEffect(() => {
    if (caseId && caseId !== storedCaseId) dispatch(setCaseId(caseId));
  }, [caseId, storedCaseId, dispatch]);

  const paymentUrl = `/dashboard/form-w7/payment?caseId=${caseId}`;

  useEffect(() => {
    if (redirectIn === null) return;
    if (redirectIn <= 0) {
      router.push(paymentUrl);
      return;
    }
    const timer = setTimeout(() => setRedirectIn(redirectIn - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectIn]);

  // Restore locally saved progress for a case opened without a server round-trip
  useEffect(() => {
    const savedProgress =
      storage.get<SavedProgress>(PROGRESS_KEY) ?? {
        caseId: null,
        currentStep: 1,
        completedSteps: [],
        skippedSteps: [],
      };

    if (!caseId) {
      if (savedProgress.caseId === null) {
        setCurrentStep(savedProgress.currentStep);
        setCompletedSteps(new Set(savedProgress.completedSteps));
        setSkippedSteps(new Set(savedProgress.skippedSteps || []));
      }
      setHydrated(true);
      return;
    }

    if (savedProgress.caseId === caseId) {
      setCurrentStep(savedProgress.currentStep);
      setCompletedSteps(new Set(savedProgress.completedSteps));
      setSkippedSteps(new Set(savedProgress.skippedSteps || []));
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The server is the source of truth for which sections are done
  useEffect(() => {
    if (!caseId) return;

    (async () => {
      try {
        const response = await api.getW7SectionInfo(caseId, "sectionStatus");
        const sections: Record<string, FormW7SectionStatus> =
          response?.data || {};
        dispatch(setSectionStatus(sections));

        const newCompleted: number[] = [];
        const newSkipped: number[] = [];

        FORM_W7_SECTIONS.forEach((section, index) => {
          const status = sections[section];
          if (status === "completed") newCompleted.push(index + 1);
          else if (status === "skipped") newSkipped.push(index + 1);
        });

        const firstIncompleteIndex = FORM_W7_SECTIONS.findIndex((section) => {
          const status = sections[section];
          return status !== "completed" && status !== "skipped";
        });

        const computedCurrentStep =
          firstIncompleteIndex === -1
            ? FORM_W7_SECTIONS.length
            : firstIncompleteIndex + 1;

        setCompletedSteps(new Set(newCompleted));
        setSkippedSteps(new Set(newSkipped));
        setCurrentStep(computedCurrentStep);
        setIsCompleted(sections.signatureDelegateInfo === "completed");
        setHydrated(true);

        saveProgress(
          computedCurrentStep,
          new Set(newCompleted),
          new Set(newSkipped),
          caseId
        );
      } catch (error) {
        console.error("Failed to fetch W-7 section status:", error);
        setHydrated(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  // A paid form becomes view-only so the generated PDF cannot drift from it
  useEffect(() => {
    if (!caseId) return;

    (async () => {
      try {
        const response = await api.getW7SectionInfo(caseId, "paymentStatus");
        const paid = response?.data?.status === "completed";
        setIsPaid(paid);
        setDisableForm(paid);
        setViewOnlyMessage(
          paid ? "You can view this completed form but can no longer edit it." : ""
        );
      } catch (error) {
        console.error("Failed to fetch W-7 payment status:", error);
        setIsPaid(false);
        setDisableForm(false);
        setViewOnlyMessage("");
      }
    })();
  }, [caseId]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep, newCompletedSteps, skippedSteps, caseId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep, completedSteps, skippedSteps, caseId);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (
      stepNumber <= currentStep ||
      completedSteps.has(stepNumber) ||
      skippedSteps.has(stepNumber)
    ) {
      setCurrentStep(stepNumber);
      saveProgress(stepNumber, completedSteps, skippedSteps, caseId);
    }
  };

  // Saving the signature section is what marks the case complete on the API,
  // even though the optional acceptance-agent section comes after it.
  const handleCompleted = () => {
    const signatureStep = 4;
    const newCompletedSteps = new Set([...completedSteps, signatureStep]);
    setCompletedSteps(newCompletedSteps);
    setIsCompleted(true);
    saveProgress(signatureStep, newCompletedSteps, skippedSteps, caseId);
  };

  // The last step's Submit: mark it done, then head to payment
  const handleSubmitted = () => {
    const newCompletedSteps = new Set([...completedSteps, steps.length]);
    setCompletedSteps(newCompletedSteps);
    saveProgress(steps.length, newCompletedSteps, skippedSteps, caseId);
    beginPaymentRedirect();
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      currentStep,
      totalSteps: steps.length,
      disabled: disableForm,
    };

    switch (currentStep) {
      case 1:
        return <ApplicationInfoSection {...commonProps} />;
      case 2:
        return <PersonalInfoSection {...commonProps} />;
      case 3:
        return <OtherInformationSection {...commonProps} />;
      case 4:
        return (
          <SignatureDelegateSection
            {...commonProps}
            onCompleted={handleCompleted}
          />
        );
      case 5:
        return (
          <AcceptanceAgentSection
            {...commonProps}
            onSubmitted={handleSubmitted}
          />
        );
      default:
        return <ApplicationInfoSection {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form W-7</h1>
          <p className="text-lg text-gray-600">
            Application for IRS Individual Taxpayer Identification Number
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Department of the Treasury — Internal Revenue Service
          </p>
        </div>

        {redirectIn !== null && caseId ? (
          <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Form W-7 submitted
            </h2>
            <p className="text-gray-600">
              Your application has been saved. You&apos;ll be redirected to
              payment in {redirectIn} second{redirectIn === 1 ? "" : "s"}.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              You can pay later from your dashboard. The form can&apos;t be
              generated or downloaded until the ${w7Pricing} payment is complete.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <FButton
                variant="outline"
                onClick={() => {
                  setRedirectIn(null);
                  router.push("/dashboard");
                }}
              >
                Pay later
              </FButton>
              <FButton onClick={() => router.push(paymentUrl)}>
                Pay now
              </FButton>
            </div>
          </div>
        ) : (
          <>
            {viewOnlyMessage && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
                <p className="font-medium">Form View Only</p>
                <p>{viewOnlyMessage}</p>
              </div>
            )}

            {isCompleted && caseId && (
              <div className="mb-6 p-5 bg-white border border-[var(--primary)]/30 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      All required sections are complete
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {isPaid
                        ? "Generate the form, then print it and add the original signature before mailing it to the IRS."
                        : `Complete the $${w7Pricing} payment to generate and download the completed Form W-7.`}
                    </p>
                  </div>

                  {isPaid ? (
                    <Button
                      onClick={() => downloadPdf(caseId)}
                      disabled={downloadingMap[caseId]}
                      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white flex items-center gap-2"
                    >
                      {downloadingMap[caseId] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MdOutlineFileDownload className="h-4 w-4" />
                      )}
                      {downloadingMap[caseId]
                        ? "Generating..."
                        : "Generate and download"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/form-w7/payment?caseId=${caseId}`)
                      }
                      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
                    >
                      Continue to payment
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
              <div className="lg:w-1/4">
                {hydrated ? (
                  <FormStepper
                    steps={steps}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    skippedSteps={skippedSteps}
                    onStepClick={handleStepClick}
                  />
                ) : (
                  <div className="p-4">
                    <FormLoader />
                  </div>
                )}
              </div>

              <div className="lg:w-3/4 h-full">
                <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="w-full flex justify-end">
                    {currentStep === SKIPPABLE_STEP && !disableForm && (
                      <Button
                        disabled={skipping}
                        onClick={skipSection}
                        className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 transition-all text-white font-medium mb-5"
                      >
                        {skipping ? "Skipping..." : "Skip"}
                      </Button>
                    )}
                  </div>
                  {hydrated ? renderCurrentSection() : <FormLoader />}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
