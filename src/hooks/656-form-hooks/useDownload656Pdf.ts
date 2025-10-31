// Updated hook: hooks/656-form-hooks/useDownload656Pdf.ts

"use client";

import api from "@/lib/services";
import { useState } from "react";
import toast from "react-hot-toast";

const useDownload656Pdf = () => {
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = async (
    caseId: string,
    title: string,
    downloadUrl?: string
  ) => {
    setDownloadingMap((prev) => ({ ...prev, [caseId]: true }));
    setError(null);

    try {
      let url: string;

    //   if (downloadUrl) {
    //     url = downloadUrl;
    //   } else {
        const response = await api.generate656Pdf(caseId);
        console.log("PDF Generation Response:", response);
        url = response.data.url; // Assuming the response structure has data.url
    //   }
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = `${title || "form-656"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to download PDF";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDownloadingMap((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  return { downloadPdf, downloadingMap, error };
};

export default useDownload656Pdf;
