"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import React, { useEffect, useMemo, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import { useAppSelector } from "@/lib/hooks";
import usePayment from "@/hooks/payments/usePayment";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/services";
import toast from "react-hot-toast";
import FormLoader from "@/components/global/FormLoader";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const Form433BOICPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = useMemo(() => searchParams.get("caseId"), [searchParams]);

  const { handleGetPaymentMethods, getting } = usePayment();

  const cards = useAppSelector((s) => s.cards.list || []);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    if (!cards || !cards.length) {
      handleGetPaymentMethods();
    }
  }, []);

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

  const handlePay = async () => {
    if (!selectedCard) return toast.error("Please select a card to pay");
    if (!caseId) return toast.error("Missing caseId");

    setProcessing(true);
    try {
      const resp = await api.createPaymentIntent({
        paymentMethodId: selectedCard,
        amount: 20,
        formId: caseId,
        formModel: "Form433B-OIC",
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

      // Check if the error is due to payment already being successful
      if (
        result.error &&
        result.error.type === "invalid_request_error" &&
        result.error.code === "payment_intent_unexpected_state" &&
        result.error.payment_intent?.status === "succeeded"
      ) {
        // Payment was already successful, treat this as a success case
        toast.success("Payment successful");
        router.push("/dashboard"); // Redirect to dashboard
        return;
      }

      // Handle other errors
      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful");
        // refresh cards list in case server updated something
        await handleGetPaymentMethods();
        // Redirect to dashboard after successful payment
        router.push("/dashboard");
      } else {
        toast.error("Payment did not succeed");
      }
    } catch (error: any) {
      // Only show error toast if it's not the "already succeeded" case
      if (!error?.message?.includes("already succeeded")) {
        toast.error(error?.message || "Payment failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-[1124px] w-full flex-1 flex m-10 border-2 border-[#E3E3E3] rounded-lg">
        <div className="grid grid-cols-2 gap-10 flex-1 overflow-y-auto">
          {getting ? (
            <FormLoader />
          ) : (
            <div className="p-5 overflow-y-auto">
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
                  disabled={!selectedCard || processing}
                  onClick={handlePay}
                >
                  {processing ? "Processing..." : "Pay $20"}
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="p-5 pl-0 h-full overflow-y-auto">
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
                    onPaymentError={(err) => toast.error(err)}
                    onPaymentSuccess={async (resp: any) => {
                      try {
                        setAddingCard(true);
                        await handleGetPaymentMethods();
                        toast.success("Card added successfully");
                      } catch (e: any) {
                        toast.error(e?.message || "Failed to refresh cards");
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

export default Form433BOICPayment;
