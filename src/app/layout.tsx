import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import StoreProvider from "@/providers/StoreProvider";
import AuthGuard from "@/components/global/AuthGuard";
import GlobalPopup from "@/components/global/GlobalPopup";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "Fivee Business",
  description: "Fivee Business",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {/* Global toast provider (must be inside <body> to avoid invalid HTML nesting) */}
        <ToastProvider />

        <StoreProvider>
          <GlobalPopup />
          <AuthGuard>{children}</AuthGuard>
        </StoreProvider>

        <RegisterSW />
      </body>
    </html>
  );
}
