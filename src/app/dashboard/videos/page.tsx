import VideosSlider from "@/components/videos/VideosSlider";

const Videos = () => {
  const videos = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex justify-center flex-1 overflow-y-auto">
      <div className="max-w-[1280px] w-full h-fit m-10 space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 rounded-xl overflow-hidden bg-[var(--primary)]">
            <video
              className="w-full h-[440px] object-cover"
              poster="https://media.istockphoto.com/id/161760094/photo/us-tax-form-1040.jpg?s=612x612&w=0&k=20&c=wkGSA177rMLOEUA0FmVw0OHLEnoUZvW-zkk-KmAi9ao="
            >
              <source src="" type="video/mp4" />
            </video>
            <div className="text-xl p-3 text-white font-semibold">
              A Step-by-Step Guide to E-Filing
            </div>
          </div>

          <div className="col-span-1 rounded-xl bg-[#E7E8E9] h-fit p-3">
            <p className="text-xl text-black mb-5 font-medium">Latest Videos</p>

            <div className="space-y-5">
              <div className="flex gap-3 items-center">
                <video
                  className="w-[200px] h-[128px] rounded-xl"
                  poster="https://media.istockphoto.com/id/161760094/photo/us-tax-form-1040.jpg?s=612x612&w=0&k=20&c=wkGSA177rMLOEUA0FmVw0OHLEnoUZvW-zkk-KmAi9ao="
                >
                  <source src="" type="video/mp4" />
                </video>

                <p className="text-sm font-semibold text-black">
                  A Step-by-Step Guide to E-Filing
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <video
                  className="w-[200px] h-[128px] rounded-xl"
                  poster="https://media.istockphoto.com/id/161760094/photo/us-tax-form-1040.jpg?s=612x612&w=0&k=20&c=wkGSA177rMLOEUA0FmVw0OHLEnoUZvW-zkk-KmAi9ao="
                >
                  <source src="" type="video/mp4" />
                </video>

                <p className="text-sm font-semibold text-black">
                  A Step-by-Step Guide to E-Filing
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <video
                  className="w-[200px] h-[128px] rounded-xl"
                  poster="https://media.istockphoto.com/id/161760094/photo/us-tax-form-1040.jpg?s=612x612&w=0&k=20&c=wkGSA177rMLOEUA0FmVw0OHLEnoUZvW-zkk-KmAi9ao="
                >
                  <source src="" type="video/mp4" />
                </video>

                <p className="text-sm font-semibold text-black">
                  A Step-by-Step Guide to E-Filing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Videos sliders */}
        <VideosSlider title="Getting Started" videos={videos} />

        <VideosSlider title="For the Self-Employed" videos={videos} />

        <VideosSlider title="For the Business Owner" videos={videos} />
      </div>
    </div>
  );
};

export default Videos;
