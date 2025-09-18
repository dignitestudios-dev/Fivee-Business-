// "use client";

// import { useState } from "react";
// import { FormStepper } from "@/components/forms/form433a-sections/form-stepper";
// import { PersonalInfoSection } from "@/components/forms/form433a-sections/personal-info-section";
// import { EmploymentSection } from "@/components/forms/form433a-sections/employment-section";
// import { PersonalAssetsSection } from "@/components/forms/form433a-sections/personal-assets-section";
// import { SelfEmployedSection } from "@/components/forms/form433a-sections/self-employed-section";
// import { BusinessAssetsSection } from "@/components/forms/form433a-sections/business-assets-section";
// import { BusinessIncomeSection } from "@/components/forms/form433a-sections/business-income-section";
// import { HouseholdIncomeSection } from "@/components/forms/form433a-sections/household-income-section";
// import { CalculationSection } from "@/components/forms/form433a-sections/calculation-section";
// import { OtherInfoSection } from "@/components/forms/form433a-sections/other-info-section";
// import { SignatureSection } from "@/components/forms/form433a-sections/signature-section";

// export interface FormData {
//   // Personal Information
//   firstName: string;
//   lastName: string;
//   dateOfBirth: string;
//   ssn: string;
//   maritalStatus: "unmarried" | "married";
//   marriageDate: string;
//   homeAddress: string;
//   homeOwnership: "own" | "rent" | "other";
//   homeOwnershipOther: string;
//   communityPropertyState: boolean;
//   county: string;
//   primaryPhone: string;
//   secondaryPhone: string;
//   faxNumber: string;
//   mailingAddress: string;

//   // Spouse Information
//   spouseFirstName: string;
//   spouseLastName: string;
//   spouseDateOfBirth: string;
//   spouseSSN: string;

//   // Household Members
//   householdMembers: Array<{
//     name: string;
//     age: string;
//     relationship: string;
//     claimedAsDependent: boolean;
//     contributesToIncome: boolean;
//   }>;

//   // Employment Information
//   employerName: string;
//   payPeriod: "weekly" | "bi-weekly" | "monthly" | "other";
//   employerAddress: string;
//   ownershipInterest: boolean;
//   occupation: string;
//   employmentYears: string;
//   employmentMonths: string;

//   spouseEmployerName: string;
//   spousePayPeriod: "weekly" | "bi-weekly" | "monthly" | "other";
//   spouseEmployerAddress: string;
//   spouseOwnershipInterest: boolean;
//   spouseOccupation: string;
//   spouseEmploymentYears: string;
//   spouseEmploymentMonths: string;

//   // Assets and other sections will be added as we progress
//   [key: string]: any;
// }

// const steps = [
//   {
//     id: 1,
//     title: "Personal Information",
//     description: "Basic personal and household details",
//   },
//   {
//     id: 2,
//     title: "Employment",
//     description: "Employment information for wage earners",
//   },
//   {
//     id: 3,
//     title: "Personal Assets",
//     description: "Domestic and foreign assets",
//   },
//   {
//     id: 4,
//     title: "Self-Employed Info",
//     description: "Business information if applicable",
//   },
//   {
//     id: 5,
//     title: "Business Assets",
//     description: "Business asset information",
//   },
//   {
//     id: 6,
//     title: "Business Income",
//     description: "Business income and expenses",
//   },
//   {
//     id: 7,
//     title: "Household Income",
//     description: "Monthly household income and expenses",
//   },
//   {
//     id: 8,
//     title: "Calculations",
//     description: "Calculate minimum offer amount",
//   },
//   {
//     id: 9,
//     title: "Other Information",
//     description: "Additional required information",
//   },
//   {
//     id: 10,
//     title: "Signatures",
//     description: "Final signatures and submission",
//   },
// ];

// export default function IRSForm433A() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     ssn: "",
//     maritalStatus: "unmarried",
//     marriageDate: "",
//     homeAddress: "",
//     homeOwnership: "own",
//     homeOwnershipOther: "",
//     communityPropertyState: false,
//     county: "",
//     primaryPhone: "",
//     secondaryPhone: "",
//     faxNumber: "",
//     mailingAddress: "",
//     spouseFirstName: "",
//     spouseLastName: "",
//     spouseDateOfBirth: "",
//     spouseSSN: "",
//     householdMembers: [],
//   });

//   const updateFormData = (updates: Partial<FormData>) => {
//     setFormData((prev) => ({ ...prev, ...updates }));
//   };

//   const handleNext = () => {
//     if (currentStep < 10) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = () => {
//     // Handle form submission
//     console.log("Form submitted:", formData);
//     alert("Form submitted successfully! (This is a demo)");
//   };

//   const renderCurrentSection = () => {
//     const commonProps = {
//       formData,
//       updateFormData,
//       onNext: handleNext,
//       onPrevious: handlePrevious,
//       onSubmit: handleSubmit,
//       currentStep,
//       totalSteps: 10,
//     };

//     switch (currentStep) {
//       case 1:
//         return <PersonalInfoSection {...commonProps} />;
//       case 2:
//         return <EmploymentSection {...commonProps} />;
//       case 3:
//         return <PersonalAssetsSection {...commonProps} />;
//       case 4:
//         return <SelfEmployedSection {...commonProps} />;
//       case 5:
//         return <BusinessAssetsSection {...commonProps} />;
//       case 6:
//         return <BusinessIncomeSection {...commonProps} />;
//       case 7:
//         return <HouseholdIncomeSection {...commonProps} />;
//       case 8:
//         return <CalculationSection {...commonProps} />;
//       case 9:
//         return <OtherInfoSection {...commonProps} />;
//       case 10:
//         return <SignatureSection {...commonProps} />;
//       default:
//         return <PersonalInfoSection {...commonProps} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Form 433-A (OIC)
//           </h1>
//           <p className="text-lg text-gray-600">
//             Collection Information Statement for Wage Earners and Self-Employed
//             Individuals
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             Department of the Treasury — Internal Revenue Service
//           </p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Stepper Navigation */}
//           <div className="lg:w-1/4">
//             <FormStepper
//               steps={steps}
//               currentStep={currentStep}
//               onStepClick={setCurrentStep}
//             />
//           </div>

//           {/* Form Content */}
//           <div className="lg:w-3/4">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               {renderCurrentSection()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

const TaxForm = () => {
  return <div>TaxForm</div>;
};

export default TaxForm;
