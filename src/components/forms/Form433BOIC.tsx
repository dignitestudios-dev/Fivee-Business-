"use client";

import { useEffect, useMemo, useState } from "react";
import { FormStepper } from "@/components/forms/form433a-sections/form-stepper"; // Reuse if possible, or create similar for 433B
import { BusinessInfoSection } from "@/components/forms/form433b-sections/business-info-section"; // We'll create this
// Import other sections as you create them, e.g.:
// import { BusinessAssetSection } from "@/components/forms/form433b-sections/business-asset-section";
// etc.
import { storage } from "@/utils/helper";
import api from "@/lib/services";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCaseId } from "@/lib/features/form433bSlice";
import { BusinessAssetsSection } from "./form433b-sections/business-asset-section";
import { BusinessIncomeSection } from "./form433b-sections/business-income-section";
import { BusinessExpenseSection } from "./form433b-sections/business-expense-section";
import { CalculationSection } from "./form433b-sections/calculation-section";
import { OtherInfoSection } from "./form433b-sections/other-info-section";
import { SignatureSection } from "./form433b-sections/signature-section";
import { Button } from "../ui/Button";
import useSkipSection from "@/hooks/useSkipSection";

const steps = [
  {
    id: 1,
    title: "Business Information",
    description: "Basic business details (domestic and foreign)",
  },
  {
    id: 2,
    title: "Business Assets",
    description: "Asset information (domestic and foreign)",
  },
  {
    id: 3,
    title: "Business Income",
    description: "Monthly business income",
  },
  {
    id: 4,
    title: "Business Expenses",
    description: "Monthly business expenses",
  },
  {
    id: 5,
    title: "Calculations",
    description: "Calculate minimum offer amount",
  },
  {
    id: 6,
    title: "Other Information",
    description: "Additional required information",
  },
  {
    id: 7,
    title: "Signatures",
    description: "Final signatures and submission",
  },
];

export default function Form433BOIC() {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

  // don't clear on initial undefined caseId; we'll hydrate below

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [viewOnlyMessage, setViewOnlyMessage] = useState<string>("");

  // Skip section hook
  const { skipping, skipSection } = useSkipSection({
    caseId,
    currentStep,
    onSkipSuccess: (step) => {
      // Mark step as skipped and move to next
      const newSkippedSteps = new Set([...skippedSteps, step]);
      setSkippedSteps(newSkippedSteps);
      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.delete(step);
      setCompletedSteps(newCompletedSteps);
      if (step < 7) {
        const nextStep = step + 1;
        setCurrentStep(nextStep);
        saveProgress(nextStep, newCompletedSteps, newSkippedSteps, caseId);
      }
    },
    formType: "433b",
  });

  // Load saved progress from localStorage
  const getSavedProgress = () => {
    const savedProgress = storage.get<{
      caseId: string;
      currentStep: number;
      completedSteps: number[];
      skippedSteps: number[];
    }>(`433b_progress`);
    return (
      savedProgress || {
        caseId: null,
        currentStep: 1,
        completedSteps: [],
        skippedSteps: [],
      }
    );
  };

  // On mount, apply local saved progress synchronously when possible to
  // avoid briefly rendering step 1 and then switching.
  useEffect(() => {
    const savedProgress = getSavedProgress();

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
    // otherwise wait for server fetch (hydrated remains false)
  }, []);

  // When caseId becomes available, fetch authoritative section status from server
  useEffect(() => {
    if (!caseId) return;

    (async () => {
      try {
        const resp = await api.get433bSectionInfo(caseId, "sectionStatus");
        const sections = resp?.data || {};

        const sectionOrder: Array<keyof typeof sections | string> = [
          "businessInfo",
          "businessAssetInfo",
          "businessIncomeInfo",
          "businessExpenseInfo",
          "offerCalculationInfo",
          "otherInfo",
          "signaturesAndAttachmentsInfo",
        ];

        const newCompleted: number[] = [];
        const newSkipped: number[] = [];
        for (let i = 0; i < sectionOrder.length; i++) {
          const key = sectionOrder[i];
          const status = sections && sections[key];
          if (status === "completed") {
            newCompleted.push(i + 1);
          } else if (status === "skipped") {
            newSkipped.push(i + 1);
          }
        }

        const firstIncompleteIndex = sectionOrder.findIndex((k) => {
          const status = sections && sections[k];
          return status !== "completed" && status !== "skipped";
        });

        const computedCurrentStep =
          firstIncompleteIndex === -1
            ? sectionOrder.length
            : firstIncompleteIndex + 1;

        setCompletedSteps(new Set(newCompleted));
        setSkippedSteps(new Set(newSkipped));
        setCurrentStep(computedCurrentStep);

        setHydrated(true);

        storage.set("433b_progress", {
          caseId,
          currentStep: computedCurrentStep,
          completedSteps: newCompleted,
          skippedSteps: newSkipped,
        });
      } catch (error) {
        console.error("Failed to fetch 433B section status:", error);
        setHydrated(true);
      }

      // Fetch payment status
      try {
        const paymentResp = await api.get433bSectionInfo(
          caseId,
          "paymentStatus"
        );
        const paymentStatus = paymentResp?.data?.status === "completed";
        if (paymentStatus) {
          setDisableForm(true);
          setViewOnlyMessage(
            "You can only view the completed form but cannot edit it."
          );
        } else {
          setDisableForm(false);
          setViewOnlyMessage("");
        }
      } catch (error) {
        console.error("Failed to fetch payment status:", error);
        setDisableForm(false);
        setViewOnlyMessage("");
      }
    })();
  }, [caseId]);

  // Keep redux slice in sync: if the URL caseId differs from the stored
  // caseId in the slice, update it. The reducer for `setCaseId` will clear
  // stale form data when a new caseId is set.
  const dispatch = useAppDispatch();
  const storedCaseId = useAppSelector((s) => s.form433b.caseId);

  useEffect(() => {
    if (caseId && caseId !== storedCaseId) {
      dispatch(setCaseId(caseId));
    }
  }, [caseId, storedCaseId, dispatch]);

  // Save progress to localStorage
  const saveProgress = (
    step: number,
    completed: Set<number>,
    skipped: Set<number>,
    caseIdToSave?: string | null
  ) => {
    try {
      const progressData = {
        caseId: caseIdToSave || caseId || null,
        currentStep: step,
        completedSteps: Array.from(completed),
        skippedSteps: Array.from(skipped),
      };
      storage.set("433b_progress", progressData);
      console.log("Progress saved to localStorage", progressData);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Clear saved data from localStorage
  const clearSavedData = () => {
    try {
      storage.remove("433b_progress");
      console.log("Saved form data cleared");
    } catch (error) {
      console.error("Error clearing saved data:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep < 7) {
      // Mark current step as completed
      const newSkippedSteps = new Set(skippedSteps);
      newSkippedSteps.delete(currentStep);
      setSkippedSteps(newSkippedSteps);

      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Save progress to localStorage
      saveProgress(nextStep, newCompletedSteps, newSkippedSteps, caseId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      // Save progress to localStorage
      saveProgress(prevStep, completedSteps, skippedSteps, caseId);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed, skipped steps or current step
    if (
      stepNumber <= currentStep ||
      completedSteps.has(stepNumber) ||
      skippedSteps.has(stepNumber)
    ) {
      setCurrentStep(stepNumber);

      // update progress
      saveProgress(stepNumber, completedSteps, skippedSteps, caseId);
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      currentStep,
      totalSteps: 7,
      completedSteps,
    };

    switch (currentStep) {
      case 1:
        return <BusinessInfoSection {...commonProps} />;
      case 2:
        return <BusinessAssetsSection {...commonProps} />;
      case 3:
        return <BusinessIncomeSection {...commonProps} />;
      case 4:
        return <BusinessExpenseSection {...commonProps} />;
      case 5:
        return <CalculationSection {...commonProps} />;
      case 6:
        return <OtherInfoSection {...commonProps} />;
      case 7:
        return <SignatureSection {...commonProps} />;
      default:
        return <BusinessInfoSection {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form 433-B (OIC)
          </h1>
          <p className="text-lg text-gray-600">
            Collection Information Statement for Businesses
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Department of the Treasury — Internal Revenue Service
          </p>
        </div>

        {viewOnlyMessage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
            <p className="font-medium">Form View Only</p>
            <p>{viewOnlyMessage}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
          {/* Stepper Navigation */}
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

          {/* Form Content */}
          <div className="lg:w-3/4 h-full">
            <div className="relative bg-white h-full rounded-lg shadow-sm border border-gray-200 p-6">
              <div
                className={`absolute top-0 right-0 rounded-lg bg-white/50 h-full w-full backdrop-blur-xs ${
                  disableForm || skipping ? "block" : "hidden"
                }`}
              />

              <div className="w-full flex justify-end">
                <Button
                  disabled={skipping}
                  onClick={skipSection}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 transition-all text-white font-medium mb-5"
                >
                  {skipping ? "Skipping..." : "Skip"}
                </Button>
              </div>
              {hydrated ? renderCurrentSection() : <FormLoader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
