"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCcMastercard, FaCreditCard } from "react-icons/fa";
import { SiVisa } from "react-icons/si";

import PaymentForm from "@/components/payment/PaymentForm";
import FormLoader from "@/components/global/FormLoader";
import api from "@/lib/services";
import { w7Pricing } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import usePayment from "@/hooks/payments/usePayment";
import useW7PaymentStatus from "@/hooks/w7-form-hooks/useW7PaymentStatus";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";

const stripePromise = loadStripe(
  "pk_test_51RdEBhCRLH0jRzmbC88gJ8wF6Kd4JKRtfpgkfDkNd3IyaWgEJe2GCqOM45PopKDfmiwfpPeLKqiFho085gNreavX00e8mEu7Sw" as string
);

const FormW7Payment = () => {
  const { showError, showSuccess, showInfo } = useGlobalPopup();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

  const { handleGetPaymentMethods, getting } = usePayment();
  // Checks on load so an already-paid form is never charged a second time
  const { paid, checking, pollUntilPaid } = useW7PaymentStatus(caseId);
  // Set once this visit takes a payment, so the guard below only catches forms
  // that were already paid for when the page opened
  const paidThisVisit = useRef(false);

  const cards = useAppSelector((s) => s.cards.list || []);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    if (!cards || !cards.length) {
      handleGetPaymentMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paid === true && !paidThisVisit.current) {
      showInfo("This form has already been paid for.", "Already paid");
      router.replace(`/dashboard/form-w7?caseId=${caseId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  const getCardIcon = (brand: CardBrand) => {
    switch (brand) {
      case "visa":
        return <SiVisa className="text-[#1A1F71]" />;
      case "mastercard":
        return <FaCcMastercard className="text-[#EB001B]" />;
      default:
        return <FaCreditCard />;
    }
  };

  const finishSuccessfulPayment = async () => {
    paidThisVisit.current = true;
    showSuccess("Payment successful", "Success");
    // Stripe confirms through a webhook, so wait for the stored status to flip
    await pollUntilPaid();
    router.push(`/dashboard/form-w7?caseId=${caseId}`);
  };

  const handlePay = async () => {
    if (!selectedCard)
      return showError("Please select a card to pay", "Payment Error");
    if (!caseId) return showError("Missing caseId", "Payment Error");

    setProcessing(true);
    try {
      const resp = await api.createPaymentIntent({
        paymentMethodId: selectedCard,
        amount: w7Pricing,
        formId: caseId,
        formModel: "FormW7",
      });

      const clientSecret =
        resp?.data?.clientSecret || resp?.data?.client_secret || null;
      if (!clientSecret)
        throw new Error("No client secret returned from server");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCard,
      } as any);

      // Treat an already-succeeded intent as a success rather than an error
      if (
        result.error &&
        result.error.type === "invalid_request_error" &&
        result.error.code === "payment_intent_unexpected_state" &&
        result.error.payment_intent?.status === "succeeded"
      ) {
        await finishSuccessfulPayment();
        return;
      }

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        await handleGetPaymentMethods();
        await finishSuccessfulPayment();
      } else {
        showError("Payment did not succeed", "Payment Error");
      }
    } catch (error: any) {
      if (!error?.message?.includes("already succeeded")) {
        showError(error?.message || "Payment failed", "Payment Error");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-[1124px] w-full flex-1 flex m-10 border-2 border-[#E3E3E3] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 overflow-y-auto">
          {getting ? (
            <FormLoader />
          ) : (
            <div className="p-5 overflow-y-auto">
              <h3 className="font-semibold mb-1">Form W-7 Application</h3>
              <p className="text-sm text-gray-500 mb-4">
                Pay to generate and download the completed form.
              </p>

              <h3 className="font-semibold mb-4">Saved Cards</h3>
              {!cards?.length ? (
                <p className="text-gray-400">No saved cards</p>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={card.id || index}
                    className={`${
                      index !== 0 ? "border-t border-[#E3E3E3]" : ""
                    } py-4 flex items-center gap-2`}
                  >
                    <div className="rounded-lg bg-[var(--primary)]/10 h-[50px] w-[50px] flex justify-center items-center text-[200%]">
                      {getCardIcon(card.brand)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-semibold">
                            {card.name || "Card"}
                          </p>
                          <p className="font-medium">
                            Card ending with {card.last4}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="selectedCard"
                            checked={selectedCard === card.id}
                            onChange={() => setSelectedCard(card.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="mt-6">
                <button
                  className="w-full py-3 bg-[var(--primary)] text-white rounded disabled:opacity-50"
                  disabled={!selectedCard || processing || checking || paid === true}
                  onClick={handlePay}
                >
                  {processing ? "Processing..." : `Pay $${w7Pricing}`}
                </button>

                <button
                  className="w-full py-3 mt-3 border border-gray-300 text-gray-700 rounded disabled:opacity-50"
                  disabled={processing}
                  onClick={() => router.push("/dashboard")}
                >
                  Pay later
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  You can pay later from your dashboard. The form can&apos;t be
                  generated or downloaded until payment is complete.
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="p-5 md:pl-0 h-full overflow-y-auto">
              <div className="flex items-center gap-3">
                <FaCreditCard size={26} />
                <p className="font-medium">Add a new card</p>
              </div>

              <Elements stripe={stripePromise}>
                <div
                  className={`space-y-2 ${
                    addingCard ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {addingCard && (
                    <div className="mb-2 text-sm text-gray-600">
                      Adding card and refreshing list...
                    </div>
                  )}
                  <PaymentForm
                    onPaymentError={(err) => showError(err, "Payment Error")}
                    onPaymentSuccess={async () => {
                      try {
                        setAddingCard(true);
                        await handleGetPaymentMethods();
                        showSuccess("Card added successfully", "Success");
                      } catch (e: any) {
                        showError(
                          e?.message || "Failed to refresh cards",
                          "Error"
                        );
                      } finally {
                        setAddingCard(false);
                      }
                    }}
                  />
                </div>
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormW7Payment;
