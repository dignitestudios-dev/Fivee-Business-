import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import api from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { set656Cases, set656Pagination } from "@/lib/features/formsSlice";

const useUser656Cases = (initialPage = 1, limit = 10) => {
  const dispatch = useAppDispatch();
  const existingCases = useAppSelector((s) => s.forms.form656) || [];
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
        const res = await api.getUserForm656Cases(p, limit);

        // response structure contains data.cases and pagination
        const cases: FormCase[] = Array.isArray(res?.data)
          ? res.data
          : res?.data?.cases || [];

        // pagination info may be present
        const pageFromRes = res?.data?.page ?? p;
        const limitFromRes = res?.data?.limit ?? limit;
        const total = res?.data?.total ?? cases.length;
        const totalPages = res?.data?.totalPages ?? Math.ceil(total / limitFromRes);

        dispatch(set656Pagination({ page: pageFromRes, limit: limitFromRes, total, totalPages }));

        setHasMore(pageFromRes < totalPages);

        if (append) {
          const merged = [...(existingCasesRef.current || []), ...cases];
          dispatch(set656Cases(merged));
        } else {
          dispatch(set656Cases(cases));
        }

        return cases;
      } catch (err: any) {
        const msg = err?.message || "Failed to load cases";
        setError(msg);
        toast.error(msg);
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
    // do not set page until fetch succeeds to avoid inconsistent state
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

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    dispatch(set656Cases([]));
    dispatch(set656Pagination(null));
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

export default useUser656Cases;
