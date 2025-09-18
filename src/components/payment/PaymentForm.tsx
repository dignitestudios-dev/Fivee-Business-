import React, { ChangeEvent, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "../ui/Button";
import { MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
// import { api } from "@/lib/services";
// import { OrderData } from "@/lib/types";
// import { utils } from "@/lib/utils";

const PaymentForm = ({
  onPaymentSuccess,
  onPaymentError,
}: {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    zipCode: "",
    cardHolderName: "",
  });
  // const { cart } = useAppSelector((state) => state.cart);

  const elementOptions = {
    style: {
      base: {
        color: "#424770",
        fontSize: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
          fontWeight: "300",
        },
        padding: "12px",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  const handleCardChange = (elementType: string) => (event: any) => {
    setCardComplete((prev) => ({
      ...prev,
      [elementType]: event.complete,
    }));
    setError("");
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ""); // remove anything not 0–9
    setCardComplete((prev) => ({ ...prev, zipCode: onlyNumbers }));
    setError("");
  };

  const handleCardHolderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardComplete((prev) => ({ ...prev, cardHolderName: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!stripe || !elements) {
    //   onPaymentError("Stripe not loaded");
    //   return;
    // }

    // Check if all card fields are complete
    if (
      !cardComplete.cardNumber ||
      !cardComplete.cardExpiry ||
      !cardComplete.cardCvc ||
      !cardComplete.zipCode ||
      !cardComplete.cardHolderName
    ) {
      setError("Please fill all fields");
      onPaymentError("Please complete all card details");
      return;
    }

    setLoading(true);
    // const cardNumberElement = elements.getElement(CardNumberElement);
    // if (!cardNumberElement) {
    //   onPaymentError("Card number element not found");
    //   setLoading(false);
    //   return;
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // // Create payment method
      // const { error: pmError, paymentMethod } =
      //   await stripe.createPaymentMethod({
      //     type: "card",
      //     card: cardNumberElement,
      //   });
      // if (pmError || !paymentMethod) {
      //   onPaymentError(pmError?.message || "Payment method creation failed");
      //   setLoading(false);
      //   return;
      // }
      // // If saving payment method, call backend API
      // const response = await fetch("/api/payment-methods", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     paymentMethodId: paymentMethod.id,
      //   }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to save payment method");
      // }
      // toast.success("Payment method saved successfully!");
      // onPaymentSuccess(data);
      router.push("/dashboard/manage-payment-methods");
    } catch (err: any) {
      const errorMessage = err?.message || "Payment method processing failed";
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Card Holder Name */}
      <div className="bg-white border border-[#E3E3E3] rounded-xl">
        <input
          type="text"
          id="cardHolderName"
          name="cardHolderName"
          className="px-3 py-4 w-full h-full outline-none placeholder:text-[#aab7c4] placeholder:font-light"
          placeholder="Card Holder Name"
          value={cardComplete.cardHolderName}
          onChange={handleCardHolderNameChange}
        />
      </div>

      <div className="border border-[#E3E3E3] rounded-xl overflow-hidden">
        {/* Card Number */}
        <div className="px-3 py-4 bg-white focus-within:ring-2 focus:ring-[var(--primary)] focus-within:border-transparent">
          <CardNumberElement
            id="cardNumber"
            options={{ ...elementOptions, placeholder: `Card Number` }}
            onChange={handleCardChange("cardNumber")}
          />
        </div>

        {/* Card Expiry and CVC */}
        <div className="grid grid-cols-2 border-t border-[#E3E3E3]">
          <div className="px-3 py-4 bg-white border-e border-[#E3E3E3] focus-within:ring-2 focus:ring-[var(--primary)] focus-within:border-transparent">
            <CardExpiryElement
              id="cardExpiry"
              options={{ ...elementOptions, placeholder: "Expiration" }}
              onChange={handleCardChange("cardExpiry")}
            />
          </div>

          <div className="px-3 py-4 bg-white focus-within:ring-2 focus:ring-[var(--primary)] focus-within:border-transparent">
            <CardCvcElement
              id="cardCvc"
              options={elementOptions}
              onChange={handleCardChange("cardCvc")}
            />
          </div>
        </div>
      </div>

      {/* ZIP Code */}
      <div className="bg-white border border-[#E3E3E3] rounded-xl">
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          className="px-3 py-4 w-full h-full outline-none placeholder:text-[#aab7c4] placeholder:font-light"
          placeholder="Zip Code"
          value={cardComplete.zipCode}
          onChange={handleZipCodeChange}
        />
      </div>

      <p className="text-red-600">{error}</p>

      <div className="w-full flex justify-end">
        <Button
          type="submit"
          disabled={
            !stripe ||
            loading ||
            !cardComplete.cardNumber ||
            !cardComplete.cardExpiry ||
            !cardComplete.cardCvc ||
            !cardComplete.zipCode ||
            !cardComplete.cardHolderName
          }
          className="flex justify-center items-center py-3 text-white bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
