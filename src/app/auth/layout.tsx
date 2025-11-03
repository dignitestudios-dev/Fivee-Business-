import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 p-4 sm:p-5 overflow-y-auto">
      <div className="overflow-y-auto overflow-x-hidden hidden-scrollbar">
        <div className="min-h-full flex justify-center items-center">
          <div className="w-full max-w-[480px] px-2 sm:px-0">{children}</div>
        </div>
      </div>
      <div
        className="relative h-64 md:h-full md:block hidden rounded-3xl bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(/images/auth.webp)`,
        }}
      >
        <div className="absolute z-10 top-0 left-0 rounded-3xl h-full w-full bg-gradient-to-t from-[var(--primary)]/50" />

        <div className="absolute z-20 bottom-0 left-0 p-4 sm:p-8 text-white">
          <h1 className="text-4xl sm:text-6xl font-bold">
            Take Control. <br /> Find Relief.
          </h1>

          <p className="text-white text-base sm:text-lg mt-3">
            Easily apply for IRS tax relief through our secure, guided platform.
            Automated tools, expert support, and stress-free resolution—all in
            one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default layout;
