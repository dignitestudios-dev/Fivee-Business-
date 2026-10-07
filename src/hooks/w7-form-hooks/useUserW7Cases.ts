"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setW7Cases, setW7Pagination } from "@/lib/features/formsSlice";

const useUserW7Cases = (
  initialPage = 1,
  limit = 10,
  filter: W7CasesFilter = "all"
) => {
  const dispatch = useAppDispatch();
  const existingCases = useAppSelector((s) => s.forms.formW7) || [];
  const existingCasesRef = useRef<FormW7Case[]>(existingCases);

  useEffect(() => {
    existingCasesRef.current = existingCases;
  }, [existingCases]);

  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCases = useCallback(
    async (p: number = initialPage, append = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        setError(null);
        const res = await api.getUserFormW7Cases(p, limit, filter);

        const cases: FormW7Case[] = Array.isArray(res?.data)
          ? (res.data as unknown as FormW7Case[])
          : res?.data?.cases || [];

        const pageFromRes = res?.data?.page ?? p;
        const limitFromRes = res?.data?.limit ?? limit;
        const total = res?.data?.total ?? cases.length;
        const totalPages =
          res?.data?.totalPages ?? Math.ceil(total / limitFromRes);

        dispatch(
          setW7Pagination({
            page: pageFromRes,
            limit: limitFromRes,
            total,
            totalPages,
          })
        );
        setHasMore(pageFromRes < totalPages);

        if (append) {
          dispatch(setW7Cases([...(existingCasesRef.current || []), ...cases]));
        } else {
          dispatch(setW7Cases(cases));
        }

        return cases;
      } catch (err: any) {
        const msg = err?.message || "Failed to load Form W-7 cases";
        setError(msg);
        console.log(msg);
        return null;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, initialPage, limit, filter]
  );

  useEffect(() => {
    fetchCases(initialPage, false);
    setPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCases]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return null;
    const next = page + 1;
    const res = await fetchCases(next, true);
    if (res) {
      setPage(next);
      return res;
    }
    return null;
  }, [fetchCases, hasMore, page]);

  const refetch = useCallback(() => {
    setPage(initialPage);
    return fetchCases(initialPage, false);
  }, [fetchCases, initialPage]);

  return {
    loading,
    loadingMore,
    error,
    refetch,
    loadMore,
    hasMore,
    page,
  } as const;
};

export default useUserW7Cases;
