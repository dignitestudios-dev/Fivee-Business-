"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import api from "@/lib/services";
import { useAppSelector } from "@/lib/hooks";
import { formatDate } from "@/utils/helper";
import FormLoader from "@/components/global/FormLoader";
import FButton from "@/components/ui/FButton";
import FInput from "@/components/ui/FInput";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import useUserW7Cases from "@/hooks/w7-form-hooks/useUserW7Cases";
import { TEXT_RE, W7_LIMITS } from "@/lib/validation/formw7/rules";

// The API allows 120 characters; titles must also be unique per user (the API checks that)
const TITLE_MAX_LENGTH = W7_LIMITS.title;

const StartFormW7 = () => {
  const router = useRouter();
  const { showError, showSuccess } = useGlobalPopup();

  // Only a paid case can be duplicated, so the clone list is filtered server-side
  const paidCasesHook = useUserW7Cases(1, 50, "completedAndPaymentSucceeded");
  const paidCases = useAppSelector((s) => s.forms.formW7) || [];

  const [mode, setMode] = useState<"choice" | "create" | "clone">("choice");
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validateTitle = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("A title is required");
      return false;
    }
    if (trimmed.length > TITLE_MAX_LENGTH) {
      setTitleError(`The title cannot exceed ${TITLE_MAX_LENGTH} characters`);
      return false;
    }
    if (trimmed.length < 3) {
      setTitleError("The title must be at least 3 characters");
      return false;
    }
    if (!TEXT_RE.test(trimmed)) {
      setTitleError(
        "The title contains characters that are not allowed. Use letters, numbers, and common punctuation only"
      );
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleStart = async () => {
    if (!validateTitle()) return;
    if (mode === "clone" && !selectedCloneId) {
      return showError("Select a paid form to duplicate", "Error");
    }

    setSubmitting(true);
    try {
      const payload = { title: title.trim() };
      const response =
        mode === "clone" && selectedCloneId
          ? await api.duplicateFormW7(selectedCloneId, payload)
          : await api.startFormW7(payload);

      const caseId = response?.data?.caseId;
      if (!caseId) throw new Error("The server did not return a case id");

      showSuccess(
        mode === "clone" ? "Form W-7 duplicated" : "Form W-7 created",
        "Success"
      );
      router.push(`/dashboard/form-w7?caseId=${caseId}`);
    } catch (error: any) {
      showError(error?.message || "Failed to start the form", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Start Form W-7</h2>
            <p className="text-sm text-desc">
              Apply for or renew an IRS Individual Taxpayer Identification
              Number.
            </p>
          </div>
        </div>

        {mode === "choice" && (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Choose an option</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <FButton onClick={() => setMode("create")} className="flex-1">
                Create New
              </FButton>
              <FButton
                onClick={() => setMode("clone")}
                variant="outline"
                className="flex-1"
              >
                Duplicate a Paid Form
              </FButton>
            </div>
            <p className="text-xs text-desc mt-4">
              Duplicating copies the answers from a form you have already paid
              for into a new case you can edit.
            </p>
          </div>
        )}

        {(mode === "create" || mode === "clone") && (
          <>
            {mode === "clone" && (
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-semibold mb-3">Select a Form W-7 to copy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paidCasesHook.loading && paidCases.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center py-6">
                      <FormLoader />
                    </div>
                  ) : paidCases.length === 0 ? (
                    <p className="col-span-full text-desc p-4">
                      No paid Form W-7 cases are available to duplicate.
                    </p>
                  ) : (
                    paidCases.map((c) => (
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
                          <Check className="h-5 w-5 text-white" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {!paidCasesHook.loading && paidCasesHook.hasMore && (
                  <div className="w-full flex justify-center py-3">
                    <FButton
                      size="sm"
                      onClick={() => paidCasesHook.loadMore()}
                      disabled={paidCasesHook.loadingMore}
                    >
                      {paidCasesHook.loadingMore ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        "Load more"
                      )}
                    </FButton>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold mb-3">Application Details</h3>
              <FInput
                label="Title"
                value={title}
                maxLength={TITLE_MAX_LENGTH}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (titleError) setTitleError("");
                }}
                placeholder="For example: John Smith ITIN Application 2026"
                error={titleError}
                helperText="Titles must be unique across your Form W-7 cases."
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <FButton
                  onClick={() => {
                    setMode("choice");
                    setSelectedCloneId(null);
                  }}
                  variant="outline"
                >
                  Back
                </FButton>
                <FButton
                  className="flex-1"
                  onClick={handleStart}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      {mode === "clone" ? "Duplicating..." : "Creating..."}
                    </span>
                  ) : mode === "clone" ? (
                    "Duplicate Form W-7"
                  ) : (
                    "Start Form W-7"
                  )}
                </FButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartFormW7;
