"use client";
import React, { useState } from "react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/features/userSlice";
import { DUMMY_USER } from "@/lib/constants";

const OnBoardForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("self-employed");

  const handleSubmit = () => {
    if (!employmentType) return;
    console.log(employmentType);

    dispatch(
      loginUser({ user: { ...DUMMY_USER, employmentType: employmentType } })
    );

    router.push("/dashboard");
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">What would best describe you</h2>

      <div className="space-y-5 my-5">
        <div
          onClick={() => setEmploymentType("self-employed")}
          className={`h-[48px] w-full rounded-xl cursor-pointer border-2 flex gap-2 items-center py-2 px-4 ${
            employmentType === "self-employed"
              ? "border-[var(--primary)]"
              : "border-[#E3E3E3]"
          }`}
        >
          <div
            className={`p-1 w-5 h-5 ${
              employmentType === "self-employed"
                ? "bg-[var(--primary)]"
                : "bg-white"
            } rounded-full border border-gray-300`}
          >
            <div className="h-full w-full bg-white rounded-full" />
          </div>{" "}
          Self Employed
        </div>
        <div
          onClick={() => setEmploymentType("business-owner")}
          className={`h-[48px] w-full rounded-xl cursor-pointer border-2 flex gap-2 items-center py-2 px-4 ${
            employmentType === "business-owner"
              ? "border-[var(--primary)]"
              : "border-[#E3E3E3]"
          }`}
        >
          <div
            className={`p-1 w-5 h-5 ${
              employmentType === "business-owner"
                ? "bg-[var(--primary)]"
                : "bg-white"
            } rounded-full border border-gray-300`}
          >
            <div className="h-full w-full bg-white rounded-full" />
          </div>{" "}
          Business Owner
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
      >
        Continue
      </Button>
    </div>
  );
};

export default OnBoardForm;
