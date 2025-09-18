import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface SelfEmployedSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function SelfEmployedSection({ formData, updateFormData }: SelfEmployedSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 4: Self-Employed Information</h2>
        <p className="text-gray-600">
          If you or your spouse are self-employed (e.g., files Schedule(s) C, E, F, etc.), complete this section.
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Is your business a sole proprietorship?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sole-prop-yes" className="text-[#22b573]" />
                <Label htmlFor="sole-prop-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sole-prop-no" className="text-[#22b573]" />
                <Label htmlFor="sole-prop-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="businessName">Name of Business</Label>
            <Input id="businessName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div>
            <Label htmlFor="businessAddress">Address of Business (if other than personal residence)</Label>
            <Textarea id="businessAddress" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="businessPhone">Business Telephone Number</Label>
              <Input id="businessPhone" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="businessEIN">Employer Identification Number</Label>
              <Input
                id="businessEIN"
                placeholder="XX-XXXXXXX"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="businessWebsite">Business Website Address</Label>
              <Input
                id="businessWebsite"
                placeholder="https://"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tradeName">Trade Name or DBA</Label>
              <Input id="tradeName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="businessDescription">Description of Business</Label>
              <Input id="businessDescription" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="totalEmployees">Total Number of Employees</Label>
              <Input
                id="totalEmployees"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="taxDepositFreq">Frequency of Tax Deposits</Label>
              <Input
                id="taxDepositFreq"
                placeholder="Monthly, Quarterly, etc."
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="avgMonthlyPayroll">Average Gross Monthly Payroll ($)</Label>
              <Input
                id="avgMonthlyPayroll"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Business Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Other Business Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>
              Do you or your spouse have any other business interests? Include any interest in an LLC, LLP, corporation,
              partnership, etc.
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="other-business-yes" className="text-[#22b573]" />
                <Label htmlFor="other-business-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="other-business-no" className="text-[#22b573]" />
                <Label htmlFor="other-business-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Other Business Interest</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownershipPercentage">Percentage of Ownership (%)</Label>
                <Input
                  id="ownershipPercentage"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessTitle">Title</Label>
                <Input id="businessTitle" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>

            <div>
              <Label htmlFor="otherBusinessAddress">Business Address (street, city, state, ZIP code)</Label>
              <Textarea id="otherBusinessAddress" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="otherBusinessName">Business Name</Label>
                <Input id="otherBusinessName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="otherBusinessPhone">Business Telephone Number</Label>
                <Input id="otherBusinessPhone" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="otherBusinessEIN">Employer Identification Number</Label>
                <Input
                  id="otherBusinessEIN"
                  placeholder="XX-XXXXXXX"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>

            <div>
              <Label>Type of Business</Label>
              <RadioGroup className="flex flex-wrap gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partnership" id="business-partnership" className="text-[#22b573]" />
                  <Label htmlFor="business-partnership">Partnership</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="llc" id="business-llc" className="text-[#22b573]" />
                  <Label htmlFor="business-llc">LLC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporation" id="business-corporation" className="text-[#22b573]" />
                  <Label htmlFor="business-corporation">Corporation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="business-other" className="text-[#22b573]" />
                  <Label htmlFor="business-other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={4} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
