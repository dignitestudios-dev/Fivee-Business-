import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { set433aCases } from "@/lib/features/formsSlice";

const useUser433aCases = (
  initialPage = 1,
  limit = 5,
  filter: FormsCasesFilter = "all"
) => {
  const dispatch = useAppDispatch();
  const existingCases = useAppSelector((s) => s.forms.form433a) || [];
  const existingCasesRef = useRef<FormCase[]>(existingCases);

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
        const res = await api.getUserForm433ACases(p, limit, filter);

        // response data may be either an array or an object with `cases` key
        const cases: FormCase[] = Array.isArray(res?.data)
          ? res.data
          : res?.data?.cases || [];

        // determine hasMore
        setHasMore(cases.length === limit);

        // save to redux - append or replace
        if (append) {
          const merged = [...(existingCasesRef.current || []), ...cases];
          dispatch(set433aCases(merged));
        } else {
          dispatch(set433aCases(cases));
        }

        return cases;
      } catch (err: any) {
        const msg = err?.message || "Failed to load cases";
        setError(msg);
        // toast.error(msg);
        console.log(msg);
        return null;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, initialPage, limit]
  );

  useEffect(() => {
    // initial load
    fetchCases(initialPage, false);
    setPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCases]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return null;
    const next = page + 1;
    setPage(next);
    return fetchCases(next, true);
  }, [fetchCases, hasMore, page]);

  const refetch = useCallback(() => {
    setPage(initialPage);
    return fetchCases(initialPage, false);
  }, [fetchCases, initialPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    dispatch(set433aCases([]));
  }, [dispatch, initialPage]);

  return {
    loading,
    loadingMore,
    error,
    refetch,
    loadMore,
    reset,
    hasMore,
    page,
  } as const;
};

export default useUser433aCases;
