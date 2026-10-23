"use client";

import { useState } from "react";
import api from "@/lib/services";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { isDownloadableUrl } from "@/utils/formw7";
import { useAppDispatch } from "@/lib/hooks";
import { updateW7CaseDownloadUrl } from "@/lib/features/formsSlice";

const useDownloadW7Pdf = () => {
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useGlobalPopup();
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>(
    {}
  );

  const downloadPdf = async (
    caseId: string,
    title?: string,
    downloadUrl?: string
  ): Promise<string | undefined> => {
    setDownloadingMap((prev) => ({ ...prev, [caseId]: true }));

    try {
      // 1. Can't download form till paid
      const payment = await api.getW7SectionInfo(caseId, "paymentStatus");
      if (payment?.data?.status !== "completed") {
        throw new Error(
          "Payment is required before the form can be generated and downloaded."
        );
      }

      // 2. Once paid and generated, do not call generate API; download from the existing link
      let existingUrl = downloadUrl;
      if (!existingUrl) {
        try {
          const casesRes = await api.getUserFormW7Cases(1, 100, "all");
          const found = casesRes?.data?.cases?.find((c) => c._id === caseId);
          if (found?.downloadUrl) {
            existingUrl = found.downloadUrl;
            dispatch(
              updateW7CaseDownloadUrl({ caseId, downloadUrl: found.downloadUrl })
            );
          }
        } catch {
          // If fetching cases fails, continue to generate
        }
      }

      if (existingUrl) {
        if (isDownloadableUrl(existingUrl)) {
          const link = document.createElement("a");
          link.href = existingUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.download = `${title || "form-w7"}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return existingUrl;
        }

        // Development API responses return a path on the server's own disk
        showSuccess(
          `The form was previously generated on the server at ${existingUrl}. Running the API in production mode returns a downloadable link.`,
          "PDF generated"
        );
        return existingUrl;
      }

      // If not yet generated, call the generate API
      const response = await api.generateW7Pdf(caseId);
      const url = response?.data?.url;
      const filePath = response?.data?.filePath;
      const resultUrl = url || filePath;

      if (resultUrl) {
        dispatch(updateW7CaseDownloadUrl({ caseId, downloadUrl: resultUrl }));
      }

      if (isDownloadableUrl(url)) {
        const link = document.createElement("a");
        link.href = url as string;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = `${title || "form-w7"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return url;
      }

      if (filePath) {
        // Development API responses return a path on the server's own disk
        showSuccess(
          `The form was generated on the server at ${filePath}. Running the API in production mode returns a downloadable link.`,
          "PDF generated"
        );
        return filePath;
      }

      throw new Error("The server did not return a downloadable file");
    } catch (error: any) {
      showError(
        error?.message || "Failed to generate the Form W-7 PDF",
        "PDF Download Error"
      );
    } finally {
      setDownloadingMap((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  return { downloadPdf, downloadingMap };
};

export default useDownloadW7Pdf;
