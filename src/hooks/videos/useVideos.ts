import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/services";

export interface Video {
  _id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const useVideos = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryVideos, setCategoryVideos] = useState<Record<string, Video[]>>({});
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const catRes = await api.getVideoCategories();
      const cats: string[] = catRes.data?.categories || [];
      setCategories(cats);

      // Fetch 5 videos per category
      const perCategory = await Promise.all(
        cats.map(async (cat) => {
          try {
            const videosRes = await api.getVideos(1, 5, cat);
            const vids: Video[] = videosRes.data?.video || [];
            return { cat, vids };
          } catch (e) {
            return { cat, vids: [] };
          }
        })
      );

      const map: Record<string, Video[]> = {};
      perCategory.forEach((p) => (map[p.cat] = p.vids));
      setCategoryVideos(map);

      // Fetch latest 3 videos (no category)
      try {
        const latestRes = await api.getVideos(1, 3, "");
        const latest: Video[] = latestRes.data?.video || [];
        setLatestVideos(latest);
        if (latest.length > 0) setSelectedVideo(latest[0]);
      } catch (e) {
        // ignore
      }

      // after initial load, kick off thumbnail generation in separate effects

      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // cache for generated posters to avoid repeated work
  const postersRef = useRef<Record<string, string>>({});

  const generateThumbnail = async (videoUrl: string) => {
    return new Promise<string | null>((resolve) => {
      try {
        const v = document.createElement("video");
        v.crossOrigin = "anonymous";
        v.muted = true;
        v.preload = "metadata";
        v.src = videoUrl;

        const cleanup = () => {
          v.pause();
          v.src = "";
          // @ts-ignore
          v.removeAttribute && v.removeAttribute("src");
        };

        const onError = () => {
          cleanup();
          resolve(null);
        };

        v.addEventListener("loadeddata", function () {
          const seekTo = Math.min(1, Math.max(0, (v.duration && v.duration / 2) || 0));
          const trySeek = () => {
            try {
              v.currentTime = seekTo;
            } catch (e) {
              drawFrame();
            }
          };

          const drawFrame = () => {
            try {
              const canvas = document.createElement("canvas");
              const w = 300;
              const h = 160;
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(v, 0, 0, w, h);
                const data = canvas.toDataURL("image/jpeg", 0.7);
                cleanup();
                resolve(data);
                return;
              }
            } catch (e) {
              // ignore
            }
            cleanup();
            resolve(null);
          };

          const onSeeked = () => {
            drawFrame();
            v.removeEventListener("seeked", onSeeked);
          };

          v.addEventListener("seeked", onSeeked);
          trySeek();
        });

        v.addEventListener("error", onError);

        setTimeout(() => {
          resolve(null);
        }, 5000);
      } catch (e) {
        resolve(null);
      }
    });
  };

  // generate posters for latestVideos
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      for (const v of latestVideos) {
        if (!v) continue;
        if (v.poster) continue;
        if (postersRef.current[v._id]) {
          // attach cached
          if (!mounted) return;
          setLatestVideos((prev) => prev.map((p) => (p._id === v._id ? { ...p, poster: postersRef.current[v._id] } : p)));
          continue;
        }
        try {
          const thumb = await generateThumbnail(v.url);
          if (!mounted) return;
          if (thumb) {
            postersRef.current[v._id] = thumb;
            setLatestVideos((prev) => prev.map((p) => (p._id === v._id ? { ...p, poster: thumb } : p)));
          }
        } catch (e) {
          // ignore
        }
      }
    };
    if (latestVideos && latestVideos.length) run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVideos]);

  // if selectedVideo exists and latestVideos updated with a poster, sync selectedVideo
  useEffect(() => {
    if (!selectedVideo) return;
    const updated = latestVideos.find((v) => v._id === selectedVideo._id && v.poster);
    if (updated && updated.poster && selectedVideo.poster !== updated.poster) {
      setSelectedVideo((s) => (s ? { ...s, poster: updated.poster } : s));
    }
  }, [latestVideos, selectedVideo]);

  // generate posters for categoryVideos
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const entries = Object.entries(categoryVideos || {});
      for (const [cat, arr] of entries) {
        for (const v of arr) {
          if (!v) continue;
          if (v.poster) continue;
          if (postersRef.current[v._id]) {
            if (!mounted) return;
            setCategoryVideos((prev) => ({ ...prev, [cat]: prev[cat].map((p) => (p._id === v._id ? { ...p, poster: postersRef.current[v._id] } : p)) }));
            continue;
          }
          try {
            const thumb = await generateThumbnail(v.url);
            if (!mounted) return;
            if (thumb) {
              postersRef.current[v._id] = thumb;
              setCategoryVideos((prev) => ({ ...prev, [cat]: prev[cat].map((p) => (p._id === v._id ? { ...p, poster: thumb } : p)) }));
            }
          } catch (e) {
            // ignore
          }
        }
      }
    };
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryVideos]);

  const fetchVideosByCategory = useCallback(async (page = 1, limit = 10, category = "") => {
    try {
      const res = await api.getVideos(page, limit, category);
      const vids: Video[] = res.data?.video || [];
      return { videos: vids, page: res.data?.page ?? page, total: res.data?.total ?? vids.length };
    } catch (err: any) {
      throw new Error(err?.message || "Failed to fetch videos for category");
    }
  }, []);

  const playVideo = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  return {
    categories,
    categoryVideos,
    latestVideos,
    selectedVideo,
    loading,
    error,
    fetchVideosByCategory,
    playVideo,
    reload: loadInitial,
  } as const;
};

export default useVideos;
