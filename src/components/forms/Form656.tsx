"use client";

import { useEffect, useMemo, useState } from "react";
import { FormStepper } from "@/components/forms/form433a-sections/form-stepper";
import { IndividualInfoSection } from "@/components/forms/form-656-sections/individual-info-section";
import { BusinessInfoSection } from "@/components/forms/form-656-sections/business-info-section";
import { ReasonForOfferSection } from "@/components/forms/form-656-sections/reason-for-offer-section";
import { PaymentTermsSection } from "@/components/forms/form-656-sections/payment-terms-section";
import { SourceOfFundsSection } from "@/components/forms/form-656-sections/source-of-funds-section";
import { OfferTermsSection } from "@/components/forms/form-656-sections/offer-terms-section";
import { SignaturesSection } from "@/components/forms/form-656-sections/signatures-section";
import { PaidPreparerSection } from "@/components/forms/form-656-sections/paid-preparer-section";
import { storage } from "@/utils/helper";
import api from "@/lib/services";
import FormLoader from "@/components/global/FormLoader";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCaseId } from "@/lib/features/form656Slice";
import { ApplicationChecklistSection } from "./form-656-sections/application-checklist-section";
import { DesignationEFTPSSection } from "./form-656-sections/designation-eftps-section";

const steps = [
  {
    id: 1,
    title: "Individual Information",
    description:
      "Personal details, tax periods, and low-income certification (Form 1040 filers)",
  },
  {
    id: 2,
    title: "Business Information",
    description: "Details for business tax debt (Form 1120, 1065, etc.)",
  },
  {
    id: 3,
    title: "Reason for Offer",
    description: "Select the basis for your offer in compromise",
  },
  {
    id: 4,
    title: "Payment Terms",
    description: "Payment option and terms",
  },
  {
    id: 5,
    title: "Designation for Application of Payment",
    description: "Designate how to apply payments",
  },
  {
    id: 6,
    title: "Source of Funds, Filing Requirements",
    description: "Explain source and confirm compliance",
  },
  {
    id: 7,
    title: "Offer Terms",
    description: "Review and agree to offer terms",
  },
  {
    id: 8,
    title: "Signatures",
    description: "Sign the form",
  },
  {
    id: 9,
    title: "Paid Preparer Use Only",
    description: "Preparer information if applicable",
  },
  {
    id: 10,
    title: "Application Checklist",
    description: "Review and confirm all requirements",
  },
];

export default function Form656() {
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState<boolean>(false);

  const getSavedProgress = () => {
    const savedProgress = storage.get<{
      caseId: string;
      currentStep: number;
      completedSteps: number[];
    }>(`656_progress`);
    return (
      savedProgress || { caseId: null, currentStep: 1, completedSteps: [] }
    );
  };

  useEffect(() => {
    const savedProgress = getSavedProgress();

    if (!caseId) {
      if (savedProgress.caseId === null) {
        setCurrentStep(savedProgress.currentStep);
        setCompletedSteps(new Set(savedProgress.completedSteps));
      }
      setHydrated(true);
      return;
    }

    if (savedProgress.caseId === caseId) {
      setCurrentStep(savedProgress.currentStep);
      setCompletedSteps(new Set(savedProgress.completedSteps));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!caseId) return;

    (async () => {
      try {
        const resp = await api.get656SectionInfo(caseId, "sectionStatus");
        const sections = resp?.data || {};

        const sectionOrder: Array<keyof typeof sections | string> = [
          "individualInfo",
          "businessInfo",
          "reasonForOfferInfo",
          "paymentTermsInfo",
          "designationAndEftpsInfo",
          "sourceOfFundsAndRequirementsInfo",
          "sourceOfFundsAndRequirementsInfo",
          "signaturesInfo",
          "paidPreparerUseOnlyInfo",
          "applicationChecklistInfo",
        ];

        const newCompleted: number[] = [];
        for (let i = 0; i < sectionOrder.length; i++) {
          const key = sectionOrder[i];
          if (sections && sections[key]) {
            newCompleted.push(i + 1);
          }
        }

        const firstIncompleteIndex = sectionOrder.findIndex(
          (k) => !(sections && sections[k])
        );

        const computedCurrentStep =
          firstIncompleteIndex === -1
            ? sectionOrder.length
            : firstIncompleteIndex + 1;

        setCompletedSteps(new Set(newCompleted));
        setCurrentStep(computedCurrentStep);

        setHydrated(true);

        storage.set("656_progress", {
          caseId,
          currentStep: computedCurrentStep,
          completedSteps: newCompleted,
        });
      } catch (error) {
        console.error("Failed to fetch 656 section status:", error);
        setHydrated(true);
      }
    })();
  }, [caseId]);

  const dispatch = useAppDispatch();
  const storedCaseId = useAppSelector((s) => s.form656.caseId);

  useEffect(() => {
    if (caseId && caseId !== storedCaseId) {
      dispatch(setCaseId(caseId));
    }
  }, [caseId, storedCaseId, dispatch]);

  const saveProgress = (
    step: number,
    completed: Set<number>,
    caseIdToSave?: string | null
  ) => {
    try {
      const progressData = {
        caseId: caseIdToSave || caseId || null,
        currentStep: step,
        completedSteps: Array.from(completed),
      };
      storage.set("656_progress", progressData);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep, newCompletedSteps, caseId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep, completedSteps, caseId);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);
      saveProgress(stepNumber, completedSteps, caseId);
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      currentStep,
      totalSteps: steps.length,
    };

    switch (currentStep) {
      case 1:
        return <IndividualInfoSection {...commonProps} />;
      case 2:
        return <BusinessInfoSection {...commonProps} />;
      case 3:
        return <ReasonForOfferSection {...commonProps} />;
      case 4:
        return <PaymentTermsSection {...commonProps} />;
      case 5:
        return <DesignationEFTPSSection {...commonProps} />;
      case 6:
        return <SourceOfFundsSection {...commonProps} />;
      case 7:
        return <OfferTermsSection {...commonProps} />;
      case 8:
        return <SignaturesSection {...commonProps} />;
      case 9:
        return <PaidPreparerSection {...commonProps} />;
      case 10:
        return <ApplicationChecklistSection {...commonProps} />;
      default:
        return <IndividualInfoSection {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form 656</h1>
          <p className="text-lg text-gray-600">Offer in Compromise</p>
          <p className="text-sm text-gray-500 mt-2">
            Department of the Treasury — Internal Revenue Service
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
          <div className="lg:w-1/4">
            {hydrated ? (
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
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
              {hydrated ? renderCurrentSection() : <FormLoader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
