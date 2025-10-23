import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import FButton from "../ui/FButton";
import { useRouter } from "next/navigation";
import usePayment from "@/hooks/payments/usePayment";
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
  const [error, setError] = useState<string>("");
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    zipCode: "",
    cardHolderName: "",
  });
  const { adding, handleAddPaymentMethod } = usePayment();

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

    handleAddPaymentMethod(
      stripe,
      elements,
      cardComplete,
      CardNumberElement
    );
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
        <FButton
          type="submit"
          disabled={
            !stripe ||
            adding ||
            !cardComplete.cardNumber ||
            !cardComplete.cardExpiry ||
            !cardComplete.cardCvc ||
            !cardComplete.zipCode ||
            !cardComplete.cardHolderName
          }
          className="flex justify-center items-center py-3 text-white bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </div>
          ) : (
            "Save"
          )}
        </FButton>
      </div>
    </form>
  );
};

export default PaymentForm;
