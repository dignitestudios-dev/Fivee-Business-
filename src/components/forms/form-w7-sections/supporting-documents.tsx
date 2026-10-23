"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/helper";
import { W7_LIMITS } from "@/lib/validation/formw7/rules";
import Modal from "@/components/ui/Modal";
import useW7SupportingDocuments, {
  W7_UPLOAD_ACCEPT,
  W7_UPLOAD_HINT,
} from "@/hooks/w7-form-hooks/useW7SupportingDocuments";

const COMMON_DOC_SUGGESTIONS = [
  "National identification card",
  "Foreign driver's license",
  "Civil birth certificate",
  "U.S. driver's license",
  "Foreign voter's registration card",
  "Passport",
];

export const getCleanFileName = (title?: string) => {
  if (!title) return "Document";
  // Matches "W7 <caseId> <timestamp> <originalFileName>"
  const match = title.match(/^W7\s+\S+\s+\d+\s+(.+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return title;
};

interface SupportingDocumentsProps {
  caseId: string | null;
  documentIds: string[];
  onDocumentIdsChange: (ids: string[]) => void;
  descriptions: string[];
  onDescriptionsChange: (descriptions: string[]) => void;
  initialDocuments?: W7SupportingDocument[];
  onDocumentsChange?: (docs: W7SupportingDocument[]) => void;
  /** One error message per description row (undefined when the row is fine). */
  descriptionErrors?: Array<string | undefined>;
  /** An error about the list as a whole (for example, too many entries). */
  descriptionsError?: string;
  error?: string;
  disabled?: boolean;
}

export function SupportingDocuments({
  caseId,
  documentIds,
  onDocumentIdsChange,
  descriptions,
  onDescriptionsChange,
  initialDocuments = [],
  onDocumentsChange,
  descriptionErrors = [],
  descriptionsError,
  error,
  disabled = false,
}: SupportingDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    uploading,
    uploadDocument,
    documents,
    loadDocuments,
    loadingDocuments,
  } = useW7SupportingDocuments();

  const [localDocs, setLocalDocs] = useState<W7SupportingDocument[]>(
    initialDocuments || []
  );

  useEffect(() => {
    if (initialDocuments && initialDocuments.length > 0) {
      setLocalDocs((prev) => {
        const map = new Map<string, W7SupportingDocument>();
        prev.forEach((d) => map.set(d._id, d));
        initialDocuments.forEach((d) => map.set(d._id, d));
        return Array.from(map.values());
      });
    }
  }, [initialDocuments]);

  const allDocumentsMap = useMemo(() => {
    const map = new Map<string, W7SupportingDocument>();
    (initialDocuments || []).forEach((doc) => map.set(doc._id, doc));
    localDocs.forEach((doc) => map.set(doc._id, doc));
    documents.forEach((doc) => map.set(doc._id, doc));
    return map;
  }, [initialDocuments, localDocs, documents]);

  const [pendingDescription, setPendingDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [showMailedSection, setShowMailedSection] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);

  // Resolves titles/thumbnails for documents attached in an earlier session if missing
  useEffect(() => {
    const hasMissing = documentIds.some((id) => !allDocumentsMap.has(id));
    if (documentIds.length && hasMissing) {
      loadDocuments();
    }
  }, [documentIds, allDocumentsMap, loadDocuments]);

  const attached = documentIds.map((id, index) => {
    const media = allDocumentsMap.get(id);
    const cleanFileName = getCleanFileName(media?.title);

    // Prioritize user-entered description for this document
    let label = descriptions[index]?.trim();
    if (!label && media?.description && media.description !== "Supporting document for Form W-7") {
      label = media.description.trim();
    }
    if (!label) {
      label = cleanFileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    }
    if (!label) {
      label = `Supporting Document ${index + 1}`;
    }

    return {
      _id: id,
      index,
      media,
      cleanFileName,
      label,
    };
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const finalDescription =
      pendingDescription.trim() ||
      file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

    const uploaded = await uploadDocument(file, finalDescription, caseId);
    if (uploaded) {
      const nextDocs = [
        ...localDocs.filter((d) => d._id !== uploaded._id),
        uploaded,
      ];
      setLocalDocs(nextDocs);
      onDocumentsChange?.(nextDocs);
      onDocumentIdsChange([...documentIds, uploaded._id]);
      if (descriptions.length < W7_LIMITS.maxDocumentDescriptions) {
        onDescriptionsChange([...descriptions, finalDescription]);
      }
      setPendingDescription("");
    }
  };

  const removeAttachedDocument = (indexToRemove: number) => {
    const idToRemove = documentIds[indexToRemove];
    onDocumentIdsChange(documentIds.filter((_, i) => i !== indexToRemove));
    if (indexToRemove < descriptions.length) {
      onDescriptionsChange(descriptions.filter((_, i) => i !== indexToRemove));
    }
    const nextDocs = localDocs.filter((d) => d._id !== idToRemove);
    setLocalDocs(nextDocs);
    onDocumentsChange?.(nextDocs);
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
    }
  };

  const startRename = (index: number, currentLabel: string) => {
    setEditingIndex(index);
    setEditingValue(currentLabel);
  };

  const saveRename = (index: number) => {
    if (editingValue.trim()) {
      const next = [...descriptions];
      while (next.length <= index) {
        next.push("");
      }
      next[index] = editingValue.trim();
      onDescriptionsChange(next);
    }
    setEditingIndex(null);
  };

  // Mailed-in descriptions are any descriptions beyond the uploaded documents
  const mailedDescriptions = descriptions.slice(documentIds.length);

  const addMailedDescription = () => {
    if (descriptions.length < W7_LIMITS.maxDocumentDescriptions) {
      onDescriptionsChange([...descriptions, ""]);
      setShowMailedSection(true);
    }
  };

  const updateMailedDescription = (mailedIndex: number, value: string) => {
    const actualIndex = documentIds.length + mailedIndex;
    const next = [...descriptions];
    next[actualIndex] = value;
    onDescriptionsChange(next);
  };

  const removeMailedDescription = (mailedIndex: number) => {
    const actualIndex = documentIds.length + mailedIndex;
    onDescriptionsChange(descriptions.filter((_, i) => i !== actualIndex));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600">
          Attach images of the documents that prove identity and foreign status.
          {W7_UPLOAD_HINT ? ` ${W7_UPLOAD_HINT}.` : ""}
        </p>
      </div>

      {/* Upload Box */}
      {!disabled && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-4 shadow-sm">
          <div>
            <Label className="text-sm font-semibold text-gray-800">
              Document Label / Description
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Specify what type of document you are uploading (e.g. National ID card, Driver&apos;s License).
            </p>
            <Input
              placeholder="e.g. National identification card"
              value={pendingDescription}
              maxLength={W7_LIMITS.documentDescription}
              onChange={(e) => setPendingDescription(e.target.value)}
              disabled={disabled || uploading}
              className="bg-white"
            />

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-gray-500 py-0.5">Quick fill:</span>
              {COMMON_DOC_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPendingDescription(suggestion)}
                  disabled={uploading}
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full border transition",
                    pendingDescription === suggestion
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={W7_UPLOAD_ACCEPT}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="pt-1 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="default"
              disabled={
                disabled ||
                uploading ||
                documentIds.length >= W7_LIMITS.maxSupportingDocuments
              }
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading
                ? "Uploading document..."
                : documentIds.length >= W7_LIMITS.maxSupportingDocuments
                ? `Maximum of ${W7_LIMITS.maxSupportingDocuments} documents reached`
                : "Choose File & Upload"}
            </Button>

            <span className="text-xs text-gray-500">
              {documentIds.length} of {W7_LIMITS.maxSupportingDocuments} attached
            </span>
          </div>
        </div>
      )}

      {loadingDocuments && !documents.length && (
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading attached documents...
        </p>
      )}

      {/* Attached Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-800">
            Attached Documents {attached.length > 0 && `(${attached.length})`}
          </Label>
        </div>

        {attached.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/50">
            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">No documents uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add your required identification document(s) using the upload box above.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {attached.map(({ _id, index, media, cleanFileName, label }) => {
              const isEditing = editingIndex === index;

              return (
                <div
                  key={_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm hover:border-gray-300 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Thumbnail */}
                    {media?.url ? (
                      media.url.toLowerCase().includes(".pdf") ? (
                        <div
                          className="h-14 w-14 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition text-red-600"
                          onClick={() =>
                            setPreviewDoc({
                              url: media.url,
                              title: cleanFileName,
                              description: label,
                            })
                          }
                          title="Click to view full preview"
                        >
                          <FileText className="h-6 w-6" />
                          <span className="text-[9px] font-bold uppercase mt-0.5">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={label}
                          className="h-14 w-14 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition shrink-0"
                          onClick={() =>
                            media &&
                            setPreviewDoc({
                              url: media.url,
                              title: cleanFileName,
                              description: label,
                            })
                          }
                          title="Click to view full preview"
                        />
                      )
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                    )}

                    {/* Label & Details */}
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2 max-w-sm">
                          <Input
                            value={editingValue}
                            maxLength={W7_LIMITS.documentDescription}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                            placeholder="Enter document label"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => saveRename(index)}
                            className="h-8 px-2.5 bg-green-600 hover:bg-green-700 text-white"
                            title="Save label"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingIndex(null)}
                            className="h-8 px-2.5"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {label}
                            </p>
                            <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                              Uploaded
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {cleanFileName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {media?.url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPreviewDoc({
                            url: media.url,
                            title: cleanFileName,
                            description: label,
                          })
                        }
                        className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-black h-8 px-3"
                        title="View document preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    )}

                    {!disabled && !isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startRename(index, label)}
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-black h-8 px-2.5"
                        title="Rename label"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    {!disabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttachedDocument(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5"
                        title="Remove document and label"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {/* Mailed-in Physical Documents Section (Optional) */}
      <div className="border-t border-gray-200 pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-gray-800">
              Documents mailed to IRS without upload (Optional)
            </Label>
            <p className="text-xs text-gray-500">
              Only list items here if you will mail certified physical documents to the IRS instead of uploading an image.
            </p>
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={descriptions.length >= W7_LIMITS.maxDocumentDescriptions}
              onClick={addMailedDescription}
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add mailed document
            </Button>
          )}
        </div>

        {(showMailedSection || mailedDescriptions.length > 0) && (
          <div className="space-y-2 mt-2">
            {mailedDescriptions.map((description, mailedIndex) => {
              const actualIndex = documentIds.length + mailedIndex;
              const rowError =
                descriptionErrors[actualIndex] || descriptionsError;

              return (
                <div key={actualIndex} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={description}
                      maxLength={W7_LIMITS.documentDescription}
                      placeholder="e.g. Certified birth certificate mailed by post"
                      onChange={(e) =>
                        updateMailedDescription(mailedIndex, e.target.value)
                      }
                      disabled={disabled}
                      aria-invalid={!!rowError}
                      className={cn(
                        "bg-white text-sm",
                        rowError && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {!disabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMailedDescription(mailedIndex)}
                        className="text-red-600 hover:text-red-700 h-9 px-2.5"
                        title="Remove mailed document entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {descriptionErrors[actualIndex] && (
                    <p className="text-xs text-red-600">
                      {descriptionErrors[actualIndex]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {descriptionsError && (
          <p className="text-sm text-red-600">{descriptionsError}</p>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.description || previewDoc.title || "Document Preview"}
          size="lg"
        >
          <div className="flex flex-col items-center justify-center p-2 space-y-4">
            <div className="max-h-[70vh] min-h-[300px] overflow-auto flex items-center justify-center w-full bg-gray-50 rounded-lg p-2 border border-gray-200">
              {previewDoc.url.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.description || previewDoc.title}
                  className="w-full h-[65vh] rounded border-0"
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.description || previewDoc.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded"
                />
              )}
            </div>
            <div className="flex items-center justify-between w-full pt-2">
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {previewDoc.title}
              </p>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-medium"
              >
                Open original <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
