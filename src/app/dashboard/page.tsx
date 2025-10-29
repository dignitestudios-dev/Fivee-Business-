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
                      setShowViewSavedPref("individual");
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
        formType={showViewSavedPref}
        isOpen={showViewSavedPref ? true : false}
        onClose={() => setShowViewSavedPref(null)}
      />

      <ManageSavedPreferencesSlider
        isOpen={showManageSavedPref}
        onClose={() => setShowManageSavedPref(false)}
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

const Form656List = () => {
  const cases = useAppSelector((s) => s.forms.form656) || [];
  const pagination = useAppSelector((s) => s.forms.form656Pagination);
  const { loading, loadingMore, loadMore, hasMore } = useUser656Cases();

  // load more is triggered explicitly via button to avoid race conditions

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {loading && cases.length === 0 ? (
          // initial full loader
          <div className="h-32">
            <FormLoader />
          </div>
        ) : cases.length === 0 ? (
          <p className="text-desc">No Form 656 cases found.</p>
        ) : (
          cases.map((c) => (
            <div
              key={c._id}
              className="w-full flex justify-between gap-5 p-4 border-b border-[#E7E8E9] items-center"
            >
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-desc">{formatDate(c.createdAt)}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/form-656?caseId=${c._id}`}
                  className="text-[var(--primary)] cursor-pointer group"
                >
                  View Details{" "}
                  <GoArrowRight size={18} className="mb-1 ms-1 inline move-x" />
                </Link>
              </div>
            </div>
          ))
        )}

        {/* load more button */}
        {!loading && hasMore ? (
          <div className="w-full flex justify-center py-3">
            <button
              onClick={() => loadMore()}
              disabled={loadingMore}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loadingMore ? (
                <Loader2 className="animate-spin h-5 w-5 text-white inline" />
              ) : (
                "Load more"
              )}
            </button>
          </div>
        ) : (
          // when no more data
          cases.length > 0 && (
            <p className="text-xs text-center text-desc mt-2">
              All data loaded
            </p>
          )
        )}
      </div>
    </div>
  );
};
