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
      <div className="max-w-[768px] w-full m-4 sm:m-6 md:m-10 space-y-5 rounded-lg border border-[#E3E3E3] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ManagePaymentLayout;
