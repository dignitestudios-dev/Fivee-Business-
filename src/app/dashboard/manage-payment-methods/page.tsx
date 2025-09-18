"use client";
import DeletePref from "@/components/icons/DeletePref";
import Popup from "@/components/ui/Popup";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaCcMastercard } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { SiVisa } from "react-icons/si";

const ManagePaymentMethods = () => {
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
      <div>
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
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/manage-payment-methods/edit/${card.last4}`}>
                <AiFillEdit size={20} />
              </Link>

              <RiDeleteBin6Fill
                size={20}
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  setDeletePaymentMethod("123");
                }}
              />
            </div>
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
