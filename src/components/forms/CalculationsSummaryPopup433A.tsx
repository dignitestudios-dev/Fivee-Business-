"use client";

import Popup from "@/components/ui/Popup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationSummary } from "@/lib/features/form433aSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CalculationsSummaryPopup433AProps {
  open: boolean;
  calculationSummary: CalculationSummary | null;
  caseId: string | null;
  onClose: () => void;
}

export function CalculationsSummaryPopup433A({
  open,
  calculationSummary,
  caseId,
  onClose,
}: CalculationsSummaryPopup433AProps) {
  const router = useRouter();
  const fmt = (v: number) => Math.round(v).toLocaleString();
  
  const handleConfirm = () => {
    if (!caseId) {
      toast.error("Case ID is missing. Please try again.");
      return;
    }
    router.push(`/dashboard/433a-oic/payment?caseId=${caseId}`);
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
        <div className="w-full space-y-4 mt-4 max-h-[50vh] overflow-y-auto">
          {/* Box A: Individual Assets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box A: Individual Assets (Available Equity)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxA)}
              </div>
            </CardContent>
          </Card>

          {/* Box B: Business Assets Available Equity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box B: Available Business Equity in Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxB)}
              </div>
            </CardContent>
          </Card>

          {/* Box C: Monthly Business Income */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box C: Monthly Business Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxC)}
              </div>
            </CardContent>
          </Card>

          {/* Box D: Total Household Income */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box D: Total Household Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxD)}
              </div>
            </CardContent>
          </Card>

          {/* Box E: Total Household Expenses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box E: Total Household Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxE)}
              </div>
            </CardContent>
          </Card>

          {/* Box F: Remaining Monthly Income */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box F: Remaining Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxF)}
              </div>
            </CardContent>
          </Card>

          {/* Box G: Future Remaining Income (5 Month) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box G: Future Remaining Income (Box F × 12)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxG)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ${fmt(calculationSummary.boxF)} × 12 = ${fmt(calculationSummary.boxG)}
              </p>
            </CardContent>
          </Card>

          {/* Box H: Future Remaining Income (24 Month) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Box H: Future Remaining Income (Box F × 24)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(calculationSummary.boxH)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ${fmt(calculationSummary.boxF)} × 24 = ${fmt(calculationSummary.boxH)}
              </p>
            </CardContent>
          </Card>

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
                  Calculation: Box A + Box B + Future Income
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ${fmt(calculationSummary.boxA)} + $
                  {fmt(calculationSummary.boxB)} + $
                  {fmt(calculationSummary.futureIncome)} = $
                  {fmt(calculationSummary.minimumOfferAmount)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Popup>
  );
}
