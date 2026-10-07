"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowRight } from "react-icons/go";
import { Loader2 } from "lucide-react";
import { MdOutlineFileDownload } from "react-icons/md";

import { formatDate } from "@/utils/helper";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { Button } from "../ui/Button";
import useUserW7Cases from "@/hooks/w7-form-hooks/useUserW7Cases";
import useDownloadW7Pdf from "@/hooks/w7-form-hooks/useDownloadW7Pdf";
import useW7PaidCaseIds from "@/hooks/w7-form-hooks/useW7PaidCaseIds";
import ViewAllLink from "./ViewAllLink";

interface FormW7RowProps {
  c: FormW7Case;
  paid: boolean;
  paymentLoading: boolean;
  downloading?: boolean;
  onDownload: (c: FormW7Case) => void;
}

export const FormW7Row = ({
  c,
  paid,
  paymentLoading,
  downloading = false,
  onDownload,
}: FormW7RowProps) => {
  const router = useRouter();

  // "completed" and "edited" both mean every required section is saved. Once
  // paid the form is read-only, so "edited" carries no meaning for the user.
  const isSubmitted = c.isCompleted === "completed" || c.isCompleted === "edited";

  const status = !isSubmitted
    ? { label: "In progress", style: "bg-gray-100 text-gray-600" }
    : paymentLoading
    ? null
    : paid
    ? { label: "Paid", style: "bg-green-50 text-green-700" }
    : { label: "Payment pending", style: "bg-yellow-50 text-yellow-700" };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[#E7E8E9]">
      <div>
        <p className="font-semibold text-base sm:text-lg">{c.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-desc">{formatDate(c.createdAt)}</p>
          {status && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.style}`}
            >
              {status.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center gap-3">
        {isSubmitted && !paymentLoading && paid && (
          <Button
            onClick={() => onDownload(c)}
            variant={"outline"}
            disabled={downloading}
            title="Generate and download the completed Form W-7"
          >
            {downloading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <MdOutlineFileDownload />
            )}
          </Button>
        )}

        {isSubmitted && !paymentLoading && !paid && (
          <Button
            variant={"outline"}
            onClick={() =>
              router.push(`/dashboard/form-w7/payment?caseId=${c._id}`)
            }
          >
            Pay now
          </Button>
        )}

        <Link
          href={`/dashboard/form-w7?caseId=${c._id}`}
          className="text-[var(--primary)] cursor-pointer group"
        >
          View Details{" "}
          <GoArrowRight size={18} className="mb-1 ms-1 inline move-x" />
        </Link>
      </div>
    </div>
  );
};

/** The dashboard card: the latest few forms, with a link to the full list. */
const FormW7List = ({ limit = 5 }: { limit?: number }) => {
  // The store is shared with the start page, which loads a different filter
  const cases = (useAppSelector((s) => s.forms.formW7) || []).slice(0, limit);
  const { loading } = useUserW7Cases(1, limit);
  const { paidIds, loading: paymentLoading } = useW7PaidCaseIds();
  const { downloadPdf, downloadingMap } = useDownloadW7Pdf();

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {loading && cases.length === 0 ? (
          <div className="h-32">
            <FormLoader />
          </div>
        ) : cases.length === 0 ? (
          <p className="text-desc">No Form W-7 cases found.</p>
        ) : (
          cases.map((c) => (
            <FormW7Row
              key={c._id}
              c={c}
              paid={paidIds.has(c._id)}
              paymentLoading={paymentLoading}
              downloading={downloadingMap[c._id]}
              onDownload={(item) => downloadPdf(item._id, item.title)}
            />
          ))
        )}

        {cases.length > 0 && <ViewAllLink href="/dashboard/form-w7/all" />}
      </div>
    </div>
  );
};

export default FormW7List;
