"use client";
import { ChevronRight, X } from "lucide-react";
import React, { useState } from "react";
import TaxReceipt from "../icons/TaxReceipt";
import { formatDateWithName } from "@/utils/helper";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Popup from "../ui/Popup";
import EditPref from "../icons/EditPref";
import FInput from "../ui/FInput";
import DeletePref from "../icons/DeletePref";
import useUser433aCases from "@/hooks/433a-form-hooks/useUser433aCases";
import useUser433bCases from "@/hooks/433b-form-hooks/useUser433bCases";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "./FormLoader";
import api from "@/lib/services";

interface ManageSavedPreferencesSliderProps {
  isOpen: boolean;
  onClose: () => void;
  formType?: "individual" | "business" | null;
}

const ManageSavedPreferencesSlider: React.FC<
  ManageSavedPreferencesSliderProps
> = ({ isOpen, onClose, formType = null }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmEdit, setConfirmEdit] = useState<boolean>(false);
  const [editingPrefName, setEditingPrefName] = useState<string>("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { form433a, form433b } = useAppSelector((state) => state.forms);

  const {
    loading: loading433a,
    loadingMore: loadingMore433a,
    loadMore: loadMore433a,
    hasMore: hasMore433a,
    refetch: refetch433a,
  } = useUser433aCases();

  const {
    loading: loading433b,
    loadingMore: loadingMore433b,
    loadMore: loadMore433b,
    hasMore: hasMore433b,
    refetch: refetch433b,
  } = useUser433bCases();

  const loading = formType === "business" ? loading433b : loading433a;

  const items = formType === "business" ? form433b : form433a;

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingPrefName(currentTitle);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      if (formType === "business") {
        await api.updateForm433b(editingId, { title: editingPrefName });
        await refetch433b();
      } else {
        await api.updateForm433a(editingId, { title: editingPrefName });
        await refetch433a();
      }
      setEditingId(null);
      setConfirmEdit(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      if (formType === "business") {
        await api.deleteForm433b(deleteId);
        await refetch433b();
      } else {
        await api.deleteForm433a(deleteId);
        await refetch433a();
      }
      setDeleteId(null);
      setConfirmDelete(true);
    } catch (err: any) {
      console.error(err);
    }
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
            <p className="font-bold text-lg">Manage Saved Preferences</p>

            <div
              className="h-6 w-6 flex justify-center items-center rounded border border-gray-200 cursor-pointer"
              onClick={onClose}
            >
              <X size={12} />
            </div>
          </div>

          {loading && <FormLoader />}

          <div
            className="h-full overflow-y-auto pb-10"
            onScroll={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              if (formType === "individual") {
                if (
                  target.scrollHeight - target.scrollTop - target.clientHeight <
                    120 &&
                  hasMore433a &&
                  !loading433a
                ) {
                  loadMore433a();
                }
              } else if (formType === "business") {
                if (
                  target.scrollHeight - target.scrollTop - target.clientHeight <
                    120 &&
                  hasMore433b &&
                  !loading433b
                ) {
                  loadMore433b();
                }
              }
            }}
          >
            {items && items.length ? (
              items.map((item) => (
                <div
                  key={item._id}
                  className="group p-3 rounded-lg border border-[#e3e3e3] mb-3"
                >
                  <div className="flex gap-5 items-center">
                    <div className="flex-1">
                      <div className="bg-[var(--primary)] h-7 w-7 rounded-md flex justify-center items-center">
                        <TaxReceipt />
                      </div>

                      <p className="font-bold text-base mt-2">{item.title}</p>

                      <p className="text-desc">
                        Last edited {formatDateWithName(item.updatedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <AiFillEdit
                        size={18}
                        onClick={() => handleStartEdit(item._id, item.title)}
                      />
                      <RiDeleteBin6Fill
                        size={18}
                        className="text-red-600"
                        onClick={() => setDeleteId(item._id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No saved preferences</p>
            )}
          </div>
        </aside>
      </div>

      {/* Edit popup */}
      <Popup
        open={editingId ? true : false}
        icon={<EditPref />}
        title="Edit Preference Name"
        textOptions={{ title: "left" }}
        type="confirm"
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={handleUpdate}
        onCancel={() => setEditingId(null)}
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
        title="Preference Updated"
        type="info"
        onClose={() => setConfirmEdit(false)}
      />

      {/* Delete confirmation */}
      <Popup
        open={deleteId ? true : false}
        icon={<DeletePref />}
        title="Delete Preference?"
        type="confirm"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
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
