import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { set433bCases, set433bPagination } from "@/lib/features/formsSlice";

const useUser433bCases = (
  initialPage = 1,
  limit = 50,
  filter: FormsCasesFilter = "all"
) => {
  const dispatch = useAppDispatch();
  const existingCases = useAppSelector((s) => s.forms.form433b) || [];
  const pagination = useAppSelector((s) => s.forms.form433bPagination);
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
        const res = await api.getUserForm433BCases(p, limit, filter);
        const cases: FormCase[] = Array.isArray(res?.data)
          ? res.data
          : res?.data?.cases || [];

        setHasMore(cases.length === limit);

        if (append) {
          const merged = [...(existingCasesRef.current || []), ...cases];
          dispatch(set433bCases(merged));
        } else {
          dispatch(set433bCases(cases));
        }

        // Set pagination if available
        if (res?.data?.pagination) {
          dispatch(set433bPagination(res.data.pagination));
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
    dispatch(set433bCases([]));
    dispatch(set433bPagination(null));
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
    pagination,
  } as const;
};

export default useUser433bCases;
