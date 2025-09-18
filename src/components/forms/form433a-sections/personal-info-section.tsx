"use client"

import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PersonalInfoSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrevious: () => void
  currentStep: number
  totalSteps: number
}

export function PersonalInfoSection({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PersonalInfoSectionProps) {
  const addHouseholdMember = () => {
    const newMember = {
      name: "",
      age: "",
      relationship: "",
      claimedAsDependent: false,
      contributesToIncome: false,
    }
    updateFormData({
      householdMembers: [...formData.householdMembers, newMember],
    })
  }

  const removeHouseholdMember = (index: number) => {
    const updatedMembers = formData.householdMembers.filter((_, i) => i !== index)
    updateFormData({ householdMembers: updatedMembers })
  }

  const updateHouseholdMember = (index: number, field: string, value: any) => {
    const updatedMembers = formData.householdMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member,
    )
    updateFormData({ householdMembers: updatedMembers })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 1: Personal and Household Information</h2>
        <p className="text-gray-600">Provide your basic personal information and details about your household.</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth (mm/dd/yyyy)</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="ssn">Social Security Number or ITIN</Label>
              <Input
                id="ssn"
                value={formData.ssn}
                onChange={(e) => updateFormData({ ssn: e.target.value })}
                placeholder="XXX-XX-XXXX"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label>Marital Status</Label>
            <RadioGroup
              value={formData.maritalStatus}
              onValueChange={(value: "unmarried" | "married") => updateFormData({ maritalStatus: value })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unmarried" id="unmarried" className="text-[#22b573]" />
                <Label htmlFor="unmarried">Unmarried</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="married" id="married" className="text-[#22b573]" />
                <Label htmlFor="married">Married</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.maritalStatus === "married" && (
            <div>
              <Label htmlFor="marriageDate">Date of Marriage (mm/dd/yyyy)</Label>
              <Input
                id="marriageDate"
                type="date"
                value={formData.marriageDate}
                onChange={(e) => updateFormData({ marriageDate: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
              />
            </div>
          )}

          <div>
            <Label htmlFor="homeAddress">Home Physical Address (street, city, state, ZIP code)</Label>
            <Input
              id="homeAddress"
              value={formData.homeAddress}
              onChange={(e) => updateFormData({ homeAddress: e.target.value })}
              className="focus:ring-[#22b573] focus:border-[#22b573]"
            />
          </div>

          <div>
            <Label>Do you</Label>
            <RadioGroup
              value={formData.homeOwnership}
              onValueChange={(value: "own" | "rent" | "other") => updateFormData({ homeOwnership: value })}
              className="flex flex-wrap gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="own" id="own" className="text-[#22b573]" />
                <Label htmlFor="own">Own your home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="rent" className="text-[#22b573]" />
                <Label htmlFor="rent">Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" className="text-[#22b573]" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>

            {formData.homeOwnership === "other" && (
              <div className="mt-3">
                <Input
                  placeholder="Specify (e.g., share rent, live with relative, etc.)"
                  value={formData.homeOwnershipOther}
                  onChange={(e) => updateFormData({ homeOwnershipOther: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="communityProperty"
              checked={formData.communityPropertyState}
              onCheckedChange={(checked) => updateFormData({ communityPropertyState: !!checked })}
              className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
            />
            <Label htmlFor="communityProperty" className="text-sm">
              If you were married and lived in AZ, CA, ID, LA, NM, NV, TX, WA or WI within the last ten years check here
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="county">County of Residence</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => updateFormData({ county: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={formData.primaryPhone}
                onChange={(e) => updateFormData({ primaryPhone: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={(e) => updateFormData({ secondaryPhone: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="faxNumber">FAX Number</Label>
              <Input
                id="faxNumber"
                value={formData.faxNumber}
                onChange={(e) => updateFormData({ faxNumber: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="mailingAddress">
                Home Mailing Address (if different from above or post office box number)
              </Label>
              <Input
                id="mailingAddress"
                value={formData.mailingAddress}
                onChange={(e) => updateFormData({ mailingAddress: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spouse Information */}
      {formData.maritalStatus === "married" && (
        <Card>
          <CardHeader>
            <CardTitle>Spouse Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouseFirstName">Spouse's First Name</Label>
                <Input
                  id="spouseFirstName"
                  value={formData.spouseFirstName}
                  onChange={(e) => updateFormData({ spouseFirstName: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="spouseLastName">Spouse's Last Name</Label>
                <Input
                  id="spouseLastName"
                  value={formData.spouseLastName}
                  onChange={(e) => updateFormData({ spouseLastName: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouseDateOfBirth">Date of Birth (mm/dd/yyyy)</Label>
                <Input
                  id="spouseDateOfBirth"
                  type="date"
                  value={formData.spouseDateOfBirth}
                  onChange={(e) => updateFormData({ spouseDateOfBirth: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="spouseSSN">Social Security Number</Label>
                <Input
                  id="spouseSSN"
                  value={formData.spouseSSN}
                  onChange={(e) => updateFormData({ spouseSSN: e.target.value })}
                  placeholder="XXX-XX-XXXX"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Household Members */}
      <Card>
        <CardHeader>
          <CardTitle>Household Members and Dependents</CardTitle>
          <p className="text-sm text-gray-600">
            Provide information for all other persons in the household or claimed as a dependent.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.householdMembers.map((member, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Household Member {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeHouseholdMember(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`member-name-${index}`}>Name</Label>
                  <Input
                    id={`member-name-${index}`}
                    value={member.name}
                    onChange={(e) => updateHouseholdMember(index, "name", e.target.value)}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-age-${index}`}>Age</Label>
                  <Input
                    id={`member-age-${index}`}
                    value={member.age}
                    onChange={(e) => updateHouseholdMember(index, "age", e.target.value)}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-relationship-${index}`}>Relationship</Label>
                  <Input
                    id={`member-relationship-${index}`}
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(index, "relationship", e.target.value)}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-dependent-${index}`}
                    checked={member.claimedAsDependent}
                    onCheckedChange={(checked) => updateHouseholdMember(index, "claimedAsDependent", !!checked)}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                  <Label htmlFor={`member-dependent-${index}`} className="text-sm">
                    Claimed as a dependent on your Form 1040
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-income-${index}`}
                    checked={member.contributesToIncome}
                    onCheckedChange={(checked) => updateHouseholdMember(index, "contributesToIncome", !!checked)}
                    className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]"
                  />
                  <Label htmlFor={`member-income-${index}`} className="text-sm">
                    Contributes to household income
                  </Label>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addHouseholdMember}
            className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Household Member
          </Button>
        </CardContent>
      </Card>

      <FormNavigation currentStep={currentStep} totalSteps={totalSteps} onPrevious={onPrevious} onNext={onNext} />
    </div>
  )
}
