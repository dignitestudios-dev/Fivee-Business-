"use client";

import { useMemo, useState } from "react";
import Popup from "@/components/ui/Popup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helper";

interface CalculationsSummaryPopup656Props {
  open: boolean;
  calculations: Form656CaseCalculations | null;
  onClose: () => void;
  onConfirm: () => void;
  confirmLoading?: boolean;
}

export function CalculationsSummaryPopup656({
  open,
  calculations,
  onClose,
  onConfirm,
  confirmLoading = false,
}: CalculationsSummaryPopup656Props) {
  const summary433A = calculations?.form433A ?? null;
  const summary433B = calculations?.form433B ?? null;

  const hasBoth = Boolean(summary433A && summary433B);
  const defaultTab = summary433A ? "433a" : "433b";
  const [activeTab, setActiveTab] = useState<"433a" | "433b">(defaultTab);

  // Keep active tab in sync if only one is available
  const currentTab = useMemo(() => {
    if (hasBoth) return activeTab;
    return summary433A ? "433a" : "433b";
  }, [hasBoth, activeTab, summary433A]);

  const fmt = (v?: number) => Math.round(v ?? 0).toLocaleString();

  const render433A = (summary: Form433ACalculationSummary) => (
    <div className="space-y-4">
      {/* Box A: Individual Assets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box A: Individual Assets (Available Equity)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxA)}
          </div>
        </CardContent>
      </Card>

      {/* Box B: Business Assets Available Equity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box B: Available Business Equity in Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxB)}
          </div>
        </CardContent>
      </Card>

      {/* Box C: Monthly Business Income */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box C: Monthly Business Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxC)}
          </div>
        </CardContent>
      </Card>

      {/* Box D: Total Household Income */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box D: Total Household Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxD)}
          </div>
        </CardContent>
      </Card>

      {/* Box E: Total Household Expenses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box E: Total Household Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxE)}
          </div>
        </CardContent>
      </Card>

      {/* Box F: Remaining Monthly Income */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box F: Remaining Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxF)}
          </div>
        </CardContent>
      </Card>

      {/* Box G: Future Remaining Income (12 Month) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box G: Future Remaining Income (Box F × 12)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxG)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ${fmt(summary.boxF)} × 12 = ${fmt(summary.boxG)}
          </p>
        </CardContent>
      </Card>

      {/* Box H: Future Remaining Income (24 Month) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Box H: Future Remaining Income (Box F × 24)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#22b573]">
            ${fmt(summary.boxH)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ${fmt(summary.boxF)} × 24 = ${fmt(summary.boxH)}
          </p>
        </CardContent>
      </Card>

      {/* Payment Timeline & Future Income */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Payment Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Selected Option</p>
            <p className="font-semibold text-gray-900">
              {summary.paymentTimeline === "5_months_or_less"
                ? "5 or fewer payments within 5 months or less"
                : summary.paymentTimeline === "6_to_24_months"
                ? "Periodic payment (6 to 24 months)"
                : summary.paymentTimeline || "Not specified"}
            </p>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-1">
              Future Remaining Income
            </p>
            <p className="font-bold text-lg text-gray-900">
              ${fmt(summary.futureIncome)}
            </p>
          </div>

          {summary.paymentTimeline === "5_months_or_less" &&
            summary.monthlyPaymentAmount > 0 && (
              <div className="pt-2 border-t bg-orange-50 p-2.5 rounded-lg">
                <p className="text-xs text-orange-700 font-medium mb-1">
                  Suggested Monthly Payment (5 payments in 5 months)
                </p>
                <p className="font-bold text-lg text-orange-950">
                  ${fmt(summary.monthlyPaymentAmount)}
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Total Amount ÷ 5 months = ${fmt(summary.minimumOfferAmount)} ÷ 5
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Minimum Offer Amount */}
      <Card className="bg-gradient-to-r from-[#22b573]/10 to-[#22b573]/5 border-2 border-[#22b573]/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#22b573]">
            Form 433-A Minimum Offer Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-[#22b573]">
              ${fmt(summary.minimumOfferAmount)}
            </div>
            <p className="text-sm text-gray-600">
              Calculation: Box A + Box B + Future Income
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ${fmt(summary.boxA)} + ${fmt(summary.boxB)} + ${fmt(summary.futureIncome)} = ${fmt(summary.minimumOfferAmount)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const render433B = (summary: Form433BCalculationSummary) => {
    const boxE = summary.boxE ?? summary.boxD * 12;
    const boxF = summary.boxF ?? summary.boxD * 24;

    return (
      <div className="space-y-4">
        {/* Box A: Total Business Assets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Box A: Total Business Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#22b573]">
              ${fmt(summary.boxA)}
            </div>
          </CardContent>
        </Card>

        {/* Box B: Total Business Income */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Box B: Total Business Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#22b573]">
              ${fmt(summary.boxB)}
            </div>
          </CardContent>
        </Card>

        {/* Box C: Total Business Expenses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Box C: Total Business Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#22b573]">
              ${fmt(summary.boxC)}
            </div>
          </CardContent>
        </Card>

        {/* Box D: Remaining Monthly Income */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Box D: Remaining Monthly Income (Box B - Box C)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#22b573]">
              ${fmt(summary.boxD)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ${fmt(summary.boxB)} - ${fmt(summary.boxC)} = ${fmt(summary.boxD)}
            </p>
          </CardContent>
        </Card>

        {/* Box E: Future Remaining Income (5 Month) */}
        {summary.paymentTimeline === "5_months_or_less" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Box E: Future Remaining Income (Box D × 12)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(boxE)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ${fmt(summary.boxD)} × 12 = ${fmt(boxE)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Box F: Future Remaining Income (24 Month) */}
        {summary.paymentTimeline === "6_to_24_months" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Box F: Future Remaining Income (Box D × 24)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#22b573]">
                ${fmt(boxF)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ${fmt(summary.boxD)} × 24 = ${fmt(boxF)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Payment Timeline & Future Income */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Payment Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Selected Option</p>
              <p className="font-semibold text-gray-900">
                {summary.paymentTimeline === "5_months_or_less"
                  ? "5 or fewer payments within 5 months or less"
                  : summary.paymentTimeline === "6_to_24_months"
                  ? "Periodic payment (6 to 24 months)"
                  : summary.paymentTimeline || "Not specified"}
              </p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600 mb-1">
                Future Remaining Income
              </p>
              <p className="font-bold text-lg text-gray-900">
                ${fmt(summary.futureIncome)}
              </p>
            </div>

            {summary.paymentTimeline === "5_months_or_less" &&
              summary.monthlyPaymentAmount > 0 && (
                <div className="pt-2 border-t bg-orange-50 p-2.5 rounded-lg">
                  <p className="text-xs text-orange-700 font-medium mb-1">
                    Suggested Monthly Payment (5 payments in 5 months)
                  </p>
                  <p className="font-bold text-lg text-orange-950">
                    ${fmt(summary.monthlyPaymentAmount)}
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Total Amount ÷ 5 months = ${fmt(summary.minimumOfferAmount)} ÷ 5
                  </p>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Minimum Offer Amount */}
        <Card className="bg-gradient-to-r from-[#22b573]/10 to-[#22b573]/5 border-2 border-[#22b573]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#22b573]">
              Form 433-B Minimum Offer Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-[#22b573]">
                ${fmt(summary.minimumOfferAmount)}
              </div>
              <p className="text-sm text-gray-600">
                Calculation: Box A + Future Income
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ${fmt(summary.boxA)} + ${fmt(summary.futureIncome)} = ${fmt(summary.minimumOfferAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Popup
      open={open && Boolean(summary433A || summary433B)}
      onClose={onClose}
      type="confirm"
      title="Offer In Compromise Calculation Summary"
      message="Review your calculated offer amount from your attached forms before final submission"
      showCloseButton={true}
      confirmText={confirmLoading ? "Submitting..." : "Confirm & Submit Form 656"}
      confirmDisabled={confirmLoading}
      onConfirm={onConfirm}
      cancelText="Back to Review"
      onCancel={onClose}
    >
      <div className="w-full mt-4 max-h-[60vh] overflow-y-auto pr-1">
        {/* Dual Form Tab Switcher */}
        {hasBoth && (
          <div className="flex rounded-lg bg-gray-100 p-1 mb-4 sticky top-0 z-10 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("433a")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer",
                currentTab === "433a"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              Form 433-A (Individual)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("433b")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer",
                currentTab === "433b"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              Form 433-B (Business)
            </button>
          </div>
        )}

        {/* Content based on active tab or available summary */}
        {currentTab === "433a" && summary433A && render433A(summary433A)}
        {currentTab === "433b" && summary433B && render433B(summary433B)}
      </div>
    </Popup>
  );
}
