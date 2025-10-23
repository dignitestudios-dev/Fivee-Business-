"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import React from "react";
import { FaCreditCard } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { SiVisa } from "react-icons/si";

const cards = [
  {
    brandIcon: <SiVisa />,
    cardHolderName: "Siweh Harris",
    last4: "9864",
  },
  {
    brandIcon: <FaCcMastercard />,
    cardHolderName: "Siweh Harris",
    last4: "4052",
  },
  {
    brandIcon: <SiVisa />,
    cardHolderName: "Siweh Harris",
    last4: "9864",
  },
  {
    brandIcon: <FaCcMastercard />,
    cardHolderName: "Siweh Harris",
    last4: "4052",
  },
];

const Form433BOICPayment = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-[1124px] w-full flex-1 flex m-10 border-2 border-[#E3E3E3] rounded-lg">
        <div className="grid grid-cols-2 gap-10 flex-1 overflow-y-auto">
          <div className="px-10 py-5 overflow-y-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${
                  index !== 0 && "border-t border-[#E3E3E3]"
                } py-4 flex items-center gap-2`}
              >
                <div className="rounded-lg bg-[var(--primary)]/10 h-[50px] w-[50px] flex justify-center items-center text-[200%]">
                  {card.brandIcon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold">Siweh Harris</p>
                  <p className="font-medium">Card ending with {card.last4}</p>
                </div>
              </div>
            ))}
          </div>{" "}
          <div>
            <div className="px-10 pb-18 h-full overflow-y-auto">
              <div className="flex items-center gap-3">
                <FaCreditCard size={26} />

                <p className="font-medium">Credit or Debit Card</p>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  onPaymentError={() => console.log("payment error")}
                  onPaymentSuccess={() => console.log("payment success")}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form433BOICPayment;
