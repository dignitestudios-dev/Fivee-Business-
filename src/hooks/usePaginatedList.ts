"use client";

import { useEffect, useRef, useState } from "react";

interface PageResult<T> {
  items: T[];
  total: number;
  totalPages: number;
}

/**
 * Page-by-page list loading with local state. The dashboard cards use the
 * shared Redux lists; these "view all" pages keep their own state so a page of
 * 10 never leaks into the 5-item cards on the home screen.
 */
const usePaginatedList = <T>(
  fetchPage: (page: number, limit: number) => Promise<PageResult<T>>,
  limit = 10
) => {
  // Latest fetcher without making the effect re-run on every render
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PageResult<T>>({
    items: [],
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ignore a slow response for a page the user has already left
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRef
      .current(page, limit)
      .then((next) => {
        if (!cancelled) setResult(next);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message || "Failed to load the list");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { ...result, page, setPage, loading, error };
};

export default usePaginatedList;
