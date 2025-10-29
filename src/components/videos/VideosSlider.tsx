"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Video {
  _id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
  poster?: string;
  [key: string]: any;
}

interface VideosSliderProps {
  title: string;
  videos: Video[];
  loading?: boolean;
  onVideoClick?: (video: Video) => void;
  viewAllHref?: string;
}

const VideosSlider: React.FC<VideosSliderProps> = ({
  title,
  videos,
  loading = false,
  onVideoClick,
  viewAllHref,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [generatedPosters, setGeneratedPosters] = useState<
    Record<string, string>
  >({});

  // Try to capture a thumbnail from the video URL (if video.poster not provided)
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
          // seek to 0.5s or 0
          const seekTo = Math.min(
            1,
            Math.max(0, (v.duration && v.duration / 2) || 0)
          );
          const trySeek = () => {
            try {
              v.currentTime = seekTo;
            } catch (e) {
              // some browsers may throw if unable to seek
              // fallback to drawing whatever frame is available
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

        // Fallback timeout
        setTimeout(() => {
          resolve(null);
        }, 5000);
      } catch (e) {
        resolve(null);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const missing =
        videos?.filter((v) => v && !v.poster && !generatedPosters[v._id]) || [];
      for (const v of missing) {
        try {
          const thumb = await generateThumbnail(v.url);
          if (!mounted) return;
          if (thumb) setGeneratedPosters((s) => ({ ...s, [v._id]: thumb }));
        } catch (e) {
          // ignore
        }
      }
    };
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold capitalize">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-primary">
            View all
          </Link>
        )}
      </div>

      <div className="relative z-20 mt-3">
        {/* Custom Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute sm:-left-10 -left-6 top-1/2 text-gray-600 -translate-y-1/2 z-10 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          ref={nextRef}
          className="absolute sm:-right-10 -right-6 top-1/2 text-gray-600 -translate-y-1/2 z-10 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
          }}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation === "object"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          breakpoints={{
            560: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
          }}
          className="px-12"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white rounded-lg flex flex-col gap-3 items-center p-3">
                    <div className="w-[300px] h-[160px] rounded-lg bg-gray-200 animate-pulse" />
                    <div className="w-[180px] h-4 bg-gray-200 rounded mt-3 animate-pulse" />
                  </div>
                </SwiperSlide>
              ))
            : videos?.map((video) => (
                <SwiperSlide key={video._id}>
                  <div className="bg-white rounded-lg flex flex-col gap-3 items-center p-3">
                    <div
                      className="w-[300px] h-[160px] rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => onVideoClick && onVideoClick(video)}
                    >
                    <video
                      className="w-full h-full object-cover"
                      poster={video.poster}
                    >
                      <source src={video.url} type="video/mp4" />
                    </video>
                    </div>

                    <p className="text-sm font-semibold text-black p-3 pt-0 text-center">
                      {video.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default VideosSlider;
