import api from "@/lib/services";
import { getError } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const usePayment = () => {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState({
    adding: false,
    getting: false,
    deleting: false,
    processing: false,
  });

  const handleAddPaymentMethod = async (
    stripe: any,
    elements: any,
    cardComplete: any,
    CardNumberElement: any
  ) => {
    try {
      if (!stripe || !elements) {
        const msg = "Stripe has not loaded yet. Please try again in a moment.";
        throw new Error(msg);
      }

      // Check if all card fields are complete
      if (
        !cardComplete.cardNumber ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardCvc ||
        !cardComplete.zipCode ||
        !cardComplete.cardHolderName
      ) {
        throw new Error("Please complete all card details");
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        const msg = "Card number input not found. Please refresh the page.";
        throw new Error(msg);
      }

      // Create payment method with billing details
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: cardComplete.cardHolderName,
            address: { postal_code: cardComplete.zipCode },
          },
        });

      if (pmError || !paymentMethod || !paymentMethod.id) {
        const msg = pmError?.message || "Payment method creation failed";
        throw new Error(msg);
      }

      router.push("/dashboard/manage-payment-methods");

      await api.addPaymentMethod({ paymentMethodId: paymentMethod.id });
    } catch (error: any) {
      const err = getError(error);
      toast.error(err);
    }
  };

  const handleGetPaymentMethods = async () => {
    try {
      const response = await api.getAllPaymentMethods();
      console.log("Card data: ", response);
    } catch (error: any) {
      const err = getError(error);
      toast.error(err);
    }
  };

  const handleDeletePaymentMethod = async () => {};

  const handleProcessPayment = async () => {};

  return {
    adding: loading.adding,
    handleAddPaymentMethod,
    getting: loading.getting,
    handleGetPaymentMethods,
    deleting: loading.deleting,
    handleDeletePaymentMethod,
    processing: loading.processing,
    handleProcessPayment,
  };
};

export default usePayment;
