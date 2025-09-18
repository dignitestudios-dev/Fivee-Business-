"use client"

import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EmploymentSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function EmploymentSection({ formData, updateFormData }: EmploymentSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 2: Employment Information for Wage Earners</h2>
        <p className="text-gray-600">
          Complete this section if you or your spouse are wage earners and receive a Form W-2.
        </p>
      </div>

      {/* Your Employment */}
      <Card>
        <CardHeader>
          <CardTitle>Your Employment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employerName">Your Employer's Name</Label>
              <Input
                id="employerName"
                value={formData.employerName || ""}
                onChange={(e) => updateFormData({ employerName: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label>Pay Period</Label>
              <RadioGroup
                value={formData.payPeriod || "weekly"}
                onValueChange={(value: "weekly" | "bi-weekly" | "monthly" | "other") =>
                  updateFormData({ payPeriod: value })
                }
                className="flex flex-wrap gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" className="text-[#22b573]" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bi-weekly" id="bi-weekly" className="text-[#22b573]" />
                  <Label htmlFor="bi-weekly">Bi-weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" className="text-[#22b573]" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" className="text-[#22b573]" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label htmlFor="employerAddress">Employer's Address (street, city, state, ZIP code)</Label>
            <Input
              id="employerAddress"
              value={formData.employerAddress || ""}
              onChange={(e) => updateFormData({ employerAddress: e.target.value })}
              className="focus:ring-[#22b573] focus:border-[#22b573]"
            />
          </div>

          <div>
            <Label>Do you have an ownership interest in this business?</Label>
            <RadioGroup
              value={formData.ownershipInterest ? "yes" : "no"}
              onValueChange={(value) => updateFormData({ ownershipInterest: value === "yes" })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ownership-yes" className="text-[#22b573]" />
                <Label htmlFor="ownership-yes">Yes (also complete and submit Form 433-B)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ownership-no" className="text-[#22b573]" />
                <Label htmlFor="ownership-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="occupation">Your Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation || ""}
                onChange={(e) => updateFormData({ occupation: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label>How long with this employer</Label>
              <div className="flex gap-2 mt-1">
                <div className="flex-1">
                  <Input
                    placeholder="Years"
                    value={formData.employmentYears || ""}
                    onChange={(e) => updateFormData({ employmentYears: e.target.value })}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                  <Label className="text-xs text-gray-500 mt-1">Years</Label>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Months"
                    value={formData.employmentMonths || ""}
                    onChange={(e) => updateFormData({ employmentMonths: e.target.value })}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                  <Label className="text-xs text-gray-500 mt-1">Months</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spouse Employment */}
      {formData.maritalStatus === "married" && (
        <Card>
          <CardHeader>
            <CardTitle>Spouse's Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouseEmployerName">Spouse's Employer's Name</Label>
                <Input
                  id="spouseEmployerName"
                  value={formData.spouseEmployerName || ""}
                  onChange={(e) => updateFormData({ spouseEmployerName: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label>Pay Period</Label>
                <RadioGroup
                  value={formData.spousePayPeriod || "weekly"}
                  onValueChange={(value: "weekly" | "bi-weekly" | "monthly" | "other") =>
                    updateFormData({ spousePayPeriod: value })
                  }
                  className="flex flex-wrap gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="spouse-weekly" className="text-[#22b573]" />
                    <Label htmlFor="spouse-weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bi-weekly" id="spouse-bi-weekly" className="text-[#22b573]" />
                    <Label htmlFor="spouse-bi-weekly">Bi-weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="spouse-monthly" className="text-[#22b573]" />
                    <Label htmlFor="spouse-monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="spouse-other" className="text-[#22b573]" />
                    <Label htmlFor="spouse-other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="spouseEmployerAddress">Employer's Address (street, city, state, ZIP code)</Label>
              <Input
                id="spouseEmployerAddress"
                value={formData.spouseEmployerAddress || ""}
                onChange={(e) => updateFormData({ spouseEmployerAddress: e.target.value })}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>

            <div>
              <Label>Does your spouse have an ownership interest in this business?</Label>
              <RadioGroup
                value={formData.spouseOwnershipInterest ? "yes" : "no"}
                onValueChange={(value) => updateFormData({ spouseOwnershipInterest: value === "yes" })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="spouse-ownership-yes" className="text-[#22b573]" />
                  <Label htmlFor="spouse-ownership-yes">Yes (also complete and submit Form 433-B)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="spouse-ownership-no" className="text-[#22b573]" />
                  <Label htmlFor="spouse-ownership-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouseOccupation">Spouse's Occupation</Label>
                <Input
                  id="spouseOccupation"
                  value={formData.spouseOccupation || ""}
                  onChange={(e) => updateFormData({ spouseOccupation: e.target.value })}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label>How long with this employer</Label>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1">
                    <Input
                      placeholder="Years"
                      value={formData.spouseEmploymentYears || ""}
                      onChange={(e) => updateFormData({ spouseEmploymentYears: e.target.value })}
                      className="focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                    <Label className="text-xs text-gray-500 mt-1">Years</Label>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Months"
                      value={formData.spouseEmploymentMonths || ""}
                      onChange={(e) => updateFormData({ spouseEmploymentMonths: e.target.value })}
                      className="focus:ring-[#22b573] focus:border-[#22b573]"
                    />
                    <Label className="text-xs text-gray-500 mt-1">Months</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormNavigation currentStep={2} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
