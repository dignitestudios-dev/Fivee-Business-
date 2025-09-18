"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const Dashboard = () => {
  const router = useRouter();
  router.push("/dashboard");

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <BiLoaderAlt className="animate-spin text-gray-400" size={44} />
    </div>
  );
};

export default Dashboard;
