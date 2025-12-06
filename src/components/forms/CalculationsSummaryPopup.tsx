"use client";

import Popup from "@/components/ui/Popup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationSummary } from "@/lib/features/form433aSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface CalculationsSummaryPopupProps {
  open: boolean;
  calculationSummary: CalculationSummary | null;
  caseId: string | null;
  onClose: () => void;
  formType?: "433a" | "433b";
}

export function CalculationsSummaryPopup({
  open,
  calculationSummary,
  caseId,
  onClose,
  formType = "433a",
}: CalculationsSummaryPopupProps) {
  const router = useRouter();
  const fmt = (v: number) => Math.round(v).toLocaleString();
  const handleConfirm = () => {
    if (!caseId) {
      toast.error("Case ID is missing. Please try again.");
      return;
    }

    if (formType === "433b") {
      router.push(`/dashboard/433b-oic/payment?caseId=${caseId}`);
    } else {
      router.push(`/dashboard/433a-oic/payment?caseId=${caseId}`);
    }
  };

  return (
    <Popup
      open={open && calculationSummary !== null}
      onClose={onClose}
      type="confirm"
      title="Offer In Compromise Calculation Summary"
      message="Review your calculated minimum offer amount below"
      showCloseButton={true}
      confirmText="Continue to Payment"
      onConfirm={handleConfirm}
      cancelText="Back to Review"
      onCancel={onClose}
    >
      {calculationSummary && (
        <div className="space-y-4 mt-4 max-h-[50vh] overflow-y-auto">
          {/* Box A */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {formType === "433b"
                  ? "Box A: Total Business Assets"
                  : "Box A: Individual Assets (Available Equity)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxA)}
              </div>
            </CardContent>
          </Card>

          {/* Box B */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {formType === "433b"
                  ? "Box B: Total Business Income"
                  : "Box B: Available Business Equity in Assets"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxB)}
              </div>
            </CardContent>
          </Card>

          {/* Box C */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {formType === "433b"
                  ? "Box C: Total Business Expenses"
                  : "Box C: Monthly Business Income"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxC)}
              </div>
            </CardContent>
          </Card>

          {/* Box D */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {formType === "433b"
                  ? "Box D: Remaining Monthly Income"
                  : "Box D: Total Household Income"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxD)}
              </div>
            </CardContent>
          </Card>

          {/* Show either Box E or Box F (selected) */}
          {(() => {
            // For the popup we need to show the "Future Remaining Income"
            // as either Box E (5-month multiplier) or Box F (24-month multiplier).
            // Choose based on the selected payment timeline.
            const timeline = calculationSummary.paymentTimeline;
            const use = timeline === "5_months_or_less" ? "E" : "F";
            const label =
              formType === "433b"
                ? use === "E"
                  ? "Box E: Future Remaining Income"
                  : "Box F: Future Remaining Income"
                : use === "E"
                ? "Box E: Future Remaining Income"
                : "Box F: Future Remaining Income";
            // futureIncome already contains the selected future remaining income
            const value = calculationSummary.futureIncome || 0;

            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#22b573]">
                    ${fmt(value)}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Payment Timeline & Future Income - only show for 5-month timeline */}
          {calculationSummary.paymentTimeline === "5_months_or_less" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Payment Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Option</p>
                  <p className="font-semibold text-gray-900">
                    5 or fewer payments within 5 months or less
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Box G (5 Month)
                    </p>
                    <p className="font-bold text-gray-900">
                      ${fmt(calculationSummary.boxG)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Box H (24 Month)
                    </p>
                    <p className="font-bold text-gray-900">
                      ${fmt(calculationSummary.boxH)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-1">
                    Future Remaining Income
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    ${fmt(calculationSummary.futureIncome)}
                  </p>
                </div>

                {calculationSummary.monthlyPaymentAmount && (
                  <div className="pt-2 border-t bg-orange-50 p-2 rounded">
                    <p className="text-xs text-orange-600 mb-1">
                      Suggested Monthly Payment (5 payments in 5 months)
                    </p>
                    <p className="font-bold text-lg text-orange-900">
                      ${fmt(calculationSummary.monthlyPaymentAmount)}
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Total Amount ÷ 5 months = $
                      {fmt(calculationSummary.minimumOfferAmount)} ÷ 5
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Minimum Offer Amount */}
          <Card className="bg-gradient-to-r from-[#22b573]/10 to-[#22b573]/5 border-2 border-[#22b573]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#22b573]">
                Your Minimum Offer Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-[#22b573]">
                  ${fmt(calculationSummary.minimumOfferAmount)}
                </div>
                <p className="text-sm text-gray-600">
                  {formType === "433b"
                    ? "Calculation: Box A + Future Income"
                    : "Calculation: Box A + Box B + Future Income"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formType === "433b" ? (
                    <>
                      ${fmt(calculationSummary.boxA)} + $
                      {fmt(calculationSummary.futureIncome)} = $
                      {fmt(calculationSummary.minimumOfferAmount)}
                    </>
                  ) : (
                    <>
                      ${fmt(calculationSummary.boxA)} + $
                      {fmt(calculationSummary.boxB)} + $
                      {fmt(calculationSummary.futureIncome)} = $
                      {fmt(calculationSummary.minimumOfferAmount)}
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Popup>
  );
}
