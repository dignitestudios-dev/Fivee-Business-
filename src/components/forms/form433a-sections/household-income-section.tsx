import { FormNavigation } from "./form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface HouseholdIncomeSectionProps {
  formData: FormData433A
  updateFormData: (updates: Partial<FormData433A>) => void
}

export function HouseholdIncomeSection({ formData, updateFormData }: HouseholdIncomeSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 7: Monthly Household Income and Expense Information
        </h2>
        <p className="text-gray-600">
          Enter your household's average gross monthly income. Include information for yourself, your spouse, and anyone
          else who contributes to your household's income.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Round to the nearest whole dollar. Entire household income should also include income that is considered not
          taxable.
        </p>
      </div>

      {/* Monthly Household Income */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Household Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Taxpayer Income */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Primary Taxpayer</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="primaryGrossWages">Gross Wages ($)</Label>
                <Input
                  id="primaryGrossWages"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="primarySocialSecurity">Social Security ($)</Label>
                <Input
                  id="primarySocialSecurity"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="primaryPensions">Pension(s) ($)</Label>
                <Input
                  id="primaryPensions"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="primaryOtherIncome">Other Income ($)</Label>
                <Input
                  id="primaryOtherIncome"
                  type="number"
                  placeholder="0"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
                <p className="text-xs text-gray-500 mt-1">e.g. unemployment</p>
              </div>
            </div>
            <div className="bg-[#22b573]/5 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Primary Taxpayer Income</span>
                <span className="text-xl font-bold text-[#22b573]">$0</span>
              </div>
            </div>
          </div>

          {/* Spouse Income */}
          {formData.maritalStatus === "married" && (
            <div className="p-4 border border-gray-200 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900">Spouse</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="spouseGrossWages">Gross Wages ($)</Label>
                  <Input
                    id="spouseGrossWages"
                    type="number"
                    placeholder="0"
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
                <div>
                  <Label htmlFor="spouseSocialSecurity">Social Security ($)</Label>
                  <Input
                    id="spouseSocialSecurity"
                    type="number"
                    placeholder="0"
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
                <div>
                  <Label htmlFor="spousePensions">Pension(s) ($)</Label>
                  <Input
                    id="spousePensions"
                    type="number"
                    placeholder="0"
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
                <div>
                  <Label htmlFor="spouseOtherIncome">Other Income ($)</Label>
                  <Input
                    id="spouseOtherIncome"
                    type="number"
                    placeholder="0"
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g. unemployment</p>
                </div>
              </div>
              <div className="bg-[#22b573]/5 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Spouse Income</span>
                  <span className="text-xl font-bold text-[#22b573]">$0</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Income Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="interestDividendsRoyalties">Interest, Dividends, and Royalties ($)</Label>
              <Input
                id="interestDividendsRoyalties"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="additionalSources">Additional Sources of Income ($)</Label>
              <Input
                id="additionalSources"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additionalSourcesList">List Source(s) of Additional Income</Label>
            <Textarea
              id="additionalSourcesList"
              placeholder="e.g., non-liable spouse, or anyone else who may contribute to the household income"
              className="focus:ring-[#22b573] focus:border-[#22b573]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="distributions">Distributions ($)</Label>
              <Input
                id="distributions"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">e.g., income from partnerships, sub-S Corporations, etc.</p>
            </div>
            <div>
              <Label htmlFor="netRentalIncome">Net Rental Income ($)</Label>
              <Input
                id="netRentalIncome"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="netBusinessIncomeFromBoxC">Net Business Income from Box C ($)</Label>
              <Input
                id="netBusinessIncomeFromBoxC"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Deductions for non-cash expenses must be added back in</p>
            </div>
            <div>
              <Label htmlFor="childSupportReceived">Child Support Received ($)</Label>
              <Input
                id="childSupportReceived"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="alimonyReceived">Alimony Received ($)</Label>
            <Input
              id="alimonyReceived"
              type="number"
              placeholder="0"
              className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
            />
          </div>

          <div className="bg-[#22b573]/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Household Income (Box D)</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Calculated automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Household Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Household Expenses</CardTitle>
          <p className="text-sm text-gray-600">
            Enter your average monthly expenses. For expenses claimed in boxes (39) and (45) only, you should list the
            full amount of the allowable standard even if the actual amount you pay is less.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="foodClothingMisc">Food, Clothing, and Miscellaneous ($)</Label>
              <Input
                id="foodClothingMisc"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Housekeeping supplies, personal care products, minimum payment on credit card
              </p>
            </div>
            <div>
              <Label htmlFor="housingUtilities">Housing and Utilities ($)</Label>
              <Input
                id="housingUtilities"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Rent or mortgage payment, property taxes, home insurance, maintenance, utilities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="vehicleLoanLease">Vehicle Loan and/or Lease Payment(s) ($)</Label>
              <Input
                id="vehicleLoanLease"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="vehicleOperatingCosts">Vehicle Operating Costs ($)</Label>
              <Input
                id="vehicleOperatingCosts"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maintenance, repairs, insurance, fuel, registrations, licenses, inspections, parking, tolls
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="publicTransportation">Public Transportation Costs ($)</Label>
              <Input
                id="publicTransportation"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Fares for mass transit such as bus, train, ferry, etc.</p>
            </div>
            <div>
              <Label htmlFor="healthInsurancePremiums">Health Insurance Premiums ($)</Label>
              <Input
                id="healthInsurancePremiums"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="outOfPocketHealthcare">Out-of-Pocket Health Care Costs ($)</Label>
              <Input
                id="outOfPocketHealthcare"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Prescription drugs, medical services, medical supplies like eyeglasses, hearing aids, etc.
              </p>
            </div>
            <div>
              <Label htmlFor="courtOrderedPayments">Court-Ordered Payments ($)</Label>
              <Input
                id="courtOrderedPayments"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly cost of any alimony, child support, etc.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="childDependentCare">Child/Dependent Care Payments ($)</Label>
              <Input
                id="childDependentCare"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Daycare, etc.</p>
            </div>
            <div>
              <Label htmlFor="lifeInsurancePremiums">Life Insurance Premiums ($)</Label>
              <Input
                id="lifeInsurancePremiums"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lifeInsurancePolicyAmount">Life Insurance Policy Amount ($)</Label>
            <Input
              id="lifeInsurancePolicyAmount"
              type="number"
              placeholder="0"
              className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentMonthlyTaxes">Current Monthly Taxes ($)</Label>
              <Input
                id="currentMonthlyTaxes"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
              <p className="text-xs text-gray-500 mt-1">Federal, state, and local tax, personal property tax, etc.</p>
            </div>
            <div>
              <Label htmlFor="delinquentStateTaxes">Monthly Delinquent State and/or Local Tax Payment(s) ($)</Label>
              <Input
                id="delinquentStateTaxes"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="totalTaxOwed">Total Tax Owed ($)</Label>
            <Input
              id="totalTaxOwed"
              type="number"
              placeholder="0"
              className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
            />
          </div>

          <div>
            <Label htmlFor="securedDebtsOther">Secured Debts/Other ($)</Label>
            <Input
              id="securedDebtsOther"
              type="number"
              placeholder="0"
              className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Any loan where you pledged an asset as collateral not previously listed, government guaranteed student
              loan, employer required retirement or dues
            </p>
          </div>

          <div>
            <Label htmlFor="listDebtsExpenses">List Debt(s)/Expense(s)</Label>
            <Textarea id="listDebtsExpenses" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div className="bg-[#22b573]/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Household Expenses (Box E)</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Calculated automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Monthly Income */}
      <Card>
        <CardHeader>
          <CardTitle>Remaining Monthly Income Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#22b573]/5 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Remaining Monthly Income (Box F)</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-[#22b573]">$0</span>
                <p className="text-xs text-gray-500">Box D minus Box E</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={7} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
