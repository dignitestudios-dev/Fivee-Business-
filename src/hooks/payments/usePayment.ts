import { emptyCards, setCards } from "@/lib/features/cardsSlice";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { getError } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const usePayment = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
    setLoading((prev) => ({ ...prev, adding: true }));

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

      await api.addPaymentMethod({ paymentMethodId: paymentMethod.id });

      dispatch(emptyCards());
      router.push("/dashboard/manage-payment-methods");
    } catch (error: any) {
      const err = getError(error);
      toast.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, adding: false }));
    }
  };

  const handleGetPaymentMethods = async () => {
    setLoading((prev) => ({ ...prev, getting: true }));
    try {
      const response = await api.getAllPaymentMethods();
      if (response?.data?.cards && response?.data?.cards?.length)
        dispatch(setCards(response.data.cards));
    } catch (error: any) {
      const err = getError(error);
      toast.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, getting: false }));
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    setLoading((prev) => ({ ...prev, deleting: true }));
    try {
      await api.deletePaymentMethod(paymentMethodId);

      dispatch(emptyCards());
    } catch (error) {
      const err = getError(error);
      toast.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, deleting: false }));
    }
  };

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
