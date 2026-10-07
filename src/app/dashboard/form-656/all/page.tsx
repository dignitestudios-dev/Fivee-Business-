"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import api from "@/lib/services";
import FormLoader from "@/components/global/FormLoader";
import { Form656Row } from "@/components/forms/Form656List";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import usePaginatedList from "@/hooks/usePaginatedList";
import useDownload656Pdf from "@/hooks/656-form-hooks/useDownload656Pdf";

const PAGE_SIZE = 10;

const AllForm656 = () => {
  const router = useRouter();
  const { downloadPdf, downloadingMap } = useDownload656Pdf();

  const { items, total, totalPages, page, setPage, loading, error } =
    usePaginatedList<FormCase>(async (p, limit) => {
      const res = await api.getUserForm656Cases(p, limit);
      const cases: FormCase[] = Array.isArray(res?.data)
        ? res.data
        : res?.data?.cases || [];
      return {
        items: cases,
        total: res?.data?.total ?? cases.length,
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
              <h2 className="text-2xl font-bold">Form 656</h2>
              <p className="text-sm text-desc">
                {total > 0
                  ? `${total} application${total === 1 ? "" : "s"}. Only completed forms can be downloaded.`
                  : "Offer in Compromise"}
              </p>
            </div>
          </div>

          <Button
            variant={"outline"}
            onClick={() => router.push("/dashboard/form-656/start")}
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
            <p className="text-desc">No Form 656 cases found.</p>
          ) : (
            <div className={loading ? "opacity-60 pointer-events-none" : ""}>
              {items.map((c) => (
                <Form656Row
                  key={c._id}
                  c={c}
                  downloading={downloadingMap[c._id]}
                  onDownload={(item) =>
                    downloadPdf(item._id, item.title, item.downloadUrl)
                  }
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

export default AllForm656;
