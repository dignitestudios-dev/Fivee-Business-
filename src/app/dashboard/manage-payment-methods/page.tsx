"use client";
import DeletePref from "@/components/icons/DeletePref";
import Popup from "@/components/ui/Popup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaCcMastercard } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { SiVisa } from "react-icons/si";

const ManagePaymentMethods = () => {
  const router = useRouter();
  const [deletePaymentMethod, setDeletePaymentMethod] = useState<string | null>(
    null
  );
  const [confirmDeletePaymentMethod, setConfirmDeletePaymentMethod] =
    useState<boolean>(false);

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

  const handleDeletePaymentMethod = () => {
    console.log("Deleting...", deletePaymentMethod);
    setDeletePaymentMethod(null);
    setConfirmDeletePaymentMethod(true);
  };

  return (
    <>
      <div className="border-b border-[#E3E3E3] flex items-center gap-5 h-14">
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
      <div className="px-10 pb-18 h-full overflow-y-auto">
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

            <RiDeleteBin6Fill
              size={20}
              className="text-red-600 cursor-pointer"
              onClick={() => {
                setDeletePaymentMethod("123");
              }}
            />
          </div>
        ))}
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
        onConfirm={handleDeletePaymentMethod}
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
