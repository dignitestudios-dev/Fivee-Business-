"use client";
import React, { useEffect, useState } from "react";
import useUser433aCompletedCases from "@/hooks/433a-form-hooks/useUser433aCompletedCases";
import useUser433bCompletedCases from "@/hooks/433b-form-hooks/useUser433bCompletedCases";
import { useAppSelector } from "@/lib/hooks";
import { formatDate } from "@/utils/helper";
import FormLoader from "@/components/global/FormLoader";
import { useRouter } from "next/navigation";
import api from "@/lib/services";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import FButton from "@/components/ui/FButton";
import FInput from "@/components/ui/FInput";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import useUser656Cases from "@/hooks/656-form-hooks/useUser656Cases";

const StartForm656 = () => {
  const router = useRouter();
  const { showError, showSuccess } = useGlobalPopup();

  // hooks provide pagination and loading; fetch completed forms only
  const aHook = useUser433aCompletedCases(1, 50);
  const bHook = useUser433bCompletedCases(1, 50);
  const hook656 = useUser656Cases(1, 20);

  const casesA = useAppSelector((s) => s.forms.form433aCompleted) || [];
  const casesB = useAppSelector((s) => s.forms.form433bCompleted) || [];
  const cases656 = useAppSelector((s) => s.forms.form656) || [];

  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [usedPreQualifierOrIOLA, setUsedPreQualifierOrIOLA] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"choice" | "create" | "clone">("choice");

  useEffect(() => {
    // initial fetch handled by hooks already
  }, []);

  const canSubmit = Boolean(
    title &&
      (selectedA || selectedB) &&
      (mode === "create" || (mode === "clone" && selectedCloneId))
  );

  const handleStart = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload: any = {
        form433AId: selectedA,
        form433BOICId: selectedB,
        usedPreQualifierOrIOLACheck: usedPreQualifierOrIOLA,
        title,
      };
      if (mode === "clone") {
        payload.caseId = selectedCloneId;
      }

      const res = await api.startForm656(payload);
      const caseId = res?.data?.caseId;
      if (caseId) {
        showSuccess("Form 656 created", "Success");
        router.push(`/dashboard/form-656?caseId=${caseId}`);
      } else {
        showError("Failed to create form 656", "Error");
      }
    } catch (err: any) {
      showError(err?.message || "Failed to start form", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold">Start Form 656</h2>
              <p className="text-sm text-desc">
                Create an Offer in Compromise by selecting your existing forms.
              </p>
            </div>
          </div>
        </div>

        {mode === "choice" && (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Choose an option</h3>
            <div className="flex gap-4">
              <FButton onClick={() => setMode("create")} className="flex-1">
                Create New
              </FButton>
              <FButton
                onClick={() => setMode("clone")}
                variant="outline"
                className="flex-1"
              >
                Clone Previous
              </FButton>
            </div>
          </div>
        )}

        {(mode === "create" || mode === "clone") && (
          <>
            {mode === "clone" && (
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-semibold mb-3">
                  Select a Form 656 to Clone
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hook656.loading && cases656.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center py-6">
                      <FormLoader />
                    </div>
                  ) : cases656.length === 0 ? (
                    <p className="col-span-full text-desc p-4">
                      No Form 656 cases found.
                    </p>
                  ) : (
                    cases656.map((c) => (
                      <button
                        key={c._id}
                        onClick={() =>
                          setSelectedCloneId(
                            selectedCloneId === c._id ? null : c._id
                          )
                        }
                        aria-pressed={selectedCloneId === c._id}
                        className={`text-left p-3 rounded-lg border transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                          selectedCloneId === c._id
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                            : "border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{c.title}</p>
                          <p
                            className={`text-xs ${
                              selectedCloneId === c._id
                                ? "text-white/90"
                                : "text-desc"
                            }`}
                          >
                            {formatDate(c.createdAt)}
                          </p>
                        </div>
                        {selectedCloneId === c._id && (
                          <div className="text-white">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Top: 433A and 433B side-by-side on md+, stacked on small screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 433A list */}
              <div>
                <h3 className="font-semibold mb-3">Form 433A — Individual</h3>
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm h-72 overflow-auto p-2">
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
                          onClick={() =>
                            setSelectedA(selectedA === c._id ? null : c._id)
                          }
                          aria-pressed={selectedA === c._id}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                            selectedA === c._id
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                              : "border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{c.title}</p>
                            <p
                              className={`text-xs ${
                                selectedA === c._id
                                  ? "text-white/90"
                                  : "text-desc"
                              }`}
                            >
                              {formatDate(c.createdAt)}
                            </p>
                          </div>
                          <div className="text-sm">
                            {selectedA === c._id ? (
                              <div className="flex items-center gap-1 text-white">
                                <Check className="h-5 w-5" />
                                <span className="text-xs">Selected</span>
                              </div>
                            ) : (
                              <span className="text-desc hover:text-[var(--primary)]">
                                Click to select
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!aHook.loading && aHook.hasMore && (
                    <div className="w-full flex justify-center py-3">
                      <FButton
                        size="sm"
                        onClick={() => aHook.loadMore()}
                        disabled={aHook.loadingMore}
                      >
                        {aHook.loadingMore ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Load more"
                        )}
                      </FButton>
                    </div>
                  )}
                </div>
              </div>

              {/* 433B list */}
              <div>
                <h3 className="font-semibold mb-3">Form 433B — Business</h3>
                <div className="bg-white border border-gray-100 shadow-sm h-72 overflow-auto p-2">
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
                          onClick={() =>
                            setSelectedB(selectedB === c._id ? null : c._id)
                          }
                          aria-pressed={selectedB === c._id}
                          className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.01] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                            selectedB === c._id
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                              : "border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{c.title}</p>
                            <p
                              className={`text-xs ${
                                selectedB === c._id
                                  ? "text-white/90"
                                  : "text-desc"
                              }`}
                            >
                              {formatDate(c.createdAt)}
                            </p>
                          </div>
                          <div className="text-sm">
                            {selectedB === c._id ? (
                              <div className="flex items-center gap-1 text-white">
                                <Check className="h-5 w-5" />
                                <span className="text-xs">Selected</span>
                              </div>
                            ) : (
                              <span className="text-desc hover:text-[var(--primary)]">
                                Click to select
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!bHook.loading && bHook.hasMore && (
                    <div className="w-full flex justify-center py-3">
                      <FButton
                        size="sm"
                        onClick={() => bHook.loadMore()}
                        disabled={bHook.loadingMore}
                      >
                        {bHook.loadingMore ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Load more"
                        )}
                      </FButton>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details below on large screens */}
            <div className="mt-6">
              <div className="bg-white border border-gray-100 shadow-sm p-4">
                <h3 className="font-semibold mb-3">Application Details</h3>
                <label className="block text-sm font-medium mb-1">Title</label>
                <FInput
                  value={title}
                  onChange={(e) => setTitle((e as any).target.value)}
                  placeholder="Enter application title"
                />

                <div className="mt-4">
                  <label className="inline-flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-3"
                      checked={usedPreQualifierOrIOLA}
                      onChange={(e) =>
                        setUsedPreQualifierOrIOLA(e.target.checked)
                      }
                    />
                    <div className="text-sm text-desc">
                      I used the Pre-Qualifier tool or the Individual Online
                      Account eligibility (IOLA) check prior to filling out this
                      form.
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex gap-4">
                  <FButton onClick={() => setMode("choice")} variant="outline">
                    Back
                  </FButton>
                  <FButton
                    className="flex-1"
                    onClick={handleStart}
                    disabled={!canSubmit || submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" /> Creating...
                      </span>
                    ) : (
                      "Start Form 656"
                    )}
                  </FButton>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartForm656;
