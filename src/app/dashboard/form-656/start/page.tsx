"use client";
import React, { useEffect, useState } from "react";
import useUser433aCases from "@/hooks/433a-form-hooks/useUser433aCases";
import useUser433bCases from "@/hooks/433b-form-hooks/useUser433bCases";
import { useAppSelector } from "@/lib/hooks";
import { formatDate } from "@/utils/helper";
import FormLoader from "@/components/global/FormLoader";
import { useRouter } from "next/navigation";
import api from "@/lib/services";
import toast from "react-hot-toast";
import FButton from "@/components/ui/FButton";
import FInput from "@/components/ui/FInput";
import { Loader2, Check } from "lucide-react";

const StartForm656 = () => {
  const router = useRouter();

  // hooks provide pagination and loading; we show infinite scroll inside each list
  const aHook = useUser433aCases(1, 10);
  const bHook = useUser433bCases(1, 10);

  const casesA = useAppSelector((s) => s.forms.form433a) || [];
  const casesB = useAppSelector((s) => s.forms.form433b) || [];

  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [usedPreQualifierOrIOLA, setUsedPreQualifierOrIOLA] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // initial fetch handled by hooks already
  }, []);

  const canSubmit = Boolean(title && (selectedA || selectedB));

  const handleStart = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = {
        form433AId: selectedA,
        form433BOICId: selectedB,
        usedPreQualifierOrIOLACheck: usedPreQualifierOrIOLA,
        title,
      };

      const res = await api.startForm656(payload as any);
      const caseId = res?.data?.caseId;
      if (caseId) {
        toast.success("Form 656 created");
        router.push(`/dashboard/form-656?caseId=${caseId}`);
      } else {
        toast.error("Failed to create form 656");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to start form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Start Form 656</h2>
            <p className="text-sm text-desc">Create an Offer in Compromise by selecting your existing forms.</p>
          </div>
        </div>

        {/* Top: 433A and 433B side-by-side on md+, stacked on small screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 433A list */}
          <div>
            <h3 className="font-semibold mb-3">Form 433A — Individual</h3>
            <div className="bg-white border rounded-lg shadow-sm h-72 overflow-auto p-2">
              {aHook.loading && casesA.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <FormLoader />
                </div>
              ) : casesA.length === 0 ? (
                <p className="text-desc p-4">No 433A cases found.</p>
              ) : (
                <div className="space-y-2">
                  {casesA.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedA(selectedA === c._id ? null : c._id)}
                      aria-pressed={selectedA === c._id}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        selectedA === c._id
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                          : "border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className={`text-xs ${selectedA === c._id ? "text-white/90" : "text-desc"}`}>{formatDate(c.createdAt)}</p>
                      </div>
                      <div className="text-sm">
                        {selectedA === c._id ? (
                          <div className="flex items-center gap-1 text-white">
                            <Check className="h-5 w-5" />
                            <span className="text-xs">Selected</span>
                          </div>
                        ) : (
                          <span className="text-desc hover:text-[var(--primary)]">Click to select</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {aHook.hasMore && (
                <div className="w-full flex justify-center py-3">
                  <FButton size="sm" onClick={() => aHook.loadMore()} disabled={aHook.loadingMore}>
                    {aHook.loadingMore ? <Loader2 className="animate-spin h-4 w-4" /> : "Load more"}
                  </FButton>
                </div>
              )}
            </div>
          </div>

          {/* 433B list */}
          <div>
            <h3 className="font-semibold mb-3">Form 433B — Business</h3>
            <div className="bg-white border rounded-lg shadow-sm h-72 overflow-auto p-2">
              {bHook.loading && casesB.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <FormLoader />
                </div>
              ) : casesB.length === 0 ? (
                <p className="text-desc p-4">No 433B cases found.</p>
              ) : (
                <div className="space-y-2">
                  {casesB.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedB(selectedB === c._id ? null : c._id)}
                      aria-pressed={selectedB === c._id}
                      className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.01] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        selectedB === c._id
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                          : "border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className={`text-xs ${selectedB === c._id ? "text-white/90" : "text-desc"}`}>{formatDate(c.createdAt)}</p>
                      </div>
                      <div className="text-sm">
                        {selectedB === c._id ? (
                          <div className="flex items-center gap-1 text-white">
                            <Check className="h-5 w-5" />
                            <span className="text-xs">Selected</span>
                          </div>
                        ) : (
                          <span className="text-desc hover:text-[var(--primary)]">Click to select</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {bHook.hasMore && (
                <div className="w-full flex justify-center py-3">
                  <FButton size="sm" onClick={() => bHook.loadMore()} disabled={bHook.loadingMore}>
                    {bHook.loadingMore ? <Loader2 className="animate-spin h-4 w-4" /> : "Load more"}
                  </FButton>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Details below on large screens */}
        <div className="mt-6">
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-3">Application Details</h3>
            <label className="block text-sm font-medium mb-1">Title</label>
            <FInput value={title} onChange={(e) => setTitle((e as any).target.value)} placeholder="Enter application title" />

            <div className="mt-4">
              <label className="inline-flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 mr-3"
                  checked={usedPreQualifierOrIOLA}
                  onChange={(e) => setUsedPreQualifierOrIOLA(e.target.checked)}
                />
                <div className="text-sm text-desc">
                  I used the Pre-Qualifier tool or the Individual Online Account eligibility (IOLA) check prior to filling out this form.
                </div>
              </label>
            </div>

            <div className="mt-6">
              <FButton className="w-full" onClick={handleStart} disabled={!canSubmit || submitting}>
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" /> Creating...
                  </span>
                ) : (
                  "Start Form 656"
                )}
              </FButton>
              <p className="text-xs text-desc mt-3">You can select either an Individual (433A) or Business (433B) form or both.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartForm656;
