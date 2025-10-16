"use client";

import React, { ReactNode } from "react";

interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
}

export function ScrollArea({ children, className = "" }: ScrollAreaProps) {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${className}`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db #f3f4f6",
      }}
    >
      {children}
    </div>
  );
}
