import { FormNavigation } from "./form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BusinessIncomeSectionProps {
  formData: FormData433A
  updateFormData: (updates: Partial<FormData433A>) => void
}

export function BusinessIncomeSection({ formData, updateFormData }: BusinessIncomeSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 6: Business Income and Expense Information (for Self-Employed)
        </h2>
        <p className="text-gray-600">
          If you provide a current profit and loss (P&L) statement for the information below, enter the total gross
          monthly income on line 17 and your monthly expenses on line 29 below.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Round to the nearest whole dollar. Do not enter a negative number. If any line item is a negative number,
          enter "0".
        </p>
      </div>

      {/* Period Information */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodBeginning">Period Provided Beginning</Label>
              <Input id="periodBeginning" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="periodThrough">Through</Label>
              <Input id="periodThrough" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Income */}
      <Card>
        <CardHeader>
          <CardTitle>Business Income</CardTitle>
          <p className="text-sm text-gray-600">
            You may average 6-12 months income/receipts to determine your gross monthly income/receipts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="grossReceipts">Gross Receipts ($)</Label>
              <Input
                id="grossReceipts"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="grossRentalIncome">Gross Rental Income ($)</Label>
              <Input
                id="grossRentalIncome"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="interestIncome">Interest Income ($)</Label>
              <Input
                id="interestIncome"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="dividends">Dividends ($)</Label>
              <Input
                id="dividends"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="otherBusinessIncome">Other Income ($)</Label>
              <Input
                id="otherBusinessIncome"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div className="bg-[#22b573]/5 p-4 rounded-lg">
              <Label className="font-medium">Total Business Income ($)</Label>
              <div className="text-2xl font-bold text-[#22b573] mt-1">$0</div>
              <p className="text-xs text-gray-500">Calculated automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Business Expenses</CardTitle>
          <p className="text-sm text-gray-600">
            You may average 6-12 months expenses to determine your average expenses
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="materialsPurchased">Materials Purchased ($)</Label>
              <Input
                id="materialsPurchased"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Items directly related to the production of a product or service
              </p>
            </div>
            <div>
              <Label htmlFor="inventoryPurchased">Inventory Purchased ($)</Label>
              <Input
                id="inventoryPurchased"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Goods bought for resale</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="grossWages">Gross Wages and Salaries ($)</Label>
              <Input
                id="grossWages"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="businessRent">Rent ($)</Label>
              <Input
                id="businessRent"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="businessSupplies">Supplies ($)</Label>
              <Input
                id="businessSupplies"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Items used to conduct business and used up within one year</p>
            </div>
            <div>
              <Label htmlFor="utilitiesTelephones">Utilities/Telephones ($)</Label>
              <Input
                id="utilitiesTelephones"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="vehicleCosts">Vehicle Costs ($)</Label>
              <Input
                id="vehicleCosts"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Gas, oil, repairs, maintenance</p>
            </div>
            <div>
              <Label htmlFor="businessInsurance">Business Insurance ($)</Label>
              <Input
                id="businessInsurance"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentBusinessTaxes">Current Business Taxes ($)</Label>
              <Input
                id="currentBusinessTaxes"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Real estate, excise, franchise, occupational, personal property, sales and employer's portion of
                employment taxes
              </p>
            </div>
            <div>
              <Label htmlFor="securedDebts">Secured Debts (not credit cards) ($)</Label>
              <Input
                id="securedDebts"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="otherBusinessExpenses">Other Business Expenses ($)</Label>
              <Input
                id="otherBusinessExpenses"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Include a list</p>
            </div>
            <div className="bg-[#22b573]/5 p-4 rounded-lg">
              <Label className="font-medium">Total Business Expenses ($)</Label>
              <div className="text-2xl font-bold text-[#22b573] mt-1">$0</div>
              <p className="text-xs text-gray-500">Calculated automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Business Income */}
      <Card>
        <CardHeader>
          <CardTitle>Net Business Income Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#22b573]/5 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Net Business Income (Box C)</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Total Income minus Total Expenses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={6} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
