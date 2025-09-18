import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/forms/form433a-sections/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface BusinessAssetsSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function BusinessAssetsSection({ formData, updateFormData }: BusinessAssetsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 5: Business Asset Information (for Self-Employed)
        </h2>
        <p className="text-gray-600">
          List business assets including bank accounts, digital assets, tools, books, machinery, equipment, business
          vehicles and real property that is owned/leased/rented.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Do not include personal assets listed in Section 3. Round to the nearest whole dollar. Do not enter a negative
          number.
        </p>
      </div>

      {/* Business Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Business Bank Accounts and Digital Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Bank Account 1 */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Business Bank Account 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Checking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Savings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Money Market/CD</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Online Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Stored Value Card</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="businessBankAmount1">Amount ($)</Label>
                <Input
                  id="businessBankAmount1"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessBankName1">Bank Name and Country Location</Label>
                <Input id="businessBankName1" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="businessAccountNumber1">Account Number</Label>
                <Input id="businessAccountNumber1" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
          </div>

          {/* Business Digital Assets */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Business Digital Assets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessDigitalAssetDescription">Description of Digital Asset</Label>
                <Input
                  id="businessDigitalAssetDescription"
                  placeholder="e.g., Bitcoin, Ethereum, NFT"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessDigitalAssetUnits">Number of Units</Label>
                <Input
                  id="businessDigitalAssetUnits"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessDigitalAssetLocation">Location of Digital Asset</Label>
                <Input
                  id="businessDigitalAssetLocation"
                  placeholder="Exchange account, self-hosted wallet"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessDigitalAssetValue">US Dollar Equivalent ($)</Label>
                <Input
                  id="businessDigitalAssetValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessDigitalAssetAddress">
                Digital Asset Address (for self-hosted digital assets)
              </Label>
              <Input id="businessDigitalAssetAddress" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Equipment and Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Business Equipment and Other Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Business Asset 1</h4>
            <div>
              <Label htmlFor="businessAssetDescription1">Description of Asset</Label>
              <Textarea
                id="businessAssetDescription1"
                placeholder="Tools, books, machinery, equipment, business vehicles, etc."
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="businessAssetMarketValue1">Current Market Value ($)</Label>
                <Input
                  id="businessAssetMarketValue1"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetMultiplier1">× 0.8 =</Label>
                <Input
                  id="businessAssetMultiplier1"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetLoanBalance1">Minus Loan Balance ($)</Label>
                <Input
                  id="businessAssetLoanBalance1"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetNetValue1">Total Value ($)</Label>
                <Input
                  id="businessAssetNetValue1"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Note: If leased or used in the production of income, enter 0 as the total value.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Business Asset 2</h4>
            <div>
              <Label htmlFor="businessAssetDescription2">Description of Asset</Label>
              <Textarea
                id="businessAssetDescription2"
                placeholder="Tools, books, machinery, equipment, business vehicles, etc."
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="businessAssetMarketValue2">Current Market Value ($)</Label>
                <Input
                  id="businessAssetMarketValue2"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetMultiplier2">× 0.8 =</Label>
                <Input
                  id="businessAssetMultiplier2"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetLoanBalance2">Minus Loan Balance ($)</Label>
                <Input
                  id="businessAssetLoanBalance2"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="businessAssetNetValue2">Total Value ($)</Label>
                <Input
                  id="businessAssetNetValue2"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Note: If leased or used in the production of income, enter 0 as the total value.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">IRS Deductions</h4>
            <div>
              <Label htmlFor="irsDeduction">
                IRS allowed deduction for professional books and tools of trade for individuals and sole-proprietors ($)
              </Label>
              <Input
                id="irsDeduction"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and Accounts Receivable */}
      <Card>
        <CardHeader>
          <CardTitle>Notes and Accounts Receivable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Do you have notes receivable?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="notes-receivable-yes" className="text-[#22b573]" />
                <Label htmlFor="notes-receivable-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="notes-receivable-no" className="text-[#22b573]" />
                <Label htmlFor="notes-receivable-no">No</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-2">
              If yes, attach current listing that includes name(s) and amount of note(s) receivable
            </p>
          </div>

          <div>
            <Label>
              Do you have accounts receivable, including e-payment, factoring companies, and any bartering or online
              auction accounts?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="accounts-receivable-yes" className="text-[#22b573]" />
                <Label htmlFor="accounts-receivable-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="accounts-receivable-no" className="text-[#22b573]" />
                <Label htmlFor="accounts-receivable-no">No</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-2">
              If yes, provide a list of your current accounts receivable (include the age and amount)
            </p>
          </div>

          <div className="bg-[#22b573]/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Available Business Equity in Assets (Box B)</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Calculated automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={5} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
