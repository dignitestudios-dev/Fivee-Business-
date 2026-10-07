"use client";

import { useCallback, useState } from "react";
import api from "@/lib/services";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { W7_SUPPORTING_DOCUMENT_CATEGORY } from "@/lib/constants";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const W7_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.webp";
export const W7_UPLOAD_HINT = "JPG, PNG, or WebP up to 5 MB";

/**
 * Uploads a supporting document and resolves its media id.
 *
 * POST /media/image returns only a success message, so the id has to be read
 * back from the list endpoint. A unique title is generated per upload so the
 * correct record can be identified.
 */
const useW7SupportingDocuments = () => {
  const { showError } = useGlobalPopup();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<W7SupportingDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const loadDocuments = useCallback(async () => {
    setLoadingDocuments(true);
    try {
      const response = await api.getW7SupportingDocuments(
        W7_SUPPORTING_DOCUMENT_CATEGORY,
        1,
        100
      );
      const images = response?.data?.images ?? [];
      setDocuments(images);
      return images;
    } catch (error: any) {
      console.error("Error loading W-7 supporting documents:", error);
      return [];
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      return `${file.name} is not a supported image. The API currently accepts ${W7_UPLOAD_HINT}.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `${file.name} is larger than 5 MB.`;
    }
    return null;
  };

  const uploadDocument = async (
    file: File,
    description: string,
    caseId: string | null
  ): Promise<W7SupportingDocument | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      showError(validationError, "Upload Error");
      return null;
    }

    setUploading(true);
    const uniqueTitle = `W7 ${caseId ?? "case"} ${Date.now()} ${file.name}`;

    try {
      const formData = new FormData();
      formData.append("title", uniqueTitle);
      formData.append(
        "description",
        description?.trim() || "Supporting document for Form W-7"
      );
      formData.append("category", W7_SUPPORTING_DOCUMENT_CATEGORY);
      formData.append("file", file);

      await api.uploadW7SupportingDocument(formData);

      const images = await loadDocuments();
      const uploaded = images.find((image) => image.title === uniqueTitle);

      if (!uploaded) {
        throw new Error(
          "The document was uploaded but could not be matched back to a media record"
        );
      }

      return uploaded;
    } catch (error: any) {
      showError(
        error?.message || "Failed to upload the supporting document",
        "Upload Error"
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadDocument,
    documents,
    loadDocuments,
    loadingDocuments,
  };
};

export default useW7SupportingDocuments;
