"use client";
import React from "react";
import VideosSlider from "@/components/videos/VideosSlider";
import useVideos from "@/hooks/videos/useVideos";
import Link from "next/link";

const Videos = () => {
  const {
    categories,
    categoryVideos,
    latestVideos,
    selectedVideo,
    loading,
    error,
    playVideo,
  } = useVideos();

  return (
    <div className="flex justify-center flex-1 overflow-y-auto">
      <div className="max-w-[1280px] w-full h-fit m-10 space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 rounded-xl overflow-hidden bg-[var(--primary)]">
            {selectedVideo ? (
              <video
                key={selectedVideo._id}
                className="w-full h-[440px] object-cover"
                controls
                autoPlay
                poster={selectedVideo.poster}
              >
                <source src={selectedVideo.url} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-[440px] bg-gray-200 animate-pulse" />
            )}

            <div className="text-xl p-3 text-white font-semibold">
              {selectedVideo?.title || "Loading..."}
            </div>
          </div>

          <div className="col-span-1 rounded-xl bg-[#E7E8E9] h-fit p-3">
            <p className="text-xl text-black mb-5 font-medium">Latest Videos</p>

            <div className="space-y-5">
              {loading && latestVideos.length === 0
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="w-[200px] h-[128px] rounded-xl bg-gray-200 animate-pulse" />
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                : latestVideos.map((v) => (
                    <div
                      key={v._id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => playVideo(v)}
                    >
                      <video
                        className="w-[200px] h-[128px] rounded-xl"
                        poster={v.poster}
                      >
                        <source src={v.url} type="video/mp4" />
                      </video>

                      <p className="text-sm font-semibold text-black">
                        {v.title}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Category sliders */}
        {categories.map((cat) => (
          <div key={cat} className="space-y-3">
            <VideosSlider
              title={cat}
              videos={categoryVideos[cat] || []}
              loading={
                loading && !(categoryVideos[cat] && categoryVideos[cat].length)
              }
              onVideoClick={playVideo}
              viewAllHref={`/dashboard/videos/category/${cat}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
