import React, { useState } from "react";
import { Plus, Minus, Save, FileText } from "lucide-react";

interface HouseholdMember {
  name: string;
  age: string;
  relationship: string;
  claimedAsDependent: boolean;
  contributesToIncome: boolean;
}

interface BankAccount {
  type: string;
  bankName: string;
  accountNumber: string;
  amount: string;
}

interface Vehicle {
  makeModel: string;
  year: string;
  datePurchased: string;
  mileage: string;
  licenseTag: string;
  leaseOwn: string;
  creditorName: string;
  finalPaymentDate: string;
  monthlyPayment: string;
  currentMarketValue: string;
  loanBalance: string;
}

const Form433AOIC = () => {
  // State for dynamic rows
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([
    {
      name: "",
      age: "",
      relationship: "",
      claimedAsDependent: false,
      contributesToIncome: false,
    },
  ]);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { type: "Cash", bankName: "", accountNumber: "", amount: "" },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      makeModel: "",
      year: "",
      datePurchased: "",
      mileage: "",
      licenseTag: "",
      leaseOwn: "Own",
      creditorName: "",
      finalPaymentDate: "",
      monthlyPayment: "",
      currentMarketValue: "",
      loanBalance: "",
    },
  ]);

  const [formData, setFormData] = useState({
    // Personal Information
    lastName: "",
    firstName: "",
    dateOfBirth: "",
    ssn: "",
    maritalStatus: "Unmarried",
    marriageDate: "",
    homeAddress: "",
    homeOwnership: "Rent",
    communityPropertyState: false,
    county: "",
    primaryPhone: "",
    secondaryPhone: "",
    faxNumber: "",
    mailingAddress: "",

    // Spouse Information
    spouseLastName: "",
    spouseFirstName: "",
    spouseDOB: "",
    spouseSSN: "",

    // Employment Information
    employerName: "",
    payPeriod: "Monthly",
    employerAddress: "",
    ownershipInterest: false,
    occupation: "",
    yearsWithEmployer: "",
    monthsWithEmployer: "",

    // Spouse Employment
    spouseEmployerName: "",
    spousePayPeriod: "Monthly",
    spouseEmployerAddress: "",
    spouseOwnershipInterest: false,
    spouseOccupation: "",
    spouseYearsWithEmployer: "",
    spouseMonthsWithEmployer: "",
  });

  const addHouseholdMember = () => {
    setHouseholdMembers([
      ...householdMembers,
      {
        name: "",
        age: "",
        relationship: "",
        claimedAsDependent: false,
        contributesToIncome: false,
      },
    ]);
  };

  const removeHouseholdMember = (index: number) => {
    if (householdMembers.length > 1) {
      setHouseholdMembers(householdMembers.filter((_, i) => i !== index));
    }
  };

  const updateHouseholdMember = (index: number, field: string, value: any) => {
    const updated = [...householdMembers];
    updated[index] = { ...updated[index], [field]: value };
    setHouseholdMembers(updated);
  };

  const addBankAccount = () => {
    setBankAccounts([
      ...bankAccounts,
      { type: "Cash", bankName: "", accountNumber: "", amount: "" },
    ]);
  };

  const removeBankAccount = (index: number) => {
    if (bankAccounts.length > 1) {
      setBankAccounts(bankAccounts.filter((_, i) => i !== index));
    }
  };

  const updateBankAccount = (index: number, field: string, value: string) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        makeModel: "",
        year: "",
        datePurchased: "",
        mileage: "",
        licenseTag: "",
        leaseOwn: "Own",
        creditorName: "",
        finalPaymentDate: "",
        monthlyPayment: "",
        currentMarketValue: "",
        loanBalance: "",
      },
    ]);
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((_, i) => i !== index));
    }
  };

  const updateVehicle = (index: number, field: string, value: string) => {
    const updated = [...vehicles];
    updated[index] = { ...updated[index], [field]: value };
    setVehicles(updated);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", {
      formData,
      householdMembers,
      bankAccounts,
      vehicles,
    });
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#22b573] to-green-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Form 433-A (OIC)</h1>
              <p className="text-green-100">
                Collection Information Statement for Wage Earners and
                Self-Employed Individuals
              </p>
              <p className="text-sm text-green-100 mt-1">
                Department of the Treasury — Internal Revenue Service
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: Personal and Household Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#22b573] pb-2 mb-6">
              Section 1: Personal and Household Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Security Number or ITIN
                </label>
                <input
                  type="text"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Unmarried"
                      checked={formData.maritalStatus === "Unmarried"}
                      onChange={(e) =>
                        handleInputChange("maritalStatus", e.target.value)
                      }
                      className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                    />
                    Unmarried
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Married"
                      checked={formData.maritalStatus === "Married"}
                      onChange={(e) =>
                        handleInputChange("maritalStatus", e.target.value)
                      }
                      className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                    />
                    Married
                  </label>
                </div>
              </div>

              {formData.maritalStatus === "Married" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Marriage
                  </label>
                  <input
                    type="date"
                    value={formData.marriageDate}
                    onChange={(e) =>
                      handleInputChange("marriageDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Physical Address
                </label>
                <textarea
                  value={formData.homeAddress}
                  onChange={(e) =>
                    handleInputChange("homeAddress", e.target.value)
                  }
                  placeholder="Street, City, State, ZIP Code"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Mailing Address (if different)
                </label>
                <textarea
                  value={formData.mailingAddress}
                  onChange={(e) =>
                    handleInputChange("mailingAddress", e.target.value)
                  }
                  placeholder="Street, City, State, ZIP Code or P.O. Box"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you
                </label>
                <div className="flex flex-col gap-2">
                  {["Own your home", "Rent", "Other"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        value={option}
                        checked={formData.homeOwnership === option}
                        onChange={(e) =>
                          handleInputChange("homeOwnership", e.target.value)
                        }
                        className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County of Residence
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => handleInputChange("county", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={formData.primaryPhone}
                  onChange={(e) =>
                    handleInputChange("primaryPhone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.communityPropertyState}
                  onChange={(e) =>
                    handleInputChange(
                      "communityPropertyState",
                      e.target.checked
                    )
                  }
                  className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                />
                <span className="text-sm text-gray-700">
                  If you were married and lived in AZ, CA, ID, LA, NM, NV, TX,
                  WA or WI within the last ten years check here
                </span>
              </label>
            </div>

            {/* Spouse Information */}
            {formData.maritalStatus === "Married" && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Spouse Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse's Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.spouseLastName}
                      onChange={(e) =>
                        handleInputChange("spouseLastName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse's First Name
                    </label>
                    <input
                      type="text"
                      value={formData.spouseFirstName}
                      onChange={(e) =>
                        handleInputChange("spouseFirstName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.spouseDOB}
                      onChange={(e) =>
                        handleInputChange("spouseDOB", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Security Number
                    </label>
                    <input
                      type="text"
                      value={formData.spouseSSN}
                      onChange={(e) =>
                        handleInputChange("spouseSSN", e.target.value)
                      }
                      placeholder="XXX-XX-XXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Household Members */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Other Persons in Household or Claimed as Dependent
                </h3>
                <button
                  type="button"
                  onClick={addHouseholdMember}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22b573] text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Person
                </button>
              </div>

              <div className="space-y-4">
                {householdMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        Person {index + 1}
                      </span>
                      {householdMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHouseholdMember(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateHouseholdMember(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={member.age}
                          onChange={(e) =>
                            updateHouseholdMember(index, "age", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={member.relationship}
                          onChange={(e) =>
                            updateHouseholdMember(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Claimed as Dependent
                        </label>
                        <div className="flex gap-2 mt-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={member.claimedAsDependent === true}
                              onChange={() =>
                                updateHouseholdMember(
                                  index,
                                  "claimedAsDependent",
                                  true
                                )
                              }
                              className="mr-1 text-[#22b573] focus:ring-[#22b573]"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={member.claimedAsDependent === false}
                              onChange={() =>
                                updateHouseholdMember(
                                  index,
                                  "claimedAsDependent",
                                  false
                                )
                              }
                              className="mr-1 text-[#22b573] focus:ring-[#22b573]"
                            />
                            No
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contributes to Income
                        </label>
                        <div className="flex gap-2 mt-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={member.contributesToIncome === true}
                              onChange={() =>
                                updateHouseholdMember(
                                  index,
                                  "contributesToIncome",
                                  true
                                )
                              }
                              className="mr-1 text-[#22b573] focus:ring-[#22b573]"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={member.contributesToIncome === false}
                              onChange={() =>
                                updateHouseholdMember(
                                  index,
                                  "contributesToIncome",
                                  false
                                )
                              }
                              className="mr-1 text-[#22b573] focus:ring-[#22b573]"
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Employment Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#22b573] pb-2 mb-6">
              Section 2: Employment Information for Wage Earners
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Your Employment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Your Employment
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer's Name
                    </label>
                    <input
                      type="text"
                      value={formData.employerName}
                      onChange={(e) =>
                        handleInputChange("employerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Period
                    </label>
                    <select
                      value={formData.payPeriod}
                      onChange={(e) =>
                        handleInputChange("payPeriod", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer's Address
                    </label>
                    <textarea
                      value={formData.employerAddress}
                      onChange={(e) =>
                        handleInputChange("employerAddress", e.target.value)
                      }
                      placeholder="Street, City, State, ZIP Code"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ownershipInterest}
                        onChange={(e) =>
                          handleInputChange(
                            "ownershipInterest",
                            e.target.checked
                          )
                        }
                        className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                      />
                      <span className="text-sm text-gray-700">
                        Do you have an ownership interest in this business?
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer's Address
                      </label>
                      <textarea
                        value={formData.spouseEmployerAddress}
                        onChange={(e) =>
                          handleInputChange(
                            "spouseEmployerAddress",
                            e.target.value
                          )
                        }
                        placeholder="Street, City, State, ZIP Code"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.spouseOwnershipInterest}
                          onChange={(e) =>
                            handleInputChange(
                              "spouseOwnershipInterest",
                              e.target.checked
                            )
                          }
                          className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                        />
                        <span className="text-sm text-gray-700">
                          Does your spouse have an ownership interest in this
                          business?
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Spouse's Occupation
                        </label>
                        <input
                          type="text"
                          value={formData.spouseOccupation}
                          onChange={(e) =>
                            handleInputChange(
                              "spouseOccupation",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time with Employer
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={formData.spouseYearsWithEmployer}
                            onChange={(e) =>
                              handleInputChange(
                                "spouseYearsWithEmployer",
                                e.target.value
                              )
                            }
                            placeholder="Years"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                          <input
                            type="number"
                            value={formData.spouseMonthsWithEmployer}
                            onChange={(e) =>
                              handleInputChange(
                                "spouseMonthsWithEmployer",
                                e.target.value
                              )
                            }
                            placeholder="Months"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Personal Asset Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#22b573] pb-2 mb-6">
              Section 3: Personal Asset Information (Domestic and Foreign)
            </h2>

            {/* Cash and Investments */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Cash and Investments
                </h3>
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22b573] text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                </button>
              </div>

              <div className="space-y-4">
                {bankAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        Account {index + 1}
                      </span>
                      {bankAccounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBankAccount(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Type
                        </label>
                        <select
                          value={account.type}
                          onChange={(e) =>
                            updateBankAccount(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Checking">Checking</option>
                          <option value="Savings">Savings</option>
                          <option value="Money Market Account/CD">
                            Money Market/CD
                          </option>
                          <option value="Online Account">Online Account</option>
                          <option value="Stored Value Card">
                            Stored Value Card
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name & Location
                        </label>
                        <input
                          type="text"
                          value={account.bankName}
                          onChange={(e) =>
                            updateBankAccount(index, "bankName", e.target.value)
                          }
                          placeholder="Bank name and country location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={account.accountNumber}
                          onChange={(e) =>
                            updateBankAccount(
                              index,
                              "accountNumber",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          value={account.amount}
                          onChange={(e) =>
                            updateBankAccount(index, "amount", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicles */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Vehicles</h3>
                <button
                  type="button"
                  onClick={addVehicle}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22b573] text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </button>
              </div>

              <div className="space-y-6">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        Vehicle {index + 1}
                      </span>
                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVehicle(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Make & Model
                        </label>
                        <input
                          type="text"
                          value={vehicle.makeModel}
                          onChange={(e) =>
                            updateVehicle(index, "makeModel", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          value={vehicle.year}
                          onChange={(e) =>
                            updateVehicle(index, "year", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Purchased
                        </label>
                        <input
                          type="date"
                          value={vehicle.datePurchased}
                          onChange={(e) =>
                            updateVehicle(
                              index,
                              "datePurchased",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mileage
                        </label>
                        <input
                          type="number"
                          value={vehicle.mileage}
                          onChange={(e) =>
                            updateVehicle(index, "mileage", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License/Tag Number
                        </label>
                        <input
                          type="text"
                          value={vehicle.licenseTag}
                          onChange={(e) =>
                            updateVehicle(index, "licenseTag", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lease/Own
                        </label>
                        <select
                          value={vehicle.leaseOwn}
                          onChange={(e) =>
                            updateVehicle(index, "leaseOwn", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        >
                          <option value="Own">Own</option>
                          <option value="Lease">Lease</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Creditor Name
                        </label>
                        <input
                          type="text"
                          value={vehicle.creditorName}
                          onChange={(e) =>
                            updateVehicle(index, "creditorName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Final Payment Date
                        </label>
                        <input
                          type="date"
                          value={vehicle.finalPaymentDate}
                          onChange={(e) =>
                            updateVehicle(
                              index,
                              "finalPaymentDate",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Payment ($)
                        </label>
                        <input
                          type="number"
                          value={vehicle.monthlyPayment}
                          onChange={(e) =>
                            updateVehicle(
                              index,
                              "monthlyPayment",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Market Value ($)
                        </label>
                        <input
                          type="number"
                          value={vehicle.currentMarketValue}
                          onChange={(e) =>
                            updateVehicle(
                              index,
                              "currentMarketValue",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Property Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Real Property
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is your real property currently for sale or do you anticipate
                  selling your real property to fund the offer amount?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="propertyForSale"
                      className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="propertyForSale"
                      className="mr-2 text-[#22b573] focus:ring-[#22b573]"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., personal residence, rental property, vacant, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Mortgage Payment ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Final Payment
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How Title is Held
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., joint tenancy, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Location
                  </label>
                  <textarea
                    placeholder="Street, City, State, ZIP Code, County, and Country"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lender/Contract Holder Information
                  </label>
                  <textarea
                    placeholder="Name, Address, Phone"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Income and Expense Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#22b573] pb-2 mb-6">
              Section 7: Monthly Household Income and Expense Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Household Income */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Monthly Household Income
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Primary Taxpayer
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gross Wages ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Social Security ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pension(s) ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Other Income ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.maritalStatus === "Married" && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Spouse</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gross Wages ($)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Social Security ($)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pension(s) ($)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Other Income ($)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Other Income Sources
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Interest, dividends, and royalties",
                        "Distributions (partnerships, sub-S Corps, etc.)",
                        "Net rental income",
                        "Net business income",
                        "Child support received",
                        "Alimony received",
                        "Additional sources of income",
                      ].map((label, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label} ($)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Household Expenses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Monthly Household Expenses
                </h3>

                <div className="space-y-3">
                  {[
                    "Food, clothing, and miscellaneous",
                    "Housing and utilities",
                    "Vehicle loan and/or lease payments",
                    "Vehicle operating costs",
                    "Public transportation costs",
                    "Health insurance premiums",
                    "Out-of-pocket health care costs",
                    "Court-ordered payments",
                    "Child/dependent care payments",
                    "Life insurance premiums",
                    "Current monthly taxes",
                    "Delinquent state and/or local tax payments",
                    "Secured debts/Other",
                  ].map((expense, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {expense} ($)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Calculation Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#22b573] pb-2 mb-6">
              Section 8: Calculate Your Minimum Offer Amount
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Payment in 5 or fewer payments (within 5 months)
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    Remaining Monthly Income × 12
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                    <span>×</span>
                    <span className="bg-gray-100 px-3 py-2 rounded-md">12</span>
                    <span>=</span>
                    <div className="bg-green-100 px-3 py-2 rounded-md font-medium">
                      $0
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Payment in 6 to 24 months
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    Remaining Monthly Income × 24
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                    <span>×</span>
                    <span className="bg-gray-100 px-3 py-2 rounded-md">24</span>
                    <span>=</span>
                    <label className="bg-green-100 px-3 py-2">
                      {" "}
                      Your Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) =>
                        handleInputChange("occupation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time with Employer
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.yearsWithEmployer}
                        onChange={(e) =>
                          handleInputChange("yearsWithEmployer", e.target.value)
                        }
                        placeholder="Years"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                      />
                      <input
                        type="number"
                        value={formData.monthsWithEmployer}
                        onChange={(e) =>
                          handleInputChange(
                            "monthsWithEmployer",
                            e.target.value
                          )
                        }
                        placeholder="Months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spouse Employment */}
            {formData.maritalStatus === "Married" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Spouse's Employment
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse's Employer Name
                    </label>
                    <input
                      type="text"
                      value={formData.spouseEmployerName}
                      onChange={(e) =>
                        handleInputChange("spouseEmployerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Period
                    </label>
                    <select
                      value={formData.spousePayPeriod}
                      onChange={(e) =>
                        handleInputChange("spousePayPeriod", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22b573] focus:border-[#22b573]"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                  </div>
                </div>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default Form433AOIC;
