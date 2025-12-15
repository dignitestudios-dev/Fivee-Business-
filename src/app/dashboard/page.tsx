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
import useUser433aCases from "@/hooks/433a-form-hooks/useUser433aCases";
import useUser433bCases from "@/hooks/433b-form-hooks/useUser433bCases";
import useUser433aCompletedCases from "@/hooks/433a-form-hooks/useUser433aCompletedCases";
import useUser433bCompletedCases from "@/hooks/433b-form-hooks/useUser433bCompletedCases";
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
import { Loader2, Copy } from "lucide-react";
import useClone433a from "@/hooks/433a-form-hooks/useClone433a";
import useClone433b from "@/hooks/433b-form-hooks/useClone433b";
import Link from "next/link";
import Form656List from "@/components/forms/Form656List";
import { useFcmSubscription } from "@/hooks/notification/useFcmSubscription";

const Dashboard = () => {
  const router = useRouter();
  const [openForm, setOpenForm] = useState<"433a-oic" | "433b-oic" | null>(
    null
  );
  const [popupStep, setPopupStep] = useState<
    "choice" | "create" | "clone" | null
  >(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formTitleError, setFormTitleError] = useState<string>("");
  const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);
  const [showViewSavedPref, setShowViewSavedPref] = useState<
    "individual" | "business" | null
  >(null);
  const [showManageSavedPref, setShowManageSavedPref] =
    useState<boolean>(false);

  useFcmSubscription();

  // Initialize hooks for starting forms (must be called at top-level)
  const init433a = useInitializeForm433A();
  const init433b = useInitializeForm433B();

  // hooks for cloning: fetch completed forms for clone popup
  const aCompletedHook = useUser433aCompletedCases(1, 50);
  const bCompletedHook = useUser433bCompletedCases(1, 50);

  // hooks for drafts/saved preferences: fetch all forms
  const aHook = useUser433aCases(1, 50, "all");
  const bHook = useUser433bCases(1, 50, "all");

  const casesACompleted =
    useAppSelector((s) => s.forms.form433aCompleted) || [];
  const casesBCompleted =
    useAppSelector((s) => s.forms.form433bCompleted) || [];
  const casesA = useAppSelector((s) => s.forms.form433a) || [];
  const casesB = useAppSelector((s) => s.forms.form433b) || [];

  const cloneA = useClone433a();
  const cloneB = useClone433b();
  const [cloningId, setCloningId] = useState<string | null>(null);

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
    setPopupStep("choice");
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

  const handleCreateNew = async () => {
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
          setPopupStep(null);
          setFormTitle("");
          router.push(`/dashboard/433a-oic?caseId=${caseId}`);
        }
      } else if (openForm === "433b-oic") {
        const res = await init433b.start(formTitle);
        const caseId = res.caseId;
        if (caseId) {
          setCaseId(caseId);
          setOpenForm(null);
          setPopupStep(null);
          setFormTitle("");
          router.push(`/dashboard/433b-oic?caseId=${caseId}`);
        }
      }
    } catch (error) {
      // errors are shown by hooks via toast; optionally set form error
      setFormTitleError("");
    }
  };

  const handleCloneA = async (id: string, title: string) => {
    setCloningId(id);
    try {
      const newId = await cloneA.clone(id, title);
      if (newId) {
        setCaseId(newId);
        setOpenForm(null);
        setPopupStep(null);
        setFormTitle("");
        setSelectedCloneId(null);
        router.push(`/dashboard/433a-oic?caseId=${newId}`);
      }
    } catch (err) {
      // clone hook shows toast
    } finally {
      setCloningId(null);
    }
  };

  const handleCloneB = async (id: string, title: string) => {
    setCloningId(id);
    try {
      const newId = await cloneB.clone(id, title);
      if (newId) {
        setCaseId(newId);
        setOpenForm(null);
        setPopupStep(null);
        setFormTitle("");
        setSelectedCloneId(null);
        router.push(`/dashboard/433b-oic?caseId=${newId}`);
      }
    } catch (err) {
      // clone hook shows toast
    } finally {
      setCloningId(null);
    }
  };

  const handleClone = async () => {
    if (!formTitle || !formTitle.trim()) {
      setFormTitleError("Form title is required");
      return;
    }
    if (!selectedCloneId) {
      setFormTitleError("Please select a form to clone");
      return;
    }
    if (openForm === "433a-oic") {
      await handleCloneA(selectedCloneId, formTitle);
    } else if (openForm === "433b-oic") {
      await handleCloneB(selectedCloneId, formTitle);
    }
  };

  return (
    <>
      <div className="flex justify-center flex-1 overflow-y-auto">
        <div className="shadow-brand space-y-5 p-4 sm:p-5 rounded-lg m-4 sm:m-6 md:m-10 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-7 sm:pt-12 gap-6 sm:gap-10 border border-[#E7E8E9] rounded-xl">
              <div className="space-y-3">
                <IndividualTaxIcon />
                <p className="font-bold text-base sm:text-lg">
                  File Individual Tax
                </p>
                <p className="text-desc text-sm sm:text-base">
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

              <div className="space-y-3">
                <BusinessTaxIcon />
                <p className="font-bold text-base sm:text-lg">
                  File Business Tax
                </p>
                <p className="text-desc text-sm sm:text-base">
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
            <div className="text-white bg-[var(--primary)] rounded-xl p-4 sm:p-5 space-y-1">
              <p className="font-semibold text-base sm:text-lg">
                Saved Preferences
              </p>
              <p className="font-light text-sm sm:text-base">
                Get started from your saved forms.
              </p>

              <div className="my-4 sm:my-6 space-y-3">
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
                    className="w-full cursor-pointer group rounded-xl bg-black/10 py-3 px-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-nowrap text-sm sm:text-base">
                        {pref.title}
                      </p>
                    </div>
                    <BiChevronRight className="text-xl sm:text-2xl text-white move-x" />
                  </button>
                ))}
              </div>

              {/* <button className=" flex items-center gap-1 group cursor-pointer">
                View All <BiChevronRight className="text-xl move-x" />{" "}
              </button> */}
            </div>
          </div>

          <div className="border border-[#E7E8E9] rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-5 mb-3 sm:mb-5">
              <p className="text-base sm:text-lg font-bold">
                Form 656 Review{" "}
                <span className="text-gray-400 text-xs font-medium">
                  (Only completed forms can be downloaded.)
                </span>
              </p>
              <Button
                variant={"outline"}
                onClick={() => router.push("/dashboard/form-656/start")}
              >
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
        open={openForm && popupStep ? true : false}
        icon={<EditPref />}
        title={
          popupStep === "choice"
            ? `Choose Option for Form ${openForm?.toUpperCase()}`
            : popupStep === "create"
            ? `Create New Form ${openForm?.toUpperCase()}`
            : `Clone Form ${openForm?.toUpperCase()}`
        }
        textOptions={{ title: "left" }}
        type={popupStep === "choice" ? "info" : "confirm"}
        confirmText={popupStep === "create" ? "Create" : "Clone"}
        cancelText="Cancel"
        onConfirm={popupStep === "create" ? handleCreateNew : handleClone}
        onCancel={() => {
          setOpenForm(null);
          setPopupStep(null);
          setFormTitleError("");
          setFormTitle("");
          setSelectedCloneId(null);
        }}
        onClose={() => {
          setOpenForm(null);
          setPopupStep(null);
          setFormTitleError("");
          setFormTitle("");
          setSelectedCloneId(null);
        }}
      >
        {popupStep === "choice" && (
          <div className="w-full space-y-4">
            <p className="text-sm text-gray-600">
              Choose how you want to start your form:
            </p>
            <div className="w-full flex justify-center gap-4 mt-6">
              <FButton
                type="button"
                className="min-w-[96px] w-full"
                variant="primary"
                onClick={() => setPopupStep("create")}
              >
                Create New
              </FButton>
              <FButton
                type="button"
                className="min-w-[96px] w-full"
                variant="outline"
                onClick={() => setPopupStep("clone")}
              >
                Clone Previous
              </FButton>
            </div>
          </div>
        )}

        {(popupStep === "create" || popupStep === "clone") && (
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

            {popupStep === "clone" && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">
                  Select a form to clone
                </p>
                <div className="max-h-48 overflow-auto space-y-2">
                  {openForm === "433a-oic" && (
                    <>
                      {aCompletedHook.loading &&
                      casesACompleted.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                          <FormLoader />
                        </div>
                      ) : casesACompleted.length === 0 ? (
                        <p className="text-desc">
                          No completed 433A forms available.
                        </p>
                      ) : (
                        <>
                          {casesACompleted.map((c) => (
                            <div
                              key={c._id}
                              className={`flex items-center justify-between p-2 border rounded cursor-pointer ${
                                selectedCloneId === c._id
                                  ? "border-blue-500 bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => setSelectedCloneId(c._id)}
                            >
                              <div>
                                <p className="font-medium text-sm">{c.title}</p>
                                <p className="text-xs text-desc">
                                  {formatDate(c.createdAt)}
                                </p>
                              </div>
                              {selectedCloneId === c._id && (
                                <div className="text-blue-500">
                                  <Copy className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          ))}

                          {!aCompletedHook.loading &&
                            aCompletedHook.hasMore && (
                              <div className="w-full flex justify-center py-2">
                                <FButton
                                  size="sm"
                                  onClick={() => aCompletedHook.loadMore()}
                                  disabled={aCompletedHook.loadingMore}
                                >
                                  {aCompletedHook.loadingMore ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                  ) : (
                                    "Load more"
                                  )}
                                </FButton>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  )}

                  {openForm === "433b-oic" && (
                    <>
                      {bCompletedHook.loading &&
                      casesBCompleted.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                          <FormLoader />
                        </div>
                      ) : casesBCompleted.length === 0 ? (
                        <p className="text-desc">
                          No completed 433B forms available.
                        </p>
                      ) : (
                        <>
                          {casesBCompleted.map((c) => (
                            <div
                              key={c._id}
                              className={`flex items-center justify-between p-2 border rounded cursor-pointer ${
                                selectedCloneId === c._id
                                  ? "border-blue-500 bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => setSelectedCloneId(c._id)}
                            >
                              <div>
                                <p className="font-medium text-sm">{c.title}</p>
                                <p className="text-xs text-desc">
                                  {formatDate(c.createdAt)}
                                </p>
                              </div>
                              {selectedCloneId === c._id && (
                                <div className="text-blue-500">
                                  <Copy className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          ))}

                          {!bCompletedHook.loading &&
                            bCompletedHook.hasMore && (
                              <div className="w-full flex justify-center py-2">
                                <FButton
                                  size="sm"
                                  onClick={() => bCompletedHook.loadMore()}
                                  disabled={bCompletedHook.loadingMore}
                                >
                                  {bCompletedHook.loadingMore ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                  ) : (
                                    "Load more"
                                  )}
                                </FButton>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Popup>
    </>
  );
};

export default Dashboard;
