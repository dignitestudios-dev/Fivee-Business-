"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import api from "@/lib/services";
import FormLoader from "@/components/global/FormLoader";
import { FormW7Row } from "@/components/forms/FormW7List";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import usePaginatedList from "@/hooks/usePaginatedList";
import useDownloadW7Pdf from "@/hooks/w7-form-hooks/useDownloadW7Pdf";
import useW7PaidCaseIds from "@/hooks/w7-form-hooks/useW7PaidCaseIds";

const PAGE_SIZE = 10;

const AllFormW7 = () => {
  const router = useRouter();
  const { downloadPdf, downloadingMap } = useDownloadW7Pdf();
  const { paidIds, loading: paymentLoading } = useW7PaidCaseIds();

  const { items, total, totalPages, page, setPage, loading, error } =
    usePaginatedList<FormW7Case>(async (p, limit) => {
      const res = await api.getUserFormW7Cases(p, limit, "all");
      return {
        items: res?.data?.cases ?? [],
        total: res?.data?.total ?? 0,
        totalPages: res?.data?.totalPages ?? 1,
      };
    }, PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold">Form W-7</h2>
              <p className="text-sm text-desc">
                {total > 0
                  ? `${total} application${total === 1 ? "" : "s"}. The form can be downloaded once payment is complete.`
                  : "ITIN applications"}
              </p>
            </div>
          </div>

          <Button
            variant={"outline"}
            onClick={() => router.push("/dashboard/form-w7/start")}
          >
            + Create new
          </Button>
        </div>

        <div className="border border-[#E7E8E9] rounded-xl p-4 sm:p-5">
          {loading && items.length === 0 ? (
            <div className="h-32">
              <FormLoader />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-desc">No Form W-7 cases found.</p>
          ) : (
            <div className={loading ? "opacity-60 pointer-events-none" : ""}>
              {items.map((c) => (
                <FormW7Row
                  key={c._id}
                  c={c}
                  paid={paidIds.has(c._id)}
                  paymentLoading={paymentLoading}
                  downloading={downloadingMap[c._id]}
                  onDownload={(item) => downloadPdf(item._id, item.title)}
                />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            disabled={loading}
            onPageChange={(next) => {
              setPage(next);
              window.scrollTo({ top: 0 });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AllFormW7;
