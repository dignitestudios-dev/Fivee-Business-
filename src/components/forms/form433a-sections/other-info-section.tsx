import { FormNavigation } from "./form-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface OtherInfoSectionProps {
  formData: FormData433A
  updateFormData: (updates: Partial<FormData433A>) => void
}

export function OtherInfoSection({ formData, updateFormData }: OtherInfoSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Section 9: Other Information</h2>
        <p className="text-gray-600">
          Additional information IRS needs to consider settlement of your tax debt. If you or your business are
          currently in a bankruptcy proceeding, you are not eligible to apply for an offer.
        </p>
      </div>

      {/* Bankruptcy Information */}
      <Card>
        <CardHeader>
          <CardTitle>Bankruptcy History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Have you filed bankruptcy in the past 7 years?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="bankruptcy-yes" className="text-[#22b573]" />
                <Label htmlFor="bankruptcy-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="bankruptcy-no" className="text-[#22b573]" />
                <Label htmlFor="bankruptcy-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateFiled">Date Filed (mm/dd/yyyy)</Label>
              <Input id="dateFiled" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="dateDismissed">Date Dismissed (mm/dd/yyyy)</Label>
              <Input id="dateDismissed" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="dateDischarged">Date Discharged (mm/dd/yyyy)</Label>
              <Input id="dateDischarged" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petitionNumber">Petition Number</Label>
              <Input id="petitionNumber" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="locationFiled">Location Filed</Label>
              <Input id="locationFiled" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foreign Residence */}
      <Card>
        <CardHeader>
          <CardTitle>Foreign Residence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>In the past 10 years, have you lived outside of the U.S. for 6 months or longer?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="foreign-residence-yes" className="text-[#22b573]" />
                <Label htmlFor="foreign-residence-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="foreign-residence-no" className="text-[#22b573]" />
                <Label htmlFor="foreign-residence-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="datesAbroadFrom">Dates Lived Abroad: From (mm/dd/yyyy)</Label>
              <Input id="datesAbroadFrom" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="datesAbroadTo">To (mm/dd/yyyy)</Label>
              <Input id="datesAbroadTo" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Litigation */}
      <Card>
        <CardHeader>
          <CardTitle>Litigation Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Are you a party to or involved in litigation?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="litigation-yes" className="text-[#22b573]" />
                <Label htmlFor="litigation-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="litigation-no" className="text-[#22b573]" />
                <Label htmlFor="litigation-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Party Type</Label>
              <RadioGroup className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="defendant" id="defendant" className="text-[#22b573]" />
                  <Label htmlFor="defendant">Defendant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plaintiff" id="plaintiff" className="text-[#22b573]" />
                  <Label htmlFor="plaintiff">Plaintiff</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="amountOfDispute">Amount of Dispute ($)</Label>
              <Input
                id="amountOfDispute"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="locationOfFiling">Location of Filing</Label>
              <Input id="locationOfFiling" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="docketCaseNumber">Docket/Case Number</Label>
              <Input id="docketCaseNumber" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="representedBy">Represented By</Label>
              <Input id="representedBy" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="possibleCompletionDate">Possible Completion Date (mm/dd/yyyy)</Label>
              <Input id="possibleCompletionDate" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div>
            <Label htmlFor="subjectOfLitigation">Subject of Litigation</Label>
            <Textarea id="subjectOfLitigation" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div>
            <Label>If yes and the litigation included tax debt, provide the types of tax and periods involved</Label>
            <Textarea className="focus:ring-[#22b573] focus:border-[#22b573] mt-2" />
          </div>

          <div>
            <Label>
              Are you or have you ever been party to any litigation involving the IRS/United States (including any tax
              litigation)?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="irs-litigation-yes" className="text-[#22b573]" />
                <Label htmlFor="irs-litigation-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="irs-litigation-no" className="text-[#22b573]" />
                <Label htmlFor="irs-litigation-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Trust and Estate Information */}
      <Card>
        <CardHeader>
          <CardTitle>Trust and Estate Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Are you a trustee, fiduciary, or contributor of a trust?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="trustee-yes" className="text-[#22b573]" />
                <Label htmlFor="trustee-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="trustee-no" className="text-[#22b573]" />
                <Label htmlFor="trustee-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trustName">Name of the Trust</Label>
              <Input id="trustName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="trustEIN">EIN</Label>
              <Input id="trustEIN" placeholder="XX-XXXXXXX" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div>
            <Label>
              Are you the beneficiary of a trust, estate, or life insurance policy, including those located in foreign
              countries or jurisdictions?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="beneficiary-yes" className="text-[#22b573]" />
                <Label htmlFor="beneficiary-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="beneficiary-no" className="text-[#22b573]" />
                <Label htmlFor="beneficiary-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beneficiaryName">Name of the Trust, Estate, or Policy</Label>
              <Input id="beneficiaryName" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="beneficiaryEIN">EIN</Label>
              <Input
                id="beneficiaryEIN"
                placeholder="XX-XXXXXXX"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placeRecorded">Place Where Recorded</Label>
              <Input id="placeRecorded" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="anticipatedAmount">Anticipated Amount to be Received ($)</Label>
              <Input
                id="anticipatedAmount"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="whenReceived">When Will the Amount be Received</Label>
            <Input id="whenReceived" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>
        </CardContent>
      </Card>

      {/* Additional Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>
              Do you have a safe deposit box (business or personal) including those located in foreign countries or
              jurisdictions?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="safe-deposit-yes" className="text-[#22b573]" />
                <Label htmlFor="safe-deposit-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="safe-deposit-no" className="text-[#22b573]" />
                <Label htmlFor="safe-deposit-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="safeDepositLocation">Location (name, address and box number(s))</Label>
              <Textarea id="safeDepositLocation" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="safeDepositContents">Contents</Label>
              <Textarea id="safeDepositContents" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div>
            <Label htmlFor="safeDepositValue">Value ($)</Label>
            <Input
              id="safeDepositValue"
              type="number"
              placeholder="0"
              className="focus:ring-[#22b573] focus:border-[#22b573] max-w-md"
            />
          </div>

          <div>
            <Label>
              In the past 10 years, have you transferred any asset with a fair market value of more than $10,000
              including real property, for less than their full value?
            </Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="asset-transfer-yes" className="text-[#22b573]" />
                <Label htmlFor="asset-transfer-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="asset-transfer-no" className="text-[#22b573]" />
                <Label htmlFor="asset-transfer-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="assetsList">List Asset(s)</Label>
              <Textarea id="assetsList" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
            <div>
              <Label htmlFor="valueAtTransfer">Value at Time of Transfer ($)</Label>
              <Input
                id="valueAtTransfer"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="dateTransferred">Date Transferred (mm/dd/yyyy)</Label>
              <Input id="dateTransferred" type="date" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>

          <div>
            <Label htmlFor="transferredTo">To Whom or Where Was It Transferred</Label>
            <Textarea id="transferredTo" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div>
            <Label>Do you have any assets or own any real property outside the U.S.?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="foreign-assets-yes" className="text-[#22b573]" />
                <Label htmlFor="foreign-assets-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="foreign-assets-no" className="text-[#22b573]" />
                <Label htmlFor="foreign-assets-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="foreignAssetsDescription">If yes, provide description, location, and value</Label>
            <Textarea id="foreignAssetsDescription" className="focus:ring-[#22b573] focus:border-[#22b573]" />
          </div>

          <div>
            <Label>Do you have any funds being held in trust by a third party?</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="trust-funds-yes" className="text-[#22b573]" />
                <Label htmlFor="trust-funds-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="trust-funds-no" className="text-[#22b573]" />
                <Label htmlFor="trust-funds-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trustFundsAmount">If yes, how much ($)</Label>
              <Input
                id="trustFundsAmount"
                type="number"
                placeholder="0"
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor="trustFundsWhere">Where</Label>
              <Input id="trustFundsWhere" className="focus:ring-[#22b573] focus:border-[#22b573]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <FormNavigation currentStep={9} totalSteps={10} onPrevious={() => {}} onNext={() => {}} />
    </div>
  )
}
