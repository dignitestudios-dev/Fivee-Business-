"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { GoPlus } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";

const ManagePaymentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();

  return (
    <div className="flex justify-center flex-1 overflow-y-auto">
      <div className="max-w-[768px] w-full m-10 space-y-5 rounded-lg border border-[#E3E3E3] overflow-hidden">
        <div className="border-b border-[#E3E3E3] flex items-center gap-5 h-14">
          <button
            onClick={() => router.back()}
            className="px-3 h-full cursor-pointer bg-[var(--primary)]/10 text-[var(--primary)] font-semibold flex items-center gap-2"
          >
            <IoArrowBackOutline size={18} />
            Back
          </button>
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

        <div className="px-10 pb-18 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ManagePaymentLayout;
