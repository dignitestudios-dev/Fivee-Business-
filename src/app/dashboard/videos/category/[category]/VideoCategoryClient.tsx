"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/services";
import VideosSlider from "@/components/videos/VideosSlider";

interface Props {
  category: string;
}

const VideoCategoryClient: React.FC<Props> = ({ category }) => {
  // ensure we work with a decoded category value
  let decodedCategory = category || "";
  try {
    decodedCategory = decodeURIComponent(decodedCategory);
  } catch (e) {
    // ignore
  }
  
  const [videos, setVideos] = useState<any[]>([]);
  console.log("videos: ",videos)
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // keep a ref to selected so we don't need to include it in load's deps
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await api.getVideos(p, 10, decodedCategory);
        const list = res.data?.video || [];
        if (p === 1) setVideos(list);
        else setVideos((s) => [...s, ...list]);
        setHasMore((res.data?.page ?? p) < (res.data?.totalPages ?? 1));
        // only set selected if nothing selected yet
        if (!selectedRef.current && list.length > 0) setSelected(list[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [decodedCategory]
  );

  useEffect(() => {
    setVideos([]);
    setPage(1);
    load(1);
  }, [category, load]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (page === 1) return;
    load(page);
  }, [page, load]);

  return (
    <div className="flex justify-center flex-1 overflow-y-auto">
      <div className="max-w-[1280px] w-full h-fit m-10 space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 rounded-xl overflow-hidden bg-[var(--primary)]">
            {selected ? (
              <video key={selected._id} className="w-full h-[440px] object-cover" controls poster={selected.poster}>
                <source src={selected.url} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-[440px] bg-gray-200 animate-pulse" />
            )}

            <div className="text-xl p-3 text-white font-semibold">{selected?.title || category}</div>
          </div>

          <div className="col-span-1 rounded-xl bg-[#E7E8E9] h-fit p-3">
            <p className="text-xl text-black mb-5 font-medium">{category}</p>
            <div className="space-y-3">
              {videos.map((v) => (
                <div key={v._id} className="flex gap-3 items-center cursor-pointer" onClick={() => setSelected(v)}>
                  <video className="w-[200px] h-[128px] rounded-xl" poster={v.poster}>
                    <source src={v.url} type="video/mp4" />
                  </video>
                  <p className="text-sm font-semibold text-black">{v.title}</p>
                </div>
              ))}
              {loading && <div className="py-6">Loading...</div>}
              <div ref={sentinelRef} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">All {category} videos</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {videos.map((v) => (
              <div key={v._id} className="bg-white rounded shadow p-3 cursor-pointer" onClick={() => setSelected(v)}>
                <div className="w-full h-40 bg-gray-100 overflow-hidden rounded">
                  <video className="w-full h-full object-cover" poster={v.poster}>
                    <source src={v.url} type="video/mp4" />
                  </video>
                </div>
                <div className="mt-2 font-semibold">{v.title}</div>
              </div>
            ))}
          </div>
          {loading && <div className="py-6">Loading more...</div>}
        </div>
      </div>
    </div>
  );
};

export default VideoCategoryClient;
