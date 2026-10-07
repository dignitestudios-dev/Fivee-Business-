"use client";
import { formatDate } from "@/utils/helper";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import useUser656Cases from "@/hooks/656-form-hooks/useUser656Cases";
import { useAppSelector } from "@/lib/hooks";
import FormLoader from "@/components/global/FormLoader";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";
import useDownload656Pdf from "@/hooks/656-form-hooks/useDownload656Pdf";
import { MdOutlineFileDownload } from "react-icons/md";
import ViewAllLink from "./ViewAllLink";

interface Form656RowProps {
  c: FormCase;
  downloading?: boolean;
  onDownload: (c: FormCase) => void;
}

export const Form656Row = ({
  c,
  downloading = false,
  onDownload,
}: Form656RowProps) => (
  <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[#E7E8E9]">
    <div>
      <p className="font-semibold text-base sm:text-lg">{c.title}</p>
      <p className="text-xs text-desc">{formatDate(c.createdAt)}</p>
    </div>

    <div className="flex flex-row items-center gap-3">
      {c?.isCompleted === "completed" && (
        <Button
          onClick={() => onDownload(c)}
          variant={"outline"}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <MdOutlineFileDownload />
          )}
        </Button>
      )}

      <Link
        href={`/dashboard/form-656?caseId=${c._id}`}
        className="text-[var(--primary)] cursor-pointer group"
      >
        View Details{" "}
        <GoArrowRight size={18} className="mb-1 ms-1 inline move-x" />
      </Link>
    </div>
  </div>
);

/** The dashboard card: the latest few forms, with a link to the full list. */
const Form656List = ({ limit = 5 }: { limit?: number }) => {
  // The store is shared with other screens that load larger lists
  const cases = (useAppSelector((s) => s.forms.form656) || []).slice(0, limit);
  const { loading } = useUser656Cases(1, limit);
  const { downloadPdf, downloadingMap } = useDownload656Pdf();

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {loading && cases.length === 0 ? (
          <div className="h-32">
            <FormLoader />
          </div>
        ) : cases.length === 0 ? (
          <p className="text-desc">No Form 656 cases found.</p>
        ) : (
          cases.map((c) => (
            <Form656Row
              key={c._id}
              c={c}
              downloading={downloadingMap[c._id]}
              onDownload={(item) =>
                downloadPdf(item._id, item.title, item.downloadUrl)
              }
            />
          ))
        )}

        {cases.length > 0 && <ViewAllLink href="/dashboard/form-656/all" />}
      </div>
    </div>
  );
};

export default Form656List;
