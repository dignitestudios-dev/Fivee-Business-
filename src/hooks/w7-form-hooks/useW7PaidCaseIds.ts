"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/services";

const PAGE_SIZE = 100; // the API caps limit at 100
const MAX_PAGES = 20;

/**
 * The ids of the user's paid W-7 cases. A case row carries no payment flag, so
 * the list asks the API for the paid subset once and checks membership.
 *
 * Fails closed: if the request errors, nothing is treated as paid, so the UI
 * never offers a download it cannot be sure was paid for. The download hook
 * re-checks payment itself regardless.
 */
const useW7PaidCaseIds = () => {
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const ids = new Set<string>();
      let page = 1;
      let totalPages = 1;

      do {
        const res = await api.getUserFormW7Cases(
          page,
          PAGE_SIZE,
          "completedAndPaymentSucceeded"
        );
        (res?.data?.cases ?? []).forEach((c) => ids.add(c._id));
        totalPages = res?.data?.totalPages ?? 1;
        page += 1;
      } while (page <= totalPages && page <= MAX_PAGES);

      setPaidIds(ids);
    } catch (error) {
      console.error("Error loading paid W-7 cases:", error);
      setPaidIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { paidIds, loading, refetch };
};

export default useW7PaidCaseIds;
