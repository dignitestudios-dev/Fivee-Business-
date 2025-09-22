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
  const [currentStep, setCurrentStep] = useState<number>(4);
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
        // Validate property sale status
        const propertySaleStatus = getValues("propertySaleStatus");
        if (!propertySaleStatus) {
          setError("propertySaleStatus", {
            type: "required",
            message: "Property sale status is required",
          });
          isValid = false;
        }

        if (propertySaleStatus === "yes") {
          const propertyListingPrice = getValues("propertyListingPrice");
          if (
            propertyListingPrice == null ||
            isNaN(propertyListingPrice) ||
            propertyListingPrice < 0
          ) {
            setError("propertyListingPrice", {
              type: "required",
              message: "Listing price is required and cannot be negative",
            });
            isValid = false;
          }
        }

        // Validate bank accounts
        const bankAccounts = getValues("bankAccounts") || [];
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

        if (propertySaleStatus === "yes") {
          const listingPriceValidation = await trigger([
            "propertyListingPrice",
          ]);
          isValid = isValid && listingPriceValidation;
        }
        break;

      case 4: // Self-Employed Info
        fieldsToValidate = [
          "isSoleProprietorship",
          "businessName",
          "businessDescription",
        ];

        const basicValidation4 = await trigger(fieldsToValidate);
        isValid = basicValidation4;

        // Validate optional fields if they have values
        const optionalFields = [
          "businessAddress",
          "businessTelephone",
          "ein",
          "businessWebsite",
          "tradeName",
          "totalEmployees",
          "taxDepositFrequency",
          "avgGrossMonthlyPayroll",
        ];
        const optionalToValidate: (keyof FormData433A)[] =
          optionalFields.filter((field) => getValues(field));

        if (optionalToValidate.length > 0) {
          const optionalValidation = await trigger(optionalToValidate);
          isValid = isValid && optionalValidation;
        }

        const hasOtherBusinessInterests = getValues(
          "hasOtherBusinessInterests"
        );
        const otherBusinesses = getValues("otherBusinesses") || [];

        // If has other interests, validate them
        if (hasOtherBusinessInterests) {
          if (otherBusinesses.length === 0) {
            setError("otherBusinesses", {
              type: "required",
              message: "Please add at least one other business interest",
            });
            isValid = false;
          }

          otherBusinesses.forEach((biz: any, index: number) => {
            // Required fields check
            if (
              !biz.percentageOwnership ||
              biz.percentageOwnership.trim() === ""
            ) {
              setError(`otherBusinesses.${index}.percentageOwnership`, {
                type: "required",
                message: "Percentage of ownership is required",
              });
              isValid = false;
            } else if (
              isNaN(Number(biz.percentageOwnership)) ||
              Number(biz.percentageOwnership) < 0 ||
              Number(biz.percentageOwnership) > 100
            ) {
              setError(`otherBusinesses.${index}.percentageOwnership`, {
                type: "pattern",
                message: "Percentage must be a number between 0 and 100",
              });
              isValid = false;
            }

            if (!biz.title || biz.title.trim() === "") {
              setError(`otherBusinesses.${index}.title`, {
                type: "required",
                message: "Title is required",
              });
              isValid = false;
            }

            if (!biz.businessAddress || biz.businessAddress.trim() === "") {
              setError(`otherBusinesses.${index}.businessAddress`, {
                type: "required",
                message: "Business address is required",
              });
              isValid = false;
            }

            if (!biz.businessName || biz.businessName.trim() === "") {
              setError(`otherBusinesses.${index}.businessName`, {
                type: "required",
                message: "Business name is required",
              });
              isValid = false;
            }

            if (!biz.businessTelephone || biz.businessTelephone.trim() === "") {
              setError(`otherBusinesses.${index}.businessTelephone`, {
                type: "required",
                message: "Business telephone is required",
              });
              isValid = false;
            } else if (
              !/^(?:\+1\s?|1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
                biz.businessTelephone
              )
            ) {
              setError(`otherBusinesses.${index}.businessTelephone`, {
                type: "pattern",
                message: "Please enter a valid US phone number",
              });
              isValid = false;
            }

            if (!biz.ein || biz.ein.trim() === "") {
              setError(`otherBusinesses.${index}.ein`, {
                type: "required",
                message: "EIN is required",
              });
              isValid = false;
            } else if (!/^\d{2}-?\d{7}$/.test(biz.ein)) {
              setError(`otherBusinesses.${index}.ein`, {
                type: "pattern",
                message: "Please enter a valid EIN (XX-XXXXXXX)",
              });
              isValid = false;
            }

            if (!biz.businessType || biz.businessType.trim() === "") {
              setError(`otherBusinesses.${index}.businessType`, {
                type: "required",
                message: "Type of business is required",
              });
              isValid = false;
            }
          });

          // Trigger validation for other business fields that have values (for format, etc.)
          const otherFieldsToValidate: (keyof FormData433A)[] = [];
          otherBusinesses.forEach((_: any, index: number) => {
            otherFieldsToValidate.push(
              `otherBusinesses.${index}.percentageOwnership` as keyof FormData433A,
              `otherBusinesses.${index}.title` as keyof FormData433A,
              `otherBusinesses.${index}.businessAddress` as keyof FormData433A,
              `otherBusinesses.${index}.businessName` as keyof FormData433A,
              `otherBusinesses.${index}.businessTelephone` as keyof FormData433A,
              `otherBusinesses.${index}.ein` as keyof FormData433A,
              `otherBusinesses.${index}.businessType` as keyof FormData433A
            );
          });
          if (otherFieldsToValidate.length > 0) {
            const otherValidation = await trigger(otherFieldsToValidate);
            isValid = isValid && otherValidation;
          }
        }
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
        // First validate basic required fields
        fieldsToValidate = ["taxpayerSignature", "taxpayerSignatureDate"];
        const basicValidation10 = await trigger(fieldsToValidate);
        isValid = basicValidation10;

        const signatureMaritalStatus = getValues("maritalStatus");
        if (signatureMaritalStatus === "married") {
          // Manual validation for spouse signature fields
          const spouseSignature = getValues("spouseSignature");
          const spouseSignatureDate = getValues("spouseSignatureDate");

          if (!spouseSignature || spouseSignature.trim() === "") {
            setError("spouseSignature", {
              type: "required",
              message: "Spouse signature is required",
            });
            isValid = false;
          }

          if (!spouseSignatureDate || spouseSignatureDate.trim() === "") {
            setError("spouseSignatureDate", {
              type: "required",
              message: "Spouse signature date is required",
            });
            isValid = false;
          }

          // Validate spouse signature fields that have values for format/pattern
          const spouseSignatureFieldsToValidate: (keyof FormData433A)[] = [];
          if (spouseSignature && spouseSignature.trim() !== "")
            spouseSignatureFieldsToValidate.push("spouseSignature");
          if (spouseSignatureDate && spouseSignatureDate.trim() !== "")
            spouseSignatureFieldsToValidate.push("spouseSignatureDate");

          if (spouseSignatureFieldsToValidate.length > 0) {
            const spouseSignatureValidation = await trigger(
              spouseSignatureFieldsToValidate
            );
            isValid = isValid && spouseSignatureValidation;
          }
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
