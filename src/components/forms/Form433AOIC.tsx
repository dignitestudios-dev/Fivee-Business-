"use client";

import { useEffect, useMemo, useState } from "react";
import { FormStepper } from "@/components/forms/form433a-sections/form-stepper";
import { PersonalInfoSection } from "@/components/forms/form433a-sections/personal-info-section";
import { EmploymentSection } from "@/components/forms/form433a-sections/employment-section";
import { PersonalAssetsSection } from "@/components/forms/form433a-sections/personal-assets-section";
import { SelfEmployedSection } from "@/components/forms/form433a-sections/self-employed-section";
import { BusinessAssetsSection } from "@/components/forms/form433a-sections/business-assets-section";
import { BusinessIncomeSection } from "@/components/forms/form433a-sections/business-income-section";
import { HouseholdIncomeSection } from "@/components/forms/form433a-sections/household-income-section";
import { CalculationSection } from "@/components/forms/form433a-sections/calculation-section";
import { OtherInfoSection } from "@/components/forms/form433a-sections/other-info-section";
import { SignatureSection } from "@/components/forms/form433a-sections/signature-section";
import { storage } from "@/utils/helper";
import api from "@/lib/services";
import FormLoader from "@/components/global/FormLoader";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCaseId } from "@/lib/features/form433aSlice";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/Button";
import useSkipSection from "@/hooks/useSkipSection";

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic personal and household details",
  },
  {
    id: 2,
    title: "Employment",
    description: "Employment information for wage earners",
  },
  {
    id: 3,
    title: "Personal Assets",
    description: "Domestic and foreign assets",
  },
  {
    id: 4,
    title: "Self-Employed Info",
    description: "Business information if applicable",
  },
  {
    id: 5,
    title: "Business Assets",
    description: "Business asset information",
  },
  {
    id: 6,
    title: "Business Income and Expense",
    description: "Business income and expenses",
  },
  {
    id: 7,
    title: "Household Income and Expenses",
    description: "Monthly household income and expenses",
  },
  {
    id: 8,
    title: "Calculations",
    description: "Calculate minimum offer amount",
  },
  {
    id: 9,
    title: "Other Information",
    description: "Additional required information",
  },
  {
    id: 10,
    title: "Signatures",
    description: "Final signatures and submission",
  },
];

export default function Form433AOIC() {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

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
      if (step < 10) {
        const nextStep = step + 1;
        setCurrentStep(nextStep);
        saveProgress(nextStep, completedSteps, newSkippedSteps, caseId);
      }
    },
    formType: "433a",
  });

  // Load saved progress from localStorage
  const getSavedProgress = () => {
    const savedProgress = storage.get<{
      caseId: string | null;
      currentStep: number;
      completedSteps: number[];
      skippedSteps: number[];
    }>("433a_progress");
    return (
      savedProgress || { caseId: null, currentStep: 1, completedSteps: [], skippedSteps: [] }
    );
  };

  // When a caseId becomes available, try to hydrate progress from server
  // and fall back to localStorage. Do NOT clear localStorage when caseId
  // is temporarily undefined (first render).
  useEffect(() => {
    if (!caseId) return; // wait until a real caseId is available

    const savedProgress = getSavedProgress();

    // If user has local saved progress for this case, use it optimistically
    if (savedProgress.caseId === caseId) {
      setCurrentStep(savedProgress.currentStep);
      setCompletedSteps(new Set(savedProgress.completedSteps));
      setSkippedSteps(new Set(savedProgress.skippedSteps || []));
    }

    // Now ask server for authoritative section completion status
    (async () => {
      try {
        const resp = await api.get433aSectionInfo(caseId, "sectionStatus");
        const sections = resp?.data || {};

        // Map the API keys to form step numbers in the same order as `steps`
        const sectionOrder: Array<keyof typeof sections | string> = [
          "personalInfo",
          "employmentInfo",
          "assetsInfo",
          "selfEmployedInfo",
          "businessInfo",
          "businessIncomeExpenseInfo",
          "householdIncomeExpenseInfo",
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

        const firstIncompleteIndex = sectionOrder.findIndex(
          (k) => {
            const status = sections && sections[k];
            return status !== "completed" && status !== "skipped";
          }
        );

        const computedCurrentStep =
          firstIncompleteIndex === -1
            ? sectionOrder.length
            : firstIncompleteIndex + 1;

        setCompletedSteps(new Set(newCompleted));
        setSkippedSteps(new Set(newSkipped));
        setCurrentStep(computedCurrentStep);

        // mark hydrated after applying server state
        setHydrated(true);

        // persist authoritative progress (include caseId)
        storage.set("433a_progress", {
          caseId,
          currentStep: computedCurrentStep,
          completedSteps: newCompleted,
          skippedSteps: newSkipped,
        });
      } catch (error) {
        // If API fails, we already applied optimistic local progress above.
        console.error("Failed to fetch section status:", error);
        // still mark hydrated so UI can render using optimistic/local state
        setHydrated(true);
      }

      // Fetch payment status
      try {
        const paymentResp = await api.get433aSectionInfo(
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

  // On mount, try to apply local saved progress synchronously so we avoid
  // briefly rendering step 1 and then switching. If there's no local
  // progress for a caseId we will wait for the server (hydrated stays false
  // until the [caseId] effect completes).
  useEffect(() => {
    const savedProgress = getSavedProgress();

    // If no caseId in URL, apply any saved progress whose caseId is null
    if (!caseId) {
      if (savedProgress.caseId === null) {
        setCurrentStep(savedProgress.currentStep);
        setCompletedSteps(new Set(savedProgress.completedSteps));
        setSkippedSteps(new Set(savedProgress.skippedSteps || []));
      }
      setHydrated(true);
      return;
    }

    // If there's local progress for this caseId, apply it optimistically and
    // show the UI while we fetch authoritative state in the [caseId] effect.
    if (savedProgress.caseId === caseId) {
      setCurrentStep(savedProgress.currentStep);
      setCompletedSteps(new Set(savedProgress.completedSteps));
      setSkippedSteps(new Set(savedProgress.skippedSteps || []));
      setHydrated(true);
    }
    // Otherwise we intentionally wait for the server before rendering
    // (hydrated remains false until the server response resolves).
  }, []);

  // Keep redux slice in sync: if the URL caseId differs from the stored
  // caseId in the slice, update it. The reducer for `setCaseId` will clear
  // stale form data when a new caseId is set.
  const dispatch = useAppDispatch();
  const storedCaseId = useAppSelector((s) => s.form433a.caseId);

  useEffect(() => {
    // Only act when we have a concrete caseId (string) from params
    if (caseId && caseId !== storedCaseId) {
      dispatch(setCaseId(caseId));
    }
    // If there's no caseId in the URL but the store has one, we don't
    // automatically clear the store here — leave that behavior to
    // explicit navigation actions. Adjust if you'd like a different UX.
  }, [caseId, storedCaseId, dispatch]);

  // Save progress to localStorage (include caseId so progress is tied to a case)
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
      storage.set("433a_progress", progressData);
      console.log("Progress saved to localStorage", progressData);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Clear saved data from localStorage
  const clearSavedData = () => {
    try {
      storage.remove("433a_progress");
      console.log("Saved form data cleared");
    } catch (error) {
      console.error("Error clearing saved data:", error);
    }
  };

  const handleNext = async (employmentStatus: string = "") => {
    console.log("Next runs");

    if (currentStep < 10) {
      if (employmentStatus === "self") {
        // Mark current step as completed
        const newCompletedSteps = new Set([...completedSteps, 5, 6, 7]);
        setCompletedSteps(newCompletedSteps);
        const nextStep = currentStep + 3;
        setCurrentStep(nextStep);

        // Save progress to localStorage
        saveProgress(nextStep, newCompletedSteps, skippedSteps, caseId);
      } else {
        // Mark current step as completed
        const newCompletedSteps = new Set([...completedSteps, currentStep]);
        setCompletedSteps(newCompletedSteps);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        // Save progress to localStorage
        saveProgress(nextStep, newCompletedSteps, skippedSteps, caseId);
      }
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
    if (stepNumber <= currentStep || completedSteps.has(stepNumber) || skippedSteps.has(stepNumber)) {
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
      totalSteps: 10,
      paymentStatus: disableForm
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoSection {...commonProps} />;
      case 2:
        return <EmploymentSection {...commonProps} />;
      case 3:
        return <PersonalAssetsSection {...commonProps} />;
      case 4:
        return <SelfEmployedSection {...commonProps} />;
      case 5:
        return <BusinessAssetsSection {...commonProps} />;
      case 6:
        return <BusinessIncomeSection {...commonProps} />;
      case 7:
        return <HouseholdIncomeSection {...commonProps} />;
      case 8:
        return <CalculationSection {...commonProps} />;
      case 9:
        return <OtherInfoSection {...commonProps} />;
      case 10:
        return <SignatureSection {...commonProps} />;
      default:
        return <PersonalInfoSection {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form 433-A (OIC)
          </h1>
          <p className="text-lg text-gray-600">
            Collection Information Statement for Wage Earners and Self-Employed
            Individuals
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
                className={`absolute top-0 right-0 rounded-lg bg-white/50 h-full w-full ${
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
