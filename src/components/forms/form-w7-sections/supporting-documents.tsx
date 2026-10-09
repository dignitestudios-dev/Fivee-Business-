"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { W7_LIMITS } from "@/lib/validation/formw7/rules";
import useW7SupportingDocuments, {
  W7_UPLOAD_ACCEPT,
  W7_UPLOAD_HINT,
} from "@/hooks/w7-form-hooks/useW7SupportingDocuments";

interface SupportingDocumentsProps {
  caseId: string | null;
  documentIds: string[];
  onDocumentIdsChange: (ids: string[]) => void;
  descriptions: string[];
  onDescriptionsChange: (descriptions: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function SupportingDocuments({
  caseId,
  documentIds,
  onDocumentIdsChange,
  descriptions,
  onDescriptionsChange,
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
  const [pendingDescription, setPendingDescription] = useState("");

  // Resolves titles/thumbnails for documents attached in an earlier session
  useEffect(() => {
    if (documentIds.length) loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attached = documentIds.map((id) => ({
    _id: id,
    media: documents.find((document) => document._id === id),
  }));

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Reset so the same file can be picked again after a failed upload
    event.target.value = "";
    if (!file) return;

    const uploaded = await uploadDocument(file, pendingDescription, caseId);
    if (uploaded) {
      onDocumentIdsChange([...documentIds, uploaded._id]);
      if (
        pendingDescription.trim() &&
        descriptions.length < W7_LIMITS.maxDocumentDescriptions
      ) {
        onDescriptionsChange([...descriptions, pendingDescription.trim()]);
      }
      setPendingDescription("");
    }
  };

  const removeDocument = (id: string) => {
    onDocumentIdsChange(documentIds.filter((documentId) => documentId !== id));
  };

  const updateDescription = (index: number, value: string) => {
    const next = [...descriptions];
    next[index] = value;
    onDescriptionsChange(next);
  };

  return (
    <div className="space-y-5">
      <div>
        {/* The card title carries the heading; this is the hint beneath it */}
        <p className="text-sm text-gray-600">
          Attach images of the documents that prove identity and foreign status.
          {W7_UPLOAD_HINT ? ` ${W7_UPLOAD_HINT}.` : ""}
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 space-y-4">
        <Input
          placeholder="Optional label for the next upload, e.g. Passport identity page"
          value={pendingDescription}
          maxLength={W7_LIMITS.documentDescription}
          onChange={(event) => setPendingDescription(event.target.value)}
          disabled={disabled || uploading}
          className="bg-white"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={W7_UPLOAD_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          disabled={
            disabled ||
            uploading ||
            documentIds.length >= W7_LIMITS.maxSupportingDocuments
          }
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading
            ? "Uploading..."
            : documentIds.length >= W7_LIMITS.maxSupportingDocuments
            ? `Maximum of ${W7_LIMITS.maxSupportingDocuments} documents`
            : "Upload document"}
        </Button>
      </div>

      {loadingDocuments && !documents.length ? (
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading attached
          documents...
        </p>
      ) : null}

      {attached.length > 0 && (
        <div className="space-y-2">
          {attached.map(({ _id, media }) => (
            <div
              key={_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {media?.url ? (
                  // Remote media is rendered with a plain img tag, matching the
                  // rest of the app (no next/image remotePatterns configured)
                  <img
                    src={media.url}
                    alt={media.title || "Supporting document"}
                    className="h-12 w-12 rounded object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-100 border border-gray-200" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {media?.title || "Attached document"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {media?.description || _id}
                  </p>
                </div>
              </div>

              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeDocument(_id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3 border-t border-gray-200 pt-5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Additional document descriptions
          </Label>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              disabled={descriptions.length >= W7_LIMITS.maxDocumentDescriptions}
              onClick={() => onDescriptionsChange([...descriptions, ""])}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          List any document that is mailed to the IRS but not uploaded here.
        </p>

        {descriptions.map((description, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={description}
              maxLength={W7_LIMITS.documentDescription}
              placeholder="For example: Birth certificate"
              onChange={(event) => updateDescription(index, event.target.value)}
              disabled={disabled}
              className="bg-white"
            />
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onDescriptionsChange(
                    descriptions.filter((_, i) => i !== index)
                  )
                }
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
