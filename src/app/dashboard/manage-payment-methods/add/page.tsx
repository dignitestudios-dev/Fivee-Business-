"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/payment/PaymentForm";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { FaCreditCard } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

const AddPaymentMethod = () => {
  const { showError, showSuccess } = useGlobalPopup();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const router = useRouter();

  return (
    <>
      <div className="border-b border-[#E3E3E3] flex items-center gap-3 sm:gap-5 h-14">
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

      <div className="px-4 sm:px-6 md:px-10 pb-10 md:pb-18 h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <FaCreditCard size={20} />

          <p className="font-medium text-sm sm:text-base">
            Credit or Debit Card
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            onPaymentError={(err) => showError(err, "Payment Error")}
            onPaymentSuccess={() => {
              showSuccess("Card added successfully", "Success");
              // navigate back to manage page so the user can see added card
              router.push("/dashboard/manage-payment-methods");
            }}
            navigateToManagePaymentMethods={true}
          />
        </Elements>
      </div>
    </>
  );
};

export default AddPaymentMethod;
