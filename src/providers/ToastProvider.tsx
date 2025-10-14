"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: "",
        duration: 2000,
        removeDelay: 5000,
      }}
    />
  );
}
