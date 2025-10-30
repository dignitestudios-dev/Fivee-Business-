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
import useInitializeForm433A from "@/hooks/433a-form-hooks/useInitializeForm";
import useInitializeForm433B from "@/hooks/433b-form-hooks/useInitializeForm";
import { setCaseId } from "@/utils/helper";
import { BiChevronRight } from "react-icons/bi";
import { GoArrowRight } from "react-icons/go";
import Popup from "@/components/ui/Popup";
import EditPref from "@/components/icons/EditPref";
import FInput from "@/components/ui/FInput";
import { Button } from "@/components/ui/Button";
import useUser656Cases from "@/hooks/656-form-hooks/useUser656Cases";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Form656List from "@/components/forms/Form656List";

const Dashboard = () => {
  const router = useRouter();
  const [openForm, setOpenForm] = useState<"433a-oic" | "433b-oic" | null>(
    null
  );
  const [formTitle, setFormTitle] = useState<string>("");
  const [formTitleError, setFormTitleError] = useState<string>("");
  const [showViewSavedPref, setShowViewSavedPref] = useState<
    "individual" | "business" | null
  >(null);
  const [showManageSavedPref, setShowManageSavedPref] =
    useState<boolean>(false);

  // Initialize hooks for starting forms (must be called at top-level)
  const init433a = useInitializeForm433A();
  const init433b = useInitializeForm433B();

  const savedPref = [
    {
      title: "Form 433A OIC Drafts",
      updatedAt: "",
    },
    {
      title: "Form 433B OIC Drafts",
      updatedAt: "",
    },
  ];

  const handleSelectFromSavedPrefs = (type: "individual" | "business") => {
    console.log(type);

    setShowManageSavedPref(false);
    setShowViewSavedPref(type);
  };

  const handleFileTax = (type: "individual" | "business") => {
    console.log(type);

    type === "individual" ? setOpenForm("433a-oic") : setOpenForm("433b-oic");
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

  const handleIntializeTaxForm = async () => {
    if (!formTitle || !formTitle.trim()) {
      setFormTitleError("Form title is required");
      return;
    }
    try {
      if (openForm === "433a-oic") {
        const res = await init433a.start(formTitle);
        const caseId = res.caseId;
        if (caseId) {
          setCaseId(caseId);
          setOpenForm(null);
          setFormTitle("");
          router.push(`/dashboard/433a-oic?caseId=${caseId}`);
        }
      } else if (openForm === "433b-oic") {
        const res = await init433b.start(formTitle);
        const caseId = res.caseId;
        if (caseId) {
          setCaseId(caseId);
          setOpenForm(null);
          setFormTitle("");
          router.push(`/dashboard/433b-oic?caseId=${caseId}`);
        }
      }
    } catch (error) {
      // errors are shown by hooks via toast; optionally set form error
      setFormTitleError("");
    }
  };

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
                      // Only set the manage saved pref state, type will be determined by the title
                      setShowManageSavedPref(true);
                      const type = pref.title.toLowerCase().includes("433b")
                        ? "business"
                        : "individual";
                      // Pass the type to ManageSavedPreferencesSlider directly without showing ViewSavedPreferencesSlider
                      setShowViewSavedPref(type);
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

              {/* <button className=" flex items-center gap-1 group cursor-pointer">
                View All <BiChevronRight className="text-xl move-x" />{" "}
              </button> */}
            </div>
          </div>

          <div className="border border-[#E7E8E9] rounded-xl p-5">
            <div className="flex justify-between gap-5">
              <p className="text-lg font-bold mb-5">Form 656 Review</p>

              <Button
                variant={"outline"}
                onClick={() => router.push("/dashboard/form-656/start")}
              >
                {" "}
                + Create new
              </Button>
            </div>

            <div>
              <div className="w-full">
                <Form656List />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewSavedPreferencesSlider
        formType={!showManageSavedPref ? showViewSavedPref : null}
        isOpen={!showManageSavedPref && showViewSavedPref ? true : false}
        onClose={() => setShowViewSavedPref(null)}
      />

      <ManageSavedPreferencesSlider
        isOpen={showManageSavedPref}
        onClose={() => {
          setShowManageSavedPref(false);
          setShowViewSavedPref(null); // Clear the formType state when closing
        }}
        formType={showViewSavedPref}
      />

      {/* Start form: Title input popup */}
      <Popup
        open={openForm ? true : false}
        icon={<EditPref />}
        title={`Form ${openForm?.toUpperCase()}`}
        textOptions={{ title: "left" }}
        type="confirm"
        confirmText="Start"
        cancelText="Cancel"
        onConfirm={handleIntializeTaxForm}
        onCancel={() => {
          setOpenForm(null);
          setFormTitleError("");
          setFormTitle("");
        }}
      >
        <div className="w-full">
          <FInput
            autoFocus
            value={formTitle}
            placeholder="Enter title"
            className={formTitleError && "border-red-500"}
            onChange={(e) => {
              setFormTitleError("");
              setFormTitle(e.target.value);
            }}
          />

          {formTitleError && (
            <p className="text-red-500 mt-1">{formTitleError}</p>
          )}
        </div>
      </Popup>
    </>
  );
};

export default Dashboard;
