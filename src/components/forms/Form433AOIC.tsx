"use client";

import { useState } from "react";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { completeFormSchema } from "@/lib/validation-schemas";

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
    title: "Business Income",
    description: "Business income and expenses",
  },
  {
    id: 7,
    title: "Household Income",
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
  const [currentStep, setCurrentStep] = useState(3);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const methods = useForm<FormData433A>({
    resolver: zodResolver(completeFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      ssn: "",
      maritalStatus: "unmarried",
      marriageDate: "",
      homeAddress: "",
      homeOwnership: "own",
      homeOwnershipOther: "",
      communityPropertyState: false,
      county: "",
      primaryPhone: "",
      secondaryPhone: "",
      faxNumber: "",
      mailingAddress: "",
      spouseFirstName: "",
      spouseLastName: "",
      spouseDateOfBirth: "",
      spouseSSN: "",
      householdMembers: [],
      employerName: "",
      payPeriod: "weekly",
      employerAddress: "",
      ownershipInterest: false,
      occupation: "",
      employmentYears: "",
      employmentMonths: "",
      spouseEmployerName: "",
      spousePayPeriod: "weekly",
      spouseEmployerAddress: "",
      spouseOwnershipInterest: false,
      spouseOccupation: "",
      spouseEmploymentYears: "",
      spouseEmploymentMonths: "",
    },
  });

  const {
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData433A)[] = [];

    switch (currentStep) {
      case 1: // Personal Info
        fieldsToValidate = [
          "firstName",
          "lastName",
          "dateOfBirth",
          "ssn",
          "maritalStatus",
          "homeAddress",
          "homeOwnership",
          "county",
          "primaryPhone",
        ];
        const maritalStatus = getValues("maritalStatus");
        if (maritalStatus === "married") {
          fieldsToValidate.push(
            "marriageDate",
            "spouseFirstName",
            "spouseLastName",
            "spouseDateOfBirth",
            "spouseSSN"
          );
        }
        const homeOwnership = getValues("homeOwnership");
        if (homeOwnership === "other") {
          fieldsToValidate.push("homeOwnershipOther");
        }
        break;

      case 2: // Employment
        fieldsToValidate = [
          "employerName",
          "payPeriod",
          "employerAddress",
          "occupation",
          "employmentYears",
          "employmentMonths",
        ];
        if (getValues("maritalStatus") === "married") {
          fieldsToValidate.push(
            "spouseEmployerName",
            "spousePayPeriod",
            "spouseEmployerAddress",
            "spouseOccupation",
            "spouseEmploymentYears",
            "spouseEmploymentMonths"
          );
        }
        break;

      case 3: // Personal Assets
        fieldsToValidate = [
          "bankAccounts",
          "realEstate",
          "vehicles",
          "investments",
          "retirementAccounts",
        ];
        break;

      case 4: // Self-Employed Info
        fieldsToValidate = [
          "businessName",
          "businessAddress",
          "businessType",
          "ein",
          "yearsInBusiness",
        ];
        break;

      case 5: // Business Assets
        fieldsToValidate = [
          "businessBankAccounts",
          "businessVehicles",
          "businessRealEstate",
          "businessInventory",
          "businessEquipment",
        ];
        break;

      case 6: // Business Income
        fieldsToValidate = ["grossReceipts", "businessExpenses", "netIncome"];
        break;

      case 7: // Household Income
        fieldsToValidate = ["wages", "otherIncome", "monthlyExpenses"];
        break;

      case 8: // Calculations
        fieldsToValidate = ["minimumOfferAmount"];
        break;

      case 9: // Other Information
        fieldsToValidate = [
          "previousBankruptcy",
          "lawsuits",
          "trusts",
          "otherFederalDebts",
        ];
        break;

      case 10: // Signatures
        fieldsToValidate = ["taxpayerSignature", "taxpayerSignatureDate"];
        if (getValues("maritalStatus") === "married") {
          fieldsToValidate.push("spouseSignature", "spouseSignatureDate");
        }
        break;

      default:
        return true;
    }

    const isValid = await trigger(fieldsToValidate);
    console.log("Step validation result:", isValid);
    if (!isValid) {
      console.log("Validation errors:", errors);
      console.log("Form validation failed");
    }
    return isValid;
  };

  const handleNext = async () => {
    console.log("Next runs");
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 10) {
      // Mark current step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
      methods.clearErrors();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      methods.clearErrors();
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);
      methods.clearErrors();
    }
  };

  const handleSubmit = async () => {
    // Validate current step before submission
    const isValid = await validateCurrentStep();

    if (isValid) {
      const formData = getValues();
      console.log("Form submitted:", formData);
      alert("Form submitted successfully! (This is a demo)");
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSubmit: handleSubmit,
      currentStep,
      totalSteps: 10,
      validateStep: validateCurrentStep,
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
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Form 433-A (OIC)
            </h1>
            <p className="text-lg text-gray-600">
              Collection Information Statement for Wage Earners and
              Self-Employed Individuals
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Department of the Treasury — Internal Revenue Service
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {renderCurrentSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
