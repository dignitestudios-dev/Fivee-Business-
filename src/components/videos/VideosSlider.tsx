"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideosSliderProps {
  title: string;
  videos: number[];
}

const VideosSlider: React.FC<VideosSliderProps> = ({ title, videos }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold capitalize">{title}</h2>

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
            delay: 1000,
          }}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            // Type assertion to safely access navigation params
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
          {videos?.map((video, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg flex flex-col gap-3 items-center">
                <video
                  className="w-[300px] h-[160px] rounded-lg object-cover"
                  poster="https://media.istockphoto.com/id/161760094/photo/us-tax-form-1040.jpg?s=612x612&w=0&k=20&c=wkGSA177rMLOEUA0FmVw0OHLEnoUZvW-zkk-KmAi9ao="
                >
                  <source src="" type="video/mp4" />
                </video>

                <p className="text-sm font-semibold text-black p-3 pt-0">
                  A Step-by-Step Guide to E-Filing
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
