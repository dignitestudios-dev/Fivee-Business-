"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import Link from "next/link";
import React from "react";
import { FaCreditCard } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

const AddPaymentMethod = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const handlePaymentError = () => {};
  const handlePaymentSuccess = () => {};

  return (
    <>
      <div className="border-b border-[#E3E3E3] flex items-center gap-5 h-14">
        <Link
          href={"/dashboard/manage-payment-methods"}
          className="px-3 h-full cursor-pointer bg-[var(--primary)]/10 text-[var(--primary)] font-semibold flex items-center gap-2"
        >
          <IoArrowBackOutline size={18} />
          Back
        </Link>
        <div className="flex-1">
          <p className="font-bold text-base text-center">Add Payment Method</p>
        </div>
      </div>

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
    </>
  );
};

export default AddPaymentMethod;
