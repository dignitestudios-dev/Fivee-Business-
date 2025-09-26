// Fixed Form433AOIC.tsx - Key changes for conditional validation

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
    title: "Business Income and Expense",
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
  const [currentStep, setCurrentStep] = useState<number>(10);
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
    setError,
    clearErrors,
  } = methods;

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
          "dateOfBirth",
          "ssn",
          "maritalStatus",
          "homeAddress",
          "homeOwnership",
          "county",
          "primaryPhone",
        ];

        // Validate basic fields first
        const basicValidation1 = await trigger(fieldsToValidate);
        isValid = basicValidation1;

        const maritalStatus = getValues("maritalStatus");
        const homeOwnership = getValues("homeOwnership");
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
          const spouseDateOfBirth = getValues("spouseDateOfBirth");
          const spouseSSN = getValues("spouseSSN");
          const marriageDate = getValues("marriageDate");

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

          if (!spouseDateOfBirth || spouseDateOfBirth.trim() === "") {
            setError("spouseDateOfBirth", {
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

          if (!marriageDate || marriageDate.trim() === "") {
            setError("marriageDate", {
              type: "required",
              message: "Marriage date is required",
            });
            isValid = false;
          }

          // Validate spouse fields that have values for format/pattern
          const spouseFieldsToValidate: (keyof FormData433A)[] = [];
          if (spouseFirstName) spouseFieldsToValidate.push("spouseFirstName");
          if (spouseLastName) spouseFieldsToValidate.push("spouseLastName");
          if (spouseDateOfBirth)
            spouseFieldsToValidate.push("spouseDateOfBirth");
          if (spouseSSN) spouseFieldsToValidate.push("spouseSSN");
          if (marriageDate) spouseFieldsToValidate.push("marriageDate");

          if (spouseFieldsToValidate.length > 0) {
            const spouseValidation = await trigger(spouseFieldsToValidate);
            isValid = isValid && spouseValidation;
          }
        }

        // Add conditional validation for home ownership
        if (homeOwnership === "other") {
          const homeOwnershipOther = getValues("homeOwnershipOther");
          if (!homeOwnershipOther || homeOwnershipOther.trim() === "") {
            setError("homeOwnershipOther", {
              type: "required",
              message: "Please specify other home ownership type",
            });
            isValid = false;
          } else {
            // Validate format if value exists
            const otherValidation = await trigger(["homeOwnershipOther"]);
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
          "occupation",
          "employmentYears",
          "employmentMonths",
        ];

        // Validate basic fields first
        const basicValidation2 = await trigger(fieldsToValidate);
        isValid = basicValidation2;

        const currentMaritalStatus = getValues("maritalStatus");
        if (currentMaritalStatus === "married") {
          // Manual validation for spouse employment fields
          const spouseEmployerName = getValues("spouseEmployerName");
          const spouseEmployerAddress = getValues("spouseEmployerAddress");
          const spouseOccupation = getValues("spouseOccupation");
          const spouseEmploymentYears = getValues("spouseEmploymentYears");
          const spouseEmploymentMonths = getValues("spouseEmploymentMonths");

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

          if (!spouseOccupation || spouseOccupation.trim() === "") {
            setError("spouseOccupation", {
              type: "required",
              message: "Spouse's occupation is required",
            });
            isValid = false;
          }

          if (
            spouseEmploymentYears === "" ||
            spouseEmploymentYears === undefined ||
            spouseEmploymentYears === null
          ) {
            setError("spouseEmploymentYears", {
              type: "required",
              message: "Spouse's employment years is required",
            });
            isValid = false;
          }

          if (
            spouseEmploymentMonths === "" ||
            spouseEmploymentMonths === undefined ||
            spouseEmploymentMonths === null
          ) {
            setError("spouseEmploymentMonths", {
              type: "required",
              message: "Spouse's employment months is required",
            });
            isValid = false;
          }

          if (
            spouseEmploymentMonths !== "" &&
            Number(spouseEmploymentMonths) > 11
          ) {
            console.log("spouse month more than 11");
            setError("spouseEmploymentMonths", {
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
          if (spouseOccupation && spouseOccupation.trim() !== "")
            spouseEmploymentFieldsToValidate.push("spouseOccupation");
          if (
            spouseEmploymentYears !== "" &&
            spouseEmploymentYears !== undefined
          )
            spouseEmploymentFieldsToValidate.push("spouseEmploymentYears");

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
                message: "Bank name and country location is required",
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

        // Validate investments
        const investments = getValues("investments") || [];
        if (investments.length > 0) {
          investments.forEach((inv: any, index: number) => {
            if (!inv.type || inv.type.trim() === "") {
              setError(`investments.${index}.type`, {
                type: "required",
                message: "Investment type is required",
              });
              isValid = false;
            }

            if (!inv.institutionName || inv.institutionName.trim() === "") {
              setError(`investments.${index}.institutionName`, {
                type: "required",
                message:
                  "Name of financial institution and country location is required",
              });
              isValid = false;
            }

            if (!inv.accountNumber || inv.accountNumber.trim() === "") {
              setError(`investments.${index}.accountNumber`, {
                type: "required",
                message: "Account number is required",
              });
              isValid = false;
            }

            if (
              inv.marketValue == null ||
              isNaN(inv.marketValue) ||
              inv.marketValue < 0
            ) {
              setError(`investments.${index}.marketValue`, {
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
              setError(`investments.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate digital assets
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

            if (asset.units == null || isNaN(asset.units) || asset.units < 0) {
              setError(`digitalAssets.${index}.units`, {
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
              !asset.accountOrAddress ||
              asset.accountOrAddress.trim() === ""
            ) {
              setError(`digitalAssets.${index}.accountOrAddress`, {
                type: "required",
                message: "Account number or digital asset address is required",
              });
              isValid = false;
            }

            if (
              asset.dollarValue == null ||
              isNaN(asset.dollarValue) ||
              asset.dollarValue < 0
            ) {
              setError(`digitalAssets.${index}.dollarValue`, {
                type: "required",
                message:
                  "US dollar equivalent is required and cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate retirement accounts
        const retirementAccounts = getValues("retirementAccounts") || [];
        if (retirementAccounts.length > 0) {
          retirementAccounts.forEach((ret: any, index: number) => {
            if (!ret.type || ret.type.trim() === "") {
              setError(`retirementAccounts.${index}.type`, {
                type: "required",
                message: "Retirement account type is required",
              });
              isValid = false;
            }

            if (!ret.institutionName || ret.institutionName.trim() === "") {
              setError(`retirementAccounts.${index}.institutionName`, {
                type: "required",
                message:
                  "Name of financial institution and country location is required",
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
              ret.marketValue == null ||
              isNaN(ret.marketValue) ||
              ret.marketValue < 0
            ) {
              setError(`retirementAccounts.${index}.marketValue`, {
                type: "required",
                message:
                  "Current market value is required and cannot be negative",
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

        // Validate life insurance
        const lifeInsurance = getValues("lifeInsurance") || [];
        if (lifeInsurance.length > 0) {
          lifeInsurance.forEach((ins: any, index: number) => {
            if (!ins.companyName || ins.companyName.trim() === "") {
              setError(`lifeInsurance.${index}.companyName`, {
                type: "required",
                message: "Name of insurance company is required",
              });
              isValid = false;
            }

            if (!ins.policyNumber || ins.policyNumber.trim() === "") {
              setError(`lifeInsurance.${index}.policyNumber`, {
                type: "required",
                message: "Policy number is required",
              });
              isValid = false;
            }

            if (
              ins.cashValue == null ||
              isNaN(ins.cashValue) ||
              ins.cashValue < 0
            ) {
              setError(`lifeInsurance.${index}.cashValue`, {
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
              setError(`lifeInsurance.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate real property
        const realProperty = getValues("realProperty") || [];
        if (realProperty.length > 0) {
          realProperty.forEach((prop: any, index: number) => {
            // // Validate property sale status
            // if (!prop.propertySaleStatus) {
            //   setError(`realProperty.${index}.propertySaleStatus`, {
            //     type: "required",
            //     message: "Property sale status is required",
            //   });
            //   isValid = false;
            // }

            // if (prop.propertySaleStatus === "yes") {
            //   if (
            //     prop.propertyListingPrice == null ||
            //     isNaN(prop.propertyListingPrice) ||
            //     prop.propertyListingPrice < 0
            //   ) {
            //     setError(`realProperty.${index}.propertySaleStatus`, {
            //       type: "required",
            //       message: "Listing price is required and cannot be negative",
            //     });
            //     isValid = false;
            //   }
            // }

            if (!prop.description || prop.description.trim() === "") {
              setError(`realProperty.${index}.description`, {
                type: "required",
                message: "Property description is required",
              });
              isValid = false;
            }

            if (!prop.purchaseDate || prop.purchaseDate.trim() === "") {
              setError(`realProperty.${index}.purchaseDate`, {
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
              setError(`realProperty.${index}.mortgagePayment`, {
                type: "min",
                message: "Mortgage payment cannot be negative",
              });
              isValid = false;
            }

            if (!prop.titleHeld || prop.titleHeld.trim() === "") {
              setError(`realProperty.${index}.titleHeld`, {
                type: "required",
                message: "How title is held is required",
              });
              isValid = false;
            }

            if (!prop.location || prop.location.trim() === "") {
              setError(`realProperty.${index}.location`, {
                type: "required",
                message: "Location is required",
              });
              isValid = false;
            }

            if (
              prop.marketValue == null ||
              isNaN(prop.marketValue) ||
              prop.marketValue < 0
            ) {
              setError(`realProperty.${index}.marketValue`, {
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
              setError(`realProperty.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate vehicles
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

            if (!veh.datePurchased || veh.datePurchased.trim() === "") {
              setError(`vehicles.${index}.datePurchased`, {
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

            if (!veh.licenseNumber || veh.licenseNumber.trim() === "") {
              setError(`vehicles.${index}.licenseNumber`, {
                type: "required",
                message: "License/tag number is required",
              });
              isValid = false;
            }

            if (!veh.status || veh.status.trim() === "") {
              setError(`vehicles.${index}.status`, {
                type: "required",
                message: "Vehicle status (lease/own) is required",
              });
              isValid = false;
            }

            if (
              veh.monthlyPayment != null &&
              !isNaN(veh.monthlyPayment) &&
              veh.monthlyPayment < 0
            ) {
              setError(`vehicles.${index}.monthlyPayment`, {
                type: "min",
                message: "Monthly payment cannot be negative",
              });
              isValid = false;
            }

            if (
              veh.marketValue == null ||
              isNaN(veh.marketValue) ||
              veh.marketValue < 0
            ) {
              setError(`vehicles.${index}.marketValue`, {
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

        // Validate valuables
        const valuables = getValues("valuables") || [];
        if (valuables.length > 0) {
          valuables.forEach((val: any, index: number) => {
            if (!val.description || val.description.trim() === "") {
              setError(`valuables.${index}.description`, {
                type: "required",
                message: "Description of asset is required",
              });
              isValid = false;
            }

            if (
              val.marketValue == null ||
              isNaN(val.marketValue) ||
              val.marketValue < 0
            ) {
              setError(`valuables.${index}.marketValue`, {
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
              setError(`valuables.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Validate furniture
        const furniture = getValues("furniture") || [];
        if (furniture.length > 0) {
          furniture.forEach((furn: any, index: number) => {
            if (!furn.description || furn.description.trim() === "") {
              setError(`furniture.${index}.description`, {
                type: "required",
                message: "Description of asset is required",
              });
              isValid = false;
            }

            if (
              furn.marketValue == null ||
              isNaN(furn.marketValue) ||
              furn.marketValue < 0
            ) {
              setError(`furniture.${index}.marketValue`, {
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
              setError(`furniture.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance cannot be negative",
              });
              isValid = false;
            }
          });
        }

        // Collect fields for additional trigger validation (e.g., patterns, mins from schema)
        const assetFieldsToValidate: (keyof FormData433A)[] = [];

        // For bank accounts
        bankAccounts.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `bankAccounts.${index}.balance` as keyof FormData433A
          );
        });

        // For investments
        investments.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `investments.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `investments.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For digital assets
        digitalAssets.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `digitalAssets.${index}.units` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `digitalAssets.${index}.dollarValue` as keyof FormData433A
          );
        });

        // For retirement accounts
        retirementAccounts.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `retirementAccounts.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `retirementAccounts.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For life insurance
        lifeInsurance.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `lifeInsurance.${index}.cashValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `lifeInsurance.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For real property
        realProperty.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `realProperty.${index}.mortgagePayment` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `realProperty.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `realProperty.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For vehicles
        vehicles.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `vehicles.${index}.year` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.mileage` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.monthlyPayment` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `vehicles.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For valuables
        valuables.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `valuables.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `valuables.${index}.loanBalance` as keyof FormData433A
          );
        });

        // For furniture
        furniture.forEach((_: any, index: number) => {
          assetFieldsToValidate.push(
            `furniture.${index}.marketValue` as keyof FormData433A
          );
          assetFieldsToValidate.push(
            `furniture.${index}.loanBalance` as keyof FormData433A
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
            "avgGrossMonthlyPayroll",
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
            const ein = getValues("ein");
            let einIsEmpty =
              ein === undefined ||
              (typeof ein === "string" && ein.trim() === "");
            if (einIsEmpty) {
              setError("ein", {
                type: "required",
                message:
                  "EIN is required for non-sole proprietorship businesses",
              });
              isValid = false;
            } else {
              // Validate format if value exists
              const einValidation = await trigger(["ein"]);
              isValid = isValid && einValidation;
            }
          } else if (soleProp === true || soleProp !== false) {
            // Validate if provided
            const ein = getValues("ein");
            if (ein && typeof ein === "string" && ein.trim() !== "") {
              const einValidation = await trigger(["ein"]);
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
                // Check required subfields
                const subFields = [
                  "percentageOwnership",
                  "title",
                  "businessAddress",
                  "businessName",
                  "businessTelephone",
                  "ein",
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
                  "percentageOwnership",
                  "title",
                  "businessAddress",
                  "businessName",
                  "businessTelephone",
                  "ein",
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
          "businessBankAccounts",
          "businessDigitalAssets",
          "totalBusinessBankAttachment",
          "businessOtherAssets",
          "totalBusinessAssetsAttachment",
          "businessIrsDeduction",
          "hasBusinessNotesReceivable",
          "businessNotesListing",
          "hasBusinessAccountsReceivable",
          "businessAccountsListing",
        ] as (keyof FormData433A)[];

        sectionFields.forEach((field) => clearErrors(field));

        // Get all business assets data
        const businessBankAccounts = getValues("businessBankAccounts") || [];
        const businessDigitalAssets = getValues("businessDigitalAssets") || [];
        const businessOtherAssets = getValues("businessOtherAssets") || [];
        const hasBusinessNotesReceivable = getValues(
          "hasBusinessNotesReceivable"
        );
        const hasBusinessAccountsReceivable = getValues(
          "hasBusinessAccountsReceivable"
        );
        const businessNotesListing = getValues("businessNotesListing");
        const businessAccountsListing = getValues("businessAccountsListing");

        // Validate each business bank account
        businessBankAccounts.forEach((account: any, index: number) => {
          if (!account.accountType || account.accountType.trim() === "") {
            setError(`businessBankAccounts.${index}.accountType`, {
              type: "required",
              message: "Account type is required",
            });
            isValid = false;
          }

          if (
            !account.bankNameCountry ||
            account.bankNameCountry.trim() === ""
          ) {
            setError(`businessBankAccounts.${index}.bankNameCountry`, {
              type: "required",
              message: "Bank name and country location is required",
            });
            isValid = false;
          }

          if (!account.accountNumber || account.accountNumber.trim() === "") {
            setError(`businessBankAccounts.${index}.accountNumber`, {
              type: "required",
              message: "Account number is required",
            });
            isValid = false;
          }

          if (!account.amount || account.amount.toString().trim() === "") {
            setError(`businessBankAccounts.${index}.amount`, {
              type: "required",
              message: "Amount is required",
            });
            isValid = false;
          } else {
            const amount = parseFloat(account.amount);
            if (isNaN(amount) || amount < 0) {
              setError(`businessBankAccounts.${index}.amount`, {
                type: "min",
                message: "Amount must be 0 or greater",
              });
              isValid = false;
            }
          }
        });

        // Validate each digital asset
        businessDigitalAssets.forEach((asset: any, index: number) => {
          if (!asset.description || asset.description.trim() === "") {
            setError(`businessDigitalAssets.${index}.description`, {
              type: "required",
              message: "Description of digital asset is required",
            });
            isValid = false;
          }

          if (!asset.units || asset.units.toString().trim() === "") {
            setError(`businessDigitalAssets.${index}.units`, {
              type: "required",
              message: "Number of units is required",
            });
            isValid = false;
          } else {
            const units = parseFloat(asset.units);
            if (isNaN(units) || units < 0) {
              setError(`businessDigitalAssets.${index}.units`, {
                type: "min",
                message: "Number of units must be 0 or greater",
              });
              isValid = false;
            }
          }

          if (!asset.location) {
            setError(`businessDigitalAssets.${index}.location`, {
              type: "required",
              message: "Please select the location of digital asset",
            });
            isValid = false;
          }

          // Validate based on location
          if (asset.location === "accountExchange") {
            if (!asset.custodianBroker || asset.custodianBroker.trim() === "") {
              setError(`businessDigitalAssets.${index}.custodianBroker`, {
                type: "required",
                message: "Custodian or broker is required",
              });
              isValid = false;
            }
          }

          if (asset.location === "selfHostedWallet") {
            if (!asset.address || asset.address.trim() === "") {
              setError(`businessDigitalAssets.${index}.address`, {
                type: "required",
                message: "Digital asset address is required",
              });
              isValid = false;
            }
          }

          if (!asset.value || asset.value.toString().trim() === "") {
            setError(`businessDigitalAssets.${index}.value`, {
              type: "required",
              message: "Value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.value);
            if (isNaN(value) || value < 0) {
              setError(`businessDigitalAssets.${index}.value`, {
                type: "min",
                message: "Value must be 0 or greater",
              });
              isValid = false;
            }
          }
        });

        // Validate total business bank attachment
        const totalBusinessBankAttachment = getValues(
          "totalBusinessBankAttachment"
        );
        if (
          totalBusinessBankAttachment !== undefined &&
          totalBusinessBankAttachment !== ""
        ) {
          const amount = parseFloat(totalBusinessBankAttachment.toString());
          if (isNaN(amount) || amount < 0) {
            setError("totalBusinessBankAttachment", {
              type: "min",
              message: "Total must be 0 or greater",
            });
            isValid = false;
          }
        }

        // Validate each business other asset
        businessOtherAssets.forEach((asset: any, index: number) => {
          if (!asset.description || asset.description.trim() === "") {
            setError(`businessOtherAssets.${index}.description`, {
              type: "required",
              message: "Description of asset is required",
            });
            isValid = false;
          }

          if (
            !asset.currentMarketValue ||
            asset.currentMarketValue.toString().trim() === ""
          ) {
            setError(`businessOtherAssets.${index}.currentMarketValue`, {
              type: "required",
              message: "Current market value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.currentMarketValue);
            if (isNaN(value) || value < 0) {
              setError(`businessOtherAssets.${index}.currentMarketValue`, {
                type: "min",
                message: "Current market value must be 0 or greater",
              });
              isValid = false;
            }
          }

          if (
            !asset.quickSaleValue ||
            asset.quickSaleValue.toString().trim() === ""
          ) {
            setError(`businessOtherAssets.${index}.quickSaleValue`, {
              type: "required",
              message: "Quick sale value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.quickSaleValue);
            if (isNaN(value) || value < 0) {
              setError(`businessOtherAssets.${index}.quickSaleValue`, {
                type: "min",
                message: "Quick sale value must be 0 or greater",
              });
              isValid = false;
            }
          }

          if (
            !asset.loanBalance ||
            asset.loanBalance.toString().trim() === ""
          ) {
            setError(`businessOtherAssets.${index}.loanBalance`, {
              type: "required",
              message: "Loan balance is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.loanBalance);
            if (isNaN(value) || value < 0) {
              setError(`businessOtherAssets.${index}.loanBalance`, {
                type: "min",
                message: "Loan balance must be 0 or greater",
              });
              isValid = false;
            }
          }

          if (!asset.totalValue || asset.totalValue.toString().trim() === "") {
            setError(`businessOtherAssets.${index}.totalValue`, {
              type: "required",
              message: "Total value is required",
            });
            isValid = false;
          } else {
            const value = parseFloat(asset.totalValue);
            if (isNaN(value) || value < 0) {
              setError(`businessOtherAssets.${index}.totalValue`, {
                type: "min",
                message: "Total value must be 0 or greater",
              });
              isValid = false;
            }
          }
        });

        // Validate total business assets attachment
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

        // Validate business IRS deduction
        const businessIrsDeduction = getValues("businessIrsDeduction");
        if (businessIrsDeduction !== undefined && businessIrsDeduction !== "") {
          const amount = parseFloat(businessIrsDeduction.toString());
          if (isNaN(amount) || amount < 0) {
            setError("businessIrsDeduction", {
              type: "min",
              message: "Deduction must be 0 or greater",
            });
            isValid = false;
          }
        }

        // Validate notes receivable
        if (hasBusinessNotesReceivable === undefined) {
          setError("hasBusinessNotesReceivable", {
            type: "required",
            message: "Please select yes or no for notes receivable",
          });
          isValid = false;
        }

        if (
          hasBusinessNotesReceivable &&
          (!businessNotesListing || businessNotesListing.trim() === "")
        ) {
          setError("businessNotesListing", {
            type: "required",
            message: "Please provide the listing for notes receivable",
          });
          isValid = false;
        }

        // Validate accounts receivable
        if (hasBusinessAccountsReceivable === undefined) {
          setError("hasBusinessAccountsReceivable", {
            type: "required",
            message: "Please select yes or no for accounts receivable",
          });
          isValid = false;
        }

        if (
          hasBusinessAccountsReceivable &&
          (!businessAccountsListing || businessAccountsListing.trim() === "")
        ) {
          setError("businessAccountsListing", {
            type: "required",
            message: "Please provide the list for accounts receivable",
          });
          isValid = false;
        }

        // Add non-empty optional fields
        if (
          totalBusinessBankAttachment &&
          totalBusinessBankAttachment.toString().trim() !== ""
        ) {
          fieldsToValidate.push("totalBusinessBankAttachment");
        }
        if (
          totalBusinessAssetsAttachment &&
          totalBusinessAssetsAttachment.toString().trim() !== ""
        ) {
          fieldsToValidate.push("totalBusinessAssetsAttachment");
        }
        if (
          businessIrsDeduction &&
          businessIrsDeduction.toString().trim() !== ""
        ) {
          fieldsToValidate.push("businessIrsDeduction");
        }
        if (businessNotesListing && businessNotesListing.trim() !== "") {
          fieldsToValidate.push("businessNotesListing");
        }
        if (businessAccountsListing && businessAccountsListing.trim() !== "") {
          fieldsToValidate.push("businessAccountsListing");
        }

        // Add array fields with data
        businessBankAccounts.forEach((account: any, index: number) => {
          if (account.accountType && account.accountType.trim() !== "") {
            fieldsToValidate.push(
              `businessBankAccounts.${index}.accountType` as keyof FormData433A
            );
          }
          if (
            account.bankNameCountry &&
            account.bankNameCountry.trim() !== ""
          ) {
            fieldsToValidate.push(
              `businessBankAccounts.${index}.bankNameCountry` as keyof FormData433A
            );
          }
          if (account.accountNumber && account.accountNumber.trim() !== "") {
            fieldsToValidate.push(
              `businessBankAccounts.${index}.accountNumber` as keyof FormData433A
            );
          }
          if (account.amount && account.amount.toString().trim() !== "") {
            fieldsToValidate.push(
              `businessBankAccounts.${index}.amount` as keyof FormData433A
            );
          }
        });

        businessDigitalAssets.forEach((asset: any, index: number) => {
          if (asset.description && asset.description.trim() !== "") {
            fieldsToValidate.push(
              `businessDigitalAssets.${index}.description` as keyof FormData433A
            );
          }
          if (asset.units && asset.units.toString().trim() !== "") {
            fieldsToValidate.push(
              `businessDigitalAssets.${index}.units` as keyof FormData433A
            );
          }
          if (asset.custodianBroker && asset.custodianBroker.trim() !== "") {
            fieldsToValidate.push(
              `businessDigitalAssets.${index}.custodianBroker` as keyof FormData433A
            );
          }
          if (asset.address && asset.address.trim() !== "") {
            fieldsToValidate.push(
              `businessDigitalAssets.${index}.address` as keyof FormData433A
            );
          }
          if (asset.value && asset.value.toString().trim() !== "") {
            fieldsToValidate.push(
              `businessDigitalAssets.${index}.value` as keyof FormData433A
            );
          }
        });

        businessOtherAssets.forEach((asset: any, index: number) => {
          if (asset.description && asset.description.trim() !== "") {
            fieldsToValidate.push(
              `businessOtherAssets.${index}.description` as keyof FormData433A
            );
          }
          if (
            asset.currentMarketValue &&
            asset.currentMarketValue.toString().trim() !== ""
          ) {
            fieldsToValidate.push(
              `businessOtherAssets.${index}.currentMarketValue` as keyof FormData433A
            );
          }
          if (
            asset.quickSaleValue &&
            asset.quickSaleValue.toString().trim() !== ""
          ) {
            fieldsToValidate.push(
              `businessOtherAssets.${index}.quickSaleValue` as keyof FormData433A
            );
          }
          if (asset.loanBalance && asset.loanBalance.toString().trim() !== "") {
            fieldsToValidate.push(
              `businessOtherAssets.${index}.loanBalance` as keyof FormData433A
            );
          }
          if (asset.totalValue && asset.totalValue.toString().trim() !== "") {
            fieldsToValidate.push(
              `businessOtherAssets.${index}.totalValue` as keyof FormData433A
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
          "periodBeginning",
          "periodThrough",
          "grossReceipts",
          "grossRentalIncome",
          "interestIncome",
          "dividends",
          "otherBusinessIncome",
          "materialsPurchased",
          "inventoryPurchased",
          "grossWages",
          "businessRent",
          "businessSupplies",
          "utilitiesTelephones",
          "vehicleCosts",
          "businessInsurance",
          "currentBusinessTaxes",
          "securedDebts",
          "otherBusinessExpenses",
        ] as (keyof FormData433A)[];

        businessIncomeFields.forEach((field) => clearErrors(field));

        // Get all business income data
        const periodBeginning = getValues("periodBeginning");
        const periodThrough = getValues("periodThrough");
        const grossReceipts = getValues("grossReceipts");
        const grossRentalIncome = getValues("grossRentalIncome");
        const interestIncome = getValues("interestIncome");
        const dividends = getValues("dividends");
        const otherBusinessIncome = getValues("otherBusinessIncome");
        const materialsPurchased = getValues("materialsPurchased");
        const inventoryPurchased = getValues("inventoryPurchased");
        const grossWages = getValues("grossWages");
        const businessRent = getValues("businessRent");
        const businessSupplies = getValues("businessSupplies");
        const utilitiesTelephones = getValues("utilitiesTelephones");
        const vehicleCosts = getValues("vehicleCosts");
        const businessInsurance = getValues("businessInsurance");
        const currentBusinessTaxes = getValues("currentBusinessTaxes");
        const securedDebts = getValues("securedDebts");
        const otherBusinessExpenses = getValues("otherBusinessExpenses");

        // For self-employed, all fields are required
        const requiredFields = [
          {
            name: "periodBeginning",
            value: periodBeginning,
            label: "Period beginning date",
          },
          {
            name: "periodThrough",
            value: periodThrough,
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
            name: "otherBusinessIncome",
            value: otherBusinessIncome,
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
          { name: "grossWages", value: grossWages, label: "Gross wages" },
          { name: "businessRent", value: businessRent, label: "Business rent" },
          {
            name: "businessSupplies",
            value: businessSupplies,
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
          periodBeginning &&
          periodThrough &&
          periodBeginning.toString().trim() !== "" &&
          periodThrough.toString().trim() !== ""
        ) {
          const beginDate = new Date(periodBeginning.toString());
          const throughDate = new Date(periodThrough.toString());

          if (!isNaN(beginDate.getTime()) && !isNaN(throughDate.getTime())) {
            if (throughDate <= beginDate) {
              setError("periodThrough", {
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

        // Clear any existing errors first
        clearErrors([
          "taxpayerSignatureImage",
          "taxpayerSignatureDate",
          "spouseSignatureImage",
          "spouseSignatureDate",
          ...Array.from({ length: 14 }, (_, i) => `attachment${i + 1}`),
        ]);

        let validationErrors = [];

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
        }

        if (!taxpayerDate?.trim()) {
          setError("taxpayerSignatureDate", {
            type: "required",
            message: "Taxpayer signature date is required",
          });
          validationErrors.push("taxpayerSignatureDate");
          isValid = false;
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
          }

          if (!spouseDate?.trim()) {
            setError("spouseSignatureDate", {
              type: "required",
              message: "Spouse signature date is required",
            });
            validationErrors.push("spouseSignatureDate");
            isValid = false;
          }
        }

        // Attachment validations
        console.log("Checking attachments...");
        for (let i = 1; i <= 14; i++) {
          const fieldName = `attachment${i}`;
          const fieldValue = getValues(fieldName);

          console.log(`${fieldName}:`, fieldValue);

          if (!fieldValue) {
            setError(fieldName, {
              type: "required",
              message: "You must confirm this attachment is included",
            });
            validationErrors.push(fieldName);
            isValid = false;
          }
        }

        console.log("Validation errors found:", validationErrors);
        console.log("Step 10 validation result:", isValid);

        // Force a re-render to show errors immediately
        if (validationErrors.length > 0) {
          // Trigger validation on all fields that had errors to ensure they show up
          setTimeout(() => {
            trigger(validationErrors);
          }, 0);
        }
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
    const isValid = await validateCurrentStep();
    console.log("is valid: ", isValid);
    if (isValid && currentStep < 10) {
      // Mark current step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
      clearErrors();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      clearErrors();
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);
      clearErrors();
    }
  };

  const handleSubmit = async () => {
    // Validate current step before submission
    const isValid = await validateCurrentStep();

    if (isValid) {
      const formData = getValues();
      console.log("Form submitted:", formData);
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
