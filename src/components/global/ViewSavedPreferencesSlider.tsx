import { ChevronRight, X } from "lucide-react";
import React from "react";
import TaxReceipt from "../icons/TaxReceipt";
import { formatDate, formatDateWithName } from "@/utils/helper";
import useUser433aCases from "@/hooks/433a-form-hooks/useUser433aCases";
import useUser433bCases from "@/hooks/433b-form-hooks/useUser433bCases";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "./FormLoader";
import Link from "next/link";

interface ManageSavedPreferencesSliderProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "individual" | "business" | null;
}

const ViewSavedPreferencesSlider: React.FC<
  ManageSavedPreferencesSliderProps
> = ({ isOpen, onClose, formType }) => {
  console.log("formType: ", formType);
  const { form433a, form433b } = useAppSelector((state) => state.forms);

  const { loading: loading433a } = useUser433aCases();
  const { loading: loading433b } = useUser433bCases();

  const savedPrefs = [
    {
      title: "Understanding Income Tax: A Guide",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
    {
      title: "Exploring Corporate Tax Obligations",
      updatedAt: "2025-09-09T07:28:14.365+00:00",
    },
    {
      title: "Navigating Sales Tax Regulations",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
    {
      title: "A Look at Property Tax Assessments",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
    {
      title: "What You Need to Know About Capital Gains Tax",
      updatedAt: "2025-09-09T07:28:14.365+00:00",
    },
    {
      title: "An Introduction to Inheritance Tax",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
    {
      title: "What is Estate Tax and How Does It Work?",
      updatedAt: "2025-09-10T00:11:46.341+00:00",
    },
  ];

  return (
    <div
      className={`fixed top-0 ${
        isOpen ? "right-0" : "right-[-100%]"
      } w-full flex justify-end transition-all`}
      onClick={onClose}
    >
      <aside
        className={`p-5 h-screen shadow-lg w-[450px] max-w-full bg-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex gap-5 mb-5 items-center justify-between">
          <p className="font-bold text-lg">Saved Preferences</p>

          <div
            className="h-6 w-6 flex justify-center items-center rounded border border-gray-200 cursor-pointer"
            onClick={onClose}
          >
            <X size={12} />
          </div>
        </div>

        {(loading433a || loading433b) && <FormLoader />}

        {formType === "individual" && (
          <div className="h-full overflow-y-auto pb-10">
            {form433a && form433a.length ? (
              form433a.map((savedPref, index) => (
                <Link href={`/dashboard/433a-oic?caseId=${savedPref._id}`}>
                  <div
                    key={index}
                    className="mb-2 group p-3 rounded-lg border border-[#e3e3e3] cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <div className="flex gap-5 items-center">
                      <div className="flex-1">
                        <div className="bg-[var(--primary)] h-7 w-7 rounded-md flex justify-center items-center">
                          <TaxReceipt />
                        </div>

                        <p className="font-bold text-base mt-2">
                          {savedPref.title}
                        </p>

                        <p className="text-desc">
                          Last edited {formatDateWithName(savedPref.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <ChevronRight size={18} className="move-x" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                No record for Form 433A OIC
              </p>
            )}
          </div>
        )}

        {formType === "business" && (
          <div className="h-full overflow-y-auto pb-10">
            {form433b && form433b.length ? (
              form433b.map((savedPref, index) => (
                <Link href={`/dashboard/433b-oic/?caseId=${savedPref._id}`}>
                  <div
                    key={index}
                    className="mb-2 group p-3 rounded-lg border border-[#e3e3e3] cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <div className="flex gap-5 items-center">
                      <div className="flex-1">
                        <div className="bg-[var(--primary)] h-7 w-7 rounded-md flex justify-center items-center">
                          <TaxReceipt />
                        </div>

                        <p className="font-bold text-base mt-2">
                          {savedPref.title}
                        </p>

                        <p className="text-desc">
                          Last edited {formatDateWithName(savedPref.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <ChevronRight size={18} className="move-x" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                No record for Form 433A OIC
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

export default ViewSavedPreferencesSlider;
