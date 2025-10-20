"use client";

import React, { useRef, useState, useEffect } from "react";
import { IoReload, IoTrash } from "react-icons/io5";
import SignatureCanvas from "react-signature-canvas";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useSignatures from "@/hooks/signatures/useSignatures";
import { dataURLtoFile, getBase64FromUrl } from "@/utils/helper";
import {
  addSignature,
  deleteSignature,
  updateSignature,
} from "@/lib/features/signaturesSlice";

interface SignatureData {
  _id: string;
  title: string;
  description: string;
  url: string;
}

export default function SignatureForm() {
  const signatures = useAppSelector(
    (state: any) => state.signatures.images || []
  );
  const dispatch = useAppDispatch();
  const {
    getting,
    creating,
    updating,
    deleting,
    handleGetSignatures,
    handleCreateSignature,
    handleUpdateSignature,
    handleDeleteSignature,
  } = useSignatures();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [viewMode, setViewMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    signature?: string;
  }>({});

  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const loadSignatures = async () => {
      if (!signatures.length) {
        await handleGetSignatures();
      }
    };
    loadSignatures();
  }, [signatures.length]);

  // Add new empty signature
  const handleAddSignature = () => {
    setIsNew(true);
    setSelectedId(null);
    setTitle("Untitled");
    setDescription("");
    setMode("draw");
    setViewMode(false);
    setPreview("");
    setUploadedFile(null);
    setErrors({});
    sigCanvas.current?.clear();
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      signature?: string;
    } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    let hasSignature = false;
    if (mode === "draw") {
      const dataUrl = sigCanvas.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");
      hasSignature =
        !!dataUrl &&
        dataUrl !==
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="; // Check if not empty canvas
    } else if (mode === "upload") {
      hasSignature = !!uploadedFile;
    }

    if (isNew || !viewMode) {
      if (!hasSignature) {
        newErrors.signature = "Signature is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save signature
  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    let file: File | null = null;
    if (mode === "draw") {
      const dataUrl = sigCanvas.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");
      if (dataUrl) {
        file = dataURLtoFile(dataUrl, `${title}.png`);
      }
    } else if (uploadedFile) {
      file = uploadedFile;
    }

    if (file) {
      formData.append("file", file);
    }

    if (isNew) {
      await handleCreateSignature(formData);
    } else if (selectedId) {
      await handleUpdateSignature(selectedId, formData);
    }

    await handleGetSignatures();

    setIsNew(false);
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setPreview("");
    setUploadedFile(null);
    setViewMode(false);
    setErrors({});
    sigCanvas.current?.clear();
  };

  // Delete signature
  const handleDelete = async () => {
    if (isNew) {
      setIsNew(false);
      setSelectedId(null);
      setTitle("");
      setDescription("");
      setPreview("");
      setUploadedFile(null);
      setViewMode(false);
      setErrors({});
      sigCanvas.current?.clear();
      return;
    }

    if (!selectedId) return;
    await handleDeleteSignature(selectedId);
    await handleGetSignatures();
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setPreview("");
    setUploadedFile(null);
    setViewMode(false);
    setErrors({});
    sigCanvas.current?.clear();
  };

  // When selecting from list
  const handleSelect = async (sig: SignatureData) => {
    setIsNew(false);
    setSelectedId(sig._id);
    setTitle(sig.title);
    setDescription(sig.description);
    setUploadedFile(null);
    if (sig.url) {
      setPreview(sig.url);
      setViewMode(true);
    } else {
      setPreview("");
      setViewMode(false);
      setMode("draw");
      sigCanvas.current?.clear();
    }
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, signature: undefined }));
    }
  };

  const handleRemoveUpload = () => {
    setUploadedFile(null);
    setPreview("");
  };

  const handleClearExisting = () => {
    setViewMode(false);
    setPreview("");
    setMode("draw");
    sigCanvas.current?.clear();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const isLoading = getting || creating || updating || deleting;

  return (
    <div className="flex bg-gray-50 gap-10">
      {/* Sidebar */}
      <div className="w-64 border border-[#E3E3E3] rounded-lg">
        <button
          onClick={handleAddSignature}
          disabled={isLoading}
          className="w-full cursor-pointer border-l-4 font-semibold border-[var(--primary)] p-4 text-[var(--primary)]"
        >
          <span className="text-2xl">+</span> &nbsp;&nbsp; Add Signature
        </button>

        <div>
          {getting ? (
            <p className="p-4 text-gray-600">Loading signatures...</p>
          ) : (
            signatures.map((sig: SignatureData) => (
              <div
                key={sig._id}
                onClick={() => !isLoading && handleSelect(sig)}
                className={`cursor-pointer border border-[#E3E3E3] border-l-4 border-l-[var(--primary)] p-2 ${
                  sig._id === selectedId
                    ? "bg-[var(--primary)] text-white"
                    : "bg-transparent text-black"
                }`}
              >
                <p className="font-medium">{sig.title}</p>
                <p
                  className={`text-xs ${
                    sig._id === selectedId ? "text-gray-200" : "text-gray-600"
                  } truncate`}
                >
                  {sig.description || "No details"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white rounded-lg border border-[#E3E3E3]">
        {selectedId || isNew ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Signature</h2>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="text-red-500 hover:underline"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            {!viewMode && (
              /* Mode Switch */
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setMode("draw")}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded ${
                    mode === "draw"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  onClick={() => setMode("upload")}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded ${
                    mode === "upload"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Upload Signature
                </button>
              </div>
            )}

            {/* Signature Area */}
            <div className="rounded-lg border border-[#E3E3E3] bg-white p-2 mb-4">
              {viewMode ? (
                <>
                  <img
                    src={preview}
                    alt="Signature"
                    className="w-[600px] h-[200px] object-contain"
                  />
                  <button
                    onClick={handleClearExisting}
                    disabled={isLoading}
                    className="flex items-center gap-2 py-2 mt-2 rounded-lg border border-red-500 bg-red-100 px-3 text-red-600 hover:bg-red-200 transition-all cursor-pointer"
                  >
                    <IoReload size={20} className="text-red-600" />
                    Clear
                  </button>
                </>
              ) : mode === "draw" ? (
                <>
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      width: 600,
                      height: 200,
                      className: "bg-white",
                    }}
                  />
                  <button
                    onClick={() => sigCanvas.current?.clear()}
                    disabled={isLoading}
                    className="flex items-center gap-2 py-2 mt-2 rounded-lg border border-red-500 bg-red-100 px-3 text-red-600 hover:bg-red-200 transition-all cursor-pointer"
                  >
                    <IoReload size={20} className="text-red-600" />
                    Clear
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="mb-2"
                  />
                  {preview && (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-[600px] h-[200px] object-contain"
                      />
                      <button
                        onClick={handleRemoveUpload}
                        disabled={isLoading}
                        className="flex items-center gap-2 py-2 mt-2 rounded-lg border border-red-500 bg-red-100 px-3 text-red-600 hover:bg-red-200 transition-all cursor-pointer"
                      >
                        <IoTrash size={20} className="text-red-600" />
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
              {errors.signature && (
                <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
              )}
            </div>

            {/* Title + Description */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="font-semibold">
                  Signature Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Signature Title"
                  value={title}
                  onChange={handleTitleChange}
                  disabled={isLoading}
                  className="w-full mt-2 rounded-lg border border-[#E3E3E3] px-2 py-3"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="font-semibold">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  disabled={isLoading}
                  className="w-full mt-2 rounded-lg border border-[#E3E3E3] px-2 py-3"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="rounded bg-[var(--primary)] px-12 cursor-pointer py-2 text-white hover:bg-green-600"
              >
                {creating || updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Select a signature or create a new one.
          </p>
        )}
      </div>
    </div>
  );
}
