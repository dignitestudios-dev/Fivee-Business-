import { FormNavigation } from "./form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CalculationSectionProps {
  formData: FormData433A
  updateFormData: (updates: Partial<FormData433A>) => void
}

export function CalculationSection({ formData, updateFormData }: CalculationSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 8: Calculate Your Minimum Offer Amount</h2>
        <p className="text-gray-600">
          The amount of time you take to pay your offer in full will affect your minimum offer amount. Paying over a
          shorter period of time will result in a smaller minimum offer amount.
        </p>
        <p className="text-sm text-gray-500 mt-2">Round to the nearest whole dollar.</p>
      </div>

      {/* Payment Timeline Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Timeline</CardTitle>
          <p className="text-sm text-gray-600">Choose how you plan to pay your offer amount</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Payment Timeline</Label>
            <RadioGroup className="mt-2 space-y-3">
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="5-months" id="5-months" className="text-[#22b573] mt-1" />
                <div className="flex-1">
                  <Label htmlFor="5-months" className="font-medium">
                    5 or fewer payments within 5 months or less
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Results in lower minimum offer amount</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="6-24-months" id="6-24-months" className="text-[#22b573] mt-1" />
                <div className="flex-1">
                  <Label htmlFor="6-24-months" className="font-medium">
                    6 to 24 months
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Results in higher minimum offer amount</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 5 Month Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>5 Month Payment Calculation</CardTitle>
          <p className="text-sm text-gray-600">
            If you will pay your offer in 5 or fewer payments within 5 months or less
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="boxF5Month">Enter the total from Box F</Label>
              <Input
                id="boxF5Month"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div className="text-2xl font-bold text-gray-600 px-4">×</div>
            <div className="flex-1">
              <Label>Multiplier</Label>
              <Input value="12" readOnly className="bg-gray-50 text-center font-bold" />
            </div>
            <div className="text-2xl font-bold text-gray-600 px-4">=</div>
            <div className="flex-1">
              <Label>Future Remaining Income (Box G)</Label>
              <Input type="number" placeholder="0" readOnly className="bg-[#22b573]/5 font-bold text-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 24 Month Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>24 Month Payment Calculation</CardTitle>
          <p className="text-sm text-gray-600">If you will pay your offer in 6 to 24 months</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="boxF24Month">Enter the total from Box F</Label>
              <Input
                id="boxF24Month"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div className="text-2xl font-bold text-gray-600 px-4">×</div>
            <div className="flex-1">
              <Label>Multiplier</Label>
              <Input value="24" readOnly className="bg-gray-50 text-center font-bold" />
            </div>
            <div className="text-2xl font-bold text-gray-600 px-4">=</div>
            <div className="flex-1">
              <Label>Future Remaining Income (Box H)</Label>
              <Input type="number" placeholder="0" readOnly className="bg-[#22b573]/5 font-bold text-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Offer Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>Minimum Offer Amount Calculation</CardTitle>
          <p className="text-sm text-gray-600">
            Determine your minimum offer amount by adding the total available assets to the future remaining income
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="boxA">Box A (Individual Assets)</Label>
              <Input id="boxA" type="number" placeholder="0" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="boxB">Box B (Business Assets)</Label>
              <Input id="boxB" type="number" placeholder="0" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="futureIncome">Future Income (Box G or H)</Label>
              <Input
                id="futureIncome"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="bg-[#22b573]/10 p-6 rounded-lg border-2 border-[#22b573]/20">
            <div className="text-center">
              <Label className="text-lg font-semibold text-gray-900">Your Minimum Offer Amount</Label>
              <div className="text-4xl font-bold text-[#22b573] mt-2">$0</div>
              <p className="text-sm text-gray-600 mt-2">
                Your offer must be more than zero ($0). Use whole dollars only.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Important Note</h4>
            <p className="text-sm text-blue-800">
              Place the offer amount shown above on the Form 656, Section 4, Payment Terms, unless you cannot pay that
              amount due to special circumstances. If you cannot pay that amount due to special circumstances, place the
              amount you can pay on the Form 656, Section 4, Payment Terms, and explain your special circumstances on
              the Form 656, Section 3, Reason for Offer.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Additional Information</h4>
            <p className="text-sm text-yellow-800">
              The multipliers (12 and 24) and the calculated offer amount do not apply if the IRS determines you have
              the ability to pay your tax debt in full within the legal period to collect.
            </p>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={8} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
