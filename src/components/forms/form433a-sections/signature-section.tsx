import type { FormData } from "@/app/page"
import { FormNavigation } from "@/components/form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface SignatureSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function SignatureSection({ formData, updateFormData }: SignatureSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 10: Signatures</h2>
        <p className="text-gray-600">
          Under penalties of perjury, I declare that I have examined this offer, including accompanying documents, and
          to the best of my knowledge it is true, correct, and complete.
        </p>
      </div>

      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Required Signatures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="taxpayerSignature">Signature of Taxpayer</Label>
              <Input
                id="taxpayerSignature"
                placeholder="Type your full name"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="taxpayerDate">Date (mm/dd/yyyy)</Label>
              <Input id="taxpayerDate" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          {formData.maritalStatus === "married" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouseSignature">Signature of Spouse</Label>
                <Input
                  id="spouseSignature"
                  placeholder="Type spouse's full name"
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
              <div>
                <Label htmlFor="spouseDate">Date (mm/dd/yyyy)</Label>
                <Input id="spouseDate" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Required Attachments</CardTitle>
          <p className="text-sm text-gray-600">Remember to include all applicable attachments listed below.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of the most recent pay stub, earnings statement, etc., from each employer.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of the most recent statement for each investment and retirement account.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of all documents and records showing currently held digital assets.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of the most recent statement from all other sources of income such as pensions, Social Security,
                rental income, interest and dividends, court order for child support, alimony, royalties, agricultural
                subsidies, gambling income, oil credits, rent subsidies, sharing economy income, etc.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of individual complete bank statements for the three most recent months. If you operate a
                business, copies of the six most recent complete statements for each business bank account.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Completed Form 433-B (Collection Information Statement for Businesses) if you or your spouse have an
                interest in a business entity other than a sole-proprietorship.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of the most recent statement from lender(s) on loans such as mortgages, second mortgages,
                vehicles, etc., showing monthly payments, loan payoffs, and balances.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">List of Accounts Receivable or Notes Receivable, if applicable.</Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Verification of delinquent State/Local Tax Liability showing total delinquent state/local taxes and
                amount of monthly payments, if applicable.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Copies of court orders for child support/alimony payments claimed in monthly expense section.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">Copies of Trust documents if applicable per Section 9.</Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Documentation to support any special circumstances described in the "Explanation of Circumstances" on
                Form 656, if applicable.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">
                Attach a Form 2848, Power of Attorney and Declaration of Representative, if you would like your
                attorney, CPA, or enrolled agent to represent you and you do not have a current form on file with the
                IRS.
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1" />
              <Label className="text-sm">Completed and signed current Form 656.</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Act Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Act Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              We ask for the information on this form to carry out the internal revenue laws of the United States. Our
              authority to request this information is section § 7801 of the Internal Revenue Code.
            </p>
            <p>
              Our purpose for requesting the information is to determine if it is in the best interests of the IRS to
              accept an offer. You are not required to make an offer; however, if you choose to do so, you must provide
              all of the taxpayer information requested. Failure to provide all of the information may prevent us from
              processing your request.
            </p>
            <p>
              If you are a paid preparer and you prepared the Form 656 for the taxpayer submitting an offer, we request
              that you complete and sign Section 9 on Form 656, and provide identifying information. Providing this
              information is voluntary. This information will be used to administer and enforce the internal revenue
              laws of the United States and may be used to regulate practice before the Internal Revenue Service for
              those persons subject to Treasury Department Circular No. 230, Regulations Governing the Practice of
              Attorneys, Certified Public Accountants, Enrolled Agents, Enrolled Actuaries, and Appraisers before the
              Internal Revenue Service.
            </p>
            <p>
              Information on this form may be disclosed to the Department of Justice for civil and criminal litigation.
              We may also disclose this information to cities, states and the District of Columbia for use in
              administering their tax laws and to combat terrorism. Providing false or fraudulent information on this
              form may subject you to criminal prosecution and penalties.
            </p>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={10} totalSteps={10} onPrevious={() => {}} onNext={() => {}} isLastStep={true} />
    </div>
  )
}
