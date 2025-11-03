"use client";
import DeletePref from "@/components/icons/DeletePref";
import Popup from "@/components/ui/Popup";
import usePayment from "@/hooks/payments/usePayment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaCcMastercard } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { SiVisa } from "react-icons/si";
import { Loader2 } from "lucide-react";
import FormLoader from "@/components/global/FormLoader";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";

const ManagePaymentMethods = () => {
  const {
    handleGetPaymentMethods,
    getting,
    handleDeletePaymentMethod,
    deleting,
  } = usePayment();
  const cards = useAppSelector((state) => state.cards.list);

  const getCardIcon = (brand: CardBrand) => {
    switch (brand) {
      case "visa":
        return <SiVisa className="text-[#1A1F71]" />;
      case "mastercard":
        return <FaCcMastercard className="text-[#EB001B]" />;
      case "amex":
        return (
          <span className="font-semibold text-blue-700 text-[10px]">Amex</span>
        );
      case "discover":
        return (
          <span className="font-semibold text-orange-600 text-[9px]">
            Discover
          </span>
        );
      case "jcb":
        return (
          <span className="font-semibold text-green-600 text-[12px]">JCB</span>
        );
      case "unionpay":
        return (
          <span className="font-semibold text-red-600 text-[9px]">
            UnionPay
          </span>
        );
      default:
        return <CiCreditCard1 className="text-green-600" />;
    }
  };

  const [deletePaymentMethod, setDeletePaymentMethod] = useState<string | null>(
    null
  );
  const [confirmDeletePaymentMethod, setConfirmDeletePaymentMethod] =
    useState<boolean>(false);

  const onDeletePaymentMethod = async () => {
    if (deletePaymentMethod) {
      await handleDeletePaymentMethod(deletePaymentMethod);
      handleGetPaymentMethods();
    } else {
      toast.error("Payment method ID is missing");
    }
    setDeletePaymentMethod(null);
    setConfirmDeletePaymentMethod(true);
  };

  useEffect(() => {
    if (!cards || !cards?.length) handleGetPaymentMethods();
  }, []);

  return (
    <>
      <div className="border-b border-[#E3E3E3] flex items-center gap-3 sm:gap-5 h-14">
        <Link
          href={"/dashboard"}
          className="px-3 h-full cursor-pointer bg-[var(--primary)]/10 text-[var(--primary)] font-semibold flex items-center gap-2"
        >
          <IoArrowBackOutline size={18} />
          Back
        </Link>
        <div className="flex-1">
          <p className="font-bold text-base">Payment Methods</p>
        </div>
        <Link
          href={"/dashboard/manage-payment-methods/add"}
          className="px-3 h-full font-semibold flex items-center gap-2"
        >
          <GoPlus size={24} className="text-black" />
          Add New
        </Link>
      </div>
      <div className="px-4 sm:px-6 md:px-10 pb-10 md:pb-18 h-full overflow-y-auto">
        {getting ? (
          <FormLoader />
        ) : !cards?.length ? (
          <p className="text-gray-400 text-center">No Card Added</p>
        ) : (
          cards?.map((card, index) => (
            <div
              key={index}
              className={`${
                index !== 0 && "border-t border-[#E3E3E3]"
              } py-4 flex items-center gap-2`}
            >
              <div className="rounded-lg bg-[var(--primary)]/10 h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] flex justify-center items-center text-[150%] sm:text-[200%]">
                {getCardIcon(card?.brand)}
              </div>

              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <p className="text-base font-semibold">
                    {card?.name || "_ _ _"}
                  </p>
                  {card?.isDefault && (
                    <div className="w-fit px-3 py-[2px] text-[var(--primary)] bg-[var(--primary)]/20 rounded-full">
                      default
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm sm:text-base">
                  Card ending with {card?.last4}
                </p>
              </div>

              <RiDeleteBin6Fill
                size={20}
                className="text-red-600 cursor-pointer"
                onClick={() => setDeletePaymentMethod(card?.id || null)}
              />
            </div>
          ))
        )}
      </div>

      {/* Deleting Payment Method */}
      <Popup
        open={deletePaymentMethod ? true : false}
        icon={<DeletePref />}
        title="Delete Payment Method?"
        message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, ea!"
        type="confirm"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={onDeletePaymentMethod}
        onCancel={() => setDeletePaymentMethod(null)}
      />

      <Popup
        open={confirmDeletePaymentMethod}
        icon={<DeletePref />}
        title="Payment Method Deleted"
        type="error"
        onClose={() => setConfirmDeletePaymentMethod(false)}
      />
    </>
  );
};

export default ManagePaymentMethods;
