import { FormNavigation } from "./form-navigation";
import { FormInput } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Upload, Trash2, Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SignatureSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  validateStep: () => Promise<boolean>;
}

export function SignatureSection({
  onNext,
  onPrevious,
  onSubmit,
  currentStep,
  totalSteps,
  validateStep,
}: SignatureSectionProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    unregister,
    formState: { errors },
  } = useFormContext<FormData433A>();

  const maritalStatus = watch("maritalStatus");
  const [taxpayerSignaturePreview, setTaxpayerSignaturePreview] = useState<
    string | null
  >(null);
  const [spouseSignaturePreview, setSpouseSignaturePreview] = useState<
    string | null
  >(null);
  const taxpayerFileInputRef = useRef<HTMLInputElement>(null);
  const spouseFileInputRef = useRef<HTMLInputElement>(null);

  // Register taxpayer signature fields
  useEffect(() => {
    register("taxpayerSignatureImage", {
      required: "Taxpayer signature image is required",
    });
  }, [register]);

  // Register/unregister spouse signature fields based on marital status
  useEffect(() => {
    if (maritalStatus === "married") {
      register("spouseSignatureImage", {
        required: "Spouse signature image is required",
      });
    } else {
      unregister("spouseSignatureImage");
    }

    return () => {
      if (maritalStatus !== "married") {
        unregister("spouseSignatureImage");
      }
    };
  }, [maritalStatus, register, unregister]);

  const handleTaxpayerSignatureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setTaxpayerSignaturePreview(result);
        setValue("taxpayerSignatureImage", result);
        await trigger("taxpayerSignatureImage");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpouseSignatureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setSpouseSignaturePreview(result);
        setValue("spouseSignatureImage", result);
        await trigger("spouseSignatureImage");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTaxpayerSignature = async () => {
    setTaxpayerSignaturePreview(null);
    setValue("taxpayerSignatureImage", "");
    if (taxpayerFileInputRef.current) {
      taxpayerFileInputRef.current.value = "";
    }
    await trigger("taxpayerSignatureImage");
  };

  const removeSpouseSignature = async () => {
    setSpouseSignaturePreview(null);
    setValue("spouseSignatureImage", "");
    if (spouseFileInputRef.current) {
      spouseFileInputRef.current.value = "";
    }
    await trigger("spouseSignatureImage");
  };

  const editTaxpayerSignature = () => {
    taxpayerFileInputRef.current?.click();
  };

  const editSpouseSignature = () => {
    spouseFileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section 10: Signatures
        </h2>
        <p className="text-gray-600">
          Under penalties of perjury, I declare that I have examined this offer,
          including accompanying documents, and to the best of my knowledge it
          is true, correct, and complete.
        </p>
      </div>

      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Required Signatures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Taxpayer Signature */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="taxpayerSignature">
                  Signature of Taxpayer *
                </Label>
                <div className="space-y-3">
                  {!taxpayerSignaturePreview ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-[#22b573] transition-colors ${
                        errors.taxpayerSignatureImage
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        ref={taxpayerFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleTaxpayerSignatureUpload}
                        className="hidden"
                        id="taxpayerSignatureUpload"
                      />
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload your signature image
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => taxpayerFileInputRef.current?.click()}
                        className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                      >
                        Choose File
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4">
                      <img
                        src={taxpayerSignaturePreview}
                        alt="Taxpayer Signature"
                        className="max-h-24 mx-auto mb-3"
                      />
                      <div className="flex justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={editTaxpayerSignature}
                          className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeTaxpayerSignature}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  {errors.taxpayerSignatureImage && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.taxpayerSignatureImage.message as string}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="taxpayerSignatureDate">
                  Date (mm/dd/yyyy) *
                </Label>
                <FormInput
                  label=""
                  id="taxpayerSignatureDate"
                  type="date"
                  {...register("taxpayerSignatureDate", {
                    required: "Taxpayer signature date is required",
                  })}
                  error={errors.taxpayerSignatureDate?.message}
                  className="focus:ring-[#22b573] focus:border-[#22b573]"
                />
              </div>
            </div>
          </div>

          {/* Spouse Signature */}
          {maritalStatus === "married" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="spouseSignature">Signature of Spouse *</Label>
                  <div className="space-y-3">
                    {!spouseSignaturePreview ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-[#22b573] transition-colors ${
                          errors.spouseSignatureImage
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          ref={spouseFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleSpouseSignatureUpload}
                          className="hidden"
                          id="spouseSignatureUpload"
                        />
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload spouse's signature image
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => spouseFileInputRef.current?.click()}
                          className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                        >
                          Choose File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <img
                          src={spouseSignaturePreview}
                          alt="Spouse Signature"
                          className="max-h-24 mx-auto mb-3"
                        />
                        <div className="flex justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={editSpouseSignature}
                            className="text-[#22b573] border-[#22b573] hover:bg-[#22b573]/5"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeSpouseSignature}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    {errors.spouseSignatureImage && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.spouseSignatureImage.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="spouseSignatureDate">
                    Date (mm/dd/yyyy) *
                  </Label>
                  <FormInput
                    label=""
                    id="spouseSignatureDate"
                    type="date"
                    {...register("spouseSignatureDate", {
                      required: "Spouse signature date is required",
                    })}
                    error={errors.spouseSignatureDate?.message}
                    className="focus:ring-[#22b573] focus:border-[#22b573]"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Required Attachments</CardTitle>
          <p className="text-sm text-gray-600">
            Please confirm that you have included all applicable attachments
            listed below by checking each box.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Attachment 1 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment1"
                  {...register("attachment1", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment1"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of the most recent pay stub, earnings statement, etc.,
                  from each employer.
                </Label>
                {errors.attachment1 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment1.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 2 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment2"
                  {...register("attachment2", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment2"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of the most recent statement for each investment and
                  retirement account.
                </Label>
                {errors.attachment2 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment2.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 3 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment3"
                  {...register("attachment3", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment3"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of all documents and records showing currently held
                  digital assets.
                </Label>
                {errors.attachment3 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment3.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 4 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment4"
                  {...register("attachment4", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment4"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of the most recent statement from all other sources of
                  income such as pensions, Social Security, rental income,
                  interest and dividends, court order for child support,
                  alimony, royalties, agricultural subsidies, gambling income,
                  oil credits, rent subsidies, sharing economy income from
                  providing on-demand work, services or goods (e.g., Uber, Lyft,
                  DoorDash, AirBnb, VRBO), income through digital platforms like
                  an app or website, etc., and recurring capital gains from the
                  sale of securities or other property such as digital assets.
                </Label>
                {errors.attachment4 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment4.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 5 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment5"
                  {...register("attachment5", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment5"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of individual complete bank statements for the three
                  most recent months. If you operate a business, copies of the
                  six most recent complete statements for each business bank
                  account.
                </Label>
                {errors.attachment5 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment5.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 6 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment6"
                  {...register("attachment6", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment6"
                  className="text-sm font-medium cursor-pointer"
                >
                  Completed Form 433-B (Collection Information Statement for
                  Businesses) if you or your spouse have an interest in a
                  business entity other than a sole-proprietorship.
                </Label>
                {errors.attachment6 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment6.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 7 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment7"
                  {...register("attachment7", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment7"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of the most recent statement from lender(s) on loans
                  such as mortgages, second mortgages, vehicles, etc., showing
                  monthly payments, loan payoffs, and balances.
                </Label>
                {errors.attachment7 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment7.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 8 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment8"
                  {...register("attachment8", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment8"
                  className="text-sm font-medium cursor-pointer"
                >
                  List of Accounts Receivable or Notes Receivable, if
                  applicable.
                </Label>
                {errors.attachment8 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment8.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 9 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment9"
                  {...register("attachment9", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment9"
                  className="text-sm font-medium cursor-pointer"
                >
                  Verification of delinquent State/Local Tax Liability showing
                  total delinquent state/local taxes and amount of monthly
                  payments, if applicable.
                </Label>
                {errors.attachment9 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment9.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 10 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment10"
                  {...register("attachment10", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment10"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of court orders for child support/alimony payments
                  claimed in monthly expense section.
                </Label>
                {errors.attachment10 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment10.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 11 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment11"
                  {...register("attachment11", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment11"
                  className="text-sm font-medium cursor-pointer"
                >
                  Copies of Trust documents if applicable per Section 9.
                </Label>
                {errors.attachment11 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment11.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 12 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment12"
                  {...register("attachment12", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment12"
                  className="text-sm font-medium cursor-pointer"
                >
                  Documentation to support any special circumstances described
                  in the "Explanation of Circumstances" on Form 656, if
                  applicable.
                </Label>
                {errors.attachment12 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment12.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 13 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment13"
                  {...register("attachment13", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment13"
                  className="text-sm font-medium cursor-pointer"
                >
                  Attach a Form 2848, Power of Attorney and Declaration of
                  Representative, if you would like your attorney, CPA, or
                  enrolled agent to represent you and you do not have a current
                  form on file with the IRS. Ensure all years and forms involved
                  in your offer are listed on Form 2848 and include the current
                  tax year.
                </Label>
                {errors.attachment13 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment13.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Attachment 14 */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col">
                <Checkbox
                  id="attachment14"
                  {...register("attachment14", {
                    required: "You must confirm this attachment is included",
                  })}
                  className="data-[state=checked]:bg-[#22b573] data-[state=checked]:border-[#22b573] mt-1"
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="attachment14"
                  className="text-sm font-medium cursor-pointer"
                >
                  Completed and signed current Form 656.
                </Label>
                {errors.attachment14 && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.attachment14.message as string}
                  </p>
                )}
              </div>
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
              We ask for the information on this form to carry out the internal
              revenue laws of the United States. Our authority to request this
              information is section § 7801 of the Internal Revenue Code.
            </p>
            <p>
              Our purpose for requesting the information is to determine if it
              is in the best interests of the IRS to accept an offer. You are
              not required to make an offer; however, if you choose to do so,
              you must provide all of the taxpayer information requested.
              Failure to provide all of the information may prevent us from
              processing your request.
            </p>
            <p>
              If you are a paid preparer and you prepared the Form 656 for the
              taxpayer submitting an offer, we request that you complete and
              sign Section 9 on Form 656, and provide identifying information.
              Providing this information is voluntary. This information will be
              used to administer and enforce the internal revenue laws of the
              United States and may be used to regulate practice before the
              Internal Revenue Service for those persons subject to Treasury
              Department Circular No. 230, Regulations Governing the Practice of
              Attorneys, Certified Public Accountants, Enrolled Agents, Enrolled
              Actuaries, and Appraisers before the Internal Revenue Service.
            </p>
            <p>
              Information on this form may be disclosed to the Department of
              Justice for civil and criminal litigation. We may also disclose
              this information to cities, states and the District of Columbia
              for use in administering their tax laws and to combat terrorism.
              Providing false or fraudulent information on this form may subject
              you to criminal prosecution and penalties.
            </p>
          </div>
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
        validateStep={validateStep}
      />
    </div>
  );
}
