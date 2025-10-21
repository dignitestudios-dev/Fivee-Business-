"use client";

import { useEffect, useMemo, useState } from "react";
import { FormStepper } from "@/components/forms/form433a-sections/form-stepper"; // Reuse if possible, or create similar for 433B
import { BusinessInfoSection } from "@/components/forms/form433b-sections/business-info-section"; // We'll create this
// Import other sections as you create them, e.g.:
// import { BusinessAssetSection } from "@/components/forms/form433b-sections/business-asset-section";
// etc.
import { storage } from "@/utils/helper";
import { useSearchParams } from "next/navigation";
import { BusinessAssetsSection } from "./form433b-sections/business-asset-section";
import { BusinessIncomeSection } from "./form433b-sections/business-income-section";

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

  useEffect(() => {
    if (!caseId) {
      clearSavedData();
    }
  }, [caseId]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Load saved progress from localStorage
  const getSavedProgress = () => {
    const savedProgress = storage.get<{
      currentStep: number;
      completedSteps: number[];
    }>("433b_progress");
    return savedProgress || { currentStep: 1, completedSteps: [] };
  };

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = getSavedProgress();
    setCurrentStep(savedProgress.currentStep);
    setCompletedSteps(new Set(savedProgress.completedSteps));
  }, []);

  // Save progress to localStorage
  const saveProgress = (step: number, completed: Set<number>) => {
    try {
      const progressData = {
        currentStep: step,
        completedSteps: Array.from(completed),
      };
      storage.set("433b_progress", progressData);
      console.log("Progress saved to localStorage");
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
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Save progress to localStorage
      saveProgress(nextStep, newCompletedSteps);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      // Save progress to localStorage
      saveProgress(prevStep, completedSteps);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);

      // update progress
      saveProgress(stepNumber, completedSteps);
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      currentStep,
      totalSteps: 7,
    };

    switch (currentStep) {
      case 1:
        return <BusinessInfoSection {...commonProps} />;
      case 2:
        return <BusinessAssetsSection {...commonProps} />;
      case 3:
        return <BusinessIncomeSection {...commonProps} />;
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

        <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
          {/* Stepper Navigation */}
          <div className="lg:w-1/4">
            <FormStepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form Content */}
          <div className="lg:w-3/4 h-full">
            <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 p-6">
              {renderCurrentSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
