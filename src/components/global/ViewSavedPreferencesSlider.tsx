import { ChevronRight, X } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import TaxReceipt from "../icons/TaxReceipt";
import { formatDate, formatDateWithName } from "@/utils/helper";

interface ManageSavedPreferencesSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewSavedPreferencesSlider: React.FC<
  ManageSavedPreferencesSliderProps
> = ({ isOpen, onClose }) => {
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

        <div className="space-y-2 h-full overflow-y-auto pb-10">
          {savedPrefs.map((savedPref, index) => (
            <div
              key={index}
              className="group p-3 rounded-lg border border-[#e3e3e3] cursor-pointer hover:bg-gray-50 transition-all"
            >
              <div className="flex gap-5 items-center">
                <div className="flex-1">
                  <div className="bg-[var(--primary)] h-7 w-7 rounded-md flex justify-center items-center">
                    <TaxReceipt />
                  </div>

                  <p className="font-bold text-base mt-2">{savedPref.title}</p>

                  <p className="text-desc">
                    Last edited {formatDateWithName(savedPref.updatedAt)}
                  </p>
                </div>
                <div>
                  <ChevronRight size={18} className="move-x" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default ViewSavedPreferencesSlider;
