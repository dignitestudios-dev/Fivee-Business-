import { ChevronRight, Delete, Edit, X } from "lucide-react";
import React, { useState } from "react";
import TaxReceipt from "../icons/TaxReceipt";
import { formatDate, formatDateWithName } from "@/utils/helper";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Popup from "../ui/Popup";
import EditPref from "../icons/EditPref";
import FInput from "../ui/FInput";
import DeletePref from "../icons/DeletePref";

interface ManageSavedPreferencesSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageSavedPreferencesSlider: React.FC<
  ManageSavedPreferencesSliderProps
> = ({ isOpen, onClose }) => {
  const [editPref, setEditPref] = useState<string | null>(null);
  const [confirmEdit, setConfirmEdit] = useState<boolean>(false);

  const [editingPrefName, setEditingPrefName] = useState<string>("");

  const [deletePref, setDeletePref] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

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

  const handleUpdatePref = () => {
    console.log("Editing...", editPref);
    setEditPref(null);
    setEditingPrefName("");
    setConfirmEdit(true);
  };

  const handleDeletePref = () => {
    console.log("Deleting...", deletePref);
    setDeletePref(null);
    setConfirmDelete(true);
  };

  return (
    <>
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

                    <p className="font-bold text-base mt-2">
                      {savedPref.title}
                    </p>

                    <p className="text-desc">
                      Last edited {formatDateWithName(savedPref.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <AiFillEdit
                      size={20}
                      onClick={() => {
                        setEditPref("123");
                        setEditingPrefName(savedPref?.title);
                      }}
                    />

                    <RiDeleteBin6Fill
                      size={20}
                      className="text-red-600"
                      onClick={() => {
                        setDeletePref("123");
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Editing Preferene */}
      <Popup
        open={editPref ? true : false}
        icon={<EditPref />}
        title="Preference Name"
        textOptions={{ title: "left" }}
        type="confirm"
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={handleUpdatePref}
        onCancel={() => setEditPref(null)}
      >
        <div className="w-full">
          <FInput
            autoFocus
            value={editingPrefName}
            onChange={(e) => setEditingPrefName(e.target.value)}
          />
        </div>
      </Popup>

      <Popup
        open={confirmEdit}
        icon={<EditPref />}
        title="Preference Name Updated"
        type="info"
        onClose={() => setConfirmEdit(false)}
      />

      {/* Deleting Preference */}
      <Popup
        open={deletePref ? true : false}
        icon={<DeletePref />}
        title="Delete Preference?"
        type="confirm"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeletePref}
        onCancel={() => setDeletePref(null)}
      />

      <Popup
        open={confirmDelete}
        icon={<DeletePref />}
        title="Item Deleted"
        type="error"
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default ManageSavedPreferencesSlider;
