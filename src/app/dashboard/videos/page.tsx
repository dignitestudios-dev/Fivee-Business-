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
    <>
      {!loading && latestVideos.length === 0 ? (
        <p className="p-4 sm:p-6 md:p-10">No Videos Available Yet</p>
      ) : (
        <div className="flex justify-center flex-1 overflow-y-auto">
          <div className="w-full h-fit p-4 sm:p-6 md:p-10 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 rounded-xl overflow-hidden bg-[var(--primary)]">
                {selectedVideo ? (
                  <video
                    key={selectedVideo._id}
                    className="w-full h-[300px] sm:h-[440px] object-cover"
                    controls
                    autoPlay
                    poster={selectedVideo.poster}
                  >
                    <source src={selectedVideo.url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-[300px] sm:h-[440px] bg-gray-200 animate-pulse" />
                )}

                <div className="text-lg sm:text-xl p-3 text-white font-semibold">
                  {selectedVideo?.title || "Loading..."}
                </div>
              </div>

              <div className="md:col-span-1 rounded-xl bg-[#E7E8E9] h-fit p-3">
                <p className="text-lg sm:text-xl text-black mb-5 font-medium">
                  Latest Videos
                </p>

                <div className="space-y-5">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-3 items-center"
                      >
                        <div className="w-full sm:w-[200px] h-[200px] sm:h-[128px] rounded-xl bg-gray-200 animate-pulse" />
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))
                  ) : latestVideos.length === 0 ? (
                    <p>No Videos Upload Yet</p>
                  ) : (
                    latestVideos.map((v) => (
                      <div
                        key={v._id}
                        className="flex flex-col xl:flex-row xl:gap-3 xl:justify-start xl:items-center cursor-pointer"
                        onClick={() => playVideo(v)}
                      >
                        <video
                          className="w-full sm:w-[200px] h-[200px] sm:h-[128px] rounded-xl"
                          poster={v.poster}
                        >
                          <source src={v.url} type="video/mp4" />
                        </video>

                        <p className="text-sm font-semibold text-black">
                          {v.title}
                        </p>
                      </div>
                    ))
                  )}
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
                    loading &&
                    !(categoryVideos[cat] && categoryVideos[cat].length)
                  }
                  onVideoClick={playVideo}
                  viewAllHref={`/dashboard/videos/category/${cat}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Videos;
