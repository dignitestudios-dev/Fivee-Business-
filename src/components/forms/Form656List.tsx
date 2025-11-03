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
import useDownload656Pdf from "@/hooks/656-form-hooks/useDownload656Pdf"; // Import the new hook
import { MdOutlineFileDownload } from "react-icons/md";

const Form656List = () => {
  const cases = useAppSelector((s) => s.forms.form656) || [];
  const pagination = useAppSelector((s) => s.forms.form656Pagination);
  const { loading, loadingMore, loadMore, hasMore } = useUser656Cases();
  const { downloadPdf, downloadingMap } = useDownload656Pdf(); // Use the hook

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {loading && cases.length === 0 ? (
          // initial full loader
          <div className="h-32">
            <FormLoader />
          </div>
        ) : cases.length === 0 ? (
          <p className="text-desc">No Form 656 cases found.</p>
        ) : (
          cases.map((c) => (
            <div
              key={c._id}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[#E7E8E9]"
            >
              <div>
                <p className="font-semibold text-base sm:text-lg">{c.title}</p>
                <p className="text-xs text-desc">{formatDate(c.createdAt)}</p>
              </div>

              <div className="flex flex-row items-center gap-3">
                {c?.isCompleted === "completed" && (
                  <Button
                    onClick={() => downloadPdf(c._id, c.title, c.downloadUrl)}
                    variant={"outline"}
                    disabled={downloadingMap[c._id]}
                  >
                    {downloadingMap[c._id] ? (
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
          ))
        )}

        {/* load more button */}
        {!loading && hasMore ? (
          <div className="w-full flex justify-center py-3">
            <button
              onClick={() => loadMore()}
              disabled={loadingMore}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loadingMore ? (
                <Loader2 className="animate-spin h-5 w-5 text-white inline" />
              ) : (
                "Load more"
              )}
            </button>
          </div>
        ) : (
          // when no more data
          cases.length > 0 && (
            <p className="text-xs text-center text-desc mt-2">
              All data loaded
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Form656List;
