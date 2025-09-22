"use client";
import ManageSavedPreferencesSlider from "@/components/global/ManageSavedPreferencesSlider";
import ViewSavedPreferencesSlider from "@/components/global/ViewSavedPreferencesSlider";
import BusinessTaxIcon from "@/components/icons/BusinessTaxIcon";
import Doc from "@/components/icons/Doc";
import Edit from "@/components/icons/Edit";
import IndividualTaxIcon from "@/components/icons/IndividualTaxIcon";
import FButton from "@/components/ui/FButton";
import DropdownPopup from "@/components/ui/DropdownPopup";
import { formatDate, formatDateWithName } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { GoArrowRight } from "react-icons/go";

const Dashboard = () => {
  const router = useRouter();
  const [showViewSavedPref, setShowViewSavedPref] = useState<boolean>(false);
  const [showManageSavedPref, setShowManageSavedPref] =
    useState<boolean>(false);

  const savedPref = [
    {
      title: "Draft 1",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
    {
      title: "Draft 2",
      updatedAt: "2025-09-09T07:28:14.365+00:00",
    },
    {
      title: "Draft 3",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
  ];

  const handleSelectFromSavedPrefs = (type: "individual" | "business") => {
    console.log(type);

    setShowManageSavedPref(false);
    setShowViewSavedPref(true);
  };

  const handleFileTax = (type: "individual" | "business") => {
    console.log(type);
    router.push(
      type === "individual"
        ? "/dashboard/individual-tax-form"
        : "/dashboard/business-tax-form"
    );
  };

  const IndividualTaxOptions = [
    {
      label: "New Draft",
      icon: <Edit />,
      onClick: () => handleFileTax("individual"),
    },
    {
      label: "Choose from Saved Preferences",
      icon: <Doc />,
      onClick: () => handleSelectFromSavedPrefs("individual"),
    },
  ];

  const businessTaxOptions = [
    {
      label: "New Draft",
      icon: <Edit />,
      onClick: () => handleFileTax("business"),
    },
    {
      label: "Choose from Saved Preferences",
      icon: <Doc />,
      onClick: () => handleSelectFromSavedPrefs("business"),
    },
  ];

  return (
    <>
      <div className="flex justify-center flex-1 overflow-y-auto">
        <div className="shadow-brand space-y-5 p-5 rounded-lg m-10">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 grid grid-cols-2 p-7 pt-12 gap-10 border border-[#E7E8E9] rounded-xl">
              <div className="max-w-[280px] space-y-3">
                <IndividualTaxIcon />
                <p className="font-bold text-lg">File Individual Tax</p>
                <p className="text-desc ">
                  Potenti feugiat sit libero leo id vitae. Sit euismod ac nulla
                  vitae magna sed quis.
                </p>

                <DropdownPopup
                  trigger={
                    <FButton className="bg-black text-white" size="md">
                      File New Tax
                    </FButton>
                  }
                  title="File Tax"
                  options={IndividualTaxOptions}
                  placement="bottom-left"
                />
              </div>

              <div className="max-w-[280px] space-y-3">
                <BusinessTaxIcon />
                <p className="font-bold text-lg">File Business Tax</p>
                <p className="text-desc ">
                  Potenti feugiat sit libero leo id vitae. Sit euismod ac nulla
                  vitae magna sed quis.
                </p>

                <DropdownPopup
                  trigger={
                    <FButton className="bg-black text-white" size="md">
                      File New Tax
                    </FButton>
                  }
                  title="File Tax"
                  options={businessTaxOptions}
                  placement="bottom-left"
                />
              </div>
            </div>
            <div className="w-96 text-white bg-[var(--primary)] rounded-xl p-5 space-y-1">
              <p className="font-semibold text-lg">Saved Preferences</p>
              <p className=" font-light">Get started from your saved forms.</p>

              <div className="my-6 space-y-3">
                {savedPref.map((pref, index) => (
                  <button
                    onClick={() => {
                      setShowViewSavedPref(false);
                      setShowManageSavedPref(true);
                    }}
                    disabled={showManageSavedPref}
                    key={index}
                    className="w-full cursor-pointer group rounded-xl bg-black/10 py-3.5 px-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-bold  text-nowrap">{pref.title}</p>

                      <p className="text-xs">
                        Last edited {formatDateWithName(pref.updatedAt)}
                      </p>
                    </div>
                    <BiChevronRight className="text-2xl text-white move-x" />
                  </button>
                ))}
              </div>

              <button className=" flex items-center gap-1 group cursor-pointer">
                View All <BiChevronRight className="text-xl move-x" />{" "}
              </button>
            </div>
          </div>

          <div className="border border-[#E7E8E9] rounded-xl p-5">
            <p className="text-lg font-bold mb-5">Form 656 Review</p>
            <div>
              <div className="w-full flex justify-between gap-5 p-4 border-b border-[#E7E8E9]">
                <p>Overview of Various Tax Forms</p>
                <p className="text-[#0F1E27]">
                  {formatDate(new Date().toString())}
                </p>
                <button className="text-[var(--primary)] cursor-pointer group">
                  View Details{" "}
                  <GoArrowRight size={18} className="mb-1 ms-1 inline move-x" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewSavedPreferencesSlider
        isOpen={showViewSavedPref}
        onClose={() => setShowViewSavedPref(false)}
      />

      <ManageSavedPreferencesSlider
        isOpen={showManageSavedPref}
        onClose={() => setShowManageSavedPref(false)}
      />
    </>
  );
};

export default Dashboard;
