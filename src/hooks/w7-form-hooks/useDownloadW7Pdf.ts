"use client";

import { useState } from "react";
import api from "@/lib/services";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import { isDownloadableUrl } from "@/utils/formw7";

const useDownloadW7Pdf = () => {
  const { showError, showSuccess } = useGlobalPopup();
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Always regenerates before downloading. The API clears downloadUrl whenever a
   * section changes, but re-saving the signature section leaves the previously
   * generated file in place, so a cached URL can be stale.
   */
  const downloadPdf = async (caseId: string, title?: string) => {
    setDownloadingMap((prev) => ({ ...prev, [caseId]: true }));

    try {
      // The API does not gate PDF generation on payment, so the rule lives
      // here: every download path goes through this hook.
      const payment = await api.getW7SectionInfo(caseId, "paymentStatus");
      if (payment?.data?.status !== "completed") {
        throw new Error(
          "Payment is required before the form can be generated and downloaded."
        );
      }

      const response = await api.generateW7Pdf(caseId);
      const url = response?.data?.url;
      const filePath = response?.data?.filePath;

      if (isDownloadableUrl(url)) {
        const link = document.createElement("a");
        link.href = url as string;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = `${title || "form-w7"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      if (filePath) {
        // Development API responses return a path on the server's own disk
        showSuccess(
          `The form was generated on the server at ${filePath}. Running the API in production mode returns a downloadable link.`,
          "PDF generated"
        );
        return;
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
