// Fixed Form433AOIC.tsx - Key changes for conditional validation

"use client";

import { useEffect, useState } from "react";
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
import { storage } from "@/utils/helper";

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

const defaultValues = {
  firstName: "",
  lastName: "",
  dob: "",
  ssnOrItin: "",
  maritalStatus: "unmarried" as const,
  dateOfMarriage: "",
  homeAddress: "",
  housingStatus: "own" as const,
  housingOtherDetails: "",
  livedInCommunityPropertyStateInLast10Years: false,
  countyOfResidence: "",
  primaryPhone: "",
  secondaryPhone: "",
  faxNumber: "",
  mailingAddress: "",
  spouseFirstName: "",
  spouseLastName: "",
  spouseDOB: "",
  spouseSSN: "",
  householdMembers: [],
  employerName: "",
  payPeriod: "weekly" as const,
  employerAddress: "",
  hasOwnershipInterest: false,
  jobTitle: "",
  yearsWithEmployer: "",
  monthsWithEmployer: "",
  spouseEmployerName: "",
  spousePayPeriod: "weekly" as const,
  spouseEmployerAddress: "",
  spouseHasOwnershipInterest: false,
  spouseJobTitle: "",
  spouseYearsWithEmployer: "",
  spouseMonthsWithEmployer: "",
};

export default function Form433AOIC() {
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Load saved progress from localStorage
  const getSavedProgress = () => {
    const savedProgress = storage.get<{
      currentStep: number;
      completedSteps: number[];
    }>("433a_progress");
    return savedProgress || { currentStep: 1, completedSteps: [] };
  };

  const methods = useForm<FormData433A>({
    resolver: zodResolver(completeFormSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const {
    trigger,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = methods;

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
      storage.set("433a_progress", progressData);
      console.log("Progress saved to localStorage");
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

  const validateCurrentStep = async (): Promise<boolean> => {
    console.log("current step validation runs:");
    // Clear previous errors
    clearErrors();

    let fieldsToValidate: (keyof FormData433A)[] = [];
    let isValid = true;

    switch (currentStep) {
      case 1: // Personal Info
        // First validate basic required fields
        fieldsToValidate = [
          "firstName",
          "lastName",
          "dob",
          "ssnOrItin",
          "maritalStatus",
          "homeAddress",
          "housingStatus",
          "countyOfResidence",
          "primaryPhone",
        ];

        // Validate basic fields first
        const basicValidation1 = await trigger(fieldsToValidate);
        isValid = basicValidation1;

        const maritalStatus = getValues("maritalStatus");
        const housingStatus = getValues("housingStatus");
        const householdMembers = getValues("householdMembers") || [];

        // Validate household members if any exist
        if (householdMembers.length > 0) {
          householdMembers.forEach((member: any, index: number) => {
            // Check if name is empty
            if (!member.name || member.name.trim() === "") {
              setError(`householdMembers.${index}.name`, {
                type: "required",
                message: "Name is required",
              });
              isValid = false;
            }

            // Check if age is empty
            if (!member.age || member.age.trim() === "") {
              setError(`householdMembers.${index}.age`, {
                type: "required",
                message: "Age is required",
              });
              isValid = false;
            } else if (!/^\d+$/.test(member.age)) {
              setError(`householdMembers.${index}.age`, {
                type: "pattern",
                message: "Age must be a number",
              });
              isValid = false;
            }

            // Check if relationship is empty
            if (!member.relationship || member.relationship.trim() === "") {
              setError(`householdMembers.${index}.relationship`, {
                type: "required",
                message: "Relationship is required",
              });
              isValid = false;
            }
          });

          // Also trigger validation for household member fields that have values
          const householdFieldsToValidate: (keyof FormData433A)[] = [];
          householdMembers.forEach((member: any, index: number) => {
            if (member.name && member.name.trim() !== "") {
              householdFieldsToValidate.push(
                `householdMembers.${index}.name` as keyof FormData433A
              );
            }
            if (member.age && member.age.trim() !== "") {
              householdFieldsToValidate.push(
                `householdMembers.${index}.age` as keyof FormData433A
              );
            }
            if (member.relationship && member.relationship.trim() !== "") {
              householdFieldsToValidate.push(
                `householdMembers.${index}.relationship` as keyof FormData433A
              );
            }
          });

          if (householdFieldsToValidate.length > 0) {
            const householdValidation = await trigger(
              householdFieldsToValidate
            );
            isValid = isValid && householdValidation;
          }
        }

        // Add conditional validation for spouse fields
        if (maritalStatus === "married") {
          const spouseFirstName = getValues("spouseFirstName");
          const spouseLastName = getValues("spouseLastName");
          const spouseDOB = getValues("spouseDOB");
          const spouseSSN = getValues("spouseSSN");
          const dateOfMarriage = getValues("dateOfMarriage");

          if (!spouseFirstName || spouseFirstName.trim() === "") {
            setError("spouseFirstName", {
              type: "required",
              message: "Spouse's first name is required",
            });
            isValid = false;
          }

          if (!spouseLastName || spouseLastName.trim() === "") {
            setError("spouseLastName", {
              type: "required",
              message: "Spouse's last name is required",
            });
            isValid = false;
          }

          if (!spouseDOB || spouseDOB.trim() === "") {
            setError("spouseDOB", {
              type: "required",
              message: "Spouse's date of birth is required",
            });
            isValid = false;
          }

          if (!spouseSSN || spouseSSN.trim() === "") {
            setError("spouseSSN", {
              type: "required",
              message: "Spouse's SSN is required",
            });
            isValid = false;
          }

          if (!dateOfMarriage || dateOfMarriage.trim() === "") {
            setError("dateOfMarriage", {
              type: "required",
              message: "Marriage date is required",
            });
            isValid = false;
          }

          // Validate spouse fields that have values for format/pattern
          const spouseFieldsToValidate: (keyof FormData433A)[] = [];
          if (spouseFirstName) spouseFieldsToValidate.push("spouseFirstName");
          if (spouseLastName) spouseFieldsToValidate.push("spouseLastName");
          if (spouseDOB) spouseFieldsToValidate.push("spouseDOB");
          if (spouseSSN) spouseFieldsToValidate.push("spouseSSN");
          if (dateOfMarriage) spouseFieldsToValidate.push("dateOfMarriage");

          if (spouseFieldsToValidate.length > 0) {
            const spouseValidation = await trigger(spouseFieldsToValidate);
            isValid = isValid && spouseValidation;
          }
        }

        // Add conditional validation for home ownership
        if (housingStatus === "other") {
          const housingOtherDetails = getValues("housingOtherDetails");
          if (!housingOtherDetails || housingOtherDetails.trim() === "") {
            setError("housingOtherDetails", {
              type: "required",
              message: "Please specify other home ownership type",
            });
            isValid = false;
          } else {
            // Validate format if value exists
            const otherValidation = await trigger(["housingOtherDetails"]);
            isValid = isValid && otherValidation;
          }
        }

        console.log("fieldsToValidate: ", fieldsToValidate);
        break;

      case 2: // Employment
        // First validate basic required fields
        fieldsToValidate = [
          "employerName",
          "payPeriod",
          "employerAddress",
          "jobTitle",
          "yearsWithEmployer",
          "monthsWithEmployer",
        ];

        // Validate basic fields first
        const basicValidation2 = await trigger(fieldsToValidate);
        isValid = basicValidation2;

        const currentMaritalStatus = getValues("maritalStatus");
        if (currentMaritalStatus === "married") {
          // Manual validation for spouse employment fields
          const spouseEmployerName = getValues("spouseEmployerName");
          const spouseEmployerAddress = getValues("spouseEmployerAddress");
          const spouseJobTitle = getValues("spouseJobTitle");
          const spouseYearsWithEmployer = getValues("spouseYearsWithEmployer");
          const spouseMonthsWithEmployer = getValues(
            "spouseMonthsWithEmployer"
          );

          if (!spouseEmployerName || spouseEmployerName.trim() === "") {
            setError("spouseEmployerName", {
              type: "required",
              message: "Spouse's employer name is required",
            });
            isValid = false;
          }

          if (!spouseEmployerAddress || spouseEmployerAddress.trim() === "") {
            setError("spouseEmployerAddress", {
              type: "required",
              message: "Spouse's employer address is required",
            });
            isValid = false;
          }

          if (!spouseJobTitle || spouseJobTitle.trim() === "") {
            setError("spouseJobTitle", {
              type: "required",
              message: "Spouse's occupation is required",
            });
            isValid = false;
          }

          if (
            spouseYearsWithEmployer === "" ||
            spouseYearsWithEmployer === undefined ||
            spouseYearsWithEmployer === null
          ) {
            setError("spouseYearsWithEmployer", {
              type: "required",
              message: "Spouse's employment years is required",
            });
            isValid = false;
          }

          if (
            spouseMonthsWithEmployer === "" ||
            spouseMonthsWithEmployer === undefined ||
            spouseMonthsWithEmployer === null
          ) {
            setError("spouseMonthsWithEmployer", {
              type: "required",
              message: "Spouse's employment months is required",
            });
            isValid = false;
          }

          if (
            spouseMonthsWithEmployer !== "" &&
            Number(spouseMonthsWithEmployer) > 11
          ) {
            console.log("spouse month more than 11");
            setError("spouseMonthsWithEmployer", {
              type: "max",
              message: "Months must be 11 or less",
            });
            isValid = false;
          }

          // Validate spouse fields that have values for format/pattern
          const spouseEmploymentFieldsToValidate: (keyof FormData433A)[] = [];
          if (spouseEmployerName && spouseEmployerName.trim() !== "")
            spouseEmploymentFieldsToValidate.push("spouseEmployerName");
          if (spouseEmployerAddress && spouseEmployerAddress.trim() !== "")
            spouseEmploymentFieldsToValidate.push("spouseEmployerAddress");
          if (spouseJobTitle && spouseJobTitle.trim() !== "")
            spouseEmploymentFieldsToValidate.push("spouseJobTitle");
          if (
            spouseYearsWithEmployer !== "" &&
            spouseYearsWithEmployer !== undefined
          )
            spouseEmploymentFieldsToValidate.push("spouseYearsWithEmployer");

          if (spouseEmploymentFieldsToValidate.length > 0) {
            const spouseEmploymentValidation = await trigger(
              spouseEmploymentFieldsToValidate
            );
            isValid = isValid && spouseEmploymentValidation;
          }
        }
        break;

      case 3: // Personal Assets
        // Validate bank accounts
        const bankAccounts = getValues("bankAccounts") || [];
        console.log("bankAccounts: ", bankAccounts);
        if (bankAccounts.length > 0) {
          bankAccounts.forEach((account: any, index: number) => {
            if (!account.accountType || account.accountType.trim() === "") {
              setError(`bankAccounts.${index}.accountType`, {
                type: "required",
                message: "Account type is required",
              });
              isValid = false;
            }

            if (!account.bankName || account.bankName.trim() === "") {
              setError(`bankAccounts.${index}.bankName`, {
                type: "required",
                message: "Bank name is required",
              });
              isValid = false;
            }

            if (
              !account.countryLocation ||
              account.countryLocation.trim() === ""
            ) {
              setError(`bankAccounts.${index}.countryLocation`, {
                type: "required",
                message: "Bank country location is required",
              });
              isValid = false;
            }

            if (!account.accountNumber || account.accountNumber.trim() === "") {
              setError(`bankAccounts.${index}.accountNumber`, {
                type: "required",
                message: "Account number is required",
              });
              isValid = false;
            }

            if (
              account.balance == null ||
              isNaN(account.balance) ||
              account.balance < 0
            ) {
              setError(`bankAccounts.${index}.balance`, {
                type: "required",
                message: "Balance is required and cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate investment accounts (UPDATED: investmentAccounts instead of investments)
        const investmentAccounts = getValues("investmentAccounts") || [];
        if (investmentAccounts.length > 0) {
          investmentAccounts.forEach((inv: any, index: number) => {
            if (!inv.investmentType || inv.investmentType.trim() === "") {
              setError(`investmentAccounts.${index}.investmentType`, {
                type: "required",
                message: "Investment type is required",
              });
              isValid = false;
            }

            if (
              inv.investmentType === "other" &&
              (!inv.investmentTypeText || inv.investmentTypeText.trim() === "")
            ) {
              setError(`investmentAccounts.${index}.investmentTypeText`, {
                type: "required",
                message: "Details is required for other investment type",
              });
              isValid = false;
            }

            if (!inv.institutionName || inv.institutionName.trim() === "") {
              setError(`investmentAccounts.${index}.institutionName`, {
                type: "required",
                message: "Name of financial institution is required",
              });
              isValid = false;
            }

            if (!inv.countryLocation || inv.countryLocation.trim() === "") {
              setError(`investmentAccounts.${index}.countryLocation`, {
                type: "required",
                message: "Financial institution country location is required",
              });
              isValid = false;
            }

            if (!inv.accountNumber || inv.accountNumber.trim() === "") {
              setError(`investmentAccounts.${index}.accountNumber`, {
                type: "required",
                message: "Account number is required",
              });
              isValid = false;
            }

            if (
              inv.currentMarketValue == null ||
              isNaN(inv.currentMarketValue) ||
              inv.currentMarketValue < 0
            ) {
              setError(`investmentAccounts.${index}.currentMarketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              inv.loanBalance != null &&
              !isNaN(inv.loanBalance) &&
              inv.loanBalance < 0
            ) {
              setError(`investmentAccounts.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate digital assets (UPDATED: numberOfUnits and usdEquivalent)
        const digitalAssets = getValues("digitalAssets") || [];
        if (digitalAssets.length > 0) {
          digitalAssets.forEach((asset: any, index: number) => {
            if (!asset.description || asset.description.trim() === "") {
              setError(`digitalAssets.${index}.description`, {
                type: "required",
                message: "Description of digital asset is required",
              });
              isValid = false;
            }

            if (
              asset.numberOfUnits == null ||
              isNaN(asset.numberOfUnits) ||
              asset.numberOfUnits < 0
            ) {
              setError(`digitalAssets.${index}.numberOfUnits`, {
                type: "required",
                message: "Number of units is required and cannot be negative",
              });
              isValid = false;
            }

            if (!asset.location || asset.location.trim() === "") {
              setError(`digitalAssets.${index}.location`, {
                type: "required",
                message: "Location of digital asset is required",
              });
              isValid = false;
            }

            if (
              (!asset.accountNumber || asset.accountNumber.trim() === "") &&
              (!asset.digitalAssetAddress ||
                asset.digitalAssetAddress.trim() === "")
            ) {
              setError(`digitalAssets.${index}.accountNumber`, {
                type: "required",
                message:
                  "Either account number or digital asset address is required",
              });
              isValid = false;
            }

            if (
              asset.usdEquivalent == null ||
              isNaN(asset.usdEquivalent) ||
              asset.usdEquivalent < 0
            ) {
              setError(`digitalAssets.${index}.usdEquivalent`, {
                type: "required",
                message:
                  "US dollar equivalent is required and cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate retirement accounts (UPDATED: currentMarketValue)
        const retirementAccounts = getValues("retirementAccounts") || [];
        if (retirementAccounts.length > 0) {
          retirementAccounts.forEach((ret: any, index: number) => {
            if (!ret.retirementType || ret.retirementType.trim() === "") {
              setError(`retirementAccounts.${index}.retirementType`, {
                type: "required",
                message: "Retirement account type is required",
              });
              isValid = false;
            }

            if (ret.retirementType === "other") {
              if (
                !ret.retirementTypeText ||
                ret.retirementTypeText.trim() === ""
              ) {
                setError(`retirementAccounts.${index}.retirementTypeText`, {
                  type: "required",
                  message: "Please specify the retirement account type",
                });
                isValid = false;
              }
            }

            if (!ret.institutionName || ret.institutionName.trim() === "") {
              setError(`retirementAccounts.${index}.institutionName`, {
                type: "required",
                message: "Name of financial institution is required",
              });
              isValid = false;
            }

            if (!ret.countryLocation || ret.countryLocation.trim() === "") {
              setError(`retirementAccounts.${index}.countryLocation`, {
                type: "required",
                message: "Country location is required",
              });
              isValid = false;
            }

            if (!ret.accountNumber || ret.accountNumber.trim() === "") {
              setError(`retirementAccounts.${index}.accountNumber`, {
                type: "required",
                message: "Account number is required",
              });
              isValid = false;
            }
            if (
              ret.currentMarketValue != null &&
              !isNaN(ret.currentMarketValue) &&
              ret.currentMarketValue < 0
            ) {
              setError(`retirementAccounts.${index}.currentMarketValue`, {
                type: "min",
                message: "Current market value cannot be negative",
              });
              isValid = false;
            }

            if (
              ret.loanBalance != null &&
              !isNaN(ret.loanBalance) &&
              ret.loanBalance < 0
            ) {
              setError(`retirementAccounts.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate life insurance policies (UPDATED: lifeInsurancePolicies and currentCashValue)
        const lifeInsurancePolicies = getValues("lifeInsurancePolicies") || [];
        if (lifeInsurancePolicies.length > 0) {
          lifeInsurancePolicies.forEach((ins: any, index: number) => {
            if (!ins.companyName || ins.companyName.trim() === "") {
              setError(`lifeInsurancePolicies.${index}.companyName`, {
                type: "required",
                message: "Name of insurance company is required",
              });
              isValid = false;
            }

            if (!ins.policyNumber || ins.policyNumber.trim() === "") {
              setError(`lifeInsurancePolicies.${index}.policyNumber`, {
                type: "required",
                message: "Policy number is required",
              });
              isValid = false;
            }

            if (
              ins.currentCashValue == null ||
              isNaN(ins.currentCashValue) ||
              ins.currentCashValue < 0
            ) {
              setError(`lifeInsurancePolicies.${index}.currentCashValue`, {
                type: "required",
                message:
                  "Current cash value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              ins.loanBalance != null &&
              !isNaN(ins.loanBalance) &&
              ins.loanBalance < 0
            ) {
              setError(`lifeInsurancePolicies.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate real properties (UPDATED: realProperties and separate lender fields)
        const realProperties = getValues("realProperties") || [];
        if (realProperties.length > 0) {
          realProperties.forEach((prop: any, index: number) => {
            const isSelling = prop.isForSale || prop.anticipateSelling;

            if (isSelling) {
              if (
                prop.listingPrice == null ||
                isNaN(prop.listingPrice) ||
                prop.listingPrice < 0
              ) {
                setError(`realProperties.${index}.listingPrice`, {
                  type: "required",
                  message: "Property listing price is required",
                });
                isValid = false;
              }
            }

            if (!prop.description || prop.description.trim() === "") {
              setError(`realProperties.${index}.description`, {
                type: "required",
                message: "Property description is required",
              });
              isValid = false;
            }

            if (!prop.purchaseDate || prop.purchaseDate.trim() === "") {
              setError(`realProperties.${index}.purchaseDate`, {
                type: "required",
                message: "Purchase date is required",
              });
              isValid = false;
            }

            if (
              prop.mortgagePayment != null &&
              !isNaN(prop.mortgagePayment) &&
              prop.mortgagePayment < 0
            ) {
              setError(`realProperties.${index}.mortgagePayment`, {
                type: "min",
                message: "Mortgage payment cannot be negative",
              });
              isValid = false;
            }

            if (!prop.titleHeld || prop.titleHeld.trim() === "") {
              setError(`realProperties.${index}.titleHeld`, {
                type: "required",
                message: "How title is held is required",
              });
              isValid = false;
            }

            if (!prop.location || prop.location.trim() === "") {
              setError(`realProperties.${index}.location`, {
                type: "required",
                message: "Location is required",
              });
              isValid = false;
            }

            if (
              prop.currentMarketValue == null ||
              isNaN(prop.currentMarketValue) ||
              prop.currentMarketValue < 0
            ) {
              setError(`realProperties.${index}.currentMarketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              prop.loanBalance != null &&
              !isNaN(prop.loanBalance) &&
              prop.loanBalance < 0
            ) {
              setError(`realProperties.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate vehicles (UPDATED: purchaseDate, licenseTagNumber, ownershipType, monthlyLeaseLoanAmount, currentMarketValue)
        const vehicles = getValues("vehicles") || [];
        if (vehicles.length > 0) {
          vehicles.forEach((veh: any, index: number) => {
            if (!veh.makeModel || veh.makeModel.trim() === "") {
              setError(`vehicles.${index}.makeModel`, {
                type: "required",
                message: "Vehicle make and model is required",
              });
              isValid = false;
            }

            const currentYear = new Date().getFullYear();
            if (
              veh.year == null ||
              isNaN(veh.year) ||
              veh.year < 1900 ||
              veh.year > currentYear + 1
            ) {
              setError(`vehicles.${index}.year`, {
                type: "required",
                message: `Year is required and must be between 1900 and ${
                  currentYear + 1
                }`,
              });
              isValid = false;
            }

            if (!veh.purchaseDate || veh.purchaseDate.trim() === "") {
              setError(`vehicles.${index}.purchaseDate`, {
                type: "required",
                message: "Date purchased is required",
              });
              isValid = false;
            }

            if (veh.mileage == null || isNaN(veh.mileage) || veh.mileage < 0) {
              setError(`vehicles.${index}.mileage`, {
                type: "required",
                message: "Mileage is required and cannot be negative",
              });
              isValid = false;
            }

            if (!veh.licenseTagNumber || veh.licenseTagNumber.trim() === "") {
              setError(`vehicles.${index}.licenseTagNumber`, {
                type: "required",
                message: "License/tag number is required",
              });
              isValid = false;
            }

            if (!veh.ownershipType || veh.ownershipType.trim() === "") {
              setError(`vehicles.${index}.ownershipType`, {
                type: "required",
                message: "Vehicle ownership type (lease/own) is required",
              });
              isValid = false;
            }

            if (
              veh.monthlyLeaseLoanAmount != null &&
              !isNaN(veh.monthlyLeaseLoanAmount) &&
              veh.monthlyLeaseLoanAmount < 0
            ) {
              setError(`vehicles.${index}.monthlyLeaseLoanAmount`, {
                type: "min",
                message: "Monthly payment cannot be negative",
              });
              isValid = false;
            }

            if (
              veh.currentMarketValue == null ||
              isNaN(veh.currentMarketValue) ||
              veh.currentMarketValue < 0
            ) {
              setError(`vehicles.${index}.currentMarketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              veh.loanBalance != null &&
              !isNaN(veh.loanBalance) &&
              veh.loanBalance < 0
            ) {
              setError(`vehicles.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate valuable items (UPDATED: valuableItems and currentMarketValue)
        const valuableItems = getValues("valuableItems") || [];
        if (valuableItems.length > 0) {
          valuableItems.forEach((val: any, index: number) => {
            if (!val.description || val.description.trim() === "") {
              setError(`valuableItems.${index}.description`, {
                type: "required",
                message: "Description of asset is required",
              });
              isValid = false;
            }

            if (
              val.currentMarketValue == null ||
              isNaN(val.currentMarketValue) ||
              val.currentMarketValue < 0
            ) {
              setError(`valuableItems.${index}.currentMarketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              val.loanBalance != null &&
              !isNaN(val.loanBalance) &&
              val.loanBalance < 0
            ) {
              setError(`valuableItems.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate furniture and personal effects (UPDATED: furniturePersonalEffects and currentMarketValue)
        const furniturePersonalEffects =
          getValues("furniturePersonalEffects") || [];
        if (furniturePersonalEffects.length > 0) {
          furniturePersonalEffects.forEach((furn: any, index: number) => {
            if (!furn.description || furn.description.trim() === "") {
              setError(`furniturePersonalEffects.${index}.description`, {
                type: "required",
                message: "Description of asset is required",
              });
              isValid = false;
            }

            if (
              furn.currentMarketValue == null ||
              isNaN(furn.currentMarketValue) ||
              furn.currentMarketValue < 0
            ) {
              setError(`furniturePersonalEffects.${index}.currentMarketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
              });
              isValid = false;
            }

            if (
              furn.loanBalance != null &&
              !isNaN(furn.loanBalance) &&
              furn.loanBalance < 0
            ) {
              setError(`furniturePersonalEffects.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Collect fields for additional trigger validation
        const assetFieldsToValidate: (keyof FormData433A)[] = [];

        bankAccounts.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `bankAccounts.${index}.balance` as keyof FormData433A
          );
        });

        investmentAccounts.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `investmentAccounts.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `investmentAccounts.${index}.loanBalance` as keyof FormData433A
          );
        });

        digitalAssets.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `digitalAssets.${index}.numberOfUnits` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `digitalAssets.${index}.usdEquivalent` as keyof FormData433A
          );
        });

        retirementAccounts.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `retirementAccounts.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `retirementAccounts.${index}.loanBalance` as keyof FormData433A
          );
        });

        lifeInsurancePolicies.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `lifeInsurancePolicies.${index}.currentCashValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `lifeInsurancePolicies.${index}.loanBalance` as keyof FormData433A
          );
        });

        realProperties.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `realProperties.${index}.mortgagePayment` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `realProperties.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `realProperties.${index}.loanBalance` as keyof FormData433A
          );
        });

        vehicles.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `vehicles.${index}.year` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.mileage` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.monthlyLeaseLoanAmount` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.loanBalance` as keyof FormData433A
          );
        });

        valuableItems.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `valuableItems.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `valuableItems.${index}.loanBalance` as keyof FormData433A
          );
        });

        furniturePersonalEffects.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `furniturePersonalEffects.${index}.currentMarketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `furniturePersonalEffects.${index}.loanBalance` as keyof FormData433A
          );
        });

        if (assetFieldsToValidate.length > 0) {
          const assetValidation = await trigger(assetFieldsToValidate);
          isValid = isValid && assetValidation;
        }
        break;

      case 4: // Self-Employed Information
        fieldsToValidate = ["isSelfEmployed"];

        // Validate basic fields first
        const basicValidation4 = await trigger(fieldsToValidate);
        isValid = basicValidation4;

        const selfEmployed = getValues("isSelfEmployed");
        const otherBusinesses = getValues("otherBusinesses") || [];

        if (selfEmployed) {
          // Add required fields for self-employed (including businessTelephone as per user request)
          const selfEmployedFields = [
            "isSoleProprietorship",
            "businessName",
            "businessTelephone",
            "businessDescription",
            "totalEmployees",
            "taxDepositFrequency",
            "averageGrossMonthlyPayroll",
            "hasOtherBusinessInterests",
          ];
          fieldsToValidate = [...fieldsToValidate, ...selfEmployedFields];

          // First trigger validation for formats/patterns on all required fields
          const selfValidation = await trigger(selfEmployedFields);
          isValid = isValid && selfValidation;

          // Then manually check for required (empty) and set errors if needed
          selfEmployedFields.forEach((field) => {
            let value = getValues(field);
            let isEmpty = false;

            if (value === undefined) {
              isEmpty = true;
            } else if (typeof value === "string") {
              isEmpty = value.trim() === "";
            } else if (typeof value === "number") {
              isEmpty = isNaN(value);
            } else if (typeof value === "boolean") {
              // Booleans are required to be set, but since radio sets true/false, undefined means not selected
              isEmpty = false; // Typically not empty, but if undefined, treat as empty
            }

            if (isEmpty) {
              setError(field, {
                type: "required",
                message: `${field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())} is required`,
              });
              isValid = false;
            }
          });

          // Conditional for EIN if not sole proprietorship
          const soleProp = getValues("isSoleProprietorship");
          if (soleProp === false) {
            const employerIdentificationNumber = getValues(
              "employerIdentificationNumber"
            );
            let einIsEmpty =
              employerIdentificationNumber === undefined ||
              (typeof employerIdentificationNumber === "string" &&
                employerIdentificationNumber.trim() === "");
            if (einIsEmpty) {
              setError("employerIdentificationNumber", {
                type: "required",
                message:
                  "EIN is required for non-sole proprietorship businesses",
              });
              isValid = false;
            } else {
              // Validate format if value exists
              const einValidation = await trigger([
                "employerIdentificationNumber",
              ]);
              isValid = isValid && einValidation;
            }
          } else if (soleProp === true || soleProp !== false) {
            // Validate if provided
            const employerIdentificationNumber = getValues(
              "employerIdentificationNumber"
            );
            if (
              employerIdentificationNumber &&
              typeof employerIdentificationNumber === "string" &&
              employerIdentificationNumber.trim() !== ""
            ) {
              const einValidation = await trigger([
                "employerIdentificationNumber",
              ]);
              isValid = isValid && einValidation;
            }
          }

          // Optional fields: validate format if provided
          const optionalFields = [
            "businessAddress",
            "businessWebsite",
            "tradeName",
          ];
          const optionalToValidate: any = [];
          optionalFields.forEach((field) => {
            const value = getValues(field);
            if (value && typeof value === "string" && value.trim() !== "") {
              optionalToValidate.push(field);
            }
          });
          if (optionalToValidate.length > 0) {
            const optionalValidation = await trigger(optionalToValidate);
            isValid = isValid && optionalValidation;
          }

          // Validate other business interests if yes
          const hasOther = getValues("hasOtherBusinessInterests");
          if (hasOther) {
            if (otherBusinesses.length === 0) {
              setError("hasOtherBusinessInterests", {
                type: "required",
                message:
                  "Please add at least one other business interest or select No",
              });
              isValid = false;
            } else {
              // Validate each other business
              otherBusinesses.forEach((business: any, index: number) => {
                if (business.businessType === "other") {
                  if (
                    !business.otherBusinessTypeDescription ||
                    business.otherBusinessTypeDescription.trim() === ""
                  ) {
                    setError(
                      `otherBusinesses.${index}.otherBusinessTypeDescription`,
                      {
                        type: "required",
                        message: "Please specify the other business type",
                      }
                    );
                    isValid = false;
                  }
                }

                // Check required subfields
                const subFields = [
                  "ownershipPercentage",
                  "title",
                  "businessAddress",
                  "businessName",
                  "businessTelephone",
                  "employerIdentificationNumber",
                  "businessType",
                ];
                subFields.forEach((subField) => {
                  let value = business[subField];
                  let isSubEmpty = false;

                  if (value === undefined) {
                    isSubEmpty = true;
                  } else if (typeof value === "string") {
                    isSubEmpty = value.trim() === "";
                  } else if (typeof value === "number") {
                    isSubEmpty = isNaN(value);
                  }

                  if (isSubEmpty) {
                    setError(`otherBusinesses.${index}.${subField}`, {
                      type: "required",
                      message: `${subField
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) =>
                          str.toUpperCase()
                        )} is required`,
                    });
                    isValid = false;
                  }
                });
              });

              // Trigger validation for subfields that have values (for formats/patterns)
              const subFieldsToValidate: any = [];
              otherBusinesses.forEach((business: any, index: number) => {
                const subFields = [
                  "ownershipPercentage",
                  "title",
                  "businessAddress",
                  "businessName",
                  "businessTelephone",
                  "employerIdentificationNumber",
                  "businessType",
                ];
                subFields.forEach((subField) => {
                  let value = business[subField];
                  if (
                    value !== undefined &&
                    (typeof value === "string" ? value.trim() !== "" : true)
                  ) {
                    subFieldsToValidate.push(
                      `otherBusinesses.${index}.${subField}`
                    );
                  }
                });
              });
              if (subFieldsToValidate.length > 0) {
                const subValidation = await trigger(subFieldsToValidate);
                isValid = isValid && subValidation;
              }
            }
          }
        }

        console.log("fieldsToValidate: ", fieldsToValidate);
        break;

      case 5: // Business Assets Information
        const selfEmployed5 = getValues("isSelfEmployed");
        if (!selfEmployed5) {
          isValid = true;
          break;
        }

        // Clear all errors first
        const sectionFields = [
          "bankAccountsInfo.bankAccounts",
          "digitalAssetsInfo.digitalAssets",
          "assetItems.assets",
          "assetItems.irsAllowedDeduction",
          "totalBusinessAssetsAttachment",
          "hasNotesReceivable",
          "hasAccountsReceivable",
        ] as (keyof FormData433A)[];

        sectionFields.forEach((field) => clearErrors(field));

        // Get all business assets data
        const bankAccountsBusiness =
          getValues("bankAccountsInfo.bankAccounts") || [];
        const digitalAssetsBusiness =
          getValues("digitalAssetsInfo.digitalAssets") || [];
        const assets = getValues("assetItems.assets") || [];
        const hasNotesReceivable = getValues("hasNotesReceivable");
        const hasAccountsReceivable = getValues("hasAccountsReceivable");

        // Validate each business bank account
        bankAccountsBusiness.forEach((account: any, index: number) => {
          if (!account.accountType || account.accountType.trim() === "") {
            setError(`bankAccountsInfo.bankAccounts.${index}.accountType`, {
              type: "required",
              message: "Account type is required",
            });
            isValid = false;
          }

          if (!account.bankName || account.bankName.trim() === "") {
            setError(`bankAccountsInfo.bankAccounts.${index}.bankName`, {
              type: "required",
              message: "Bank name is required",
            });
            isValid = false;
          }

          if (
            !account.countryLocation ||
            account.countryLocation.trim() === ""
          ) {
            setError(`bankAccountsInfo.bankAccounts.${index}.countryLocation`, {
              type: "required",
              message: "Country location is required",
            });
            isValid = false;
          }

          // accountNumber is optional - no validation needed

          if (!account.value || account.value.toString().trim() === "") {
            setError(`bankAccountsInfo.bankAccounts.${index}.value`, {
              type: "required",
              message: "Value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(account.value);
            if (isNaN(value) || value < 0) {
              setError(`bankAccountsInfo.bankAccounts.${index}.value`, {
                type: "min",
                message: "Value must be 0 or greater",
              });
              isValid = false;
            }
          }
        });

        // Validate each digital asset
        digitalAssetsBusiness.forEach((asset: any, index: number) => {
          if (!asset.description || asset.description.trim() === "") {
            setError(`digitalAssetsInfo.digitalAssets.${index}.description`, {
              type: "required",
              message: "Description of digital asset is required",
            });
            isValid = false;
          }

          // numberOfUnits is optional - no validation needed

          if (!asset.location || asset.location.trim() === "") {
            setError(`digitalAssetsInfo.digitalAssets.${index}.location`, {
              type: "required",
              message: "Location of digital asset is required",
            });
            isValid = false;
          }

          // accountNumber is optional - no validation needed
          // digitalAssetAddress is optional - no validation needed

          if (
            !asset.usdEquivalent ||
            asset.usdEquivalent.toString().trim() === ""
          ) {
            setError(`digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`, {
              type: "required",
              message: "USD equivalent is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.usdEquivalent);
            if (isNaN(value) || value < 0) {
              setError(
                `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent`,
                {
                  type: "min",
                  message: "USD equivalent must be 0 or greater",
                }
              );
              isValid = false;
            }
          }
        });

        // Validate each business asset
        assets.forEach((asset: any, index: number) => {
          if (!asset.description || asset.description.trim() === "") {
            setError(`assetItems.assets.${index}.description`, {
              type: "required",
              message: "Description of asset is required",
            });
            isValid = false;
          }

          if (
            !asset.currentMarketValue ||
            asset.currentMarketValue.toString().trim() === ""
          ) {
            setError(`assetItems.assets.${index}.currentMarketValue`, {
              type: "required",
              message: "Current market value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.currentMarketValue);
            if (isNaN(value) || value < 0) {
              setError(`assetItems.assets.${index}.currentMarketValue`, {
                type: "min",
                message: "Current market value must be 0 or greater",
              });
              isValid = false;
            }
          }

          if (
            !asset.loanBalance ||
            asset.loanBalance.toString().trim() === ""
          ) {
            setError(`assetItems.assets.${index}.loanBalance`, {
              type: "required",
              message: "Loan balance is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.loanBalance);
            if (isNaN(value) || value < 0) {
              setError(`assetItems.assets.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance must be 0 or greater",
              });
              isValid = false;
            }
          }

          // isLeased and usedInProductionOfIncome are booleans, no validation needed
        });

        // Validate total business assets attachment (optional)
        const totalBusinessAssetsAttachment = getValues(
          "totalBusinessAssetsAttachment"
        );
        if (
          totalBusinessAssetsAttachment !== undefined &&
          totalBusinessAssetsAttachment !== ""
        ) {
          const amount = parseFloat(totalBusinessAssetsAttachment.toString());
          if (isNaN(amount) || amount < 0) {
            setError("totalBusinessAssetsAttachment", {
              type: "min",
              message: "Total must be 0 or greater",
            });
            isValid = false;
          }
        }

        // Validate IRS deduction
        const irsAllowedDeduction = getValues("assetItems.irsAllowedDeduction");
        if (irsAllowedDeduction !== undefined && irsAllowedDeduction !== "") {
          const amount = parseFloat(irsAllowedDeduction.toString());
          if (isNaN(amount) || amount < 0) {
            setError("assetItems.irsAllowedDeduction", {
              type: "min",
              message: "Deduction must be 0 or greater",
            });
            isValid = false;
          }
        }

        // Validate notes receivable (optional)
        if (hasNotesReceivable === undefined) {
          setError("hasNotesReceivable", {
            type: "required",
            message: "Please select yes or no for notes receivable",
          });
          isValid = false;
        }

        // Validate accounts receivable (optional)
        if (hasAccountsReceivable === undefined) {
          setError("hasAccountsReceivable", {
            type: "required",
            message: "Please select yes or no for accounts receivable",
          });
          isValid = false;
        }

        // Add non-empty optional fields
        if (
          totalBusinessAssetsAttachment &&
          totalBusinessAssetsAttachment.toString().trim() !== ""
        ) {
          fieldsToValidate.push("totalBusinessAssetsAttachment");
        }
        if (
          irsAllowedDeduction &&
          irsAllowedDeduction.toString().trim() !== ""
        ) {
          fieldsToValidate.push("assetItems.irsAllowedDeduction");
        }

        // Add array fields with data
        bankAccountsBusiness.forEach((account: any, index: number) => {
          if (account.accountType && account.accountType.trim() !== "") {
            fieldsToValidate.push(
              `bankAccountsInfo.bankAccounts.${index}.accountType` as keyof FormData433A
            );
          }
          if (account.bankName && account.bankName.trim() !== "") {
            fieldsToValidate.push(
              `bankAccountsInfo.bankAccounts.${index}.bankName` as keyof FormData433A
            );
          }
          if (
            account.countryLocation &&
            account.countryLocation.trim() !== ""
          ) {
            fieldsToValidate.push(
              `bankAccountsInfo.bankAccounts.${index}.countryLocation` as keyof FormData433A
            );
          }
          if (account.accountNumber && account.accountNumber.trim() !== "") {
            fieldsToValidate.push(
              `bankAccountsInfo.bankAccounts.${index}.accountNumber` as keyof FormData433A
            );
          }
          if (account.value && account.value.toString().trim() !== "") {
            fieldsToValidate.push(
              `bankAccountsInfo.bankAccounts.${index}.value` as keyof FormData433A
            );
          }
        });

        digitalAssetsBusiness.forEach((asset: any, index: number) => {
          if (asset.description && asset.description.trim() !== "") {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.description` as keyof FormData433A
            );
          }
          if (
            asset.numberOfUnits &&
            asset.numberOfUnits.toString().trim() !== ""
          ) {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.numberOfUnits` as keyof FormData433A
            );
          }
          if (asset.location && asset.location.trim() !== "") {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.location` as keyof FormData433A
            );
          }
          if (asset.accountNumber && asset.accountNumber.trim() !== "") {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.accountNumber` as keyof FormData433A
            );
          }
          if (
            asset.digitalAssetAddress &&
            asset.digitalAssetAddress.trim() !== ""
          ) {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.digitalAssetAddress` as keyof FormData433A
            );
          }
          if (
            asset.usdEquivalent &&
            asset.usdEquivalent.toString().trim() !== ""
          ) {
            fieldsToValidate.push(
              `digitalAssetsInfo.digitalAssets.${index}.usdEquivalent` as keyof FormData433A
            );
          }
        });

        assets.forEach((asset: any, index: number) => {
          if (asset.description && asset.description.trim() !== "") {
            fieldsToValidate.push(
              `assetItems.assets.${index}.description` as keyof FormData433A
            );
          }
          if (
            asset.currentMarketValue &&
            asset.currentMarketValue.toString().trim() !== ""
          ) {
            fieldsToValidate.push(
              `assetItems.assets.${index}.currentMarketValue` as keyof FormData433A
            );
          }
          if (asset.loanBalance && asset.loanBalance.toString().trim() !== "") {
            fieldsToValidate.push(
              `assetItems.assets.${index}.loanBalance` as keyof FormData433A
            );
          }
        });

        // Trigger validation for fields with values
        if (fieldsToValidate.length > 0) {
          const fieldValidation = await trigger(fieldsToValidate);
          isValid = isValid && fieldValidation;
        }

        console.log("Business Assets fieldsToValidate: ", fieldsToValidate);
        break;

      case 6: // Business Income Information
        const selfEmployed6 = getValues("isSelfEmployed");
        if (!selfEmployed6) {
          isValid = true;
          break;
        }

        // Clear all errors first
        const businessIncomeFields = [
          "periodStart",
          "periodEnd",
          "grossReceipts",
          "grossRentalIncome",
          "interestIncome",
          "dividends",
          "otherIncome",
          "materialsPurchased",
          "inventoryPurchased",
          "grossWagesSalaries",
          "rent",
          "supplies",
          "utilitiesTelephones",
          "vehicleCosts",
          "businessInsurance",
          "currentBusinessTaxes",
          "securedDebts",
          "otherBusinessExpenses",
        ] as (keyof FormData433A)[];

        businessIncomeFields.forEach((field) => clearErrors(field));

        // Get all business income data
        const periodStart = getValues("periodStart");
        const periodEnd = getValues("periodEnd");
        const grossReceipts = getValues("grossReceipts");
        const grossRentalIncome = getValues("grossRentalIncome");
        const interestIncome = getValues("interestIncome");
        const dividends = getValues("dividends");
        const otherIncome = getValues("otherIncome");
        const materialsPurchased = getValues("materialsPurchased");
        const inventoryPurchased = getValues("inventoryPurchased");
        const grossWagesSalaries = getValues("grossWagesSalaries");
        const rent = getValues("rent");
        const supplies = getValues("supplies");
        const utilitiesTelephones = getValues("utilitiesTelephones");
        const vehicleCosts = getValues("vehicleCosts");
        const businessInsurance = getValues("businessInsurance");
        const currentBusinessTaxes = getValues("currentBusinessTaxes");
        const securedDebts = getValues("securedDebts");
        const otherBusinessExpenses = getValues("otherBusinessExpenses");

        // For self-employed, all fields are required
        const requiredFields = [
          {
            name: "periodStart",
            value: periodStart,
            label: "Period beginning date",
          },
          {
            name: "periodEnd",
            value: periodEnd,
            label: "Period through date",
          },
          {
            name: "grossReceipts",
            value: grossReceipts,
            label: "Gross receipts",
          },
          {
            name: "grossRentalIncome",
            value: grossRentalIncome,
            label: "Gross rental income",
          },
          {
            name: "interestIncome",
            value: interestIncome,
            label: "Interest income",
          },
          { name: "dividends", value: dividends, label: "Dividends" },
          {
            name: "otherIncome",
            value: otherIncome,
            label: "Other business income",
          },
          {
            name: "materialsPurchased",
            value: materialsPurchased,
            label: "Materials purchased",
          },
          {
            name: "inventoryPurchased",
            value: inventoryPurchased,
            label: "Inventory purchased",
          },
          { name: "grossWagesSalaries", value: grossWagesSalaries, label: "Gross wages" },
          { name: "rent", value: rent, label: "Business rent" },
          {
            name: "supplies",
            value: supplies,
            label: "Business supplies",
          },
          {
            name: "utilitiesTelephones",
            value: utilitiesTelephones,
            label: "Utilities/telephones",
          },
          { name: "vehicleCosts", value: vehicleCosts, label: "Vehicle costs" },
          {
            name: "businessInsurance",
            value: businessInsurance,
            label: "Business insurance",
          },
          {
            name: "currentBusinessTaxes",
            value: currentBusinessTaxes,
            label: "Current business taxes",
          },
          { name: "securedDebts", value: securedDebts, label: "Secured debts" },
          {
            name: "otherBusinessExpenses",
            value: otherBusinessExpenses,
            label: "Other business expenses",
          },
        ];

        // Check for required fields
        requiredFields.forEach((field) => {
          const isEmpty =
            field.value === undefined ||
            field.value === "" ||
            field.value === null;

          if (isEmpty) {
            setError(field.name as keyof FormData433A, {
              type: "required",
              message: `${field.label} is required`,
            });
            isValid = false;
          }
        });

        // Validate number fields (only if not empty)
        const numberFields = requiredFields.slice(2); // Skip date fields

        numberFields.forEach((field) => {
          if (
            field.value !== undefined &&
            field.value !== "" &&
            field.value !== null
          ) {
            const numValue = parseFloat(field.value.toString());
            if (isNaN(numValue)) {
              setError(field.name as keyof FormData433A, {
                type: "invalid_type",
                message: `${field.label} must be a number`,
              });
              isValid = false;
            } else if (numValue < 0) {
              setError(field.name as keyof FormData433A, {
                type: "min",
                message: `${field.label} must be 0 or greater`,
              });
              isValid = false;
            }
          }
        });

        // Date validation (only if not empty)
        const dateFields = requiredFields.slice(0, 2); // First two are date fields

        dateFields.forEach((field) => {
          if (
            field.value !== undefined &&
            field.value !== "" &&
            field.value !== null
          ) {
            // Basic date format validation (ISO date string from input type="date")
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(field.value.toString())) {
              setError(field.name as keyof FormData433A, {
                type: "pattern",
                message: `${field.label} must be a valid date`,
              });
              isValid = false;
            } else {
              // Check if it's a valid date
              const date = new Date(field.value.toString());
              if (isNaN(date.getTime())) {
                setError(field.name as keyof FormData433A, {
                  type: "invalid",
                  message: `${field.label} must be a valid date`,
                });
                isValid = false;
              }
            }
          }
        });

        // Cross-field validation: period through should be after period beginning
        if (
          periodStart &&
          periodEnd &&
          periodStart.toString().trim() !== "" &&
          periodEnd.toString().trim() !== ""
        ) {
          const beginDate = new Date(periodStart.toString());
          const throughDate = new Date(periodEnd.toString());

          if (!isNaN(beginDate.getTime()) && !isNaN(throughDate.getTime())) {
            if (throughDate <= beginDate) {
              setError("periodEnd", {
                type: "min",
                message: "Period through date must be after the beginning date",
              });
              isValid = false;
            }
          }
        }

        // Add all fields to validation (since all are required for self-employed)
        fieldsToValidate = businessIncomeFields;

        console.log("Business Income fieldsToValidate: ", fieldsToValidate);
        break;

      case 7: // Household Income
        // Clear all errors first
        const householdIncomeFields = [
          "primaryGrossWages",
          "primarySocialSecurity",
          "primaryPensions",
          "primaryOtherIncome",
          "spouseGrossWages",
          "spouseSocialSecurity",
          "spousePensions",
          "spouseOtherIncome",
          "additionalSources",
          "interestDividendsRoyalties",
          "distributions",
          "netRentalIncome",
          "netBusinessIncomeFromBoxC",
          "childSupportReceived",
          "alimonyReceived",
          "foodClothingMisc",
          "housingUtilities",
          "vehicleLoanLease",
          "vehicleOperatingCosts",
          "publicTransportation",
          "healthInsurancePremiums",
          "outOfPocketHealthcare",
          "courtOrderedPayments",
          "childDependentCare",
          "lifeInsurancePremiums",
          "lifeInsurancePolicyAmount",
          "currentMonthlyTaxes",
          "securedDebtsOther",
          "monthlyDelinquentTaxPayments",
          "listDebtsExpenses",
          "totalTaxOwed",
        ] as (keyof FormData433A)[];

        householdIncomeFields.forEach((field) => clearErrors(field));

        // Get form values
        const householdMaritalStatus = getValues("maritalStatus");

        // Required fields validation - Based on form requirements
        const requiredHouseholdFields = [
          {
            name: "foodClothingMisc",
            value: getValues("foodClothingMisc"),
            label: "Food, clothing, and miscellaneous (Box 39)",
          },
          {
            name: "housingUtilities",
            value: getValues("housingUtilities"),
            label: "Housing and utilities (Box 40)",
          },
          {
            name: "currentMonthlyTaxes",
            value: getValues("currentMonthlyTaxes"),
            label: "Current monthly taxes (Box 49)",
          },
        ];

        // Check required fields
        requiredHouseholdFields.forEach((field) => {
          const isEmpty =
            field.value === undefined ||
            field.value === "" ||
            field.value === null;
          if (isEmpty) {
            setError(field.name as keyof FormData433A, {
              type: "required",
              message: `${field.label} is required`,
            });
            isValid = false;
          }
        });

        // Validate all number fields (income and expenses) - Boxes 30-51
        const allHouseholdNumberFields = [
          // Primary taxpayer income (Box 30)
          {
            name: "primaryGrossWages",
            value: getValues("primaryGrossWages"),
            label: "Primary gross wages",
          },
          {
            name: "primarySocialSecurity",
            value: getValues("primarySocialSecurity"),
            label: "Primary social security",
          },
          {
            name: "primaryPensions",
            value: getValues("primaryPensions"),
            label: "Primary pensions",
          },
          {
            name: "primaryOtherIncome",
            value: getValues("primaryOtherIncome"),
            label: "Primary other income",
          },

          // Spouse income (Box 31)
          {
            name: "spouseGrossWages",
            value: getValues("spouseGrossWages"),
            label: "Spouse gross wages",
          },
          {
            name: "spouseSocialSecurity",
            value: getValues("spouseSocialSecurity"),
            label: "Spouse social security",
          },
          {
            name: "spousePensions",
            value: getValues("spousePensions"),
            label: "Spouse pensions",
          },
          {
            name: "spouseOtherIncome",
            value: getValues("spouseOtherIncome"),
            label: "Spouse other income",
          },

          // Additional income sources (Boxes 32-38)
          {
            name: "additionalSources",
            value: getValues("additionalSources"),
            label: "Additional sources (Box 32)",
          },
          {
            name: "interestDividendsRoyalties",
            value: getValues("interestDividendsRoyalties"),
            label: "Interest/dividends/royalties (Box 33)",
          },
          {
            name: "distributions",
            value: getValues("distributions"),
            label: "Distributions (Box 34)",
          },
          {
            name: "netRentalIncome",
            value: getValues("netRentalIncome"),
            label: "Net rental income (Box 35)",
          },
          {
            name: "netBusinessIncomeFromBoxC",
            value: getValues("netBusinessIncomeFromBoxC"),
            label: "Net business income (Box 36)",
          },
          {
            name: "childSupportReceived",
            value: getValues("childSupportReceived"),
            label: "Child support received (Box 37)",
          },
          {
            name: "alimonyReceived",
            value: getValues("alimonyReceived"),
            label: "Alimony received (Box 38)",
          },

          // Expense fields (Boxes 39-51)
          {
            name: "foodClothingMisc",
            value: getValues("foodClothingMisc"),
            label: "Food, clothing, miscellaneous (Box 39)",
          },
          {
            name: "housingUtilities",
            value: getValues("housingUtilities"),
            label: "Housing and utilities (Box 40)",
          },
          {
            name: "vehicleLoanLease",
            value: getValues("vehicleLoanLease"),
            label: "Vehicle loan/lease (Box 41)",
          },
          {
            name: "vehicleOperatingCosts",
            value: getValues("vehicleOperatingCosts"),
            label: "Vehicle operating costs (Box 42)",
          },
          {
            name: "publicTransportation",
            value: getValues("publicTransportation"),
            label: "Public transportation (Box 43)",
          },
          {
            name: "healthInsurancePremiums",
            value: getValues("healthInsurancePremiums"),
            label: "Health insurance premiums (Box 44)",
          },
          {
            name: "outOfPocketHealthcare",
            value: getValues("outOfPocketHealthcare"),
            label: "Out-of-pocket healthcare (Box 45)",
          },
          {
            name: "courtOrderedPayments",
            value: getValues("courtOrderedPayments"),
            label: "Court-ordered payments (Box 46)",
          },
          {
            name: "childDependentCare",
            value: getValues("childDependentCare"),
            label: "Child/dependent care (Box 47)",
          },
          {
            name: "lifeInsurancePremiums",
            value: getValues("lifeInsurancePremiums"),
            label: "Life insurance premiums (Box 48)",
          },
          {
            name: "lifeInsurancePolicyAmount",
            value: getValues("lifeInsurancePolicyAmount"),
            label: "Life insurance policy amount",
          },
          {
            name: "currentMonthlyTaxes",
            value: getValues("currentMonthlyTaxes"),
            label: "Current monthly taxes (Box 49)",
          },
          {
            name: "securedDebtsOther",
            value: getValues("securedDebtsOther"),
            label: "Secured debts/other (Box 50)",
          },
          {
            name: "monthlyDelinquentTaxPayments",
            value: getValues("monthlyDelinquentTaxPayments"),
            label: "Monthly delinquent tax payments (Box 51)",
          },
          {
            name: "totalTaxOwed",
            value: getValues("totalTaxOwed"),
            label: "Total tax owed",
          },
        ];

        // Validate number fields (only if not empty)
        allHouseholdNumberFields.forEach((field) => {
          if (
            field.value !== undefined &&
            field.value !== "" &&
            field.value !== null
          ) {
            const numValue = parseFloat(field.value.toString());
            if (isNaN(numValue)) {
              setError(field.name as keyof FormData433A, {
                type: "invalid_type",
                message: `${field.label} must be a number`,
              });
              isValid = false;
            } else if (numValue < 0) {
              setError(field.name as keyof FormData433A, {
                type: "min",
                message: `${field.label} must be 0 or greater (enter 0 if negative)`,
              });
              isValid = false;
            }
          }
        });

        // If married, spouse income fields are optional but validate format if provided
        if (householdMaritalStatus === "married") {
          const spouseIncomeFields = [
            "spouseGrossWages",
            "spouseSocialSecurity",
            "spousePensions",
            "spouseOtherIncome",
          ];
          const spouseFieldsToValidate: (keyof FormData433A)[] = [];

          spouseIncomeFields.forEach((field) => {
            const value = getValues(field as keyof FormData433A);
            if (value !== undefined && value !== "" && value !== null) {
              spouseFieldsToValidate.push(field as keyof FormData433A);
            }
          });

          if (spouseFieldsToValidate.length > 0) {
            const spouseIncomeValidation = await trigger(
              spouseFieldsToValidate
            );
            isValid = isValid && spouseIncomeValidation;
          }
        }

        // Validate text fields if provided
        const textFields = ["listDebtsExpenses"];
        const textFieldsToValidate: (keyof FormData433A)[] = [];

        textFields.forEach((field) => {
          const value = getValues(field as keyof FormData433A);
          if (value && typeof value === "string" && value.trim() !== "") {
            textFieldsToValidate.push(field as keyof FormData433A);
          }
        });

        // Add number fields with values to validation array
        const numberFieldsToValidate: (keyof FormData433A)[] = [];
        allHouseholdNumberFields.forEach((field) => {
          if (
            field.value !== undefined &&
            field.value !== "" &&
            field.value !== null
          ) {
            numberFieldsToValidate.push(field.name as keyof FormData433A);
          }
        });

        // Trigger validation for fields with values (for schema-level validation)
        const fieldsWithValuesToValidate = [
          ...textFieldsToValidate,
          ...numberFieldsToValidate,
        ];
        if (fieldsWithValuesToValidate.length > 0) {
          const fieldValidation = await trigger(fieldsWithValuesToValidate);
          isValid = isValid && fieldValidation;
        }

        console.log(
          "Household Income fieldsToValidate: ",
          fieldsWithValuesToValidate
        );
        break;

      case 8: // Calculations
        fieldsToValidate = [
          "paymentTimeline",
          "boxF5Month",
          "boxF24Month",
          "boxA",
          "boxB",
          "futureIncome",
        ];

        // Validate payment timeline (required)
        if (!getValues("paymentTimeline")) {
          setError("paymentTimeline", {
            type: "required",
            message: "Payment timeline is required",
          });
          isValid = false;
        }

        // Validate number fields
        const numberFields8 = [
          "boxF5Month",
          "boxF24Month",
          "boxA",
          "boxB",
          "futureIncome",
        ];
        numberFields8.forEach((field) => {
          const value = getValues(field);
          if (value !== undefined) {
            if (isNaN(value)) {
              setError(field, {
                type: "invalid_type",
                message: `${field
                  .replace(/([A-Z])/g, " $1")
                  .trim()} must be a number`,
              });
              isValid = false;
            } else if (value < 0) {
              setError(field, {
                type: "min",
                message: `${field
                  .replace(/([A-Z])/g, " $1")
                  .trim()} cannot be negative`,
              });
              isValid = false;
            }
          }
        });

        // Trigger schema validation for all relevant fields
        const validation8 = await trigger(fieldsToValidate);
        isValid = isValid && validation8;

        break;

      case 9: // Other Information
        // Clear errors for conditional fields
        clearErrors([
          "litigationInvolved",
          "litigationPlaintiffLocation",
          "litigationPlaintiffRepresented",
          "litigationPlaintiffDocket",
          "litigationDefendantCompletionDate",
          "litigationDefendantSubject",
          "litigationAmount",
          "bankruptcyFiled",
          "bankruptcyDateFiled",
          "bankruptcyDateDismissed",
          "bankruptcyDateDischarged",
          "bankruptcyPetitionNo",
          "bankruptcyLocation",
          "livedOutsideUS",
          "livedOutsideFrom",
          "livedOutsideTo",
          "irsLitigation",
          "irsLitigationIncludedTax",
          "irsLitigationDescription",
          "transferredAnyAsset",
          "transferredAssets",
          "assetsOutsideUS",
          "assetsOutsideUSDescription",
          "fundsInTrust",
          "fundsInTrustAmount",
          "fundsInTrustWhere",
          "trustBeneficiary",
          "trustBeneficiaries",
          "isTrustee",
          "trusteeName",
          "trusteeEIN",
          "safeDepositBox",
          "safeDepositBoxLocation",
          "safeDepositBoxContents",
          "safeDepositBoxValue",
        ]);

        // Litigation Involved
        if (!getValues("litigationInvolved")) {
          setError("litigationInvolved", {
            type: "required",
            message: "Please select yes or no for litigation involvement",
          });
          isValid = false;
        } else if (getValues("litigationInvolved") === "yes") {
          // Check if details are provided
          const litDetails = [
            "litigationPlaintiffLocation",
            "litigationPlaintiffRepresented",
            "litigationPlaintiffDocket",
            "litigationDefendantCompletionDate",
            "litigationDefendantSubject",
          ];
          if (litDetails.every((field) => !getValues(field)?.trim())) {
            setError("litigationInvolved", {
              message: "Please provide litigation details",
            });
            isValid = false;
          }
          if (
            getValues("litigationAmount") == null ||
            getValues("litigationAmount") < 0
          ) {
            setError("litigationAmount", {
              message: "Amount of dispute is required and cannot be negative",
            });
            isValid = false;
          }
          const litValid = await trigger([
            "litigationPlaintiffLocation",
            "litigationPlaintiffRepresented",
            "litigationPlaintiffDocket",
            "litigationDefendantCompletionDate",
            "litigationDefendantSubject",
            "litigationAmount",
          ]);
          isValid = isValid && litValid;
        }

        // Bankruptcy Filed
        if (!getValues("bankruptcyFiled")) {
          setError("bankruptcyFiled", {
            type: "required",
            message: "Please select yes or no for bankruptcy filing",
          });
          isValid = false;
        } else if (getValues("bankruptcyFiled") === "yes") {
          const bankFields = [
            "bankruptcyDateFiled",
            "bankruptcyPetitionNo",
            "bankruptcyLocation",
          ];
          bankFields.forEach((field) => {
            if (!getValues(field)?.trim()) {
              setError(field, {
                type: "required",
                message: `${field
                  .replace("bankruptcy", "")
                  .replace(/([A-Z])/g, " $1")
                  .trim()} is required`,
              });
              isValid = false;
            }
          });
          const bankValid = await trigger([
            "bankruptcyDateFiled",
            "bankruptcyDateDismissed",
            "bankruptcyDateDischarged",
            "bankruptcyPetitionNo",
            "bankruptcyLocation",
          ]);
          isValid = isValid && bankValid;
        }

        // Lived Outside US
        if (!getValues("livedOutsideUS")) {
          setError("livedOutsideUS", {
            type: "required",
            message: "Please select yes or no for living outside the U.S.",
          });
          isValid = false;
        } else if (getValues("livedOutsideUS") === "yes") {
          const from = getValues("livedOutsideFrom");
          const to = getValues("livedOutsideTo");
          if (!from?.trim()) {
            setError("livedOutsideFrom", {
              type: "required",
              message: "From date is required",
            });
            isValid = false;
          }
          if (!to?.trim()) {
            setError("livedOutsideTo", {
              type: "required",
              message: "To date is required",
            });
            isValid = false;
          }
          if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
              setError("livedOutsideFrom", { message: "Invalid date format" });
              isValid = false;
            } else if (toDate <= fromDate) {
              setError("livedOutsideTo", {
                message: "To date must be greater than From date",
              });
              isValid = false;
            }
          }
          const livedValid = await trigger([
            "livedOutsideFrom",
            "livedOutsideTo",
          ]);
          isValid = isValid && livedValid;
        }

        // IRS Litigation
        if (!getValues("irsLitigation")) {
          setError("irsLitigation", {
            type: "required",
            message:
              "Please select yes or no for litigation involving the IRS/United States",
          });
          isValid = false;
        } else if (getValues("irsLitigation") === "yes") {
          if (!getValues("irsLitigationIncludedTax")) {
            setError("irsLitigationIncludedTax", {
              type: "required",
              message:
                "Please select yes or no if the litigation included tax debt",
            });
            isValid = false;
          } else if (getValues("irsLitigationIncludedTax") === "yes") {
            if (!getValues("irsLitigationDescription")?.trim()) {
              setError("irsLitigationDescription", {
                type: "required",
                message: "Please provide the types of tax and periods involved",
              });
              isValid = false;
            }
          }
        }

        // Transferred Any Asset
        if (!getValues("transferredAnyAsset")) {
          setError("transferredAnyAsset", {
            type: "required",
            message: "Please select yes or no for transferred assets",
          });
          isValid = false;
        } else if (getValues("transferredAnyAsset") === "yes") {
          const transferredAssets = getValues("transferredAssets") || [];
          if (transferredAssets.length === 0) {
            setError("transferredAnyAsset", {
              message: "Please add at least one transferred asset",
            });
            isValid = false;
          } else {
            let arrayValid = true;
            for (let index = 0; index < transferredAssets.length; index++) {
              const asset = transferredAssets[index];
              ["asset", "date", "toWhom"].forEach((subField) => {
                if (!asset[subField]?.trim()) {
                  setError(`transferredAssets.${index}.${subField}`, {
                    type: "required",
                    message: `${
                      subField.charAt(0).toUpperCase() + subField.slice(1)
                    } is required`,
                  });
                  arrayValid = false;
                }
              });
              if (asset.value == null || asset.value < 0) {
                setError(`transferredAssets.${index}.value`, {
                  message:
                    "Value at time of transfer is required and cannot be negative",
                });
                arrayValid = false;
              }
              const transValid = await trigger([
                `transferredAssets.${index}.date`,
              ]);
              arrayValid = arrayValid && transValid;
            }
            isValid = isValid && arrayValid;
          }
        }

        // Assets Outside US
        if (!getValues("assetsOutsideUS")) {
          setError("assetsOutsideUS", {
            type: "required",
            message:
              "Please select yes or no for assets or real property outside the U.S.",
          });
          isValid = false;
        } else if (getValues("assetsOutsideUS") === "yes") {
          if (!getValues("assetsOutsideUSDescription")?.trim()) {
            setError("assetsOutsideUSDescription", {
              type: "required",
              message: "Please provide description, location, and value",
            });
            isValid = false;
          }
        }

        // Funds in Trust
        if (!getValues("fundsInTrust")) {
          setError("fundsInTrust", {
            type: "required",
            message:
              "Please select yes or no for funds being held in trust by a third party",
          });
          isValid = false;
        } else if (getValues("fundsInTrust") === "yes") {
          if (
            getValues("fundsInTrustAmount") == null ||
            getValues("fundsInTrustAmount") < 0
          ) {
            setError("fundsInTrustAmount", {
              message: "How much ($) is required and cannot be negative",
            });
            isValid = false;
          }
          if (!getValues("fundsInTrustWhere")?.trim()) {
            setError("fundsInTrustWhere", {
              type: "required",
              message: "Where is required",
            });
            isValid = false;
          }
        }

        // Trust Beneficiary
        if (!getValues("trustBeneficiary")) {
          setError("trustBeneficiary", {
            type: "required",
            message:
              "Please select yes or no for being the beneficiary of a trust, estate, or life insurance policy",
          });
          isValid = false;
        } else if (getValues("trustBeneficiary") === "yes") {
          const trustBeneficiaries = getValues("trustBeneficiaries") || [];
          if (trustBeneficiaries.length === 0) {
            setError("trustBeneficiary", {
              message: "Please add at least one beneficiary",
            });
            isValid = false;
          } else {
            let arrayValid = true;
            for (let index = 0; index < trustBeneficiaries.length; index++) {
              const ben = trustBeneficiaries[index];
              ["place", "name", "when"].forEach((subField) => {
                if (!ben[subField]?.trim()) {
                  setError(`trustBeneficiaries.${index}.${subField}`, {
                    type: "required",
                    message: `${
                      subField.charAt(0).toUpperCase() + subField.slice(1)
                    } is required`,
                  });
                  arrayValid = false;
                }
              });
              if (ben.amount == null || ben.amount < 0) {
                setError(`trustBeneficiaries.${index}.amount`, {
                  message:
                    "Anticipated amount to be received ($) is required and cannot be negative",
                });
                arrayValid = false;
              }
            }
            isValid = isValid && arrayValid;
          }
        }

        // Is Trustee
        if (!getValues("isTrustee")) {
          setError("isTrustee", {
            type: "required",
            message:
              "Please select yes or no for being a trustee, fiduciary, or contributor of a trust",
          });
          isValid = false;
        } else if (getValues("isTrustee") === "yes") {
          if (!getValues("trusteeName")?.trim()) {
            setError("trusteeName", {
              type: "required",
              message: "Name of the trust is required",
            });
            isValid = false;
          }
          if (!getValues("trusteeEIN")?.trim()) {
            setError("trusteeEIN", {
              type: "required",
              message: "EIN is required",
            });
            isValid = false;
          }
          const trusteeValid = await trigger(["trusteeEIN"]);
          isValid = isValid && trusteeValid;
        }

        // Safe Deposit Box
        if (!getValues("safeDepositBox")) {
          setError("safeDepositBox", {
            type: "required",
            message: "Please select yes or no for having a safe deposit box",
          });
          isValid = false;
        } else if (getValues("safeDepositBox") === "yes") {
          ["safeDepositBoxLocation", "safeDepositBoxContents"].forEach(
            (field) => {
              if (!getValues(field)?.trim()) {
                setError(field, {
                  type: "required",
                  message: `${field
                    .replace("safeDepositBox", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()} is required`,
                });
                isValid = false;
              }
            }
          );
          if (
            getValues("safeDepositBoxValue") == null ||
            getValues("safeDepositBoxValue") < 0
          ) {
            setError("safeDepositBoxValue", {
              message: "Value ($) is required and cannot be negative",
            });
            isValid = false;
          }
        }
        break;

      case 10: // Signatures
        console.log("Validating Step 10 - Signatures");

        let validationErrors: string[] = [];

        // Taxpayer signature validation
        const taxpayerSignature = getValues("taxpayerSignatureImage");
        const taxpayerDate = getValues("taxpayerSignatureDate");

        console.log("Taxpayer signature:", !!taxpayerSignature);
        console.log("Taxpayer date:", taxpayerDate);

        if (!taxpayerSignature) {
          setError("taxpayerSignatureImage", {
            type: "required",
            message: "Taxpayer signature image is required",
          });
          validationErrors.push("taxpayerSignatureImage");
          isValid = false;
        } else {
          // Clear the error if signature is provided
          clearErrors("taxpayerSignatureImage");
        }

        if (!taxpayerDate || taxpayerDate.trim() === "") {
          setError("taxpayerSignatureDate", {
            type: "required",
            message: "Taxpayer signature date is required",
          });
          validationErrors.push("taxpayerSignatureDate");
          isValid = false;
        } else {
          // Clear the error if date is provided
          clearErrors("taxpayerSignatureDate");
        }

        // Spouse validation if married
        const maritalStatusSection10 = getValues("maritalStatus");
        console.log("Marital status:", maritalStatusSection10);

        if (maritalStatusSection10 === "married") {
          const spouseSignature = getValues("spouseSignatureImage");
          const spouseDate = getValues("spouseSignatureDate");

          console.log("Spouse signature:", !!spouseSignature);
          console.log("Spouse date:", spouseDate);

          if (!spouseSignature) {
            setError("spouseSignatureImage", {
              type: "required",
              message: "Spouse signature image is required",
            });
            validationErrors.push("spouseSignatureImage");
            isValid = false;
          } else {
            clearErrors("spouseSignatureImage");
          }

          if (!spouseDate || spouseDate.trim() === "") {
            setError("spouseSignatureDate", {
              type: "required",
              message: "Spouse signature date is required",
            });
            validationErrors.push("spouseSignatureDate");
            isValid = false;
          } else {
            clearErrors("spouseSignatureDate");
          }
        } else {
          // Clear spouse errors if not married
          clearErrors(["spouseSignatureImage", "spouseSignatureDate"]);
        }

        // Attachment validations
        console.log("Checking attachments...");
        for (let i = 1; i <= 14; i++) {
          const fieldName = `attachment${i}` as keyof FormData433A;
          const fieldNameStr = String(fieldName);
          const fieldValue = getValues(fieldName);

          console.log(`${fieldNameStr}:`, fieldValue);

          // For Radix UI checkboxes with React Hook Form, we expect boolean values
          if (fieldValue !== true) {
            setError(fieldName, {
              type: "required",
              message: "You must confirm this attachment is included",
            });
            validationErrors.push(fieldNameStr);
            isValid = false;
          } else {
            // Clear the error if checkbox is checked
            clearErrors(fieldName);
          }
        }

        console.log("Validation errors found:", validationErrors);
        console.log("Step 10 validation result:", isValid);

        break;

      default:
        return true;
    }

    console.log("Step validation result:", isValid);
    if (!isValid) {
      console.log("Validation errors:", errors);
      console.log("Form validation failed");
    }

    return isValid;
  };

  const handleNext = async () => {
    console.log("Next runs");

      if (currentStep < 10) {
        // Mark current step as completed
        const newCompletedSteps = new Set([...completedSteps, currentStep]);
        setCompletedSteps(newCompletedSteps);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        // Save progress to localStorage
        saveProgress(nextStep, newCompletedSteps);

        clearErrors();
      }
    
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      // Save progress to localStorage
      saveProgress(prevStep, completedSteps);

      clearErrors();
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);

      // update progress
      saveProgress(stepNumber, completedSteps);

      clearErrors();
    }
  };

  const handleSubmit = async () => {
    // Validate current step before submission
    const isValid = await validateCurrentStep();

    if (isValid) {
      const formData = getValues();
      console.log("Form submitted:", formData);

      // Clear saved data after successful submission
      // clearSavedData();

      // You can add your form submission logic here
      // e.g., send to API, show success message, etc.
    }
  };

  // Function to start fresh (clear saved data)
  const startFresh = () => {
    clearSavedData();
    reset(defaultValues);
    setCurrentStep(1);
    setCompletedSteps(new Set());
  };

  const renderCurrentSection = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSubmit: handleSubmit,
      currentStep,
      totalSteps: 10,
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
