import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface PersonalAssetsSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function PersonalAssetsSection({ formData, updateFormData }: PersonalAssetsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 3: Personal Asset Information (Domestic and Foreign)
        </h2>
        <p className="text-gray-600">
          Use the most current statement for each type of account. Asset value is subject to adjustment by IRS based on
          individual circumstances.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Round to the nearest dollar. Do not enter a negative number. If any line item is a negative number, enter "0".
        </p>
      </div>

      {/* Cash and Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Cash and Investments (Domestic and Foreign)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bank Account 1 */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Bank Account 1</h4>
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
                    <Label className="text-sm">Money Market Account/CD</Label>
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
                <Label htmlFor="bankAmount1">Amount ($)</Label>
                <Input
                  id="bankAmount1"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName1">Bank Name and Country Location</Label>
                <Input id="bankName1" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="accountNumber1">Account Number</Label>
                <Input id="accountNumber1" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
          </div>

          {/* Investment Accounts */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Investment Account</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Investment Type</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Stocks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Bonds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Other</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investmentInstitution">Name of Financial Institution and Country Location</Label>
                <Input id="investmentInstitution" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="investmentAccount">Account Number</Label>
                <Input id="investmentAccount" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentMarketValue">Current Market Value ($)</Label>
                <Input
                  id="currentMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="loanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="loanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="netValue">Net Value ($)</Label>
                <Input
                  id="netValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>

          {/* Digital Assets */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Digital Assets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="digitalAssetDescription">Description of Digital Asset</Label>
                <Input
                  id="digitalAssetDescription"
                  placeholder="e.g., Bitcoin, Ethereum, NFT"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="digitalAssetUnits">Number of Units</Label>
                <Input
                  id="digitalAssetUnits"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="digitalAssetLocation">Location of Digital Asset</Label>
                <Input
                  id="digitalAssetLocation"
                  placeholder="Exchange account, self-hosted wallet"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="digitalAssetValue">US Dollar Equivalent ($)</Label>
                <Input
                  id="digitalAssetValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="digitalAssetAddress">Digital Asset Address (for self-hosted digital assets)</Label>
              <Input id="digitalAssetAddress" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          {/* Retirement Accounts */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Retirement Account</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">401K</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">IRA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573]" />
                    <Label className="text-sm">Other</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retirementInstitution">Name of Financial Institution and Country Location</Label>
                <Input id="retirementInstitution" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="retirementAccount">Account Number</Label>
                <Input id="retirementAccount" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="retirementMarketValue">Current Market Value ($)</Label>
                <Input
                  id="retirementMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="retirementMultiplier">× 0.8 =</Label>
                <Input
                  id="retirementMultiplier"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="retirementLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="retirementLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="retirementNetValue">Net Value ($)</Label>
                <Input
                  id="retirementNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Note: Your reduction from current market value may be greater than 20% due to potential tax
              consequences/withdrawal penalties.
            </p>
          </div>

          {/* Life Insurance */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Cash Value of Life Insurance Policies</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceCompany">Name of Insurance Company</Label>
                <Input id="insuranceCompany" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input id="policyNumber" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cashValue">Current Cash Value ($)</Label>
                <Input
                  id="cashValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="insuranceLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="insuranceLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="insuranceNetValue">Net Value ($)</Label>
                <Input
                  id="insuranceNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Property */}
      <Card>
        <CardHeader>
          <CardTitle>Real Property</CardTitle>
          <p className="text-sm text-gray-600">
            Enter information about any house, condo, co-op, time share, etc. that you own.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>
              Is your real property currently for sale or do you anticipate selling your real property to fund the offer
              amount?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="property-sale-yes" className="text-[#22b573]" />
                <Label htmlFor="property-sale-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="property-sale-no" className="text-[#22b573]" />
                <Label htmlFor="property-sale-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Property 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyDescription">Property Description</Label>
                <Input
                  id="propertyDescription"
                  placeholder="Personal residence, rental property, vacant, etc."
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date (mm/dd/yyyy)</Label>
                <Input id="purchaseDate" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mortgagePayment">Amount of Mortgage Payment ($)</Label>
                <Input
                  id="mortgagePayment"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="finalPaymentDate">Date of Final Payment</Label>
                <Input id="finalPaymentDate" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="titleHeld">How Title is Held</Label>
                <Input
                  id="titleHeld"
                  placeholder="Joint tenancy, etc."
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="propertyLocation">Location (street, city, state, ZIP code, county, and country)</Label>
              <Textarea id="propertyLocation" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="lenderInfo">Lender/Contract Holder Name, Address and Phone</Label>
              <Textarea id="lenderInfo" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="propertyMarketValue">Current Market Value ($)</Label>
                <Input
                  id="propertyMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="propertyMultiplier">× 0.8 =</Label>
                <Input
                  id="propertyMultiplier"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="propertyLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="propertyLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="propertyNetValue">Total Value ($)</Label>
                <Input
                  id="propertyNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <p className="text-sm text-gray-600">
            Enter information about any cars, boats, motorcycles, etc. that you own or lease.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Vehicle 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="vehicleMake">Vehicle Make & Model</Label>
                <Input id="vehicleMake" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="vehicleYear">Year</Label>
                <Input id="vehicleYear" type="number" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="datePurchased">Date Purchased</Label>
                <Input id="datePurchased" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input id="mileage" type="number" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseTag">License/Tag Number</Label>
                <Input id="licenseTag" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label>Ownership</Label>
                <RadioGroup className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lease" id="vehicle-lease" className="text-[#22b573]" />
                    <Label htmlFor="vehicle-lease">Lease</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="own" id="vehicle-own" className="text-[#22b573]" />
                    <Label htmlFor="vehicle-own">Own</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="creditorName">Name of Creditor</Label>
                <Input id="creditorName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="vehicleFinalPayment">Date of Final Payment</Label>
                <Input id="vehicleFinalPayment" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
              <div>
                <Label htmlFor="monthlyPayment">Monthly Lease/Loan Amount ($)</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="vehicleMarketValue">Current Market Value ($)</Label>
                <Input
                  id="vehicleMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="vehicleMultiplier">× 0.8 =</Label>
                <Input
                  id="vehicleMultiplier"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="vehicleLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="vehicleLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="vehicleNetValue">Total Value ($)</Label>
                <Input
                  id="vehicleNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Valuable Items */}
      <Card>
        <CardHeader>
          <CardTitle>Other Valuable Items</CardTitle>
          <p className="text-sm text-gray-600">
            Artwork, collections, jewelry, items of value in safe deposit boxes, interest in a company or business that
            is not publicly traded, etc.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div>
              <Label htmlFor="valuableDescription">Description of Asset(s)</Label>
              <Textarea id="valuableDescription" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="valuableMarketValue">Current Market Value ($)</Label>
                <Input
                  id="valuableMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="valuableMultiplier">× 0.8 =</Label>
                <Input
                  id="valuableMultiplier"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="valuableLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="valuableLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="valuableNetValue">Net Value ($)</Label>
                <Input
                  id="valuableNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Value of Remaining Furniture and Personal Effects</h4>
            <div>
              <Label htmlFor="furnitureDescription">Description of Asset</Label>
              <Textarea id="furnitureDescription" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="furnitureMarketValue">Current Market Value ($)</Label>
                <Input
                  id="furnitureMarketValue"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="furnitureMultiplier">× 0.8 =</Label>
                <Input
                  id="furnitureMultiplier"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="furnitureLoanBalance">Minus Loan Balance ($)</Label>
                <Input
                  id="furnitureLoanBalance"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="furnitureNetValue">Net Value ($)</Label>
                <Input
                  id="furnitureNetValue"
                  type="number"
                  placeholder="0"
                  readOnly
                  className="bg-gray-50 focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#22b573]/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Available Individual Equity in Assets (Box A)</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Calculated automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={3} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
